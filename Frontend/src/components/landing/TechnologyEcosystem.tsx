import { useEffect, useRef, useState } from "react";
import logo from "@/assets/logo.png";
import AmbientBackground from "@/components/ui/AmbientBackground";

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
  const sectionRef = useRef<HTMLElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const count = technologies.length;
  const orbitRadius = isMobile ? 140 : 240;
  const totalSize = (orbitRadius + CARD_SIZE) * 2 + 40;
  const center = totalSize / 2;

  const nodePositions = technologies.map((_, i) => {
    const angle = (2 * Math.PI * i) / count - Math.PI / 2;
    const lx = center + orbitRadius * Math.cos(angle);
    const ly = center + orbitRadius * Math.sin(angle);
    return {
      left: lx - CARD_SIZE / 2,
      top: ly - CARD_SIZE / 2,
      lx,
      ly,
    };
  });

  return (
    <section
      ref={sectionRef}
      id="technology-ecosystem"
      className="relative py-24 md:py-32 overflow-hidden bg-[#E9E9E9] border-t-4 border-black font-['Inter']"
    >
      {/* Background Patterns */}
      <div className="absolute inset-0 z-0 opacity-40">
        <AmbientBackground />
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#0075CF] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white mb-8">
            <span className="text-xs font-black uppercase tracking-[0.2em]">
              Our Technology stack
            </span>
          </div>
          <h2 className="font-heading text-5xl md:text-6xl text-black mb-6 uppercase italic leading-[0.9]">
            The <span className="text-[#FD5A1A]">Tech</span> <br />
            <span className="text-[#0075CF]">Ecosystem</span>
          </h2>
          <p className="text-black font-bold uppercase tracking-widest text-sm opacity-50">
            A carefully chosen, modern stack — from UI to cloud — powering
            AOTMS.
          </p>
        </div>

        {/* MOBILE: Clustered Layout */}
        {isMobile && (
          <div className="relative flex flex-col items-center py-6">
            <div className="relative z-20 mb-12 w-32 h-32 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(253,90,26,1)] flex items-center justify-center p-4">
              <img src={logo} alt="AOTMS" className="w-full h-auto" />
            </div>

            <div className="grid grid-cols-2 gap-6 w-full max-w-[400px]">
              {technologies.map((tech) => (
                <div key={tech.name} className="flex justify-center">
                  <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col items-center gap-3 w-full">
                    <img
                      src={tech.icon}
                      alt={tech.name}
                      className="w-10 h-10 object-contain grayscale group-hover:grayscale-0"
                    />
                    <span className="text-[10px] font-black uppercase tracking-widest text-black">
                      {tech.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TABLET / DESKTOP: Radial Layout */}
        {!isMobile && (
          <div
            className="flex justify-center items-center"
            style={{ minHeight: totalSize }}
          >
            <div
              className="relative flex-shrink-0"
              style={{ width: totalSize, height: totalSize }}
            >
              <svg
                className="absolute inset-0"
                width={totalSize}
                height={totalSize}
                viewBox={`0 0 ${totalSize} ${totalSize}`}
              >
                {/* Neobrutalist Orbit Ring */}
                <circle
                  cx={center}
                  cy={center}
                  r={orbitRadius}
                  fill="none"
                  stroke="black"
                  strokeWidth="4"
                  strokeDasharray="16 16"
                  className="opacity-20"
                />
                {/* Bold Connecting Lines */}
                {nodePositions.map((pos, i) => (
                  <line
                    key={`line-${i}`}
                    x1={center}
                    y1={center}
                    x2={pos.lx}
                    y2={pos.ly}
                    stroke="black"
                    strokeWidth="2"
                    className="opacity-10 group-hover:opacity-100 transition-opacity"
                  />
                ))}
              </svg>

              {/* Center Box */}
              <div
                className="absolute z-20 bg-white border-8 border-black shadow-[16px_16px_0px_0px_rgba(0,117,207,1)] flex items-center justify-center rotate-[-2deg]"
                style={{
                  width: 180,
                  height: 180,
                  left: center - 90,
                  top: center - 90,
                }}
              >
                <img src={logo} alt="AOTMS Logo" className="w-32 h-auto" />
              </div>

              {/* Technology Node Boxes */}
              {technologies.map((tech, i) => (
                <div
                  key={tech.name}
                  className="absolute z-10 tech-node group"
                  style={{
                    width: CARD_SIZE,
                    height: CARD_SIZE,
                    left: nodePositions[i].left,
                    top: nodePositions[i].top,
                    animationDelay: `${i * 0.2}s`,
                  }}
                >
                  <div className="w-full h-full bg-white border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-[10px_10px_0px_0px_rgba(253,90,26,1)] group-hover:bg-[#E9E9E9] group-hover:translate-x-[-2px] group-hover:translate-y-[-2px] transition-all flex flex-col items-center justify-center p-2 rounded-none cursor-pointer">
                    <img
                      src={reliableIcons[tech.name] || tech.icon}
                      alt={tech.name}
                      className="w-10 h-10 mb-2 grayscale group-hover:grayscale-0 transition-all"
                    />
                    <span className="text-[9px] font-black uppercase tracking-widest text-black text-center">
                      {tech.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes techFloatNew {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50%       { transform: translateY(-12px) rotate(2deg); }
        }
        .tech-node {
          animation: techFloatNew 6s ease-in-out infinite;
        }
        .tech-node:hover {
          animation-play-state: paused;
        }
      `}</style>
    </section>
  );
};

export default TechnologyEcosystem;
