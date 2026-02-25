import { motion } from "framer-motion";
import { Star } from "lucide-react";

const LearningPathsHero = () => {
  return (
    <section className="bg-[#E9E9E9] border-b-8 border-black pt-32 pb-12 relative overflow-hidden">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

      <div className="container-width relative z-10 px-4 sm:px-6 md:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-black border-2 border-black shadow-[4px_4px_0px_0px_#FD5A1A] text-white text-xs font-black uppercase tracking-[0.2em] mb-6">
            <Star className="w-4 h-4 text-[#FD5A1A]" /> Career Blueprints
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-black text-black leading-[0.9] uppercase italic mb-6">
            CHOOSE YOUR <br />
            <span className="text-[#0075CF]">BATTLE</span>{" "}
            <span className="text-[#FD5A1A]">STRATEGY</span>
          </h1>
          <p className="text-black font-bold uppercase tracking-widest text-sm max-w-2xl opacity-60 leading-relaxed">
            Engineered learning paths designed to take you from a novice to an
            industry powerhouse. Select your curriculum and dominate your field.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningPathsHero;
