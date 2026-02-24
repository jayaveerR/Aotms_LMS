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
    <div className="space-y-6 font-['Inter']">
      {/* Welcome Section */}
      <div>
        <h1 className="text-3xl font-black text-[#000000] uppercase tracking-wider">
          Welcome back, {user?.user_metadata?.full_name || "Student"}! 👋
        </h1>
        <p className="text-sm font-bold text-[#000000]/60 mt-1 uppercase tracking-widest">
          Here's what's happening with your learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card
            key={stat.title}
            className="bg-white rounded-xl border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-default"
          >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-[10px] font-black uppercase tracking-widest text-[#000000]/60">
                {stat.title}
              </CardTitle>
              <div className="h-8 w-8 bg-[#E9E9E9] rounded flex items-center justify-center border-2 border-[#000000]">
                <stat.icon
                  className={`h-4 w-4 ${stat.color === "text-primary" ? "text-[#0075CF]" : stat.color === "text-accent" ? "text-[#FD5A1A]" : "text-[#000000]"}`}
                />
              </div>
            </CardHeader>
            <CardContent className="pb-4">
              <div className="text-3xl font-black text-[#000000]">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Enrolled Courses */}
        <Card className="lg:col-span-2 bg-white rounded-xl border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <CardHeader className="border-b-4 border-[#000000] bg-[#E9E9E9] rounded-t-lg">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <CardTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-widest text-[#000000]">
                  <BookOpen className="h-6 w-6 text-[#0075CF]" />
                  Continue Learning
                </CardTitle>
                <CardDescription className="text-[#000000]/60 font-bold uppercase tracking-wider text-[10px] mt-1">
                  Pick up where you left off
                </CardDescription>
              </div>
              <Badge className="bg-[#FD5A1A] text-white border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-widest pointer-events-none self-start sm:self-auto">
                {enrollments.length} Active
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4 p-6 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] bg-white">
            {enrollLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-20 bg-[#E9E9E9] border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-lg animate-pulse"
                  />
                ))}
              </div>
            ) : enrollments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center bg-white border-4 border-dashed border-[#000000] rounded-lg">
                <div className="h-16 w-16 bg-[#E9E9E9] rounded flex items-center justify-center border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4">
                  <BookOpen className="h-8 w-8 text-[#000000]" />
                </div>
                <p className="text-sm font-bold text-[#000000]/60 mb-4 uppercase tracking-wider">
                  You haven't enrolled in any courses yet.
                </p>
                <Button
                  className="bg-[#0075CF] text-white border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0075CF]/90 hover:translate-y-[1px] hover:translate-x-[1px] transition-all font-black uppercase tracking-widest text-xs"
                  onClick={() => navigate("/courses")}
                >
                  Browse Courses
                </Button>
              </div>
            ) : (
              enrollments.slice(0, 3).map((enrollment) => (
                <div
                  key={enrollment.id}
                  className="flex items-center gap-4 p-4 rounded-lg bg-white border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#E9E9E9] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer group"
                  onClick={() =>
                    navigate(`/course/${enrollment.course_id}/play`)
                  }
                >
                  <div className="h-12 w-12 rounded bg-[#0075CF] border-2 border-[#000000] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center group-hover:scale-105 transition-transform">
                    <Play className="h-5 w-5 text-white ml-1" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-black text-[#000000] uppercase tracking-wider truncate text-sm">
                      {enrollment.course?.title ??
                        `Course ${enrollment.course_id.slice(0, 8)}`}
                    </h4>
                    <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                      Enrolled
                    </p>
                  </div>
                  <div className="w-24">
                    <Progress
                      value={enrollment.progress_percent ?? 0}
                      className="h-3 border-2 border-[#000000] rounded-none bg-[#E9E9E9]"
                    />
                    <p className="text-[10px] font-black text-[#000000] mt-1 text-right">
                      {enrollment.progress_percent ?? 0}%
                    </p>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Upcoming Classes placeholder */}
        <Card className="bg-[#0075CF] rounded-xl border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] text-white relative overflow-hidden group">
          <CardHeader className="p-5 pb-2 relative z-10">
            <CardTitle className="flex items-center gap-2 text-xl font-black uppercase tracking-widest">
              <Calendar className="h-6 w-6" />
              Upcoming Classes
            </CardTitle>
            <CardDescription className="text-white/70 font-bold uppercase tracking-wider text-[10px] mt-1">
              Your scheduled sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 relative z-10 flex flex-col items-center justify-center text-center mt-4">
            <div className="h-16 w-16 bg-white rounded flex items-center justify-center border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] mb-4 group-hover:-translate-y-2 transition-transform">
              <Calendar className="h-8 w-8 text-[#0075CF]" />
            </div>
            <p className="text-sm font-bold opacity-90 leading-relaxed max-w-[200px]">
              No upcoming classes scheduled yet.
            </p>
          </CardContent>
          <div className="absolute -bottom-4 -right-4 p-4 opacity-10 group-hover:scale-110 transition-transform duration-500">
            <Calendar className="h-40 w-40" />
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card
          className="bg-white rounded-xl border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all cursor-pointer group"
          onClick={() => navigate("/courses")}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
            <div className="h-16 w-16 bg-[#E9E9E9] rounded border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-4 group-hover:bg-[#0075CF] group-hover:text-white transition-colors">
              <Compass className="h-8 w-8 text-[#000000] group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-black text-[#000000] uppercase tracking-wider text-sm">
              Browse Courses
            </h4>
            <p className="text-[10px] font-bold text-[#000000]/60 mt-2 uppercase tracking-widest">
              Explore catalogue
            </p>
          </CardContent>
        </Card>

        <Card
          className="bg-white rounded-xl border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all cursor-pointer group"
          onClick={() => navigate("/exam?type=mock")}
        >
          <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
            <div className="h-16 w-16 bg-[#E9E9E9] rounded border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-4 group-hover:bg-[#FD5A1A] group-hover:text-white transition-colors">
              <FileText className="h-8 w-8 text-[#000000] group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-black text-[#000000] uppercase tracking-wider text-sm">
              Take Mock Test
            </h4>
            <p className="text-[10px] font-bold text-[#000000]/60 mt-2 uppercase tracking-widest">
              Practice exams
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all cursor-pointer group">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
            <div className="h-16 w-16 bg-[#E9E9E9] rounded border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-4 group-hover:bg-[#000000] group-hover:text-white transition-colors">
              <Award className="h-8 w-8 text-[#000000] group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-black text-[#000000] uppercase tracking-wider text-sm">
              View Certificates
            </h4>
            <p className="text-[10px] font-bold text-[#000000]/60 mt-2 uppercase tracking-widest">
              Your achievements
            </p>
          </CardContent>
        </Card>

        <Card className="bg-white rounded-xl border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[6px] hover:translate-y-[6px] transition-all cursor-pointer group">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center h-full">
            <div className="h-16 w-16 bg-[#E9E9E9] rounded border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center mb-4 group-hover:bg-[#0075CF] group-hover:text-white transition-colors">
              <Trophy className="h-8 w-8 text-[#000000] group-hover:text-white transition-colors" />
            </div>
            <h4 className="font-black text-[#000000] uppercase tracking-wider text-sm">
              Leaderboard
            </h4>
            <p className="text-[10px] font-bold text-[#000000]/60 mt-2 uppercase tracking-widest">
              See rankings
            </p>
          </CardContent>
        </Card>
      </div>
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
    <div className="space-y-6 font-['Inter']">
      <div className="flex items-center gap-4">
        <div className="h-16 w-16 rounded bg-[#E9E9E9] border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
          <Icon className="h-8 w-8 text-[#000000]" />
        </div>
        <div>
          <h1 className="text-3xl font-black text-[#000000] uppercase tracking-wider">
            {title}
          </h1>
          <p className="text-sm font-bold text-[#000000]/60 uppercase tracking-widest mt-1">
            {description}
          </p>
        </div>
      </div>

      <Card className="bg-white rounded-xl border-4 border-[#000000] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] overflow-hidden">
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
