import { motion } from "framer-motion";
import {
  Video,
  Play,
  ShieldCheck,
  Trophy,
  FileSearch,
  BarChart3,
  Headphones,
  MonitorPlay,
  ClipboardList,
  Medal,
  FileText,
  LineChart,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: Video,
    secondaryIcon: Headphones,
    title: "Live Classes",
    description:
      "Interactive sessions with industry experts via Zoom, Google Meet & more",
    theme: "blue" as const,
  },
  {
    icon: MonitorPlay,
    secondaryIcon: Play,
    title: "Recorded Videos",
    description: "Access HD course content anytime, anywhere on any device",
    theme: "orange" as const,
  },
  {
    icon: ShieldCheck,
    secondaryIcon: ClipboardList,
    title: "Secure Exams",
    description:
      "AI-proctored assessments with integrity & anti-cheating measures",
    theme: "blue" as const,
  },
  {
    icon: Trophy,
    secondaryIcon: Medal,
    title: "Leaderboard",
    description: "Compete with peers and track your ranking in real-time",
    theme: "orange" as const,
  },
  {
    icon: FileSearch,
    secondaryIcon: FileText,
    title: "ATS Resume Score",
    description: "Optimize your resume for job applications with AI analysis",
    theme: "blue" as const,
  },
  {
    icon: BarChart3,
    secondaryIcon: LineChart,
    title: "Progress Tracking",
    description: "Monitor your learning journey with detailed analytics",
    theme: "orange" as const,
  },
];

const themeStyles = {
  blue: {
    iconBg: "bg-[#0075CF]",
    shadow: "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    hoverShadow: "hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
    textHover: "group-hover:text-[#0075CF]",
    accentColor: "text-[#0075CF]",
    barBg: "bg-[#0075CF]",
    secondaryBg: "bg-[#0075CF]/10",
    secondaryText: "text-[#0075CF]",
  },
  orange: {
    iconBg: "bg-[#FD5A1A]",
    shadow: "shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]",
    hoverShadow: "hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]",
    textHover: "group-hover:text-[#FD5A1A]",
    accentColor: "text-[#FD5A1A]",
    barBg: "bg-[#FD5A1A]",
    secondaryBg: "bg-[#FD5A1A]/10",
    secondaryText: "text-[#FD5A1A]",
  },
};

const KeyFeatures = () => {
  return (
    <section
      id="features"
      className="py-16 md:py-32 relative overflow-hidden bg-[#0075CF] font-['Inter']"
    >
      {/* Background patterns */}
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

      <div className="container-width px-4 md:px-8 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-4 mb-8">
            <span className="h-1.5 w-12 bg-black" />
            <span className="text-sm font-black tracking-[0.3em] uppercase text-white">
              Platform Features
            </span>
            <span className="h-1.5 w-12 bg-black" />
          </div>
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-white mb-6 uppercase italic leading-[0.9]">
            Advanced <span className="text-black">Learning</span> <br />
            Powered By <span className="text-white">AOTMS</span>
          </h2>
          <p className="text-white font-bold uppercase tracking-widest text-sm max-w-2xl mx-auto opacity-40">
            Everything you need for a competitive edge — from live sessions to
            AI resume analysis.
          </p>
        </motion.div>

        {/* Features Grid - Horizontal Scroll on Mobile */}
        <div className="flex overflow-x-auto pb-8 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 gap-8 snap-x snap-mandatory hide-scrollbar">
          {features.map((feature, index) => {
            const style = themeStyles[feature.theme];
            return (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="w-[85vw] sm:w-auto shrink-0 snap-center"
              >
                <div className="h-full bg-white border-4 border-black p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group relative rounded-none flex flex-col">
                  {/* Decorative corner tag */}
                  <div
                    className={`absolute top-0 right-0 p-3 border-l-4 border-b-4 border-black font-black text-[10px] tracking-widest uppercase ${feature.theme === "blue" ? "bg-[#0075CF] text-white" : "bg-[#FD5A1A] text-white"}`}
                  >
                    {feature.theme}
                  </div>

                  <div
                    className={`w-16 h-16 md:w-20 md:h-20 border-4 border-black flex items-center justify-center mb-6 md:mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${style.iconBg} transition-colors shrink-0`}
                  >
                    <feature.icon className="w-8 h-8 md:w-10 md:h-10 text-white" />
                  </div>

                  <h3 className="text-xl md:text-2xl font-black text-black mb-3 md:mb-4 uppercase tracking-tight italic">
                    {feature.title}
                  </h3>
                  <p className="text-xs md:text-[13px] font-bold text-black/60 leading-relaxed uppercase tracking-wider mb-6 md:mb-8 flex-1">
                    {feature.description}
                  </p>

                  <div
                    className={`flex items-center gap-2 md:gap-3 font-black text-[10px] tracking-[0.2em] uppercase ${style.accentColor} group-hover:translate-x-2 transition-transform mt-auto`}
                  >
                    Explore Feature <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom Metrics Bar */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-24 bg-[#E9E9E9] border-4 border-black p-10 shadow-[12px_12px_0px_0px_rgba(0,117,207,1)]"
        >
          <div className="flex flex-wrap justify-center gap-12 md:gap-24">
            {[
              { value: "24/7", label: "ACCESS", color: "#0075CF" },
              { value: "4K", label: "VIDEO", color: "#FD5A1A" },
              { value: "AI", label: "PROCTORED", color: "black" },
              { value: "LIVE", label: "UPDATES", color: "#0075CF" },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <div
                  className="text-4xl md:text-5xl font-black mb-2 italic transition-transform group-hover:scale-110"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.3em] text-black opacity-40">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default KeyFeatures;
