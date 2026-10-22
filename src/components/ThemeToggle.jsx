import React from "react";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

/**
 * Fixed floating theme toggle pill — sits bottom-right on all public pages.
 * Keeps the navbar clean while still giving users easy access to dark/light mode.
 */
const ThemeToggle = () => {
  const { isDark, toggle } = useTheme();

  return (
    <button
      onClick={toggle}
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-2.5 rounded-full cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg"
      style={{
        background: isDark
          ? "rgba(30, 41, 59, 0.95)"
          : "rgba(255, 255, 255, 0.95)",
        border: isDark
          ? "1px solid rgba(71, 85, 105, 0.8)"
          : "1px solid rgba(226, 232, 240, 0.9)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        boxShadow: isDark
          ? "0 8px 24px rgba(0,0,0,0.4)"
          : "0 8px 24px rgba(0,0,0,0.10)",
      }}
    >
      {isDark ? (
        <>
          <Sun size={15} className="text-amber-400" />
          <span className="text-xs font-semibold text-slate-300 tracking-wide">
            Light
          </span>
        </>
      ) : (
        <>
          <Moon size={15} className="text-slate-600" />
          <span className="text-xs font-semibold text-slate-600 tracking-wide">
            Dark
          </span>
        </>
      )}
    </button>
  );
};

export default ThemeToggle;
