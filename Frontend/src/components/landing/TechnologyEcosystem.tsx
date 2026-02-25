import { useEffect, useState } from "react";
import logo from "@/assets/logo.png";
import { motion } from "framer-motion";

const technologies = [
  {
    name: "React",
    icon: "https://cdn.simpleicons.org/react/61DAFB",
    color: "#61DAFB",
  },
  {
    name: "Next.js",
    icon: "https://cdn.simpleicons.org/nextdotjs/black",
    color: "#000000",
  },
  {
    name: "Tailwind CSS",
    icon: "https://cdn.simpleicons.org/tailwindcss/06B6D4",
    color: "#06B6D4",
  },
  {
    name: "TypeScript",
    icon: "https://cdn.simpleicons.org/typescript/3178C6",
    color: "#3178C6",
  },
  {
    name: "Node.js",
    icon: "https://cdn.simpleicons.org/nodedotjs/339933",
    color: "#339933",
  },
  {
    name: "Supabase",
    icon: "https://cdn.simpleicons.org/supabase/3ECF8E",
    color: "#3ECF8E",
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.simpleicons.org/postgresql/4169E1",
    color: "#4169E1",
  },
  {
    name: "Razorpay",
    icon: "https://cdn.simpleicons.org/razorpay/02042B",
    color: "#02042B",
  },
  {
    name: "AWS",
    icon: "https://cdn.simpleicons.org/amazonaws/232F3E",
    color: "#232F3E",
  },
  {
    name: "Vercel",
    icon: "https://cdn.simpleicons.org/vercel/black",
    color: "#000000",
  },
  {
    name: "Zoom API",
    icon: "https://cdn.simpleicons.org/zoom/0B5CFF",
    color: "#0B5CFF",
  },
  {
    name: "WhatsApp API",
    icon: "https://cdn.simpleicons.org/whatsapp/25D366",
    color: "#25D366",
  },
];

const TechnologyEcosystem = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1024;

  return (
    <section
      className="py-24 bg-white overflow-hidden relative"
      id="technology-ecosystem"
    >
      <div className="container-width px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 text-black tracking-tight"
          >
            Our Technology <span className="text-primary">Ecosystem</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-600"
          >
            Built on a robust, scalable, and modern stack to deliver a seamless
            learning experience.
          </motion.p>
        </div>

        {isMobile ? (
          <div className="flex flex-col items-center gap-12">
            {/* Center Logo on top for Mobile */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className="relative w-32 h-32 rounded-full bg-white/80 shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 flex items-center justify-center z-10 backdrop-blur-md"
            >
              <div className="w-24 h-24 rounded-full bg-white shadow-inner flex items-center justify-center border border-gray-50">
                <img src={logo} alt="AOTMS Logo" className="w-16 h-auto" />
              </div>
            </motion.div>

            <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
              {technologies.map((tech, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  key={tech.name}
                  className="group flex flex-col items-center gap-3 p-5 rounded-2xl bg-white shadow-[0_4px_20px_rgb(0,0,0,0.04)] border border-gray-50 hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
                >
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"
                    style={{ backgroundColor: tech.color }}
                  />
                  <div className="w-12 h-12 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center">
                    {tech.name}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        ) : (
          <div className="relative w-full h-[650px] max-w-5xl mx-auto flex items-center justify-center">
            {/* Center Logo */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              className={`absolute rounded-full bg-white/60 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.08)] border border-white flex items-center justify-center z-20 ${isTablet ? "w-32 h-32" : "w-44 h-44"}`}
            >
              <div
                className={`rounded-full bg-white shadow-inner flex items-center justify-center border border-gray-50 flex-col gap-2 ${isTablet ? "w-24 h-24" : "w-32 h-32"}`}
              >
                <img
                  src={logo}
                  alt="AOTMS Logo"
                  className={isTablet ? "w-16 h-auto" : "w-20 h-auto"}
                />
              </div>
            </motion.div>

            {technologies.map((tech, index) => {
              const angle = isTablet
                ? 180 + index * (180 / 11)
                : (360 / 12) * index;
              const radius = isTablet ? 280 : 340;

              return (
                <div
                  key={tech.name}
                  className="absolute top-1/2 left-1/2 w-0 h-0 z-10"
                  style={{ transform: `rotate(${angle}deg)` }}
                >
                  {/* Connecting Line */}
                  <div
                    className="absolute top-1/2 left-0 h-[1px] bg-gradient-to-r from-gray-200 to-transparent origin-left opacity-60"
                    style={{
                      width: `${radius - 20}px`,
                      transform: "translateY(-50%)",
                    }}
                  />

                  {/* Technology Node */}
                  <motion.div
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{
                      delay: index * 0.05,
                      duration: 0.6,
                      type: "spring",
                      bounce: 0.4,
                    }}
                    className="absolute"
                    style={{
                      transform: `translate(${radius}px, 0) rotate(-${angle}deg)`,
                      marginLeft: "-40px", // Center the 80px element
                      marginTop: "-40px",
                    }}
                  >
                    <div
                      className="group relative w-20 h-20 rounded-2xl bg-white shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 flex items-center justify-center hover:shadow-[0_20px_40px_rgba(0,0,0,0.12)] hover:-translate-y-2 transition-all duration-300 backdrop-blur-lg bg-white/80 overflow-visible cursor-pointer animate-[float_6s_ease-in-out_infinite] hover:animate-none"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="w-10 h-10 flex items-center justify-center transition-transform duration-300 group-hover:scale-110">
                        <img
                          src={tech.icon}
                          alt={tech.name}
                          className="max-w-full max-h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                        />
                      </div>

                      {/* Tooltip Label */}
                      <div className="absolute -bottom-12 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-50 flex justify-center w-full">
                        <span className="text-xs font-semibold text-gray-800 bg-white px-3 py-1.5 rounded-full shadow-lg border border-gray-100 whitespace-nowrap">
                          {tech.name}
                        </span>
                      </div>

                      {/* Subtle Color Glow */}
                      <div
                        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none"
                        style={{ backgroundColor: tech.color }}
                      />
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Floating global style for animation */}
      <style>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </section>
  );
};

export default TechnologyEcosystem;
