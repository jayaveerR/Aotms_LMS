import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DashboardContent } from "@/components/dashboard/DashboardContent";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { getAllAttendance } from "@/lib/attendanceService";
import AmbientBackground from "@/components/ui/AmbientBackground";

export default function Dashboard() {
  const { user, userRole, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        navigate("/auth");
      } else if (userRole && userRole !== "student") {
        const targetPath = userRole === "admin" ? "/admin" : `/${userRole}`;
        navigate(targetPath);
      } else if (user) {
        // Evaluate Absence Warnings
        const records = getAllAttendance().filter(
          (r) => r.userId === user.id && r.status === "absent",
        );
        if (records.length >= 5) {
          // This would ideally block them entirely, but logDailyAttendance in Auth should have caught it.
        } else if (records.length > 0) {
          const title = records.length > 1 ? "STRICT WARNING" : "WARNING";
          const desc =
            records.length > 1
              ? `You have missed ${records.length} days of class/assessments. Continued absence may lead to suspension.`
              : "You missed a class or assessment recently. Please maintain your attendance.";

          toast({
            title: title + ": Attendance Issue",
            description: desc,
            variant: "destructive",
          });
        }
      }
    }
  }, [user, userRole, loading, navigate, toast]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset className="bg-[#E9E9E9] font-['Inter']">
        <AmbientBackground />
        <DashboardHeader />

        <main className="flex-1 p-3 sm:p-4 lg:p-6">
          <DashboardContent />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
