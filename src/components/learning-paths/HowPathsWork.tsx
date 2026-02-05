import { motion } from "framer-motion";
import { Route, BookOpen, Video, FileCheck, Trophy, Briefcase } from "lucide-react";

const steps = [
  {
    icon: Route,
    title: "Choose a Path",
    description: "Select a learning path aligned with your career goals",
  },
  {
    icon: BookOpen,
    title: "Follow Courses",
    description: "Complete structured courses in the right sequence",
  },
  {
    icon: Video,
    title: "Attend Classes",
    description: "Join live sessions and watch recorded lectures",
  },
  {
    icon: FileCheck,
    title: "Practice Tests",
    description: "Prepare with mock tests and assignments",
  },
  {
    icon: Trophy,
    title: "Write Exams",
    description: "Track your rank on the leaderboard",
  },
  {
    icon: Briefcase,
    title: "Get Job-Ready",
    description: "Apply for roles with confidence",
  },
];

const HowPathsWork = () => {
  return (
    <section className="section-padding bg-background">
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl text-foreground mb-4">
            How Learning Paths Work
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            A simple, proven process to transform you from beginner to job-ready professional
          </p>
        </motion.div>

        {/* Desktop: Horizontal flow */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-12 left-0 right-0 h-0.5 bg-border" />
            
            <div className="grid grid-cols-6 gap-4">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative text-center"
                >
                  <div className="w-24 h-24 mx-auto mb-4 rounded-2xl bg-card border border-border shadow-soft flex items-center justify-center relative z-10">
                    <step.icon className="w-10 h-10 text-primary" />
                  </div>
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold z-20">
                    {index + 1}
                  </div>
                  <h3 className="font-semibold text-foreground mb-1 mt-6">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: Vertical flow */}
        <div className="lg:hidden">
          <div className="relative">
            {/* Connecting line */}
            <div className="absolute top-0 bottom-0 left-10 w-0.5 bg-border" />
            
            <div className="space-y-6">
              {steps.map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex items-start gap-4 relative"
                >
                  <div className="w-20 h-20 flex-shrink-0 rounded-xl bg-card border border-border shadow-soft flex items-center justify-center relative z-10">
                    <step.icon className="w-8 h-8 text-primary" />
                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                      {index + 1}
                    </div>
                  </div>
                  <div className="pt-2">
                    <h3 className="font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">{step.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowPathsWork;
