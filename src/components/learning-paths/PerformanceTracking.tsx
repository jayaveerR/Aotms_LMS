import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Trophy, Target, Users } from "lucide-react";

const PerformanceTracking = () => {
  return (
    <section className="section-padding bg-muted/30">
      <div className="container-width">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
          <h2 className="font-heading text-3xl md:text-4xl text-sky-700 mb-4">
            Track Your Progress & Compete
          </h2>
          <p className="text-slate-600 mb-6">
              Monitor your learning journey with detailed analytics. See how you compare 
              with peers and stay motivated to reach your goals.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-sky-100 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-sky-600" />
              </div>
                <div>
                  <p className="font-medium text-foreground">Real-time Progress</p>
                  <p className="text-sm text-muted-foreground">Track completion across all courses</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                  <Trophy className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Leaderboard Rankings</p>
                  <p className="text-sm text-muted-foreground">Compete and climb the ranks</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-success/10 flex items-center justify-center">
                  <Target className="w-5 h-5 text-success" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Skill Assessments</p>
                  <p className="text-sm text-muted-foreground">Measure your expertise level</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-card rounded-2xl border border-border shadow-medium p-6"
          >
            {/* Progress Preview */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-foreground">Full Stack Developer Path</span>
                <span className="text-sm text-primary font-semibold">68% Complete</span>
              </div>
              <Progress value={68} className="h-3" />
            </div>

            {/* Skills Grid */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-primary">12</p>
                <p className="text-xs text-muted-foreground">Courses Completed</p>
              </div>
              <div className="bg-muted/50 rounded-xl p-4 text-center">
                <p className="text-2xl font-bold text-accent">85%</p>
                <p className="text-xs text-muted-foreground">Avg. Test Score</p>
              </div>
            </div>

            {/* Leaderboard Preview */}
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-medium text-foreground">Leaderboard Preview</span>
              </div>
              <div className="space-y-2">
                {[
                  { rank: 1, name: "Rahul K.", score: 2450, badge: "🥇" },
                  { rank: 2, name: "Priya S.", score: 2380, badge: "🥈" },
                  { rank: 3, name: "Amit R.", score: 2290, badge: "🥉" },
                  { rank: 47, name: "You", score: 1840, isUser: true },
                ].map((entry, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-2 rounded-lg ${
                      entry.isUser ? "bg-primary/10 border border-primary/20" : "bg-muted/30"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 text-center font-medium text-muted-foreground">
                        {entry.badge || `#${entry.rank}`}
                      </span>
                      <span className={`text-sm ${entry.isUser ? "font-semibold text-primary" : "text-foreground"}`}>
                        {entry.name}
                      </span>
                    </div>
                    <Badge variant={entry.isUser ? "default" : "secondary"} className="text-xs">
                      {entry.score} pts
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default PerformanceTracking;
