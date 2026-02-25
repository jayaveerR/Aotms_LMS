import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Settings,
  LogOut,
  LayoutDashboard,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { NotificationBell } from "@/components/ui/NotificationBell";
import logo from "@/assets/logo.png";

// Pages with light backgrounds that need dark navbar text
const lightBgPages = [
  "/learning-paths",
  "/auth",
  "/dashboard",
  "/instructor",
  "/manager",
  "/admin",
  "/about",
  "/assignments",
];

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Courses", href: "/#courses" },
  { name: "Learning Paths", href: "/learning-paths" },
  { name: "Assignments", href: "/assignments" },
  { name: "About", href: "/about" },
];

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, userRole, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if current page has a light background
  const hasLightBg = lightBgPages.some((page) =>
    location.pathname.startsWith(page),
  );

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

  const getUserInitials = () => {
    if (user?.user_metadata?.full_name) {
      return user.user_metadata.full_name
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2);
    }
    if (user?.email) {
      return user.email[0].toUpperCase();
    }
    return "U";
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith("/#")) {
      const sectionId = href.replace("/#", "");
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          const el = document.getElementById(sectionId);
          if (el) el.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    } else {
      navigate(href);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md border-b-4 border-black shadow-[0_4px_0_0_rgba(0,0,0,1)] py-2"
          : "bg-transparent py-4"
      }`}
    >
      <div className="container-width px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-3 group transition-transform active:scale-95"
          >
            <div className="bg-white p-2 border-2 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all">
              <img
                src={logo}
                alt="AOTMS Logo"
                className="h-8 sm:h-10 md:h-12 w-auto"
              />
            </div>
            <span
              className={`text-2xl font-black uppercase tracking-tighter ${
                isScrolled || hasLightBg ? "text-black" : "text-white"
              }`}
            >
              AOTMS
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {navLinks.map((link) => (
              <button
                key={link.name}
                onClick={() => handleNavClick(link.href)}
                className={`px-4 py-2 rounded-none text-sm font-black uppercase tracking-widest border-2 border-transparent transition-all duration-200 hover:border-black hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] ${
                  isScrolled || hasLightBg
                    ? "text-black hover:text-[#0075CF]"
                    : "text-white hover:text-black"
                }`}
              >
                {link.name}
              </button>
            ))}
          </nav>

          {/* Right Side - Auth & Mobile Menu */}
          <div className="flex items-center gap-2 sm:gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                <NotificationBell />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-2 p-1 border-2 border-transparent hover:border-black hover:bg-white hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all rounded-none focus:outline-none group">
                      <Avatar className="h-10 w-10 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] group-hover:shadow-none bg-[#FD5A1A]">
                        <AvatarImage src={user.user_metadata?.avatar_url} />
                        <AvatarFallback className="bg-[#FD5A1A] text-white font-black">
                          {getUserInitials()}
                        </AvatarFallback>
                      </Avatar>
                      <ChevronDown
                        className={`h-4 w-4 transition-transform group-hover:translate-y-0.5 ${
                          isScrolled || hasLightBg
                            ? "text-black"
                            : "text-white group-hover:text-black"
                        }`}
                      />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-64 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] rounded-none p-0 bg-white z-[100]"
                  >
                    <div className="bg-[#E9E9E9] p-4 border-b-2 border-black">
                      <p className="text-sm font-black uppercase text-black">
                        {user.user_metadata?.full_name || "User Account"}
                      </p>
                      <p className="text-[10px] font-bold text-black/50 truncate">
                        {user.email}
                      </p>
                    </div>
                    <div className="p-1">
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer font-black uppercase text-xs tracking-widest p-3 focus:bg-[#0075CF] focus:text-white rounded-none border-2 border-transparent focus:border-black"
                      >
                        <Link
                          to={
                            userRole === "student" || !userRole
                              ? "/dashboard"
                              : userRole === "admin"
                                ? "/admin"
                                : `/${userRole}`
                          }
                          className="flex items-center gap-3"
                        >
                          <LayoutDashboard className="h-4 w-4" />
                          <span>Dashboard</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        asChild
                        className="cursor-pointer font-black uppercase text-xs tracking-widest p-3 focus:bg-[#0075CF] focus:text-white rounded-none border-2 border-transparent focus:border-black"
                      >
                        <Link
                          to="/settings"
                          className="flex items-center gap-3"
                        >
                          <Settings className="h-4 w-4" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </div>
                    <div className="border-t-2 border-black p-1">
                      <DropdownMenuItem
                        onClick={handleSignOut}
                        className="cursor-pointer font-black uppercase text-xs tracking-widest p-3 text-[#FD5A1A] focus:bg-[#FD5A1A] focus:text-white rounded-none border-2 border-transparent focus:border-black"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        <span>Sign out</span>
                      </DropdownMenuItem>
                    </div>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Button
                  variant="ghost"
                  className={`h-11 px-6 font-black uppercase tracking-widest text-xs border-2 border-transparent hover:border-black hover:bg-white hover:shadow-[4px_4px_0px_0_rgba(0,0,0,1)] active:translate-x-1 active:translate-y-1 active:shadow-none transition-all ${
                    isScrolled || hasLightBg
                      ? "text-black"
                      : "text-white hover:text-black"
                  }`}
                  asChild
                >
                  <Link to="/auth" state={{ mode: "login" }}>
                    Login
                  </Link>
                </Button>
                <Button
                  className="h-11 px-8 bg-[#FD5A1A] text-white border-2 border-black font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 active:translate-x-1.5 active:translate-y-1.5 transition-all rounded-none"
                  asChild
                >
                  <Link to="/auth" state={{ mode: "signup" }}>
                    Sign Up
                  </Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className={`lg:hidden border-2 border-transparent hover:border-black hover:bg-white active:bg-white transition-all ${
                    isScrolled || hasLightBg
                      ? "text-black"
                      : "text-white hover:text-black"
                  }`}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent
                side="right"
                className="w-[300px] bg-white border-l-4 border-black p-0 rounded-none shadow-none"
              >
                <div className="flex flex-col h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
                  <div className="p-6 border-b-4 border-black bg-white">
                    <img src={logo} alt="AOTMS Logo" className="h-10" />
                  </div>
                  <nav className="flex-1 px-4 py-8">
                    <ul className="space-y-4">
                      {navLinks.map((link) => (
                        <li key={link.name}>
                          <SheetClose asChild>
                            <button
                              onClick={() => handleNavClick(link.href)}
                              className="w-full text-left px-4 py-4 border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-black uppercase tracking-widest text-sm active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                            >
                              {link.name}
                            </button>
                          </SheetClose>
                        </li>
                      ))}
                    </ul>
                  </nav>
                  {!user && (
                    <div className="p-6 bg-white border-t-4 border-black space-y-4">
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          className="w-full h-14 border-2 border-black font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-none"
                          asChild
                        >
                          <Link to="/auth" state={{ mode: "login" }}>
                            Login
                          </Link>
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button
                          className="w-full h-14 bg-[#0075CF] text-white border-2 border-black font-black uppercase tracking-widest text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1 hover:translate-y-1 transition-all rounded-none"
                          asChild
                        >
                          <Link to="/auth" state={{ mode: "signup" }}>
                            Sign Up
                          </Link>
                        </Button>
                      </SheetClose>
                    </div>
                  )}
                  {user && (
                    <div className="p-6 bg-white border-t-4 border-black space-y-4">
                      <div className="flex items-center gap-4 mb-6">
                        <Avatar className="h-12 w-12 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] bg-[#0075CF]">
                          <AvatarFallback className="bg-[#0075CF] text-white font-black">
                            {getUserInitials()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black uppercase text-black truncate">
                            {user.user_metadata?.full_name || "User"}
                          </p>
                          <p className="text-[10px] font-bold text-black/50 truncate">
                            {user.email}
                          </p>
                        </div>
                      </div>
                      <SheetClose asChild>
                        <Button
                          variant="ghost"
                          className="w-full h-12 justify-start border-2 border-transparent hover:border-black font-black uppercase tracking-widest text-[10px] rounded-none"
                          asChild
                        >
                          <Link to="/dashboard">
                            <LayoutDashboard className="h-4 w-4 mr-3" />
                            Dashboard
                          </Link>
                        </Button>
                      </SheetClose>
                      <Button
                        variant="ghost"
                        className="w-full h-12 justify-start border-2 border-transparent hover:border-black font-black uppercase tracking-widest text-[10px] text-[#FD5A1A] rounded-none"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4 mr-3" />
                        Log out
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
