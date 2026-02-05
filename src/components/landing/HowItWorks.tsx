 import { motion } from "framer-motion";
 import { UserPlus, BookMarked, Video, ClipboardCheck, Trophy } from "lucide-react";
 
 const steps = [
   {
     icon: UserPlus,
     step: "01",
     title: "Sign Up & Create Profile",
     description: "Create your account and personalize your learning profile",
   },
   {
     icon: BookMarked,
     step: "02",
     title: "Choose Your Course",
     description: "Browse and enroll in courses that match your goals",
   },
   {
     icon: Video,
     step: "03",
     title: "Attend Classes",
     description: "Join live sessions or watch recorded lectures",
   },
   {
     icon: ClipboardCheck,
     step: "04",
     title: "Practice Mock Tests",
     description: "Sharpen your skills with practice assessments",
   },
   {
     icon: Trophy,
     step: "05",
     title: "Track Your Rank",
     description: "Complete exams and climb the leaderboard",
   },
 ];
 
 const HowItWorks = () => {
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
             HOW IT WORKS
           </h2>
           <p className="text-muted-foreground max-w-2xl mx-auto">
             Your journey from enrollment to employment in 5 simple steps
           </p>
         </motion.div>
 
         <div className="relative">
           {/* Connection line */}
           <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0" />
           
           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 relative z-10">
             {steps.map((step, index) => (
               <motion.div
                 key={step.title}
                 initial={{ opacity: 0, y: 20 }}
                 whileInView={{ opacity: 1, y: 0 }}
                 viewport={{ once: true }}
                 transition={{ duration: 0.5, delay: index * 0.1 }}
                 className="flex flex-col items-center text-center"
               >
                 <div className="relative">
                   <div className="w-20 h-20 rounded-full bg-card border-2 border-primary flex items-center justify-center mb-4 shadow-medium">
                     <step.icon className="w-8 h-8 text-primary" />
                   </div>
                   <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-accent text-accent-foreground text-sm font-bold flex items-center justify-center">
                     {step.step}
                   </span>
                 </div>
                 <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                 <p className="text-sm text-muted-foreground">{step.description}</p>
               </motion.div>
             ))}
           </div>
         </div>
       </div>
     </section>
   );
 };
 
 export default HowItWorks;