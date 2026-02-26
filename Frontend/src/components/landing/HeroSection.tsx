import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play, Trophy, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

const sections = [
  { id: "hero", label: "Home" },
  { id: "about", label: "Why Us" },
  { id: "how-it-works", label: "Process" },
  { id: "features", label: "Features" },
  { id: "technology-ecosystem", label: "Tech Stack" },
  { id: "instructors", label: "Instructors" },
  { id: "testimonials", label: "Reviews" },
  { id: "faq", label: "FAQ" },
];

const TechBackground = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {/* Animated dual-layer grid pattern */}
    <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_80%_80%_at_50%_50%,#000_40%,transparent_100%)]">
      <motion.div
        className="absolute -inset-[100%]"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 117, 207, 0.15) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 117, 207, 0.15) 1px, transparent 1px)`,
          backgroundSize: "40px 40px",
        }}
        animate={{
          x: [0, -40],
          y: [0, -40],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <motion.div
        className="absolute -inset-[100%]"
        style={{
          backgroundImage: `radial-gradient(circle, rgba(253, 90, 26, 0.25) 1.5px, transparent 1.5px)`,
          backgroundSize: "20px 20px",
        }}
        animate={{
          x: [0, 20],
          y: [0, 20],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>

    {/* Floating tech nodes */}
    {Array.from({ length: 8 }).map((_, i) => (
      <motion.div
        key={i}
        animate={{
          y: [0, -30, 0],
          opacity: [0.3, 0.7, 0.3],
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
      animate={{ y: [-200, 1000], opacity: [0, 0.8, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
      className="absolute left-[25%] top-0 w-[1px] h-[200px] bg-gradient-to-b from-transparent via-[#0075CF] to-transparent rounded-3xl"
    />
    <motion.div
      animate={{ y: [-200, 1000], opacity: [0, 0.8, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "linear", delay: 2.5 }}
      className="absolute left-[75%] top-0 w-[1px] h-[250px] bg-gradient-to-b from-transparent via-[#FD5A1A] to-transparent rounded-3xl"
    />
    <motion.div
      animate={{ x: [-200, 1000], opacity: [0, 0.6, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: "linear", delay: 1 }}
      className="absolute top-[30%] left-0 h-[1px] w-[200px] bg-gradient-to-r from-transparent via-[#0075CF] to-transparent rounded-3xl"
    />

    {/* Soft glows */}
    <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] bg-[#0075CF]/10 rounded-full blur-[100px]" />
    <div className="absolute bottom-[20%] right-[10%] w-[600px] h-[600px] bg-[#FD5A1A]/10 rounded-full blur-[120px]" />
  </div>
);

const HeroSection = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize(); // Initial check
    window.addEventListener("resize", handleResize);

    // Scroll Spy for Side Navigation
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      let current = "hero";

      sections.forEach((section) => {
        const element = document.getElementById(section.id);
        if (element && element.offsetTop <= scrollPosition) {
          current = section.id;
        }
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToSection = (id: string) => {
    if (id === "hero") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-16 md:pb-24 bg-white font-[ rounded-3xl'Inter']"
    >
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
              className="h-20 px-12 bg-black text-white border-4 border-black text-xl font-black uppercase tracking-widest shadow-[10px_10px_0px_0px_rgba(0,117,207,1)] hover:bg-[#0075CF] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all rounded-3xl group"
              onClick={() => navigate("/auth")}
            >
              Start Learning
              <ArrowRight className="ml-3 w-6 h-6 group-hover:translate-x-2 transition-transform" />
            </Button>
            <Button
              variant="outline"
              className="h-20 px-12 bg-white text-black border-4 border-black text-xl font-black uppercase tracking-widest shadow-[10px_10px_0px_0px_rgba(253,90,26,1)] hover:bg-[#E9E9E9] hover:translate-x-[4px] hover:translate-y-[4px] hover:shadow-[6px_6px_0_0_rgba(0,0,0,1)] active:translate-x-[8px] active:translate-y-[8px] active:shadow-none transition-all rounded-3xl gap-3"
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
                className={`bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] ${idx % 2 === 0 ? "rotate-[-1deg]" : "rotate-[1deg]"} hover:rotate-0 transition-transform rounded-3xl`}
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

      {/* Brutalist Sticky Scroll Spy Navigation (Desktop only) */}
      {!isMobile && (
        <div className="fixed left-8 top-1/2 -translate-y-1/2 z-50 hidden xl:flex flex-col gap-3">
          {sections.map((section, index) => {
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => scrollToSection(section.id)}
                className={`group flex items-center justify-start gap-4 transition-all duration-300 ${
                  isActive ? "opacity-100" : "opacity-40 hover:opacity-100"
                }`}
              >
                <div
                  className={`w-10 h-10 border-2 border-black flex items-center justify-center transition-all duration-300 shrink-0 rounded-3xl
                  ${
                    isActive
                      ? "bg-[#0075CF] text-white"
                      : "bg-white text-black hover:bg-[#FD5A1A] hover:text-white"
                  }`}
                >
                  <span className="font-black italic text-sm">{index + 1}</span>
                </div>
                <div
                  className={`bg-white border-2 border-black font-black uppercase tracking-widest text-[10px] py-1 px-3 transition-all duration-300 origin-left whitespace-nowrap rounded-3xl
                  ${
                    isActive
                      ? "scale-100 translate-x-0"
                      : "scale-0 -translate-x-4 opacity-0 group-hover:scale-100 group-hover:translate-x-0 group-hover:opacity-100"
                  }`}
                >
                  {section.label}
                </div>
              </button>
            );
          })}
        </div>
      )}
    </section>
  );
};
export default HeroSection;
