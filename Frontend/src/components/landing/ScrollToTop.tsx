import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";

const ScrollToTop = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollUp = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      onClick={scrollUp}
      aria-label="Scroll to top"
      className={`fixed bottom-6 right-6 z-50 group flex items-center justify-center
        w-12 h-12 rounded-xl bg-gradient-to-br from-[#0075CF] to-[#005fa3]
        border border-white/20 shadow-[0_8px_20px_rgba(0,117,207,0.4)]
        hover:shadow-[0_8px_30px_rgba(0,117,207,0.7)] hover:scale-110 active:scale-95
        text-white
        transition-all duration-300 ease-out
        ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"}`}
    >
      <ArrowUp
        className="w-5 h-5 group-hover:-translate-y-1 transition-transform duration-300"
        strokeWidth={2.5}
      />
    </button>
  );
};

export default ScrollToTop;
