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
  BookOpen,
  Video,
  Users,
  Calendar,
  FileText,
  BarChart3,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  GraduationCap,
  Upload,
  ClipboardList,
  CheckSquare,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

const overviewItems = [
  { title: "Dashboard", url: "/instructor", icon: LayoutDashboard },
];

const contentItems = [
  { title: "My Courses", url: "/instructor/courses", icon: BookOpen },
  { title: "Upload Content", url: "/instructor/upload", icon: Upload },
  { title: "Assessments", url: "/instructor/assessments", icon: ClipboardList },
];

const studentManagementItems = [
  { title: "Students", url: "/instructor/students", icon: Users },
  { title: "Attendance", url: "/instructor/attendance", icon: CheckSquare },
  { title: "Analytics", url: "/instructor/analytics", icon: BarChart3 },
];

export function InstructorSidebar() {
  const location = useLocation();
  const { signOut } = useAuth();

  const isActive = (path: string) =>
    location.pathname === path ||
    (path !== "/instructor" && location.pathname.startsWith(path));

  return (
    <Sidebar className="border-r-4 border-[#000000] font-['Inter']">
      <SidebarHeader className="h-16 px-4 bg-[#E9E9E9] border-b-4 border-[#000000] flex justify-center">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src={logo}
            alt="AOTMS"
            className="h-10 group-hover:-translate-y-1 transition-transform"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="bg-white">
        {/* Overview Category */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-black text-[#000000] uppercase tracking-widest text-[10px] mt-4">
            Overview
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2 mt-2">
              {overviewItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={`font-black uppercase tracking-widest text-xs h-12 border-2 transition-all rounded-3xl ${
                      isActive(item.url)
                        ? "bg-[#0075CF] text-white border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0075CF]/90 hover:text-white"
                        : "bg-white text-[#000000] border-transparent hover:border-[#000000] hover:bg-[#E9E9E9] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]"
                    }`}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Content Management Category */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-black text-[#000000] uppercase tracking-widest text-[10px] mt-2 border-t-2 border-black/10 pt-4">
            Teaching & Content
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2 mt-2">
              {contentItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={`font-black uppercase tracking-widest text-xs h-12 border-2 transition-all rounded-3xl ${
                      isActive(item.url)
                        ? "bg-[#0075CF] text-white border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0075CF]/90 hover:text-white"
                        : "bg-white text-[#000000] border-transparent hover:border-[#000000] hover:bg-[#E9E9E9] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]"
                    }`}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Student Management Category */}
        <SidebarGroup>
          <SidebarGroupLabel className="font-black text-[#000000] uppercase tracking-widest text-[10px] mt-2 border-t-2 border-black/10 pt-4">
            Student Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2 mt-2">
              {studentManagementItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.url)}
                    className={`font-black uppercase tracking-widest text-xs h-12 border-2 transition-all rounded-3xl ${
                      isActive(item.url)
                        ? "bg-[#0075CF] text-white border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0075CF]/90 hover:text-white"
                        : "bg-white text-[#000000] border-transparent hover:border-[#000000] hover:bg-[#E9E9E9] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]"
                    }`}
                  >
                    <Link to={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t-4 border-[#000000] p-4 bg-[#E9E9E9] rounded-3xl">
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 h-12 font-black uppercase tracking-widest text-xs border-2 border-transparent hover:border-[#000000] bg-white text-[#FD5A1A] hover:bg-[#FD5A1A] hover:text-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all rounded-3xl"
          onClick={signOut}
        >
          <LogOut className="h-5 w-5" />
          Sign Out
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
