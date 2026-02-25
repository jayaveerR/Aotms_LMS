import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, BookOpen, ArrowRight, Star } from "lucide-react";

interface LearningPathCardProps {
  title: string;
  description: string;
  level: "Beginner" | "Intermediate" | "Advanced";
  duration: string;
  courseCount: number;
  isPopular?: boolean;
  onViewPath: () => void;
}

const LearningPathCard = ({
  title,
  description,
  level,
  duration,
  courseCount,
  isPopular,
  onViewPath,
}: LearningPathCardProps) => {
  const levelStyles = {
    Beginner: "border-[#E9E9E9] bg-white text-black",
    Intermediate: "border-[#0075CF] bg-[#0075CF] text-white",
    Advanced: "border-[#FD5A1A] bg-[#FD5A1A] text-white",
  };

  return (
    <motion.div
      whileHover={{ y: -6, x: -6 }}
      transition={{ duration: 0.2 }}
      className="group relative bg-white border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[14px_14px_0px_0px_rgba(0,117,207,1)] transition-all flex flex-col h-full"
    >
      {isPopular && (
        <div className="absolute -top-4 -right-4 z-10">
          <div className="bg-[#FD5A1A] text-white border-4 border-black px-4 py-1 text-[10px] font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
            <Star className="w-3 h-3 fill-current" />
            ELITE CHOICE
          </div>
        </div>
      )}

      <div className="mb-4">
        <Badge
          className={`border-2 border-black rounded-none px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${levelStyles[level]}`}
        >
          {level}
        </Badge>
      </div>

      <h3 className="text-2xl font-black text-black mb-3 uppercase italic leading-none group-hover:text-[#0075CF] transition-colors">
        {title}
      </h3>

      <p className="text-black font-bold text-xs mb-6 opacity-60 line-clamp-3 flex-1">
        {description}
      </p>

      <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-black/40 mb-8 border-t-2 border-dashed border-black/10 pt-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-black" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-black" />
          <span>{courseCount} modules</span>
        </div>
      </div>

      <Button
        className="w-full bg-black text-white rounded-none border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,117,207,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-black uppercase tracking-[0.2em] text-xs h-12"
        onClick={onViewPath}
      >
        INITIATE PATH
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
};

export default LearningPathCard;
