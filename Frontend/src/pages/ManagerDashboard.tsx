import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { ManagerSidebar } from "@/components/manager/ManagerSidebar";
import { ManagerHeader } from "@/components/manager/ManagerHeader";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExamScheduler } from "@/components/manager/ExamScheduler";
import { QuestionBankManager } from "@/components/manager/QuestionBankManager";
import { LeaderboardManager } from "@/components/manager/LeaderboardManager";
import { GuestCredentialsManager } from "@/components/manager/GuestCredentialsManager";
import { ExamMonitoring } from "@/components/manager/ExamMonitoring";
import { MockTestManager } from "@/components/manager/MockTestManager";
import {
  useExams,
  useQuestions,
  useLeaderboard,
  useGuestCredentials,
} from "@/hooks/useManagerData";
import AmbientBackground from "@/components/ui/AmbientBackground";
import {
  Calendar,
  FileQuestion,
  Trophy,
  UserPlus,
  Eye,
  Shuffle,
} from "lucide-react";

export default function ManagerDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: exams = [] } = useExams();
  const { data: questions = [] } = useQuestions();
  const { data: leaderboard = [] } = useLeaderboard();
  const { data: guests = [] } = useGuestCredentials();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  const statsCards = [
    {
      title: "Scheduled Exams",
      value: exams.filter((e) => e.status === "scheduled").length.toString(),
      icon: Calendar,
      color: "text-primary",
      change: `${exams.filter((e) => e.status === "active").length} active`,
    },
    {
      title: "Question Bank",
      value: questions.length.toString(),
      icon: FileQuestion,
      color: "text-accent",
      change: "total questions",
    },
    {
      title: "Leaderboard",
      value: leaderboard.length.toString(),
      icon: Trophy,
      color: "text-yellow-500",
      change: `${leaderboard.filter((l) => l.is_verified).length} verified`,
    },
    {
      title: "Guest Accounts",
      value: guests.length.toString(),
      icon: UserPlus,
      color: "text-primary",
      change: `${guests.filter((g) => g.is_active).length} active`,
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <ManagerSidebar />
      <SidebarInset>
        <AmbientBackground />
        <ManagerHeader />

        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Section */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              LMS Manager Dashboard 🎯
            </h1>
            <p className="text-muted-foreground mt-1">
              Manage exams, question banks, and monitor system performance
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
                  <p className="text-xs text-muted-foreground mt-1">
                    {stat.change}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Main Tabs */}
          <Tabs defaultValue="exams" className="space-y-6">
            <TabsList className="grid w-full max-w-3xl grid-cols-6">
              <TabsTrigger value="exams" className="gap-2">
                <Calendar className="h-4 w-4" />
                <span className="hidden sm:inline">Exams</span>
              </TabsTrigger>
              <TabsTrigger value="questions" className="gap-2">
                <FileQuestion className="h-4 w-4" />
                <span className="hidden sm:inline">Questions</span>
              </TabsTrigger>
              <TabsTrigger value="mock" className="gap-2">
                <Shuffle className="h-4 w-4" />
                <span className="hidden sm:inline">Mock Tests</span>
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="gap-2">
                <Trophy className="h-4 w-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </TabsTrigger>
              <TabsTrigger value="guests" className="gap-2">
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Guests</span>
              </TabsTrigger>
              <TabsTrigger value="monitoring" className="gap-2">
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline">Monitoring</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="exams">
              <ExamScheduler />
            </TabsContent>

            <TabsContent value="questions">
              <QuestionBankManager />
            </TabsContent>

            <TabsContent value="mock">
              <MockTestManager />
            </TabsContent>

            <TabsContent value="leaderboard">
              <LeaderboardManager />
            </TabsContent>

            <TabsContent value="guests">
              <GuestCredentialsManager />
            </TabsContent>

            <TabsContent value="monitoring">
              <ExamMonitoring />
            </TabsContent>
          </Tabs>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
