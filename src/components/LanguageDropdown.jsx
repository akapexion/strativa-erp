import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const LanguageDropdown = ({ isDark }) => {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const options = [
    { code: 'en', label: 'English', short: 'EN' },
    { code: 'ur', label: 'اردو', short: 'UR' },
  ];

  const current = options.find((o) => o.code === lang);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((p) => !p)}
        aria-label="Select language"
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all duration-200"
        style={{
          background: isDark ? 'rgba(30,41,59,0.8)' : 'rgba(241,245,249,0.9)',
          border: isDark ? '1px solid rgba(71,85,105,0.6)' : '1px solid rgba(226,232,240,0.8)',
          color: isDark ? '#94a3b8' : '#475569',
        }}
      >
        <span>{current?.short}</span>
        <ChevronDown
          size={11}
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        />
      </button>

      {open && (
        <div
          className="absolute top-full left-0 mt-2 w-32 rounded-xl overflow-hidden z-[9999]"
          style={{
            background: isDark ? 'rgba(15,23,42,0.98)' : '#fff',
            border: isDark ? '1px solid rgba(71,85,105,0.6)' : '1px solid rgba(226,232,240,0.9)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }}
        >
          {options.map((opt) => (
            <button
              key={opt.code}
              onClick={() => { setLang(opt.code); setOpen(false); }}
              className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold transition-colors duration-150 cursor-pointer"
              style={{
                color: lang === opt.code
                  ? '#2563EB'
                  : isDark ? '#94a3b8' : '#475569',
                background: lang === opt.code
                  ? isDark ? 'rgba(37,99,235,0.12)' : 'rgba(239,246,255,0.9)'
                  : 'transparent',
              }}
            >
              <span>{opt.label}</span>
              {lang === opt.code && (
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default LanguageDropdown;
