import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Users, Star, ArrowRight, Code, Database, Cloud, Palette } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

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
  {
    title: "Cybersecurity Fundamentals",
    tagline: "Protect. Defend. Secure.",
    level: "Intermediate",
    duration: "8 Weeks",
    students: "1.5k",
    rating: "4.8",
    icon: Code,
    gradient: "from-slate-900 via-slate-800 to-red-900",
  },
  {
    title: "Mobile App Development",
    tagline: "Build. Launch. Scale.",
    level: "Beginner",
    duration: "10 Weeks",
    students: "2.2k",
    rating: "4.9",
    icon: Database,
    gradient: "from-slate-900 via-slate-800 to-cyan-900",
  },
];

const levelColors: Record<string, string> = {
  Beginner: "bg-success/20 text-success border border-success/30",
  Intermediate: "bg-amber-500/20 text-amber-400 border border-amber-500/30",
  Advanced: "bg-red-500/20 text-red-400 border border-red-500/30",
};

const CoursesSection = () => {
  const plugin = useRef(
    Autoplay({ delay: 2000, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <section id="courses" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-6 sm:mb-8"
        >
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl text-foreground mb-2 sm:mb-3">
            EXPLORE OUR COURSES
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-2xl mx-auto">
            Industry-aligned learning paths to accelerate your career
          </p>
        </motion.div>
      </div>

      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        plugins={[plugin.current]}
        className="w-full"
      >
        <CarouselContent className="-ml-2">
          {courses.map((course, index) => (
            <CarouselItem key={course.title} className="pl-2 basis-[280px] sm:basis-[320px] md:basis-[360px] lg:basis-[400px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group relative cursor-pointer h-full"
              >
                {/* Glow effect on hover */}
                <div className="absolute -inset-1 bg-gradient-to-r from-primary/40 via-accent/40 to-primary/40 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500 -z-10" />
                
                <div className="relative bg-card rounded-xl overflow-hidden border border-border shadow-lg group-hover:shadow-2xl transition-all duration-500 h-full flex flex-col">
                  {/* Gradient Header */}
                  <div className={`relative h-28 sm:h-32 bg-gradient-to-br ${course.gradient} p-3 sm:p-4 overflow-hidden`}>
                    {/* Decorative circles */}
                    <div className="absolute top-0 right-0 w-20 h-20 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
                    <div className="absolute bottom-0 left-0 w-14 h-14 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
                    
                    {/* Shimmer effect */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 overflow-hidden">
                      <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-[shimmer_1.5s_ease-in-out]" />
                    </div>
                    
                    <div className="relative z-10">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-semibold ${levelColors[course.level]} backdrop-blur-sm mb-1`}>
                        {course.level}
                      </span>
                      <p className="text-white/70 text-xs font-medium">{course.tagline}</p>
                    </div>
                  </div>

                  {/* Overlapping Icon */}
                  <div className="relative px-3 sm:px-4">
                    <div className="absolute -top-5 left-3 sm:left-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg border-2 border-card group-hover:scale-110 transition-transform duration-300">
                        <course.icon className="w-4 h-4 sm:w-5 sm:h-5 text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-6 sm:pt-7 pb-3 sm:pb-4 px-3 sm:px-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-foreground text-sm sm:text-base mb-1 group-hover:text-primary transition-colors duration-300 line-clamp-1">
                      {course.title}
                    </h3>
                    
                    <p className="text-muted-foreground text-xs mb-2 sm:mb-3">{course.tagline}</p>

                    {/* Stats */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-muted-foreground mb-2 sm:mb-3 pb-2 sm:pb-3 border-b border-border">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-primary" />
                        {course.duration}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3 text-primary" />
                        {course.students}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 text-accent fill-accent" />
                        {course.rating}
                      </span>
                    </div>

                    <Button 
                      variant="hero-outline" 
                      size="sm" 
                      className="w-full gap-1 text-xs group/btn group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary transition-all duration-300 mt-auto"
                    >
                      Explore Course
                      <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mt-6 sm:mt-8"
        >
          <Button variant="accent" size="lg" className="gap-2 text-sm sm:text-base px-6 sm:px-8">
            View All Courses
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesSection;