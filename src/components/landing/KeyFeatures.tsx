 import { motion } from "framer-motion";
 import {
   Video,
   PlayCircle,
   ShieldCheck,
   Trophy,
   FileText,
   TrendingUp,
 } from "lucide-react";
 
 const features = [
   {
     icon: Video,
     title: "Live Classes",
     description: "Interactive sessions with industry experts",
   },
   {
     icon: PlayCircle,
     title: "Recorded Videos",
     description: "Access course content anytime, anywhere",
   },
   {
     icon: ShieldCheck,
     title: "Secure Exams",
     description: "Proctored assessments with integrity",
   },
   {
     icon: Trophy,
     title: "Leaderboard",
     description: "Compete and track your ranking",
   },
   {
     icon: FileText,
     title: "ATS Resume Score",
     description: "Optimize your resume for job applications",
   },
   {
     icon: TrendingUp,
     title: "Progress Tracking",
     description: "Monitor your learning journey in real-time",
   },
 ];
 
 const KeyFeatures = () => {
   return (
     <section id="features" className="section-padding bg-background">
       <div className="container-width">
         <motion.div
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ duration: 0.5 }}
           className="text-center mb-12"
         >
           <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
             KEY FEATURES
           </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto">
             Everything you need to succeed in your learning journey
           </p>
         </motion.div>
 
         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
           {features.map((feature, index) => (
             <motion.div
               key={feature.title}
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ duration: 0.5, delay: index * 0.1 }}
               className="group flex items-start gap-4 p-6 bg-card rounded-xl border border-border hover:border-accent transition-colors"
             >
               <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-accent/10 flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                 <feature.icon className="w-6 h-6 text-accent" />
               </div>
               <div>
                 <h3 className="font-semibold text-foreground mb-1">
                   {feature.title}
                 </h3>
                 <p className="text-sm text-muted-foreground">
                   {feature.description}
                 </p>
               </div>
             </motion.div>
           ))}
         </div>
       </div>
     </section>
   );
 };
 
 export default KeyFeatures;