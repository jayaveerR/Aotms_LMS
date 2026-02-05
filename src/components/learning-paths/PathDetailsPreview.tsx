import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Check, Code, Database, Layout, Server, TestTube, Trophy } from "lucide-react";

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
        className="fixed inset-0 bg-foreground/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.3 }}
          className="bg-card rounded-2xl shadow-large max-w-2xl w-full max-h-[85vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
            <h2 className="font-heading text-2xl text-foreground">{path.title}</h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="w-5 h-5" />
            </Button>
          </div>

          <div className="p-6 space-y-8">
            {/* Course Flow */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Course Progression</h3>
              <div className="relative">
                <div className="absolute left-4 top-8 bottom-4 w-0.5 bg-border" />
                <div className="space-y-4">
                  {path.courses.map((course, index) => {
                    const Icon = icons[index % icons.length];
                    return (
                      <div key={index} className="flex items-center gap-4 relative">
                        <div className="w-8 h-8 rounded-full bg-primary/10 border-2 border-primary flex items-center justify-center z-10">
                          <Icon className="w-4 h-4 text-primary" />
                        </div>
                        <div className="flex-1 bg-muted/50 rounded-lg p-3">
                          <span className="text-sm font-medium text-foreground">{course}</span>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          Step {index + 1}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Skills Gained */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Skills You'll Gain</h3>
              <div className="flex flex-wrap gap-2">
                {path.skills.map((skill, index) => (
                  <Badge key={index} variant="secondary" className="gap-1">
                    <Check className="w-3 h-3" />
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Tools & Technologies */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Tools & Technologies</h3>
              <div className="flex flex-wrap gap-2">
                {path.tools.map((tool, index) => (
                  <Badge key={index} variant="outline">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>

            {/* Practice Methods */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">Practice Methods</h3>
              <div className="grid grid-cols-2 gap-3">
                {path.practices.map((practice, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-2 h-2 rounded-full bg-accent" />
                    {practice}
                  </div>
                ))}
              </div>
            </div>

            {/* Career Roles */}
            <div className="bg-primary/5 rounded-xl p-4">
              <h3 className="font-semibold text-foreground mb-3">Career Roles After Completion</h3>
              <div className="flex flex-wrap gap-2">
                {path.roles.map((role, index) => (
                  <Badge key={index} className="bg-primary text-primary-foreground">
                    {role}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="sticky bottom-0 bg-card border-t border-border p-6">
            <Button variant="accent" size="lg" className="w-full">
              Enroll in This Path
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default PathDetailsPreview;
