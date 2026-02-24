import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Trophy, Medal, Star, TrendingUp, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

/* ── Types ────────────────────────────────────────── */
interface RankEntry {
  id: string;
  user_id: string;
  full_name: string;
  avatar_url?: string;
  score: number;
  courses_completed: number;
  rank?: number;
}

/* ── Fallback Mock Data ───────────────────────────── */
const MOCK_LEADERBOARD: RankEntry[] = [
  {
    id: "1",
    user_id: "u1",
    full_name: "Alex Rodriguez",
    score: 9850,
    courses_completed: 12,
  },
  {
    id: "2",
    user_id: "u2",
    full_name: "Sarah Chen",
    score: 9200,
    courses_completed: 11,
  },
  {
    id: "3",
    user_id: "u3",
    full_name: "Marcus Johnson",
    score: 8840,
    courses_completed: 9,
  },
  {
    id: "4",
    user_id: "u4",
    full_name: "Emily Davis",
    score: 8100,
    courses_completed: 8,
  },
  {
    id: "5",
    user_id: "u5",
    full_name: "David Wilson",
    score: 7950,
    courses_completed: 8,
  },
  {
    id: "6",
    user_id: "u6",
    full_name: "Jessica Taylor",
    score: 7600,
    courses_completed: 7,
  },
  {
    id: "7",
    user_id: "u7",
    full_name: "Michael Brown",
    score: 7320,
    courses_completed: 6,
  },
  {
    id: "8",
    user_id: "u8",
    full_name: "Emma Thomas",
    score: 6900,
    courses_completed: 5,
  },
  {
    id: "9",
    user_id: "u9",
    full_name: "Daniel White",
    score: 6500,
    courses_completed: 4,
  },
  {
    id: "10",
    user_id: "u10",
    full_name: "Olivia Martin",
    score: 6100,
    courses_completed: 4,
  },
];

const API_URL = "http://localhost:5000/api";

export default function LeaderboardPage() {
  const [data, setData] = useState<RankEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem("access_token");
      try {
        setLoading(true);
        // Using generic data endpoint if leaderboard exists, sort descending by score
        const res = await fetch(
          `${API_URL}/data/leaderboard?sort=score&order=desc`,
          {
            headers: token ? { Authorization: `Bearer ${token}` } : {},
          },
        );

        if (res.ok) {
          const json = await res.json();
          if (Array.isArray(json) && json.length > 0) {
            setData(json.map((j, i) => ({ ...j, rank: i + 1 })));
          } else {
            setData(MOCK_LEADERBOARD.map((j, i) => ({ ...j, rank: i + 1 })));
          }
        } else {
          setData(MOCK_LEADERBOARD.map((j, i) => ({ ...j, rank: i + 1 })));
        }
      } catch (err) {
        setData(MOCK_LEADERBOARD.map((j, i) => ({ ...j, rank: i + 1 })));
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchLeaderboard();
    return () => {
      mounted = false;
    };
  }, []);

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();

  const filteredData = data.filter((d) =>
    d.full_name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const top3 = data.slice(0, 3);

  if (loading) {
    return (
      <div className="flex items-center justify-center p-24">
        <Loader2 className="w-12 h-12 text-[#0075CF] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#000000] flex items-center gap-3">
            <Trophy className="w-8 h-8 text-[#FD5A1A]" />
            Global Leaderboard
          </h1>
          <p className="text-[#000000]/60 font-medium mt-1">
            Compete with your peers and climb the ranks.
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#000000]/40" />
          <Input
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 bg-white border-2 border-[#000000] focus-visible:ring-0 focus-visible:ring-offset-0 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-bold placeholder:font-normal"
          />
        </div>
      </div>

      {/* TOP 3 PODIUM */}
      {!searchTerm && top3.length === 3 && (
        <div className="flex flex-col sm:flex-row items-end justify-center gap-4 sm:gap-6 lg:gap-8 pt-8 pb-4">
          {/* Rank 2 - Silver */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="order-2 sm:order-1 flex flex-col items-center w-full sm:w-[28%] max-w-[200px]"
          >
            <div className="relative mb-3 group">
              <Avatar className="w-20 h-20 border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white z-10 transition-transform group-hover:-translate-y-2">
                <AvatarImage src={top3[1].avatar_url} />
                <AvatarFallback className="font-black text-xl bg-[#E9E9E9] text-[#000000]">
                  {getInitials(top3[1].full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-3 -right-3 w-8 h-8 rounded-full bg-[#E9E9E9] border-2 border-[#000000] flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-20">
                2
              </div>
            </div>
            <div className="w-full text-center">
              <p className="font-black text-sm truncate">{top3[1].full_name}</p>
              <p className="text-xs font-bold text-[#0075CF] mb-3">
                {top3[1].score.toLocaleString()} pts
              </p>
            </div>
            <div className="w-full h-[120px] bg-[#E9E9E9] border-x-4 border-t-4 border-[#000000] rounded-t-xl flex items-start justify-center pt-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
              <Medal className="w-8 h-8 text-[#000000]/30" />
            </div>
          </motion.div>

          {/* Rank 1 - Gold */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring" }}
            className="order-1 sm:order-2 flex flex-col items-center w-full sm:w-[32%] max-w-[240px] z-10"
          >
            <div className="relative mb-4 group drop-shadow-lg">
              <div className="absolute -top-6 inset-x-0 flex justify-center">
                <Medal className="w-10 h-10 text-[#FD5A1A]" />
              </div>
              <Avatar className="w-28 h-28 border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(253,90,26,1)] bg-white z-10 transition-transform group-hover:-translate-y-2">
                <AvatarImage src={top3[0].avatar_url} />
                <AvatarFallback className="font-black text-3xl bg-[#0075CF]/10 text-[#0075CF]">
                  {getInitials(top3[0].full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-4 -right-2 w-10 h-10 rounded-full bg-[#FD5A1A] text-white border-2 border-[#000000] flex items-center justify-center font-black text-lg shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-20">
                1
              </div>
            </div>
            <div className="w-full text-center">
              <p className="font-black text-lg truncate px-2">
                {top3[0].full_name}
              </p>
              <p className="text-sm font-black text-[#FD5A1A] mb-4 flex justify-center items-center gap-1">
                <Star className="w-4 h-4 fill-current" />{" "}
                {top3[0].score.toLocaleString()} pts
              </p>
            </div>
            <div className="w-full h-[160px] bg-[#0075CF] border-x-4 border-t-4 border-[#000000] rounded-t-xl flex items-start justify-center pt-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <Trophy className="w-10 h-10 text-white" />
            </div>
          </motion.div>

          {/* Rank 3 - Bronze */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, type: "spring" }}
            className="order-3 flex flex-col items-center w-full sm:w-[28%] max-w-[200px]"
          >
            <div className="relative mb-3 group">
              <Avatar className="w-16 h-16 border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white z-10 transition-transform group-hover:-translate-y-2">
                <AvatarImage src={top3[2].avatar_url} />
                <AvatarFallback className="font-black text-lg bg-[#E9E9E9] text-[#000000]">
                  {getInitials(top3[2].full_name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-2 -right-2 w-7 h-7 rounded-full bg-[#E9E9E9] border-2 border-[#000000] flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] z-20">
                3
              </div>
            </div>
            <div className="w-full text-center">
              <p className="font-black text-sm truncate">{top3[2].full_name}</p>
              <p className="text-xs font-bold text-[#0075CF] mb-3">
                {top3[2].score.toLocaleString()} pts
              </p>
            </div>
            <div className="w-full h-[90px] bg-[#E9E9E9] border-x-4 border-t-4 border-[#000000] rounded-t-xl flex items-start justify-center pt-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]">
              <TrendingUp className="w-6 h-6 text-[#000000]/30" />
            </div>
          </motion.div>
        </div>
      )}

      {/* LIST BELOW PODIUM */}
      <div className="bg-white border-4 border-[#000000] rounded-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
        {/* Headings */}
        <div className="hidden sm:grid grid-cols-12 gap-4 px-6 py-4 bg-[#E9E9E9] border-b-4 border-[#000000] font-black uppercase text-xs tracking-widest text-[#000000]/70">
          <div className="col-span-2 text-center">Rank</div>
          <div className="col-span-6">Student</div>
          <div className="col-span-2 text-center">Courses</div>
          <div className="col-span-2 text-right">Score</div>
        </div>

        {/* Rows */}
        <div className="divide-y-2 divide-[#000000]/10">
          {filteredData.length === 0 ? (
            <div className="p-8 text-center font-bold text-[#000000]/50">
              No students found matching your search.
            </div>
          ) : (
            filteredData.map((entry, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                key={entry.id}
                className="flex flex-col sm:grid sm:grid-cols-12 gap-4 items-center px-4 sm:px-6 py-4 hover:bg-[#E9E9E9]/50 transition-colors"
              >
                {/* Rank */}
                <div className="col-span-2 w-full sm:w-auto flex items-center justify-between sm:justify-center">
                  <span className="sm:hidden font-black uppercase text-xs text-[#000000]/50">
                    Rank
                  </span>
                  <span
                    className={`w-8 h-8 rounded-full border-2 border-[#000000] flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${entry.rank === 1 ? "bg-[#FD5A1A] text-white" : entry.rank === 2 ? "bg-[#E9E9E9]" : entry.rank === 3 ? "bg-[#E9E9E9]" : "bg-white"}`}
                  >
                    {entry.rank}
                  </span>
                </div>

                {/* Student */}
                <div className="col-span-6 w-full flex items-center gap-4">
                  <Avatar className="w-10 h-10 border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white">
                    <AvatarImage src={entry.avatar_url} />
                    <AvatarFallback className="font-bold text-sm bg-primary/10 text-primary">
                      {getInitials(entry.full_name)}
                    </AvatarFallback>
                  </Avatar>
                  <p className="font-black text-[#000000] truncate">
                    {entry.full_name}
                  </p>
                </div>

                {/* Courses */}
                <div className="col-span-2 w-full sm:w-auto flex items-center justify-between sm:justify-center">
                  <span className="sm:hidden font-black uppercase text-xs text-[#000000]/50">
                    Courses
                  </span>
                  <span className="font-bold bg-[#E9E9E9] px-2 py-0.5 rounded border border-[#000000]">
                    {entry.courses_completed}
                  </span>
                </div>

                {/* Score */}
                <div className="col-span-2 w-full sm:w-auto flex items-center justify-between sm:justify-end text-right">
                  <span className="sm:hidden font-black uppercase text-xs text-[#000000]/50">
                    Score
                  </span>
                  <span className="font-black text-[#0075CF]">
                    {entry.score.toLocaleString()} pts
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
