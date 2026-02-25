import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);
  const [footerVisible, setFooterVisible] = useState(false);

  // Show button after scrolling past 400px
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Hide button when footer enters the viewport
  useEffect(() => {
    const footer = document.getElementById("contact");
    if (!footer) return;
    const observer = new IntersectionObserver(
      ([entry]) => setFooterVisible(entry.isIntersecting),
      { threshold: 0.05 },
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const show = visible && !footerVisible;

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className={`fixed bottom-6 left-6 z-50 group flex items-center justify-center
        w-12 h-12 rounded-xl bg-gradient-to-br from-[#0075CF] to-[#005fa3]
        border border-white/20 shadow-[0_8px_20px_rgba(0,117,207,0.4)]
        hover:shadow-[0_8px_30px_rgba(0,117,207,0.7)] hover:scale-110 active:scale-95
        text-white
        transition-all duration-300 ease-out
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <ArrowUp
        className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300"
        strokeWidth={2.5}
      />
    </button>
  );
};

export default ScrollToTop;
