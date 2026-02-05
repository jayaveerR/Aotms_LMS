 import { motion } from "framer-motion";
 import { Button } from "@/components/ui/button";
 import { ArrowRight } from "lucide-react";
 import SnowParticles from "./SnowParticles";
 
 const HeroSection = () => {
   return (
     <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-white">
       {/* Snow animation background */}
       <SnowParticles />
 
       {/* Subtle abstract shapes */}
       <div className="absolute inset-0 pointer-events-none z-0">
         <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/[0.03] rounded-full blur-3xl" />
         <div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-muted/50 rounded-full blur-3xl" />
       </div>
 
       <div className="container-width section-padding relative z-10">
         <div className="max-w-3xl mx-auto text-center">
           {/* Hero Title */}
           <motion.h1
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, ease: "easeOut" }}
             className="font-hero text-4xl md:text-5xl lg:text-6xl leading-relaxed mb-6"
           >
             Smart Learning for Real-World Careers
           </motion.h1>
 
           {/* Subtitle */}
           <motion.p
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
             className="text-base md:text-lg text-[#555555] max-w-xl mx-auto mb-10 leading-relaxed"
           >
             Learn industry-relevant skills, practice with real exams, and track your progress in real time.
           </motion.p>
 
           {/* CTA Buttons */}
           <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
             className="flex flex-col sm:flex-row items-center justify-center gap-4"
           >
             <Button 
               variant="accent" 
               size="xl" 
               className="gap-2 group rounded-full shadow-md hover:shadow-lg"
             >
               Get Started
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Button>
             <Button 
               variant="outline" 
               size="xl" 
               className="rounded-full border-2 border-primary text-primary bg-transparent hover:bg-primary/5"
             >
               Login
             </Button>
           </motion.div>
         </div>
       </div>
     </section>
   );
 };
 
 export default HeroSection;