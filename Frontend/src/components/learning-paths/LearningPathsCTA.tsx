import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";

const LearningPathsCTA = () => {
  const navigate = useNavigate();

  return (
    <section className="py-24 bg-black relative overflow-hidden border-t-8 border-[#FD5A1A]">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

      <div className="container-width relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-4xl mx-auto"
        >
          <h2 className="text-4xl md:text-6xl lg:text-8xl font-black text-white uppercase italic leading-[0.9] mb-8">
            READY TO <br />
            <span className="text-[#FD5A1A]">DOMINATE</span> THE FIELD?
          </h2>
          <p className="text-white/60 font-bold uppercase tracking-widest text-sm mb-12 max-w-2xl mx-auto">
            Select your curriculum and join the elite ranks of AOTMS
            professionals. Your future is waiting for you to execute.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-8">
            <Button
              className="bg-[#FD5A1A] text-white border-4 border-black px-10 py-8 text-lg font-black uppercase tracking-[0.2em] shadow-[8px_8px_0px_0px_white] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all h-auto rounded-none w-full sm:w-auto"
              onClick={() => window.scrollTo({ top: 400, behavior: "smooth" })}
            >
              BROWSE_SYSTEMS
              <ArrowRight className="w-6 h-6 ml-3" />
            </Button>
            <Button
              className="bg-white text-black border-4 border-black px-10 py-8 text-lg font-black uppercase tracking-[0.2em] shadow-[8px_8px_0px_0px_#0075CF] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all h-auto rounded-none w-full sm:w-auto"
              onClick={() => navigate("/auth")}
            >
              <UserPlus className="w-6 h-6 mr-3" />
              JOIN_COLLECTIVE
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default LearningPathsCTA;
