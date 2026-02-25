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
        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-8"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 40 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="bg-white border-8 border-black shadow-[20px_20px_0px_0px_#0075CF] max-w-3xl w-full max-h-[90vh] overflow-y-auto relative"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-[#E9E9E9] border-b-8 border-black p-8 flex items-center justify-between z-20">
            <div>
              <div className="text-[10px] font-black uppercase tracking-[0.3em] text-[#0075CF] mb-1">
                STRATEGY_DETAILS
              </div>
              <h2 className="text-2xl md:text-3xl font-black text-black uppercase italic leading-none">
                {path.title}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="w-12 h-12 bg-black text-white flex items-center justify-center border-4 border-black hover:bg-[#FD5A1A] transition-colors shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 space-y-12">
            <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />

            {/* Course Flow */}
            <div className="relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-8 text-black/40 border-l-4 border-black pl-4">
                CURRICULUM_SEQUENCING
              </h3>
              <div className="relative">
                <div className="absolute left-6 top-8 bottom-8 w-1 bg-black/10" />
                <div className="space-y-6">
                  {path.courses.map((course, index) => {
                    const Icon = icons[index % icons.length];
                    return (
                      <div
                        key={index}
                        className="flex items-center gap-6 relative"
                      >
                        <div className="w-12 h-12 bg-white border-4 border-black flex items-center justify-center z-10 shadow-[4px_4px_0px_0px_black] group transition-all hover:bg-black">
                          <Icon className="w-5 h-5 text-black group-hover:text-white transition-colors" />
                        </div>
                        <div className="flex-1 bg-[#E9E9E9] border-2 border-black p-4 italic">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-black text-black uppercase">
                              {course}
                            </span>
                            <span className="text-[10px] font-black opacity-30">
                              PHASE_0{index + 1}
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
            <div className="grid md:grid-cols-2 gap-12 relative z-10">
              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-black/40 border-l-4 border-[#FD5A1A] pl-4">
                  CAPABILITIES_ACQUIRED
                </h3>
                <div className="flex flex-wrap gap-2">
                  {path.skills.map((skill, index) => (
                    <div
                      key={index}
                      className="bg-black text-white border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#FD5A1A]"
                    >
                      {skill}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-black/40 border-l-4 border-[#0075CF] pl-4">
                  TOOLKIT_AUTHORIZED
                </h3>
                <div className="flex flex-wrap gap-2">
                  {path.tools.map((tool, index) => (
                    <div
                      key={index}
                      className="bg-white text-black border-2 border-black px-3 py-1 text-[10px] font-black uppercase tracking-widest shadow-[3px_3px_0px_0px_#0075CF]"
                    >
                      {tool}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Career Roles */}
            <div className="bg-black text-white border-4 border-black p-8 shadow-[8px_8px_0px_0px_#FD5A1A] relative z-10">
              <h3 className="text-xs font-black uppercase tracking-[0.2em] mb-6 text-[#FD5A1A]">
                RECON_TARGETS: ROLES
              </h3>
              <div className="flex flex-wrap gap-4">
                {path.roles.map((role, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-[#FD5A1A]" />
                    <span className="text-sm font-black uppercase italic tracking-widest">
                      {role}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-white border-t-8 border-black p-8 z-20">
            <Button className="w-full bg-[#0075CF] text-white border-4 border-black p-8 text-xl font-black uppercase tracking-[0.3em] shadow-[8px_8px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-none h-auto italic">
              INITIALIZE_ENROLLMENT
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PathDetailsPreview;
