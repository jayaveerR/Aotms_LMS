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
   Users,
   UserCog,
   Shield,
   BookOpen,
   BarChart3,
   Settings,
   HelpCircle,
   LogOut,
   FileText,
   Activity,
   Database,
   Globe,
   Lock,
   Bell,
 } from 'lucide-react';
 import logo from '@/assets/logo.png';
 import { useAuth } from '@/hooks/useAuth';
 
 const mainNavItems = [
   { title: 'Dashboard', url: '/admin', icon: LayoutDashboard },
   { title: 'User Management', url: '/admin/users', icon: Users },
   { title: 'Role Management', url: '/admin/roles', icon: UserCog },
   { title: 'Course Approval', url: '/admin/courses', icon: BookOpen },
 ];
 
 const securityNavItems = [
   { title: 'Security Events', url: '/admin/security', icon: Shield },
   { title: 'System Logs', url: '/admin/logs', icon: FileText },
   { title: 'Access Control', url: '/admin/access', icon: Lock },
 ];
 
 const systemNavItems = [
   { title: 'Analytics', url: '/admin/analytics', icon: BarChart3 },
   { title: 'System Health', url: '/admin/health', icon: Activity },
   { title: 'Database', url: '/admin/database', icon: Database },
   { title: 'Platform Settings', url: '/admin/settings', icon: Settings },
 ];
 
 export function AdminSidebar() {
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
           <SidebarGroupLabel>Administration</SidebarGroupLabel>
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
 
         {/* Security */}
         <SidebarGroup>
           <SidebarGroupLabel>Security</SidebarGroupLabel>
           <SidebarGroupContent>
             <SidebarMenu>
               {securityNavItems.map((item) => (
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
 
         {/* System */}
         <SidebarGroup>
           <SidebarGroupLabel>System</SidebarGroupLabel>
           <SidebarGroupContent>
             <SidebarMenu>
               {systemNavItems.map((item) => (
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
               <NavLink to="/admin/notifications" className="flex items-center gap-3">
                 <Bell className="h-4 w-4" />
                 {!collapsed && <span>Notifications</span>}
               </NavLink>
             </SidebarMenuButton>
           </SidebarMenuItem>
           <SidebarMenuItem>
             <SidebarMenuButton asChild>
               <NavLink to="/admin/help" className="flex items-center gap-3">
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