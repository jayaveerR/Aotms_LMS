import { motion } from "framer-motion";
import {
  Route,
  BookOpen,
  Video,
  FileCheck,
  Trophy,
  Briefcase,
} from "lucide-react";

const steps = [
  {
    icon: Route,
    title: "INITIATE_STRATEGY",
    description: "CHOOSE YOUR PATH AND DEFINE YOUR DESTINY",
  },
  {
    icon: BookOpen,
    title: "COGNITIVE_UPLOAD",
    description: "ABSORB KNOWLEDGE IN THE OPTIMAL SEQUENCE",
  },
  {
    icon: Video,
    title: "LIVE_SYNCED_DATA",
    description: "JOIN LIVE SESSIONS OR ACCESS RECORDED ARCHIVES",
  },
  {
    icon: FileCheck,
    title: "STRESS_ANALYSIS",
    description: "TEST YOUR BOUNDARIES WITH RIGOROUS EVALUATIONS",
  },
  {
    icon: Trophy,
    title: "ASCEND_RANKINGS",
    description: "CRUSH THE COMPETITION ON THE GLOBAL LEADERBOARD",
  },
  {
    icon: Briefcase,
    title: "MISSION_DEPLOY",
    description: "ENTER THE FIELD WITH UNSTOPPABLE CONFIDENCE",
  },
];

const HowPathsWork = () => {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
      <div className="container-width px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl md:text-5xl font-black text-black uppercase italic mb-4">
            MISSION <br />
            <span className="text-[#0075CF]">EXECUTION</span>
          </h2>
          <p className="text-black font-bold uppercase tracking-widest text-sm opacity-60 max-w-2xl mx-auto">
            A precise, algorithmic process to transform you into an elite
            professional.
          </p>
        </motion.div>

        {/* Global Flow Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group h-full"
            >
              <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[12px_12px_0px_0px_rgba(253,90,26,1)] group-hover:border-[#FD5A1A] transition-all h-full">
                <div className="absolute -top-6 -left-6 w-12 h-12 bg-black text-white border-4 border-black flex items-center justify-center font-black italic shadow-[4px_4px_0px_0px_#FD5A1A] group-hover:bg-[#FD5A1A] group-hover:shadow-none transition-colors">
                  0{index + 1}
                </div>

                <div className="mb-6 mt-2">
                  <div className="w-16 h-16 bg-[#E9E9E9] border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000000] group-hover:bg-white transition-colors">
                    <step.icon className="w-8 h-8 text-black" />
                  </div>
                </div>

                <h3 className="text-xl font-black text-black uppercase italic mb-3 tracking-tighter">
                  {step.title}
                </h3>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/50 leading-relaxed">
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowPathsWork;
