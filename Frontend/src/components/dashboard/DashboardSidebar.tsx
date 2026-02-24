import { Link, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  User,
  BookOpen,
  Video,
  Calendar,
  FileText,
  ClipboardCheck,
  History,
  Trophy,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import logo from "@/assets/logo.png";

const menuItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "My Profile", url: "/dashboard/profile", icon: User },
  { title: "Browse Courses", url: "/courses", icon: BookOpen },
  { title: "My Courses", url: "/dashboard/courses", icon: BookOpen },
  { title: "Recorded Videos", url: "/dashboard/videos", icon: Video },
  { title: "Live Classes", url: "/dashboard/live-classes", icon: Calendar },
  { title: "Mock Papers", url: "/dashboard/mock-papers", icon: FileText },
  { title: "Live Exams", url: "/dashboard/exams", icon: ClipboardCheck },
  { title: "Exam History", url: "/dashboard/history", icon: History },
  { title: "Leaderboard", url: "/dashboard/leaderboard", icon: Trophy },
  { title: "Notifications", url: "/dashboard/notifications", icon: Bell },
  { title: "Settings", url: "/dashboard/settings", icon: Settings },
];

export function DashboardSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  return (
    <Sidebar className="border-r border-border font-['Inter']">
      <SidebarHeader className="p-4 border-b-4 border-[#000000] bg-[#E9E9E9]">
        <Link
          to="/"
          className="flex items-center gap-3 group transition-transform hover:-translate-y-[2px]"
        >
          <img src={logo} alt="AOTMS" className="h-10" />
          <span className="font-black text-[#000000] tracking-widest text-lg">
            AOTMS
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-white scrollbar-hide">
        <SidebarGroup>
          <SidebarGroupLabel className="font-black text-[#000000] uppercase tracking-widest text-[10px] mt-4">
            Student Portal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2 mt-2">
              {menuItems.map((item) => {
                const isActive =
                  location.pathname === item.url ||
                  (item.url !== "/dashboard" &&
                    location.pathname.startsWith(item.url));

                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`font-black uppercase tracking-widest text-xs h-12 border-2 transition-all cursor-pointer ${
                        isActive
                          ? "bg-[#FD5A1A] text-white border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FD5A1A]/90 hover:text-white"
                          : "bg-white text-[#000000] border-transparent hover:border-[#000000] hover:bg-[#E9E9E9] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]"
                      }`}
                    >
                      <Link to={item.url} className="flex items-center gap-2">
                        <item.icon className="h-4 w-4 shrink-0" />
                        <span className="whitespace-nowrap">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t-4 border-[#000000] p-4 bg-[#E9E9E9] space-y-2">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              className="font-black uppercase tracking-widest text-[10px] h-10 border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white text-[#FD5A1A] hover:bg-[#FD5A1A] hover:text-white hover:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] hover:translate-y-[2px] hover:translate-x-[2px] cursor-pointer transition-all"
            >
              <LogOut className="h-4 w-4 shrink-0" />
              <span>Sign Out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
