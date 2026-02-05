 import { motion } from "framer-motion";
 import { Trophy, Medal, Award } from "lucide-react";
 
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
     <section className="section-padding bg-background-alt">
       <div className="container-width">
         <div className="grid lg:grid-cols-2 gap-12 items-center">
           <motion.div
             initial={{ opacity: 0, x: -20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5 }}
           >
             <h2 className="font-heading text-3xl md:text-4xl lg:text-5xl text-foreground mb-4">
               COMPETE, IMPROVE & LEAD
             </h2>
             <p className="text-muted-foreground mb-6">
               Track your progress, compare with peers, and climb the
               leaderboard. Our ranking system motivates you to perform better
               and achieve your learning goals.
             </p>
             <div className="flex gap-8">
               <div>
                 <p className="text-3xl font-heading text-primary">500+</p>
                 <p className="text-sm text-muted-foreground">Weekly Competitors</p>
               </div>
               <div>
                 <p className="text-3xl font-heading text-accent">25+</p>
                 <p className="text-sm text-muted-foreground">Active Leaderboards</p>
               </div>
             </div>
           </motion.div>
 
           <motion.div
             initial={{ opacity: 0, x: 20 }}
             whileInView={{ opacity: 1, x: 0 }}
             viewport={{ once: true }}
             transition={{ duration: 0.5 }}
             className="bg-card rounded-2xl border border-border shadow-medium p-6"
           >
             <div className="flex items-center justify-between mb-6">
               <h3 className="font-semibold text-foreground">Top Performers</h3>
               <span className="text-sm text-muted-foreground">This Week</span>
             </div>
 
             <div className="space-y-3">
               {leaderboardData.map((user, index) => (
                 <div
                   key={user.rank}
                   className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
                     user.rank === 1
                       ? "bg-accent/10 border border-accent/20"
                       : "hover:bg-muted"
                   }`}
                 >
                   <span
                     className={`w-8 text-center font-semibold ${
                       user.rank <= 3 ? "text-primary" : "text-muted-foreground"
                     }`}
                   >
                     {getRankIcon(user.rank) || `#${user.rank}`}
                   </span>
                   <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-medium text-primary">
                     {user.avatar}
                   </div>
                   <div className="flex-1">
                     <p className="font-medium text-foreground">{user.name}</p>
                   </div>
                   <span className="font-semibold text-foreground">
                     {user.score.toLocaleString()}
                   </span>
                 </div>
               ))}
             </div>
           </motion.div>
         </div>
       </div>
     </section>
   );
 };
 
 export default Leaderboard;