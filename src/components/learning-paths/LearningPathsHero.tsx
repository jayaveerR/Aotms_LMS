import { motion } from "framer-motion";

const LearningPathsHero = () => {
  return (
    <section className="section-padding pt-32 md:pt-40 bg-gradient-to-br from-sky-50 via-background to-cyan-50/50 relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-sky-400/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-cyan-400/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-300/5 rounded-full blur-3xl" />
      
      <div className="container-width relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto pt-8 md:pt-12"
        >
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-sky-600 mb-6">
            Career-Focused Learning Paths
          </h1>
          <p className="text-slate-600 text-lg md:text-xl leading-relaxed">
            Structured programs designed to take you from fundamentals to real-world job readiness. 
            Choose your path and start building your future today.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningPathsHero;
