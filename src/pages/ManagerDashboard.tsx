 import { useState, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
 import { ManagerSidebar } from '@/components/manager/ManagerSidebar';
 import { ManagerHeader } from '@/components/manager/ManagerHeader';
 import { useAuth } from '@/hooks/useAuth';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Progress } from '@/components/ui/progress';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import {
   Calendar,
   FileQuestion,
   Clock,
   Users,
   Trophy,
   UserPlus,
   Shield,
   Eye,
   Settings,
   Plus,
   Search,
   CheckCircle,
   AlertCircle,
   XCircle,
   BarChart3,
   BookOpen,
   ClipboardList,
   Timer,
   Minus,
   RotateCcw,
   Activity,
 } from 'lucide-react';
 
 const statsCards = [
   { title: 'Scheduled Exams', value: '12', icon: Calendar, color: 'text-primary', change: '3 today' },
   { title: 'Question Bank', value: '2,450', icon: FileQuestion, color: 'text-accent', change: '+120 this week' },
   { title: 'Active Students', value: '856', icon: Users, color: 'text-success', change: '92% attendance' },
   { title: 'Guest Accounts', value: '24', icon: UserPlus, color: 'text-primary', change: '8 active' },
 ];
 
 const todayExams = [
   { id: 1, title: 'JavaScript Fundamentals', course: 'Full Stack Development', time: '10:00 AM', duration: 60, students: 45, status: 'scheduled' },
   { id: 2, title: 'React Components Quiz', course: 'React Advanced', time: '2:00 PM', duration: 45, students: 32, status: 'active' },
   { id: 3, title: 'Node.js APIs Test', course: 'Backend Development', time: '4:30 PM', duration: 90, students: 28, status: 'scheduled' },
 ];
 
 const questionBankStats = [
   { topic: 'JavaScript', count: 450, difficulty: { easy: 150, medium: 200, hard: 100 } },
   { topic: 'React', count: 380, difficulty: { easy: 120, medium: 180, hard: 80 } },
   { topic: 'Node.js', count: 320, difficulty: { easy: 100, medium: 150, hard: 70 } },
   { topic: 'TypeScript', count: 280, difficulty: { easy: 90, medium: 130, hard: 60 } },
   { topic: 'Database', count: 420, difficulty: { easy: 140, medium: 180, hard: 100 } },
 ];
 
 const leaderboardTop = [
   { rank: 1, name: 'Alice Johnson', score: 9850, exams: 24, change: 'up' },
   { rank: 2, name: 'Bob Smith', score: 9720, exams: 23, change: 'same' },
   { rank: 3, name: 'Carol Williams', score: 9680, exams: 25, change: 'up' },
   { rank: 4, name: 'David Brown', score: 9540, exams: 22, change: 'down' },
   { rank: 5, name: 'Eva Martinez', score: 9480, exams: 24, change: 'up' },
 ];
 
 const instructorProgress = [
   { name: 'Dr. Smith', course: 'Full Stack Development', topicsCompleted: 18, topicsTotal: 24, lastActive: '2 hours ago' },
   { name: 'Prof. Johnson', course: 'React Advanced', topicsCompleted: 12, topicsTotal: 18, lastActive: '1 day ago' },
   { name: 'Dr. Williams', course: 'Node.js Masterclass', topicsCompleted: 8, topicsTotal: 20, lastActive: '3 hours ago' },
 ];
 
 const guestAccounts = [
   { id: 1, username: 'guest_demo_01', displayName: 'Demo User 1', access: 'demo', expires: '2024-02-15', status: 'active' },
   { id: 2, username: 'guest_view_02', displayName: 'Reviewer', access: 'view_only', expires: '2024-02-20', status: 'active' },
   { id: 3, username: 'guest_limited_03', displayName: 'Trial User', access: 'limited', expires: '2024-02-10', status: 'expired' },
 ];
 
 export default function ManagerDashboard() {
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
       <ManagerSidebar />
       <SidebarInset>
         <ManagerHeader />
         
         <main className="flex-1 p-6 space-y-6">
           {/* Welcome Section */}
           <div className="flex items-center justify-between">
             <div>
               <h1 className="text-2xl font-bold text-foreground">
                 LMS Manager Dashboard 🎯
               </h1>
               <p className="text-muted-foreground mt-1">
                 Manage exams, question banks, and monitor system performance
               </p>
             </div>
             <div className="flex gap-3">
               <Button variant="outline" className="gap-2">
                 <Calendar className="h-4 w-4" />
                 Schedule Exam
               </Button>
               <Button className="gap-2">
                 <Plus className="h-4 w-4" />
                 Add Questions
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
           
           {/* Main Tabs */}
           <Tabs defaultValue="exams" className="space-y-6">
             <TabsList className="grid w-full max-w-2xl grid-cols-5">
               <TabsTrigger value="exams" className="gap-2">
                 <Calendar className="h-4 w-4" />
                 Exams
               </TabsTrigger>
               <TabsTrigger value="questions" className="gap-2">
                 <FileQuestion className="h-4 w-4" />
                 Questions
               </TabsTrigger>
               <TabsTrigger value="leaderboard" className="gap-2">
                 <Trophy className="h-4 w-4" />
                 Leaderboard
               </TabsTrigger>
               <TabsTrigger value="guests" className="gap-2">
                 <UserPlus className="h-4 w-4" />
                 Guests
               </TabsTrigger>
               <TabsTrigger value="monitoring" className="gap-2">
                 <Eye className="h-4 w-4" />
                 Monitoring
               </TabsTrigger>
             </TabsList>
             
             {/* Exams Tab */}
             <TabsContent value="exams" className="space-y-6">
               <div className="grid gap-6 lg:grid-cols-3">
                 {/* Today's Exams */}
                 <Card className="lg:col-span-2">
                   <CardHeader>
                     <div className="flex items-center justify-between">
                       <div>
                         <CardTitle className="flex items-center gap-2">
                           <Calendar className="h-5 w-5 text-primary" />
                           Today's Exams
                         </CardTitle>
                         <CardDescription>Scheduled and active exams</CardDescription>
                       </div>
                       <Button size="sm" className="gap-2">
                         <Plus className="h-4 w-4" />
                         Schedule New
                       </Button>
                     </div>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     {todayExams.map((exam) => (
                       <div
                         key={exam.id}
                         className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                       >
                         <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center">
                           <ClipboardList className="h-5 w-5 text-primary" />
                         </div>
                         <div className="flex-1">
                           <div className="flex items-center gap-2">
                             <h4 className="font-medium">{exam.title}</h4>
                             <Badge variant={exam.status === 'active' ? 'default' : 'secondary'}>
                               {exam.status}
                             </Badge>
                           </div>
                           <p className="text-sm text-muted-foreground">{exam.course}</p>
                         </div>
                         <div className="text-right text-sm">
                           <div className="flex items-center gap-1 text-muted-foreground">
                             <Clock className="h-3 w-3" />
                             {exam.time}
                           </div>
                           <div className="flex items-center gap-1 text-muted-foreground mt-1">
                             <Timer className="h-3 w-3" />
                             {exam.duration} min
                           </div>
                         </div>
                         <div className="text-right">
                           <span className="text-sm font-medium">{exam.students}</span>
                           <p className="text-xs text-muted-foreground">students</p>
                         </div>
                         <Button variant="ghost" size="icon">
                           <Settings className="h-4 w-4" />
                         </Button>
                       </div>
                     ))}
                   </CardContent>
                 </Card>
                 
                 {/* Exam Rules Config */}
                 <Card>
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <Settings className="h-5 w-5 text-accent" />
                       Exam Rules
                     </CardTitle>
                     <CardDescription>Default configuration</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="space-y-2">
                       <Label>Duration (minutes)</Label>
                       <Input type="number" defaultValue={60} />
                     </div>
                     <div className="space-y-2">
                       <Label>Negative Marking</Label>
                       <div className="flex items-center gap-2">
                         <Minus className="h-4 w-4 text-destructive" />
                         <Input type="number" defaultValue={0.25} step={0.25} className="w-20" />
                         <span className="text-sm text-muted-foreground">per wrong answer</span>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <Label>Max Attempts</Label>
                       <div className="flex items-center gap-2">
                         <RotateCcw className="h-4 w-4" />
                         <Input type="number" defaultValue={1} className="w-20" />
                       </div>
                     </div>
                     <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                       <span className="text-sm">Shuffle Questions</span>
                       <Badge variant="default">Enabled</Badge>
                     </div>
                     <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                       <span className="text-sm">Proctoring</span>
                       <Badge variant="secondary">Disabled</Badge>
                     </div>
                     <Button className="w-full">Save Configuration</Button>
                   </CardContent>
                 </Card>
               </div>
             </TabsContent>
             
             {/* Questions Tab */}
             <TabsContent value="questions" className="space-y-6">
               <div className="grid gap-6 lg:grid-cols-3">
                 <Card className="lg:col-span-2">
                   <CardHeader>
                     <div className="flex items-center justify-between">
                       <div>
                         <CardTitle className="flex items-center gap-2">
                           <FileQuestion className="h-5 w-5 text-primary" />
                           Question Bank
                         </CardTitle>
                         <CardDescription>Topic-wise question distribution</CardDescription>
                       </div>
                       <div className="flex gap-2">
                         <div className="relative">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input placeholder="Search questions..." className="pl-10 w-64" />
                         </div>
                         <Button className="gap-2">
                           <Plus className="h-4 w-4" />
                           Add Question
                         </Button>
                       </div>
                     </div>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     {questionBankStats.map((topic) => (
                       <div
                         key={topic.topic}
                         className="p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                       >
                         <div className="flex items-center justify-between mb-3">
                           <h4 className="font-medium">{topic.topic}</h4>
                           <Badge variant="outline">{topic.count} questions</Badge>
                         </div>
                         <div className="flex gap-2">
                           <div className="flex-1">
                             <div className="flex justify-between text-xs mb-1">
                               <span className="text-success">Easy</span>
                               <span>{topic.difficulty.easy}</span>
                             </div>
                             <Progress value={(topic.difficulty.easy / topic.count) * 100} className="h-2 bg-success/20" />
                           </div>
                           <div className="flex-1">
                             <div className="flex justify-between text-xs mb-1">
                               <span className="text-accent">Medium</span>
                               <span>{topic.difficulty.medium}</span>
                             </div>
                             <Progress value={(topic.difficulty.medium / topic.count) * 100} className="h-2 bg-accent/20" />
                           </div>
                           <div className="flex-1">
                             <div className="flex justify-between text-xs mb-1">
                               <span className="text-destructive">Hard</span>
                               <span>{topic.difficulty.hard}</span>
                             </div>
                             <Progress value={(topic.difficulty.hard / topic.count) * 100} className="h-2 bg-destructive/20" />
                           </div>
                         </div>
                       </div>
                     ))}
                   </CardContent>
                 </Card>
                 
                 <Card>
                   <CardHeader>
                     <CardTitle>Quick Add</CardTitle>
                     <CardDescription>Add a new question</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="space-y-2">
                       <Label>Topic</Label>
                       <Input placeholder="e.g., JavaScript" />
                     </div>
                     <div className="space-y-2">
                       <Label>Question Type</Label>
                       <div className="grid grid-cols-2 gap-2">
                         <Button variant="outline" size="sm">MCQ</Button>
                         <Button variant="outline" size="sm">True/False</Button>
                         <Button variant="outline" size="sm">Short</Button>
                         <Button variant="outline" size="sm">Long</Button>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <Label>Difficulty</Label>
                       <div className="flex gap-2">
                         <Button variant="outline" size="sm" className="flex-1 text-success">Easy</Button>
                         <Button variant="outline" size="sm" className="flex-1 text-accent">Medium</Button>
                         <Button variant="outline" size="sm" className="flex-1 text-destructive">Hard</Button>
                       </div>
                     </div>
                     <Button className="w-full">Continue to Editor</Button>
                   </CardContent>
                 </Card>
               </div>
             </TabsContent>
             
             {/* Leaderboard Tab */}
             <TabsContent value="leaderboard" className="space-y-6">
               <div className="grid gap-6 lg:grid-cols-3">
                 <Card className="lg:col-span-2">
                   <CardHeader>
                     <div className="flex items-center justify-between">
                       <div>
                         <CardTitle className="flex items-center gap-2">
                           <Trophy className="h-5 w-5 text-accent" />
                           Leaderboard Management
                         </CardTitle>
                         <CardDescription>Monitor and validate student rankings</CardDescription>
                       </div>
                       <Button variant="outline" className="gap-2">
                         <Activity className="h-4 w-4" />
                         View Audit Log
                       </Button>
                     </div>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     {leaderboardTop.map((student) => (
                       <div
                         key={student.rank}
                         className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                       >
                         <div className={`h-10 w-10 rounded-full flex items-center justify-center font-bold ${
                           student.rank === 1 ? 'bg-accent text-accent-foreground' :
                           student.rank === 2 ? 'bg-muted-foreground/20' :
                           student.rank === 3 ? 'bg-primary/20 text-primary' :
                           'bg-muted'
                         }`}>
                           {student.rank}
                         </div>
                         <div className="flex-1">
                           <h4 className="font-medium">{student.name}</h4>
                           <p className="text-sm text-muted-foreground">{student.exams} exams completed</p>
                         </div>
                         <div className="flex items-center gap-2">
                           {student.change === 'up' && <CheckCircle className="h-4 w-4 text-success" />}
                           {student.change === 'down' && <XCircle className="h-4 w-4 text-destructive" />}
                           {student.change === 'same' && <AlertCircle className="h-4 w-4 text-muted-foreground" />}
                         </div>
                         <div className="text-right">
                           <span className="text-lg font-bold">{student.score.toLocaleString()}</span>
                           <p className="text-xs text-muted-foreground">points</p>
                         </div>
                         <div className="flex gap-1">
                           <Button variant="ghost" size="icon" title="Validate">
                             <CheckCircle className="h-4 w-4 text-success" />
                           </Button>
                           <Button variant="ghost" size="icon" title="Flag">
                             <AlertCircle className="h-4 w-4 text-accent" />
                           </Button>
                         </div>
                       </div>
                     ))}
                   </CardContent>
                 </Card>
                 
                 <Card>
                   <CardHeader>
                     <CardTitle>Validation Actions</CardTitle>
                     <CardDescription>Quick actions for leaderboard</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-3">
                     <Button variant="outline" className="w-full justify-start gap-3">
                       <CheckCircle className="h-4 w-4 text-success" />
                       Validate All Scores
                     </Button>
                     <Button variant="outline" className="w-full justify-start gap-3">
                       <AlertCircle className="h-4 w-4 text-accent" />
                       Review Flagged
                     </Button>
                     <Button variant="outline" className="w-full justify-start gap-3">
                       <RotateCcw className="h-4 w-4" />
                       Recalculate Rankings
                     </Button>
                     <Button variant="outline" className="w-full justify-start gap-3">
                       <BarChart3 className="h-4 w-4 text-primary" />
                       Export Report
                     </Button>
                   </CardContent>
                 </Card>
               </div>
             </TabsContent>
             
             {/* Guests Tab */}
             <TabsContent value="guests" className="space-y-6">
               <div className="grid gap-6 lg:grid-cols-3">
                 <Card className="lg:col-span-2">
                   <CardHeader>
                     <div className="flex items-center justify-between">
                       <div>
                         <CardTitle className="flex items-center gap-2">
                           <UserPlus className="h-5 w-5 text-primary" />
                           Guest Credentials
                         </CardTitle>
                         <CardDescription>Manage guest access accounts</CardDescription>
                       </div>
                       <Button className="gap-2">
                         <Plus className="h-4 w-4" />
                         Create Guest
                       </Button>
                     </div>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     {guestAccounts.map((guest) => (
                       <div
                         key={guest.id}
                         className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                       >
                         <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                           <Users className="h-5 w-5 text-primary" />
                         </div>
                         <div className="flex-1">
                           <div className="flex items-center gap-2">
                             <h4 className="font-medium">{guest.displayName}</h4>
                             <Badge variant={guest.status === 'active' ? 'default' : 'destructive'}>
                               {guest.status}
                             </Badge>
                           </div>
                           <p className="text-sm text-muted-foreground">{guest.username}</p>
                         </div>
                         <div className="text-right">
                           <Badge variant="outline">{guest.access}</Badge>
                           <p className="text-xs text-muted-foreground mt-1">
                             Expires: {guest.expires}
                           </p>
                         </div>
                         <div className="flex gap-1">
                           <Button variant="ghost" size="icon">
                             <Settings className="h-4 w-4" />
                           </Button>
                           <Button variant="ghost" size="icon">
                             <Shield className="h-4 w-4" />
                           </Button>
                         </div>
                       </div>
                     ))}
                   </CardContent>
                 </Card>
                 
                 <Card>
                   <CardHeader>
                     <CardTitle>Create Guest Account</CardTitle>
                     <CardDescription>Quick guest setup</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="space-y-2">
                       <Label>Display Name</Label>
                       <Input placeholder="Guest User" />
                     </div>
                     <div className="space-y-2">
                       <Label>Access Level</Label>
                       <div className="grid grid-cols-3 gap-2">
                         <Button variant="outline" size="sm">Limited</Button>
                         <Button variant="outline" size="sm">View Only</Button>
                         <Button variant="outline" size="sm">Demo</Button>
                       </div>
                     </div>
                     <div className="space-y-2">
                       <Label>Expires In</Label>
                       <div className="grid grid-cols-3 gap-2">
                         <Button variant="outline" size="sm">7 days</Button>
                         <Button variant="outline" size="sm">30 days</Button>
                         <Button variant="outline" size="sm">90 days</Button>
                       </div>
                     </div>
                     <Button className="w-full">Generate Credentials</Button>
                   </CardContent>
                 </Card>
               </div>
             </TabsContent>
             
             {/* Monitoring Tab */}
             <TabsContent value="monitoring" className="space-y-6">
               <div className="grid gap-6 lg:grid-cols-3">
                 <Card className="lg:col-span-2">
                   <CardHeader>
                     <div className="flex items-center justify-between">
                       <div>
                         <CardTitle className="flex items-center gap-2">
                           <BookOpen className="h-5 w-5 text-primary" />
                           Instructor Progress
                         </CardTitle>
                         <CardDescription>Track instructor activity and course completion</CardDescription>
                       </div>
                       <Button variant="outline" size="sm">
                         Export Report
                       </Button>
                     </div>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     {instructorProgress.map((instructor, idx) => (
                       <div
                         key={idx}
                         className="p-4 rounded-lg bg-muted/50"
                       >
                         <div className="flex items-center justify-between mb-3">
                           <div>
                             <h4 className="font-medium">{instructor.name}</h4>
                             <p className="text-sm text-muted-foreground">{instructor.course}</p>
                           </div>
                           <span className="text-xs text-muted-foreground">
                             Last active: {instructor.lastActive}
                           </span>
                         </div>
                         <div className="space-y-2">
                           <div className="flex justify-between text-sm">
                             <span>Topics Completed</span>
                             <span className="font-medium">
                               {instructor.topicsCompleted}/{instructor.topicsTotal}
                             </span>
                           </div>
                           <Progress 
                             value={(instructor.topicsCompleted / instructor.topicsTotal) * 100} 
                             className="h-2" 
                           />
                         </div>
                       </div>
                     ))}
                   </CardContent>
                 </Card>
                 
                 <Card>
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <Activity className="h-5 w-5 text-accent" />
                       System Health
                     </CardTitle>
                     <CardDescription>Platform metrics</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="p-4 rounded-lg bg-muted/50">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-sm">Active Sessions</span>
                         <span className="font-bold text-success">142</span>
                       </div>
                       <Progress value={71} className="h-2" />
                     </div>
                     <div className="p-4 rounded-lg bg-muted/50">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-sm">Exams in Progress</span>
                         <span className="font-bold text-accent">8</span>
                       </div>
                       <Progress value={40} className="h-2" />
                     </div>
                     <div className="p-4 rounded-lg bg-muted/50">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-sm">Server Load</span>
                         <span className="font-bold">45%</span>
                       </div>
                       <Progress value={45} className="h-2" />
                     </div>
                     <div className="p-4 rounded-lg bg-muted/50">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-sm">Storage Used</span>
                         <span className="font-bold">62%</span>
                       </div>
                       <Progress value={62} className="h-2" />
                     </div>
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