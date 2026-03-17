import React from 'react';
import { ChevronUp } from 'lucide-react';

const Footer = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-white border-t border-gray-200 py-4 px-6 relative mt-auto">
      <div className="max-w-[1600px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        
        {/* Left Side: Copyright */}
        <div className="text-gray-600 text-sm font-medium tracking-tight">
          COPYRIGHT © 2026, All rights Reserved
        </div>

        {/* Right Side: Powered By & Scroll Top */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
              Powered By
            </span>
            {/* Innovador Solutions Logo Placeholder */}
            <div className="flex flex-col leading-none">
              <span className="text-slate-800 font-black text-lg tracking-tighter">
                Apexion
              </span>
              <span className="text-[10px] text-blue-500 font-bold tracking-[0.2em] uppercase ml-1">
                ltd.
              </span>
            </div>
          </div>

          {/* Scroll to Top Button */}
          <button 
            onClick={scrollToTop}
            className="bg-indigo-500 hover:bg-indigo-600 text-white p-2 rounded-lg shadow-lg transition-all transform hover:-translate-y-1"
            title="Go to top"
          >
            <ChevronUp size={20} strokeWidth={3} />
          </button>
        </div>

      </div>
      
      {/* Windows Activation Watermark Simulation (Optional/Easter Egg) */}
      <div className="absolute -top-8 right-4 text-gray-300 text-[10px] pointer-events-none select-none hidden lg:block">
        Go to Settings to activate Windows.
      </div>
    </footer>
  );
};

export default Footer;