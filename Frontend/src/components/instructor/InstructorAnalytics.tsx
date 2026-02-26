import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  BarChart3,
  TrendingUp,
  Users,
  BookOpen,
  Clock,
  Target,
} from "lucide-react";

export function InstructorAnalytics() {
  const stats = [
    {
      label: "Course Engagement",
      value: "84%",
      icon: TrendingUp,
      color: "text-[#0075CF]",
    },
    {
      label: "Active Students",
      value: "156",
      icon: Users,
      color: "text-[#FD5A1A]",
    },
    {
      label: "Content Reach",
      value: "2.4k",
      icon: BookOpen,
      color: "text-black",
    },
    {
      label: "Avg. Watch Time",
      value: "45m",
      icon: Clock,
      color: "text-[#0075CF]",
    },
  ];

  return (
    <div className="space-y-8 font-['Inter']">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded bg-[#E9E9E9] border-2 sm:border-4 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
          <BarChart3 className="h-6 w-6 sm:h-8 sm:w-8 text-[#000000]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#000000] uppercase tracking-wider">
            Performance Analytics
          </h1>
          <p className="text-xs sm:text-sm font-bold text-[#000000]/60 uppercase tracking-widest mt-1">
            Deep dive into your teaching metrics
          </p>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-black/40">
                Real-time
              </span>
            </div>
            <p className="text-3xl font-black text-black mb-1">{stat.value}</p>
            <p className="text-[10px] font-black uppercase tracking-widest text-black/60">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden">
          <CardHeader className="bg-[#E9E9E9] border-b-4 border-black">
            <CardTitle className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
              <Target className="h-5 w-5" /> Student Progress Flow
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              {[
                {
                  label: "Introduction to Protocol",
                  progress: 95,
                  color: "bg-[#0075CF]",
                },
                {
                  label: "Data Architecture Basics",
                  progress: 72,
                  color: "bg-[#FD5A1A]",
                },
                {
                  label: "Advanced Implementation",
                  progress: 45,
                  color: "bg-black",
                },
              ].map((item, idx) => (
                <div key={idx} className="space-y-2">
                  <div className="flex justify-between text-xs font-black uppercase tracking-widest">
                    <span>{item.label}</span>
                    <span>{item.progress}%</span>
                  </div>
                  <div className="h-4 border-2 border-black bg-[#E9E9E9] rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${item.progress}%` }}
                      className={`h-full ${item.color}`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden">
          <CardHeader className="bg-[#E9E9E9] border-b-4 border-black">
            <CardTitle className="text-lg font-black uppercase tracking-wider flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Growth Trajectory
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8 flex items-center justify-center min-h-[300px] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-white">
            <div className="text-center">
              <BarChart3 className="h-16 w-16 text-black/10 mx-auto mb-4" />
              <p className="text-sm font-bold text-black/40 uppercase tracking-widest">
                Aggregating engagement data...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
