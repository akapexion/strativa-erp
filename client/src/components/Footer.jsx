import React from "react";
import { Link } from "react-router-dom";
import { Facebook, Twitter, Linkedin, Github, Mail, Globe } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    Product: ["Employee Dashboard", "Appraisal Management", "Leave Management", "HR Analytics"],
    Company: ["About the Platform", "Our Team", "Corporate Solutions", "Contact HR"],
    Resources: ["User Guide", "Support Center", "Privacy Policy", "Terms of Service"],
  };

  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Top Section: Branding and Links */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-16">
          
          {/* Brand Identity */}
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src="./strativa.png" width={150} className="invert" alt="" />
            </Link>

            <p className="max-w-sm text-slate-400 leading-relaxed mb-6">
              A centralized platform for managing employee records, performance 
              appraisals, leave requests, and workplace insights. Designed to help 
              organizations streamline HR operations and make smarter workforce decisions.
            </p>

            <div className="flex gap-4">
              {[Twitter, Linkedin, Facebook, Github].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all"
                >
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Dynamic Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title} className="col-span-1">
              <h3 className="text-white font-bold mb-6 tracking-wide uppercase text-sm">
                {title}
              </h3>
              <ul className="space-y-4">
                {links.map((link) => (
                  <li key={link}>
                    <Link 
                      to={`/${link.toLowerCase().replace(/\s+/g, "-")}`} 
                      className="hover:text-blue-400 transition-colors"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section: Legal & Language */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
          <div className="flex items-center gap-6">
            <p>© {currentYear} Strativa Workforce Platform. All rights reserved.</p>

            <div className="hidden md:flex items-center gap-2 text-slate-500 hover:text-slate-300 cursor-pointer transition">
              <Globe size={14} />
              <span>Global Access</span>
            </div>
          </div>
          
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-blue-500" />
              <span>hr-support@strativa.com</span>
            </div>

            <div className="flex items-center gap-2">
              <ShieldCheck size={14} className="text-emerald-500" />
              <span className="text-slate-400">Enterprise Data Secure</span>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
};

// Simple internal icon for the legal section
const ShieldCheck = ({ size, className }) => (
  <svg 
    width={size} height={size} viewBox="0 0 24 24" fill="none" 
    stroke="currentColor" strokeWidth="2" strokeLinecap="round" 
    strokeLinejoin="round" className={className}
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
    <path d="m9 12 2 2 4-4" />
  </svg>
);

export default Footer;