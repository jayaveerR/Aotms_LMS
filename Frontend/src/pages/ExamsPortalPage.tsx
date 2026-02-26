import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  FileText,
  Compass,
  Clock,
  PlayCircle,
  Loader2,
  ArrowRight,
  Star,
  Zap,
  TrendingUp,
  AlertTriangle,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ── Fallback Data ── */
const MOCK_EXAMS = [
  {
    id: "exam_demo",
    title: "Mid-Term Evaluation (Live)",
    type: "live",
    duration_minutes: 30,
    questions_count: 50,
    category: "CERTIFICATION",
    description:
      "Official mid-term evaluation covering advanced module protocols and security standards.",
    passing_marks: 85,
    date: "Available Now",
  },
  {
    id: "math_101",
    title: "Mathematics Fundamentals",
    type: "mock",
    duration_minutes: 60,
    questions_count: 60,
    category: "PRACTICE",
    description:
      "Master the foundations of computational mathematics and statistical analysis.",
    passing_marks: 70,
    date: "Always Available",
  },
  {
    id: "cs_basics",
    title: "Computer Science Basics",
    type: "mock",
    duration_minutes: 40,
    questions_count: 40,
    category: "CORE",
    description:
      "Foundational concepts for computer science including algorithms and data structures.",
    passing_marks: 75,
    date: "Always Available",
  },
];

export default function ExamsPortalPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);

  // Decide whether to show Live or Mock based on URL
  const isMockRoute = location.pathname.includes("mock-papers");

  const displayedExams = MOCK_EXAMS.filter((e) =>
    isMockRoute ? e.type === "mock" : e.type === "live",
  );

  useEffect(() => {
    // Simulate API fetch delay
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [isMockRoute]);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-12 h-12 text-[#0075CF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 sm:space-y-12 pb-12 px-2 sm:px-0 font-['Inter']">
      {/* HEADER BLOCK */}
      <div className="bg-white border-2 sm:border-4 border-black p-6 sm:p-10 relative overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-lg sm:rounded-2xl">
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FD5A1A] text-white text-[10px] font-black uppercase tracking-widest rounded-full border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
              <Zap className="w-3 h-3" /> Assessment Portal
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-black uppercase tracking-tight">
              {isMockRoute ? "Mock Papers" : "Live Exams"}
            </h1>
            <p className="text-black font-bold uppercase tracking-widest text-[10px] sm:text-xs opacity-60">
              {isMockRoute
                ? "Perfect your skills with unlimited practice attempts."
                : "Official proctored examinations for certification."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-[#E9E9E9] border-2 border-black p-4 shadow-[4px_4px_0px_0px_#0075CF] rounded-xl flex items-center gap-4">
              <div>
                <div className="text-2xl font-black text-black leading-none">
                  {displayedExams.length}
                </div>
                <div className="text-[8px] font-black uppercase tracking-widest opacity-60 mt-1">
                  Active Modules
                </div>
              </div>
              <div className="h-10 w-10 bg-white border-2 border-black rounded-lg flex items-center justify-center">
                <ClipboardCheck className="w-5 h-5 text-[#0075CF]" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EXAMS GRID */}
      <div className="space-y-6 sm:space-y-8 max-w-5xl mx-auto px-2 sm:px-4">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-[#000000] uppercase tracking-wider flex items-center gap-3">
            <ClipboardCheck className="w-6 h-6 sm:w-8 sm:h-8 text-[#FD5A1A]" />
            Assessment Protocol
          </h1>
          <p className="text-[#000000]/60 font-medium mt-1 text-xs sm:text-sm uppercase tracking-widest">
            Select an active examination to begin the validation sequence.
          </p>
        </div>

        <div className="grid gap-6 sm:gap-8">
          {displayedExams.length === 0 ? (
            <div className="bg-white border-4 border-dashed border-[#000000] rounded-xl p-12 text-center text-[#000000]/30 font-black uppercase tracking-widest">
              No Active Protocols Found
            </div>
          ) : (
            displayedExams.map((exam, idx) => (
              <motion.div
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white border-2 sm:border-4 border-black rounded-xl overflow-hidden shadow-[4px_4px_0px_0px_black] sm:shadow-[8px_8px_0px_0px_black] hover:rotate-[0.5deg] transition-transform group"
              >
                <div className="flex flex-col sm:flex-row h-full">
                  {/* Visual Side */}
                  <div className="w-full sm:w-48 bg-[#E9E9E9] border-b-2 sm:border-b-0 sm:border-r-4 border-black flex items-center justify-center p-6 sm:p-0">
                    <div className="relative">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-black rounded-lg flex items-center justify-center -rotate-6 transform group-hover:rotate-6 transition-transform">
                        <FileText className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
                      </div>
                      <Badge className="absolute -top-2 -right-4 bg-[#FD5A1A] text-white border-2 border-black font-black uppercase tracking-widest text-[9px]">
                        {exam.category || "EXAM"}
                      </Badge>
                    </div>
                  </div>

                  {/* Content Side */}
                  <div className="flex-1 p-5 sm:p-8">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                      <div>
                        <h3 className="text-xl sm:text-2xl font-black text-black uppercase tracking-tight leading-none mb-2">
                          {exam.title}
                        </h3>
                        <p className="text-xs sm:text-sm font-medium text-black/60 line-clamp-2">
                          {exam.description ||
                            "This assessment will validate your technical understanding of the protocol."}
                        </p>
                      </div>
                      <div className="bg-[#E9E9E9] border-2 border-black rounded px-3 py-1 flex items-center gap-2 self-start">
                        <Clock className="w-3.5 h-3.5 text-[#0075CF]" />
                        <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">
                          {exam.duration_minutes} Mins
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 sm:gap-8 mb-8">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-black flex items-center justify-center text-white text-[10px] font-black">
                          Q
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-black/40 uppercase">
                            Total Items
                          </span>
                          <span className="text-xs sm:text-sm font-black line-height-none">
                            {exam.questions_count || 0} Questions
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded bg-[#0075CF] flex items-center justify-center text-white">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-[9px] font-bold text-black/40 uppercase">
                            Target Score
                          </span>
                          <span className="text-xs sm:text-sm font-black line-height-none">
                            {exam.passing_marks}% Pass Rate
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pt-4 border-t-2 border-dashed border-black/10">
                      <div className="flex items-center gap-2 text-[10px] sm:text-xs font-bold text-black/40 uppercase tracking-widest">
                        <AlertTriangle className="w-3.5 h-3.5 text-[#FD5A1A]" />
                        Strict Proctoring Protocol Active
                      </div>
                      <Button
                        onClick={() => navigate(`/exam/${exam.id}`)}
                        className="bg-black text-white px-8 h-12 rounded-lg font-black uppercase tracking-widest text-[10px] sm:text-xs border-2 border-black shadow-[4px_4px_0px_0px_#FD5A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all"
                      >
                        Initialize Session{" "}
                        <Play className="w-3 h-3 ml-2 fill-current" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
