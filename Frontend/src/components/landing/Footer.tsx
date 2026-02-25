import logo from "@/assets/logo.png";
import { Linkedin, Instagram, Facebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    explore: [
      { name: "Home", href: "#" },
      { name: "Platform", href: "#" },
      { name: "Solutions", href: "#" },
      { name: "Blog", href: "#" },
      { name: "Careers", href: "#" },
    ],
    company: [
      { name: "About Us", href: "#" },
      { name: "Leadership", href: "#" },
      { name: "Press", href: "#" },
      { name: "Partnerships", href: "#" },
      { name: "Sustainability", href: "#" },
    ],
    resources: [
      { name: "Documentation", href: "#" },
      { name: "Tutorials", href: "#" },
      { name: "Webinars", href: "#" },
      { name: "API Access", href: "#" },
      { name: "Help Center", href: "#" },
    ],
  };

  const socialLinks = [
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Facebook, href: "#", label: "Facebook" },
  ];

  return (
    <footer
      id="contact"
      className="relative overflow-hidden bg-[#0075CF] border-t-8 border-black font-['Inter']"
    >
      <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10 pointer-events-none" />

      {/* Newsletter Section */}
      <div className="container-width py-16 border-b-4 border-black/20 relative z-10 px-4 md:px-8">
        <div className="bg-white border-4 border-black p-8 sm:p-12 shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] max-w-4xl mx-auto rotate-[-0.5deg]">
          <div className="flex flex-col lg:flex-row items-center gap-10">
            <div className="flex-1 text-center lg:text-left">
              <h3 className="text-3xl font-black text-black uppercase tracking-tight mb-2 italic">
                Get Weekly Updates.
              </h3>
              <p className="text-xs font-black uppercase tracking-widest text-black/40">
                Course alerts, industry news, and success stories.
              </p>
            </div>
            <div className="w-full lg:w-auto flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1 sm:w-80">
                <Input
                  type="email"
                  placeholder="ENTER EMAIL"
                  className="h-16 rounded-none bg-[#E9E9E9] border-4 border-black text-black placeholder:text-black/20 font-black uppercase tracking-widest px-6 focus:ring-0 focus:border-[#FD5A1A] transition-colors"
                />
              </div>
              <Button className="h-16 px-10 bg-[#FD5A1A] text-white border-4 border-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all rounded-none">
                Subscribe
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-width py-20 relative z-10 px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <div className="bg-white inline-block p-4 border-4 border-black shadow-[6px_6px_0px_0px_#000000] mb-8">
              <img src={logo} alt="AOTMS" className="h-12 w-auto" />
            </div>
            <p className="text-white font-black uppercase tracking-widest text-[10px] leading-relaxed opacity-70">
              Empowering the next generation of tech talent through immersive,
              industry-led learning experiences. We bridge the gap between
              traditional education and industry requirements.
            </p>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8 italic">
              Platform
            </h4>
            <ul className="space-y-4">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[11px] font-black uppercase tracking-widest text-white hover:text-[#FD5A1A] hover:translate-x-1 transition-all inline-block underline decoration-white/0 hover:decoration-[#FD5A1A] underline-offset-4"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8 italic">
              Company
            </h4>
            <ul className="space-y-4">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[11px] font-black uppercase tracking-widest text-white hover:text-black hover:translate-x-1 transition-all inline-block underline decoration-white/0 hover:decoration-black underline-offset-4"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8 italic">
              Resources
            </h4>
            <ul className="space-y-4">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-[11px] font-black uppercase tracking-widest text-white hover:text-black hover:translate-x-1 transition-all inline-block underline decoration-white/0 hover:decoration-black underline-offset-4"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-black uppercase tracking-[0.2em] text-xs mb-8 italic">
              Connect
            </h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
                  Email Us
                </p>
                <a
                  href="mailto:hello@aotms.com"
                  className="text-sm font-black text-white hover:text-[#FD5A1A] transition-colors"
                >
                  HELLO@AOTMS.COM
                </a>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
                  Phone
                </p>
                <a
                  href="tel:+918019952233"
                  className="text-sm font-black text-white hover:text-[#FD5A1A] transition-colors"
                >
                  +91 8019952233
                </a>
              </div>
              <div className="space-y-2">
                <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
                  Visit Us
                </p>
                <p className="text-xs font-black text-white leading-relaxed uppercase tracking-tighter">
                  AOTMS Center, 2nd Floor
                  <br />
                  Vijayawada, AP, India - 520010
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-20 pt-10 border-t-4 border-black/10 flex flex-col md:flex-row items-center justify-between gap-8">
          <p className="text-[10px] font-black uppercase tracking-widest text-white/70">
            © {currentYear} AOTMS PORTAL. BUILT FOR THE FUTURE.
          </p>

          <div className="flex gap-4">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                className="w-12 h-12 bg-white/10 border-2 border-black/20 flex items-center justify-center text-white hover:bg-black hover:border-black hover:text-white transition-all rounded-none"
              >
                <social.icon className="w-5 h-5" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
