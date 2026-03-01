import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  AlertTriangle,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Flag,
  Send,
  Eye,
  RotateCcw,
  Trophy,
  XCircle,
  Zap,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

/* ═══════════════════════════════════════
   TYPES
   ═══════════════════════════════════════ */
interface Question {
  id: string;
  text: string;
  options: string[];
  correct_index?: number;
  points: number;
}

interface ExamConfig {
  id: string;
  title: string;
  duration_minutes: number;
  questions: Question[];
  type: "live" | "mock";
  course_title?: string;
}

type QuestionStatus =
  | "unanswered"
  | "answered"
  | "flagged"
  | "answered-flagged";

/* ═══════════════════════════════════════
   MOCK DATA
   ═══════════════════════════════════════ */
const DEMO_EXAM: ExamConfig = {
  id: "demo",
  title: "FULL_STACK_DOMINANCE_LEVEL_01",
  duration_minutes: 30,
  type: "mock",
  course_title: "Full Stack Web Development",
  questions: [
    {
      id: "q1",
      points: 2,
      text: "Which of the following is NOT a JavaScript data type?",
      options: ["String", "Boolean", "Float", "Symbol"],
      correct_index: 2,
    },
    {
      id: "q2",
      points: 2,
      text: 'What does the CSS property "z-index" control?',
      options: [
        "Font size",
        "Opacity",
        "Stacking order of elements",
        "Animation speed",
      ],
      correct_index: 2,
    },
    {
      id: "q3",
      points: 2,
      text: "Which HTTP method is used to update a resource?",
      options: ["GET", "POST", "PUT", "DELETE"],
      correct_index: 2,
    },
    {
      id: "q4",
      points: 2,
      text: "In React, what hook is used to manage local state?",
      options: ["useEffect", "useRef", "useContext", "useState"],
      correct_index: 3,
    },
    {
      id: "q5",
      points: 2,
      text: "Which SQL clause is used to filter records?",
      options: ["ORDER BY", "GROUP BY", "WHERE", "HAVING"],
      correct_index: 2,
    },
  ],
};

/* ═══════════════════════════════════════
   COUNTDOWN TIMER
   ═══════════════════════════════════════ */
function useCountdown(seconds: number | null, onExpire: () => void) {
  const [remaining, setRemaining] = useState(seconds ?? 0);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (seconds !== null) {
      setRemaining(seconds);
    }
  }, [seconds]);

  useEffect(() => {
    if (seconds === null) return;
    if (remaining <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpire();
      }
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, seconds, onExpire]);

  const pct = seconds ? Math.round((remaining / seconds) * 100) : 0;
  const mins = Math.floor(remaining / 60);
  const secs = remaining % 60;
  const isLow = remaining <= 60;
  const isCritical = remaining <= 30;
  return { remaining, mins, secs, pct, isLow, isCritical };
}

/* ═══════════════════════════════════════
   RESULTS SCREEN
   ═══════════════════════════════════════ */
function ResultsScreen({
  exam,
  answers,
  timeTaken,
}: {
  exam: ExamConfig;
  answers: (number | null)[];
  timeTaken: number;
}) {
  const navigate = useNavigate();
  const correct = exam.questions.filter(
    (q, i) => answers[i] === q.correct_index,
  ).length;
  const total = exam.questions.length;
  const score = exam.questions.reduce(
    (acc, q, i) => acc + (answers[i] === q.correct_index ? q.points : 0),
    0,
  );
  const maxScore = exam.questions.reduce((acc, q) => acc + q.points, 0);
  const pct = Math.round((score / maxScore) * 100);
  const passed = pct >= 60;

  const mins = Math.floor(timeTaken / 60);
  const secs = timeTaken % 60;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

      <motion.div
        className="w-full max-w-2xl relative z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20 }}
      >
        <div className="bg-[#E9E9E9] border-8 border-black p-10 shadow-[20px_20px_0px_0px_#000000] rounded-3xl">
          <div className="text-center mb-10">
            <div
              className={`w-24 h-24 mx-auto mb-8 bg-black text-white border-4 border-black flex items-center justify-center shadow-[6px_6px_0px_0px_#FD5A1A] -rotate-6`}
            >
              {passed ? (
                <Trophy className="w-12 h-12 text-[#FD5A1A]" />
              ) : (
                <XCircle className="w-12 h-12 text-[#FD5A1A]" />
              )}
            </div>

            <h1 className="text-4xl md:text-5xl font-black text-black mb-2 uppercase italic leading-none">
              {passed ? "MISSION_SUCCESS 🎉" : "MISSION_RETRY_REQUIRED"}
            </h1>
            <p className="text-black font-black uppercase tracking-[0.3em] text-[10px] opacity-40 mb-12">
              {exam.title}
            </p>

            <div className="flex items-center justify-center mb-12">
              <div className="relative w-48 h-48 bg-white border-4 border-black rounded-full flex flex-col items-center justify-center shadow-[8px_8px_0px_0px_#0075CF]">
                <div className="text-6xl font-black text-black leading-none">
                  {pct}%
                </div>
                <div className="text-[10px] font-black uppercase tracking-widest opacity-40">
                  ACCURACY_INDEX
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-6 mb-12 uppercase font-black italic">
              <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#0075CF] rounded-3xl">
                <div className="text-xl text-black">
                  {correct}/{total}
                </div>
                <div className="text-[8px] tracking-[0.2em] opacity-40">
                  CORRECT_NODES
                </div>
              </div>
              <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#FD5A1A] rounded-3xl">
                <div className="text-xl text-black">
                  {score}/{maxScore}
                </div>
                <div className="text-[8px] tracking-[0.2em] opacity-40">
                  TOTAL_MARKS
                </div>
              </div>
              <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_black] rounded-3xl">
                <div className="text-xl text-black">
                  {mins}M {secs}S
                </div>
                <div className="text-[8px] tracking-[0.2em] opacity-40">
                  EXECUTION_TIME
                </div>
              </div>
            </div>

            <div className="space-y-4 mb-10 text-left">
              <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-4 border-l-4 border-black pl-4">
                INTEL_REVIEW
              </h3>
              <div className="max-h-60 overflow-y-auto border-4 border-black bg-white rounded-3xl">
                {exam.questions.map((q, i) => {
                  const isCorrect = answers[i] === q.correct_index;
                  return (
                    <div
                      key={q.id}
                      className="p-4 border-b-2 border-black/10 flex items-start gap-4"
                    >
                      <div
                        className={`w-8 h-8 shrink-0 flex items-center justify-center border-2 border-black font-black italic ${isCorrect ? "bg-[#0075CF] text-white" : "bg-[#FD5A1A] text-white"}`}
                      >
                        Q{i + 1}
                      </div>
                      <div className="flex-1">
                        <p className="text-[10px] font-black uppercase tracking-wider text-black mb-1">
                          {q.text}
                        </p>
                        {!isCorrect && (
                          <div className="text-[8px] font-black uppercase tracking-[0.2em] text-[#FD5A1A]">
                            RCVD:{" "}
                            {answers[i] !== null
                              ? q.options[answers[i]!]
                              : "NULL"}{" "}
                            // EXPECTED: {q.options[q.correct_index!]}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-6">
              <Button
                className="flex-1 bg-white text-black border-4 border-black h-14 rounded-3xl font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                onClick={() => navigate("/dashboard/exams")}
              >
                <ChevronLeft className="w-5 h-5 mr-3" /> RETURN_TO_BASE
              </Button>
              <Button
                className="flex-1 bg-black text-white border-4 border-black h-14 rounded-3xl font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_#FD5A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                onClick={() => window.location.reload()}
              >
                <RotateCcw className="w-5 h-5 mr-3" /> RE_INITIALIZE
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════
   REVIEW MODAL
   ═══════════════════════════════════════ */
function ReviewModal({
  exam,
  answers,
  statuses,
  onConfirm,
  onCancel,
}: {
  exam: ExamConfig;
  answers: (number | null)[];
  statuses: QuestionStatus[];
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const answered = answers.filter((a) => a !== null).length;
  const unanswered = exam.questions.length - answered;
  const flagged = statuses.filter((s) => s.includes("flagged")).length;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/90 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        className="relative z-10 w-full max-w-lg bg-[#E9E9E9] border-8 border-black shadow-[16px_16px_0px_0px_#FD5A1A]"
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
      >
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={onCancel}
            className="bg-black text-white p-2 border-2 border-black hover:bg-[#FD5A1A] transition-colors"
          >
            <XCircle className="w-6 h-6" />
          </button>
        </div>

        <div className="p-10 text-center">
          <h2 className="text-3xl font-black text-black uppercase italic mb-8 border-b-4 border-black pb-4 inline-block">
            FINAL_REVIEW_PROTOCOL
          </h2>

          <div className="grid grid-cols-3 gap-4 mb-10">
            <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#0075CF] rounded-3xl">
              <div className="text-2xl font-black text-black">{answered}</div>
              <div className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">
                SYNCED
              </div>
            </div>
            <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_#FD5A1A] rounded-3xl">
              <div className="text-2xl font-black text-black">{unanswered}</div>
              <div className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">
                MISSING
              </div>
            </div>
            <div className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_0px_black] rounded-3xl">
              <div className="text-2xl font-black text-black">{flagged}</div>
              <div className="text-[8px] font-black uppercase tracking-[0.2em] opacity-40">
                FLAGGED
              </div>
            </div>
          </div>

          {unanswered > 0 && (
            <div className="bg-[#FD5A1A] border-4 border-black p-6 mb-10 text-white flex items-center gap-4 text-left rounded-3xl">
              <AlertTriangle className="w-10 h-10 shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-widest leading-loose">
                DETECTION: {unanswered} UNANSWERED DATA NODES FOUND. LOSS OF
                MARKS IS IMMINENT IF YOU PROCEED.
              </p>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-6">
            <Button
              className="flex-1 bg-white text-black border-4 border-black h-14 rounded-3xl font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_black] hover:shadow-none transition-all"
              onClick={onCancel}
            >
              BACK_TO_INPUT
            </Button>
            <Button
              className="flex-1 bg-black text-white border-4 border-black h-14 rounded-3xl font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_#0075CF] hover:shadow-none transition-all"
              onClick={onConfirm}
            >
              EXECUTE_SUBMISSION <Send className="ml-3 w-5 h-5" />
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════
   MAIN EXAM PAGE
   ═══════════════════════════════════════ */
export default function ExamPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();

  const examId = searchParams.get("id") ?? "demo";
  const examType = (searchParams.get("type") ?? "mock") as "live" | "mock";
  const userId = user?.id || "demo_user";

  const [exam] = useState<ExamConfig>(DEMO_EXAM);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(DEMO_EXAM.questions.length).fill(null),
  );
  const [statuses, setStatuses] = useState<QuestionStatus[]>(() =>
    Array(DEMO_EXAM.questions.length).fill("unanswered"),
  );
  const [currentQ, setCurrentQ] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [startTime] = useState(Date.now());
  const [timeTaken, setTimeTaken] = useState(0);

  const [fullscreenWarning, setFullscreenWarning] = useState(false);
  const [syncing, setSyncing] = useState(true);
  const [timerSetup, setTimerSetup] = useState<number | null>(null);

  useEffect(() => {
    async function fetchState() {
      try {
        const res = await fetch(
          `http://localhost:8001/api/exam/state/${examId}/${userId}`,
        );
        if (res.ok) {
          const data = await res.json();
          // Restore answers
          if (data.answers && Object.keys(data.answers).length > 0) {
            const nextAnswers = [...answers];
            const nextStatuses = [...statuses];
            Object.entries(data.answers).forEach(([qId, val]) => {
              const qIdx = exam.questions.findIndex((q) => q.id === qId);
              if (qIdx !== -1) {
                nextAnswers[qIdx] = Number(val);
                nextStatuses[qIdx] = "answered";
              }
            });
            setAnswers(nextAnswers);
            setStatuses(nextStatuses);
          }
          // Restore timer
          if (data.time_remaining_seconds !== null) {
            setTimerSetup(data.time_remaining_seconds);
          } else {
            setTimerSetup(exam.duration_minutes * 60);
          }
        } else {
          setTimerSetup(exam.duration_minutes * 60);
        }
      } catch (err) {
        console.error("Failed to fetch exam state", err);
        setTimerSetup(exam.duration_minutes * 60);
      } finally {
        setSyncing(false);
      }
    }
    fetchState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [examId, userId, exam.duration_minutes]);

  const handleExpire = useCallback(() => {
    toast({
      title: "⏰ TIME_EXPIRED",
      description: "AUTO_SUBMISSION_PROTOCOLS_ACTIVATED.",
    });
    setTimeTaken(Math.round((Date.now() - startTime) / 1000));
    setSubmitted(true);
  }, [toast, startTime]);

  const {
    remaining,
    mins,
    secs,
    pct: timerPct,
    isLow,
    isCritical,
  } = useCountdown(timerSetup, handleExpire);

  const handleSelect = async (optionIdx: number) => {
    const next = [...answers];
    next[currentQ] = optionIdx;
    setAnswers(next);

    const nextStatuses = [...statuses];
    nextStatuses[currentQ] = nextStatuses[currentQ].includes("flagged")
      ? "answered-flagged"
      : "answered";
    setStatuses(nextStatuses);

    // Sync to backend
    try {
      await fetch("http://localhost:8001/api/exam/submit-answer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: String(userId),
          exam_id: String(exam.id),
          question_id: String(exam.questions[currentQ].id),
          selected_option: String(optionIdx),
          time_remaining_seconds: remaining,
        }),
      });
    } catch (err) {
      console.error("Sync failed", err);
    }
  };

  const handleFlag = () => {
    const next = [...statuses];
    if (next[currentQ] === "unanswered") next[currentQ] = "flagged";
    else if (next[currentQ] === "answered") next[currentQ] = "answered-flagged";
    else if (next[currentQ] === "flagged") next[currentQ] = "unanswered";
    else if (next[currentQ] === "answered-flagged") next[currentQ] = "answered";
    setStatuses(next);
  };

  const handleSubmit = async () => {
    setTimeTaken(Math.round((Date.now() - startTime) / 1000));
    setSubmitted(true);
    setShowReview(false);

    // Sync finish
    try {
      await fetch(`http://localhost:8001/api/exam/finish/${examId}/${userId}`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Finish failed", err);
    }
  };

  const goNext = () => {
    if (currentQ < exam.questions.length - 1) setCurrentQ((c) => c + 1);
  };
  const goPrev = () => {
    if (currentQ > 0) setCurrentQ((c) => c - 1);
  };

  useEffect(() => {
    const handler = () => {
      setFullscreenWarning(true);
      setTimeout(() => setFullscreenWarning(false), 3000);
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  if (syncing) {
    return (
      <div className="min-h-screen bg-[#E9E9E9] flex flex-col items-center justify-center font-['Inter']">
        <div className="w-16 h-16 border-8 border-black border-t-[#FD5A1A] rounded-full animate-spin mb-4" />
        <div className="text-xl font-black uppercase tracking-widest text-black">
          SYNCING SERVER...
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <ResultsScreen exam={exam} answers={answers} timeTaken={timeTaken} />
    );
  }

  const question = exam.questions[currentQ];
  const answered = answers.filter((a) => a !== null).length;

  const statusStyle = (i: number) => {
    const s = statuses[i];
    const isCurrent = currentQ === i;

    let base =
      "w-10 h-10 text-xs font-black border-4 transition-all flex items-center justify-center ";
    if (isCurrent)
      base += "shadow-[4px_4px_0px_0px_#0075CF] -translate-x-1 -translate-y-1 ";
    else base += "shadow-[2px_2px_0px_0px_black] ";

    if (s === "answered") return base + "bg-black text-white border-black";
    if (s === "flagged") return base + "bg-[#FD5A1A] text-white border-black";
    if (s === "answered-flagged")
      return (
        base + "bg-[#FD5A1A] text-white border-black ring-2 ring-[#0075CF]"
      );
    return base + "bg-white text-black border-black";
  };

  return (
    <div className="min-h-screen bg-[#E9E9E9] flex flex-col font-['Inter']">
      {/* Warning Toast */}
      <AnimatePresence>
        {fullscreenWarning && (
          <motion.div
            className="fixed top-8 left-1/2 -translate-x-1/2 z-[150] px-8 py-4 bg-[#FD5A1A] text-white font-black border-4 border-black shadow-[8px_8px_0px_0px_black] uppercase italic"
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
          >
            <AlertTriangle className="w-6 h-6 inline mr-3" /> ALERT: DO NOT
            LEAVE THE FIELD!
          </motion.div>
        )}
      </AnimatePresence>

      {/* TOP STATUS BAR */}
      <header className="bg-black border-b-8 border-[#FD5A1A] px-6 py-4 flex items-center justify-between gap-6 sticky top-0 z-50">
        <div className="flex items-center gap-4 min-w-0">
          <div className="w-12 h-12 bg-[#FD5A1A] border-4 border-white flex items-center justify-center -rotate-6 shadow-[4px_4px_0px_0px_rgba(255,255,255,0.2)]">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <div className="min-w-0">
            <h1 className="text-white font-black uppercase italic tracking-tighter text-xl truncate">
              {exam.title}
            </h1>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#FD5A1A]">
              <span>
                {exam.type === "mock" ? "PRACTICE_SESSION" : "LIVE_BATTLE"}
              </span>
              <span className="text-white/20">|</span>
              <span className="text-white">
                {answered}/{exam.questions.length} NODES_SYNCED
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div
            className={`flex items-center gap-3 px-6 py-3 border-4 border-white font-black text-xl italic ${isCritical ? "bg-[#FD5A1A] text-white animate-pulse" : "bg-black text-white"}`}
          >
            <Clock className="w-6 h-6" />
            <span>
              {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
            </span>
          </div>

          <Button
            className="h-14 bg-white text-black border-4 border-black px-8 font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_#0075CF] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-3xl"
            onClick={() => setShowReview(true)}
          >
            SUBMIT <Send className="ml-3 w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Progress Line */}
      <div className="h-2 bg-black/20 relative">
        <motion.div
          className={`h-full transition-all ${isCritical ? "bg-[#FD5A1A]" : "bg-[#0075CF]"}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

        {/* SIDEBAR NAVIGATOR */}
        <aside className="hidden lg:flex flex-col w-72 bg-white border-r-8 border-black shrink-0 relative z-10">
          <div className="p-8 flex-1 overflow-y-auto">
            <h3 className="text-xs font-black text-black uppercase tracking-[0.3em] mb-8 border-l-4 border-black pl-4">
              MAP_OVERVIEW
            </h3>
            <div className="grid grid-cols-4 gap-3">
              {exam.questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={statusStyle(i)}
                >
                  {i + 1}
                </button>
              ))}
            </div>

            <div className="mt-12 space-y-4">
              <h4 className="text-[10px] font-black uppercase tracking-widest text-black/40">
                LEGEND
              </h4>
              {[
                { color: "bg-white", label: "IDLE" },
                { color: "bg-black", label: "SYNCED" },
                { color: "bg-[#FD5A1A]", label: "FLAGGED" },
              ].map((l) => (
                <div key={l.label} className="flex items-center gap-3">
                  <div
                    className={`w-4 h-4 border-4 border-black shadow-[2px_2px_0px_0px_black] ${l.color}`}
                  />
                  <span className="text-[10px] font-black uppercase tracking-widest text-black/60">
                    {l.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-[#E9E9E9] border-t-8 border-black">
            <div className="text-[10px] font-black uppercase tracking-widest text-black mb-2">
              SYNC_PROGRESS
            </div>
            <div className="h-4 bg-white border-4 border-black overflow-hidden mb-3">
              <motion.div
                className="h-full bg-[#0075CF]"
                initial={{ width: 0 }}
                animate={{
                  width: `${(answered / exam.questions.length) * 100}%`,
                }}
              />
            </div>
            <div className="text-[10px] font-black text-black">
              {answered}/{exam.questions.length} DETECTED
            </div>
          </div>
        </aside>

        {/* MAIN QUESTION INTERFACE */}
        <main className="flex-1 overflow-y-auto p-12 relative z-10 flex flex-col items-center">
          <div className="w-full max-w-3xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ type: "spring", damping: 20 }}
              >
                <div className="flex items-center justify-between mb-10">
                  <div>
                    <span className="text-xs font-black uppercase tracking-[0.3em] text-[#0075CF] border-b-4 border-black pb-1">
                      NODE_0{currentQ + 1}
                    </span>
                    <span className="ml-6 text-xs font-black uppercase tracking-widest text-[#FD5A1A]">
                      SCORE_VAL: {question.points}
                    </span>
                  </div>
                  <button
                    onClick={handleFlag}
                    className={`h-12 px-6 border-4 border-black font-black uppercase tracking-widest text-xs flex items-center gap-3 transition-all ${statuses[currentQ].includes("flagged") ? "bg-[#FD5A1A] text-white shadow-none translate-x-1 translate-y-1" : "bg-white text-black shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1"}`}
                  >
                    <Flag className="w-4 h-4" />
                    {statuses[currentQ].includes("flagged")
                      ? "UN_FLAG"
                      : "MARK_FLAG"}
                  </button>
                </div>

                <div className="bg-white border-4 border-black p-10 shadow-[12px_12px_0px_0px_black] mb-10 relative rounded-3xl">
                  <div className="absolute top-0 left-0 w-full h-2 bg-[#0075CF]" />
                  <p className="text-2xl font-black text-black leading-tight italic">
                    {question.text}
                  </p>
                </div>

                <div className="grid gap-4">
                  {question.options.map((opt, i) => {
                    const isSelected = answers[currentQ] === i;
                    return (
                      <button
                        key={i}
                        onClick={() => handleSelect(i)}
                        className={`group relative text-left p-6 border-4 border-black font-black text-lg transition-all ${isSelected ? "bg-black text-white shadow-none translate-x-1 translate-y-1" : "bg-white text-black shadow-[8px_8px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1"}`}
                      >
                        <div className="flex items-center gap-6">
                          <div
                            className={`w-10 h-10 shrink-0 border-4 border-black flex items-center justify-center font-black italic text-sm ${isSelected ? "bg-white text-black" : "bg-[#E9E9E9] text-black"}`}
                          >
                            {String.fromCharCode(65 + i)}
                          </div>
                          <span className="uppercase tracking-tight">
                            {opt}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="flex items-center justify-between mt-16 pt-10 border-t-8 border-black/10">
              <Button
                className="h-14 bg-white text-black border-4 border-black px-8 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all disabled:opacity-20 rounded-3xl"
                onClick={goPrev}
                disabled={currentQ === 0}
              >
                <ChevronLeft className="w-6 h-6 mr-3" /> PREVIOUS
              </Button>

              <div className="lg:hidden text-lg font-black italic uppercase">
                {currentQ + 1} / {exam.questions.length}
              </div>

              {currentQ === exam.questions.length - 1 ? (
                <Button
                  className="h-14 bg-[#FD5A1A] text-white border-4 border-black px-10 font-black uppercase tracking-[0.2em] shadow-[6px_6px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-3xl"
                  onClick={() => setShowReview(true)}
                >
                  REVIEW_SUBMIT <Eye className="ml-3 w-6 h-6" />
                </Button>
              ) : (
                <Button
                  className="h-14 bg-black text-white border-4 border-black px-10 font-black uppercase tracking-[0.2em] shadow-[4px_4px_0px_0px_#0075CF] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-3xl"
                  onClick={goNext}
                >
                  NEXT_NODE <ChevronRight className="ml-3 w-6 h-6" />
                </Button>
              )}
            </div>
          </div>
        </main>
      </div>

      <AnimatePresence>
        {showReview && (
          <ReviewModal
            exam={exam}
            answers={answers}
            statuses={statuses}
            onConfirm={handleSubmit}
            onCancel={() => setShowReview(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
