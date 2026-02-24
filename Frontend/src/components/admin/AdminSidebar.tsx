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
  Users,
  Shield,
  BookOpen,
  BarChart3,
  Settings,
  HelpCircle,
  LogOut,
  Bell,
} from "lucide-react";
import logo from "@/assets/logo.png";
import { useAuth } from "@/hooks/useAuth";

interface AdminSidebarProps {
  activeSection?: string;
  onSectionChange?: (section: string) => void;
}

const mainNavItems = [
  { id: "users", title: "User Management", icon: Users },
  { id: "courses", title: "Course Approval", icon: BookOpen },
  { id: "security", title: "Security", icon: Shield },
  { id: "analytics", title: "Analytics", icon: BarChart3 },
  { id: "settings", title: "Settings", icon: Settings },
];

export function AdminSidebar({
  activeSection = "users",
  onSectionChange = () => {},
}: AdminSidebarProps) {
  const { signOut } = useAuth();

  const renderNavSection = (items: typeof mainNavItems) =>
    items.map((item) => {
      const isActive = activeSection === item.id;
      return (
        <SidebarMenuItem key={item.id}>
          <SidebarMenuButton
            onClick={() => onSectionChange(item.id)}
            className={`font-black uppercase tracking-widest text-xs h-12 border-2 transition-all cursor-pointer ${
              isActive
                ? "bg-[#0075CF] text-white border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-[#0075CF]/90 hover:text-white"
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
    <Sidebar className="border-r border-border font-['Inter']">
      <SidebarHeader className="p-4 border-b-4 border-[#000000] bg-[#E9E9E9]">
        <button
          onClick={() => onSectionChange("users")}
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
            Administrator
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="gap-2 px-2 mt-2">
              {renderNavSection(mainNavItems)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t-4 border-[#000000] p-4 bg-[#E9E9E9] space-y-2">
        <SidebarMenu className="gap-2">
          <SidebarMenuItem>
            <SidebarMenuButton className="font-black uppercase tracking-widest text-[10px] h-10 border-2 border-transparent hover:border-[#000000] bg-white text-[#000000] hover:bg-[#E9E9E9] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] cursor-pointer transition-all">
              <Bell className="h-4 w-4 shrink-0" />
              <span>Notifications</span>
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
