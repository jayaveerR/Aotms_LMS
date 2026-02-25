import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  useLeaderboard,
  useVerifyLeaderboardEntry,
} from "@/hooks/useManagerData";
import { useAuth } from "@/hooks/useAuth";
import {
  Trophy,
  Medal,
  CheckCircle,
  BookOpen,
  XCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Shield,
} from "lucide-react";

export function LeaderboardManager() {
  const { user } = useAuth();
  const { data: leaderboard = [], isLoading } = useLeaderboard();
  const verifyEntry = useVerifyLeaderboardEntry();

  const handleVerify = async (id: string) => {
    if (!user?.id) return;
    await verifyEntry.mutateAsync({ id, verified_by: user.id });
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-400" />;
    if (rank === 3) return <Medal className="h-5 w-5 text-amber-600" />;
    return <span className="font-bold text-muted-foreground">#{rank}</span>;
  };

  const verifiedCount = leaderboard.filter((e) => e.is_verified).length;
  const unverifiedCount = leaderboard.filter((e) => !e.is_verified).length;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading leaderboard...
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500 font-['Inter']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-[#000000] uppercase tracking-wider">
            Leaderboard Manager
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#000000]/60 uppercase tracking-widest">
            Verify and manage student rankings
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge className="bg-[#6BCB77] text-[#000000] border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none px-3 py-1 text-[10px] font-black uppercase tracking-widest gap-2">
            <CheckCircle className="h-3.5 w-3.5" />
            {verifiedCount} Verified
          </Badge>
          <Badge className="bg-[#FFD166] text-[#000000] border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none px-3 py-1 text-[10px] font-black uppercase tracking-widest gap-2">
            <Shield className="h-3.5 w-3.5" />
            {unverifiedCount} Pending
          </Badge>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          {
            label: "Total Students",
            value: leaderboard.length,
            footer: "on the leaderboard",
            bg: "bg-[#0075CF]",
          },
          {
            label: "Highest Score",
            value:
              leaderboard.length > 0 ? leaderboard[0]?.total_score || 0 : 0,
            footer: "points",
            bg: "#FD5A1A",
          },
          {
            label: "Avg. Completion",
            value: `${leaderboard.length > 0 ? Math.round(leaderboard.reduce((acc, e) => acc + (e.average_percentage || 0), 0) / leaderboard.length) : 0}%`,
            footer: "average score",
            bg: "#6BCB77",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-white rounded-none border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all"
          >
            <CardContent className="p-6 space-y-2">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#000000]/60">
                {stat.label}
              </p>
              <h3 className="text-3xl font-black text-[#000000]">
                {stat.value}
              </h3>
              <p className="text-[10px] font-bold text-[#000000]/40 uppercase tracking-widest">
                {stat.footer}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="bg-white rounded-none border-4 border-[#000000] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
        <CardHeader className="bg-[#FFD166] border-b-4 border-[#000000] p-6">
          <CardTitle className="flex items-center gap-3 text-xl font-black uppercase tracking-wider text-[#000000]">
            <Trophy className="h-6 w-6" />
            Student Rankings
          </CardTitle>
          <CardDescription className="text-[10px] font-bold uppercase tracking-widest text-[#000000]/60">
            Click to verify student scores and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          {leaderboard.length === 0 ? (
            <div className="text-center py-24 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
              <Trophy className="h-16 w-16 mx-auto mb-4 text-[#000000]/20" />
              <p className="font-black uppercase tracking-wider text-[#000000]">
                No leaderboard entries yet
              </p>
              <p className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">
                Students will appear here after completing exams
              </p>
            </div>
          ) : (
            <div className="divide-y-4 divide-[#000000]">
              {leaderboard.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={cn(
                    "flex items-center gap-6 p-6 transition-all hover:bg-[#E9E9E9] group",
                    idx === 0
                      ? "bg-[#FFD166]/20"
                      : idx === 1
                        ? "bg-[#E9E9E9]/50"
                        : idx === 2
                          ? "bg-[#FD5A1A]/5"
                          : "",
                  )}
                >
                  <div className="w-12 h-12 flex-shrink-0 flex items-center justify-center bg-white border-4 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] text-[#000000] font-black text-xl">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                      <h4 className="text-xl font-black uppercase tracking-tight truncate">
                        {entry.student_name}
                      </h4>
                      {entry.is_verified && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#6BCB77] text-[#000000] border-2 border-[#000000] text-[9px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <CheckCircle className="h-3 w-3" />
                          VERIFIED
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-5 text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="h-3.5 w-3.5" />{" "}
                        {entry.exams_completed || 0} exams
                      </span>
                      <span className="flex items-center gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5" />{" "}
                        {entry.average_percentage || 0}% avg
                      </span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-3xl font-black text-[#000000] leading-none mb-1">
                      {entry.total_score || 0}
                    </div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-[#000000]/40">
                      points
                    </p>
                  </div>
                  {!entry.is_verified && (
                    <Button
                      className="ml-4 h-11 px-5 bg-white text-[#000000] border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[2px] hover:translate-y-[2px] hover:bg-[#6BCB77] transition-all font-black uppercase tracking-widest text-[10px] gap-2 rounded-none"
                      onClick={() => handleVerify(entry.id)}
                      disabled={verifyEntry.isPending}
                    >
                      <Shield className="h-4 w-4" />
                      Verify
                    </Button>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
