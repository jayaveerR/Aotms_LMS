 import { motion } from "framer-motion";
 import { Quote } from "lucide-react";
 import { useState } from "react";
 
 const testimonials = [
   {
     name: "Aditya Krishnan",
     course: "Full Stack Development",
     feedback:
       "AOTMS transformed my career. The live classes and hands-on projects helped me land my dream job at a top tech company.",
     avatar: "AK",
   },
   {
     name: "Meera Nair",
     course: "Data Science",
     feedback:
       "The curriculum is perfectly aligned with industry needs. The ATS resume scoring feature was a game-changer for my job search.",
     avatar: "MN",
   },
   {
     name: "Sanjay Gupta",
     course: "Cloud Computing",
     feedback:
       "Excellent instructors and comprehensive course material. The secure exam system gave me confidence in my certifications.",
     avatar: "SG",
   },
 ];
 
 const Testimonials = () => {
   const [activeIndex, setActiveIndex] = useState(0);
 
   return (
     <section className="section-padding bg-background-alt">
       <div className="container-width">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="text-center mb-12"
         >
           <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
             STUDENT SUCCESS STORIES
           </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto">
             Hear from our students who have transformed their careers
           </p>
         </motion.div>
 
         <div className="max-w-4xl mx-auto">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
             {testimonials.map((testimonial, index) => (
               <motion.div
                 key={testimonial.name}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
                 className={`bg-card rounded-xl p-6 shadow-soft border border-border hover-lift cursor-pointer transition-all ${
                   activeIndex === index ? "border-accent ring-2 ring-accent/20" : ""
                 }`}
                 onClick={() => setActiveIndex(index)}
               >
                 <Quote className="w-8 h-8 text-accent/30 mb-4" />
                 <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                   "{testimonial.feedback}"
                 </p>
                 <div className="flex items-center gap-3">
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                     {testimonial.avatar}
                   </div>
                   <div>
                     <p className="font-medium text-foreground text-sm">
                       {testimonial.name}
                     </p>
                     <p className="text-xs text-accent">{testimonial.course}</p>
                   </div>
                 </div>
               </motion.div>
             ))}
           </div>
 
           <div className="flex justify-center gap-2 mt-8">
             {testimonials.map((_, index) => (
               <button
                 key={index}
                 onClick={() => setActiveIndex(index)}
                 className={`w-2 h-2 rounded-full transition-all ${
                   activeIndex === index
                     ? "w-6 bg-accent"
                     : "bg-border hover:bg-muted-foreground"
                 }`}
                 aria-label={`Go to testimonial ${index + 1}`}
               />
             ))}
           </div>
         </div>
       </div>
     </section>
   );
 };
 
 export default Testimonials;