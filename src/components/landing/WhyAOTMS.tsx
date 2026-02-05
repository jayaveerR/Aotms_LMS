 import { motion } from "framer-motion";
 import { BookOpen, Video, ShieldCheck, FileText } from "lucide-react";
 
 const features = [
   {
     icon: BookOpen,
     title: "Industry-Oriented Courses",
     description: "Curriculum designed with real industry requirements in mind",
   },
   {
     icon: Video,
     title: "Live Classes & Recordings",
     description: "Learn live or catch up with recorded sessions anytime",
   },
   {
     icon: ShieldCheck,
     title: "Secure Online Exams",
     description: "Proctored assessments with anti-cheating measures",
   },
   {
     icon: FileText,
     title: "Resume ATS Scoring",
     description: "Get your resume scored for applicant tracking systems",
   },
 ];
 
 const WhyAOTMS = () => {
   return (
     <section id="about" className="bg-background-alt section-padding">
       <div className="container-width">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="text-center mb-12"
         >
           <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
             WHY CHOOSE AOTMS?
           </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto">
             We provide everything you need to succeed in your learning journey
           </p>
         </motion.div>
 
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {features.map((feature, index) => (
             <motion.div
               key={feature.title}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: index * 0.1 }}
               className="group bg-card rounded-xl p-6 shadow-soft hover-lift border border-border"
             >
               <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-accent/10 transition-colors">
                 <feature.icon className="w-7 h-7 text-primary group-hover:text-accent transition-colors" />
               </div>
               <h3 className="font-heading text-xl text-foreground mb-2">
                 {feature.title}
               </h3>
               <p className="text-muted-foreground text-sm">
                 {feature.description}
               </p>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   );
 };
 
 export default WhyAOTMS;