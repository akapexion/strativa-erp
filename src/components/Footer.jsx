import React from "react";
import { Link } from "react-router-dom";
import { 
  Facebook, 
  Twitter, 
  Linkedin, 
  Github, 
  Mail, 
  Globe,
  ArrowUpRight,
  Shield
} from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: [
      "Employee Dashboard",
      "Appraisal Management",
      "Leave Management",
      "HR Analytics"
    ],
    Company: [
      "About the Platform",
      "Our Team",
      "Corporate Solutions",
      "Contact HR"
    ],
    Resources: [
      "User Guide",
      "Support Center",
      "Privacy Policy",
      "Terms of Service"
    ]
  };

  const socialLinks = [
    { Icon: Twitter, label: "Twitter" },
    { Icon: Linkedin, label: "LinkedIn" },
    { Icon: Facebook, label: "Facebook" },
    { Icon: Github, label: "GitHub" }
  ];

  return (
    <footer className="relative bg-gradient-to-b from-slate-950 to-slate-900 text-slate-300 overflow-hidden">
      {/* Decorative gradient accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Section: Branding and Links */}
        <div className="pt-20 pb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            
            {/* Brand Identity */}
            <div className="lg:col-span-2">
              <Link 
                to="/" 
                className="inline-block mb-8 transition-transform duration-300 hover:scale-105"
              >
                <img 
                  src="./strativa.png" 
                  width={140} 
                  className="invert brightness-110" 
                  alt="Strativa" 
                />
              </Link>

              <p className="max-w-sm text-slate-400 leading-relaxed mb-8 text-sm">
                A centralized platform for managing employee records, performance 
                appraisals, leave requests, and workforce insights. Designed to help 
                organizations streamline HR operations and make smarter decisions.
              </p>

              {/* Social Icons */}
              <div className="flex gap-3">
                {socialLinks.map(({ Icon, label }) => (
                  <a 
                    key={label}
                    href="#" 
                    aria-label={label}
                    className="group w-10 h-10 rounded-full bg-slate-800/50 backdrop-blur-sm flex items-center justify-center hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-500 text-slate-400 hover:text-white transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1"
                  >
                    <Icon size={18} className="transition-transform duration-300 group-hover:scale-110" />
                  </a>
                ))}
              </div>
            </div>

            {/* Dynamic Link Columns */}
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="lg:col-span-1">
                <h3 className="text-white font-semibold mb-6 tracking-wide uppercase text-xs letter-spacing-1">
                  {title}
                </h3>
                <ul className="space-y-3.5">
                  {links.map((link) => (
                    <li key={link}>
                      <Link 
                        to={`/${link.toLowerCase().replace(/\s+/g, "-")}`} 
                        className="text-slate-400 hover:text-blue-400 transition-colors duration-200 text-sm flex items-center gap-1 group"
                      >
                        <span>{link}</span>
                        <ArrowUpRight 
                          size={12} 
                          className="opacity-0 -translate-x-1 translate-y-1 group-hover:opacity-100 group-hover:translate-x-0 group-hover:translate-y-0 transition-all duration-200" 
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent" />

        {/* Bottom Section: Legal, Email & Security */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-8 text-sm">
          <div className="flex items-center gap-6 text-slate-400">
            <p className="text-xs md:text-sm">
              © {currentYear} <span className="text-slate-300 font-medium">Strativa</span> Workforce Platform. All rights reserved.
            </p>
            <div className="hidden md:flex items-center gap-2 text-slate-500 hover:text-blue-400 cursor-pointer transition-colors duration-200 group">
              <Globe size={14} className="group-hover:scale-110 transition-transform" />
              <span>Global Access</span>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
            {/* Email */}
            <a 
              href="mailto:hr-support@strativa.com"
              className="flex items-center gap-2 text-slate-400 hover:text-blue-400 transition-colors duration-200 group"
            >
              <Mail 
                size={14} 
                className="text-blue-500 group-hover:scale-110 transition-transform" 
              />
              <span className="text-xs md:text-sm">hr-support@strativa.com</span>
            </a>

            {/* Security Badge */}
            <div className="flex items-center gap-2 text-slate-400 bg-slate-800/30 backdrop-blur-sm px-3 py-1.5 rounded-full border border-slate-700/50 hover:border-emerald-500/30 transition-colors duration-200">
              <Shield 
                size={14} 
                className="text-emerald-500" 
              />
              <span className="text-xs md:text-sm">Enterprise Secure</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient line */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
    </footer>
  );
};

export default Footer;