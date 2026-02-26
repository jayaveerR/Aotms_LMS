import { useLocation, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { useEnrollments } from "@/hooks/useCourses";
import {
  BookOpen,
  Trophy,
  Clock,
  TrendingUp,
  Play,
  Calendar,
  FileText,
  Award,
  User,
  Video,
  ClipboardCheck,
  History,
  Bell,
  Settings,
  Compass,
} from "lucide-react";
import { UserProfile } from "./UserProfile";
import NotificationsPage from "@/pages/NotificationsPage";
import MyCoursesPage from "@/pages/MyCoursesPage";
import LeaderboardPage from "@/pages/LeaderboardPage";
import SettingsPage from "@/pages/SettingsPage";
import ExamsPortalPage from "@/pages/ExamsPortalPage";
import ExamHistoryPage from "@/pages/ExamHistoryPage";
import LiveClassesPage from "@/pages/LiveClassesPage";

// Dashboard Home Content
function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { enrollments, loading: enrollLoading } = useEnrollments();

  const statsCards = [
    {
      title: "Enrolled Courses",
      value: enrollLoading ? "…" : String(enrollments.length),
      icon: BookOpen,
      color: "text-primary",
    },
    {
      title: "Exams Completed",
      value: "—",
      icon: Trophy,
      color: "text-accent",
    },
    { title: "Hours Learned", value: "—", icon: Clock, color: "text-primary" },
    { title: "ATS Score", value: "—", icon: TrendingUp, color: "text-accent" },
  ];

  return (
    <div className="space-y-4 sm:space-y-6 font-['Inter']">
      {/* Welcome Section */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#000000] uppercase tracking-wider">
          Welcome back, {user?.user_metadata?.full_name || "Student"}! 👋
        </h1>
        <p className="text-xs sm:text-sm font-bold text-[#000000]/60 mt-1 uppercase tracking-widest">
          Here's what's happening with your learning journey
        </p>
      </div>

      {/* MISSION TELEMETRY */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-1 bg-[#FD5A1A]" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
            Mission Telemetry
          </h2>
        </div>
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {statsCards.map((stat) => (
            <Card
              key={stat.title}
              className="bg-white rounded-xl border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all cursor-default"
            >
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-[9px] font-black uppercase tracking-widest text-[#000000]/60">
                  {stat.title}
                </CardTitle>
                <div className="h-8 w-8 bg-[#E9E9E9] rounded border-2 border-[#000000] flex items-center justify-center">
                  <stat.icon
                    className={`h-4 w-4 ${stat.color === "text-primary" ? "text-[#0075CF]" : stat.color === "text-accent" ? "text-[#FD5A1A]" : "text-[#000000]"}`}
                  />
                </div>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="text-2xl sm:text-3xl font-black text-[#000000]">
                  {stat.value}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* OPERATIONAL STATUS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-1 bg-[#0075CF]" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
            Operational Status
          </h2>
        </div>
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Enrolled Courses */}
          <Card className="lg:col-span-2 bg-white rounded-xl border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <CardHeader className="border-b-4 border-[#000000] bg-[#E9E9E9] rounded-t-lg">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-widest text-[#000000]">
                    <BookOpen className="h-6 w-6 text-[#0075CF]" /> Active
                    Training
                  </CardTitle>
                </div>
                <Badge className="bg-[#FD5A1A] text-white border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-widest pointer-events-none">
                  {enrollments.length} Units
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4 p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-white">
              {enrollLoading ? (
                <div className="space-y-3">
                  {[1, 2].map((i) => (
                    <div
                      key={i}
                      className="h-20 bg-[#E9E9E9] border-2 border-[#000000] rounded-lg animate-pulse"
                    />
                  ))}
                </div>
              ) : enrollments.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center border-4 border-dashed border-[#000000] rounded-xl">
                  <BookOpen className="h-10 w-10 text-[#000000]/20 mb-4" />
                  <p className="text-sm font-bold text-[#000000]/60 uppercase tracking-wider mb-4">
                    No active deployments found.
                  </p>
                  <Button
                    className="bg-[#0075CF] text-white border-2 border-[#000000] shadow-[2px_2px_0px_0px_white] hover:translate-x-1 hover:translate-y-1 transition-all font-black uppercase tracking-widest text-xs"
                    onClick={() => navigate("/courses")}
                  >
                    Enroll Now
                  </Button>
                </div>
              ) : (
                enrollments.slice(0, 3).map((enrollment) => (
                  <div
                    key={enrollment.id}
                    className="flex items-center gap-4 p-4 rounded-xl bg-white border-2 border-[#000000] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all cursor-pointer group"
                    onClick={() =>
                      navigate(`/course/${enrollment.course_id}/play`)
                    }
                  >
                    <div className="h-12 w-12 rounded bg-[#0075CF] border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center group-hover:scale-105 transition-transform shrink-0">
                      <Play className="h-5 w-5 text-white ml-1" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-black text-[#000000] uppercase tracking-wider truncate text-sm">
                        {enrollment.course?.title ??
                          `UNIT_${enrollment.course_id.slice(0, 8)}`}
                      </h4>
                      <p className="text-[9px] font-bold text-black/40 uppercase tracking-widest">
                        Protocol Active
                      </p>
                    </div>
                    <div className="w-20 sm:w-24 shrink-0">
                      <div className="h-3 border-2 border-[#000000] bg-[#E9E9E9] overflow-hidden">
                        <div
                          className="h-full bg-[#0075CF]"
                          style={{
                            width: `${enrollment.progress_percent ?? 0}%`,
                          }}
                        />
                      </div>
                      <p className="text-[9px] font-black text-[#000000] mt-1 text-right">
                        {enrollment.progress_percent ?? 0}%
                      </p>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card className="bg-[#0075CF] rounded-xl border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white relative overflow-hidden group">
            <CardHeader className="p-6 pb-2 relative z-10">
              <CardTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-widest">
                <Calendar className="h-6 w-6" /> Deployment
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 relative z-10 flex flex-col items-center justify-center text-center mt-6">
              <div className="h-16 w-16 bg-white rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_black] flex items-center justify-center mb-6 group-hover:-rotate-3 transition-transform">
                <Clock className="h-8 w-8 text-[#0075CF]" />
              </div>
              <p className="text-sm font-bold opacity-90 leading-relaxed max-w-[200px] uppercase tracking-widest">
                No missions scheduled for today.
              </p>
            </CardContent>
            <div className="absolute -bottom-8 -right-8 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
              <Calendar className="h-48 w-48" />
            </div>
          </Card>
        </div>
      </section>

      {/* PROTOCOL ACCESS */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-4 w-1 bg-black" />
          <h2 className="text-[10px] font-black uppercase tracking-[0.2em] text-black">
            Protocol Access
          </h2>
        </div>
        <div className="grid gap-3 sm:gap-4 grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Course Intel",
              sub: "Browse Catalogue",
              icon: Compass,
              color: "hover:bg-[#0075CF] hover:text-white",
              path: "/courses",
            },
            {
              label: "Field Probe",
              sub: "Take Mock Test",
              icon: FileText,
              color: "hover:bg-[#FD5A1A] hover:text-white",
              path: "/dashboard/mock-papers",
            },
            {
              label: "Credentials",
              sub: "View Certificates",
              icon: Award,
              color: "hover:bg-black hover:text-white",
              path: "/dashboard/history",
            },
            {
              label: "Hierarchy",
              sub: "Global Leaderboard",
              icon: Trophy,
              color: "hover:bg-[#0075CF] hover:text-white",
              path: "/dashboard/leaderboard",
            },
          ].map((action, i) => (
            <Card
              key={i}
              className={`bg-white rounded-xl border-4 border-black shadow-[4px_4px_0px_0px_black] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all cursor-pointer group ${action.color}`}
              onClick={() => navigate(action.path)}
            >
              <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
                <div className="h-12 w-12 bg-[#E9E9E9] rounded-lg border-2 border-black shadow-[2px_2px_0px_0px_black] flex items-center justify-center mb-4 group-hover:bg-white group-hover:text-inherit transition-colors">
                  <action.icon className="h-6 w-6" />
                </div>
                <h4 className="font-black uppercase tracking-wider text-xs">
                  {action.label}
                </h4>
                <p className="text-[8px] font-bold opacity-60 mt-1 uppercase tracking-widest">
                  {action.sub}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}

// Generic Page Component for modules
function ModulePage({
  title,
  description,
  icon: Icon,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="space-y-4 sm:space-y-6 font-['Inter']">
      <div className="flex items-center gap-3 sm:gap-4">
        <div className="h-12 w-12 sm:h-16 sm:w-16 rounded bg-[#E9E9E9] border-2 sm:border-4 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
          <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#000000]" />
        </div>
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#000000] uppercase tracking-wider">
            {title}
          </h1>
          <p className="text-xs sm:text-sm font-bold text-[#000000]/60 uppercase tracking-widest mt-1">
            {description}
          </p>
        </div>
      </div>

      <Card className="bg-white rounded-lg sm:rounded-xl border-2 sm:border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] overflow-hidden">
        <CardContent className="flex flex-col items-center justify-center py-20 text-center">
          <div className="p-6 bg-[#E9E9E9] border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl mb-6 transform -rotate-3 transition-transform hover:rotate-3">
            <Icon className="h-16 w-16 text-[#000000]" />
          </div>
          <h3 className="text-2xl font-black text-[#000000] uppercase tracking-wider">
            Coming Soon
          </h3>
          <p className="text-sm font-bold text-[#000000]/60 mt-2 max-w-md uppercase tracking-widest leading-relaxed">
            This module is under development. Stay tuned for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Route mapping for dashboard pages
const routeConfig: Record<
  string,
  { title: string; description: string; icon: React.ElementType }
> = {
  "/dashboard/profile": {
    title: "My Profile",
    description: "Manage your personal information",
    icon: User,
  },
  "/dashboard/courses": {
    title: "My Courses",
    description: "View and manage your enrolled courses",
    icon: BookOpen,
  },
  "/dashboard/videos": {
    title: "Recorded Videos",
    description: "Access your recorded course videos",
    icon: Video,
  },
  "/dashboard/live-classes": {
    title: "Live Classes",
    description: "Join and schedule live sessions",
    icon: Calendar,
  },
  "/dashboard/mock-papers": {
    title: "Mock Papers",
    description: "Practice with mock exam papers",
    icon: FileText,
  },
  "/dashboard/exams": {
    title: "Live Exams",
    description: "View and take live examinations",
    icon: ClipboardCheck,
  },
  "/dashboard/history": {
    title: "Exam History",
    description: "Review your past exam results",
    icon: History,
  },
  "/dashboard/leaderboard": {
    title: "Leaderboard",
    description: "See how you rank among peers",
    icon: Trophy,
  },
  "/dashboard/notifications": {
    title: "Notifications",
    description: "Stay updated with latest alerts",
    icon: Bell,
  },
  "/dashboard/settings": {
    title: "Settings",
    description: "Manage your account settings",
    icon: Settings,
  },
};

export function DashboardContent() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if we're on the main dashboard page
  if (currentPath === "/dashboard" || currentPath === "/dashboard/") {
    return <DashboardHome />;
  }

  // Get the config for the current route
  const config = routeConfig[currentPath];

  if (currentPath === "/dashboard/profile") {
    return <UserProfile />;
  }

  if (currentPath === "/dashboard/notifications") {
    return <NotificationsPage />;
  }

  if (
    currentPath === "/dashboard/courses" ||
    currentPath === "/dashboard/videos"
  ) {
    return <MyCoursesPage />;
  }

  if (currentPath === "/dashboard/leaderboard") {
    return <LeaderboardPage />;
  }

  if (currentPath === "/dashboard/settings") {
    return <SettingsPage />;
  }

  if (
    currentPath === "/dashboard/mock-papers" ||
    currentPath === "/dashboard/exams"
  ) {
    return <ExamsPortalPage />;
  }

  if (currentPath === "/dashboard/history") {
    return <ExamHistoryPage />;
  }

  if (currentPath === "/dashboard/live-classes") {
    return <LiveClassesPage />;
  }

  if (config) {
    return (
      <ModulePage
        title={config.title}
        description={config.description}
        icon={config.icon}
      />
    );
  }

  // Fallback for unknown routes
  return <DashboardHome />;
}
