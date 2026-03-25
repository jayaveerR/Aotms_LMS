import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

const testimonials = [
  {
    name: "Aditya Krishnan",
    role: "SDE-1 @ Microsoft",
    course: "Full Stack Dev",
    text: "AOTMS transformed my career. The live classes and hands-on projects helped me land my dream job within 6 months.",
    avatar: "AK",
    rating: 5,
    stats: { score: "98%", hirable: "READY", time: "180 Days" },
  },
  {
    name: "Meera Nair",
    role: "Data Analyst @ Infosys",
    course: "Data Science",
    text: "The curriculum is perfectly aligned with industry needs. The ATS resume scoring feature was a complete game-changer.",
    avatar: "MN",
    rating: 5,
    stats: { score: "94%", hirable: "PREMIUM", time: "120 Days" },
  },
  {
    name: "Sanjay Gupta",
    role: "Cloud Architect @ TCS",
    course: "Cloud Computing",
    text: "Excellent instructors. The secure exam system built my confidence and the placement support was outstanding.",
    avatar: "SG",
    rating: 5,
    stats: { score: "96%", hirable: "VERIFIED", time: "145 Days" },
  },
  {
    name: "Lakshmi Devi",
    role: "UI Developer @ Wipro",
    course: "UI/UX Design",
    text: "Zero design experience to a UI Developer role — AOTMS's structured program and mentors made it possible.",
    avatar: "LD",
    rating: 5,
    stats: { score: "99%", hirable: "EXPERT", time: "90 Days" },
  },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = useCallback(
    (newDirection: number) => {
      setDirection(newDirection);
      setCurrent(
        (prev) => (prev + newDirection + testimonials.length) % testimonials.length
      );
    },
    [testimonials.length]
  );

  useEffect(() => {
    const timer = setInterval(() => {
      paginate(1);
    }, 6000);
    return () => clearInterval(timer);
  }, [paginate]);

  const t = testimonials[current];

  return (
    <section
      id="testimonials"
      className="relative py-20 md:py-32 lg:py-40 bg-transparent overflow-hidden"
    >
      {/* ── Background Decors ─────────────────────────────────────────── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-[#0075CF]/5 blur-[80px] sm:blur-[150px] rounded-full pointer-events-none" />

      <div className="container-width px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 lg:mb-24"
        >
          <div className="inline-flex items-center gap-3 px-5 py-2 rounded-full bg-white border border-[#0075CF]/10 shadow-lg shadow-slate-200/50 text-[#0075CF] text-[10px] md:text-xs font-black uppercase tracking-[0.25em] mb-8">
            <span className="w-2 h-2 rounded-full bg-[#FD5A1A] animate-ping" />
            Verified Career Results
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 leading-[1.1] tracking-tighter">
            Impact That <span className="text-[#0075CF]">Speaks</span>{" "}
            <br className="hidden md:block" />
            <span className="text-[#FD5A1A]">For Itself</span>
          </h2>
          <p className="text-slate-500 text-base md:text-xl max-w-2xl mx-auto leading-relaxed font-medium px-4">
            Join the elite circle of graduates in Vijayawada who transformed their
            aspirations into career-defining roles.
          </p>
        </motion.div>

        <div className="relative w-full max-w-5xl mx-auto">
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={current}
              custom={direction}
              initial={{ opacity: 0, x: direction > 0 ? 50 : -50, scale: 0.98 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: direction > 0 ? -50 : 50, scale: 0.98 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
              className="relative w-full"
            >
              <div className="w-full bg-white/80 backdrop-blur-2xl rounded-[2.5rem] sm:rounded-[4rem] shadow-[0_40px_80px_-20px_rgba(0,117,207,0.12)] border border-slate-900/5 p-6 sm:p-10 md:p-16 flex flex-col lg:flex-row items-center gap-8 lg:gap-16 min-h-[450px]">
                
                {/* ── Left Side: Identity & Stats ───────────────────────── */}
                <div className="w-full lg:w-1/3 flex flex-col items-center">
                  <div className="relative mb-6 sm:mb-8">
                    <div className="w-24 h-24 sm:w-32 sm:h-32 md:w-44 md:h-44 rounded-3xl md:rounded-[2.5rem] bg-gradient-to-br from-[#0075CF] via-[#0075CF] to-[#3391D9] flex items-center justify-center text-white text-3xl sm:text-4xl md:text-5xl font-black shadow-2xl relative z-10 transition-transform duration-500 hover:scale-105">
                      {t.avatar}
                    </div>
                    {/* Orbit decoration */}
                    <div className="absolute -inset-4 border border-dashed border-[#0075CF]/20 rounded-[3rem] animate-[spin_12s_linear_infinite] hidden sm:block" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-white shadow-lg flex items-center justify-center border border-slate-100 p-2">
                       <Quote className="text-[#FD5A1A] w-full h-full" />
                    </div>
                  </div>

                  {/* Telemetry Snapshot */}
                  <div className="grid grid-cols-2 gap-3 w-full max-w-xs md:max-w-none">
                    <div className="bg-slate-50/80 p-3 sm:p-4 rounded-2xl border border-slate-100 text-center lg:text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Score
                      </p>
                      <p className="text-lg sm:text-xl font-black text-[#0075CF]">
                        {t.stats.score}
                      </p>
                    </div>
                    <div className="bg-slate-50/80 p-3 sm:p-4 rounded-2xl border border-slate-100 text-center lg:text-left">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
                        Rank
                      </p>
                      <p className="text-lg sm:text-xl font-black text-[#FD5A1A]">
                        {t.stats.hirable}
                      </p>
                    </div>
                  </div>
                </div>

                {/* ── Right Side: Narrative ─────────────────────────────── */}
                <div className="w-full lg:w-2/3 flex flex-col">
                  <div className="flex items-center gap-1.5 mb-6 justify-center lg:justify-start">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 sm:w-5 sm:h-5 ${i < t.rating ? "fill-[#FD5A1A] text-[#FD5A1A]" : "text-slate-200"}`}
                      />
                    ))}
                  </div>

                  <p className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black text-slate-900 leading-[1.3] tracking-tight mb-8 md:mb-12 italic text-center lg:text-left">
                    &ldquo;{t.text}&rdquo;
                  </p>

                  <div className="mt-auto flex flex-col sm:flex-row items-center sm:items-end justify-between border-t border-slate-100 pt-6 sm:pt-8 gap-4 sm:gap-0">
                    <div className="text-center lg:text-left">
                      <h4 className="text-xl sm:text-2xl font-black text-slate-900 mb-1">
                        {t.name}
                      </h4>
                      <p className="text-[#0075CF] text-sm sm:text-base font-bold tracking-tight">
                        {t.role}
                      </p>
                    </div>
                    <div className="text-center sm:text-right">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">
                        Verification
                      </p>
                      <div className="px-5 py-2 bg-[#E6F2FA] text-[#0075CF] text-[10px] sm:text-xs font-black rounded-full border border-[#0075CF]/15 shadow-sm">
                        {t.stats.time} TO HIRED
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* ── Navigation Orbital Controls ─────────────────────────────── */}
          <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex justify-between z-20 px-2 sm:px-0 pointer-events-none">
            <button
              onClick={() => paginate(-1)}
              className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-white shadow-xl flex items-center justify-center border border-slate-100 text-slate-400 hover:text-[#0075CF] hover:border-[#0075CF] hover:scale-110 active:scale-95 transition-all pointer-events-auto -ml-4 sm:-ml-8 lg:-ml-12"
              aria-label="Previous testimonial"
            >
              <ChevronLeft className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
            <button
              onClick={() => paginate(1)}
              className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 rounded-full bg-white shadow-xl flex items-center justify-center border border-slate-100 text-slate-400 hover:text-[#FD5A1A] hover:border-[#FD5A1A] hover:scale-110 active:scale-95 transition-all pointer-events-auto -mr-4 sm:-mr-8 lg:-mr-12"
              aria-label="Next testimonial"
            >
              <ChevronRight className="w-6 h-6 sm:w-8 sm:h-8" />
            </button>
          </div>
        </div>

        {/* ── Progress Indicators ─────────────────────────────────────── */}
        <div className="mt-12 sm:mt-16 flex items-center justify-center gap-3 sm:gap-4">
          {testimonials.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setDirection(i > current ? 1 : -1);
                setCurrent(i);
              }}
              className={`relative h-2 rounded-full overflow-hidden transition-all duration-700 ${
                i === current ? "w-12 sm:w-20" : "w-6 sm:w-10 bg-slate-200/50"
              }`}
            >
              {i === current && (
                <motion.div
                  initial={{ x: "-100%" }}
                  animate={{ x: "0%" }}
                  transition={{ duration: 0.5 }}
                  className="absolute inset-0 bg-[#0075CF]"
                />
              )}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
