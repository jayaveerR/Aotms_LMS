import { motion } from "framer-motion";
import { 
  Users, 
  Trophy, 
  Briefcase, 
  GraduationCap, 
  Clock, 
  HeadphonesIcon,
  Target,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Industry-Ready Curriculum",
    description: "Learn skills that employers actually need with our constantly updated syllabus.",
  },
  {
    icon: Users,
    title: "Expert Trainers",
    description: "Learn from professionals with 10+ years of real industry experience.",
  },
  {
    icon: Briefcase,
    title: "100% Placement Support",
    description: "Dedicated placement cell with 2000+ successful placements.",
  },
  {
    icon: Trophy,
    title: "Hands-On Projects",
    description: "Build real-world projects to strengthen your portfolio.",
  },
  {
    icon: Clock,
    title: "Flexible Timings",
    description: "Morning, evening & weekend batches for working professionals.",
  },
  {
    icon: HeadphonesIcon,
    title: "Lifetime Support",
    description: "Get doubt clearing and career guidance even after course completion.",
  },
];

const stats = [
  { value: "2000+", label: "Students Placed" },
  { value: "85%", label: "Placement Rate" },
  { value: "50+", label: "Hiring Partners" },
  { value: "4.8★", label: "Student Rating" },
];

const WhyAOTMS = () => {
  return (
    <section id="about" className="section-padding bg-muted/30 overflow-hidden">
      <div className="container-width">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12 md:mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Why Students Love Us</span>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            Why Choose <span className="text-accent">AOTMS?</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg">
            Transform your career with Andhra's most trusted training institute. 
            We don't just teach – we prepare you for success.
          </p>
        </motion.div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12 md:mb-16"
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              className="bg-card rounded-2xl border border-border p-4 md:p-6 text-center shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="font-heading text-2xl md:text-3xl lg:text-4xl gradient-text-brand mb-1">
                {stat.value}
              </div>
              <div className="text-muted-foreground text-sm md:text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="group bg-card rounded-2xl border border-border p-5 md:p-6 shadow-sm hover:shadow-lg transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-heading text-lg md:text-xl text-foreground mb-2">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm md:text-base leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-12"
        >
          <div className="inline-flex items-center gap-2 text-muted-foreground">
            <Target className="w-5 h-5 text-accent" />
            <span>Join 2000+ successful professionals trained at AOTMS</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default WhyAOTMS;
