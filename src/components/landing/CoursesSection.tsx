 import { motion } from "framer-motion";
 import { Button } from "@/components/ui/button";
 import { Clock, BarChart3, ArrowRight } from "lucide-react";
 
 const courses = [
   {
     title: "Full Stack Web Development",
     level: "Beginner",
     duration: "12 Weeks",
     image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&h=250&fit=crop",
   },
   {
     title: "Data Science & Analytics",
     level: "Intermediate",
     duration: "10 Weeks",
     image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
   },
   {
     title: "Cloud Computing & DevOps",
     level: "Advanced",
     duration: "8 Weeks",
     image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=400&h=250&fit=crop",
   },
   {
     title: "UI/UX Design Mastery",
     level: "Beginner",
     duration: "6 Weeks",
     image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
   },
 ];
 
 const levelColors: Record<string, string> = {
   Beginner: "bg-green-100 text-green-700",
   Intermediate: "bg-amber-100 text-amber-700",
   Advanced: "bg-red-100 text-red-700",
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
               className="group bg-card rounded-xl overflow-hidden shadow-soft hover-lift border border-border hover:border-accent"
             >
               <div className="relative h-40 overflow-hidden">
                 <img
                   src={course.image}
                   alt={course.title}
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                 />
                 <span
                   className={`absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-medium ${levelColors[course.level]}`}
                 >
                   {course.level}
                 </span>
               </div>
               <div className="p-5">
                 <h3 className="font-semibold text-foreground mb-3 line-clamp-2">
                   {course.title}
                 </h3>
                 <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                   <span className="flex items-center gap-1">
                     <Clock className="w-4 h-4" />
                     {course.duration}
                   </span>
                   <span className="flex items-center gap-1">
                     <BarChart3 className="w-4 h-4" />
                     {course.level}
                   </span>
                 </div>
                 <Button variant="hero-outline" size="sm" className="w-full gap-1 group/btn">
                   Explore Course
                   <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                 </Button>
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