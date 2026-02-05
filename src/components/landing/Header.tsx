import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import logo from "@/assets/logo.png";
const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const {
    user,
    signOut
  } = useAuth();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };
  return <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 bg-white border-b border-border ${isScrolled ? "shadow-md" : ""}`}>
      <div className="container-width px-4 sm:px-6 lg:px-8 py-3 sm:py-4 bg-[#f1e9e9]">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2 flex-shrink-0">
            <img src={logo} alt="AOTMS Logo" className="h-10 sm:h-12 md:h-14 lg:h-16 w-auto" />
          </a>

          {/* Auth Buttons or User Avatar */}
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
            {user ? <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 rounded-full hover:bg-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20">
                    <Avatar className="h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary/20">
                      <AvatarImage src={user.user_metadata?.avatar_url} alt="User avatar" />
                      <AvatarFallback className="bg-primary text-primary-foreground font-semibold text-sm sm:text-base">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 bg-background border border-border shadow-lg z-[100]">
                  <div className="px-3 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{user.user_metadata?.full_name || "User"}</p>
                    <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                  </div>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/dashboard" className="flex items-center gap-2">
                      <LayoutDashboard className="h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link to="/settings" className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="h-4 w-4 mr-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu> : <>
                <Button variant="hero-outline" size="sm" className="text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6" asChild>
                  <Link to="/auth">Login</Link>
                </Button>
                <Button variant="accent" size="sm" className="text-xs sm:text-sm md:text-base px-3 sm:px-4 md:px-6" asChild>
                  <Link to="/auth">Sign Up</Link>
                </Button>
              </>}
          </div>
        </div>
      </div>
    </header>;
};
export default Header;