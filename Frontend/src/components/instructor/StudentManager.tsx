import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Users, Search, Mail, Phone, Calendar, Clock } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const mockStudents = [
  {
    id: "1",
    name: "Rahul Kumar",
    email: "rahul@example.com",
    joined: "2024-01-15",
    status: "active",
    progress: 85,
  },
  {
    id: "2",
    name: "Priya Sharma",
    email: "priya@example.com",
    joined: "2024-02-10",
    status: "active",
    progress: 42,
  },
  {
    id: "3",
    name: "Amit Patel",
    email: "amit@example.com",
    joined: "2024-03-05",
    status: "inactive",
    progress: 12,
  },
  {
    id: "4",
    name: "Sneha Reddy",
    email: "sneha@example.com",
    joined: "2024-03-12",
    status: "active",
    progress: 67,
  },
];

export function StudentManager() {
  return (
    <div className="space-y-8 font-['Inter']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded bg-[#E9E9E9] border-2 sm:border-4 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
            <Users className="h-6 w-6 sm:h-8 sm:w-8 text-[#000000]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#000000] uppercase tracking-wider">
              Student Directory
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#000000]/60 uppercase tracking-widest mt-1">
              Manage and track your learners
            </p>
          </div>
        </div>

        <div className="relative w-full sm:w-80 group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-black/40 group-focus-within:text-black transition-colors" />
          <input
            type="text"
            placeholder="SEARCH ENROLLMENTS..."
            className="w-full bg-white border-4 border-black px-10 py-3 text-xs font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_black] focus:outline-none focus:shadow-none focus:translate-x-1 focus:translate-y-1 transition-all"
          />
        </div>
      </div>

      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden">
        <div className="divide-y-4 divide-black">
          {mockStudents.map((student, idx) => (
            <motion.div
              key={student.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-6 bg-white hover:bg-[#E9E9E9] transition-colors flex flex-col md:flex-row md:items-center justify-between gap-6"
            >
              <div className="flex items-center gap-4">
                <Avatar className="h-14 w-14 border-4 border-black shadow-[4px_4px_0px_0px_#FD5A1A]">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${student.name}`}
                  />
                  <AvatarFallback className="bg-black text-white font-black">
                    {student.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-black text-black uppercase tracking-wider">
                    {student.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-4 mt-1">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-black/50 uppercase">
                      <Mail className="h-3 w-3" /> {student.email}
                    </span>
                    <span className="flex items-center gap-1.5 text-[10px] font-bold text-black/50 uppercase">
                      <Calendar className="h-3 w-3" /> Joined {student.joined}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-6">
                <div className="min-w-[120px]">
                  <div className="flex justify-between text-[10px] font-black uppercase mb-1">
                    <span>Progress</span>
                    <span>{student.progress}%</span>
                  </div>
                  <div className="h-2 border-2 border-black bg-[#E9E9E9] rounded-full overflow-hidden">
                    <div
                      className="h-full bg-[#0075CF]"
                      style={{ width: `${student.progress}%` }}
                    />
                  </div>
                </div>
                <Badge
                  className={`border-2 border-black rounded-none px-3 py-1 text-[9px] font-black uppercase tracking-widest shadow-[2px_2px_0px_0px_black] ${student.status === "active" ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
                >
                  {student.status}
                </Badge>
              </div>
            </motion.div>
          ))}
        </div>
      </Card>
    </div>
  );
}
