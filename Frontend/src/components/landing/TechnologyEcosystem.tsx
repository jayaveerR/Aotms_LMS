import { useEffect, useRef, useState } from "react";
import logo from "@/assets/logo.png";

interface Tech {
  name: string;
  icon: string;
  color: string;
  textColor: string;
}

const technologies: Tech[] = [
  {
    name: "React",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    color: "#61DAFB",
    textColor: "#0e7490",
  },
  {
    name: "Next.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg",
    color: "#000000",
    textColor: "#111827",
  },
  {
    name: "GraphQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg",
    color: "#E10098",
    textColor: "#be185d",
  },
  {
    name: "TypeScript",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    color: "#3178C6",
    textColor: "#1e3a8a",
  },
  {
    name: "Node.js",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
    color: "#339933",
    textColor: "#14532d",
  },
  {
    name: "Supabase",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/supabase/supabase-original.svg",
    color: "#3ECF8E",
    textColor: "#065f46",
  },
  {
    name: "PostgreSQL",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg",
    color: "#4169E1",
    textColor: "#1e3a8a",
  },
  {
    name: "MongoDB",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg",
    color: "#47A248",
    textColor: "#14532d",
  },
  {
    name: "Docker",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg",
    color: "#2496ED",
    textColor: "#1e3a8a",
  },
  {
    name: "Vercel",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg",
    color: "#000000",
    textColor: "#111827",
  },
  {
    name: "GitHub",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg",
    color: "#181717",
    textColor: "#111827",
  },
  {
    name: "Redis",
    icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg",
    color: "#DC382D",
    textColor: "#991b1b",
  },
];

// Use abbreviation badge when no proper icon is available
const specialLogos: Record<string, string> = {};

// Simple, well-tested devicon URLs (override broken ones)
const reliableIcons: Record<string, string> = {
  "Next.js":
    "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/nextjs/nextjs-original.svg",
  Vercel:
    "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons/vercel/vercel-original.svg",
};

const TechCard = ({ tech, size }: { tech: Tech; size: number }) => {
  const abbr =
    specialLogos[tech.name] ||
    (reliableIcons[tech.name] === ""
      ? tech.name.slice(0, 2).toUpperCase()
      : null);
  const iconUrl =
    reliableIcons[tech.name] !== undefined
      ? reliableIcons[tech.name]
      : tech.icon;
  const showAbbr = !iconUrl;

  return (
    <div
      className="group relative flex flex-col items-center justify-center rounded-2xl bg-white cursor-pointer select-none
        border border-gray-100
        shadow-[0_4px_16px_rgba(0,0,0,0.07)]
        hover:shadow-[0_12px_36px_rgba(0,0,0,0.16)]
        hover:-translate-y-2
        transition-all duration-300
        overflow-hidden"
      style={{ width: size, height: size }}
    >
      {/* Colored accent bar at bottom */}
      <div
        className="absolute bottom-0 left-0 right-0 h-[3px] opacity-80"
        style={{ backgroundColor: tech.color }}
      />

      {/* Color wash on hover */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-[0.07] transition-opacity duration-300"
        style={{ backgroundColor: tech.color }}
      />

      {/* Icon or abbreviation */}
      {showAbbr || abbr ? (
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-sm tracking-tight text-white shadow-sm mb-1"
          style={{ backgroundColor: tech.color, letterSpacing: "0.04em" }}
        >
          {abbr}
        </div>
      ) : (
        <img
          src={iconUrl}
          alt={tech.name}
          draggable={false}
          className="w-10 h-10 object-contain group-hover:scale-110 transition-transform duration-300"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = "none";
            const parent = target.parentElement;
            if (parent) {
              const div = document.createElement("div");
              div.style.cssText = `width:40px;height:40px;border-radius:10px;display:flex;align-items:center;justify-content:center;background:${tech.color};color:white;font-weight:800;font-size:12px`;
              div.textContent = tech.name.slice(0, 2).toUpperCase();
              parent.insertBefore(div, target);
            }
          }}
        />
      )}

      {/* Name label */}
      <span className="text-[10px] font-semibold mt-1 text-gray-600 group-hover:text-gray-900 transition-colors duration-300 leading-tight text-center px-1">
        {tech.name}
      </span>
    </div>
  );
};

const CARD_SIZE = 90; // px

const TechnologyEcosystem = () => {
  const [windowWidth, setWindowWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200,
  );
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = windowWidth < 768;
  const isTablet = windowWidth >= 768 && windowWidth < 1100;

  // Calculate orbit radius and container
  const orbitRadius = isTablet ? 210 : 265;
  const padding = CARD_SIZE + 10;
  const totalSize = (orbitRadius + padding) * 2;
  const center = totalSize / 2;

  // trig positions for each tech
  const nodePositions = technologies.map((_, i) => {
    // -90° so first item is at the top
    const angleDeg = (360 / technologies.length) * i - 90;
    const angleRad = (angleDeg * Math.PI) / 180;
    return {
      left: center + orbitRadius * Math.cos(angleRad) - CARD_SIZE / 2,
      top: center + orbitRadius * Math.sin(angleRad) - CARD_SIZE / 2,
      lx: center + orbitRadius * Math.cos(angleRad),
      ly: center + orbitRadius * Math.sin(angleRad),
    };
  });

  return (
    <section
      ref={sectionRef}
      id="technology-ecosystem"
      className="relative py-20 overflow-hidden bg-white"
    >
      {/* ── Dynamic Tech-Inspired Background ── */}
      {/* Dot Grid Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.3]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='2' cy='2' r='1' fill='%230B5CFF' fill-opacity='0.15'/%3E%3C/svg%3E")`,
          backgroundSize: "24px 24px",
        }}
      />

      {/* Brand-Colored Animated Glowing Orbs */}
      <div
        className="absolute top-0 -left-32 w-[600px] h-[600px] rounded-full pointer-events-none mix-blend-multiply opacity-50 animate-blob"
        style={{
          background:
            "radial-gradient(circle, rgba(11, 92, 255, 0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-0 -right-32 w-[600px] h-[600px] rounded-full pointer-events-none mix-blend-multiply opacity-50 animate-blob animation-delay-2000"
        style={{
          background:
            "radial-gradient(circle, rgba(242, 112, 6, 0.12) 0%, transparent 70%)",
        }}
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full pointer-events-none mix-blend-multiply opacity-30 animate-blob animation-delay-4000"
        style={{
          background:
            "radial-gradient(circle, rgba(11, 92, 255, 0.08) 0%, rgba(242, 112, 6, 0.08) 40%, transparent 70%)",
        }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* ── Section Header ── */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-semibold tracking-widest uppercase text-primary mb-3">
            Powered By
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight mb-4">
            Our Technology{" "}
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage: "linear-gradient(90deg, #F27006, #f59e0b)",
              }}
            >
              Ecosystem
            </span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg leading-relaxed">
            A carefully chosen, modern stack — from UI to cloud — powering every
            feature of AOTMS.
          </p>
        </div>

        {/* ── MOBILE: Staggered Clustered Layout ── */}
        {isMobile && (
          <div className="relative flex flex-col items-center py-6">
            {/* Center Logo integrated into the flow */}
            <div className="relative z-20 mb-10 w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center p-3 shadow-[0_8px_30px_rgba(0,0,0,0.08)] border border-gray-100">
              <div
                className="absolute inset-0 rounded-full opacity-10"
                style={{
                  background:
                    "radial-gradient(circle, #F27006 0%, transparent 70%)",
                }}
              />
              <img
                src={logo}
                alt="AOTMS"
                className="w-24 h-auto relative z-10"
              />
            </div>

            {/* Seamless 3-column staggered layout */}
            <div className="grid grid-cols-3 gap-3 w-full max-w-[340px] px-2 relative z-10">
              {technologies.map((tech, i) => (
                <div
                  key={tech.name}
                  className={`flex justify-center transform transition-transform duration-300 ${
                    i % 2 === 0
                      ? "translate-y-4"
                      : "" /* Stagger odd/even cols */
                  }`}
                >
                  <TechCard tech={tech} size={92} />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── TABLET / DESKTOP: Radial layout ── */}
        {!isMobile && (
          <div
            className="flex justify-center items-center"
            style={{ minHeight: totalSize }}
          >
            <div
              className="relative flex-shrink-0"
              style={{ width: totalSize, height: totalSize }}
            >
              {/* SVG: orbit ring + connecting lines */}
              <svg
                className="absolute inset-0 pointer-events-none"
                width={totalSize}
                height={totalSize}
                viewBox={`0 0 ${totalSize} ${totalSize}`}
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Outer orbit ring */}
                <circle
                  cx={center}
                  cy={center}
                  r={orbitRadius}
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  strokeDasharray="3 6"
                />
                {/* Inner ring (decoration) */}
                <circle
                  cx={center}
                  cy={center}
                  r={90}
                  fill="none"
                  stroke="#f3f4f6"
                  strokeWidth="1"
                />
                {/* Connecting lines */}
                {nodePositions.map((pos, i) => (
                  <line
                    key={`line-${i}`}
                    x1={center}
                    y1={center}
                    x2={pos.lx}
                    y2={pos.ly}
                    stroke={`${technologies[i].color}55`}
                    strokeWidth="1.5"
                  />
                ))}
              </svg>

              {/* ── Center Logo ── */}
              <div
                className="absolute z-20 rounded-full bg-white flex items-center justify-center"
                style={{
                  width: 160,
                  height: 160,
                  left: center - 80,
                  top: center - 80,
                  boxShadow:
                    "0 0 0 16px rgba(255,255,255,0.55), 0 8px 48px rgba(0,0,0,0.12)",
                  border: "2px solid rgba(229,231,235,0.9)",
                }}
              >
                <img src={logo} alt="AOTMS Logo" className="w-28 h-auto" />
              </div>

              {/* ── Technology Node Cards ── */}
              {technologies.map((tech, i) => (
                <div
                  key={tech.name}
                  className="absolute z-10 tech-node"
                  style={{
                    width: CARD_SIZE,
                    height: CARD_SIZE,
                    left: nodePositions[i].left,
                    top: nodePositions[i].top,
                    animationDelay: `${i * 0.28}s`,
                  }}
                >
                  <TechCard tech={tech} size={CARD_SIZE} />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes techFloat {
          0%, 100% { transform: translateY(0px); }
          50%       { transform: translateY(-8px); }
        }
        .tech-node {
          animation: techFloat 5s ease-in-out infinite;
        }
        .tech-node:hover {
          animation-play-state: paused;
          z-index: 30 !important;
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 8s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </section>
  );
};

export default TechnologyEcosystem;
