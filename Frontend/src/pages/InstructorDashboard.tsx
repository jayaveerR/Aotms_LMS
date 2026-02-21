import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { InstructorSidebar } from "@/components/instructor/InstructorSidebar";
import { InstructorHeader } from "@/components/instructor/InstructorHeader";
import { useAuth } from "@/hooks/useAuth";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseSelector } from "@/components/instructor/CourseSelector";
import { TopicManager } from "@/components/instructor/TopicManager";
import { VideoUploader } from "@/components/instructor/VideoUploader";
import { ResourceUploader } from "@/components/instructor/ResourceUploader";
import { TimelineManager } from "@/components/instructor/TimelineManager";
import { AnnouncementManager } from "@/components/instructor/AnnouncementManager";
import { useInstructorCourses, Course } from "@/hooks/useInstructorData";
import AmbientBackground from "@/components/ui/AmbientBackground";
import {
  BookOpen,
  Users,
  Video,
  FileText,
  Calendar,
  TrendingUp,
  Plus,
  Bell,
  CheckCircle2,
  GraduationCap,
  ArrowUpRight,
} from "lucide-react";

export default function InstructorDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: courses = [] } = useInstructorCourses();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  // Auto-select first course
  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0]);
    }
  }, [courses, selectedCourse]);

  const statsCards = [
    {
      title: "Total Courses",
      value: courses.length.toString(),
      icon: BookOpen,
      color: "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400",
      change: `${courses.filter((c) => c.status === "approved").length} approved`,
      trend: "+2.5%",
    },
    {
      title: "Total Students",
      value: "0",
      icon: Users,
      color:
        "bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400",
      change: "Active enrollments",
      trend: "+0%",
    },
    {
      title: "Content Items",
      value: "0",
      icon: Video,
      color:
        "bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400",
      change: "Videos & Resources",
      trend: "+12%",
    },
    {
      title: "Avg. Completion",
      value: "0%",
      icon: TrendingUp,
      color:
        "bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400",
      change: "Student engagement",
      trend: "+5%",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <InstructorSidebar />
      <SidebarInset className="bg-muted/10">
        <AmbientBackground />
        <InstructorHeader />

        <main className="flex-1 p-6 lg:p-8 max-w-7xl mx-auto w-full space-y-8">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Dashboard
              </h1>
              <p className="text-muted-foreground mt-1 text-sm md:text-base">
                Welcome back, {user?.user_metadata?.full_name || "Instructor"}.
                Here's an overview of your teaching activity.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2 hidden sm:flex">
                <Bell className="h-4 w-4" />
                Updates
              </Button>
              <Button className="gap-2 shadow-sm font-medium">
                <Plus className="h-4 w-4" />
                Create New Course
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid gap-4 md:grid-cols-2 lg:grid-cols-4"
          >
            {statsCards.map((stat) => (
              <motion.div key={stat.title} variants={itemVariants}>
                <Card className="border-border/50 shadow-sm hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex flex-col gap-1">
                        <span className="text-sm font-medium text-muted-foreground">
                          {stat.title}
                        </span>
                        <span className="text-2xl font-bold tracking-tight">
                          {stat.value}
                        </span>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.color}`}>
                        <stat.icon className="h-5 w-5" />
                      </div>
                    </div>
                    <div className="mt-4 flex items-center text-xs">
                      <span className="text-green-500 font-medium flex items-center gap-1 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-md">
                        <ArrowUpRight className="h-3 w-3" />
                        {stat.trend}
                      </span>
                      <span className="text-muted-foreground ml-2">
                        {stat.change}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <div className="grid lg:grid-cols-1 gap-8">
            {/* Main Content Area */}
            <div className="space-y-6">
              {/* Course Management Section Header */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <h2 className="text-xl font-semibold text-foreground">
                    Course Content
                  </h2>
                  <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                    {courses.length} Active
                  </span>
                </div>
                <div className="w-full sm:w-auto min-w-[280px]">
                  <CourseSelector
                    selectedCourse={selectedCourse}
                    onSelectCourse={setSelectedCourse}
                  />
                </div>
              </div>

              {selectedCourse ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="border-border/50 shadow-sm overflow-hidden bg-card/50 backdrop-blur-[2px]">
                    <Tabs defaultValue="topics" className="w-full">
                      <div className="border-b bg-muted/30 px-6 pt-4">
                        <TabsList className="w-full justify-start h-auto p-0 bg-transparent space-x-8">
                          {[
                            {
                              id: "topics",
                              label: "Curriculum",
                              icon: CheckCircle2,
                            },
                            {
                              id: "videos",
                              label: "Video Library",
                              icon: Video,
                            },
                            {
                              id: "resources",
                              label: "Materials",
                              icon: FileText,
                            },
                            {
                              id: "timeline",
                              label: "Schedule",
                              icon: Calendar,
                            },
                            {
                              id: "announcements",
                              label: "Announcements",
                              icon: Bell,
                            },
                          ].map((tab) => (
                            <TabsTrigger
                              key={tab.id}
                              value={tab.id}
                              className="relative h-12 rounded-none border-b-2 border-transparent px-1 pb-4 pt-2 font-medium text-muted-foreground shadow-none transition-none data-[state=active]:border-primary data-[state=active]:text-primary hover:text-foreground focus-visible:ring-0"
                            >
                              <div className="flex items-center gap-2">
                                <tab.icon className="h-4 w-4" />
                                <span>{tab.label}</span>
                              </div>
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </div>

                      <div className="p-6 bg-card min-h-[400px]">
                        <TabsContent
                          value="topics"
                          className="m-0 focus-visible:ring-0 animate-in fade-in-50 duration-300"
                        >
                          <TopicManager courseId={selectedCourse.id} />
                        </TabsContent>
                        <TabsContent
                          value="videos"
                          className="m-0 focus-visible:ring-0 animate-in fade-in-50 duration-300"
                        >
                          <VideoUploader courseId={selectedCourse.id} />
                        </TabsContent>
                        <TabsContent
                          value="resources"
                          className="m-0 focus-visible:ring-0 animate-in fade-in-50 duration-300"
                        >
                          <ResourceUploader courseId={selectedCourse.id} />
                        </TabsContent>
                        <TabsContent
                          value="timeline"
                          className="m-0 focus-visible:ring-0 animate-in fade-in-50 duration-300"
                        >
                          <TimelineManager courseId={selectedCourse.id} />
                        </TabsContent>
                        <TabsContent
                          value="announcements"
                          className="m-0 focus-visible:ring-0 animate-in fade-in-50 duration-300"
                        >
                          <AnnouncementManager courseId={selectedCourse.id} />
                        </TabsContent>
                      </div>
                    </Tabs>
                  </Card>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-24 bg-muted/30 border border-dashed border-muted-foreground/25 rounded-xl text-center"
                >
                  <div className="bg-background p-4 rounded-full shadow-sm mb-4">
                    <GraduationCap className="h-12 w-12 text-primary/80" />
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-2">
                    No Course Selected
                  </h3>
                  <p className="text-muted-foreground mb-8 max-w-sm">
                    Select a course from the dropdown above or create your first
                    course to start managing content.
                  </p>
                  <Button className="gap-2 shadow-sm h-11 px-8">
                    <Plus className="h-4 w-4" />
                    Create First Course
                  </Button>
                </motion.div>
              )}
            </div>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
