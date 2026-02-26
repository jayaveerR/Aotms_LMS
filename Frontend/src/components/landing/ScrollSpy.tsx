import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sections = [
  { id: "hero", label: "Welcome" },
  { id: "why-us", label: "Mission" },
  { id: "how-it-works", label: "Process" },
  { id: "features", label: "Skills" },
  { id: "technology-ecosystem", label: "Tech" },
  { id: "instructors", label: "Team" },
  { id: "testimonials", label: "Reviews" },
  { id: "faq", label: "Help" },
  { id: "contact", label: "Contact" },
];

const ScrollSpy = () => {
  const [activeSection, setActiveSection] = useState("hero");

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: "-20% 0px -70% 0px",
      threshold: 0,
    };

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    };

    const observer = new IntersectionObserver(
      observerCallback,
      observerOptions,
    );

    sections.forEach((section) => {
      const element = document.getElementById(section.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-[100] hidden lg:flex flex-col gap-4">
      {sections.map((section) => {
        const isActive = activeSection === section.id;
        return (
          <div
            key={section.id}
            className="group relative flex items-center justify-end"
          >
            {/* Tooltip */}
            <AnimatePresence>
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="absolute right-10 mr-2 bg-black text-white px-3 py-1 border-2 border-[#FD5A1A] font-black uppercase tracking-widest text-[10px] whitespace-nowrap hidden group-hover:block rounded-3xl"
                >
                  {section.label}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Indicator */}
            <button
              onClick={() => scrollToSection(section.id)}
              className={`w-4 h-4 border-2 border-black transition-all duration-300 ${
                isActive ? "bg-[#FD5A1A] w-6 h-6" : "bg-white hover:bg-gray-200"
              } rounded-full`}
              aria-label={`Scroll to ${section.label}`}
            />
          </div>
        );
      })}
    </div>
  );
};

export default ScrollSpy;
