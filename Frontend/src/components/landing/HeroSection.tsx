import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, BookOpen, Trophy, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Low-poly triangle mosaic background pattern (matching the blue-to-orange screenshot)
const LowPolyBackground = () => (
  <svg
    className="absolute inset-0 w-full h-full"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1200 700"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bg-grad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#0075CF" />
        <stop offset="35%" stopColor="#3391D9" />
        <stop offset="55%" stopColor="#FDFEFE" />
        <stop offset="75%" stopColor="#FD8C5E" />
        <stop offset="100%" stopColor="#FD5A1A" />
      </linearGradient>
      <filter id="noise" x="0%" y="0%" width="100%" height="100%">
        <feTurbulence
          type="fractalNoise"
          baseFrequency="0.65"
          numOctaves="3"
          stitchTiles="stitch"
        />
        <feColorMatrix type="saturate" values="0" />
        <feBlend in="SourceGraphic" mode="multiply" result="blend" />
        <feComposite in="blend" in2="SourceGraphic" operator="in" />
      </filter>
    </defs>
    {/* Base gradient fill */}
    <rect width="1200" height="700" fill="url(#bg-grad)" />
    {/* Top row – blue tones */}
    <polygon points="0,0 120,80 0,160" fill="#0066B3" opacity="0.85" />
    <polygon points="0,0 200,0 120,80" fill="#0075CF" opacity="0.9" />
    <polygon points="200,0 320,90 120,80" fill="#005A9C" opacity="0.8" />
    <polygon points="200,0 400,0 320,90" fill="#0084EA" opacity="0.85" />
    <polygon points="400,0 480,75 320,90" fill="#1A83D4" opacity="0.9" />
    <polygon points="400,0 600,0 480,75" fill="#006BBF" opacity="0.8" />
    <polygon points="600,0 640,80 480,75" fill="#208CD9" opacity="0.75" />
    <polygon points="600,0 800,0 640,80" fill="#005EAD" opacity="0.85" />
    <polygon points="800,0 860,70 640,80" fill="#007ACC" opacity="0.8" />
    <polygon points="800,0 1000,0 860,70" fill="#006EB3" opacity="0.9" />
    <polygon points="1000,0 1080,85 860,70" fill="#005A9C" opacity="0.85" />
    <polygon points="1000,0 1200,0 1080,85" fill="#007DCF" opacity="0.8" />
    <polygon points="1200,0 1200,150 1080,85" fill="#005286" opacity="0.9" />
    {/* Second row – transitioning to lighter blue/grey */}
    <polygon points="0,160 120,80 200,170" fill="#3391D9" opacity="0.8" />
    <polygon points="0,160 200,170 0,280" fill="#4DA7E2" opacity="0.75" />
    <polygon points="120,80 320,90 200,170" fill="#2686C9" opacity="0.85" />
    <polygon points="200,170 320,90 440,180" fill="#66BDEC" opacity="0.8" />
    <polygon points="320,90 480,75 440,180" fill="#409AD4" opacity="0.75" />
    <polygon points="440,180 480,75 620,170" fill="#80CEF3" opacity="0.8" />
    <polygon points="480,75 640,80 620,170" fill="#66BDEC" opacity="0.85" />
    <polygon points="620,170 640,80 800,160" fill="#99DFF9" opacity="0.8" />
    <polygon points="640,80 860,70 800,160" fill="#80CEF3" opacity="0.75" />
    <polygon points="800,160 860,70 1000,175" fill="#A6E5FA" opacity="0.8" />
    <polygon points="860,70 1080,85 1000,175" fill="#80CEF3" opacity="0.85" />
    <polygon points="1000,175 1080,85 1200,150" fill="#66BDEC" opacity="0.8" />
    <polygon
      points="1000,175 1200,150 1200,280"
      fill="#99DFF9"
      opacity="0.75"
    />
    {/* Middle row – warm white/light transition */}
    <polygon points="0,280 200,170 240,300" fill="#FDFEFE" opacity="0.7" />
    <polygon points="0,280 240,300 0,420" fill="#FDFEFE" opacity="0.75" />
    <polygon points="200,170 440,180 350,310" fill="#FDFEFE" opacity="0.7" />
    <polygon points="200,170 350,310 240,300" fill="#FDFEFE" opacity="0.75" />
    <polygon points="440,180 620,170 540,305" fill="#FDFEFE" opacity="0.8" />
    <polygon points="350,310 440,180 540,305" fill="#FDFEFE" opacity="0.75" />
    <polygon points="540,305 620,170 760,300" fill="#FDFEFE" opacity="0.8" />
    <polygon points="620,170 800,160 760,300" fill="#FDFEFE" opacity="0.75" />
    <polygon points="760,300 800,160 980,295" fill="#FDFEFE" opacity="0.8" />
    <polygon points="800,160 1000,175 980,295" fill="#FDFEFE" opacity="0.75" />
    <polygon points="980,295 1000,175 1200,280" fill="#FDFEFE" opacity="0.8" />
    <polygon points="980,295 1200,280 1200,400" fill="#FDFEFE" opacity="0.7" />
    {/* Lower middle – orange transition */}
    <polygon points="0,420 240,300 280,440" fill="#FD8C5E" opacity="0.8" />
    <polygon points="0,420 280,440 0,540" fill="#FD7A45" opacity="0.85" />
    <polygon points="240,300 540,305 420,435" fill="#FD9C73" opacity="0.8" />
    <polygon points="240,300 420,435 280,440" fill="#FD7A45" opacity="0.75" />
    <polygon points="420,435 540,305 680,430" fill="#FD8C5E" opacity="0.8" />
    <polygon points="540,305 760,300 680,430" fill="#FD7A45" opacity="0.75" />
    <polygon points="680,430 760,300 900,425" fill="#FD8C5E" opacity="0.8" />
    <polygon points="760,300 980,295 900,425" fill="#FD7A45" opacity="0.75" />
    <polygon points="900,425 980,295 1200,400" fill="#FD8C5E" opacity="0.8" />
    <polygon points="900,425 1200,400 1200,530" fill="#FD7A45" opacity="0.75" />
    {/* Bottom – deep orange */}
    <polygon points="0,540 280,440 320,560" fill="#FD5A1A" opacity="0.9" />
    <polygon points="0,540 320,560 0,700" fill="#E34D14" opacity="0.85" />
    <polygon points="280,440 420,435 400,570" fill="#FD6D33" opacity="0.85" />
    <polygon points="280,440 400,570 320,560" fill="#FD5A1A" opacity="0.9" />
    <polygon points="400,570 420,435 600,555" fill="#FD6D33" opacity="0.85" />
    <polygon points="420,435 680,430 600,555" fill="#FD5A1A" opacity="0.9" />
    <polygon points="600,555 680,430 840,550" fill="#FD6D33" opacity="0.85" />
    <polygon points="680,430 900,425 840,550" fill="#FD5A1A" opacity="0.9" />
    <polygon points="840,550 900,425 1100,545" fill="#FD6D33" opacity="0.85" />
    <polygon points="900,425 1200,530 1100,545" fill="#FD5A1A" opacity="0.9" />
    <polygon
      points="1100,545 1200,530 1200,700"
      fill="#E34D14"
      opacity="0.85"
    />
    <polygon points="0,700 320,560 400,700" fill="#CC4511" opacity="0.9" />
    <polygon points="320,560 600,555 500,700" fill="#E34D14" opacity="0.85" />
    <polygon points="600,555 840,550 700,700" fill="#CC4511" opacity="0.9" />
    <polygon points="840,550 1100,545 900,700" fill="#E34D14" opacity="0.85" />
    <polygon points="1100,545 1200,700 1000,700" fill="#FD5A1A" opacity="0.9" />
    <polygon points="400,700 500,700 0,700" fill="#B23C0F" opacity="0.85" />
    <polygon points="500,700 700,700 600,700" fill="#E34D14" opacity="0.8" />
    <polygon points="700,700 900,700 800,700" fill="#B23C0F" opacity="0.85" />
    <polygon points="900,700 1000,700 1200,700" fill="#E34D14" opacity="0.8" />
  </svg>
);

const HeroSection = () => {
  const navigate = useNavigate();

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16">
      {/* Background — UNCHANGED */}
      <LowPolyBackground />

      {/* ── High-Key Contrast Layers ──────────────────────────────────────
           Using a 'White Lift' system ensures dark navy text is crisp without
           the 'blacky' look. Dual layer: Global wash + centre spotlight.   */}
      <div className="absolute inset-0 bg-white/[0.15] -z-10" />
      <div
        className="absolute inset-0 pointer-events-none -z-10"
        style={{
          background: "radial-gradient(circle at 50% 45%, rgba(255,255,255,0.4) 0%, rgba(255,255,255,0.1) 60%, transparent 100%)",
        }}
      />

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="container-width section-padding relative z-10 w-full pt-20 md:pt-0 mt-4 sm:mt-8 md:mt-12">
        <div className="max-w-5xl mx-auto text-center px-4 sm:px-6">

          {/* ── Badge ──────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full bg-slate-900/[0.04] backdrop-blur-md border border-slate-900/10 text-slate-900 text-[10px] sm:text-xs md:text-sm font-bold mb-8 md:mb-12 tracking-widest uppercase shadow-sm">
              <span className="relative flex h-2 w-2 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FD5A1A] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#FD5A1A]" />
              </span>
              Vijayawada&apos;s #1 EdTech Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.1 }}
            className="font-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.1] md:leading-[1.06] tracking-tight mb-4 md:mb-6 text-center font-extrabold"
          >
            <span className="text-slate-900">Unlock Your</span>
            <br />
            <span className="inline-block bg-gradient-to-br from-[#FD8C5E] via-[#FD5A1A] to-[#D93A00] bg-clip-text text-transparent">
              Future, Today.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="text-sm sm:text-lg md:text-xl text-slate-800 max-w-2xl mx-auto mb-8 md:mb-12 leading-relaxed font-semibold"
          >
            Master in-demand skills with live classes, structured courses, and
            industry-aligned assessments — all in one place.
          </motion.p>

          {/* ── CTAs ───────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4"
          >
            <Button
              size="xl"
              className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl text-white font-bold text-sm md:text-base shadow-lg hover:scale-105 active:scale-95 transition-all duration-300 group gap-2 border-0"
              style={{
                background: "linear-gradient(135deg, #3391D9 0%, #0075CF 100%)",
                boxShadow: "0 8px 16px rgba(0,117,207,0.2)",
              }}
              onClick={() => navigate("/auth")}
            >
              Start Learning Free
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform shrink-0" />
            </Button>

            <Button
              size="xl"
              className="w-full sm:w-auto h-12 md:h-14 px-8 md:px-10 rounded-xl md:rounded-2xl font-bold text-sm md:text-base shadow-sm hover:scale-105 active:scale-95 transition-all duration-300 gap-2 backdrop-blur-sm text-slate-900 border border-slate-200 bg-white/40 hover:bg-white/60"
              onClick={() => navigate("/student-dashboard")}
            >
              <Play className="w-4 h-4 fill-current shrink-0" />
              See How It Works
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.45 }}
            className="flex flex-wrap items-center justify-center gap-2 mt-8 md:mt-10 mb-8 md:mb-12"
          >
            {[
              { icon: BookOpen, text: "100+ Expert Courses"  },
              { icon: Users,    text: "10K+ Active Learners" },
              { icon: Trophy,   text: "95% Job Placement"    },
            ].map((item, i) => (
              <div
                key={i}
                className="flex items-center gap-1.5 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-slate-900/[0.05] backdrop-blur-sm border border-slate-900/10 text-slate-800 text-[10px] md:text-sm font-semibold tracking-wide"
              >
                <item.icon className="w-4 h-4 text-slate-950 shrink-0" />
                {item.text}
              </div>
            ))}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.55 }}
            className="relative mt-12 md:mt-24 pt-8 md:border-t md:border-slate-900/10"
          >
            {/* Glass Container — ensuring stats are readable against dark poly */}
            <div className="absolute -inset-x-4 -inset-y-2 md:-inset-x-12 md:-inset-y-6 bg-white/30 backdrop-blur-md rounded-2xl md:rounded-3xl -z-10" />

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-y-6 md:gap-y-0 gap-x-4">
              {[
                { value: "10K+", label: "Learners" },
                { value: "50+",  label: "Mentors"  },
                { value: "100+", label: "Programs" },
                { value: "95%",  label: "Success"  },
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <p className="text-2xl md:text-4xl font-black text-slate-900">
                    {stat.value}
                  </p>
                  <p className="text-[10px] md:text-xs text-slate-600 mt-1 font-bold tracking-widest uppercase">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default HeroSection;
