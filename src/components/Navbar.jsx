import React, { useState, useEffect } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import { ArrowRight, Menu, X, Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const Navbar = ({ userLogged }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { isDark, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const destination = !userLogged
    ? "/login"
    : userLogged.user_role === 0
    ? "/hr360/admin"
    : "/hr360/user";

  const navLinks = [
    { name: "Modules", path: "/modules" },
    { name: "The Process", path: "/about-us" }
  ];

  const navBg = isDark
    ? scrolled ? "rgba(15,23,42,0.97)" : "rgba(15,23,42,0.90)"
    : scrolled ? "rgba(248,250,255,0.95)" : "rgba(248,250,255,0.85)";

  const borderColor = isDark
    ? scrolled ? "rgba(99,102,241,0.18)" : "rgba(71,85,105,0.35)"
    : scrolled ? "rgba(37,99,235,0.12)" : "rgba(226,232,240,0.6)";

  const shadow = scrolled
    ? isDark
      ? "0 4px 24px rgba(0,0,0,0.4)"
      : "0 4px 24px rgba(29,78,216,0.08), 0 1px 4px rgba(0,0,0,0.04)"
    : "none";

  return (
    <nav
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: navBg,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: `1px solid ${borderColor}`,
        boxShadow: shadow,
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-3.5">

        {/* Brand Logo */}
        <div className="flex items-center gap-3">
          <Link to="/" className="flex-shrink-0 flex items-center gap-2">
            <img
              src="/strativa.png"
              width={140}
              alt="Strativa"
              className={`transition-opacity duration-200 hover:opacity-85 ${isDark ? "invert brightness-110" : ""}`}
            />
          </Link>
        </div>

        {/* Right: Theme Toggle + CTA + Mobile Toggle */}
        <div className="flex items-center gap-2.5">

          {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center gap-1 lg:gap-2">
          {navLinks.map((link) => {
            return (
              <NavLink
                key={link.name}
                to={link.path}
                className={`px-3.5 py-2 rounded-xl text-sm font-semibold tracking-wider transition-all duration-200 ${isDark ? "text-white" : "text-gray-500"}  `}
              >
                {link.name}
              </NavLink>
            );
          })}
        </div>

          {/* Dark/Light Toggle */}
          <button
            onClick={toggle}
            aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
            className="relative w-9 h-9 flex items-center justify-center transition-all duration-200 cursor-pointer hover:border-blue-300 dark:hover:border-indigo-500 hover:bg-blue-50 dark:hover:bg-slate-700 shadow-xs group"
          >
            <span className="absolute inset-0 rounded-xl transition-opacity duration-300" />
            {isDark ? (
              <Sun size={16} className="text-amber-400 group-hover:rotate-12 transition-transform duration-300" />
            ) : (
              <Moon size={16} className="text-slate-600 group-hover:-rotate-12 transition-transform duration-300" />
            )}
          </button>

          {/* Sign In CTA */}
          <Link
            to={destination}
            className="group relative hidden sm:inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white overflow-hidden transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] shadow-md hover:shadow-lg hover:shadow-blue-600/30 cursor-pointer"
            style={{ background: "linear-gradient(135deg, #1D4ED8 0%, #4338CA 100%)" }}
          >
            <span
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)" }}
            />
            <span className="relative">{userLogged ? "Dashboard" : "Sign In"}</span>
            <ArrowRight size={14} className="relative transition-transform duration-200 group-hover:translate-x-1" />
          </Link>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className="md:hidden p-2 rounded-xl text-slate-700 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none cursor-pointer"
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200/80 dark:border-slate-700/80 bg-white/95 dark:bg-slate-900/97 backdrop-blur-xl px-6 py-4 shadow-xl space-y-2">
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
                      ? "text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 font-bold border border-blue-100 dark:border-blue-500/20"
                      : "text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={toggle}
                className="flex items-center gap-2 text-xs font-bold text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 cursor-pointer"
              >
                {isDark ? <><Sun size={13} className="text-amber-400" />Light mode</> : <><Moon size={13} />Dark mode</>}
              </button>
            </div>
            <Link
              to={destination}
              onClick={() => setMobileMenuOpen(false)}
              className="font-bold text-sm text-blue-600 dark:text-blue-400 hover:underline"
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