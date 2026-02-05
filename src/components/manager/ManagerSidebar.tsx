 import { useLocation } from 'react-router-dom';
 import {
   Sidebar,
   SidebarContent,
   SidebarGroup,
   SidebarGroupContent,
   SidebarGroupLabel,
   SidebarMenu,
   SidebarMenuButton,
   SidebarMenuItem,
   SidebarHeader,
   SidebarFooter,
   useSidebar,
 } from '@/components/ui/sidebar';
 import { NavLink } from '@/components/NavLink';
 import {
   LayoutDashboard,
   Calendar,
   FileQuestion,
   Trophy,
   UserPlus,
   Eye,
   Settings,
   HelpCircle,
   LogOut,
   ClipboardList,
   Users,
   Shield,
   BarChart3,
   Activity,
   BookOpen,
 } from 'lucide-react';
 import logo from '@/assets/logo.png';
 import { useAuth } from '@/hooks/useAuth';
 
 const mainNavItems = [
   { title: 'Dashboard', url: '/manager', icon: LayoutDashboard },
   { title: 'Exam Scheduling', url: '/manager/exams', icon: Calendar },
   { title: 'Question Bank', url: '/manager/questions', icon: FileQuestion },
   { title: 'Mock Tests', url: '/manager/mock-tests', icon: ClipboardList },
 ];
 
 const managementNavItems = [
   { title: 'Leaderboard', url: '/manager/leaderboard', icon: Trophy },
   { title: 'Guest Accounts', url: '/manager/guests', icon: UserPlus },
   { title: 'Access Control', url: '/manager/access', icon: Shield },
 ];
 
 const monitoringNavItems = [
   { title: 'Course Progress', url: '/manager/courses', icon: BookOpen },
   { title: 'Instructor Activity', url: '/manager/instructors', icon: Users },
   { title: 'System Monitoring', url: '/manager/monitoring', icon: Activity },
   { title: 'Analytics', url: '/manager/analytics', icon: BarChart3 },
 ];
 
 export function ManagerSidebar() {
   const { state } = useSidebar();
   const collapsed = state === 'collapsed';
   const location = useLocation();
   const { signOut } = useAuth();
 
   const isActive = (path: string) => location.pathname === path;
 
   return (
     <Sidebar collapsible="icon" className="border-r border-border">
       <SidebarHeader className="p-4">
         <a href="/" className="flex items-center gap-3">
           <img src={logo} alt="AOTMS Logo" className="h-8" />
           {!collapsed && (
             <span className="font-heading text-lg text-foreground">AOTMS</span>
           )}
         </a>
       </SidebarHeader>
 
       <SidebarContent>
         {/* Main Navigation */}
         <SidebarGroup>
           <SidebarGroupLabel>Exam Management</SidebarGroupLabel>
           <SidebarGroupContent>
             <SidebarMenu>
               {mainNavItems.map((item) => (
                 <SidebarMenuItem key={item.title}>
                   <SidebarMenuButton asChild isActive={isActive(item.url)}>
                     <NavLink
                       to={item.url}
                       className="flex items-center gap-3"
                       activeClassName="bg-primary/10 text-primary"
                     >
                       <item.icon className="h-4 w-4" />
                       {!collapsed && <span>{item.title}</span>}
                     </NavLink>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               ))}
             </SidebarMenu>
           </SidebarGroupContent>
         </SidebarGroup>
 
         {/* Management */}
         <SidebarGroup>
           <SidebarGroupLabel>Management</SidebarGroupLabel>
           <SidebarGroupContent>
             <SidebarMenu>
               {managementNavItems.map((item) => (
                 <SidebarMenuItem key={item.title}>
                   <SidebarMenuButton asChild isActive={isActive(item.url)}>
                     <NavLink
                       to={item.url}
                       className="flex items-center gap-3"
                       activeClassName="bg-primary/10 text-primary"
                     >
                       <item.icon className="h-4 w-4" />
                       {!collapsed && <span>{item.title}</span>}
                     </NavLink>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               ))}
             </SidebarMenu>
           </SidebarGroupContent>
         </SidebarGroup>
 
         {/* Monitoring */}
         <SidebarGroup>
           <SidebarGroupLabel>Monitoring</SidebarGroupLabel>
           <SidebarGroupContent>
             <SidebarMenu>
               {monitoringNavItems.map((item) => (
                 <SidebarMenuItem key={item.title}>
                   <SidebarMenuButton asChild isActive={isActive(item.url)}>
                     <NavLink
                       to={item.url}
                       className="flex items-center gap-3"
                       activeClassName="bg-primary/10 text-primary"
                     >
                       <item.icon className="h-4 w-4" />
                       {!collapsed && <span>{item.title}</span>}
                     </NavLink>
                   </SidebarMenuButton>
                 </SidebarMenuItem>
               ))}
             </SidebarMenu>
           </SidebarGroupContent>
         </SidebarGroup>
       </SidebarContent>
 
       <SidebarFooter className="p-4 space-y-2">
         <SidebarMenu>
           <SidebarMenuItem>
             <SidebarMenuButton asChild>
               <NavLink to="/manager/settings" className="flex items-center gap-3">
                 <Settings className="h-4 w-4" />
                 {!collapsed && <span>Settings</span>}
               </NavLink>
             </SidebarMenuButton>
           </SidebarMenuItem>
           <SidebarMenuItem>
             <SidebarMenuButton asChild>
               <NavLink to="/manager/help" className="flex items-center gap-3">
                 <HelpCircle className="h-4 w-4" />
                 {!collapsed && <span>Help</span>}
               </NavLink>
             </SidebarMenuButton>
           </SidebarMenuItem>
           <SidebarMenuItem>
             <SidebarMenuButton onClick={signOut} className="text-destructive hover:text-destructive">
               <LogOut className="h-4 w-4" />
               {!collapsed && <span>Sign Out</span>}
             </SidebarMenuButton>
           </SidebarMenuItem>
         </SidebarMenu>
       </SidebarFooter>
     </Sidebar>
   );
 }