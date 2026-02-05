 import { useEffect, useRef } from "react";
 import { useIsMobile } from "@/hooks/use-mobile";
 
 const SnowParticles = () => {
   const canvasRef = useRef<HTMLCanvasElement>(null);
   const isMobile = useIsMobile();
 
   useEffect(() => {
     const canvas = canvasRef.current;
     if (!canvas) return;
 
     const ctx = canvas.getContext("2d");
     if (!ctx) return;
 
     let animationId: number;
     let particles: Array<{
       x: number;
       y: number;
       size: number;
       speedY: number;
       speedX: number;
       opacity: number;
     }> = [];
 
     const resize = () => {
       canvas.width = window.innerWidth;
       canvas.height = window.innerHeight;
     };
 
     const createParticles = () => {
       // Reduced count on mobile for performance
       const count = isMobile ? 20 : 60;
       particles = [];
       
       for (let i = 0; i < count; i++) {
         particles.push({
           x: Math.random() * canvas.width,
           y: Math.random() * canvas.height,
           size: Math.random() * 2 + 1,
           speedY: Math.random() * 0.3 + 0.1,
           speedX: Math.random() * 0.2 - 0.1,
           opacity: Math.random() * 0.15 + 0.05,
         });
       }
     };
 
     const animate = () => {
       ctx.clearRect(0, 0, canvas.width, canvas.height);
 
       particles.forEach((p) => {
         // Draw particle
         ctx.beginPath();
         ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
         ctx.fillStyle = `rgba(180, 190, 210, ${p.opacity})`;
         ctx.fill();
 
         // Move particle
         p.y += p.speedY;
         p.x += p.speedX;
 
         // Reset if out of bounds
         if (p.y > canvas.height) {
           p.y = -10;
           p.x = Math.random() * canvas.width;
         }
         if (p.x > canvas.width) p.x = 0;
         if (p.x < 0) p.x = canvas.width;
       });
 
       animationId = requestAnimationFrame(animate);
     };
 
     resize();
     createParticles();
     animate();
 
     window.addEventListener("resize", () => {
       resize();
       createParticles();
     });
 
     return () => {
       cancelAnimationFrame(animationId);
       window.removeEventListener("resize", resize);
     };
   }, [isMobile]);
 
   return (
     <canvas
       ref={canvasRef}
       className="absolute inset-0 pointer-events-none z-0"
       aria-hidden="true"
     />
   );
 };
 
 export default SnowParticles;