 import { useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
 import { DashboardSidebar } from '@/components/dashboard/DashboardSidebar';
 import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
 import { useAuth } from '@/hooks/useAuth';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Progress } from '@/components/ui/progress';
 import { Badge } from '@/components/ui/badge';
 import {
   BookOpen,
   Trophy,
   Clock,
   TrendingUp,
   Play,
   Calendar,
   FileText,
   Award,
 } from 'lucide-react';
 
 const statsCards = [
   { title: 'Enrolled Courses', value: '4', icon: BookOpen, color: 'text-primary' },
   { title: 'Exams Completed', value: '12', icon: Trophy, color: 'text-accent' },
   { title: 'Hours Learned', value: '48', icon: Clock, color: 'text-green-500' },
   { title: 'ATS Score', value: '78%', icon: TrendingUp, color: 'text-purple-500' },
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
 
 export default function Dashboard() {
   const { user, loading } = useAuth();
   const navigate = useNavigate();
 
   useEffect(() => {
     if (!loading && !user) {
       navigate('/auth');
     }
   }, [user, loading, navigate]);
 
   if (loading) {
     return (
       <div className="min-h-screen flex items-center justify-center">
         <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
       </div>
     );
   }
 
   return (
     <SidebarProvider>
       <DashboardSidebar />
       <SidebarInset>
         <DashboardHeader />
         
         <main className="flex-1 p-6 space-y-6">
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
                <div className="h-12 w-12 rounded-full bg-success/10 flex items-center justify-center mb-3 group-hover:bg-success/20 transition-colors">
                  <Trophy className="h-6 w-6 text-success" />
                 </div>
                 <h4 className="font-medium">Leaderboard</h4>
                 <p className="text-xs text-muted-foreground mt-1">See rankings</p>
               </CardContent>
             </Card>
             
            <Card className="hover-lift cursor-pointer group">
              <CardContent className="flex flex-col items-center justify-center p-6 text-center">
                <div className="h-12 w-12 rounded-full bg-secondary/10 flex items-center justify-center mb-3 group-hover:bg-secondary/20 transition-colors">
                  <TrendingUp className="h-6 w-6 text-secondary" />
                 </div>
                 <h4 className="font-medium">ATS Resume</h4>
                 <p className="text-xs text-muted-foreground mt-1">Check your score</p>
               </CardContent>
             </Card>
           </div>
         </main>
       </SidebarInset>
     </SidebarProvider>
   );
 }