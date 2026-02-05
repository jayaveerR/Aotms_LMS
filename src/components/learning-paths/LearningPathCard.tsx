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
  const levelColors = {
    Beginner: "bg-emerald-100 text-emerald-700 border-emerald-200",
    Intermediate: "bg-sky-100 text-sky-700 border-sky-200",
    Advanced: "bg-amber-100 text-amber-700 border-amber-200",
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-card rounded-xl border border-border p-6 shadow-soft hover:shadow-medium hover:border-sky-300 transition-all duration-300"
    >
      {isPopular && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-accent text-accent-foreground gap-1">
            <Star className="w-3 h-3 fill-current" />
            Most Chosen
          </Badge>
        </div>
      )}

      <div className="mb-4">
        <Badge variant="outline" className={levelColors[level]}>
          {level}
        </Badge>
      </div>

      <h3 className="font-heading text-xl text-foreground mb-2 group-hover:text-sky-600 transition-colors">
        {title}
      </h3>
      
      <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
        {description}
      </p>

      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
        <div className="flex items-center gap-1.5">
          <Clock className="w-4 h-4" />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <BookOpen className="w-4 h-4" />
          <span>{courseCount} courses</span>
        </div>
      </div>

      <Button 
        variant="outline" 
        className="w-full group-hover:bg-sky-500 group-hover:text-white group-hover:border-sky-500 transition-all"
        onClick={onViewPath}
      >
        View Path
        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
      </Button>
    </motion.div>
  );
};

export default LearningPathCard;
