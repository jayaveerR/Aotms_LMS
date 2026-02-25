import { motion } from "framer-motion";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Trophy, Target, Users } from "lucide-react";

const PerformanceTracking = () => {
  return (
    <section className="py-24 bg-white relative">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none" />
      <div className="container-width px-4 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-20 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-5xl font-black text-black uppercase italic mb-6">
              REAL-TIME <br />
              <span className="text-[#FD5A1A]">TELEMETRY</span>
            </h2>
            <p className="text-black font-bold uppercase tracking-widest text-sm opacity-60 mb-10 leading-relaxed">
              Monitor your learning journey with precision analytics. Compete
              with the collective and ascend the ranks.
            </p>

            <div className="space-y-6">
              {[
                {
                  icon: TrendingUp,
                  title: "SYNC_STATUS",
                  desc: "Track completion across all modules.",
                  color: "#0075CF",
                },
                {
                  icon: Trophy,
                  title: "RANK_INDEX",
                  desc: "Climb the leaderboard in real-time.",
                  color: "#FD5A1A",
                },
                {
                  icon: Target,
                  title: "CAPABILITY_PROBING",
                  desc: "Measure your technical expertise.",
                  color: "#000000",
                },
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-6 group">
                  <div
                    className={`w-14 h-14 border-4 border-black flex items-center justify-center transition-colors group-hover:bg-[${item.color}] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
                  >
                    <item.icon className="w-6 h-6 text-black group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <p className="font-black text-black uppercase italic text-sm">
                      {item.title}
                    </p>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/40">
                      {item.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-[#E9E9E9] border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 relative overflow-hidden"
          >
            <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

            {/* Progress Preview */}
            <div className="mb-10 relative z-10">
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-black uppercase tracking-widest">
                  CURRICULUM_LOAD
                </span>
                <span className="text-sm font-black text-[#0075CF]">
                  68%_SYNCED
                </span>
              </div>
              <div className="border-4 border-black h-8 bg-white overflow-hidden relative">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: "68%" }}
                  viewport={{ once: true }}
                  transition={{ duration: 1, ease: "easeOut" }}
                  className="h-full bg-[#0075CF]"
                />
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 mb-10 relative z-10">
              <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#FD5A1A]">
                <p className="text-3xl font-black text-black mb-1 italic">12</p>
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40">
                  MODULES_COMPLETE
                </p>
              </div>
              <div className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_#0075CF]">
                <p className="text-3xl font-black text-black mb-1 italic">
                  85%
                </p>
                <p className="text-[10px] font-black uppercase tracking-widest text-black/40">
                  ACCURACY_INDEX
                </p>
              </div>
            </div>

            {/* Leaderboard Preview */}
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-6 border-b-2 border-black/10 pb-4">
                <Users className="w-5 h-5 text-black" />
                <span className="text-xs font-black uppercase tracking-widest">
                  COLLECTIVE_RANKINGS
                </span>
              </div>
              <div className="space-y-3">
                {[
                  { rank: 1, name: "RAHUL_K", score: 2450, color: "#FD5A1A" },
                  { rank: 2, name: "PRIYA_S", score: 2380, color: "#0075CF" },
                  {
                    rank: 3,
                    name: "YOU",
                    score: 1840,
                    isUser: true,
                    color: "#000000",
                  },
                ].map((entry, index) => (
                  <div
                    key={index}
                    className={`flex items-center justify-between p-4 border-2 border-black ${
                      entry.isUser
                        ? "bg-black text-white shadow-[4px_4px_0px_0px_#FD5A1A]"
                        : "bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                    } italic`}
                  >
                    <div className="flex items-center gap-4">
                      <span className="text-xs font-black opacity-40">
                        #{entry.rank}
                      </span>
                      <span className="text-sm font-black uppercase tracking-widest">
                        {entry.name}
                      </span>
                    </div>
                    <span className="text-xs font-black">
                      {entry.score}_PTS
                    </span>
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
