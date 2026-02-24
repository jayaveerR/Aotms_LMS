import { SidebarTrigger } from "@/components/ui/sidebar";
import { Search, Settings, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { NotificationBell } from "@/components/ui/NotificationBell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function DashboardHeader() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    return user?.email?.slice(0, 2).toUpperCase() || "ST";
  };

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b-4 border-[#000000] bg-white px-4 shrink-0 transition-all font-['Inter'] bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-1 border-2 border-[#000000] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-white hover:bg-[#E9E9E9]" />

        <div className="relative hidden md:block w-64 group focus-within:translate-y-[-2px] focus-within:translate-x-[-2px] transition-transform">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#000000] z-10" />
          <Input
            placeholder="Search courses, exams..."
            className="pl-10 w-full bg-[#E9E9E9] border-2 border-[#000000] text-[#000000] font-bold shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:bg-white transition-all placeholder:font-normal placeholder:text-[#000000]/50"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <NotificationBell />

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 px-2 border-2 border-transparent hover:border-[#000000] hover:bg-white hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all h-10 group rounded-none"
            >
              <Avatar className="h-8 w-8 border-2 border-[#000000] shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none transition-shadow">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-[#FD5A1A] text-white text-xs font-black">
                  {getUserInitials()}
                </AvatarFallback>
              </Avatar>
              <div className="hidden md:block text-left">
                <p className="text-sm font-black text-[#000000] uppercase tracking-wider leading-tight">
                  {user?.user_metadata?.full_name || "Student"}
                </p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            align="end"
            className="w-56 border-4 border-[#000000] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] rounded-none p-0 bg-white z-[100] font-['Inter']"
          >
            <DropdownMenuLabel className="font-black uppercase text-[10px] tracking-widest text-[#000000]/60 bg-[#E9E9E9] border-b-2 border-[#000000] py-2 px-3">
              Account
            </DropdownMenuLabel>

            <div className="p-1 gap-1 flex flex-col">
              <DropdownMenuItem
                onClick={() => navigate("/dashboard/profile")}
                className="font-bold text-[#000000] focus:bg-[#0075CF] focus:text-white cursor-pointer rounded-none border-2 border-transparent focus:border-[#000000]"
              >
                <User className="h-4 w-4 mr-2" />
                My Profile
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigate("/dashboard/settings")}
                className="font-bold text-[#000000] focus:bg-[#0075CF] focus:text-white cursor-pointer rounded-none border-2 border-transparent focus:border-[#000000]"
              >
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </DropdownMenuItem>
            </div>

            <div className="border-t-2 border-[#000000] p-1">
              <DropdownMenuItem
                onClick={handleSignOut}
                className="font-black text-[#FD5A1A] focus:bg-[#FD5A1A] focus:text-white cursor-pointer rounded-none border-2 border-transparent focus:border-[#000000] uppercase tracking-widest text-xs"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Log out
              </DropdownMenuItem>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
