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
import { ManagerAttendance } from "@/components/manager/ManagerAttendance";
import { ManagerHelp } from "@/components/manager/ManagerHelp";
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
  ArrowLeft,
  Search,
  Clock,
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
  useProfiles,
} from "@/hooks/useManagerData";
import { cn } from "@/lib/utils";

export default function ManagerDashboard() {
  const { user, userRole, loading } = useAuth();
  const [activeSection, setActiveSection] = useState("overview");
  const [userListFilter, setUserListFilter] = useState<
    "student" | "instructor" | "all"
  >("all");
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const navigate = useNavigate();

  const openUserList = (filter: "student" | "instructor" | "all") => {
    setUserListFilter(filter);
    setUserSearchQuery("");
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
  const { data: profiles = [] } = useProfiles();

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
    <div className="space-y-6 sm:space-y-8 animate-in fade-in duration-500 font-['Inter'] pb-12">
      {/* Search and Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-[#000000] uppercase">
            Manager Console
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#000000]/60">
            Welcome back, {user?.user_metadata?.full_name || "Manager"}. Here is
            what's happening today.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button className="hidden sm:flex bg-white text-[#000000] border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-[#E9E9E9] hover:-translate-y-[-2px] hover:-translate-x-[-2px] transition-all font-black uppercase tracking-widest text-xs">
            <Settings className="h-4 w-4 mr-2" /> System Settings
          </Button>
          <Button
            onClick={() => setActiveSection("exams")}
            className="bg-[#FD5A1A] text-white border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FD5A1A]/90 hover:-translate-y-[-2px] hover:-translate-x-[-2px] transition-all font-black uppercase tracking-widest text-xs"
          >
            <Plus className="h-4 w-4 mr-2" /> New Exam
          </Button>
        </div>
      </div>

      {/* Candidates Overview */}
      <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-3 mb-6">
        <Card
          className="bg-white rounded-xl border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all cursor-pointer group"
          onClick={() => openUserList("all")}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-[#000000] border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#000000]/50 mb-1">
                  Total Candidates
                </p>
                <h3 className="text-3xl font-black group-hover:text-[#0075CF] transition-colors">
                  {totalCandidates}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="bg-white rounded-xl border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all cursor-pointer group"
          onClick={() => openUserList("student")}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-[#0075CF] border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <GraduationCap className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#000000]/50 mb-1">
                  Students
                </p>
                <h3 className="text-3xl font-black group-hover:text-[#0075CF] transition-colors">
                  {totalStudents}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card
          className="bg-white rounded-xl border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all cursor-pointer group"
          onClick={() => openUserList("instructor")}
        >
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-lg flex items-center justify-center bg-[#FD5A1A] border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                <UserCheck className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-widest text-[#000000]/50 mb-1">
                  Instructors
                </p>
                <h3 className="text-3xl font-black group-hover:text-[#FD5A1A] transition-colors">
                  {totalInstructors}
                </h3>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Standard Stats Grid */}
      <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4 mt-6">
        {[
          {
            label: "Exams Scheduled",
            value: exams.length,
            icon: CalendarCheck,
          },
          {
            label: "Question Bank",
            value: questions.length,
            icon: BookOpen,
          },
          {
            label: "Leaderboard",
            value: leaderboard.length,
            icon: Trophy,
          },
          {
            label: "Guest Access",
            value: guests.length,
            icon: UserPlus,
          },
        ].map((stat, i) => (
          <Card
            key={i}
            className="bg-white rounded-xl border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default"
          >
            <CardContent className="p-5 flex items-center justify-between">
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-[#000000]/50 mb-1">
                  {stat.label}
                </p>
                <h3 className="text-2xl font-black text-[#000000]">
                  {stat.value}
                </h3>
              </div>
              <div className="h-10 w-10 bg-[#E9E9E9] border-2 border-[#000000] rounded flex items-center justify-center">
                <stat.icon className="h-5 w-5 text-[#000000]" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* Main Quick Actions Section */}
        <Card className="md:col-span-2 bg-white rounded-xl border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="border-b-4 border-[#000000] bg-[#E9E9E9] rounded-t-lg">
            <CardTitle className="text-xl font-black uppercase tracking-widest text-[#000000]">
              Quick Tasks
            </CardTitle>
            <CardDescription className="text-[#000000]/60 font-bold">
              Commonly used management tools
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-white">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  id: "exams",
                  label: "Exam Scheduler",
                  icon: CalendarCheck,
                  desc: "Manage exam timelines",
                  bg: "bg-[#0075CF]",
                },
                {
                  id: "questions",
                  label: "Question Bank",
                  icon: BookOpen,
                  desc: "Update question pools",
                  bg: "bg-[#FD5A1A]",
                },
                {
                  id: "mock-tests",
                  label: "Mock Tests",
                  icon: FileText,
                  desc: "Practice test configs",
                  bg: "bg-[#000000]",
                },
                {
                  id: "monitoring",
                  label: "Live Monitoring",
                  icon: MonitorPlay,
                  desc: "Watch active assessments",
                  bg: "bg-white",
                },
                {
                  id: "guests",
                  label: "Guest Access",
                  icon: UserPlus,
                  desc: "Temporary credentials",
                  bg: "bg-[#0075CF]",
                },
                {
                  id: "exam-rules",
                  label: "Exam Rules",
                  icon: Gavel,
                  desc: "Configure proctoring",
                  bg: "bg-[#000000]",
                },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className="group flex flex-col p-4 rounded-xl border-2 border-[#000000] bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[4px] hover:translate-y-[4px] transition-all text-left"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${item.bg}`}
                    >
                      <item.icon
                        className={`h-5 w-5 ${item.bg === "bg-white" ? "text-[#000000]" : "text-white"}`}
                      />
                    </div>
                    <ChevronRight className="h-5 w-5 text-[#000000]/20 group-hover:text-[#000000] transition-colors" />
                  </div>
                  <p className="font-black text-[#000000] uppercase tracking-wider">
                    {item.label}
                  </p>
                  <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest mt-1">
                    {item.desc}
                  </p>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Status/Health Section */}
        <div className="space-y-6">
          <Card className="bg-white rounded-xl border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="p-5 pb-3 border-b-2 border-[#000000] bg-[#E9E9E9] rounded-t-lg">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2 text-[#000000]">
                <Shield className="h-4 w-4 text-[#000000]" />
                System Status
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 pt-4 space-y-4">
              <div className="space-y-4 font-bold">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#000000]/60">Active Sessions</span>
                  <span className="font-black text-[#0075CF] uppercase tracking-wider">
                    Online
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#000000]/60">Database Sync</span>
                  <span className="text-[#000000] font-black uppercase tracking-wider">
                    Verified
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-[#000000]/60">Live Exams</span>
                  <span className="font-black text-xl">{activeExamsCount}</span>
                </div>
              </div>
              <Button
                className="w-full text-xs h-10 rounded-none bg-white text-[#000000] border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] transition-all font-black uppercase tracking-widest mt-2"
                onClick={() => setActiveSection("monitoring")}
              >
                Monitoring Console
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-[#FD5A1A] rounded-xl border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white overflow-hidden relative group">
            <CardHeader className="p-5 pb-2 relative z-10">
              <CardTitle className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Integrity Shield
              </CardTitle>
            </CardHeader>
            <CardContent className="p-5 relative z-10 space-y-4">
              <p className="text-sm font-bold opacity-90 leading-relaxed">
                Proctoring systems are currently monitoring {activeExamsCount}{" "}
                active exams.
              </p>
              <Button
                className="w-full text-[10px] h-10 rounded-none bg-[#000000] text-white border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-[#000000]/80 hover:translate-y-[2px] transition-all font-black uppercase tracking-widest"
                onClick={() => setActiveSection("access-control")}
              >
                Manage Permissions
              </Button>
            </CardContent>
            <div className="absolute -bottom-4 -right-4 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Server className="h-32 w-32" />
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

    const accentColor =
      userListFilter === "student"
        ? {
            bg: "bg-[#0075CF]",
            text: "text-white",
            border: "border-[#000000]",
            icon: "text-white",
            hover: "hover:bg-[#0075CF]/90",
          }
        : userListFilter === "instructor"
          ? {
              bg: "bg-[#FD5A1A]",
              text: "text-white",
              border: "border-[#000000]",
              icon: "text-white",
              hover: "hover:bg-[#FD5A1A]/90",
            }
          : {
              bg: "bg-[#000000]",
              text: "text-white",
              border: "border-[#000000]",
              icon: "text-white",
              hover: "hover:bg-[#000000]/90",
            };

    // Join userRoles with profiles for rich info
    const enrichedUsers = userRoles
      .filter((u) => userListFilter === "all" || u.role === userListFilter)
      .map((u) => {
        const profile = (profiles as any[]).find(
          (p: any) => p.id === u.user_id,
        );
        return {
          ...u,
          full_name: profile?.full_name || null,
          email: profile?.email || null,
          avatar_url: profile?.avatar_url || null,
          created_at_profile: profile?.created_at || u.created_at,
          status: profile?.status || "active",
        };
      })
      .filter((u) => {
        if (!userSearchQuery) return true;
        const q = userSearchQuery.toLowerCase();
        return (
          u.full_name?.toLowerCase().includes(q) ||
          u.email?.toLowerCase().includes(q) ||
          u.user_id?.toLowerCase().includes(q)
        );
      });

    const formatJoinDate = (dateStr: string | null) => {
      if (!dateStr) return "Unknown";
      const date = new Date(dateStr);
      return date.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
    };

    const getInitials = (name: string | null) => {
      if (!name) return "?";
      return name
        .split(" ")
        .map((n) => n[0])
        .slice(0, 2)
        .join("")
        .toUpperCase();
    };

    return (
      <div className="space-y-6 animate-in fade-in duration-300 font-['Inter']">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <Button
            className="gap-2 w-fit bg-white text-[#000000] border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-[#E9E9E9] hover:translate-y-[1px] hover:translate-x-[1px] transition-all font-black uppercase tracking-widest text-xs"
            onClick={() => setActiveSection("overview")}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Dashboard
          </Button>
          <div>
            <h2 className="text-3xl font-black text-[#000000] uppercase tracking-wider">
              {label} List
            </h2>
            <p className="text-sm font-bold text-[#000000]/60">
              {enrichedUsers.length} {label.toLowerCase()} registered on the
              platform
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative max-w-sm group focus-within:translate-y-[-2px] focus-within:translate-x-[-2px] transition-transform">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000]" />
          <input
            type="text"
            placeholder={`Search ${label.toLowerCase()} by name or email...`}
            value={userSearchQuery}
            onChange={(e) => setUserSearchQuery(e.target.value)}
            className="pl-10 pr-4 py-3 w-full border-4 border-[#000000] bg-white text-[#000000] font-bold shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none placeholder:font-normal placeholder:text-[#000000]/50"
          />
        </div>

        {/* List */}
        <Card className="rounded-xl border-4 border-[#000000] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white relative overflow-hidden">
          {enrichedUsers.length === 0 ? (
            <CardContent className="flex flex-col items-center justify-center py-20 gap-3 text-[#000000]/60 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
              <div className="p-4 bg-[#E9E9E9] border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl mb-2">
                <Users className="h-10 w-10 text-[#000000]" />
              </div>
              <p className="font-black uppercase tracking-wider text-xl text-[#000000]">
                No {label.toLowerCase()} found
              </p>
              {userSearchQuery && (
                <p className="font-bold text-sm">Try a different search term</p>
              )}
            </CardContent>
          ) : (
            <div className="divide-y-4 divide-[#000000]">
              {enrichedUsers.map((u, idx) => (
                <div
                  key={u.user_id || idx}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-[#E9E9E9] transition-colors group cursor-default"
                >
                  {/* Avatar */}
                  <div
                    className={`h-12 w-12 rounded-lg flex items-center justify-center flex-shrink-0 font-black text-sm border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${accentColor.bg} ${accentColor.text}`}
                  >
                    {u.avatar_url ? (
                      <img
                        src={u.avatar_url}
                        alt={u.full_name || "User"}
                        className="h-12 w-12 rounded-lg object-cover"
                      />
                    ) : (
                      getInitials(u.full_name)
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-[#000000] text-lg uppercase tracking-wider truncate mb-1">
                      {u.full_name || "Unknown User"}
                    </p>
                    <p className="text-sm font-bold text-[#000000]/60 truncate">
                      {u.email || u.user_id}
                    </p>
                  </div>

                  {/* Join Date */}
                  <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#000000]/60 flex-shrink-0">
                    <Clock className="h-4 w-4" />
                    <span>Joined {formatJoinDate(u.created_at_profile)}</span>
                  </div>

                  {/* Role Badge */}
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${accentColor.bg} ${accentColor.text} flex-shrink-0`}
                  >
                    {u.role}
                  </span>

                  {/* Status Badge */}
                  <span
                    className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex-shrink-0 ${
                      u.status === "suspended"
                        ? "bg-red-500 text-white"
                        : "bg-green-500 text-white"
                    }`}
                  >
                    {u.status}
                  </span>
                </div>
              ))}
            </div>
          )}
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
      case "attendance":
        return <ManagerAttendance />;
      case "help":
        return <ManagerHelp />;
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
        <main className="flex-1 p-3 sm:p-4 md:p-6 lg:p-8 overflow-auto">
          <div className="max-w-6xl mx-auto">{renderContent()}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
