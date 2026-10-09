import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X, Sparkles } from "lucide-react";

const Navbar = ({ userLogged }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const destination = !userLogged
    ? "/login"
    : userLogged.user_role === 0
    ? "/hr360/admin"
    : "/hr360/user";

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "About Us", path: "/about-us" },
    { name: "Modules", path: "/modules" },
    { name: "Contact", path: "/contact-us" },
  ];

  return (
    <nav
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled ? "rgba(248,250,255,0.95)" : "rgba(248,250,255,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid rgba(37,99,235,0.12)"
          : "1px solid rgba(226,232,240,0.6)",
        boxShadow: scrolled
          ? "0 4px 24px rgba(29,78,216,0.08), 0 1px 4px rgba(0,0,0,0.04)"
          : "none",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-3.5">

        {/* Brand Logo & Subtle Apexion Tag */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <img
              src="/strativa.png"
              width={140}
              alt="Strativa"
              className="transition-opacity duration-200 hover:opacity-85"
            />
          </Link>
          <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-slate-400 bg-slate-100/80 px-2 py-0.5 rounded-md border border-slate-200/60">
            by <strong className="text-indigo-600 font-extrabold">Apexion</strong>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold transition-all duration-200 ${
                  isActive
                    ? "text-blue-700 bg-blue-50/80 font-bold shadow-2xs border border-blue-100/80"
                    : "text-slate-600 hover:text-blue-600 hover:bg-slate-100/70"
                }`}
              >
                {link.name}
              </NavLink>
            );
          })}
        </div>

        {/* Right CTA & Mobile Toggle */}
        <div className="flex items-center gap-3">
          {/* Sign In CTA Button */}
          <Link
            to={destination}
            className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white overflow-hidden transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-blue-600/30 cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #1D4ED8 0%, #4338CA 100%)",
            }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{
                background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)",
              }}
            />
            <span className="relative">{userLogged ? "Go to Dashboard" : "Sign In"}</span>
            <ArrowRight size={14} className="relative transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl text-slate-700 hover:text-blue-600 hover:bg-slate-100 transition-colors focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 bg-white/95 backdrop-blur-xl px-6 py-4 shadow-xl space-y-2 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "text-blue-700 bg-blue-50 font-bold border border-blue-100"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Presented by <strong className="text-indigo-600">Apexion</strong></span>
            <Link
              to={destination}
              onClick={() => setMobileMenuOpen(false)}
              className="font-bold text-blue-600 hover:underline"
            >
              {userLogged ? "Portal →" : "Sign In →"}
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;