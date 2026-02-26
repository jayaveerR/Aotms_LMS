import React, { useEffect, useRef } from "react";

const InteractiveLeftPanel = ({ children }: { children: React.ReactNode }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: -1000, y: -1000, targetX: -1000, targetY: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // Keep transparent background for the canvas since its container has bg color
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;

    const dots: { x: number; y: number; baseRadius: number; color: string }[] =
      [];
    const spacing = 32;
    // Colors matching AOTMS theme: black, blue, orange
    const colors = [
      "#000000",
      "#000000",
      "#000000",
      "#000000",
      "#0075CF",
      "#FD5A1A",
    ];

    const init = () => {
      const parent = containerRef.current;
      if (parent) {
        const dpr = window.devicePixelRatio || 1;
        canvas.width = parent.clientWidth * dpr;
        canvas.height = parent.clientHeight * dpr;
        ctx.scale(dpr, dpr);
        canvas.style.width = `${parent.clientWidth}px`;
        canvas.style.height = `${parent.clientHeight}px`;

        dots.length = 0;
        const cols = Math.floor(parent.clientWidth / spacing) + 1;
        const rows = Math.floor(parent.clientHeight / spacing) + 1;

        for (let i = 0; i <= cols; i++) {
          for (let j = 0; j <= rows; j++) {
            dots.push({
              x: i * spacing,
              y: j * spacing,
              baseRadius: 1.5,
              color: colors[Math.floor(Math.random() * colors.length)],
            });
          }
        }
      }
    };

    const draw = () => {
      const m = mouse.current;
      // Smooth interpolation for the trailing effect
      m.x += (m.targetX - m.x) * 0.15;
      m.y += (m.targetY - m.y) * 0.15;

      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      dots.forEach((dot) => {
        const dx = m.x - dot.x;
        const dy = m.y - dot.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        let radius = dot.baseRadius;
        let alpha = 0.15;

        if (dist < 180) {
          const factor = 1 - dist / 180;
          radius += factor * 4;
          alpha = 0.15 + factor * 0.85;

          // Draw connecting web to mouse
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(dot.x, dot.y);
            ctx.lineTo(m.x, m.y);
            // Matching theme color
            ctx.strokeStyle =
              dot.color === "#FD5A1A"
                ? `rgba(253, 90, 26, ${0.4 * factor})`
                : `rgba(0, 117, 207, ${0.4 * factor})`;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }

        ctx.beginPath();
        ctx.arc(dot.x, dot.y, radius, 0, Math.PI * 2);

        const hex = dot.color.replace("#", "");
        const r = parseInt(hex.substring(0, 2), 16);
        const g = parseInt(hex.substring(2, 4), 16);
        const b = parseInt(hex.substring(4, 6), 16);

        ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${alpha})`;
        ctx.fill();
      });

      // Draw custom pointer ring
      if (m.x > -100) {
        ctx.beginPath();
        ctx.arc(m.x, m.y, 16, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(0,0,0,0.8)";
        ctx.lineWidth = 2;
        ctx.stroke();

        // inner dot
        ctx.beginPath();
        ctx.arc(m.x, m.y, 3, 0, Math.PI * 2);
        ctx.fillStyle = "#FD5A1A";
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    window.addEventListener("resize", init);
    setTimeout(init, 100);
    draw();

    return () => {
      window.removeEventListener("resize", init);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      mouse.current.targetX = e.clientX - rect.left;
      mouse.current.targetY = e.clientY - rect.top;
    }
  };

  const handleMouseLeave = () => {
    mouse.current.targetX = -1000;
    mouse.current.targetY = -1000;
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="hidden lg:flex lg:w-1/2 relative bg-[#E9E9E9] border-r-4 border-black overflow-hidden z-10"
    >
      <canvas
        ref={canvasRef}
        className="absolute inset-0 z-0 pointer-events-none"
      />

      {/* Container for content */}
      <div className="relative z-10 p-12 flex flex-col justify-between w-full h-full pointer-events-none">
        {React.Children.map(children, (child) => (
          <div className="pointer-events-auto">{child}</div>
        ))}
      </div>
    </div>
  );
};

export default InteractiveLeftPanel;
