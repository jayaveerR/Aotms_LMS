import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { useAuth } from "@/hooks/useAuth";
import { useAdminData } from "@/hooks/useAdminData";
import AmbientBackground from "@/components/ui/AmbientBackground";
import { UserManagement } from "@/components/admin/UserManagement";
import { CourseApproval } from "@/components/admin/CourseApproval";
import { SecurityMonitor } from "@/components/admin/SecurityMonitor";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Shield,
  BookOpen,
  BarChart3,
  Settings,
  TrendingUp,
  Server,
  Database,
  Globe,
  ShieldAlert,
  FileText,
  Trash2,
  GraduationCap,
  UserCheck,
  RefreshCw,
  ArrowLeft,
  Clock,
  Search,
  DollarSign,
} from "lucide-react";

const platformMetrics = [
  { label: "CPU Usage", value: 32, max: 100 },
  { label: "Memory", value: 68, max: 100 },
  { label: "Storage", value: 45, max: 100 },
  { label: "Bandwidth", value: 23, max: 100 },
];

export default function AdminDashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const {
    loading: dataLoading,
    profiles,
    courses,
    securityEvents,
    systemLogs,
    stats,
    refresh,
    updateUserStatus,
    updateUserRole,
    approveCourse,
    rejectCourse,
    resolveSecurityEvent,
  } = useAdminData();

  const [activeTab, setActiveTab] = useState("users");
  const [roleListView, setRoleListView] = useState<
    "all" | "student" | "instructor" | null
  >(null);
  const [userSearchQuery, setUserSearchQuery] = useState("");

  const totalCandidates = stats.totalUsers || 0;
  const totalStudents = stats.roleCounts?.student || 0;
  const totalInstructors = stats.roleCounts?.instructor || 0;

  const openRoleListView = (role: "all" | "student" | "instructor") => {
    setRoleListView(role);
    setUserSearchQuery("");
  };

  const formatLastActive = (dateStr: string | null) => {
    if (!dateStr) return "Never";
    const date = new Date(dateStr);
    const diffMins = Math.floor((Date.now() - date.getTime()) / 60000);
    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return `${Math.floor(diffMins / 1440)}d ago`;
  };

  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/auth");
    }
  }, [user, authLoading, navigate]);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // --- Role List Full-Page View ---
  if (roleListView !== null) {
    const label =
      roleListView === "student"
        ? "Students"
        : roleListView === "instructor"
          ? "Instructors"
          : "All Candidates";

    const accentColor =
      roleListView === "student"
        ? {
            bg: "bg-cyan-50",
            text: "text-cyan-700",
            border: "border-cyan-200",
            icon: "text-cyan-600",
          }
        : roleListView === "instructor"
          ? {
              bg: "bg-fuchsia-50",
              text: "text-fuchsia-700",
              border: "border-fuchsia-200",
              icon: "text-fuchsia-600",
            }
          : {
              bg: "bg-indigo-50",
              text: "text-indigo-700",
              border: "border-indigo-200",
              icon: "text-indigo-600",
            };

    const filtered = profiles
      .filter((p) => roleListView === "all" || p.role === roleListView)
      .filter(
        (p) =>
          !userSearchQuery ||
          p.full_name?.toLowerCase().includes(userSearchQuery.toLowerCase()) ||
          p.email?.toLowerCase().includes(userSearchQuery.toLowerCase()),
      );

    return (
      <SidebarProvider>
        <AdminSidebar />
        <SidebarInset>
          <AmbientBackground />
          <AdminHeader />
          <main className="flex-1 p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="gap-2"
                onClick={() => setRoleListView(null)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div>
                <h1 className="text-2xl font-bold">{label} List</h1>
                <p className="text-sm text-muted-foreground">
                  {filtered.length} {label.toLowerCase()} found
                </p>
              </div>
            </div>

            {/* Search */}
            <div className="relative max-w-sm">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={`Search ${label.toLowerCase()}...`}
                value={userSearchQuery}
                onChange={(e) => setUserSearchQuery(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border bg-background text-sm outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>

            {/* User List */}
            <Card className="rounded-xl border shadow-sm overflow-hidden">
              {dataLoading ? (
                <CardContent className="p-6 space-y-4">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <Skeleton className="h-4 w-40" />
                        <Skeleton className="h-3 w-56" />
                      </div>
                    </div>
                  ))}
                </CardContent>
              ) : filtered.length === 0 ? (
                <CardContent className="flex flex-col items-center justify-center py-20 gap-3 text-muted-foreground">
                  <Users className="h-12 w-12 opacity-20" />
                  <p className="font-medium">No {label.toLowerCase()} found</p>
                  {userSearchQuery && (
                    <p className="text-xs">Try a different search term</p>
                  )}
                </CardContent>
              ) : (
                <div className="divide-y">
                  {filtered.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors"
                    >
                      <div
                        className={`h-10 w-10 rounded-full flex items-center justify-center flex-shrink-0 ${accentColor.bg}`}
                      >
                        <Users className={`h-5 w-5 ${accentColor.icon}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold truncate">
                          {person.full_name || "Unknown User"}
                        </p>
                        <p className="text-sm text-muted-foreground truncate">
                          {person.email}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 flex-shrink-0">
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatLastActive(person.last_active_at)}
                        </span>
                        <span
                          className={`text-xs font-semibold px-2 py-1 rounded-full capitalize ${accentColor.bg} ${accentColor.text}`}
                        >
                          {person.role || roleListView}
                        </span>
                        <Badge
                          variant={
                            person.status === "suspended"
                              ? "destructive"
                              : "secondary"
                          }
                          className="text-xs"
                        >
                          {person.status || "active"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </main>
        </SidebarInset>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <AmbientBackground />
        <AdminHeader />

        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Section */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Admin Control Panel 🔐
              </h1>
              <p className="text-muted-foreground mt-1">
                Full system access and platform management
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="gap-2"
                onClick={refresh}
                disabled={dataLoading}
              >
                <RefreshCw
                  className={`h-4 w-4 ${dataLoading ? "animate-spin" : ""}`}
                />
                Refresh
              </Button>
              <Button className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Button>
            </div>
          </div>

          {/* Candidates Overview */}
          <div className="grid gap-4 sm:grid-cols-3 mb-6">
            <Card
              className="rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-indigo-200 group"
              onClick={() => openRoleListView("all")}
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
                    <h3 className="text-2xl font-bold">
                      {totalCandidates.toLocaleString()}
                    </h3>
                  </div>
                </div>
                <p className="text-[11px] text-indigo-500 mt-3 group-hover:underline">
                  Click to view list →
                </p>
              </CardContent>
            </Card>
            <Card
              className="rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-cyan-200 group"
              onClick={() => openRoleListView("student")}
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
                    <h3 className="text-2xl font-bold">
                      {totalStudents.toLocaleString()}
                    </h3>
                  </div>
                </div>
                <p className="text-[11px] text-cyan-500 mt-3 group-hover:underline">
                  Click to view list →
                </p>
              </CardContent>
            </Card>
            <Card
              className="rounded-xl border shadow-sm hover:shadow-md transition-shadow cursor-pointer hover:border-fuchsia-200 group"
              onClick={() => openRoleListView("instructor")}
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
                    <h3 className="text-2xl font-bold">
                      {totalInstructors.toLocaleString()}
                    </h3>
                  </div>
                </div>
                <p className="text-[11px] text-fuchsia-500 mt-3 group-hover:underline">
                  Click to view list →
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mt-6">
            <Card className="hover-lift border-primary/20 bg-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Total Revenue
                </CardTitle>
                <DollarSign className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <Skeleton className="h-8 w-24" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      ${stats.totalRevenue.toLocaleString()}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-green-600 flex items-center gap-1">
                      <TrendingUp className="h-3 w-3" />
                      +12% from last month
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Active Courses
                </CardTitle>
                <BookOpen className="h-5 w-5 text-accent" />
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {stats.activeCourses}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.pendingCourses} pending approval
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  Security Events
                </CardTitle>
                <ShieldAlert className="h-5 w-5 text-destructive" />
              </CardHeader>
              <CardContent>
                {dataLoading ? (
                  <Skeleton className="h-8 w-20" />
                ) : (
                  <>
                    <div className="text-2xl font-bold">
                      {stats.securityEvents}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">
                      {stats.highPriorityEvents} high priority
                    </p>
                  </>
                )}
              </CardContent>
            </Card>

            <Card className="hover-lift">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  System Health
                </CardTitle>
                <Server className="h-5 w-5 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">98%</div>
                <p className="text-xs text-muted-foreground mt-1">
                  All systems normal
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Tabs */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full max-w-2xl grid-cols-5">
              <TabsTrigger value="users" className="gap-2">
                <Users className="h-4 w-4" />
                Users
              </TabsTrigger>
              <TabsTrigger value="courses" className="gap-2">
                <BookOpen className="h-4 w-4" />
                Courses
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-2">
                <Shield className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger value="analytics" className="gap-2">
                <BarChart3 className="h-4 w-4" />
                Analytics
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <UserManagement
                users={profiles}
                loading={dataLoading}
                roleCounts={stats.roleCounts}
                onUpdateStatus={updateUserStatus}
                onUpdateRole={updateUserRole}
              />
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <CourseApproval
                courses={courses}
                loading={dataLoading}
                onApprove={approveCourse}
                onReject={rejectCourse}
              />
            </TabsContent>

            {/* Security Tab */}
            <TabsContent value="security" className="space-y-6">
              <SecurityMonitor
                securityEvents={securityEvents}
                systemLogs={systemLogs}
                loading={dataLoading}
                highPriorityCount={stats.highPriorityEvents}
                onResolveEvent={resolveSecurityEvent}
              />
            </TabsContent>

            {/* Analytics Tab */}
            <TabsContent value="analytics" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-3">
                <Card className="lg:col-span-2">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center gap-2">
                          <BarChart3 className="h-5 w-5 text-primary" />
                          Platform Analytics
                        </CardTitle>
                        <CardDescription>
                          Overview of platform performance
                        </CardDescription>
                      </div>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm">
                          This Week
                        </Button>
                        <Button variant="outline" size="sm">
                          Export
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            Active Users (Today)
                          </span>
                        </div>
                        <p className="text-2xl font-bold">{stats.totalUsers}</p>
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3" /> Real-time data
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-2">
                          <BookOpen className="h-4 w-4 text-accent" />
                          <span className="text-sm text-muted-foreground">
                            Active Courses
                          </span>
                        </div>
                        <p className="text-2xl font-bold">
                          {stats.activeCourses}
                        </p>
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3" />{" "}
                          {stats.pendingCourses} pending
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Shield className="h-4 w-4 text-destructive" />
                          <span className="text-sm text-muted-foreground">
                            Security Events
                          </span>
                        </div>
                        <p className="text-2xl font-bold">
                          {stats.securityEvents}
                        </p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                          {stats.highPriorityEvents} high priority
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <DollarSign className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            Total Revenue
                          </span>
                        </div>
                        <p className="text-2xl font-bold text-primary">
                          ${stats.totalRevenue.toLocaleString()}
                        </p>
                        <p className="text-xs text-green-600 flex items-center gap-1 mt-1">
                          <TrendingUp className="h-3 w-3" /> +12% growth
                        </p>
                      </div>
                      <div className="p-4 rounded-lg bg-muted/50">
                        <div className="flex items-center gap-2 mb-2">
                          <Globe className="h-4 w-4 text-primary" />
                          <span className="text-sm text-muted-foreground">
                            Role Distribution
                          </span>
                        </div>
                        <div className="space-y-1 text-sm">
                          {Object.entries(stats.roleCounts).map(
                            ([role, count]) => (
                              <div key={role} className="flex justify-between">
                                <span className="capitalize">{role}s</span>
                                <Badge variant="secondary">{count}</Badge>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Server className="h-5 w-5 text-accent" />
                      System Resources
                    </CardTitle>
                    <CardDescription>Server health metrics</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {platformMetrics.map((metric) => (
                      <div key={metric.label} className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>{metric.label}</span>
                          <span
                            className={`font-medium ${
                              metric.value > 80
                                ? "text-destructive"
                                : metric.value > 60
                                  ? "text-accent"
                                  : "text-green-600"
                            }`}
                          >
                            {metric.value}%
                          </span>
                        </div>
                        <Progress value={metric.value} className="h-2" />
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <div className="grid gap-6 lg:grid-cols-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5 text-primary" />
                      Platform Settings
                    </CardTitle>
                    <CardDescription>
                      Configure global platform settings
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Maintenance Mode</Label>
                        <p className="text-xs text-muted-foreground">
                          Disable access for non-admins
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>New User Registration</Label>
                        <p className="text-xs text-muted-foreground">
                          Allow new signups
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-xs text-muted-foreground">
                          Send system emails
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Public Leaderboard</Label>
                        <p className="text-xs text-muted-foreground">
                          Show rankings to all
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="h-5 w-5 text-accent" />
                      Security Settings
                    </CardTitle>
                    <CardDescription>
                      Configure security policies
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Max Login Attempts</Label>
                      <Input type="number" defaultValue={5} className="w-24" />
                    </div>
                    <div className="space-y-2">
                      <Label>Session Timeout (minutes)</Label>
                      <Input type="number" defaultValue={60} className="w-24" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Two-Factor Authentication</Label>
                        <p className="text-xs text-muted-foreground">
                          Require 2FA for admins
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>IP Whitelisting</Label>
                        <p className="text-xs text-muted-foreground">
                          Restrict admin access by IP
                        </p>
                      </div>
                      <Switch />
                    </div>
                    <Button className="w-full">Save Security Settings</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      Exam Policies
                    </CardTitle>
                    <CardDescription>
                      Default exam configuration
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <Label>Default Duration (minutes)</Label>
                      <Input type="number" defaultValue={60} className="w-24" />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Negative Marking</Label>
                        <p className="text-xs text-muted-foreground">
                          Enable by default
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Question Shuffling</Label>
                        <p className="text-xs text-muted-foreground">
                          Randomize questions
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Proctoring</Label>
                        <p className="text-xs text-muted-foreground">
                          Enable webcam monitoring
                        </p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Database className="h-5 w-5 text-accent" />
                      Data Management
                    </CardTitle>
                    <CardDescription>Backup and maintenance</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                    >
                      <Database className="h-4 w-4" />
                      Create Backup
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                    >
                      <RefreshCw className="h-4 w-4" />
                      Clear Cache
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3"
                    >
                      <FileText className="h-4 w-4" />
                      Export All Data
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full justify-start gap-3 text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                      Purge Old Logs
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
