import React, { useEffect, useState } from 'react';

const DISPLAY_MS  = 15000;
const FADE_MS     = 500;
const SESSION_KEY = 'strativa-loaded';

// ── Evaluated once at module load, BEFORE StrictMode double-invoke ────────
// StrictMode runs effects twice but module-level code runs only once,
// so SHOULD_SHOW is a stable bool that survives the cleanup/re-run cycle.
const SHOULD_SHOW = !sessionStorage.getItem(SESSION_KEY);
if (SHOULD_SHOW) sessionStorage.setItem(SESSION_KEY, '1');

const PageLoader = () => {
  const [mounted, setMounted] = useState(SHOULD_SHOW);
  const [fading,  setFading]  = useState(false);

  useEffect(() => {
    if (!SHOULD_SHOW) return;

    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';

    // StrictMode will clear these on first run and re-run the effect —
    // that second run also passes the SHOULD_SHOW guard and sets fresh timers.
    const fadeTimer = setTimeout(() => setFading(true), DISPLAY_MS);
    const killTimer = setTimeout(() => {
      setMounted(false);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    }, DISPLAY_MS + FADE_MS);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(killTimer);
      document.documentElement.style.overflow = '';
      document.body.style.overflow = '';
    };
  }, []);

  if (!mounted) return null;

  return (
    <div
      style={{
        position:             'fixed',
        inset:                 0,
        zIndex:                9999,
        display:              'flex',
        alignItems:           'center',
        justifyContent:       'center',
        backdropFilter:       'blur(48px)',
        WebkitBackdropFilter: 'blur(48px)',
        background:           'rgba(255,255,255,0.18)',
        opacity:              fading ? 0 : 1,
        transition:           `opacity ${FADE_MS}ms ease`,
        pointerEvents:        fading ? 'none' : 'all',
      }}
    >
      <img
        src="/strativa.png"
        alt="Strativa"
        style={{
          width:      'clamp(140px, 20vw, 220px)',
          opacity:    fading ? 0 : 1,
          transition: `opacity ${FADE_MS}ms ease`,
        }}
      />
    </div>
  );
};

export default PageLoader;
