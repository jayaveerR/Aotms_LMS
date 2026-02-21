import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";
import GridScan from "./GridScan";
import { useState, useEffect } from "react";

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 bg-[#050505]">
      {/* High-Performance Mobile Background: Soft Glows + Grid Texture */}
      <div className="absolute inset-0 z-0">
        {/* Colorful soft lighting glows */}
        <div className="absolute top-0 left-[-20%] w-[80%] h-[60%] rounded-full bg-primary/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-20%] w-[80%] h-[60%] rounded-full bg-accent/20 blur-[120px] pointer-events-none" />

        {/* Dot pattern texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-40 md:opacity-50"
          style={{
            backgroundImage:
              "radial-gradient(circle 1px at center, rgba(255,255,255,0.2) 0%, transparent 100%)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Dark Vignette to keep text readable */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_20%,rgba(0,0,0,0.95)_100%)] pointer-events-none" />
      </div>

      {/* GridScan Background - Disabled on mobile to drastically improve performance */}
      {!isMobile && (
        <div className="absolute inset-0 z-0">
          <GridScan
            sensitivity={0.55}
            lineThickness={1}
            linesColor="#392e4e"
            gridScale={0.1}
            scanColor="#FF9FFC"
            scanOpacity={0.4}
            enablePost
            bloomIntensity={0.6}
            chromaticAberration={0.002}
            noiseIntensity={0.01}
          />
        </div>
      )}

      <div className="container-width section-padding relative z-10 w-full">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
            }}
          >
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/15 border border-primary/20 text-primary text-sm font-medium mb-6 shadow-sm shadow-primary/10">
              <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
              Skill-based Learning Platform
            </span>
          </motion.div>

          <motion.h1
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.1,
            }}
            className="font-hero text-6xl sm:text-7xl lg:text-8xl leading-[1.05] tracking-wide mb-6 text-center text-white drop-shadow-xl"
          >
            SMART LEARNING MANAGEMENT SYSTEM
            <br className="hidden md:block" />
            <span className="text-accent drop-shadow-[0_0_15px_rgba(255,107,0,0.4)]">
              {" "}
              IN VIJAYAWADA
            </span>{" "}
            FOR REAL-WORLD CAREERS
          </motion.h1>

          <motion.p
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
            }}
            className="text-sm md:text-base text-white/80 max-w-2xl mx-auto mb-10"
          >
            AOTMS is Vijayawada's premier learning management system offering
            online courses, live classes, secure exams, mock tests, and
            ATS-based skill evaluation. Join thousands of students building
            real-world careers.
          </motion.p>

          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.3,
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button
              variant="accent"
              size="xl"
              className="gap-2 group"
              onClick={() => navigate("/auth")}
            >
              Get Started
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="hero"
              size="xl"
              className="gap-2"
              onClick={() => navigate("/dashboard")}
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </Button>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{
              opacity: 0,
              y: 30,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.6,
              delay: 0.4,
            }}
            className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-white/20"
          >
            {[
              {
                value: "10K+",
                label: "Active Students",
              },
              {
                value: "50+",
                label: "Expert Instructors",
              },
              {
                value: "100+",
                label: "Courses",
              },
              {
                value: "95%",
                label: "Success Rate",
              },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl md:text-4xl font-heading text-white">
                  {stat.value}
                </p>
                <p className="text-sm text-white/70 mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;
