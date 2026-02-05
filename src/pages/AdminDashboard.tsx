 import { useState, useEffect } from 'react';
 import { useNavigate } from 'react-router-dom';
 import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
 import { AdminSidebar } from '@/components/admin/AdminSidebar';
 import { AdminHeader } from '@/components/admin/AdminHeader';
 import { useAuth } from '@/hooks/useAuth';
 import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
 import { Button } from '@/components/ui/button';
 import { Badge } from '@/components/ui/badge';
 import { Progress } from '@/components/ui/progress';
 import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
 import { Input } from '@/components/ui/input';
 import { Label } from '@/components/ui/label';
 import { Switch } from '@/components/ui/switch';
 import {
   Users,
   Shield,
   BookOpen,
   BarChart3,
   Settings,
   AlertTriangle,
   CheckCircle,
   XCircle,
   Search,
   Plus,
   Eye,
   Edit,
   Trash2,
   Lock,
   Unlock,
   Activity,
   FileText,
   Clock,
   TrendingUp,
   Server,
   Database,
   Globe,
   UserCog,
   ShieldCheck,
   ShieldAlert,
   RefreshCw,
 } from 'lucide-react';
 
 const statsCards = [
   { title: 'Total Users', value: '1,248', icon: Users, color: 'text-primary', change: '+48 this week' },
   { title: 'Active Courses', value: '32', icon: BookOpen, color: 'text-accent', change: '6 pending approval' },
   { title: 'Security Events', value: '12', icon: ShieldAlert, color: 'text-destructive', change: '3 high priority' },
   { title: 'System Health', value: '98%', icon: Server, color: 'text-success', change: 'All systems normal' },
 ];
 
 const allUsers = [
   { id: 1, name: 'Alice Johnson', email: 'alice@example.com', role: 'student', status: 'active', lastActive: '2 min ago' },
   { id: 2, name: 'Dr. Smith', email: 'smith@example.com', role: 'instructor', status: 'active', lastActive: '1 hour ago' },
   { id: 3, name: 'Bob Manager', email: 'bob@example.com', role: 'manager', status: 'active', lastActive: '30 min ago' },
   { id: 4, name: 'Carol Williams', email: 'carol@example.com', role: 'student', status: 'suspended', lastActive: '2 days ago' },
   { id: 5, name: 'David Brown', email: 'david@example.com', role: 'student', status: 'active', lastActive: '5 min ago' },
 ];
 
 const pendingCourses = [
   { id: 1, title: 'Advanced Machine Learning', instructor: 'Dr. Smith', submitted: '2 days ago', status: 'pending' },
   { id: 2, title: 'Blockchain Fundamentals', instructor: 'Prof. Johnson', submitted: '5 days ago', status: 'pending' },
   { id: 3, title: 'DevOps Masterclass', instructor: 'Dr. Williams', submitted: '1 week ago', status: 'pending' },
 ];
 
 const securityEvents = [
   { id: 1, type: 'login_failure', user: 'unknown@test.com', ip: '192.168.1.100', time: '5 min ago', risk: 'high' },
   { id: 2, type: 'suspicious_activity', user: 'student42@example.com', ip: '10.0.0.55', time: '1 hour ago', risk: 'medium' },
   { id: 3, type: 'permission_denied', user: 'guest_demo@example.com', ip: '172.16.0.22', time: '2 hours ago', risk: 'low' },
   { id: 4, type: 'password_change', user: 'alice@example.com', ip: '192.168.1.50', time: '3 hours ago', risk: 'low' },
 ];
 
 const systemLogs = [
   { id: 1, type: 'info', module: 'Auth', action: 'User login successful', time: '2 min ago' },
   { id: 2, type: 'warning', module: 'Exam', action: 'Exam timeout extended', time: '15 min ago' },
   { id: 3, type: 'error', module: 'Storage', action: 'Upload failed - quota exceeded', time: '1 hour ago' },
   { id: 4, type: 'audit', module: 'Admin', action: 'Role changed for user #245', time: '2 hours ago' },
   { id: 5, type: 'system', module: 'Backup', action: 'Daily backup completed', time: '6 hours ago' },
 ];
 
 const platformMetrics = [
   { label: 'CPU Usage', value: 32, max: 100 },
   { label: 'Memory', value: 68, max: 100 },
   { label: 'Storage', value: 45, max: 100 },
   { label: 'Bandwidth', value: 23, max: 100 },
 ];
 
 export default function AdminDashboard() {
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
       <AdminSidebar />
       <SidebarInset>
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
               <Button variant="outline" className="gap-2">
                 <RefreshCw className="h-4 w-4" />
                 Refresh
               </Button>
               <Button className="gap-2">
                 <Settings className="h-4 w-4" />
                 Settings
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
           <Tabs defaultValue="users" className="space-y-6">
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
               <div className="grid gap-6 lg:grid-cols-3">
                 <Card className="lg:col-span-2">
                   <CardHeader>
                     <div className="flex items-center justify-between">
                       <div>
                         <CardTitle className="flex items-center gap-2">
                           <Users className="h-5 w-5 text-primary" />
                           User Management
                         </CardTitle>
                         <CardDescription>Manage all platform users</CardDescription>
                       </div>
                       <div className="flex gap-2">
                         <div className="relative">
                           <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                           <Input placeholder="Search users..." className="pl-10 w-48" />
                         </div>
                         <Button className="gap-2">
                           <Plus className="h-4 w-4" />
                           Add User
                         </Button>
                       </div>
                     </div>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     {allUsers.map((u) => (
                       <div
                         key={u.id}
                         className="flex items-center gap-4 p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                       >
                         <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                           <Users className="h-5 w-5 text-primary" />
                         </div>
                         <div className="flex-1">
                           <div className="flex items-center gap-2">
                             <h4 className="font-medium">{u.name}</h4>
                             <Badge variant={
                               u.role === 'admin' ? 'default' :
                               u.role === 'manager' ? 'secondary' :
                               u.role === 'instructor' ? 'outline' : 'secondary'
                             }>
                               {u.role}
                             </Badge>
                             {u.status === 'suspended' && (
                               <Badge variant="destructive">suspended</Badge>
                             )}
                           </div>
                           <p className="text-sm text-muted-foreground">{u.email}</p>
                         </div>
                         <div className="text-right text-sm text-muted-foreground">
                           <Clock className="h-3 w-3 inline mr-1" />
                           {u.lastActive}
                         </div>
                         <div className="flex gap-1">
                           <Button variant="ghost" size="icon" title="Edit">
                             <Edit className="h-4 w-4" />
                           </Button>
                           <Button variant="ghost" size="icon" title="Change Role">
                             <UserCog className="h-4 w-4" />
                           </Button>
                           {u.status === 'active' ? (
                             <Button variant="ghost" size="icon" title="Suspend">
                               <Lock className="h-4 w-4 text-destructive" />
                             </Button>
                           ) : (
                             <Button variant="ghost" size="icon" title="Unsuspend">
                               <Unlock className="h-4 w-4 text-success" />
                             </Button>
                           )}
                         </div>
                       </div>
                     ))}
                   </CardContent>
                 </Card>
                 
                 <Card>
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <UserCog className="h-5 w-5 text-accent" />
                       Role Management
                     </CardTitle>
                     <CardDescription>Assign roles to users</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="p-4 rounded-lg bg-muted/50">
                       <div className="flex justify-between items-center">
                         <span className="font-medium">Students</span>
                         <Badge>1,180</Badge>
                       </div>
                     </div>
                     <div className="p-4 rounded-lg bg-muted/50">
                       <div className="flex justify-between items-center">
                         <span className="font-medium">Instructors</span>
                         <Badge>42</Badge>
                       </div>
                     </div>
                     <div className="p-4 rounded-lg bg-muted/50">
                       <div className="flex justify-between items-center">
                         <span className="font-medium">Managers</span>
                         <Badge>18</Badge>
                       </div>
                     </div>
                     <div className="p-4 rounded-lg bg-primary/10">
                       <div className="flex justify-between items-center">
                         <span className="font-medium text-primary">Admins</span>
                         <Badge variant="default">8</Badge>
                       </div>
                     </div>
                     <Button variant="outline" className="w-full">
                       Manage Permissions
                     </Button>
                   </CardContent>
                 </Card>
               </div>
             </TabsContent>
             
             {/* Courses Tab */}
             <TabsContent value="courses" className="space-y-6">
               <div className="grid gap-6 lg:grid-cols-3">
                 <Card className="lg:col-span-2">
                   <CardHeader>
                     <div className="flex items-center justify-between">
                       <div>
                         <CardTitle className="flex items-center gap-2">
                           <BookOpen className="h-5 w-5 text-primary" />
                           Course Approvals
                         </CardTitle>
                         <CardDescription>Review and approve submitted courses</CardDescription>
                       </div>
                       <Badge variant="secondary">{pendingCourses.length} pending</Badge>
                     </div>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     {pendingCourses.map((course) => (
                       <div
                         key={course.id}
                         className="flex items-center gap-4 p-4 rounded-lg bg-muted/50"
                       >
                         <div className="h-12 w-12 rounded-lg bg-accent/10 flex items-center justify-center">
                           <BookOpen className="h-5 w-5 text-accent" />
                         </div>
                         <div className="flex-1">
                           <h4 className="font-medium">{course.title}</h4>
                           <p className="text-sm text-muted-foreground">
                             by {course.instructor} • {course.submitted}
                           </p>
                         </div>
                         <div className="flex gap-2">
                           <Button variant="ghost" size="icon" title="Preview">
                             <Eye className="h-4 w-4" />
                           </Button>
                           <Button variant="ghost" size="icon" title="Approve" className="text-success">
                             <CheckCircle className="h-4 w-4" />
                           </Button>
                           <Button variant="ghost" size="icon" title="Reject" className="text-destructive">
                             <XCircle className="h-4 w-4" />
                           </Button>
                         </div>
                       </div>
                     ))}
                   </CardContent>
                 </Card>
                 
                 <Card>
                   <CardHeader>
                     <CardTitle>Course Statistics</CardTitle>
                     <CardDescription>Platform-wide course data</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="p-4 rounded-lg bg-muted/50">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-sm">Total Courses</span>
                         <span className="font-bold">32</span>
                       </div>
                       <Progress value={100} className="h-2" />
                     </div>
                     <div className="p-4 rounded-lg bg-success/10">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-sm text-success">Published</span>
                         <span className="font-bold">26</span>
                       </div>
                       <Progress value={81} className="h-2 bg-success/20" />
                     </div>
                     <div className="p-4 rounded-lg bg-accent/10">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-sm text-accent">Pending</span>
                         <span className="font-bold">3</span>
                       </div>
                       <Progress value={9} className="h-2 bg-accent/20" />
                     </div>
                     <div className="p-4 rounded-lg bg-destructive/10">
                       <div className="flex justify-between items-center mb-2">
                         <span className="text-sm text-destructive">Disabled</span>
                         <span className="font-bold">3</span>
                       </div>
                       <Progress value={9} className="h-2 bg-destructive/20" />
                     </div>
                   </CardContent>
                 </Card>
               </div>
             </TabsContent>
             
             {/* Security Tab */}
             <TabsContent value="security" className="space-y-6">
               <div className="grid gap-6 lg:grid-cols-3">
                 <Card className="lg:col-span-2">
                   <CardHeader>
                     <div className="flex items-center justify-between">
                       <div>
                         <CardTitle className="flex items-center gap-2">
                           <ShieldAlert className="h-5 w-5 text-destructive" />
                           Security Events
                         </CardTitle>
                         <CardDescription>Monitor security incidents</CardDescription>
                       </div>
                       <Button variant="outline" size="sm">Export Log</Button>
                     </div>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     {securityEvents.map((event) => (
                       <div
                         key={event.id}
                         className={`flex items-center gap-4 p-4 rounded-lg ${
                           event.risk === 'high' ? 'bg-destructive/10 border border-destructive/20' :
                           event.risk === 'medium' ? 'bg-accent/10 border border-accent/20' :
                           'bg-muted/50'
                         }`}
                       >
                         <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                           event.risk === 'high' ? 'bg-destructive/20' :
                           event.risk === 'medium' ? 'bg-accent/20' :
                           'bg-muted'
                         }`}>
                           {event.risk === 'high' ? (
                             <AlertTriangle className="h-5 w-5 text-destructive" />
                           ) : event.risk === 'medium' ? (
                             <ShieldAlert className="h-5 w-5 text-accent" />
                           ) : (
                             <Shield className="h-5 w-5 text-muted-foreground" />
                           )}
                         </div>
                         <div className="flex-1">
                           <div className="flex items-center gap-2">
                             <h4 className="font-medium capitalize">
                               {event.type.replace('_', ' ')}
                             </h4>
                             <Badge variant={
                               event.risk === 'high' ? 'destructive' :
                               event.risk === 'medium' ? 'default' : 'secondary'
                             }>
                               {event.risk}
                             </Badge>
                           </div>
                           <p className="text-sm text-muted-foreground">
                             {event.user} • IP: {event.ip}
                           </p>
                         </div>
                         <div className="text-sm text-muted-foreground">{event.time}</div>
                         <Button variant="ghost" size="icon" title="Investigate">
                           <Eye className="h-4 w-4" />
                         </Button>
                       </div>
                     ))}
                   </CardContent>
                 </Card>
                 
                 <Card>
                   <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                       <FileText className="h-5 w-5 text-primary" />
                       System Logs
                     </CardTitle>
                     <CardDescription>Recent activity</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-3">
                     {systemLogs.map((log) => (
                       <div key={log.id} className="flex items-start gap-3 p-2 rounded hover:bg-muted/50">
                         <div className={`h-2 w-2 rounded-full mt-2 ${
                           log.type === 'error' ? 'bg-destructive' :
                           log.type === 'warning' ? 'bg-accent' :
                           log.type === 'audit' ? 'bg-primary' :
                           'bg-muted-foreground'
                         }`} />
                         <div className="flex-1 min-w-0">
                           <p className="text-sm font-medium truncate">{log.action}</p>
                           <p className="text-xs text-muted-foreground">
                             {log.module} • {log.time}
                           </p>
                         </div>
                       </div>
                     ))}
                     <Button variant="outline" className="w-full" size="sm">
                       View All Logs
                     </Button>
                   </CardContent>
                 </Card>
               </div>
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
                         <CardDescription>Overview of platform performance</CardDescription>
                       </div>
                       <div className="flex gap-2">
                         <Button variant="outline" size="sm">This Week</Button>
                         <Button variant="outline" size="sm">Export</Button>
                       </div>
                     </div>
                   </CardHeader>
                   <CardContent>
                     <div className="grid grid-cols-2 gap-4">
                       <div className="p-4 rounded-lg bg-muted/50">
                         <div className="flex items-center gap-2 mb-2">
                           <Users className="h-4 w-4 text-primary" />
                           <span className="text-sm text-muted-foreground">Active Users (Today)</span>
                         </div>
                         <p className="text-2xl font-bold">342</p>
                         <p className="text-xs text-success flex items-center gap-1 mt-1">
                           <TrendingUp className="h-3 w-3" /> +12% from yesterday
                         </p>
                       </div>
                       <div className="p-4 rounded-lg bg-muted/50">
                         <div className="flex items-center gap-2 mb-2">
                           <BookOpen className="h-4 w-4 text-accent" />
                           <span className="text-sm text-muted-foreground">Courses Completed</span>
                         </div>
                         <p className="text-2xl font-bold">89</p>
                         <p className="text-xs text-success flex items-center gap-1 mt-1">
                           <TrendingUp className="h-3 w-3" /> +8% from last week
                         </p>
                       </div>
                       <div className="p-4 rounded-lg bg-muted/50">
                         <div className="flex items-center gap-2 mb-2">
                           <FileText className="h-4 w-4 text-success" />
                           <span className="text-sm text-muted-foreground">Exams Taken</span>
                         </div>
                         <p className="text-2xl font-bold">1,245</p>
                         <p className="text-xs text-success flex items-center gap-1 mt-1">
                           <TrendingUp className="h-3 w-3" /> +15% from last week
                         </p>
                       </div>
                       <div className="p-4 rounded-lg bg-muted/50">
                         <div className="flex items-center gap-2 mb-2">
                           <Globe className="h-4 w-4 text-primary" />
                           <span className="text-sm text-muted-foreground">Total Sessions</span>
                         </div>
                         <p className="text-2xl font-bold">4,892</p>
                         <p className="text-xs text-success flex items-center gap-1 mt-1">
                           <TrendingUp className="h-3 w-3" /> +5% from last week
                         </p>
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
                           <span className={`font-medium ${
                             metric.value > 80 ? 'text-destructive' :
                             metric.value > 60 ? 'text-accent' :
                             'text-success'
                           }`}>
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
                     <CardDescription>Configure global platform settings</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-6">
                     <div className="flex items-center justify-between">
                       <div>
                         <Label>Maintenance Mode</Label>
                         <p className="text-xs text-muted-foreground">Disable access for non-admins</p>
                       </div>
                       <Switch />
                     </div>
                     <div className="flex items-center justify-between">
                       <div>
                         <Label>New User Registration</Label>
                         <p className="text-xs text-muted-foreground">Allow new signups</p>
                       </div>
                       <Switch defaultChecked />
                     </div>
                     <div className="flex items-center justify-between">
                       <div>
                         <Label>Email Notifications</Label>
                         <p className="text-xs text-muted-foreground">Send system emails</p>
                       </div>
                       <Switch defaultChecked />
                     </div>
                     <div className="flex items-center justify-between">
                       <div>
                         <Label>Public Leaderboard</Label>
                         <p className="text-xs text-muted-foreground">Show rankings to all</p>
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
                     <CardDescription>Configure security policies</CardDescription>
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
                         <p className="text-xs text-muted-foreground">Require 2FA for admins</p>
                       </div>
                       <Switch />
                     </div>
                     <div className="flex items-center justify-between">
                       <div>
                         <Label>IP Whitelisting</Label>
                         <p className="text-xs text-muted-foreground">Restrict admin access by IP</p>
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
                     <CardDescription>Default exam configuration</CardDescription>
                   </CardHeader>
                   <CardContent className="space-y-4">
                     <div className="space-y-2">
                       <Label>Default Duration (minutes)</Label>
                       <Input type="number" defaultValue={60} className="w-24" />
                     </div>
                     <div className="flex items-center justify-between">
                       <div>
                         <Label>Negative Marking</Label>
                         <p className="text-xs text-muted-foreground">Enable by default</p>
                       </div>
                       <Switch defaultChecked />
                     </div>
                     <div className="flex items-center justify-between">
                       <div>
                         <Label>Question Shuffling</Label>
                         <p className="text-xs text-muted-foreground">Randomize questions</p>
                       </div>
                       <Switch defaultChecked />
                     </div>
                     <div className="flex items-center justify-between">
                       <div>
                         <Label>Proctoring</Label>
                         <p className="text-xs text-muted-foreground">Enable webcam monitoring</p>
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
                     <Button variant="outline" className="w-full justify-start gap-3">
                       <Database className="h-4 w-4" />
                       Create Backup
                     </Button>
                     <Button variant="outline" className="w-full justify-start gap-3">
                       <RefreshCw className="h-4 w-4" />
                       Clear Cache
                     </Button>
                     <Button variant="outline" className="w-full justify-start gap-3">
                       <FileText className="h-4 w-4" />
                       Export All Data
                     </Button>
                     <Button variant="outline" className="w-full justify-start gap-3 text-destructive">
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