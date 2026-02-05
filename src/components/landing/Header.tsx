 import { useState } from "react";
 import { Link } from "react-router-dom";
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
      <div className="container-width section-padding !py-4 md:!py-5">
         <div className="flex items-center justify-between">
           {/* Logo */}
           <a href="#" className="flex items-center gap-2">
            <img src={logo} alt="AOTMS Logo" className="h-12 md:h-14 lg:h-16" />
           </a>
 
           {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-10">
             {navLinks.map((link) => (
               <a
                 key={link.name}
                 href={link.href}
                className="text-base lg:text-lg font-medium text-muted-foreground hover:text-foreground transition-colors duration-200"
               >
                 {link.name}
               </a>
             ))}
           </nav>
 
           {/* Desktop CTA Buttons */}
          <div className="hidden md:flex items-center gap-4">
            <Button variant="hero-outline" size="lg" asChild>
              <Link to="/auth">Login</Link>
            </Button>
            <Button variant="accent" size="lg" asChild>
              <Link to="/auth">Get Started</Link>
            </Button>
           </div>
 
           {/* Mobile Menu Toggle */}
           <button
            className="md:hidden p-3 text-foreground"
             onClick={() => setIsMenuOpen(!isMenuOpen)}
             aria-label="Toggle menu"
           >
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
           </button>
         </div>
 
         {/* Mobile Menu */}
         {isMenuOpen && (
           <div className="md:hidden absolute top-full left-0 right-0 bg-background border-b border-border animate-fade-in">
            <nav className="flex flex-col p-6 gap-5">
               {navLinks.map((link) => (
                 <a
                   key={link.name}
                   href={link.href}
                  className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors py-3"
                   onClick={() => setIsMenuOpen(false)}
                 >
                   {link.name}
                 </a>
               ))}
              <div className="flex flex-col gap-3 pt-5 border-t border-border">
               <Button variant="hero-outline" size="lg" className="w-full" asChild>
                 <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Login</Link>
               </Button>
               <Button variant="accent" size="lg" className="w-full" asChild>
                 <Link to="/auth" onClick={() => setIsMenuOpen(false)}>Get Started</Link>
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