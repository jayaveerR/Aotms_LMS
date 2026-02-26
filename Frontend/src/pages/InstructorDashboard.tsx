import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { InstructorSidebar } from "@/components/instructor/InstructorSidebar";
import { InstructorHeader } from "@/components/instructor/InstructorHeader";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CourseSelector } from "@/components/instructor/CourseSelector";
import { TopicManager } from "@/components/instructor/TopicManager";
import { VideoUploader } from "@/components/instructor/VideoUploader";
import { ResourceUploader } from "@/components/instructor/ResourceUploader";
import { TimelineManager } from "@/components/instructor/TimelineManager";
import { AnnouncementManager } from "@/components/instructor/AnnouncementManager";
import { ManagerAttendance } from "@/components/manager/ManagerAttendance";
import { useInstructorCourses, Course } from "@/hooks/useInstructorData";
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
  Upload,
  ClipboardList,
  BarChart3,
  Wrench,
} from "lucide-react";

export default function InstructorDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
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
      bg: "bg-[#0075CF]",
      text: "text-[#0075CF]",
      change: `${courses.filter((c) => c.status === "approved").length} approved`,
      trend: "+2.5%",
    },
    {
      title: "Total Students",
      value: "0",
      icon: Users,
      bg: "bg-[#E9E9E9]",
      text: "text-[#000000]",
      change: "Active enrollments",
      trend: "+0%",
    },
    {
      title: "Content Items",
      value: "0",
      icon: Video,
      bg: "bg-[#FD5A1A]",
      text: "text-[#FD5A1A]",
      change: "Videos & Resources",
      trend: "+12%",
    },
    {
      title: "Avg. Completion",
      value: "0%",
      icon: TrendingUp,
      bg: "bg-[#E9E9E9]",
      text: "text-[#000000]",
      change: "Student engagement",
      trend: "+5%",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#E9E9E9]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-[#0075CF]"></div>
      </div>
    );
  }

  const renderModulePlaceholder = (title: string, icon: any, desc: string) => {
    const Icon = icon;
    return (
      <div className="space-y-6 font-['Inter']">
        <div className="flex items-center gap-4">
          <div className="h-12 w-12 sm:h-16 sm:w-16 rounded bg-[#E9E9E9] border-2 sm:border-4 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] sm:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center">
            <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-[#000000]" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#000000] uppercase tracking-wider">
              {title}
            </h1>
            <p className="text-xs sm:text-sm font-bold text-[#000000]/60 uppercase tracking-widest mt-1">
              {desc}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-lg sm:rounded-xl border-2 sm:border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] overflow-hidden">
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="p-6 bg-[#E9E9E9] border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] rounded-xl mb-6 transform -rotate-3 transition-transform hover:rotate-3">
              <Wrench className="h-16 w-16 text-[#000000]" />
            </div>
            <h3 className="text-2xl font-black text-[#000000] uppercase tracking-wider">
              Coming Soon
            </h3>
            <p className="text-sm font-bold text-[#000000]/60 mt-2 max-w-md uppercase tracking-widest leading-relaxed">
              This module is under development. Stay tuned for updates!
            </p>
          </div>
        </div>
      </div>
    );
  };

  const currentPath = location.pathname;

  return (
    <SidebarProvider>
      <InstructorSidebar />
      <SidebarInset className="bg-[#E9E9E9] font-['Inter']">
        <InstructorHeader />

        <main className="flex-1 p-3 sm:p-4 lg:p-6 xl:p-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">
          {currentPath === "/instructor/courses" &&
            renderModulePlaceholder(
              "My Courses",
              BookOpen,
              "Manage your course catalogue",
            )}
          {currentPath === "/instructor/upload" &&
            renderModulePlaceholder(
              "Upload Content",
              Upload,
              "Upload videos and materials",
            )}
          {currentPath === "/instructor/students" &&
            renderModulePlaceholder(
              "Students",
              Users,
              "Manage enrolled students",
            )}
          {currentPath === "/instructor/assessments" &&
            renderModulePlaceholder(
              "Assessments",
              ClipboardList,
              "Manage quizzes and exams",
            )}
          {currentPath === "/instructor/analytics" &&
            renderModulePlaceholder(
              "Analytics",
              BarChart3,
              "View detailed performance metrics",
            )}

          {currentPath === "/instructor/attendance" && <ManagerAttendance />}

          {(currentPath === "/instructor" ||
            currentPath === "/instructor/") && (
            <>
              {/* Header Section */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-[#000000] uppercase tracking-wider">
                    Dashboard
                  </h1>
                  <p className="text-[#000000]/60 mt-1 text-xs sm:text-sm md:text-base font-bold">
                    Welcome back,{" "}
                    {user?.user_metadata?.full_name || "Instructor"}. Here's an
                    overview of your teaching activity.
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Button className="bg-white text-[#000000] border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-[#E9E9E9] hover:-translate-y-[-2px] hover:-translate-x-[-2px] transition-all font-black uppercase tracking-widest text-xs hidden sm:flex">
                    <Bell className="h-4 w-4 mr-2" /> Updates
                  </Button>
                  <Button className="bg-[#FD5A1A] text-white border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FD5A1A]/90 hover:-translate-y-[-2px] hover:-translate-x-[-2px] transition-all font-black uppercase tracking-widest text-xs">
                    <Plus className="h-4 w-4 mr-2" /> Create New Course
                  </Button>
                </div>
              </div>

              {/* Stats Grid */}
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
              >
                {statsCards.map((stat, i) => (
                  <motion.div
                    key={stat.title}
                    variants={itemVariants}
                    className="bg-white border-4 border-[#000000] rounded-xl p-5 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-[#000000]/50 block mb-1">
                          {stat.title}
                        </span>
                        <span className={`text-4xl font-black ${stat.text}`}>
                          {stat.value}
                        </span>
                      </div>
                      <div
                        className={`w-12 h-12 flex items-center justify-center rounded-xl border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${stat.bg === "bg-[#0075CF]" || stat.bg === "bg-[#FD5A1A]" ? stat.bg + " text-white" : "bg-[#E9E9E9] text-[#000000]"}`}
                      >
                        <stat.icon className="h-6 w-6" />
                      </div>
                    </div>
                    <div className="flex items-center text-xs font-bold justify-between border-t-2 border-[#E9E9E9] pt-3">
                      <span className="text-[#000000]/60">{stat.change}</span>
                      <span className="flex items-center gap-1 bg-[#000000] text-white px-1.5 py-0.5 rounded uppercase tracking-wider text-[10px]">
                        <ArrowUpRight className="h-3 w-3" /> {stat.trend}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Main Content Area */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-xl p-4">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <h2 className="text-xl font-black text-[#000000] uppercase tracking-wider">
                      Course Studio
                    </h2>
                    <span className="px-2 py-1 rounded bg-[#0075CF] text-white text-[10px] font-black uppercase tracking-widest border-2 border-[#000000]">
                      {courses.length} Active
                    </span>
                  </div>
                  <div className="w-full sm:w-80 shrink-0">
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
                    className="bg-white border-4 border-[#000000] shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-xl overflow-hidden"
                  >
                    <Tabs
                      defaultValue="topics"
                      className="w-full flex flex-col md:flex-row min-h-[500px]"
                    >
                      {/* Vertical Tabs Sidebar */}
                      <div className="w-full md:w-64 border-b-4 md:border-b-0 md:border-r-4 border-[#000000] bg-[#E9E9E9] flex shrink-0">
                        <TabsList className="flex flex-row md:flex-col w-full h-auto p-0 bg-transparent overflow-x-auto md:overflow-visible">
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
                              className="w-full flex items-center justify-start gap-3 h-14 px-6 rounded-none border-b-2md:border-b-4 border-transparent md:border-b-[#000000]/10 data-[state=active]:bg-[#000000] data-[state=active]:text-white font-black text-xs uppercase tracking-widest text-[#000000]/60 hover:text-[#000000] data-[state=active]:hover:text-white transition-colors"
                            >
                              <tab.icon className="h-4 w-4 shrink-0" />
                              <span className="whitespace-nowrap">
                                {tab.label}
                              </span>
                            </TabsTrigger>
                          ))}
                        </TabsList>
                      </div>

                      {/* Tab Content Area */}
                      <div className="flex-1 p-6 md:p-8 bg-white min-w-0">
                        <TabsContent
                          value="topics"
                          className="m-0 focus-visible:ring-0"
                        >
                          <TopicManager courseId={selectedCourse.id} />
                        </TabsContent>
                        <TabsContent
                          value="videos"
                          className="m-0 focus-visible:ring-0"
                        >
                          <VideoUploader courseId={selectedCourse.id} />
                        </TabsContent>
                        <TabsContent
                          value="resources"
                          className="m-0 focus-visible:ring-0"
                        >
                          <ResourceUploader courseId={selectedCourse.id} />
                        </TabsContent>
                        <TabsContent
                          value="timeline"
                          className="m-0 focus-visible:ring-0"
                        >
                          <TimelineManager courseId={selectedCourse.id} />
                        </TabsContent>
                        <TabsContent
                          value="announcements"
                          className="m-0 focus-visible:ring-0"
                        >
                          <AnnouncementManager courseId={selectedCourse.id} />
                        </TabsContent>
                      </div>
                    </Tabs>
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-24 bg-white border-4 border-[#000000] border-dashed rounded-xl text-center shadow-[4px_4px_0px_0px_rgba(0,0,0,0.1)]"
                  >
                    <div className="w-20 h-20 bg-[#FD5A1A]/10 border-4 border-[#FD5A1A] rounded-full flex items-center justify-center mb-6">
                      <GraduationCap className="h-10 w-10 text-[#FD5A1A]" />
                    </div>
                    <h3 className="text-2xl font-black text-[#000000] uppercase tracking-wider mb-2">
                      No Course Selected
                    </h3>
                    <p className="text-[#000000]/60 font-bold mb-8 max-w-sm">
                      Select a course from the dropdown above or create your
                      first course to start managing content.
                    </p>
                    <Button className="bg-[#000000] text-white hover:bg-[#0075CF] border-2 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all font-black uppercase tracking-widest px-8 h-12">
                      <Plus className="h-5 w-5 mr-3" />
                      Create First Course
                    </Button>
                  </motion.div>
                )}
              </div>
            </>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
