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
      className={`fixed bottom-6 right-6 z-50 group flex items-center justify-center
        w-14 h-14 rounded-none bg-[#0075CF] md:hidden
        border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]
        hover:shadow-[4px_4px_0px_0px_rgba(253,90,26,1)] hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-0 active:translate-y-0 active:shadow-none
        text-white
        transition-all duration-300 ease-out
        ${show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"}`}
    >
      <ArrowUp
        className="w-6 h-6 group-hover:-translate-y-1 transition-transform duration-300"
        strokeWidth={3}
      />
    </button>
  );
};

export default ScrollToTop;
