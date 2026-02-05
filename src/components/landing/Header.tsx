 import { useState } from "react";
 import { Button } from "@/components/ui/button";
 import { Menu, X } from "lucide-react";
 import logo from "@/assets/logo.png";
 
 const Header = () => {
   const [isMenuOpen, setIsMenuOpen] = useState(false);
 
   const navLinks = [
     { name: "Home", href: "#" },
     { name: "Courses", href: "#courses" },
     { name: "Features", href: "#features" },
     { name: "About", href: "#about" },
     { name: "Contact", href: "#contact" },
   ];
 
   return (
     <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
       <div className="container-width section-padding !py-3">
         <div className="flex items-center justify-between">
           {/* Logo */}
           <a href="#" className="flex items-center gap-2">
             <img src={logo} alt="AOTMS Logo" className="h-10 md:h-12" />
           </a>
 
           {/* Desktop Navigation */}
           <nav className="hidden md:flex items-center gap-8">
             {navLinks.map((link) => (
               <a
                 key={link.name}
                 href={link.href}
                 className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
               >
                 {link.name}
               </a>
             ))}
           </nav>
 
           {/* Desktop CTA Buttons */}
           <div className="hidden md:flex items-center gap-3">
             <Button variant="hero-outline" size="default">
               Login
             </Button>
             <Button variant="accent" size="default">
               Get Started
             </Button>
           </div>
 
           {/* Mobile Menu Toggle */}
           <button
             className="md:hidden p-2 text-foreground"
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             aria-label="Toggle menu"
           >
             {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
           </button>
         </div>
 
         {/* Mobile Menu */}
         {isMenuOpen && (
           <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border animate-fade-in">
             <nav className="flex flex-col p-4 gap-4">
               {navLinks.map((link) => (
                 <a
                   key={link.name}
                   href={link.href}
                   className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors py-2"
                   onClick={() => setIsMenuOpen(false)}
                 >
                   {link.name}
                 </a>
               ))}
               <div className="flex flex-col gap-2 pt-4 border-t border-border">
                 <Button variant="hero-outline" size="default" className="w-full">
                   Login
                 </Button>
                 <Button variant="accent" size="default" className="w-full">
                   Get Started
                 </Button>
               </div>
             </nav>
           </div>
         )}
       </div>
     </header>
   );
 };
 
 export default Header;