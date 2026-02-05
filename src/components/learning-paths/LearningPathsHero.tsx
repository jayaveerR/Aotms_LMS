import { motion } from "framer-motion";

const LearningPathsHero = () => {
  return (
    <section className="section-padding bg-background relative overflow-hidden">
      {/* Subtle decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-accent/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="container-width relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl text-foreground mb-6">
            Career-Focused Learning Paths
          </h1>
          <p className="text-muted-foreground text-lg md:text-xl leading-relaxed">
            Structured programs designed to take you from fundamentals to real-world job readiness. 
            Choose your path and start building your future today.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningPathsHero;
