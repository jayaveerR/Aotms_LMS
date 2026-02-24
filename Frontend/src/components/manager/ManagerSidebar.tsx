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
} from "@/components/ui/sidebar";

import {
  LayoutDashboard,
  Calendar,
  FileQuestion,
  Trophy,
  UserPlus,
  Settings,
  HelpCircle,
  LogOut,
  ClipboardList,
  Shield,
  BarChart3,
  Gavel,
  MonitorPlay,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";

interface ManagerSidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

const examManagementItems = [
  { id: "overview", title: "Dashboard", icon: LayoutDashboard },
  { id: "exams", title: "Exam Scheduling", icon: Calendar },
  { id: "questions", title: "Question Bank", icon: FileQuestion },
  { id: "mock-tests", title: "Mock Tests", icon: ClipboardList },
  { id: "exam-rules", title: "Exam Rules", icon: Gavel },
];

const managementItems = [
  { id: "leaderboard", title: "Leaderboard", icon: Trophy },
  { id: "guests", title: "Guest Accounts", icon: UserPlus },
  { id: "access-control", title: "Access Control", icon: Shield },
];

const monitoringItems = [
  { id: "monitoring", title: "Live Monitoring", icon: MonitorPlay },
  { id: "course-monitoring", title: "Course Progress", icon: BarChart3 },
];

export function ManagerSidebar({
  activeSection,
  onSectionChange,
}: ManagerSidebarProps) {
  const { signOut } = useAuth();

  const renderNavSection = (items: typeof examManagementItems) =>
    items.map((item) => {
      const isActive = activeSection === item.id;
      return (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            onClick={() => onSectionChange(item.id)}
            className={`font-black uppercase tracking-widest text-xs h-12 border-2 transition-all cursor-pointer ${
              isActive
                ? "bg-[#FD5A1A] text-white border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#FD5A1A]/90 hover:text-white"
                : "bg-white text-[#000000] border-transparent hover:border-[#000000] hover:bg-[#E9E9E9] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-[1px]"
            }`}
          >
            <item.icon className="h-4 w-4 shrink-0" />
            <span className="whitespace-nowrap">{item.title}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  return (
    <Sidebar className="border-r-4 border-[#000000] font-['Inter']">
      <SidebarHeader className="h-16 px-4 bg-[#E9E9E9] border-b-4 border-[#000000] flex justify-center">
        <button
          onClick={() => onSectionChange("overview")}
          className="flex items-center gap-3 group transition-transform hover:-translate-y-[2px]"
        >
          <img src={logo} alt="AOTMS Logo" className="h-10" />
          <span className="font-black text-[#000000] tracking-widest text-lg">
            AOTMS
          </span>
        </button>
      </SidebarHeader>

      <SidebarContent className="bg-white scrollbar-hide">
        <SidebarGroup>
          <SidebarGroupLabel className="font-black text-[#000000] uppercase tracking-widest text-[10px] mt-4">
            Exam Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2 mt-2">
              {renderNavSection(examManagementItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-black text-[#000000] uppercase tracking-widest text-[10px] mt-2">
            Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2 mt-2">
              {renderNavSection(managementItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel className="font-black text-[#000000] uppercase tracking-widest text-[10px] mt-2">
            Monitoring
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2 mt-2">
              {renderNavSection(monitoringItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t-4 border-[#000000] p-4 bg-[#E9E9E9] space-y-2">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton className="font-black uppercase tracking-widest text-[10px] h-10 border-2 border-transparent hover:border-[#000000] bg-white text-[#000000] hover:bg-[#E9E9E9] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all">
              <Settings className="h-4 w-4 shrink-0" />
              <span>Settings</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton className="font-black uppercase tracking-widest text-[10px] h-10 border-2 border-transparent hover:border-[#000000] bg-white text-[#000000] hover:bg-[#E9E9E9] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all">
              <HelpCircle className="h-4 w-4 shrink-0" />
              <span>Help</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
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
