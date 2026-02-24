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
  correct_index?: number; // For mock tests; absent in live exams until result
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
   MOCK DATA (fallback when no real exam)
═══════════════════════════════════════ */
const DEMO_EXAM: ExamConfig = {
  id: "demo",
  title: "Full Stack Web Development — Mock Test #1",
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
    {
      id: "q6",
      points: 2,
      text: "What does API stand for?",
      options: [
        "Application Programming Interface",
        "Automated Process Integration",
        "Advanced Program Index",
        "Application Protocol Interface",
      ],
      correct_index: 0,
    },
    {
      id: "q7",
      points: 2,
      text: "Which of the following is a NoSQL database?",
      options: ["MySQL", "PostgreSQL", "MongoDB", "SQLite"],
      correct_index: 2,
    },
    {
      id: "q8",
      points: 2,
      text: 'What is the purpose of the "useEffect" hook in React?',
      options: [
        "Managing local state",
        "Handling side effects",
        "Memoizing expensive computations",
        "Accessing DOM elements",
      ],
      correct_index: 1,
    },
    {
      id: "q9",
      points: 2,
      text: "Which CSS feature allows you to create responsive layouts?",
      options: [
        "Flexbox and Grid",
        "Float",
        "Position: absolute",
        "Display: table",
      ],
      correct_index: 0,
    },
    {
      id: "q10",
      points: 2,
      text: 'What does "async/await" do in JavaScript?',
      options: [
        "Creates a new thread",
        "Makes asynchronous code look synchronous",
        "Speeds up code execution",
        "Adds type safety",
      ],
      correct_index: 1,
    },
  ],
};

/* ═══════════════════════════════════════
   COUNTDOWN TIMER
═══════════════════════════════════════ */
function useCountdown(seconds: number, onExpire: () => void) {
  const [remaining, setRemaining] = useState(seconds);
  const expiredRef = useRef(false);

  useEffect(() => {
    if (remaining <= 0) {
      if (!expiredRef.current) {
        expiredRef.current = true;
        onExpire();
      }
      return;
    }
    const t = setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => clearTimeout(t);
  }, [remaining, onExpire]);

  const pct = Math.round((remaining / seconds) * 100);
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
    <div className="min-h-screen bg-[#E9E9E9] flex flex-col items-center justify-center p-4">
      <motion.div
        className="w-full max-w-2xl"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", damping: 20 }}
      >
        {/* Result card */}
        <div
          className={`bg-white border-2 border-[#000000] rounded-2xl overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}
        >
          {/* Top stripe */}
          <div className={`h-3 ${passed ? "bg-[#0075CF]" : "bg-[#FD5A1A]"}`} />

          <div className="p-8 text-center">
            <div
              className={`w-24 h-24 mx-auto mb-6 rounded-2xl border-2 border-[#000000] flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${passed ? "bg-[#0075CF]" : "bg-[#FD5A1A]"}`}
            >
              {passed ? (
                <Trophy className="w-12 h-12 text-white" />
              ) : (
                <XCircle className="w-12 h-12 text-white" />
              )}
            </div>

            <h1 className="text-3xl font-black text-[#000000] mb-1">
              {passed ? "Well Done! 🎉" : "Keep Practising!"}
            </h1>
            <p className="text-[#000000]/60 text-sm mb-8">{exam.title}</p>

            {/* Score ring */}
            <div className="flex items-center justify-center mb-8">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke="#E9E9E9"
                    strokeWidth="8"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="42"
                    fill="none"
                    stroke={passed ? "#0075CF" : "#FD5A1A"}
                    strokeWidth="8"
                    strokeDasharray={`${2 * Math.PI * 42}`}
                    strokeDashoffset={`${2 * Math.PI * 42 * (1 - pct / 100)}`}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-4xl font-black text-[#000000]">
                    {pct}%
                  </span>
                  <span className="text-xs text-[#000000]/60 font-bold">
                    SCORE
                  </span>
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-8">
              {[
                {
                  label: "Correct",
                  value: `${correct}/${total}`,
                  color: "bg-[#0075CF] text-white",
                },
                {
                  label: "Marks",
                  value: `${score}/${maxScore}`,
                  color: "bg-[#FD5A1A] text-white",
                },
                {
                  label: "Time",
                  value: `${mins}m ${secs}s`,
                  color: "bg-[#E9E9E9] text-[#000000]",
                },
              ].map((s) => (
                <div
                  key={s.label}
                  className={`rounded-xl p-3 border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${s.color}`}
                >
                  <div className="text-2xl font-black">{s.value}</div>
                  <div className="text-xs opacity-80 font-bold uppercase tracking-wider">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Question breakdown */}
            <div className="text-left border-2 border-[#000000] rounded-xl overflow-hidden mb-6 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="bg-[#000000] px-4 py-2 flex justify-between">
                <span className="text-xs font-black text-white uppercase tracking-widest">
                  Question Review
                </span>
                <span className="text-xs text-white/60">
                  {correct} correct · {total - correct} wrong
                </span>
              </div>
              <div className="divide-y-2 divide-[#E9E9E9] max-h-60 overflow-y-auto">
                {exam.questions.map((q, i) => {
                  const isCorrect = answers[i] === q.correct_index;
                  return (
                    <div
                      key={q.id}
                      className="flex items-start gap-3 px-4 py-3"
                    >
                      <div
                        className={`mt-0.5 w-6 h-6 rounded-full border-2 border-[#000000] flex items-center justify-center shrink-0 ${isCorrect ? "bg-[#0075CF]" : "bg-[#FD5A1A]"}`}
                      >
                        {isCorrect ? (
                          <CheckCircle className="w-3.5 h-3.5 text-white" />
                        ) : (
                          <XCircle className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-black text-[#000000] truncate">
                          Q{i + 1}: {q.text}
                        </p>
                        {!isCorrect && answers[i] !== null && (
                          <p className="text-[10px] text-[#FD5A1A] font-bold">
                            Your: {q.options[answers[i]!]} · Correct:{" "}
                            {q.options[q.correct_index!]}
                          </p>
                        )}
                        {answers[i] === null && (
                          <p className="text-[10px] text-[#000000]/50 font-bold">
                            Not attempted
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => navigate("/dashboard/exams")}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Back to Exams
              </Button>
              <Button
                variant="accent"
                className="flex-1"
                onClick={() => window.location.reload()}
              >
                <RotateCcw className="w-4 h-4 mr-1" /> Retake Test
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ═══════════════════════════════════════
   REVIEW MODAL (before submit)
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#000000]/60 backdrop-blur-sm"
        onClick={onCancel}
      />
      <motion.div
        className="relative z-10 w-full max-w-md bg-white border-2 border-[#000000] rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.85, opacity: 0 }}
      >
        <div className="h-2 bg-[#FD5A1A] rounded-t-xl" />
        <div className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-12 h-12 bg-[#FD5A1A] border-2 border-[#000000] rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Eye className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="font-black text-lg text-[#000000]">
                Review Before Submit
              </h2>
              <p className="text-xs text-[#000000]/60">
                Double-check your answers
              </p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="text-center p-3 bg-[#0075CF] border-2 border-[#000000] rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-2xl font-black text-white">{answered}</div>
              <div className="text-[10px] text-white/80 font-bold uppercase">
                Answered
              </div>
            </div>
            <div className="text-center p-3 bg-[#FD5A1A] border-2 border-[#000000] rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-2xl font-black text-white">{unanswered}</div>
              <div className="text-[10px] text-white/80 font-bold uppercase">
                Unanswered
              </div>
            </div>
            <div className="text-center p-3 bg-[#E9E9E9] border-2 border-[#000000] rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <div className="text-2xl font-black text-[#000000]">
                {flagged}
              </div>
              <div className="text-[10px] text-[#000000]/60 font-bold uppercase">
                Flagged
              </div>
            </div>
          </div>

          {unanswered > 0 && (
            <div className="flex items-start gap-2 p-3 bg-[#FD5A1A]/10 border-2 border-[#FD5A1A] rounded-xl mb-5">
              <AlertTriangle className="w-5 h-5 text-[#FD5A1A] shrink-0 mt-0.5" />
              <p className="text-sm font-bold text-[#FD5A1A]">
                You have {unanswered} unanswered question
                {unanswered > 1 ? "s" : ""}. Unanswered questions score 0.
              </p>
            </div>
          )}

          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" onClick={onCancel}>
              Go Back
            </Button>
            <Button variant="accent" className="flex-1" onClick={onConfirm}>
              <Send className="w-4 h-4 mr-1" /> Submit Exam
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

  // Determine exam to load — use demo if no ID provided
  const examId = searchParams.get("id") ?? "demo";
  const examType = (searchParams.get("type") ?? "mock") as "live" | "mock";

  const [exam] = useState<ExamConfig>(DEMO_EXAM); // In production, fetch by examId
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

  // Full-screen lock notice
  const [fullscreenWarning, setFullscreenWarning] = useState(false);

  const totalSecs = exam.duration_minutes * 60;

  const handleExpire = useCallback(() => {
    toast({
      title: "⏰ Time Up!",
      description: "Your exam has been auto-submitted.",
    });
    setTimeTaken(Math.round((Date.now() - startTime) / 1000));
    setSubmitted(true);
  }, [toast, startTime]);

  const {
    mins,
    secs,
    pct: timerPct,
    isLow,
    isCritical,
  } = useCountdown(totalSecs, handleExpire);

  const handleSelect = (optionIdx: number) => {
    const next = [...answers];
    next[currentQ] = optionIdx;
    setAnswers(next);

    const nextStatuses = [...statuses];
    nextStatuses[currentQ] = nextStatuses[currentQ].includes("flagged")
      ? "answered-flagged"
      : "answered";
    setStatuses(nextStatuses);
  };

  const handleFlag = () => {
    const next = [...statuses];
    if (next[currentQ] === "unanswered") next[currentQ] = "flagged";
    else if (next[currentQ] === "answered") next[currentQ] = "answered-flagged";
    else if (next[currentQ] === "flagged") next[currentQ] = "unanswered";
    else if (next[currentQ] === "answered-flagged") next[currentQ] = "answered";
    setStatuses(next);
  };

  const handleSubmit = () => {
    setTimeTaken(Math.round((Date.now() - startTime) / 1000));
    setSubmitted(true);
    setShowReview(false);
  };

  const goNext = () => {
    if (currentQ < exam.questions.length - 1) setCurrentQ((c) => c + 1);
  };
  const goPrev = () => {
    if (currentQ > 0) setCurrentQ((c) => c - 1);
  };

  // Prevent tab switch (production would use webcam proctoring)
  useEffect(() => {
    const handler = () => {
      setFullscreenWarning(true);
      setTimeout(() => setFullscreenWarning(false), 3000);
    };
    document.addEventListener("visibilitychange", handler);
    return () => document.removeEventListener("visibilitychange", handler);
  }, []);

  if (submitted) {
    return (
      <ResultsScreen exam={exam} answers={answers} timeTaken={timeTaken} />
    );
  }

  const question = exam.questions[currentQ];
  const answered = answers.filter((a) => a !== null).length;

  const statusColor = (s: QuestionStatus) => {
    if (s === "answered") return "bg-[#0075CF] text-white border-[#000000]";
    if (s === "flagged") return "bg-[#FD5A1A] text-white border-[#000000]";
    if (s === "answered-flagged")
      return "bg-[#FD5A1A] text-white border-[#000000] ring-2 ring-[#0075CF]";
    return "bg-white text-[#000000] border-[#000000]";
  };

  return (
    <div className="min-h-screen bg-[#E9E9E9] flex flex-col">
      {/* Tab-switch warning */}
      <AnimatePresence>
        {fullscreenWarning && (
          <motion.div
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 px-6 py-3 bg-[#FD5A1A] text-white font-black border-2 border-[#000000] rounded-full shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -60, opacity: 0 }}
          >
            <AlertTriangle className="w-5 h-5" /> Warning: Do not leave the exam
            window!
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── TOP BAR ── */}
      <header className="bg-[#000000] border-b-2 border-[#FD5A1A] px-4 py-3 flex items-center justify-between gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 bg-[#FD5A1A] border-2 border-white rounded-lg flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-white font-black text-sm truncate">
              {exam.title}
            </p>
            <p className="text-white/50 text-xs">
              {exam.type === "mock" ? "Mock Test" : "Live Exam"} · {answered}/
              {exam.questions.length} answered
            </p>
          </div>
        </div>

        {/* Timer */}
        <div
          className={`flex items-center gap-2 px-4 py-2 border-2 border-white rounded-xl font-black text-lg ${isCritical ? "bg-[#FD5A1A] text-white animate-pulse" : isLow ? "bg-[#FD5A1A]/30 text-[#FD5A1A]" : "bg-[#000000] text-white"}`}
        >
          <Clock className="w-5 h-5" />
          <span>
            {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
          </span>
        </div>

        {/* Submit */}
        <Button
          variant="accent"
          size="sm"
          className="shrink-0"
          onClick={() => setShowReview(true)}
        >
          <Send className="w-4 h-4 mr-1" /> Submit
        </Button>
      </header>

      {/* Timer bar */}
      <div className="h-1.5 bg-[#E9E9E9]">
        <div
          className={`h-full transition-all duration-1000 ${isCritical ? "bg-[#FD5A1A]" : "bg-[#0075CF]"}`}
          style={{ width: `${timerPct}%` }}
        />
      </div>

      <div className="flex flex-1 gap-0 overflow-hidden">
        {/* ── QUESTION NAVIGATOR SIDEBAR ── */}
        <aside className="hidden md:flex flex-col w-56 bg-white border-r-2 border-[#000000] shrink-0">
          <div className="p-4 border-b-2 border-[#E9E9E9]">
            <p className="text-xs font-black text-[#000000] uppercase tracking-widest mb-3">
              Question Map
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {exam.questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`w-8 h-8 text-xs font-black rounded border-2 transition-all duration-150 ${statusColor(statuses[i])} ${currentQ === i ? "ring-2 ring-offset-1 ring-[#000000]" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="p-4 space-y-2 text-xs font-bold">
            {[
              { color: "bg-white border-[#000000]", label: "Unanswered" },
              { color: "bg-[#0075CF]", label: "Answered" },
              { color: "bg-[#FD5A1A]", label: "Flagged" },
            ].map((l) => (
              <div key={l.label} className="flex items-center gap-2">
                <div
                  className={`w-4 h-4 rounded border-2 border-[#000000] ${l.color}`}
                />
                <span className="text-[#000000]/70">{l.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-auto p-4 border-t-2 border-[#E9E9E9]">
            <div className="text-xs font-bold text-[#000000]/60 mb-1">
              Progress
            </div>
            <div className="w-full h-2.5 bg-[#E9E9E9] rounded-full border border-[#000000]">
              <div
                className="h-full bg-[#0075CF] rounded-full transition-all"
                style={{
                  width: `${(answered / exam.questions.length) * 100}%`,
                }}
              />
            </div>
            <div className="mt-1 text-xs font-black text-[#000000]">
              {answered} of {exam.questions.length} answered
            </div>
          </div>
        </aside>

        {/* ── QUESTION AREA ── */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 flex flex-col items-center">
          <div className="w-full max-w-2xl">
            {/* Question card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQ}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.2 }}
              >
                {/* Question header */}
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div>
                    <span className="text-xs font-black text-[#0075CF] uppercase tracking-widest">
                      Question {currentQ + 1} of {exam.questions.length}
                    </span>
                    <span className="ml-3 text-xs font-black text-[#FD5A1A]">
                      {question.points} pts
                    </span>
                  </div>
                  <button
                    onClick={handleFlag}
                    className={`flex items-center gap-1.5 text-xs font-black px-3 py-1.5 border-2 border-[#000000] rounded-lg transition-all shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] ${statuses[currentQ].includes("flagged") ? "bg-[#FD5A1A] text-white" : "bg-white text-[#000000]"}`}
                  >
                    <Flag className="w-3.5 h-3.5" />
                    {statuses[currentQ].includes("flagged")
                      ? "Flagged"
                      : "Flag"}
                  </button>
                </div>

                <div className="bg-white border-2 border-[#000000] rounded-2xl p-6 mb-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="text-lg font-black text-[#000000] leading-relaxed">
                    {question.text}
                  </p>
                </div>

                {/* Options */}
                <div className="space-y-3">
                  {question.options.map((opt, i) => {
                    const isSelected = answers[currentQ] === i;
                    return (
                      <motion.button
                        key={i}
                        onClick={() => handleSelect(i)}
                        whileHover={{ x: -2, y: -2 }}
                        whileTap={{ x: 0, y: 0 }}
                        className={`w-full text-left p-4 border-2 border-[#000000] rounded-xl font-bold text-sm transition-all duration-150 ${
                          isSelected
                            ? "bg-[#0075CF] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                            : "bg-white text-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[6px_6px_0px_0px_rgba(0,117,207,1)] hover:bg-[#E9E9E9]"
                        }`}
                      >
                        <span
                          className={`inline-flex w-6 h-6 mr-3 rounded-md text-xs items-center justify-center border-2 border-[#000000] font-black ${isSelected ? "bg-white text-[#0075CF]" : "bg-[#E9E9E9] text-[#000000]"}`}
                        >
                          {String.fromCharCode(65 + i)}
                        </span>
                        {opt}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation row */}
            <div className="flex items-center justify-between mt-8">
              <Button
                variant="outline"
                onClick={goPrev}
                disabled={currentQ === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Previous
              </Button>

              {/* Mobile Q counter */}
              <span className="md:hidden text-sm font-black text-[#000000]">
                {currentQ + 1}/{exam.questions.length}
              </span>

              {currentQ === exam.questions.length - 1 ? (
                <Button variant="accent" onClick={() => setShowReview(true)}>
                  <Eye className="w-4 h-4 mr-1" /> Review & Submit
                </Button>
              ) : (
                <Button variant="default" onClick={goNext}>
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              )}
            </div>

            {/* Mobile navigator */}
            <div className="md:hidden mt-6 flex flex-wrap gap-1.5 justify-center">
              {exam.questions.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentQ(i)}
                  className={`w-8 h-8 text-xs font-black rounded border-2 transition-all ${statusColor(statuses[i])} ${currentQ === i ? "ring-2 ring-offset-1 ring-[#000000]" : ""}`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </div>
        </main>
      </div>

      {/* ── REVIEW MODAL ── */}
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
