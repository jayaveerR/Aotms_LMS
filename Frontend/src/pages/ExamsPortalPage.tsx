import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ClipboardCheck,
  FileText,
  Clock,
  PlayCircle,
  Loader2,
  ArrowRight,
  Star,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

/* ── Fallback Data ── */
const MOCK_EXAMS = [
  {
    id: "exam_demo",
    title: "Mid-Term Evaluation (Live)",
    type: "live",
    duration: 1800,
    questions: 50,
    date: "Available Now",
  },
  {
    id: "math_101",
    title: "Mathematics Fundamentals",
    type: "mock",
    duration: 3600,
    questions: 60,
    date: "Always Available",
  },
  {
    id: "cs_basics",
    title: "Computer Science Basics",
    type: "mock",
    duration: 2400,
    questions: 40,
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
    <div className="space-y-12 pb-12">
      {/* HEADER BLOCK */}
      <div className="bg-[#E9E9E9] border-4 border-black p-8 relative overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-white text-[10px] font-black uppercase tracking-[0.2em] mb-4">
              <Zap className="w-3 h-3 text-[#FD5A1A]" /> BATTLE_PORTAL
            </div>
            <h1 className="text-4xl md:text-5xl font-black text-black uppercase italic leading-none mb-2">
              {isMockRoute ? "MOCK_PAPERS" : "LIVE_EXAMS"}
            </h1>
            <p className="text-black font-bold uppercase tracking-widest text-[10px] opacity-50">
              {isMockRoute
                ? "PRACTICE_MODE: NO_LIMITS_ON_EXECUTION."
                : "STRICT_PROTOCOL: PROCTORED_ENVIRONMENTS_ONLY."}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="bg-white border-2 border-black p-4 shadow-[4px_4px_0px_0px_#0075CF]">
              <div className="text-2xl font-black text-black leading-none">
                {displayedExams.length}
              </div>
              <div className="text-[8px] font-black uppercase tracking-widest opacity-40">
                AVAILABLE_NODES
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* EXAMS GRID */}
      {displayedExams.length === 0 ? (
        <div className="bg-white border-4 border-black p-16 text-center flex flex-col items-center shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
          <div className="w-20 h-20 bg-[#E9E9E9] border-4 border-black flex items-center justify-center mb-6 relative z-10">
            {isMockRoute ? (
              <FileText className="w-10 h-10 text-black/20" />
            ) : (
              <ClipboardCheck className="w-10 h-10 text-black/20" />
            )}
          </div>
          <h3 className="text-2xl font-black text-black mb-2 uppercase italic relative z-10">
            NO_MODULES_DETECTED
          </h3>
          <p className="text-[10px] font-black text-black/40 uppercase tracking-[0.2em] relative z-10">
            CHECK BACK LATER OR SIGNAL YOUR SUPERVISOR FOR UPDATES.
          </p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayedExams.map((exam, i) => (
            <motion.div
              key={exam.id}
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="group bg-white border-4 border-black flex flex-col overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[14px_14px_0px_0px_#0075CF] hover:border-[#0075CF] transition-all"
            >
              {/* Card Title Block */}
              <div
                className={`p-6 border-b-4 border-black relative ${
                  isMockRoute ? "bg-[#0075CF]" : "bg-[#FD5A1A]"
                }`}
              >
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none" />
                <div className="absolute top-2 right-2">
                  <Badge className="bg-black text-white border-2 border-white rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,0.3)] text-[8px] font-black uppercase tracking-widest px-2 py-0.5">
                    {exam.date}
                  </Badge>
                </div>
                {isMockRoute ? (
                  <FileText className="w-8 h-8 text-black/30" />
                ) : (
                  <ClipboardCheck className="w-8 h-8 text-black/30" />
                )}
              </div>

              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-black text-xl text-black uppercase italic leading-tight mb-6 group-hover:text-[#0075CF] transition-colors">
                  {exam.title}
                </h3>

                <div className="space-y-3 mb-10">
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-black/40 border-b-2 border-dashed border-black/10 pb-2">
                    <span className="flex items-center gap-2 italic">
                      <Clock className="w-4 h-4 text-black" /> DURATION
                    </span>
                    <span className="text-black">
                      {Math.floor(exam.duration / 60)} MINS
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-black/40 border-b-2 border-dashed border-black/10 pb-2">
                    <span className="flex items-center gap-2 italic">
                      <FileText className="w-4 h-4 text-black" /> INTEL_LOAD
                    </span>
                    <span className="text-black">{exam.questions} Q's</span>
                  </div>
                </div>

                <Button
                  className="w-full h-14 bg-black text-white rounded-none border-2 border-black shadow-[4px_4px_0px_0px_#FD5A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-black uppercase tracking-[0.2em] text-xs"
                  onClick={() =>
                    navigate(`/exam?id=${exam.id}&type=${exam.type}`)
                  }
                >
                  INITIALIZE {isMockRoute ? "MOCK" : "EXAM"}
                  <PlayCircle className="w-5 h-5 ml-3" />
                </Button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
