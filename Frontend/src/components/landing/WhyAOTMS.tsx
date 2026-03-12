import { motion } from "framer-motion";
import {
  GraduationCap, Users, Briefcase,
  Trophy, Clock, HeadphonesIcon, Sparkles,
} from "lucide-react";

/**
 * WhyAOTMS — Neural Network Low-Poly
 * Dense triangular mesh with blue circle nodes + hairline connections
 */
const WhyBg = () => (
  <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <linearGradient id="why-bg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0%" stopColor="#E6F2FA" />
        <stop offset="50%" stopColor="#FDFEFE" />
        <stop offset="100%" stopColor="#FFF2EC" />
      </linearGradient>
    </defs>
    <rect width="1200" height="900" fill="url(#why-bg)" />

    {/* === Dense Triangle Mesh — Row 1 === */}
    <polygon points="0,0 100,0 50,80" fill="#0075CF" opacity="0.13" />
    <polygon points="100,0 200,0 150,80" fill="#3391D9" opacity="0.11" />
    <polygon points="200,0 300,0 250,80" fill="#0075CF" opacity="0.12" />
    <polygon points="300,0 400,0 350,80" fill="#0066B3" opacity="0.10" />
    <polygon points="400,0 500,0 450,80" fill="#3391D9" opacity="0.12" />
    <polygon points="500,0 600,0 550,80" fill="#0075CF" opacity="0.11" />
    <polygon points="600,0 700,0 650,80" fill="#FD5A1A" opacity="0.12" />
    <polygon points="700,0 800,0 750,80" fill="#FD8C5E" opacity="0.10" />
    <polygon points="800,0 900,0 850,80" fill="#FD5A1A" opacity="0.13" />
    <polygon points="900,0 1000,0 950,80" fill="#0075CF" opacity="0.11" />
    <polygon points="1000,0 1100,0 1050,80" fill="#3391D9" opacity="0.12" />
    <polygon points="1100,0 1200,0 1150,80" fill="#0075CF" opacity="0.10" />

    {/* Inverse Row 1 */}
    <polygon points="50,80 100,0 150,80" fill="#AADBFA" opacity="0.10" />
    <polygon points="150,80 200,0 250,80" fill="#DDEFFC" opacity="0.11" />
    <polygon points="250,80 300,0 350,80" fill="#AADBFA" opacity="0.10" />
    <polygon points="350,80 400,0 450,80" fill="#DDEFFC" opacity="0.11" />
    <polygon points="450,80 500,0 550,80" fill="#FDFEFE" opacity="0.10" />
    <polygon points="550,80 600,0 650,80" fill="#FEEDEA" opacity="0.11" />
    <polygon points="650,80 700,0 750,80" fill="#FFC9B1" opacity="0.10" />
    <polygon points="750,80 800,0 850,80" fill="#FEEDEA" opacity="0.11" />
    <polygon points="850,80 900,0 950,80" fill="#AADBFA" opacity="0.10" />
    <polygon points="950,80 1000,0 1050,80" fill="#DDEFFC" opacity="0.11" />
    <polygon points="1050,80 1100,0 1150,80" fill="#AADBFA" opacity="0.10" />

    {/* Row 2 */}
    <polygon points="0,80 50,80 0,160" fill="#0066B3" opacity="0.11" />
    <polygon points="50,80 150,80 100,160" fill="#3391D9" opacity="0.09" />
    <polygon points="150,80 250,80 200,160" fill="#AADBFA" opacity="0.10" />
    <polygon points="250,80 350,80 300,160" fill="#FD8C5E" opacity="0.09" />
    <polygon points="350,80 450,80 400,160" fill="#FD5A1A" opacity="0.10" />
    <polygon points="450,80 550,80 500,160" fill="#E34D14" opacity="0.09" />
    <polygon points="1150,80 1200,80 1200,160" fill="#0066B3" opacity="0.11" />

    {/* Middle row etc — simplified for brevity since SVG is huge */}
    {/* Bottom orange accent */}
    <circle cx="600"  cy="0"   r="4"   fill="#FD5A1A" opacity="0.30" />
    <circle cx="650"  cy="80"  r="3"   fill="#FD5A1A" opacity="0.28" />
    <circle cx="500"  cy="160" r="3"   fill="#FD5A1A" opacity="0.22" />

    {/* === Circuit Trace Lines === */}
    <line x1="0" y1="0" x2="1200" y2="0" stroke="#0075CF" strokeWidth="0.5" opacity="0.12" />
    <line x1="600" y1="0" x2="600" y2="900" stroke="#FD5A1A" strokeWidth="0.4" strokeDasharray="8 6" opacity="0.08" />
  </svg>
);

const features = [
  { icon: GraduationCap, title: "Industry-Ready Curriculum", description: "Updated quarterly with latest tech stacks and real employer requirements.", color: "bg-[#0075CF]" },
  { icon: Users, title: "Expert Industry Trainers", description: "Learn from working professionals with 8–15 years of real-world experience.", color: "bg-[#FD5A1A]" },
  { icon: Briefcase, title: "100% Placement Support", description: "Career cell with 2000+ successful placements across top tech companies.", color: "bg-[#0075CF]" },
  { icon: Trophy, title: "Hands-On Projects", description: "Build 3–5 portfolio projects per course that instantly impress recruiters.", color: "bg-[#FD5A1A]" },
  { icon: Clock, title: "Flexible Timings", description: "Morning, afternoon, evening & weekend batches for every lifestyle.", color: "bg-[#0075CF]" },
  { icon: HeadphonesIcon, title: "Lifetime Support", description: "Post-course mentorship, community access, and career guidance — forever.", color: "bg-[#FD5A1A]" },
];

const WhyAOTMS = () => (
  <section id="about" className="relative py-16 md:py-24 overflow-hidden">
    <WhyBg />
    <div className="absolute inset-0 bg-[#FDFEFE]/70" />
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }} className="text-center mb-12 md:mb-16">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E6F2FA] text-[#0075CF] text-xs font-bold uppercase tracking-widest mb-5">
          <Sparkles className="w-3.5 h-3.5" /> Why AOTMS
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 mb-4 leading-tight tracking-tight">
          Why Students Choose <span className="text-[#0075CF]">AOTMS</span>
        </h2>
        <p className="text-slate-600 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
          We don't just teach code — we build careers. Join thousands of graduates shaping the future of tech.
        </p>
      </motion.div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6 mb-16">
        {features.map((f, i) => (
          <motion.div key={f.title} initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07 }}>
            <div className="h-full bg-white/85 backdrop-blur-sm rounded-2xl p-6 md:p-8 border border-slate-100 shadow-sm hover:shadow-[#0075CF]/10 hover:shadow-lg hover:-translate-y-1.5 transition-all duration-300 group flex flex-col">
              <div className={`w-12 h-12 rounded-xl ${f.color} flex items-center justify-center mb-5 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <f.icon className="w-6 h-6 text-[#FDFEFE]" />
              </div>
              <h3 className="text-lg md:text-xl font-bold text-slate-900 mb-2 leading-snug">{f.title}</h3>
              <p className="text-slate-500 text-sm md:text-base leading-relaxed flex-1">{f.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
      <motion.div initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.2 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-6 bg-white/85 backdrop-blur-sm rounded-2xl p-6 md:p-10 border border-slate-100 shadow-sm">
        {[
          { value: "2000+", label: "Students Placed", color: "text-[#0075CF]" },
          { value: "85%",   label: "Placement Rate",  color: "text-[#FD5A1A]" },
          { value: "100+",  label: "Hiring Partners", color: "text-[#0075CF]" },
          { value: "4.9★",  label: "Student Rating",  color: "text-[#FD5A1A]" },
        ].map((s) => (
          <div key={s.label} className="text-center">
            <div className={`text-3xl md:text-4xl lg:text-5xl font-black ${s.color} tracking-tighter`}>{s.value}</div>
            <div className="text-xs md:text-sm font-semibold text-slate-400 uppercase tracking-widest mt-1">{s.label}</div>
          </div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default WhyAOTMS;
