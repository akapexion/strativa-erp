import React, { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .footer-root { font-family: 'Plus Jakarta Sans', sans-serif; }

  /* Scroll-to-top button */
  .scroll-btn {
    position: relative;
    overflow: hidden;
    transition: transform 0.2s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.2s;
  }
  .scroll-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 20px rgba(99,102,241,0.35);
  }
  .scroll-btn:active { transform: translateY(-1px); }

  /* Ripple on click */
  .scroll-btn::after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(circle, rgba(255,255,255,0.25) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s;
  }
  .scroll-btn:active::after { opacity: 1; }

  /* Chevron bounce */
  @keyframes bounce-up {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-3px); }
  }
  .scroll-btn:hover .chevron-icon { animation: bounce-up 0.6s ease-in-out infinite; }

  /* Apexion brand shimmer */
  @keyframes shimmer {
    0%   { background-position: -200% center; }
    100% { background-position:  200% center; }
  }
  .brand-shimmer {
    background: linear-gradient(90deg, #1e293b 40%, #6366f1 50%, #1e293b 60%);
    background-size: 200% auto;
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    animation: shimmer 4s linear infinite;
  }

  /* Progress bar (scroll indicator) */
  .scroll-progress {
    position: absolute;
    top: 0; left: 0; height: 2px;
    background: linear-gradient(90deg, #6366f1, #a78bfa);
    transition: width 0.1s linear;
    border-radius: 0 2px 2px 0;
  }

  /* Divider dot */
  .dot-divider {
    width: 3px; height: 3px;
    background: #e2e8f0;
    border-radius: 50%;
  }
`;

const Footer = () => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      const total = scrollHeight - clientHeight;
      setScrollProgress(total > 0 ? (scrollTop / total) * 100 : 0);
      setVisible(scrollTop > 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const year = new Date().getFullYear();

  return (
    <>
      <style>{styles}</style>

      <footer className="footer-root w-full bg-white relative mt-auto"
        style={{ borderTop: '1px solid #f1f5f9', boxShadow: '0 -1px 0 #f1f5f9, 0 -4px 16px rgba(0,0,0,0.03)' }}
      >
        {/* Scroll progress bar */}
        <div className="scroll-progress" style={{ width: `${scrollProgress}%` }} />

        <div className="max-w-[1600px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-3">

          {/* ── Left: Copyright ── */}
          <div className="flex items-center gap-2.5">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.15em]">
              © {year}
            </span>
            <div className="dot-divider" />
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-[0.12em]">
              All rights reserved
            </span>
          </div>

          {/* ── Right: Powered By + Scroll Top ── */}
          <div className="flex items-center gap-5">

            {/* Powered by Apexion */}
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-extrabold text-slate-300 uppercase tracking-[0.25em]">
                Powered by
              </span>

              <div className="flex items-baseline gap-0.5">
                <span className="brand-shimmer text-[17px] font-black tracking-tighter leading-none">
                  Apexion
                </span>
                <span className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.15em] mb-0.5">
                  ltd.
                </span>
              </div>
            </div>

            {/* Thin separator */}
            <div className="w-px h-5 bg-gray-100 hidden sm:block" />

            {/* Scroll to top */}
            <button
              onClick={scrollToTop}
              title="Back to top"
              className="scroll-btn flex items-center gap-1.5 bg-indigo-500 hover:bg-indigo-600 text-white pl-3 pr-2.5 py-1.5 rounded-lg text-[11px] font-bold cursor-pointer"
              style={{ boxShadow: '0 2px 8px rgba(99,102,241,0.25)' }}
            >
              <span className="hidden sm:inline tracking-wide">Top</span>
              <ChevronUp size={15} strokeWidth={3} className="chevron-icon" />
            </button>
          </div>

        </div>

        {/* Easter egg watermark */}
        <p className="absolute -top-6 right-5 text-[10px] text-gray-200 pointer-events-none select-none hidden lg:block font-medium tracking-wide">
          Go to Settings to activate Windows.
        </p>
      </footer>
    </>
  );
};

export default Footer;