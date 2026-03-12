import { motion } from "framer-motion";
import { Linkedin, Twitter, Users } from "lucide-react";

const InstBg = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="inst-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E6F2FA" />
        <stop offset="50%" stopColor="#FDFEFE" />
        <stop offset="100%" stopColor="#FFF2EC" />
      </linearGradient>
    </defs>
    <rect width="1200" height="800" fill="url(#inst-bg)" />
    {/* Left blue crystal pillar */}
    <polygon points="0,0 80,0 40,70" fill="#0075CF" opacity="0.14" />
    <polygon points="80,0 160,0 120,70" fill="#3391D9" opacity="0.12" />
    <polygon points="40,70 80,0 120,70" fill="#0066B3" opacity="0.11" />
    {/* Right orange crystal pillar */}
    <polygon points="1200,0 1120,0 1160,70" fill="#FD5A1A" opacity="0.14" />
    <polygon points="1120,0 1040,0 1080,70" fill="#FD8C5E" opacity="0.12" />
    <polygon points="1160,70 1120,0 1080,70" fill="#E34D14" opacity="0.11" />

    {/* Nodes */}
    <circle cx="0"    cy="0"   r="3.5" fill="#0075CF" opacity="0.28" />
    <circle cx="40"   cy="70"  r="3"   fill="#0075CF" opacity="0.26" />
    <circle cx="1200" cy="0"   r="3.5" fill="#FD5A1A" opacity="0.28" />
    <circle cx="1160" cy="70"  r="3"   fill="#FD5A1A" opacity="0.26" />

    {/* Edge lines */}
    <line x1="0"    y1="0" x2="0"    y2="800" stroke="#0075CF" strokeWidth="1.5" opacity="0.14" />
    <line x1="1200" y1="0" x2="1200" y2="800" stroke="#FD5A1A" strokeWidth="1.5" opacity="0.14" />
  </svg>
);

const instructors = [
  { name: "Dr. Rajesh Kumar",  expertise: "Full Stack Dev",   exp: "15+ Yrs", image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop&crop=face" },
  { name: "Priya Menon",       expertise: "Data Science & AI", exp: "12+ Yrs", image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop&crop=face" },
  { name: "Amit Sharma",       expertise: "Cloud & DevOps",   exp: "10+ Yrs", image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face" },
  { name: "Sneha Reddy",       expertise: "UI/UX Design",     exp: "8+ Yrs",  image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=400&fit=crop&crop=face" },
];

const Instructors = () => (
  <section id="trainers" className="relative py-16 md:py-24 overflow-hidden">
    <InstBg />
    <div className="absolute inset-0 bg-[#FDFEFE]/60" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="text-center mb-12 md:mb-16">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F2FA] text-[#0075CF] text-xs font-bold uppercase tracking-widest mb-5">
          <Users className="w-3.5 h-3.5" /> Expert Mentors
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
          Learn From The <span className="text-[#0075CF]">Best in Tech</span>
        </h2>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          Our mentors don't just teach — they've built systems at scale.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
        {instructors.map((inst, i) => (
          <motion.div key={inst.name} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.08 }} className="group">
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300">
              <div className="relative h-56 sm:h-60 overflow-hidden">
                <img src={inst.image} alt={inst.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0075CF]/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4 gap-3">
                  <a href="#" className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-[#E6F2FA] transition-colors shadow-md"><Linkedin className="w-4 h-4 text-[#0075CF]" /></a>
                  <a href="#" aria-label="LinkedIn" className="w-9 h-9 rounded-full bg-white flex items-center justify-center hover:bg-[#E6F2FA] transition-colors shadow-md"><Users className="w-4 h-4 text-[#0075CF]" /></a>
                </div>
              </div>
              <div className="p-5 text-center">
                <h3 className="font-bold text-slate-900 text-base mb-1">{inst.name}</h3>
                <p className="text-sm font-semibold text-[#FD5A1A] mb-1">{inst.expertise}</p>
                <p className="text-xs text-slate-400 font-medium">{inst.exp} Experience</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default Instructors;
