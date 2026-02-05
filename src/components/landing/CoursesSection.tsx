import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Clock, Users, ArrowRight, Code, Database, Cloud, Palette, Shield, Smartphone } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import { useRef } from "react";

const courses = [
  {
    title: "Full Stack Web Development",
    description: "FRONTEND/BACKEND/API DEVELOPMENT",
    duration: "3 MONTHS",
    mode: "ONLINE / LIVE",
    price: "₹35,000",
    originalPrice: "₹75,000",
    icon: Code,
    iconBg: "bg-primary",
    gradient: "from-slate-900 via-slate-800 to-emerald-900",
  },
  {
    title: "Data Science & Analytics",
    description: "DATA VISUALIZATION/BUSINESS ANALYTICS/EXCEL & POWER BI",
    duration: "3 MONTHS",
    mode: "ONLINE / LIVE",
    price: "₹35,000",
    originalPrice: "₹55,000",
    icon: Database,
    iconBg: "bg-accent",
    gradient: "from-slate-900 via-slate-800 to-blue-900",
  },
  {
    title: "Cloud Computing & DevOps",
    description: "AWS/DOCKER/KUBERNETES/CI-CD PIPELINES",
    duration: "3 MONTHS",
    mode: "ONLINE / LIVE",
    price: "₹35,000",
    originalPrice: "₹65,000",
    icon: Cloud,
    iconBg: "bg-primary",
    gradient: "from-slate-900 via-slate-800 to-purple-900",
  },
  {
    title: "UI/UX Design Mastery",
    description: "FIGMA/PROTOTYPING/USER RESEARCH",
    duration: "3 MONTHS",
    mode: "ONLINE / LIVE",
    price: "₹35,000",
    originalPrice: "₹60,000",
    icon: Palette,
    iconBg: "bg-accent",
    gradient: "from-slate-900 via-slate-800 to-orange-900",
  },
  {
    title: "Cyber Security",
    description: "ETHICAL HACKING/NETWORK SECURITY/RISK MANAGEMENT",
    duration: "3 MONTHS",
    mode: "ONLINE / LIVE",
    price: "₹35,000",
    originalPrice: "₹65,000",
    icon: Shield,
    iconBg: "bg-destructive",
    gradient: "from-slate-900 via-slate-800 to-red-900",
  },
  {
    title: "Mobile App Development",
    description: "REACT NATIVE/FLUTTER/iOS & ANDROID",
    duration: "3 MONTHS",
    mode: "ONLINE / LIVE",
    price: "₹35,000",
    originalPrice: "₹70,000",
    icon: Smartphone,
    iconBg: "bg-primary",
    gradient: "from-slate-900 via-slate-800 to-cyan-900",
  },
];

const CoursesSection = () => {
  const plugin = useRef(
    Autoplay({ delay: 2500, stopOnInteraction: false, stopOnMouseEnter: true })
  );

  return (
    <section id="courses" className="py-12 sm:py-16 md:py-20 lg:py-24 bg-background overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 sm:mb-10"
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
        <CarouselContent className="-ml-3">
          {courses.map((course, index) => (
            <CarouselItem key={course.title} className="pl-3 basis-[280px] sm:basis-[300px] md:basis-[320px]">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="group cursor-pointer h-full"
              >
                <div className="h-full flex flex-col">
                  {/* Image Header */}
                  <div className={`relative h-36 sm:h-40 bg-gradient-to-br ${course.gradient} rounded-xl overflow-hidden`}>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <course.icon className="w-12 h-12 text-white/20" />
                    </div>
                    
                    {/* Shimmer on hover */}
                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                      <div className="absolute -inset-full bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12 group-hover:animate-[shimmer_1.5s_ease-in-out]" />
                    </div>
                  </div>

                  {/* Overlapping Icon */}
                  <div className="relative px-3">
                    <div className="absolute -top-5 left-3">
                      <div className={`w-10 h-10 rounded-full ${course.iconBg} flex items-center justify-center shadow-md border-3 border-background`}>
                        <course.icon className="w-4 h-4 text-primary-foreground" />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="pt-7 pb-2 flex-1 flex flex-col">
                    <h3 className="font-semibold text-foreground text-base mb-1.5 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    
                    <p className="text-primary text-[11px] font-medium mb-2 line-clamp-1">
                      • {course.description}
                    </p>

                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground mb-3">
                      <Clock className="w-3 h-3" />
                      <span>{course.duration}</span>
                      <span>•</span>
                      <span>{course.mode}</span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-foreground">{course.price}</span>
                      <span className="text-xs text-muted-foreground line-through">{course.originalPrice}</span>
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Button variant="outline" size="sm" className="flex-1 rounded-full text-xs h-8">
                        Explore
                      </Button>
                      <Button variant="accent" size="sm" className="flex-1 rounded-full text-xs h-8">
                        Start Learning
                      </Button>
                    </div>
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
          className="text-center mt-8 sm:mt-10"
        >
          <Button variant="accent" size="lg" className="gap-2 text-sm sm:text-base px-6 sm:px-8 rounded-full">
            View All Courses
            <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
};

export default CoursesSection;