import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { useState } from "react";
const TestBg = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="test-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E6F2FA" />
        <stop offset="45%" stopColor="#FDFEFE" />
        <stop offset="100%" stopColor="#FFF2EC" />
      </linearGradient>
    </defs>
    <rect width="1200" height="900" fill="url(#test-bg)" />

    {/* Top left cluster */}
    <polygon points="0,0 180,0 90,130" fill="#0075CF" opacity="0.11" />
    <polygon points="180,0 300,0 240,130" fill="#3391D9" opacity="0.10" />
    <polygon points="90,130 180,0 240,130" fill="#AADBFA" opacity="0.09" />

    {/* Top right cluster */}
    <polygon points="1200,0 1020,0 1110,130" fill="#FD5A1A" opacity="0.11" />
    <polygon points="1020,0 900,0 960,130" fill="#FD8C5E" opacity="0.10" />
    <polygon points="1110,130 1020,0 960,130" fill="#FEEDEA" opacity="0.09" />

    {/* Center top crown */}
    <polygon points="520,0 600,0 560,100" fill="#0075CF" opacity="0.09" />
    <polygon points="600,0 680,0 640,100" fill="#0075CF" opacity="0.09" />

    {/* Bottom left gradient */}
    <polygon points="0,620 200,680 100,800" fill="#FD5A1A" opacity="0.10" />

    {/* Bottom right gradient */}
    <polygon points="1200,620 1000,680 1100,800" fill="#0075CF" opacity="0.10" />

    {/* Constellation node dots */}
    <circle cx="0"    cy="0"   r="4"   fill="#0075CF" opacity="0.32" />
    <circle cx="180"  cy="0"   r="3.5" fill="#0075CF" opacity="0.28" />
    <circle cx="1200" cy="0"   r="4"   fill="#FD5A1A" opacity="0.32" />
    <circle cx="1020" cy="0"   r="3.5" fill="#FD5A1A" opacity="0.28" />
  </svg>
);

const testimonials = [
  { name: "Aditya Krishnan", role: "SDE-1 @ Microsoft",     course: "Full Stack Dev",  text: "AOTMS transformed my career. The live classes and hands-on projects helped me land my dream job within 6 months.", avatar: "AK", rating: 5 },
  { name: "Meera Nair",      role: "Data Analyst @ Infosys", course: "Data Science",    text: "The curriculum is perfectly aligned with industry needs. The ATS resume scoring feature was a complete game-changer.", avatar: "MN", rating: 5 },
  { name: "Sanjay Gupta",    role: "Cloud Architect @ TCS",  course: "Cloud Computing", text: "Excellent instructors. The secure exam system built my confidence and the placement support was outstanding.", avatar: "SG", rating: 5 },
  { name: "Lakshmi Devi",    role: "UI Developer @ Wipro",   course: "UI/UX Design",    text: "Zero design experience to a UI Developer role — AOTMS's structured program and mentors made it possible.", avatar: "LD", rating: 5 },
];

const Testimonials = () => {
  const [current, setCurrent] = useState(0);
  const prev = () => setCurrent((c) => (c === 0 ? testimonials.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === testimonials.length - 1 ? 0 : c + 1));
  const t = testimonials[current];

  return (
    <section id="testimonials" className="relative py-16 md:py-24 overflow-hidden">
      <TestBg />
      <div className="absolute inset-0 bg-[#FDFEFE]/60" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="text-center mb-12 md:mb-16">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF2EC] text-[#FD5A1A] text-xs font-bold uppercase tracking-widest mb-5">
            <Star className="w-3.5 h-3.5 fill-[#FD5A1A]" /> Success Stories
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
            What Our <span className="text-[#FD5A1A]">Students Say</span>
          </h2>
          <p className="text-slate-600 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Trusted by 2000+ graduates powering careers across India's top tech companies.
          </p>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          <div className="relative min-h-[320px]">
            <AnimatePresence mode="wait">
              <motion.div key={current} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}
                className="bg-white/90 backdrop-blur-md rounded-3xl border border-slate-100 shadow-lg p-7 md:p-10">
                <Quote className="w-10 h-10 text-[#FFF2EC] fill-[#FD5A1A]/10 mb-4" />
                <p className="text-slate-700 text-base md:text-lg leading-relaxed font-medium mb-7">"{t.text}"</p>
                <div className="flex items-center gap-1 mb-5">
                  {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />)}
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#0075CF] to-[#FD5A1A] flex items-center justify-center text-[#FDFEFE] font-black text-sm flex-shrink-0">{t.avatar}</div>
                  <div>
                    <p className="font-bold text-slate-900">{t.name}</p>
                    <p className="text-sm text-[#0075CF] font-semibold">{t.role}</p>
                  </div>
                  <div className="ml-auto"><span className="px-3 py-1 bg-[#FFF2EC] text-[#FD5A1A] rounded-lg text-[10px] font-bold uppercase tracking-wider">{t.course}</span></div>
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="flex items-center gap-3 mt-5">
              <button onClick={prev} className="w-11 h-11 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:border-[#AADBFA] hover:text-[#0075CF] transition-colors shadow-sm"><ChevronLeft className="w-5 h-5" /></button>
              <button onClick={next} className="w-11 h-11 rounded-xl border border-slate-200 bg-white/80 backdrop-blur-sm flex items-center justify-center hover:border-[#AADBFA] hover:text-[#0075CF] transition-colors shadow-sm"><ChevronRight className="w-5 h-5" /></button>
              <div className="flex gap-2 ml-2">
                {testimonials.map((_, i) => (
                  <button key={i} onClick={() => setCurrent(i)} className={`h-2 rounded-full transition-all duration-300 ${i === current ? "w-6 bg-[#0075CF]" : "w-2 bg-slate-200 hover:bg-slate-300"}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            {testimonials.map((item, i) => (
              <motion.button key={i} onClick={() => setCurrent(i)} initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}
                className={`flex items-start gap-4 p-4 rounded-2xl border text-left transition-all duration-200 w-full ${i === current ? "border-[#AADBFA] bg-[#E6F2FA]/80 backdrop-blur-sm shadow-md" : "border-slate-100 bg-white/80 backdrop-blur-sm hover:border-slate-200 hover:shadow-sm"}`}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-[#FDFEFE] font-black text-xs flex-shrink-0 ${i === current ? "bg-gradient-to-br from-[#0075CF] to-[#FD5A1A]" : "bg-slate-200 text-slate-600"}`}>{item.avatar}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 text-sm">{item.name}</p>
                  <p className="text-xs text-slate-400 truncate">{item.role}</p>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">{item.text}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
