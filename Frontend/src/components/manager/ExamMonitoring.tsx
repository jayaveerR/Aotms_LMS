import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useExams, useExamResults } from "@/hooks/useManagerData";
import {
  Eye,
  Users,
  Activity,
  Clock,
  CheckCircle,
  AlertTriangle,
  Monitor,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { format } from "date-fns";

export function ExamMonitoring() {
  const { data: exams = [], isLoading: examsLoading } = useExams();
  const { data: results = [], isLoading: resultsLoading } = useExamResults();

  const activeExams = exams.filter((e) => e.status === "active");
  const completedExams = exams.filter((e) => e.status === "completed");

  const inProgressResults = results.filter((r) => r.status === "in_progress");
  const completedResults = results.filter((r) => r.status === "completed");

  if (examsLoading || resultsLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading monitoring data...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Inter']">
      <div className="space-y-1">
        <h3 className="text-2xl sm:text-3xl font-black text-[#000000] uppercase tracking-wider">
          Live Exam Monitoring
        </h3>
        <p className="text-xs sm:text-sm font-bold text-[#000000]/60 uppercase tracking-widest">
          Real-time exam activity tracking
        </p>
      </div>

      {/* Stats */}
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Active Exams
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#6BCB77]">
              {activeExams.length}
            </div>
            <p className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">
              currently running
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Students Taking Exam
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#0075CF]">
              {inProgressResults.length}
            </div>
            <p className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">
              in progress
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Completed Today
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#000000]">
              {completedResults.length}
            </div>
            <p className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">
              submissions
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Avg. Score
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#000000]">
              {completedResults.length > 0
                ? Math.round(
                    completedResults.reduce(
                      (acc, r) => acc + (r.percentage || 0),
                      0,
                    ) / completedResults.length,
                  )
                : 0}
              %
            </div>
            <p className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">
              today
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Active Exams */}
      {/* Active Exams */}
      <Card className="bg-white rounded-none border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-black text-[#000000] uppercase tracking-wider">
            <Monitor className="h-6 w-6 text-[#6BCB77]" />
            Active Exams
          </CardTitle>
          <CardDescription className="font-bold text-[#000000]/60 uppercase tracking-widest text-xs">
            Currently running exams
          </CardDescription>
        </CardHeader>
        <CardContent>
          {activeExams.length === 0 ? (
            <div className="text-center py-12 text-[#000000]/50">
              <Eye className="h-12 w-12 mx-auto mb-4 opacity-50 text-[#000000]" />
              <p className="font-bold uppercase tracking-widest">
                No active exams right now
              </p>
              <p className="text-[10px] font-bold uppercase tracking-widest">
                Exams will appear here when they're started
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeExams.map((exam) => {
                const examResults = results.filter(
                  (r) => r.exam_id === exam.id,
                );
                const inProgress = examResults.filter(
                  (r) => r.status === "in_progress",
                ).length;
                const completed = examResults.filter(
                  (r) => r.status === "completed",
                ).length;

                return (
                  <div
                    key={exam.id}
                    className="p-4 rounded-none border-4 border-[#000000] bg-[#6BCB77]/20 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-black text-[#000000] uppercase tracking-wider text-sm">
                            {exam.title}
                          </h4>
                          <Badge className="bg-[#FD5A1A] text-white border-2 border-[#000000] font-black uppercase tracking-widest rounded-none text-[10px]">
                            LIVE
                          </Badge>
                        </div>
                        <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest mt-1">
                          Started at{" "}
                          {format(new Date(exam.scheduled_date), "h:mm a")} •{" "}
                          {exam.duration_minutes} min
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-center bg-white border-2 border-[#000000] px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <div className="text-lg font-black text-[#0075CF]">
                            {inProgress}
                          </div>
                          <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                            in progress
                          </p>
                        </div>
                        <div className="text-center bg-white border-2 border-[#000000] px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                          <div className="text-lg font-black text-[#6BCB77]">
                            {completed}
                          </div>
                          <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                            completed
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest">
                        <span className="text-[#000000]/60">
                          Completion Progress
                        </span>
                        <span className="text-[#000000]">
                          {inProgress + completed > 0
                            ? Math.round(
                                (completed / (inProgress + completed)) * 100,
                              )
                            : 0}
                          %
                        </span>
                      </div>
                      <Progress
                        className="h-3 border-2 border-[#000000] rounded-none bg-white [&>div]:bg-[#000000]"
                        value={
                          inProgress + completed > 0
                            ? (completed / (inProgress + completed)) * 100
                            : 0
                        }
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Recent Submissions */}
      {/* Recent Submissions */}
      <Card className="bg-white rounded-none border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl font-black text-[#000000] uppercase tracking-wider">
            <Activity className="h-6 w-6 text-[#0075CF]" />
            Recent Submissions
          </CardTitle>
        </CardHeader>
        <CardContent>
          {completedResults.length === 0 ? (
            <p className="text-center py-8 font-bold text-[#000000]/60 uppercase tracking-widest">
              No submissions yet
            </p>
          ) : (
            <div className="space-y-2">
              {completedResults.slice(0, 10).map((result) => (
                <div
                  key={result.id}
                  className="flex items-center justify-between p-3 border-2 border-[#000000] bg-white hover:bg-[#E9E9E9] transition-colors rounded-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-8 w-8 border-2 border-[#000000] flex items-center justify-center shrink-0 ${(result.percentage || 0) >= 40 ? "bg-[#6BCB77]" : "bg-[#FD5A1A]"}`}
                    >
                      {(result.percentage || 0) >= 40 ? (
                        <CheckCircle className="h-4 w-4 text-white" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-white" />
                      )}
                    </div>
                    <div>
                      <p className="font-black text-[#000000] text-sm uppercase tracking-wider">
                        Student #{result.student_id.slice(0, 8)}
                      </p>
                      <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                        Completed{" "}
                        {result.completed_at &&
                          format(new Date(result.completed_at), "h:mm a")}
                      </p>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="font-black text-[#000000]">
                      {result.score}/{result.total_marks}
                    </div>
                    <Badge
                      className={`text-[10px] font-black uppercase tracking-widest border-2 border-[#000000] rounded-none ${result.percentage && result.percentage >= 40 ? "bg-white text-[#000000]" : "bg-white text-[#FD5A1A]"}`}
                    >
                      {result.percentage || 0}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
