from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
import pandas as pd
import pdfplumber
import io
import os
import structlog
from datetime import datetime, timezone
from dotenv import load_dotenv
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
        "service": "ats-analytics",
        "level": level,
        "event": event,
        **kwargs
    }
    # Always print to console
    print(f"[{level.upper()}] {event} | {kwargs}")
    # Ship to Elastic if connected
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

app = FastAPI(title="AOTMS ATS Analytics Engine")

if es_client:
    ship_log("info", "ats_analytics_started", message="Connected to Elastic Cloud")

# Configure CORS so the React frontend can talk to this service directly
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, change this to your actual frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "AOTMS ATS Analytics Engine is running!"}

@app.post("/api/ats/analyze-resume")
async def analyze_resume(file: UploadFile = File(...)):
    logger.info("received_resume_for_analysis", filename=file.filename)
    ship_log("info", "received_resume_for_analysis", filename=file.filename)
    if not file.filename.endswith('.pdf'):
        logger.warning("invalid_file_format", filename=file.filename)
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")
    
    try:
        # Read the file contents
        content = await file.read()
        pdf_file = io.BytesIO(content)
        
        # Extract text from the PDF using pdfplumber
        extracted_text = ""
        with pdfplumber.open(pdf_file) as pdf:
            for page in pdf.pages:
                text = page.extract_text()
                if text:
                    extracted_text += text + "\n"
        
        if not extracted_text.strip():
            raise HTTPException(status_code=400, detail="Could not extract any text from the PDF.")
            
        # Process the text with robust Regex and pattern matching (Alternative to SpaCy)
        insights = {
            "name_candidates": [],
            "organizations": [],
            "locations": [],
            "skills_and_keywords": []
        }
        
        # Basic parsing using common heuristics since SpaCy fails on Python 3.14
        import re
        
        # Try to find emails
        emails = re.findall(r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', extracted_text)
        if emails:
            insights["name_candidates"].append(f"Email matched applicant: {emails[0]}")
            
        # Target organizations
        known_orgs = ["Google", "Amazon", "Microsoft", "Meta", "Apple", "Netflix"]
        for org in known_orgs:
            if re.search(r'\b' + org + r'\b', extracted_text, re.IGNORECASE):
                insights["organizations"].append(org)
                    
        # Technical skills (this list would come from your Database)
        target_skills = ["python", "javascript", "react", "node", "sql", "aws", "docker", "machine learning", "typescript", "express", "pandas", "fastapi"]
        found_skills = []
        
        text_lower = extracted_text.lower()
        for skill in target_skills:
            if re.search(r'\b' + re.escape(skill) + r'\b', text_lower):
                found_skills.append(skill)
                
        insights["skills_and_keywords"] = found_skills
        
        # Calculate a basic "ATS Match Score" based on found skills
        score_percentage = (len(found_skills) / len(target_skills)) * 100 if target_skills else 0
        
        result = {
            "filename": file.filename,
            "ats_score": round(score_percentage, 1),
            "insights": insights,
            "raw_text_length": len(extracted_text)
        }
        logger.info("resume_analysis_complete", filename=file.filename, score=result["ats_score"])
        ship_log("info", "resume_analysis_complete", filename=file.filename, score=result["ats_score"])
        return result
        
    except Exception as e:
        import traceback
        error_msg = str(e)
        logger.error("resume_analysis_failed", filename=file.filename, error=error_msg, traceback=traceback.format_exc())
        raise HTTPException(status_code=500, detail=f"Error processing resume: {error_msg}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
