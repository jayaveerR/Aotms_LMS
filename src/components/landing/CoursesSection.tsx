import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, ArrowRight, Code, Database, Cloud, Palette } from "lucide-react";

const courses = [
  {
    title: "Full Stack Web Development",
    tagline: "Code. Build. Deploy.",
    level: "Beginner",
    duration: "12 Weeks",
    students: "2.5k",
    rating: "4.9",
    icon: Code,
    gradient: "from-slate-900 via-slate-800 to-emerald-900",
  },
  {
    title: "Data Science & Analytics",
    tagline: "Analyze. Predict. Innovate.",
    level: "Intermediate",
    duration: "10 Weeks",
    students: "1.8k",
    rating: "4.8",
    icon: Database,
    gradient: "from-slate-900 via-slate-800 to-blue-900",
  },
  {
    title: "Cloud Computing & DevOps",
    tagline: "Scale. Automate. Deliver.",
    level: "Advanced",
    duration: "8 Weeks",
    students: "1.2k",
    rating: "4.9",
    icon: Cloud,
    gradient: "from-slate-900 via-slate-800 to-purple-900",
  },
  {
    title: "UI/UX Design Mastery",
    tagline: "Design. Prototype. Inspire.",
    level: "Beginner",
    duration: "6 Weeks",
    students: "3.1k",
    rating: "4.7",
    icon: Palette,
    gradient: "from-slate-900 via-slate-800 to-orange-900",
  },
];

const levelColors: Record<string, string> = {
  Beginner: "bg-success/20 text-success border border-success/30",
  Intermediate: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  Advanced: "bg-red-500/20 text-red-400 border border-red-500/30",
};

const CoursesSection = () => {
  return (
    <section id="courses" className="section-padding bg-background">
      <div className="container-width">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
            EXPLORE OUR COURSES
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Industry-aligned learning paths to accelerate your career
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {courses.map((course, index) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              className="group relative cursor-pointer"
            >
              {/* Glow effect on hover */}
              <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 rounded-3xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 -z-10" />
              
              <div className="relative bg-card rounded-2xl overflow-hidden border border-border shadow-lg group-hover:shadow-2xl transition-all duration-500">
                {/* Gradient Header */}
                <div className={`relative h-32 bg-gradient-to-br ${course.gradient} p-5 overflow-hidden`}>
                  {/* Decorative circles */}
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                  <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                  
                  {/* Shimmer effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                    <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-[shimmer_1.5s_ease-in-out]" />
                  </div>
                  
                  <div className="relative z-10">
                    <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-semibold ${levelColors[course.level]} backdrop-blur-sm mb-2`}>
                      {course.level}
                    </span>
                    <p className="text-white/70 text-sm font-medium">{course.tagline}</p>
                  </div>
                </div>

                {/* Overlapping Icon */}
                <div className="relative px-5">
                  <div className="absolute -top-8 left-5">
                    <div className="w-16 h-16 rounded-2xl bg-primary flex items-center justify-center shadow-lg border-4 border-card group-hover:scale-110 transition-transform duration-300">
                      <course.icon className="w-7 h-7 text-primary-foreground" />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="pt-10 pb-5 px-5">
                  <h3 className="font-semibold text-foreground text-lg mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                    {course.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm mb-4">{course.tagline}</p>

                  {/* Stats */}
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4 pb-4 border-b border-border">
                    <span className="flex items-center gap-1.5">
                      <Clock className="w-4 h-4 text-primary" />
                      {course.duration}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users className="w-4 h-4 text-primary" />
                      {course.students}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                      {course.rating}
                    </span>
                  </div>

                  <Button 
                    variant="hero-outline" 
                    size="sm" 
                    className="w-full gap-1.5 group/btn group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300"
                  >
                    Explore Course
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-10"
        >
          <Button variant="accent" size="lg" className="gap-2">
            View All Courses
            <ArrowRight className="w-5 h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesSection;