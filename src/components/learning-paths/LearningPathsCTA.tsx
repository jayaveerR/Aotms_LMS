import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LearningPathsCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="section-padding bg-primary relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent/20 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-primary-foreground/10 rounded-full blur-3xl" />
      </div>

      <div className="container-width relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-3xl mx-auto"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-primary-foreground mb-6">
            Start Your Career Path Today
          </h2>
          <p className="text-primary-foreground/80 text-lg mb-10">
            Choose a path and begin your journey with AOTMS. Join thousands of students 
            who are building successful careers with our structured learning programs.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              variant="accent"
              size="xl"
              className="gap-2 group"
              onClick={() => window.scrollTo({ top: 400, behavior: 'smooth' })}
            >
              Explore Learning Paths
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="cta-white"
              size="xl"
              className="gap-2"
              onClick={() => navigate("/auth")}
            >
              <UserPlus className="w-5 h-5" />
              Register Now
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningPathsCTA;
