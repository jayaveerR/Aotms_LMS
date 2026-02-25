import { motion } from "framer-motion";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { Button } from "@/components/ui/button";
import { ArrowRight, BookOpen, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CTASection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 md:py-32 relative overflow-hidden bg-black font-['Inter']">
      {/* Background patterns */}
      <div className="absolute inset-0 z-0">
        <AmbientBackground />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
      </div>

      <div className="container-width px-4 md:px-8 lg:px-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-4xl mx-auto"
        >
          {/* Badge */}
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#FD5A1A] border-2 border-white shadow-[4px_4px_0px_0px_rgba(255,255,255,1)] text-white mb-12 rotate-[-1deg]">
            <Sparkles className="w-4 h-4" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              Start Your Journey Today
            </span>
          </div>

          {/* Heading */}
          <h2 className="font-heading text-5xl md:text-6xl lg:text-7xl text-white mb-8 uppercase italic leading-[0.9]">
            READY TO <span className="text-[#0075CF]">LEVEL UP</span> <br />
            YOUR <span className="text-[#FD5A1A]">CAREER?</span>
          </h2>

          <p className="text-white font-bold uppercase tracking-widest text-sm mb-16 opacity-40 max-w-2xl mx-auto leading-relaxed">
            Join thousands of students in Vijayawada mastering skills that
            world-class companies actually want.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mb-20">
            <Button
              className="h-20 px-12 bg-[#FD5A1A] text-white border-4 border-black text-xl font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(0,117,207,1)] hover:bg-[#0075CF] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all rounded-none group"
              onClick={() => navigate("/auth")}
            >
              Get Started Now
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button
              className="h-20 px-12 bg-white text-black border-4 border-black text-xl font-black uppercase tracking-widest shadow-[8px_8px_0px_0px_rgba(253,90,26,1)] hover:bg-[#E9E9E9] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all rounded-none gap-3"
              onClick={() => navigate("/courses")}
            >
              Browse Library
            </Button>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-12 border-t-4 border-white/10">
            {[
              { label: "Students Trained", value: "2000+", color: "#0075CF" },
              { label: "Placement Rate", value: "85%", color: "#FD5A1A" },
              { label: "Expert Instructors", value: "50+", color: "white" },
            ].map((item) => (
              <div
                key={item.label}
                className="bg-white/5 border-2 border-white/20 p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:border-white transition-colors"
              >
                <div
                  className="text-3xl font-black mb-1 italic"
                  style={{ color: item.color }}
                >
                  {item.value}
                </div>
                <div className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40">
                  {item.label}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
