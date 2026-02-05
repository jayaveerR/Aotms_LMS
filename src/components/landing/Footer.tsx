 import logo from "@/assets/logo.png";
 import { Facebook, Twitter, Linkedin, Instagram, Youtube, Mail, Phone, MapPin } from "lucide-react";
 
 const Footer = () => {
   const currentYear = new Date().getFullYear();
 
   const footerLinks = {
     company: [
       { name: "About Us", href: "#" },
       { name: "Careers", href: "#" },
       { name: "Blog", href: "#" },
       { name: "Press", href: "#" },
     ],
     resources: [
       { name: "Courses", href: "#courses" },
       { name: "Documentation", href: "#" },
       { name: "Community", href: "#" },
       { name: "Help Center", href: "#" },
     ],
     legal: [
       { name: "Privacy Policy", href: "#" },
       { name: "Terms of Service", href: "#" },
       { name: "Cookie Policy", href: "#" },
       { name: "Refund Policy", href: "#" },
     ],
   };
 
   const socialLinks = [
     { icon: Facebook, href: "#", label: "Facebook" },
     { icon: Twitter, href: "#", label: "Twitter" },
     { icon: Linkedin, href: "#", label: "LinkedIn" },
     { icon: Instagram, href: "#", label: "Instagram" },
     { icon: Youtube, href: "#", label: "YouTube" },
   ];
 
   return (
     <footer id="contact" className="bg-foreground text-background">
       <div className="container-width section-padding !py-12 lg:!py-16">
         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
           {/* Brand */}
           <div className="lg:col-span-2">
             <img src={logo} alt="AOTMS Logo" className="h-12 mb-4 brightness-0 invert" />
             <p className="text-background/70 text-sm mb-6 max-w-sm">
               Academy of Tech Masters - Empowering students with industry-relevant
               skills through live classes, secure exams, and real-time performance
               tracking.
             </p>
             <div className="flex gap-3">
               {socialLinks.map((social) => (
                 <a
                   key={social.label}
                   href={social.href}
                   aria-label={social.label}
                   className="w-9 h-9 rounded-full bg-background/10 flex items-center justify-center hover:bg-accent hover:text-accent-foreground transition-colors"
                 >
                   <social.icon className="w-4 h-4" />
                 </a>
               ))}
             </div>
           </div>
 
           {/* Company Links */}
           <div>
             <h4 className="font-semibold text-background mb-4">Company</h4>
             <ul className="space-y-2">
               {footerLinks.company.map((link) => (
                 <li key={link.name}>
                   <a
                     href={link.href}
                     className="text-sm text-background/70 hover:text-accent transition-colors"
                   >
                     {link.name}
                   </a>
                 </li>
               ))}
             </ul>
           </div>
 
           {/* Resources Links */}
           <div>
             <h4 className="font-semibold text-background mb-4">Resources</h4>
             <ul className="space-y-2">
               {footerLinks.resources.map((link) => (
                 <li key={link.name}>
                   <a
                     href={link.href}
                     className="text-sm text-background/70 hover:text-accent transition-colors"
                   >
                     {link.name}
                   </a>
                 </li>
               ))}
             </ul>
           </div>
 
           {/* Contact */}
           <div>
             <h4 className="font-semibold text-background mb-4">Contact</h4>
             <ul className="space-y-3">
               <li className="flex items-start gap-3 text-sm text-background/70">
                 <MapPin className="w-4 h-4 flex-shrink-0 mt-0.5" />
                 <span>123 Tech Park, Bangalore, India</span>
               </li>
               <li className="flex items-center gap-3 text-sm text-background/70">
                 <Mail className="w-4 h-4 flex-shrink-0" />
                 <a href="mailto:info@aotms.com" className="hover:text-accent transition-colors">
                   info@aotms.com
                 </a>
               </li>
               <li className="flex items-center gap-3 text-sm text-background/70">
                 <Phone className="w-4 h-4 flex-shrink-0" />
                 <a href="tel:+919876543210" className="hover:text-accent transition-colors">
                   +91 98765 43210
                 </a>
               </li>
             </ul>
           </div>
         </div>
 
         {/* Bottom Bar */}
         <div className="mt-12 pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
           <p className="text-sm text-background/50">
             © {currentYear} Academy of Tech Masters. All rights reserved.
           </p>
           <div className="flex gap-6">
             {footerLinks.legal.slice(0, 2).map((link) => (
               <a
                 key={link.name}
                 href={link.href}
                 className="text-sm text-background/50 hover:text-accent transition-colors"
               >
                 {link.name}
               </a>
             ))}
           </div>
         </div>
       </div>
     </footer>
   );
 };
 
 export default Footer;