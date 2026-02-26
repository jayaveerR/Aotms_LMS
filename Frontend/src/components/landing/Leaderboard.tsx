import { motion } from "framer-motion";
import { Trophy, Medal, Award, ArrowRight } from "lucide-react";

const leaderboardData = [
  { rank: 1, name: "Arun Kumar", score: 9850, avatar: "AK" },
  { rank: 2, name: "Priya Sharma", score: 9720, avatar: "PS" },
  { rank: 3, name: "Rahul Verma", score: 9580, avatar: "RV" },
  { rank: 4, name: "Sneha Patel", score: 9420, avatar: "SP" },
  { rank: 5, name: "Vikram Singh", score: 9350, avatar: "VS" },
];

const getRankIcon = (rank: number) => {
  switch (rank) {
    case 1:
      return <Trophy className="w-5 h-5 text-amber-500" />;
    case 2:
      return <Medal className="w-5 h-5 text-gray-400" />;
    case 3:
      return <Award className="w-5 h-5 text-amber-700" />;
    default:
      return null;
  }
};

const Leaderboard = () => {
  return (
    <section className="py-24 md:py-32 bg-white relative overflow-hidden font-['Inter']">
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

      <div className="container-width px-4 md:px-8 lg:px-16 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-3 px-6 py-2 bg-[#0075CF] border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] text-white mb-8">
              <Trophy className="w-4 h-4" />
              <span className="text-xs font-black uppercase tracking-[0.2em]">
                Competitive Learning
              </span>
            </div>
            <h2 className="font-heading text-5xl md:text-6xl text-black mb-8 uppercase italic leading-[0.9]">
              COMPETE, <span className="text-[#FD5A1A]">IMPROVE</span> <br />&{" "}
              <span className="text-[#0075CF]">LEAD</span>
            </h2>
            <p className="text-black font-bold uppercase tracking-widest text-sm mb-12 opacity-50 leading-relaxed max-w-lg">
              Track your progress, compare with peers, and climb the
              leaderboard. Our ranking system motivates you to perform better
              and achieve your learning goals.
            </p>
            <div className="flex gap-12">
              <div className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[-1deg] hover:rotate-0 transition-transform">
                <p className="text-4xl font-black text-[#0075CF] mb-1 italic">
                  500+
                </p>
                <p className="text-[10px] font-black tracking-widest uppercase opacity-40">
                  Weekly Competitors
                </p>
              </div>
              <div className="bg-white p-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rotate-[1deg] hover:rotate-0 transition-transform">
                <p className="text-4xl font-black text-[#FD5A1A] mb-1 italic">
                  25+
                </p>
                <p className="text-[10px] font-black tracking-widest uppercase opacity-40">
                  Active Leaderboards
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] p-8 sm:p-10 rounded-none relative overflow-hidden"
          >
            {/* Background Detail */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#E9E9E9] -rotate-45 translate-x-16 -translate-y-16 border-4 border-black pointer-events-none" />

            <div className="flex items-center justify-between mb-10 border-b-4 border-black pb-6">
              <h3 className="text-2xl font-black text-black uppercase tracking-tight italic flex items-center gap-3">
                <Medal className="w-6 h-6 text-[#FD5A1A]" /> Top Performers
              </h3>
              <span className="text-[10px] font-black uppercase tracking-widest bg-black text-white px-3 py-1">
                This Week
              </span>
            </div>

            <div className="space-y-4">
              {leaderboardData.map((user, index) => (
                <div
                  key={user.rank}
                  className={`flex items-center gap-4 p-4 border-4 border-black transition-all ${
                    user.rank === 1
                      ? "bg-[#FD5A1A] text-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white hover:bg-[#E9E9E9] translate-x-[-4px] translate-y-[-4px] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-0 hover:translate-y-0 hover:shadow-none"
                  }`}
                >
                  <span
                    className={`w-8 text-center font-black italic text-xl ${
                      user.rank === 1 ? "text-white" : "text-[#0075CF]"
                    }`}
                  >
                    {user.rank}
                  </span>
                  <div
                    className={`w-12 h-12 border-2 border-black flex items-center justify-center text-sm font-black italic shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${user.rank === 1 ? "bg-white text-black" : "bg-[#0075CF] text-white"}`}
                  >
                    {user.avatar}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`font-black uppercase tracking-widest text-xs ${user.rank === 1 ? "text-white" : "text-black"}`}
                    >
                      {user.name}
                    </p>
                  </div>
                  <span
                    className={`font-black italic text-lg ${user.rank === 1 ? "text-white" : "text-black/40"}`}
                  >
                    {user.score.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t-4 border-black/10 flex justify-center">
              <div className="flex items-center gap-3 font-black text-[10px] tracking-[0.2em] uppercase text-[#0075CF] hover:translate-x-2 transition-transform cursor-pointer">
                View Full Rankings <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Leaderboard;
