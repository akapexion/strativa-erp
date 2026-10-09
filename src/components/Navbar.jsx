import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Navbar = ({ userLogged }) => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const destination = !userLogged
    ? "/login"
    : userLogged.user_role === 0
    ? "/hr360/admin"
    : "/hr360/user";

  return (
    <nav
      className="sticky top-0 z-50 w-full transition-all duration-300"
      style={{
        background: scrolled ? "rgba(248,250,255,0.92)" : "rgba(248,250,255,0.7)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled
          ? "1px solid rgba(37,99,235,0.1)"
          : "1px solid rgba(226,232,240,0.5)",
        boxShadow: scrolled
          ? "0 4px 24px rgba(29,78,216,0.07), 0 1px 4px rgba(0,0,0,0.04)"
          : "none",
      }}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between px-6 md:px-12 py-3.5">

        {/* Logo */}
        <Link to="/" className="flex-shrink-0">
          <img
            src="./strativa.png"
            width={140}
            alt="Strativa"
            className="transition-opacity duration-200 hover:opacity-80"
          />
        </Link>

        {/* Sign In CTA */}
        <Link
          to={destination}
          className="group relative inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black text-white overflow-hidden transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0"
          style={{
            background: "linear-gradient(135deg, #1D4ED8 0%, #4338CA 100%)",
            boxShadow: "0 4px 14px rgba(29,78,216,0.3), 0 1px 3px rgba(29,78,216,0.2)",
          }}
        >
          <span
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            style={{
              background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.18) 50%, transparent 70%)",
            }}
          />
          <span className="relative">{userLogged ? "Go to Dashboard" : "Sign In"}</span>
          <ArrowRight size={14} className="relative transition-transform duration-200 group-hover:translate-x-0.5" />
        </Link>

      </div>
    </nav>
  );
};

export default Navbar;