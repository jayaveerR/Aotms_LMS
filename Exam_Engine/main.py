from fastapi import FastAPI, HTTPException, Body
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import redis.asyncio as redis
import os
import json
from datetime import datetime, timezone
from dotenv import load_dotenv
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy import Column, Integer, String, JSON
import structlog
from elasticsearch import Elasticsearch

load_dotenv()

# --- Elasticsearch Direct Log Shipping ---
es_client = None
ELASTIC_URL = os.getenv("ELASTIC_URL")
ELASTIC_API_KEY = os.getenv("ELASTIC_API_KEY")

if ELASTIC_URL and ELASTIC_API_KEY:
    es_client = Elasticsearch(
        ELASTIC_URL,
        api_key=ELASTIC_API_KEY,
    )

def ship_log(level: str, event: str, **kwargs):
    """Ships a structured log entry directly to Elasticsearch."""
    doc = {
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "service": "exam-engine",
        "level": level,
        "event": event,
        **kwargs
    }
    print(f"[{level.upper()}] {event} | {kwargs}")
    if es_client:
        try:
            es_client.index(index="aotms-logs", document=doc)
        except Exception as e:
            print(f"Failed to ship log to Elastic: {e}")

# --- Structlog Setup ---
structlog.configure(
    processors=[
        structlog.processors.JSONRenderer()
    ],
    logger_factory=structlog.PrintLoggerFactory(),
)
logger = structlog.get_logger()

app = FastAPI(title="AOTMS Live Exam Engine")

if es_client:
    ship_log("info", "exam_engine_started", message="Connected to Elastic Cloud")

# --- POSTGRESQL (Supabase) SETUP VIA SQLALCHEMY ---
# We clean the URL from quotes and ensure the async driver is specified
raw_db_url = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:[YOUR-PASSWORD]@db.gcwozkmrdzdcphwyjtuw.supabase.co:5432/postgres")
DATABASE_URL = raw_db_url.strip('\"').strip('\'')

if DATABASE_URL.startswith("postgresql://"):
    DATABASE_URL = DATABASE_URL.replace("postgresql://", "postgresql+asyncpg://", 1)

print(f"DEBUG: SQLAlchemy will use: {DATABASE_URL.split('@')[-1] if '@' in DATABASE_URL else DATABASE_URL}")

engine = create_async_engine(
    DATABASE_URL, 
    echo=False,
    connect_args={"statement_cache_size": 0}
)
AsyncSessionLocal = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)
Base = declarative_base()

# Define the SQLAlchemy Model for permanent storage
class ExamSubmission(Base):
    __tablename__ = "exam_submissions"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(String, index=True)
    exam_id = Column(String, index=True)
    final_state = Column(JSON) # We'll store the whole Redis hash here when they submit

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Update for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Redis Client Instance
redis_client = None

class AnswerSubmission(BaseModel):
    user_id: str
    exam_id: str
    question_id: str
    selected_option: str
    time_remaining_seconds: int

@app.on_event("startup")
async def startup_event():
    global redis_client
    redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0").strip('\"').strip('\'')
    print("Initializing Redis connection to:", redis_url.split('@')[-1] if '@' in redis_url else redis_url)
    
    redis_client = redis.from_url(redis_url, decode_responses=True)
    # Create Postgres Tables via async SQLAlchemy engine
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        print("Connected to Supabase PostgreSQL & Tables synced.")
    except Exception as e:
        print(f"Failed to connect to PostgreSQL: {e}")

    try:
        await redis_client.ping()
        print("Connected to Redis successfully.")
    except Exception as e:
        print(f"Failed to connect to Redis: {e}")

@app.on_event("shutdown")
async def shutdown_event():
    global redis_client
    if redis_client:
        await redis_client.close()

@app.get("/")
def read_root():
    return {"message": "AOTMS Live Exam Engine (FastAPI + Redis) is running!"}

@app.post("/api/exam/submit-answer")
async def submit_answer(submission: AnswerSubmission):
    """
    Highly concurrent endpoint to save a student's answer individually.
    """
    logger.info("answer_submission_received", user_id=submission.user_id, exam_id=submission.exam_id, question_id=submission.question_id)
    ship_log("info", "answer_submission_received", user_id=submission.user_id, exam_id=submission.exam_id, question_id=submission.question_id)
    try:
        # Construct the unique Redis key for this student's exam attempt
        redis_key = f"exam_state:{submission.user_id}:{submission.exam_id}"
        
        await redis_client.hset(
            name=redis_key, 
            key=submission.question_id, 
            value=submission.selected_option
        )
        
        timer_key = f"exam_timer:{submission.user_id}:{submission.exam_id}"
        await redis_client.set(timer_key, submission.time_remaining_seconds)
        
        logger.debug("answer_saved_to_redis", user_id=submission.user_id, exam_id=submission.exam_id)
        return {"status": "success", "message": "Answer saved to Redis cache"}
        
    except Exception as e:
        logger.error("redis_save_failed", user_id=submission.user_id, error=str(e))
        raise HTTPException(status_code=500, detail=f"Redis error: {str(e)}")

@app.get("/api/exam/state/{exam_id}/{user_id}")
async def get_exam_state(exam_id: str, user_id: str):
    """
    Recovers the student's progress if they accidentally refresh or disconnect.
    """
    try:
        redis_key = f"exam_state:{user_id}:{exam_id}"
        timer_key = f"exam_timer:{user_id}:{exam_id}"
        
        # Get all answers recorded in this session so far
        answers = await redis_client.hgetall(redis_key)
        
        # Get the strict remaining time constraint
        time_left = await redis_client.get(timer_key)
        
        return {
            "answers": answers,
            "time_remaining_seconds": int(time_left) if time_left else None
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/exam/finish/{exam_id}/{user_id}")
async def finish_exam(exam_id: str, user_id: str):
    """
    Submits the final exam by pulling from Redis and saving permanently via SQLAlchemy!
    """
    logger.info("exam_finishing", user_id=user_id, exam_id=exam_id)
    ship_log("info", "exam_finishing", user_id=user_id, exam_id=exam_id)
    try:
        redis_key = f"exam_state:{user_id}:{exam_id}"
        
        final_answers = await redis_client.hgetall(redis_key)
        
        if not final_answers:
             logger.warning("exam_finish_failed_no_answers", user_id=user_id, exam_id=exam_id)
             raise HTTPException(status_code=400, detail="No answers found in session to submit")
             
        async with AsyncSessionLocal() as db_session:
            new_submission = ExamSubmission(
                user_id=user_id,
                exam_id=exam_id,
                final_state=final_answers
            )
            
            db_session.add(new_submission)
            await db_session.commit()
            logger.info("exam_saved_to_postgres", user_id=user_id, exam_id=exam_id)
            ship_log("info", "exam_saved_to_postgres", user_id=user_id, exam_id=exam_id)
            
        await redis_client.delete(redis_key)
        await redis_client.delete(f"exam_timer:{user_id}:{exam_id}")
        logger.info("exam_redis_cache_cleared", user_id=user_id, exam_id=exam_id)
            
        return {"status": "success", "message": "Exam permanently recorded in PostgreSQL!"}
        
    except Exception as e:
        logger.error("exam_finish_critical_error", user_id=user_id, error=str(e))
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
