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
      className="relative overflow-hidden"
      style={{
        background:
          "linear-gradient(175deg, #005fa3 0%, #0075CF 50%, #004d87 100%)",
      }}
    >
      {/* Subtle grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)",
          backgroundSize: "50px 50px",
        }}
      />
      {/* Orange accent top border */}
      <div
        className="absolute top-0 left-0 right-0 h-[3px]"
        style={{
          background:
            "linear-gradient(90deg, #0075CF 0%, #FD5A1A 50%, #0075CF 100%)",
        }}
      />

      {/* Newsletter Section */}
      <div className="container-width section-padding !py-12 border-b border-white/10 relative z-10">
        <div className="text-center max-w-md mx-auto">
          <h3 className="text-xl font-semibold text-white mb-2">
            Join our newsletter
          </h3>
          <p className="text-sm text-white/80 mb-6">
            We'll send you a newsletter once per week. No spam.
          </p>
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Input
                type="email"
                placeholder="Enter your email"
                className="pl-10 h-11 rounded-lg bg-white/5 border border-white/10 text-white placeholder:text-white/30"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <Button variant="accent" className="h-11 px-6">
              Subscribe
            </Button>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container-width section-padding !py-10 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
          {/* Explore Links */}
          <div>
            <h4 className="font-medium text-white/70 text-sm mb-4 uppercase tracking-wider">
              Explore
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.explore.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-white/90 hover:text-[#FD5A1A] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h4 className="font-medium text-white/70 text-sm mb-4 uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-white/90 hover:text-[#FD5A1A] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources Links */}
          <div>
            <h4 className="font-medium text-white/70 text-sm mb-4 uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-2.5">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    className="text-sm text-white/90 hover:text-[#FD5A1A] transition-colors"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-medium text-white/70 text-sm mb-4 uppercase tracking-wider">
              Contact
            </h4>
            <ul className="space-y-2.5">
              <li>
                <a
                  href="tel:+918019952233"
                  className="text-sm text-white/90 hover:text-[#FD5A1A] transition-colors"
                >
                  (+91) 8019952233
                </a>
              </li>
              <li>
                <a
                  href="mailto:hello@aotms.com"
                  className="text-sm text-white/90 hover:text-[#FD5A1A] transition-colors"
                >
                  hello@aotms.com
                </a>
              </li>
            </ul>
          </div>

          {/* Address */}
          <div className="col-span-2">
            <h4 className="font-medium text-white/70 text-sm mb-4 uppercase tracking-wider">
              Address
            </h4>
            <p className="text-sm text-white/90 leading-relaxed">
              Auram Creative Center, 19th Floor
              <br />
              Vijayawada, Andhra Pradesh
              <br />
              India - 520001
            </p>
            <p className="text-xs text-white/60 mt-2">
              Serving students across Vijayawada and beyond
            </p>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-10 pt-9 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 ">
          <div className="flex items-center gap-2">
            <div className="bg-white rounded-xl px-4 py-2 shadow-sm border border-white/10">
              <img
                src={logo}
                alt="AOTMS Logo"
                className="h-14 sm:h-18 md:h-24 px-2"
              />
            </div>
          </div>

          <p className="text-sm text-white/70">
            © {currentYear} AOTMS. All rights reserved.
          </p>

          <div className="flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="w-8 h-8 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-[#FD5A1A] hover:border-[#FD5A1A] hover:text-white transition-all duration-300 text-white/80"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
