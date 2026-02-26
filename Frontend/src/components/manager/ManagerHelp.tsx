import { motion } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  HelpCircle,
  Shield,
  Calendar,
  BookOpen,
  UserPlus,
  MonitorPlay,
  Gavel,
  BarChart3,
  CheckCircle2,
} from "lucide-react";

export function ManagerHelp() {
  const features = [
    {
      icon: Calendar,
      title: "Exam Scheduling",
      desc: "Define the start and end times for assessments. You can control exactly when students can access their exams.",
    },
    {
      icon: BookOpen,
      title: "Question Bank",
      desc: "Central repository for all exam questions. Categorize by difficulty and topic for randomized test generation.",
    },
    {
      icon: Shield,
      title: "Access Control",
      desc: "Manage permissions for users. Grant or revoke access to specific courses or dashboard modules.",
    },
    {
      icon: MonitorPlay,
      title: "Live Monitoring",
      desc: "Real-time view of active exam sessions. Monitor student activity and detect potential integrity violations.",
    },
    {
      icon: Gavel,
      title: "Exam Rules",
      desc: "Configure strict proctoring rules, including tab-switching detection, webcam requirements, and time limits.",
    },
    {
      icon: UserPlus,
      title: "Guest Credentials",
      desc: "Generate temporary access keys for external evaluators or one-time participants without full registration.",
    },
  ];

  return (
    <div className="space-y-8 font-['Inter']">
      <div className="flex items-center gap-4">
        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded bg-[#E9E9E9] border-2 sm:border-4 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
          <HelpCircle className="h-6 w-6 sm:h-8 sm:w-8 text-[#000000]" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#000000] uppercase tracking-wider">
            Operator Assistance
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#000000]/60 uppercase tracking-widest mt-1">
            Understanding the Manager Console
          </p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            className="bg-white border-2 border-black p-6 shadow-[4px_4px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-xl"
          >
            <div className="h-10 w-10 bg-[#E9E9E9] border-2 border-black rounded-lg flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_black]">
              <feature.icon className="h-5 w-5 text-black" />
            </div>
            <h3 className="text-sm font-black uppercase tracking-wider mb-2">
              {feature.title}
            </h3>
            <p className="text-xs font-bold text-black/60 leading-relaxed uppercase tracking-widest">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </div>

      <Card className="border-4 border-black shadow-[8px_8px_0px_0px_#FD5A1A] bg-black text-white rounded-xl overflow-hidden">
        <CardHeader className="border-b-2 border-white/20">
          <CardTitle className="text-lg font-black uppercase tracking-widest flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#FD5A1A]" /> Pro Tip
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <p className="text-sm font-bold opacity-80 uppercase tracking-widest leading-relaxed">
            Use the "Live Monitoring" console during active assessment windows
            to handle real-time student inquiries and proctoring alerts. You can
            manually pause or terminate suspicious sessions directly from the
            integrity dashboard.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
