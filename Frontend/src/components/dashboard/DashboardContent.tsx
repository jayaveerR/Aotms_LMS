import { useLocation } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
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
} from 'lucide-react';
import { UserProfile } from './UserProfile';

const statsCards = [
  { title: 'Enrolled Courses', value: '4', icon: BookOpen, color: 'text-primary' }, // Blue
  { title: 'Exams Completed', value: '12', icon: Trophy, color: 'text-accent' }, // Orange
  { title: 'Hours Learned', value: '48', icon: Clock, color: 'text-primary' }, // Blue
  { title: 'ATS Score', value: '78%', icon: TrendingUp, color: 'text-accent' }, // Orange
];

const upcomingClasses = [
  { title: 'Advanced JavaScript Concepts', time: 'Today, 3:00 PM', instructor: 'Dr. Smith' },
  { title: 'Data Structures Deep Dive', time: 'Tomorrow, 10:00 AM', instructor: 'Prof. Johnson' },
  { title: 'System Design Fundamentals', time: 'Feb 8, 2:00 PM', instructor: 'Dr. Williams' },
];

const recentCourses = [
  { title: 'Full Stack Web Development', progress: 65, lessons: 24 },
  { title: 'Data Science Fundamentals', progress: 42, lessons: 18 },
  { title: 'Cloud Computing with AWS', progress: 28, lessons: 32 },
];

// Dashboard Home Content
function DashboardHome() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Welcome back, {user?.user_metadata?.full_name || 'Student'}! 👋
        </h1>
        <p className="text-muted-foreground mt-1">
          Here's what's happening with your learning journey
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statsCards.map((stat) => (
          <Card key={stat.title} className="hover-lift">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Courses */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Continue Learning
                </CardTitle>
                <CardDescription>Pick up where you left off</CardDescription>
              </div>
              <Badge variant="secondary">3 Active</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentCourses.map((course) => (
              <div
                key={course.title}
                className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
              >
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Play className="h-5 w-5 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium truncate">{course.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {course.lessons} lessons
                  </p>
                </div>
                <div className="w-24">
                  <Progress value={course.progress} className="h-2" />
                  <p className="text-xs text-muted-foreground mt-1 text-right">
                    {course.progress}%
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Upcoming Classes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-accent" />
              Upcoming Classes
            </CardTitle>
            <CardDescription>Your scheduled sessions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingClasses.map((cls) => (
              <div
                key={cls.title}
                className="p-3 rounded-lg border border-border hover:border-primary/50 transition-colors cursor-pointer"
              >
                <h4 className="font-medium text-sm">{cls.title}</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  {cls.instructor}
                </p>
                <Badge variant="outline" className="mt-2 text-xs">
                  {cls.time}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card className="hover-lift cursor-pointer group">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <FileText className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-medium">Take Mock Test</h4>
            <p className="text-xs text-muted-foreground mt-1">Practice exams</p>
          </CardContent>
        </Card>

        <Card className="hover-lift cursor-pointer group">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
              <Award className="h-6 w-6 text-accent" />
            </div>
            <h4 className="font-medium">View Certificates</h4>
            <p className="text-xs text-muted-foreground mt-1">Your achievements</p>
          </CardContent>
        </Card>

        <Card className="hover-lift cursor-pointer group">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3 group-hover:bg-primary/20 transition-colors">
              <Trophy className="h-6 w-6 text-primary" />
            </div>
            <h4 className="font-medium">Leaderboard</h4>
            <p className="text-xs text-muted-foreground mt-1">See rankings</p>
          </CardContent>
        </Card>

        <Card className="hover-lift cursor-pointer group">
          <CardContent className="flex flex-col items-center justify-center p-6 text-center">
            <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center mb-3 group-hover:bg-accent/20 transition-colors">
              <TrendingUp className="h-6 w-6 text-accent" />
            </div>
            <h4 className="font-medium">ATS Resume</h4>
            <p className="text-xs text-muted-foreground mt-1">Check your score</p>
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
  icon: Icon
}: {
  title: string;
  description: string;
  icon: React.ElementType;
}) {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
          <Icon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-foreground">{title}</h1>
          <p className="text-muted-foreground">{description}</p>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16 text-center">
          <Icon className="h-16 w-16 text-muted-foreground/30 mb-4" />
          <h3 className="text-lg font-medium text-muted-foreground">Coming Soon</h3>
          <p className="text-sm text-muted-foreground/70 mt-1 max-w-md">
            This module is under development. Stay tuned for updates!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

// Route mapping for dashboard pages
const routeConfig: Record<string, { title: string; description: string; icon: React.ElementType }> = {
  '/dashboard/profile': { title: 'My Profile', description: 'Manage your personal information', icon: User },
  '/dashboard/courses': { title: 'My Courses', description: 'View and manage your enrolled courses', icon: BookOpen },
  '/dashboard/videos': { title: 'Recorded Videos', description: 'Access your recorded course videos', icon: Video },
  '/dashboard/live-classes': { title: 'Live Classes', description: 'Join and schedule live sessions', icon: Calendar },
  '/dashboard/mock-papers': { title: 'Mock Papers', description: 'Practice with mock exam papers', icon: FileText },
  '/dashboard/exams': { title: 'Live Exams', description: 'View and take live examinations', icon: ClipboardCheck },
  '/dashboard/history': { title: 'Exam History', description: 'Review your past exam results', icon: History },
  '/dashboard/leaderboard': { title: 'Leaderboard', description: 'See how you rank among peers', icon: Trophy },
  '/dashboard/notifications': { title: 'Notifications', description: 'Stay updated with latest alerts', icon: Bell },
  '/dashboard/settings': { title: 'Settings', description: 'Manage your account settings', icon: Settings },
};

export function DashboardContent() {
  const location = useLocation();
  const currentPath = location.pathname;

  // Check if we're on the main dashboard page
  if (currentPath === '/dashboard' || currentPath === '/dashboard/') {
    return <DashboardHome />;
  }

  // Get the config for the current route
  const config = routeConfig[currentPath];

  if (currentPath === '/dashboard/profile') {
    return <UserProfile />;
  }

  if (config) {
    return <ModulePage title={config.title} description={config.description} icon={config.icon} />;
  }

  // Fallback for unknown routes
  return <DashboardHome />;
}
