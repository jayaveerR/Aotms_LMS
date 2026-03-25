import { useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useCourses } from '@/hooks/useCourses';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';

export default function FeaturedCourses() {
  const { courses, fetchCourses, loading } = useCourses();
  const navigate = useNavigate();

  // Initialize Embla Carousel with Autoplay and Responsive options
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { 
      loop: true, 
      align: 'start',
      skipSnaps: false,
      dragFree: false, // Set to false for better "snapping" on touch
      containScroll: 'trimSnaps'
    }, 
    [
      Autoplay({ 
        delay: 3000, 
        stopOnInteraction: false, 
        stopOnMouseEnter: false 
      })
    ]
  );

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  useEffect(() => {
    fetchCourses(1, 'all', true);
  }, [fetchCourses]);

  const featured = courses.slice(0, 8);

  if (loading && courses.length === 0) return null;

  return (
    <section id="courses" className="py-16 md:py-24 bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-slate-50 to-white -z-10" />
      <div className="absolute top-40 -left-20 w-60 h-60 md:w-80 md:h-80 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-40 -right-20 w-60 h-60 md:w-80 md:h-80 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="container-width px-4 sm:px-6 lg:px-8 relative z-10 mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 md:mb-14 gap-8">
          <div className="space-y-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-left"
            >
              <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1.5 text-xs md:text-sm font-bold tracking-wider uppercase mb-4">
                Explore Programs
              </Badge>
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.1] mb-4">
                Master In-Demand <span className="text-primary italic">Tech Skills</span>
              </h2>
              <p className="text-slate-600 text-base md:text-lg font-medium leading-relaxed max-w-2xl">
                Choose from our curated selection of professional engineering courses designed by industry experts.
              </p>
            </motion.div>
          </div>

          <div className="hidden sm:flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 md:w-12 md:h-12 border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
              onClick={scrollPrev}
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="rounded-full w-10 h-10 md:w-12 md:h-12 border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-all duration-300 shadow-sm"
              onClick={scrollNext}
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5 md:h-6 md:w-6" />
            </Button>
          </div>
        </div>

        {/* Carousel Viewport */}
        <div className="embla overflow-hidden" ref={emblaRef}>
          <div className="embla__container flex -ml-4 md:-ml-6">
            {featured.map((course, idx) => (
              <div 
                key={course.id} 
                className="embla__slide flex-[0_0_90%] xs:flex-[0_0_80%] sm:flex-[0_0_50%] lg:flex-[0_0_33.33%] xl:flex-[0_0_25%] pl-4 md:pl-6 min-w-0"
              >
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  className="group h-full py-2"
                >
                  <Card 
                    className="pro-card h-full overflow-hidden border border-black shadow-none hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col scale-[0.98] group-hover:scale-100 origin-center"
                    onClick={() => navigate(`/courses/${course.id}`)}
                  >
                    <div className="relative aspect-[16/10] overflow-hidden">
                      <img
                        src={course.image}
                        alt={course.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        loading="lazy"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity duration-500" />
                      
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <Badge 
                          className="border-none font-bold shadow-md text-[10px] md:text-xs"
                          style={{ backgroundColor: course.theme_color }}
                        >
                          {course.category}
                        </Badge>
                      </div>

                      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-full shadow-md">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-[10px] md:text-xs font-black text-slate-800">{course.rating}</span>
                      </div>
                    </div>

                    <CardContent className="p-4 md:p-6 flex flex-col flex-1 justify-between gap-5">
                      <div className="space-y-2">
                        <h3 className="font-bold text-base md:text-lg lg:text-xl text-slate-800 group-hover:text-primary transition-colors line-clamp-2 min-h-[3rem]">
                          {course.title}
                        </h3>
                        <p className="text-xs md:text-sm text-slate-500 line-clamp-2 font-medium">
                          {course.level} • Professional Path
                        </p>
                      </div>

                      <div className="space-y-4 pt-4 border-t border-slate-50 mt-auto">
                        <div className="flex items-center justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest">
                           <div className="flex items-center gap-1.5 text-slate-400">
                             <Clock className="h-4 w-4" /> 
                             <span>{course.duration}</span>
                           </div>
                           <div className="text-primary font-black scale-110">
                             {course.price}
                           </div>
                        </div>

                        <Button 
                          variant="ghost" 
                          className="w-full justify-between items-center px-4 py-2 h-auto hover:bg-primary/5 text-primary font-bold group/btn text-xs md:text-sm rounded-xl border border-transparent hover:border-primary/10 transition-all"
                        >
                           <span>View Details</span>
                           <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1.5 transition-transform" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </div>
            ))}
          </div>
        </div>

        {/* Center Mobile View Indicators - Only visible on small screens */}
        <div className="flex sm:hidden justify-center gap-2 mt-8">
           {featured.slice(0, 4).map((_, i) => (
             <div key={i} className="w-1.5 h-1.5 rounded-full bg-slate-200" />
           ))}
        </div>

        <div className="mt-12 md:mt-16 text-center">
          <Button 
            size="xl" 
            className="pro-button-primary w-full sm:w-auto h-14 px-12 rounded-2xl shadow-lg hover:shadow-primary/25 hover:scale-105 active:scale-95 transition-all text-base font-bold"
            onClick={() => navigate('/courses')}
          >
            Browse All Courses
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
