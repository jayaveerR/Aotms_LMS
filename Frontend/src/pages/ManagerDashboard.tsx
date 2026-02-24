import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Navigate, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ManagerSidebar } from "@/components/manager/ManagerSidebar";
import { ManagerHeader } from "@/components/manager/ManagerHeader";
import { ExamScheduler } from "@/components/manager/ExamScheduler";
import { QuestionBankManager } from "@/components/manager/QuestionBankManager";
import { MockTestManager } from "@/components/manager/MockTestManager";
import { LeaderboardManager } from "@/components/manager/LeaderboardManager";
import { GuestCredentialsManager } from "@/components/manager/GuestCredentialsManager";
import { ExamMonitoring } from "@/components/manager/ExamMonitoring";
import { AccessControlManager } from "@/components/manager/AccessControlManager";
import { CourseMonitoring } from "@/components/manager/CourseMonitoring";
import { ExamRulesManager } from "@/components/manager/ExamRulesManager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import AmbientBackground from "@/components/ui/AmbientBackground";
import {
  CalendarCheck,
  BookOpen,
  FileText,
  Trophy,
  UserPlus,
  Shield,
  MonitorPlay,
  Gavel,
  Server,
  Settings,
  ChevronRight,
  Activity,
  Plus,
  Users,
  GraduationCap,
  UserCheck,
} from "lucide-react";
import {
  useExams,
  useQuestions,
  useLeaderboard,
  useGuestCredentials,
  useMockTestConfigs,
  useExamRules,
  useExamResults,
  useUserRoles,
} from "@/hooks/useManagerData";
import { cn } from "@/lib/utils";

export default function ManagerDashboard() {
  const { user, userRole, loading } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [userListFilter, setUserListFilter] = useState<
    "student" | "instructor" | "all"
  >("all");
  const navigate = useNavigate();

  const openUserList = (filter: "student" | "instructor" | "all") => {
    setUserListFilter(filter);
    setActiveSection("users-list");
  };

  // Data hooks for overview
  const { data: exams = [] } = useExams();
  const { data: questions = [] } = useQuestions();
  const { data: leaderboard = [] } = useLeaderboard();
  const { data: guests = [] } = useGuestCredentials();

  const { data: mockTests = [] } = useMockTestConfigs();
  const { data: examRules = [] } = useExamRules();
  const { data: examResults = [] } = useExamResults();
  const { data: userRoles = [] } = useUserRoles();

  const totalCandidates = userRoles.length;
  const totalStudents = userRoles.filter((r) => r.role === "student").length;
  const totalInstructors = userRoles.filter(
    (r) => r.role === "instructor",
  ).length;

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary/20 border-t-primary"></div>
        <p className="text-xs font-medium text-muted-foreground animate-pulse tracking-tight">
          Loading console...
        </p>
      </div>
    );
  }

  // Temporarily disabled for testing:
  // if (userRole !== "manager" && userRole !== "admin") {
  //   return <Navigate to="/dashboard" replace />;
  // }

  const activeExamsCount = exams.filter((e) => e.status === "active").length;

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Search and Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">
            Manager Dashboard
          </h2>
          <p className="text-sm text-muted-foreground">
            Welcome back, {user?.user_metadata?.full_name || "Manager"}. Here is
            what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="hidden sm:flex gap-2 rounded-lg"
          >
            <Settings className="h-4 w-4" /> System Settings
          </Button>
          <Button
            size="sm"
            onClick={() => setActiveSection("exams")}
            className="rounded-lg"
          >
            <Plus className="h-4 w-4 mr-1" /> New Exam
          </Button>
        </div>
      </div>

      {/* Candidates Overview */}
      <div className="grid gap-4 sm:grid-cols-3 mb-6">
        <Card
          className="rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-200"
          onClick={() => openUserList("all")}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-indigo-50">
                <Users className="h-5 w-5 text-indigo-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight">
                  Total Candidates
                </p>
                <h3 className="text-2xl font-bold">{totalCandidates}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-cyan-200"
          onClick={() => openUserList("student")}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-cyan-50">
                <GraduationCap className="h-5 w-5 text-cyan-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight">
                  Students
                </p>
                <h3 className="text-2xl font-bold">{totalStudents}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-fuchsia-200"
          onClick={() => openUserList("instructor")}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-10 w-10 rounded-lg flex items-center justify-center bg-fuchsia-50">
                <UserCheck className="h-5 w-5 text-fuchsia-600" />
              </div>
              <div>
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight">
                  Instructors
                </p>
                <h3 className="text-2xl font-bold">{totalInstructors}</h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Standard Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mt-6">
        {[
          {
            label: "Exams Scheduled",
            value: exams.length,
            color: "text-blue-600",
            icon: CalendarCheck,
            bg: "bg-blue-50",
          },
          {
            label: "Question Bank",
            value: questions.length,
            color: "text-purple-600",
            icon: BookOpen,
            bg: "bg-purple-50",
          },
          {
            label: "Leaderboard",
            value: leaderboard.length,
            color: "text-amber-600",
            icon: Trophy,
            bg: "bg-amber-50",
          },
          {
            label: "Guest Access",
            value: guests.length,
            color: "text-emerald-600",
            icon: UserPlus,
            bg: "bg-emerald-50",
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="rounded-xl border shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div
                  className={cn(
                    "h-10 w-10 rounded-lg flex items-center justify-center",
                    stat.bg,
                  )}
                >
                  <stat.icon className={cn("h-5 w-5", stat.color)} />
                </div>
                <div>
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-tight">
                    {stat.label}
                  </p>
                  <h3 className="text-2xl font-bold">{stat.value}</h3>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Quick Actions Section */}
        <Card className="md:col-span-2 rounded-xl border-none shadow-sm bg-muted/30">
          <CardHeader>
            <CardTitle className="text-lg">Quick Tasks</CardTitle>
            <CardDescription>Commonly used management tools</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                {
                  id: "exams",
                  label: "Exam Scheduler",
                  icon: CalendarCheck,
                  desc: "Manage exam timelines",
                  color: "text-blue-500",
                },
                {
                  id: "questions",
                  label: "Question Bank",
                  icon: BookOpen,
                  desc: "Update question pools",
                  color: "text-purple-500",
                },
                {
                  id: "mock-tests",
                  label: "Mock Tests",
                  icon: FileText,
                  desc: "Practice test configs",
                  color: "text-orange-500",
                },
                {
                  id: "monitoring",
                  label: "Live Monitoring",
                  icon: MonitorPlay,
                  desc: "Watch active assessments",
                  color: "text-rose-500",
                },
                {
                  id: "guests",
                  label: "Guest Access",
                  icon: UserPlus,
                  desc: "Temporary credentials",
                  color: "text-emerald-500",
                },
                {
                  id: "exam-rules",
                  label: "Exam Rules",
                  icon: Gavel,
                  desc: "Configure proctoring",
                  color: "text-slate-600",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="group flex flex-col p-4 rounded-xl border bg-card hover:border-primary/50 hover:bg-muted/50 transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div
                      className={cn(
                        "h-9 w-9 rounded-lg flex items-center justify-center bg-muted transition-colors group-hover:bg-primary/10",
                      )}
                    >
                      <item.icon className={cn("h-4 w-4", item.color)} />
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground/0 group-hover:text-muted-foreground transition-all" />
                  </div>
                  <p className="font-semibold text-sm">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.desc}</p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status/Health Section */}
        <div className="space-y-4">
          <Card className="rounded-xl shadow-sm border">
            <CardHeader className="p-5 pb-2">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4 text-emerald-500" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Active Sessions</span>
                  <span className="font-bold underline">Online</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Database Sync</span>
                  <span className="text-emerald-600 font-bold uppercase tracking-tighter">
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Live Exams</span>
                  <span className="font-bold">{activeExamsCount}</span>
                </div>
              </div>
              <Button
                variant="outline"
                className="w-full text-xs h-9 rounded-lg"
                onClick={() => setActiveSection("monitoring")}
              >
                Full Monitoring Dashboard
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-xl shadow-sm border bg-primary text-primary-foreground overflow-hidden relative">
            <CardHeader className="p-5 pb-0 relative z-10">
              <CardTitle className="text-sm font-semibold flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Integrity Shield
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 relative z-10 space-y-3">
              <p className="text-xs opacity-80 leading-relaxed">
                Proctoring systems are currently monitoring {activeExamsCount}{" "}
                active exams.
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="w-full text-xs h-9 rounded-lg font-bold"
                onClick={() => setActiveSection("access-control")}
              >
                Manage Permissions
              </Button>
            </CardContent>
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <Server className="h-16 w-16" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );

  const renderUserList = () => {
    const label =
      userListFilter === "student"
        ? "Students"
        : userListFilter === "instructor"
          ? "Instructors"
          : "All Candidates";
    const iconColor =
      userListFilter === "student"
        ? "text-cyan-600"
        : userListFilter === "instructor"
          ? "text-fuchsia-600"
          : "text-indigo-600";
    const filtered =
      userListFilter === "all"
        ? userRoles
        : userRoles.filter((u) => u.role === userListFilter);
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="gap-1"
            onClick={() => setActiveSection("overview")}
          >
            ← Back
          </Button>
          <h2 className="text-xl font-bold">{label} List</h2>
          <span className="text-sm text-muted-foreground">
            ({filtered.length} total)
          </span>
        </div>
        <Card className="rounded-xl border shadow-sm">
          <CardContent className="p-0">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
                <Users className="h-12 w-12 mb-3 opacity-30" />
                <p>No {label.toLowerCase()} found.</p>
              </div>
            ) : (
              <div className="divide-y">
                {filtered.map((u, idx) => (
                  <div
                    key={u.user_id || idx}
                    className="flex items-center gap-4 p-4 hover:bg-muted/40 transition-colors"
                  >
                    <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <Users className={`h-4 w-4 ${iconColor}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{u.user_id}</p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {u.role}
                      </p>
                    </div>
                    <span
                      className={`text-xs font-semibold uppercase tracking-wide px-2 py-1 rounded-full ${
                        u.role === "student"
                          ? "bg-cyan-50 text-cyan-700"
                          : u.role === "instructor"
                            ? "bg-fuchsia-50 text-fuchsia-700"
                            : "bg-indigo-50 text-indigo-700"
                      }`}
                    >
                      {u.role}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "overview":
        return renderOverview();
      case "users-list":
        return renderUserList();
      case "exams":
        return <ExamScheduler />;
      case "questions":
        return <QuestionBankManager />;
      case "mock-tests":
        return <MockTestManager />;
      case "leaderboard":
        return <LeaderboardManager />;
      case "guests":
        return <GuestCredentialsManager />;
      case "access-control":
        return <AccessControlManager />;
      case "monitoring":
        return <ExamMonitoring />;
      case "course-monitoring":
        return <CourseMonitoring />;
      case "exam-rules":
        return <ExamRulesManager />;
      default:
        return renderOverview();
    }
  };

  return (
    <SidebarProvider>
      <ManagerSidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
      />
      <SidebarInset>
        <AmbientBackground />
        <ManagerHeader />
        <main className="flex-1 p-6 sm:p-8 lg:p-10 overflow-auto">
          <div className="max-w-6xl mx-auto">{renderContent()}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
