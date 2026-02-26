import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LearningPathsCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-20 sm:py-24 bg-black relative overflow-hidden border-t-4 sm:border-t-8 border-[#FD5A1A]">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

      <div className="container-width relative z-10 px-6 sm:px-8 lg:px-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-3xl sm:text-5xl lg:text-8xl font-black text-white uppercase italic leading-[1] sm:leading-[0.9] mb-8">
            READY TO <br />
            <span className="text-[#FD5A1A]">DOMINATE</span> THE FIELD?
          </h2>
          <p className="text-white/60 font-bold uppercase tracking-widest text-[10px] sm:text-sm mb-12 max-w-2xl mx-auto">
            Select your curriculum and join the elite ranks of AOTMS
            professionals. Your future is waiting for you to execute.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-8">
            <Button
              className="bg-[#FD5A1A] text-white border-2 sm:border-4 border-black px-8 sm:px-10 py-6 sm:py-8 text-base sm:text-lg font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_white] sm:shadow-[8px_8px_0px_0px_white] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all h-auto rounded-xl w-full sm:w-auto italic"
              onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}
            >
              Browse Strategies
              <ArrowRight className="w-5 h-5 sm:w-6 sm:h-6 ml-3" />
            </Button>
            <Button
              className="bg-white text-black border-2 sm:border-4 border-black px-8 sm:px-10 py-6 sm:py-8 text-base sm:text-lg font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_#0075CF] sm:shadow-[8px_8px_0px_0px_#0075CF] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all h-auto rounded-xl w-full sm:w-auto italic"
              onClick={() => navigate("/auth")}
            >
              <UserPlus className="w-5 h-5 sm:w-6 sm:h-6 mr-3" />
              Join Collective
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningPathsCTA;
