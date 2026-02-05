 import { motion } from "framer-motion";
 import { Linkedin, Twitter } from "lucide-react";
 
 const instructors = [
   {
     name: "Dr. Rajesh Kumar",
     expertise: "Full Stack Development",
     experience: "15+ Years",
     image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
   },
   {
     name: "Priya Menon",
     expertise: "Data Science & AI",
     experience: "12+ Years",
     image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop&crop=face",
   },
   {
     name: "Amit Sharma",
     expertise: "Cloud & DevOps",
     experience: "10+ Years",
     image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
   },
   {
     name: "Sneha Reddy",
     expertise: "UI/UX Design",
     experience: "8+ Years",
     image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
   },
 ];
 
 const Instructors = () => {
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
           <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
             LEARN FROM THE BEST
           </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto">
             Our instructors bring real-world experience from top tech companies
           </p>
         </motion.div>
 
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
           {instructors.map((instructor, index) => (
             <motion.div
               key={instructor.name}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: index * 0.1 }}
               className="group bg-card rounded-xl overflow-hidden shadow-soft hover-lift border border-border"
             >
               <div className="relative h-48 overflow-hidden">
                 <img
                   src={instructor.image}
                   alt={instructor.name}
                   className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                 />
                 <div className="absolute inset-0 bg-gradient-to-t from-foreground/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4 gap-3">
                   <a
                     href="#"
                     className="w-9 h-9 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors"
                   >
                     <Linkedin className="w-4 h-4 text-primary" />
                   </a>
                   <a
                     href="#"
                     className="w-9 h-9 rounded-full bg-background/90 flex items-center justify-center hover:bg-background transition-colors"
                   >
                     <Twitter className="w-4 h-4 text-primary" />
                   </a>
                 </div>
               </div>
               <div className="p-5 text-center">
                 <h3 className="font-semibold text-foreground mb-1">
                   {instructor.name}
                 </h3>
                 <p className="text-sm text-accent font-medium mb-1">
                   {instructor.expertise}
                 </p>
                 <p className="text-xs text-muted-foreground">
                   {instructor.experience} Experience
                 </p>
               </div>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   );
 };
 
 export default Instructors;