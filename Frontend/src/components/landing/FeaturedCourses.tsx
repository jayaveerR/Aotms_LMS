import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useCourses, Course } from '@/hooks/useCourses';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function FeaturedCourses() {
  const { courses, fetchCourses, loading } = useCourses();
  const navigate = useNavigate();

  useEffect(() => {
    fetchCourses(1, 'all', true);
  }, [fetchCourses]);

  const featured = courses.slice(0, 6);

  if (loading && courses.length === 0) return null;

  return (
    <section id="courses" className="py-24 bg-white relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-w bg-gradient-to-b from-slate-50 to-white" />
      <div className="absolute top-40 -left-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
      <div className="absolute bottom-40 -right-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl" />

      <div className="container-width section-padding relative z-10">
        <div className="text-center mb-16 space-y-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <Badge className="bg-primary/10 text-primary hover:bg-primary/20 border-none px-4 py-1.5 text-sm font-bold tracking-wider uppercase mb-4">
              Explore Programs
            </Badge>
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight">
              Master In-Demand <span className="text-primary italic">Tech Skills</span>
            </h2>
            <p className="text-slate-600 max-w-2xl mx-auto text-lg font-medium mt-4">
              Choose from our curated selection of professional engineering courses designed by industry experts.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {featured.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group"
            >
              <Card 
                className="pro-card h-full overflow-hidden border-0 shadow-lg group-hover:shadow-2xl transition-all duration-500 cursor-pointer"
                onClick={() => navigate('/courses')}
              >
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={course.image}
                    alt={course.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  
                  <Badge 
                    className="absolute top-4 left-4 border-none font-bold shadow-lg"
                    style={{ backgroundColor: course.theme_color }}
                  >
                    {course.category}
                  </Badge>

                  <div className="absolute bottom-4 left-4 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-full shadow-lg">
                    <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs font-black text-slate-800">{course.rating}</span>
                  </div>
                </div>

                <CardContent className="p-6 space-y-4 flex flex-col justify-between h-[calc(100%-14rem)]">
                  <div>
                    <h3 className="font-bold text-xl text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                      {course.title}
                    </h3>
                    <p className="text-sm text-slate-500 mt-2 line-clamp-2 font-medium">
                      {course.level}
                    </p>
                  </div>

                  <div className="space-y-4 pt-2">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
                       <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {course.duration}</span>
                       <span className="text-primary">{course.price}</span>
                    </div>

                    <Button variant="ghost" className="w-full justify-between px-0 hover:bg-transparent text-primary font-bold group/btn">
                       Learn More
                       <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className="text-center">
          <Button 
            size="xl" 
            className="pro-button-primary h-14 px-12 rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all"
            onClick={() => navigate('/courses')}
          >
            View All Courses
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
}
