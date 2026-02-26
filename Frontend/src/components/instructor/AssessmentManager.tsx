import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ClipboardList,
  Plus,
  Search,
  FileText,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const mockAssessments = [
  {
    id: "1",
    title: "Module 01: Core Principles Quiz",
    type: "Quiz",
    questions: 15,
    duration: "20m",
    submissions: 42,
  },
  {
    id: "2",
    title: "Protocol Integrity Exam",
    type: "Final Exam",
    questions: 50,
    duration: "60m",
    submissions: 18,
  },
  {
    id: "3",
    title: "Technical Capability Probe",
    type: "Assignment",
    questions: 5,
    duration: "N/A",
    submissions: 25,
  },
];

export function AssessmentManager() {
  return (
    <div className="space-y-8 font-['Inter']">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded bg-[#E9E9E9] border-2 sm:border-4 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
            <ClipboardList className="h-6 w-6 sm:h-8 sm:w-8 text-[#000000]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#000000] uppercase tracking-wider">
              Assessment Center
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#000000]/60 uppercase tracking-widest mt-1">
              Create and manage evaluations
            </p>
          </div>
        </div>

        <Button className="bg-[#FD5A1A] text-white border-4 border-black px-8 py-6 h-auto font-black uppercase tracking-widest text-xs shadow-[6px_6px_0px_0px_black] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-none italic">
          <Plus className="h-5 w-5 mr-3" /> New Assessment
        </Button>
      </div>

      <div className="grid gap-6">
        {mockAssessments.map((test, idx) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="group relative bg-white border-4 border-black p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[10px_10px_0px_0px_#0075CF] transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 bg-[#E9E9E9] border-2 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_black] rounded-xl group-hover:bg-[#0075CF] group-hover:text-white transition-colors">
                <FileText className="h-8 w-8" />
              </div>
              <div>
                <div className="flex items-center gap-3 mb-1">
                  <h3 className="text-lg font-black text-black uppercase tracking-tight">
                    {test.title}
                  </h3>
                  <span className="px-2 py-0.5 bg-black text-white text-[9px] font-black uppercase tracking-widest border-2 border-black">
                    {test.type}
                  </span>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-bold text-black/40 uppercase tracking-widest">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" /> {test.questions}{" "}
                    Questions
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="h-3 w-3" /> {test.duration}
                  </span>
                  <span className="flex items-center gap-1 text-[#FD5A1A]">
                    {test.submissions} Submissions
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                className="border-2 border-black font-black uppercase tracking-widest text-[9px] h-10 px-6 hover:bg-black hover:text-white transition-all rounded-none"
              >
                Results
              </Button>
              <Button className="bg-black text-white border-2 border-black font-black uppercase tracking-widest text-[9px] h-10 px-6 shadow-[3px_3px_0px_0px_#FD5A1A] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-none">
                Edit
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
