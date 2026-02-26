import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const TechBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {/* Tech grid */}
    <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_50%,#000_70%,transparent_100%)]" />

    {/* Floating tech nodes */}
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: [0, -30, 0],
          opacity: [0.1, 0.4, 0.1],
        }}
        transition={{
          duration: 3 + i,
          repeat: Infinity,
          ease: "easeInOut",
          delay: i * 0.4,
        }}
        className={`absolute w-1.5 h-1.5 rounded-full ${i % 2 === 0 ? "bg-[#0075CF]" : "bg-[#FD5A1A]"}`}
        style={{
          left: `${10 + i * 11}%`,
          top: `${15 + ((i * 17) % 60)}%`,
        }}
      />
    ))}

    {/* Moving data lines */}
    <motion.div
      animate={{ y: [-200, 1000], opacity: [0, 0.5, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      className="absolute left-[25%] top-0 w-[1px] h-[200px] bg-gradient-to-b from-transparent via-[#0075CF] to-transparent"
    />
    <motion.div
      animate={{ y: [-200, 1000], opacity: [0, 0.5, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 2.5 }}
      className="absolute left-[75%] top-0 w-[1px] h-[250px] bg-gradient-to-b from-transparent via-[#FD5A1A] to-transparent"
    />
    <motion.div
      animate={{ x: [-200, 1000], opacity: [0, 0.3, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1 }}
      className="absolute top-[30%] left-0 h-[1px] w-[200px] bg-gradient-to-r from-transparent via-[#0075CF] to-transparent"
    />

    {/* Soft glows */}
    <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#0075CF]/5 rounded-full blur-[100px]" />
    <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-[#FD5A1A]/5 rounded-full blur-[120px]" />
  </div>
);

const HeroSection = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-24 bg-white font-['Inter']">
      <TechBackground />

      <div className="container-width section-padding relative z-10 w-full">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-3 px-6 py-3 bg-[#FD5A1A]/10 border border-[#FD5A1A]/20 text-[#FD5A1A] font-black uppercase tracking-[0.2em] text-xs mb-10 rounded-full"
          >
            <Trophy className="w-4 h-4" />
            Vijayawada's #1 Learning Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
            className="font-heading text-6xl sm:text-7xl lg:text-9xl leading-[0.9] tracking-tighter mb-8 text-black uppercase italic"
          >
            Smart <span className="text-[#0075CF] not-italic">Learning</span>{" "}
            <br />
            For <span className="text-[#FD5A1A]">Real Careers.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-black font-bold uppercase tracking-widest max-w-3xl mx-auto mb-14 leading-relaxed opacity-60"
          >
            Join 10,000+ students mastering Tech, Design, and Business with
            Vijayawada's most advanced LMS.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <Button
              className="h-20 px-12 bg-black text-white border-4 border-black text-xl font-black uppercase tracking-widest shadow-[10px_10px_0px_0px_rgba(0,117,207,1)] hover:bg-[#0075CF] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all rounded-none group"
              onClick={() => navigate("/auth")}
            >
              Start Learning
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button
              variant="outline"
              className="h-20 px-12 bg-white text-black border-4 border-black text-xl font-black uppercase tracking-widest shadow-[10px_10px_0px_0px_rgba(253,90,26,1)] hover:bg-[#E9E9E9] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all rounded-none gap-3"
              onClick={() => navigate("/dashboard")}
            >
              <Play className="w-6 h-6 fill-black" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats Bar */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-24 max-w-4xl mx-auto"
          >
            {[
              { value: "10K+", label: "STUDENTS", color: "#0075CF" },
              { value: "50+", label: "EXPERTS", color: "#FD5A1A" },
              { value: "100+", label: "COURSES", color: "black" },
              { value: "95%", label: "SUCCESS", color: "#0075CF" },
            ].map((stat, idx) => (
              <div
                key={stat.label}
                className={`bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${idx % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"} hover:rotate-0 transition-transform`}
              >
                <p
                  className="text-4xl font-black mb-1 italic"
                  style={{ color: stat.color }}
                >
                  {stat.value}
                </p>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">
                  {stat.label}
                </p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
