import { motion } from "framer-motion";
import AmbientBackground from "@/components/ui/AmbientBackground";
import {
  UserPlus,
  BookMarked,
  Video,
  ClipboardCheck,
  Trophy,
  ArrowRight,
} from "lucide-react";

const steps = [
  {
    icon: UserPlus,
    step: "01",
    title: "Sign Up & Create Profile",
    description:
      "Create your account and personalize your learning profile in minutes.",
  },
  {
    icon: BookMarked,
    step: "02",
    title: "Choose Your Course",
    description: "Browse and enroll in courses that match your career goals.",
  },
  {
    icon: Video,
    step: "03",
    title: "Attend Classes",
    description: "Join live sessions or watch recorded lectures at your pace.",
  },
  {
    icon: ClipboardCheck,
    step: "04",
    title: "Practice Mock Tests",
    description: "Sharpen your skills with real-world practice assessments.",
  },
  {
    icon: Trophy,
    step: "05",
    title: "Track Your Rank",
    description: "Complete exams and climb the leaderboard to stand out.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden border-t-4 border-black font-['Inter']">
      <div className="absolute inset-0 z-0">
        <AmbientBackground />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
      </div>

      <div className="container-width px-4 md:px-8 lg:px-16 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#FD5A1A] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white mb-8">
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              Your Learning Journey
            </span>
          </div>
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-black mb-6 uppercase italic leading-[0.9]">
            FROM ENROLLMENT TO <br />
            <span className="text-[#FD5A1A]">EMPLOYMENT</span>
          </h2>
          <p className="text-black font-bold uppercase tracking-widest text-sm max-w-2xl mx-auto opacity-50">
            A simple 5-step process to transform your career.
          </p>
        </motion.div>

        {/* Steps Grid */}
        <div className="relative">
          {/* Thick Connecting Line */}
          <div className="hidden lg:block absolute top-[40px] left-[10%] right-[10%] h-[4px] bg-black z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.step}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="relative group"
              >
                <div className="flex flex-col items-center text-center">
                  {/* Step Number Box */}
                  <div className="relative z-10 w-20 h-20 bg-white border-4 border-black flex items-center justify-center mb-8 shadow-[6px_6px_0px_0px_rgba(253,90,26,1)] group-hover:bg-[#FD5A1A] group-hover:translate-x-[2px] group-hover:translate-y-[2px] transition-all">
                    <span className="text-2xl font-black text-black group-hover:text-white italic">
                      {step.step}
                    </span>
                  </div>

                  {/* Content Card */}
                  <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[4px_4px_0px_0px_rgba(253,90,26,1)] group-hover:translate-x-[4px] group-hover:translate-y-[4px] transition-all h-full rounded-none">
                    <div className="w-10 h-10 bg-[#E9E9E9] border-2 border-black flex items-center justify-center mb-4 mx-auto group-hover:bg-[#FD5A1A] transition-colors">
                      <step.icon className="w-5 h-5 text-black group-hover:text-white" />
                    </div>
                    <h3 className="text-sm font-black text-black mb-3 uppercase tracking-wider italic">
                      {step.title}
                    </h3>
                    <p className="text-[11px] font-bold text-black/50 leading-relaxed uppercase tracking-widest">
                      {step.description}
                    </p>
                  </div>
                </div>

                {/* Mobile Arrows */}
                {index < steps.length - 1 && (
                  <div className="lg:hidden flex justify-center py-4">
                    <ArrowRight className="w-6 h-6 text-[#FD5A1A] rotate-90 sm:rotate-0" />
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
