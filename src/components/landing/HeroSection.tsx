import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import GridScan from "./GridScan";

const HeroSection = () => {
  return <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-black">
       {/* GridScan Background */}
       <div className="absolute inset-0 z-0">
         <GridScan
           sensitivity={0.55}
           lineThickness={1}
           linesColor="#392e4e"
           gridScale={0.1}
           scanColor="#FF9FFC"
           scanOpacity={0.4}
           enablePost
           bloomIntensity={0.6}
           chromaticAberration={0.002}
           noiseIntensity={0.01}
         />
       </div>
 
       <div className="container-width section-padding relative z-10">
         <div className="max-w-4xl mx-auto text-center">
           <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6
        }}>
             <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
               <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
               Skill-based Learning Platform
             </span>
           </motion.div>
 
            <motion.h1 initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.1
        }} className="font-hero text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-tight mb-6 text-center font-semibold text-white drop-shadow-lg">
              Learn Practice<br />
              Get Job-Ready with AOTMS
           </motion.h1>
 
           <motion.p initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.2
        }} className="text-sm md:text-base text-white/80 max-w-2xl mx-auto mb-10">
             Skill-based learning with live classes, exams, and real-time
             performance tracking. Join thousands of students mastering
             industry-relevant skills.
           </motion.p>
 
           <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.3
        }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
             <Button variant="accent" size="xl" className="gap-2 group">
               Get Started
               <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
             </Button>
             <Button variant="hero" size="xl" className="gap-2">
               <Play className="w-5 h-5" />
               Watch Demo
             </Button>
           </motion.div>
 
           {/* Stats */}
           <motion.div initial={{
          opacity: 0,
          y: 30
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.6,
          delay: 0.4
        }} className="flex flex-wrap justify-center gap-8 md:gap-16 mt-16 pt-8 border-t border-border">
             {[{
            value: "10K+",
            label: "Active Students"
          }, {
            value: "50+",
            label: "Expert Instructors"
          }, {
            value: "100+",
            label: "Courses"
          }, {
            value: "95%",
            label: "Success Rate"
          }].map(stat => <div key={stat.label} className="text-center">
                 <p className="text-3xl md:text-4xl font-heading text-foreground">
                   {stat.value}
                 </p>
                 <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
               </div>)}
           </motion.div>
         </div>
       </div>
     </section>;
};
export default HeroSection;