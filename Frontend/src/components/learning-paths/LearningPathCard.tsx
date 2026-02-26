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
      className="group relative bg-white border-2 sm:border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all flex flex-col h-full rounded-xl"
    >
      {isPopular && (
        <div className="absolute -top-3 sm:-top-4 -right-2 sm:-right-4 z-10">
          <div className="bg-[#FD5A1A] text-white border-2 sm:border-4 border-black px-3 sm:px-4 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-2">
            <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
            Elite Choice
          </div>
        </div>
      )}

      <div className="mb-4">
        <Badge
          className={`border-2 border-black rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,0.2)] ${levelStyles[level]}`}
        >
          {level}
        </Badge>
      </div>

      <h3 className="text-xl sm:text-2xl font-black text-black mb-3 uppercase italic leading-tight group-hover:text-[#0075CF] transition-colors">
        {title}
      </h3>

      <p className="text-black font-bold text-[11px] sm:text-xs mb-6 opacity-60 line-clamp-3 flex-1">
        {description}
      </p>

      <div className="flex items-center gap-4 sm:gap-6 text-[10px] font-black uppercase tracking-widest text-black/40 mb-8 border-t-2 border-black/5 pt-4">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-[#0075CF]" />
          <span className="text-black/80">{duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-[#FD5A1A]" />
          <span className="text-black/80">{courseCount} modules</span>
        </div>
      </div>

      <Button
        className="w-full bg-black text-white rounded-xl border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,117,207,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all font-black uppercase tracking-widest text-[10px] sm:text-xs h-12"
        onClick={onViewPath}
      >
        View Strategy
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
};

export default LearningPathCard;
