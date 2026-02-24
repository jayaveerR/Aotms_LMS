import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  useCourses,
  useInstructorProgress,
  useCourseTopics,
  useProfiles,
} from "@/hooks/useManagerData";
import {
  BookOpen,
  Users,
  CheckCircle2,
  Clock,
  Search,
  Video,
  FileText,
  MonitorPlay,
  TrendingUp,
  AlertCircle,
  Activity,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export function CourseMonitoring() {
  const { data: courses = [], isLoading: coursesLoading } = useCourses();
  const { data: instructorProgress = [], isLoading: progressLoading } =
    useInstructorProgress();
  const { data: topics = [], isLoading: topicsLoading } = useCourseTopics();
  const { data: profiles = [] } = useProfiles();
  const [searchTerm, setSearchTerm] = useState("");

  const isLoading = coursesLoading || progressLoading || topicsLoading;

  // Helper: get instructor name from profiles
  const getInstructorName = (instructorId: string) => {
    const profile = profiles.find(
      (p: { user_id: string; full_name: string }) => p.user_id === instructorId,
    );
    return profile?.full_name || `Instructor #${instructorId.slice(0, 6)}`;
  };

  // Get course name
  const getCourseName = (courseId: string) => {
    const course = courses.find((c) => c.id === courseId);
    return course?.title || "Unknown Course";
  };

  // Filter courses
  const filteredCourses = courses.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.description?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  // Aggregate topic stats per course
  const courseTopicStats = courses.map((course) => {
    const courseTopics = topics.filter((t) => t.course_id === course.id);
    const completed = courseTopics.filter((t) => t.is_completed).length;
    return {
      courseId: course.id,
      title: course.title,
      totalTopics: courseTopics.length,
      completedTopics: completed,
      percentage:
        courseTopics.length > 0
          ? Math.round((completed / courseTopics.length) * 100)
          : 0,
    };
  });

  // Summary stats
  const publishedCourses = courses.filter((c) => c.is_published).length;
  const totalTopics = topics.length;
  const completedTopics = topics.filter((t) => t.is_completed).length;
  const avgProgress =
    instructorProgress.length > 0
      ? Math.round(
          instructorProgress.reduce((acc, p) => {
            const pct =
              p.total_topics > 0
                ? (p.topics_completed / p.total_topics) * 100
                : 0;
            return acc + pct;
          }, 0) / instructorProgress.length,
        )
      : 0;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        Loading course monitoring data...
      </div>
    );
  }

  return (
    <div className="space-y-6 font-['Inter']">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl sm:text-3xl font-black text-[#000000] uppercase tracking-wider">
            Course Monitoring
          </h2>
          <p className="text-xs sm:text-sm font-bold text-[#000000]/60 uppercase tracking-widest">
            Track instructor progress & topic completion across courses
          </p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000]" />
          <Input
            placeholder="Search courses..."
            className="pl-10 w-full sm:w-64 bg-[#E9E9E9] border-2 border-[#000000] text-[#000000] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:bg-white transition-all placeholder:text-[#000000]/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Total Courses
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#000000]">
              {courses.length}
            </div>
            <p className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">
              {publishedCourses} published
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Total Topics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#000000]">
              {totalTopics}
            </div>
            <p className="text-xs font-bold text-[#0075CF] uppercase tracking-widest">
              {completedTopics} completed
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Avg. Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#000000]">
              {avgProgress}%
            </div>
            <Progress
              value={avgProgress}
              className="h-2 mt-1 border-2 border-[#000000] rounded-none"
            />
          </CardContent>
        </Card>
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Active Instructors
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#000000]">
              {instructorProgress.length}
            </div>
            <p className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">
              with progress data
            </p>
          </CardContent>
        </Card>
        <Card className="bg-[#E9E9E9] rounded-none border-4 border-[#000000] shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
          <CardHeader className="pb-2">
            <CardTitle className="text-[10px] font-black text-[#000000]/60 uppercase tracking-widest">
              Completion Rate
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-black text-[#000000]">
              {totalTopics > 0
                ? Math.round((completedTopics / totalTopics) * 100)
                : 0}
              %
            </div>
            <p className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">
              overall topics
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="courses" className="space-y-4">
        <TabsList className="bg-[#E9E9E9] border-2 border-[#000000] p-1 h-auto flex gap-1">
          <TabsTrigger
            value="courses"
            className="gap-2 font-black uppercase tracking-widest text-xs data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-[#000000] data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none"
          >
            <BookOpen className="h-4 w-4" />
            Course Progress
          </TabsTrigger>
          <TabsTrigger
            value="instructors"
            className="gap-2 font-black uppercase tracking-widest text-xs data-[state=active]:bg-white data-[state=active]:border-2 data-[state=active]:border-[#000000] data-[state=active]:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-none"
          >
            <Users className="h-4 w-4" />
            Instructor Activity
          </TabsTrigger>
        </TabsList>

        {/* Course Progress Tab */}
        <TabsContent value="courses">
          <Card className="bg-white rounded-none border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-black text-[#000000] uppercase tracking-wider">
                <BookOpen className="h-6 w-6 text-[#0075CF]" />
                Course Topic Completion
              </CardTitle>
              <CardDescription className="font-bold text-[#000000]/60 uppercase tracking-widest text-xs">
                Track topic completion across all courses
              </CardDescription>
            </CardHeader>
            <CardContent>
              {filteredCourses.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No courses found</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredCourses.map((course) => {
                    const stats = courseTopicStats.find(
                      (s) => s.courseId === course.id,
                    );
                    const courseTopicList = topics.filter(
                      (t) => t.course_id === course.id,
                    );

                    return (
                      <div
                        key={course.id}
                        className="p-4 rounded-none border-4 border-[#000000] bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 border-2 border-[#000000] bg-[#E9E9E9] flex items-center justify-center">
                              <BookOpen className="h-5 w-5 text-[#000000]" />
                            </div>
                            <div>
                              <h4 className="font-black text-[#000000] uppercase tracking-wider text-sm">
                                {course.title}
                              </h4>
                              <p className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">
                                by {getInstructorName(course.instructor_id)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <Badge
                              className={cn(
                                "rounded-none border-2 border-[#000000] font-black uppercase tracking-widest",
                                course.is_published
                                  ? "bg-[#0075CF] text-white"
                                  : "bg-[#E9E9E9] text-[#000000]",
                              )}
                            >
                              {course.is_published ? "Published" : "Draft"}
                            </Badge>
                            <div className="text-right">
                              <div className="text-sm font-black">
                                {stats?.completedTopics || 0}/
                                {stats?.totalTopics || 0}
                              </div>
                              <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                                topics
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                            <span className="text-[#000000]/60">
                              Completion
                            </span>
                            <span className="text-[#000000]">
                              {stats?.percentage || 0}%
                            </span>
                          </div>
                          <Progress
                            value={stats?.percentage || 0}
                            className="h-3 border-2 border-[#000000] rounded-none"
                          />
                        </div>

                        {/* Topic list */}
                        {courseTopicList.length > 0 && (
                          <div className="mt-3 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                            {courseTopicList.slice(0, 8).map((topic) => (
                              <div
                                key={topic.id}
                                className={`flex items-center gap-2 p-2 rounded text-xs ${
                                  topic.is_completed
                                    ? "bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400"
                                    : "bg-muted/50 text-muted-foreground"
                                }`}
                              >
                                {topic.is_completed ? (
                                  <CheckCircle2 className="h-3 w-3 flex-shrink-0" />
                                ) : (
                                  <Clock className="h-3 w-3 flex-shrink-0" />
                                )}
                                <span className="truncate">{topic.title}</span>
                              </div>
                            ))}
                            {courseTopicList.length > 8 && (
                              <div className="flex items-center justify-center p-2 rounded text-xs bg-muted/50 text-muted-foreground">
                                +{courseTopicList.length - 8} more
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Instructor Activity Tab */}
        <TabsContent value="instructors">
          <Card className="bg-white rounded-none border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] mt-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl font-black text-[#000000] uppercase tracking-wider">
                <Activity className="h-6 w-6 text-[#FD5A1A]" />
                Instructor Activity
              </CardTitle>
              <CardDescription className="font-bold text-[#000000]/60 uppercase tracking-widest text-xs">
                Monitor instructor progress by course
              </CardDescription>
            </CardHeader>
            <CardContent>
              {instructorProgress.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No instructor progress data available</p>
                  <p className="text-sm">
                    Progress will appear here as instructors work on courses
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {instructorProgress.map((progress) => {
                    const progressPct =
                      progress.total_topics > 0
                        ? Math.round(
                            (progress.topics_completed /
                              progress.total_topics) *
                              100,
                          )
                        : 0;
                    const isActive =
                      new Date(progress.last_activity_at) >
                      new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

                    return (
                      <div
                        key={progress.id}
                        className="p-4 rounded-none border-4 border-[#000000] bg-white shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                      >
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-10 w-10 border-2 border-[#000000] flex items-center justify-center ${
                                isActive ? "bg-[#6BCB77]" : "bg-[#E9E9E9]"
                              }`}
                            >
                              <Users
                                className={`h-5 w-5 ${isActive ? "text-white" : "text-[#000000]"}`}
                              />
                            </div>
                            <div>
                              <h4 className="font-black text-[#000000] uppercase tracking-wider text-sm">
                                {getInstructorName(progress.instructor_id)}
                              </h4>
                              <p className="text-xs font-bold text-[#000000]/60 uppercase tracking-widest">
                                {getCourseName(progress.course_id)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {isActive ? (
                              <Badge className="bg-[#6BCB77] gap-1 rounded-none border-2 border-[#000000] font-black uppercase tracking-widest text-white">
                                <Activity className="h-3 w-3" /> Active
                              </Badge>
                            ) : (
                              <Badge className="bg-[#E9E9E9] text-[#000000] gap-1 rounded-none border-2 border-[#000000] font-black uppercase tracking-widest">
                                <AlertCircle className="h-3 w-3" /> Inactive
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 border-y-2 border-[#000000] py-3 my-3">
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="h-4 w-4 text-[#6BCB77]" />
                            <div>
                              <p className="text-sm font-black text-[#000000]">
                                {progress.topics_completed}/
                                {progress.total_topics}
                              </p>
                              <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                                Topics
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Video className="h-4 w-4 text-[#0075CF]" />
                            <div>
                              <p className="text-sm font-black text-[#000000]">
                                {progress.videos_uploaded}
                              </p>
                              <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                                Videos
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <FileText className="h-4 w-4 text-[#FD5A1A]" />
                            <div>
                              <p className="text-sm font-black text-[#000000]">
                                {progress.resources_uploaded}
                              </p>
                              <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                                Resources
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <MonitorPlay className="h-4 w-4 text-[#FFD166]" />
                            <div>
                              <p className="text-sm font-black text-[#000000]">
                                {progress.live_classes_conducted}
                              </p>
                              <p className="text-[10px] font-bold text-[#000000]/60 uppercase tracking-widest">
                                Live Classes
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-widest mb-1">
                            <span className="text-[#000000]/60">
                              Topic Completion
                            </span>
                            <span className="text-[#000000]">
                              {progressPct}%
                            </span>
                          </div>
                          <Progress
                            value={progressPct}
                            className={`h-3 border-2 border-[#000000] rounded-none ${progressPct >= 80 ? "[&>div]:bg-green-500" : progressPct >= 50 ? "[&>div]:bg-yellow-500" : "[&>div]:bg-red-500"}`}
                          />
                        </div>

                        {progress.notes && (
                          <p className="mt-2 text-xs text-muted-foreground italic">
                            📝 {progress.notes}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-muted-foreground">
                          Last active:{" "}
                          {new Date(
                            progress.last_activity_at,
                          ).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
