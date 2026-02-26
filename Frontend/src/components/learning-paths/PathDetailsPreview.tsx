import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Check,
  Code,
  Database,
  Layout,
  Server,
  TestTube,
  Trophy,
} from "lucide-react";

interface PathDetailsPreviewProps {
  path: {
    title: string;
    courses: string[];
    skills: string[];
    tools: string[];
    practices: string[];
    roles: string[];
  } | null;
  onClose: () => void;
}

const PathDetailsPreview = ({ path, onClose }: PathDetailsPreviewProps) => {
  if (!path) return null;

  const icons = [Code, Database, Layout, Server, TestTube, Trophy];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-end sm:items-center justify-center p-0 sm:p-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 100 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 100 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white border-t-4 sm:border-8 border-black shadow-none sm:shadow-[20px_20px_0px_0px_#0075CF] max-w-3xl w-full max-h-[92vh] sm:max-h-[90vh] overflow-y-auto relative rounded-t-3xl sm:rounded-none"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#E9E9E9] border-b-4 sm:border-b-8 border-black p-6 sm:p-8 flex items-center justify-between z-20">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.2em] text-[#0075CF] mb-1">
                Strategy Briefing
              </div>
              <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-black uppercase italic leading-tight">
                {path.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-10 h-10 sm:w-12 sm:h-12 bg-black text-white flex items-center justify-center border-2 sm:border-4 border-black hover:bg-[#FD5A1A] transition-colors shadow-[3px_3px_0px_0px_rgba(0,0,0,0.3)] rounded-lg"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="p-6 sm:p-8 space-y-10 sm:space-y-12">
            <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

            {/* Course Flow */}
            <div className="relative z-10">
              <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest mb-6 sm:mb-8 text-black/40 border-l-4 border-black pl-4">
                Curriculum Flow
              </h3>
              <div className="relative">
                <div className="absolute left-6 top-8 bottom-8 w-1 bg-black/5" />
                <div className="space-y-4 sm:space-y-6">
                  {path.courses.map((course, index) => {
                    const Icon = icons[index % icons.length];
                    return (
                      <div
                        key={index}
                        className="flex items-start sm:items-center gap-4 sm:gap-6 relative"
                      >
                        <div className="shrink-0 w-12 h-12 bg-white border-2 sm:border-4 border-black flex items-center justify-center z-10 shadow-[3px_3px_0px_0px_black] group transition-all rounded-lg">
                          <Icon className="w-5 h-5 text-black group-hover:text-[#FD5A1A]" />
                        </div>
                        <div className="flex-1 bg-[#F9F9F9] border-2 border-black p-3 sm:p-4 rounded-xl">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <span className="text-xs sm:text-sm font-black text-black uppercase tracking-tight">
                              {course}
                            </span>
                            <span className="text-[8px] sm:text-[10px] font-black opacity-30 uppercase">
                              Phase {index + 1}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Skills & Tools Grid */}
            <div className="grid md:grid-cols-2 gap-10 sm:gap-12 relative z-10">
              <div>
                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 sm:mb-6 text-black/40 border-l-4 border-[#FD5A1A] pl-4">
                  Mastered Capabilities
                </h3>
                <div className="flex flex-wrap gap-2">
                  {path.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-black text-white border-2 border-black px-2.5 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#FD5A1A] rounded-md"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 sm:mb-6 text-black/40 border-l-4 border-[#0075CF] pl-4">
                  Authorized Toolkit
                </h3>
                <div className="flex flex-wrap gap-2">
                  {path.tools.map((tool, index) => (
                    <div
                      key={index}
                      className="bg-white text-black border-2 border-black px-2.5 py-1 text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_#0075CF] rounded-md"
                    >
                      {tool}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Career Roles */}
            <div className="bg-[#0075CF] text-white border-4 border-black p-6 sm:p-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] relative z-10 rounded-2xl">
              <h3 className="text-[10px] sm:text-xs font-black uppercase tracking-widest mb-4 sm:mb-6 text-white/70">
                Deployment Targets
              </h3>
              <div className="flex flex-wrap gap-4 sm:gap-6">
                {path.roles.map((role, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-white" />
                    <span className="text-xs sm:text-sm font-black uppercase italic tracking-widest">
                      {role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t-4 sm:border-t-8 border-black p-6 sm:p-8 z-20">
            <Button className="w-full bg-[#FD5A1A] text-white border-4 border-black p-6 sm:p-8 text-lg sm:text-xl font-black uppercase tracking-widest shadow-[6px_6px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-xl h-auto italic">
              Initialize Enrollment
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PathDetailsPreview;
