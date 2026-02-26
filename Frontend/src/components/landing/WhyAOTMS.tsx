import { motion } from "framer-motion";
import {
  Users,
  Trophy,
  Briefcase,
  GraduationCap,
  Clock,
  HeadphonesIcon,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Industry-Ready Curriculum",
    description: "Learn skills that employers actually need.",
  },
  {
    icon: Users,
    title: "Expert Trainers",
    description: "10+ years of real industry experience.",
  },
  {
    icon: Briefcase,
    title: "100% Placement Support",
    description: "2000+ successful placements.",
  },
  {
    icon: Trophy,
    title: "Hands-On Projects",
    description: "Build real-world portfolio projects.",
  },
  {
    icon: Clock,
    title: "Flexible Timings",
    description: "Weekend batches available.",
  },
  {
    icon: HeadphonesIcon,
    title: "Lifetime Support",
    description: "Guidance after course completion.",
  },
];

const stats = [
  { value: "2000+", label: "Students Placed" },
  { value: "85%", label: "Placement Rate" },
  { value: "50+", label: "Hiring Partners" },
  { value: "4.8★", label: "Student Rating" },
];

const WhyAOTMS = () => {
  return (
    <section
      id="about"
      className="py-24 md:py-32 relative overflow-hidden bg-[#E9E9E9] font-['Inter']"
    >
      <div className="container-width px-4 md:px-8 lg:px-16 relative z-10">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-6 py-2 bg-[#0075CF] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white mb-8">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              Why Students Love Us
            </span>
          </div>
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-black mb-6 uppercase italic leading-[0.9]">
            Online Courses <br />
            <span className="text-[#0075CF]">Professional Training</span>
          </h2>
          <p className="text-black font-bold uppercase tracking-widest text-sm max-w-2xl mx-auto opacity-50">
            Vijayawada's most trusted LMS platform for skill-based learning and
            placement support.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="bg-white border-4 border-black p-8 text-center shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all"
            >
              <div className="text-4xl font-black text-[#FD5A1A] mb-1 italic">
                {stat.value}
              </div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-black opacity-40">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15 + index * 0.08 }}
            >
              <div className="h-full bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-[#E9E9E9] transition-all group relative">
                <div className="w-16 h-16 bg-[#0075CF] border-4 border-black flex items-center justify-center mb-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:bg-[#FD5A1A] transition-colors">
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-black text-black mb-3 uppercase tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-sm font-bold text-black/60 leading-relaxed">
                  {feature.description}
                </p>

                <div className="mt-8 flex items-center gap-2 text-[#0075CF] opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[10px] font-black uppercase tracking-widest">
                    Learn more
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyAOTMS;
