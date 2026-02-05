import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { InstructorSidebar } from '@/components/instructor/InstructorSidebar';
import { InstructorHeader } from '@/components/instructor/InstructorHeader';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { CourseSelector } from '@/components/instructor/CourseSelector';
import { TopicManager } from '@/components/instructor/TopicManager';
import { VideoUploader } from '@/components/instructor/VideoUploader';
import { ResourceUploader } from '@/components/instructor/ResourceUploader';
import { TimelineManager } from '@/components/instructor/TimelineManager';
import { AnnouncementManager } from '@/components/instructor/AnnouncementManager';
import { useInstructorCourses, Course } from '@/hooks/useInstructorData';
import {
  BookOpen,
  Users,
  Video,
  FileText,
  Calendar,
  TrendingUp,
  Plus,
  Upload,
  BarChart3,
  GraduationCap,
  CheckCircle2,
  Bell,
  Clock,
  Award,
} from 'lucide-react';

export default function InstructorDashboard() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { data: courses = [] } = useInstructorCourses();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
    }
  }, [user, loading, navigate]);

  // Auto-select first course
  useEffect(() => {
    if (courses.length > 0 && !selectedCourse) {
      setSelectedCourse(courses[0]);
    }
  }, [courses, selectedCourse]);

  const statsCards = [
    { title: 'Total Courses', value: courses.length.toString(), icon: BookOpen, color: 'text-primary', change: `${courses.filter(c => c.status === 'approved').length} approved` },
    { title: 'Total Students', value: '0', icon: Users, color: 'text-accent', change: 'Enrollment data' },
    { title: 'Videos Uploaded', value: '0', icon: Video, color: 'text-green-500', change: 'Across all courses' },
    { title: 'Avg. Completion', value: '0%', icon: TrendingUp, color: 'text-purple-500', change: 'Topic progress' },
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
      <InstructorSidebar />
      <SidebarInset>
        <InstructorHeader />
        
        <main className="flex-1 p-6 space-y-6">
          {/* Welcome Section */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Welcome, {user?.user_metadata?.full_name || 'Instructor'}! 👨‍🏫
              </h1>
              <p className="text-muted-foreground mt-1">
                Manage your courses and track student progress
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="gap-2">
                <Bell className="h-4 w-4" />
                Announcements
              </Button>
              <Button className="gap-2">
                <Plus className="h-4 w-4" />
                New Course
              </Button>
            </div>
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
                  <p className="text-xs text-muted-foreground mt-1">{stat.change}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Course Selector */}
          <Card>
            <CardHeader className="pb-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Course Management</CardTitle>
                  <CardDescription>Select a course to manage its content</CardDescription>
                </div>
                <CourseSelector
                  selectedCourse={selectedCourse}
                  onSelectCourse={setSelectedCourse}
                />
              </div>
            </CardHeader>
          </Card>
          
          {/* Course Content Tabs */}
          {selectedCourse ? (
            <Tabs defaultValue="topics" className="space-y-6">
              <TabsList className="grid w-full max-w-2xl grid-cols-5">
                <TabsTrigger value="topics" className="gap-2">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="hidden sm:inline">Topics</span>
                </TabsTrigger>
                <TabsTrigger value="videos" className="gap-2">
                  <Video className="h-4 w-4" />
                  <span className="hidden sm:inline">Videos</span>
                </TabsTrigger>
                <TabsTrigger value="resources" className="gap-2">
                  <FileText className="h-4 w-4" />
                  <span className="hidden sm:inline">Resources</span>
                </TabsTrigger>
                <TabsTrigger value="timeline" className="gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Timeline</span>
                </TabsTrigger>
                <TabsTrigger value="announcements" className="gap-2">
                  <Bell className="h-4 w-4" />
                  <span className="hidden sm:inline">Announce</span>
                </TabsTrigger>
              </TabsList>
              
              {/* Topics Tab */}
              <TabsContent value="topics">
                <TopicManager courseId={selectedCourse.id} />
              </TabsContent>
              
              {/* Videos Tab */}
              <TabsContent value="videos">
                <VideoUploader courseId={selectedCourse.id} />
              </TabsContent>
              
              {/* Resources Tab */}
              <TabsContent value="resources">
                <ResourceUploader courseId={selectedCourse.id} />
              </TabsContent>
              
              {/* Timeline Tab */}
              <TabsContent value="timeline">
                <TimelineManager courseId={selectedCourse.id} />
              </TabsContent>
              
              {/* Announcements Tab */}
              <TabsContent value="announcements">
                <AnnouncementManager courseId={selectedCourse.id} />
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <GraduationCap className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-medium mb-2">No Courses Yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first course to start adding content.
                </p>
                <Button className="gap-2">
                  <Plus className="h-4 w-4" />
                  Create Your First Course
                </Button>
              </CardContent>
            </Card>
          )}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
