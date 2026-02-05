import { motion } from "framer-motion";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";
import { 
  Users, 
  Trophy, 
  Briefcase, 
  GraduationCap, 
  Clock, 
  HeadphonesIcon,
  Sparkles
} from "lucide-react";

const features = [
  {
    icon: GraduationCap,
    title: "Industry-Ready Curriculum",
    description: "Learn skills that employers actually need.",
  },
  {
    icon: Users,
    title: "Expert Trainers",
    description: "10+ years of real industry experience.",
  },
  {
    icon: Briefcase,
    title: "100% Placement Support",
    description: "2000+ successful placements.",
  },
  {
    icon: Trophy,
    title: "Hands-On Projects",
    description: "Build real-world portfolio projects.",
  },
  {
    icon: Clock,
    title: "Flexible Timings",
    description: "Weekend batches available.",
  },
  {
    icon: HeadphonesIcon,
    title: "Lifetime Support",
    description: "Guidance after course completion.",
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
    <section id="about" className="bg-muted/30 overflow-hidden">
      <ContainerScroll
        titleComponent={
          <div className="flex flex-col items-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent mb-4">
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">Why Students Love Us</span>
            </div>
            <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
              Why Choose <span className="text-accent">AOTMS?</span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-base md:text-lg px-4">
              Transform your career with Andhra's most trusted training institute.
            </p>
          </div>
        }
      >
        <div className="h-full w-full flex flex-col bg-gradient-to-br from-primary/5 via-accent/5 to-secondary/5 rounded-2xl p-4 md:p-6 overflow-y-auto">
          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-6">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-card/80 backdrop-blur-sm rounded-xl border border-border p-3 md:p-4 text-center shadow-sm"
              >
                <div className="font-heading text-xl md:text-2xl lg:text-3xl gradient-text-brand">
                  {stat.value}
                </div>
                <div className="text-muted-foreground text-xs md:text-sm">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 flex-1">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: 0.2 + index * 0.1 }}
                className="group bg-card/80 backdrop-blur-sm rounded-xl border border-border p-3 md:p-4 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center mb-2 md:mb-3 group-hover:scale-110 transition-transform duration-300">
                  <feature.icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <h3 className="font-heading text-sm md:text-base text-foreground mb-1">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-xs md:text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </ContainerScroll>
    </section>
  );
};

export default WhyAOTMS;
