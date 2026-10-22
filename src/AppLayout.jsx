import React, { useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ThemeToggle from './components/ThemeToggle';
import LiveChat from './components/LiveChat';
import PageLoader from './components/PageLoader';
import { Outlet } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';

let hasRecordedThisLoad = false;

const AppLayoutInner = ({ userLogged }) => {
  const { isDark } = useTheme();
  const { dir } = useLanguage();

  useEffect(() => {
    // Prevent StrictMode double-invocation in development
    if (hasRecordedThisLoad) return;

    try {
      // Do NOT increment on page refresh or within the same browser session.
      // sessionStorage persists across refreshes and page navigation within the same tab,
      // but resets when the user closes the browser/tab and visits again later.
      const SESSION_VISIT_KEY = 'strativa_visited_session';
      if (sessionStorage.getItem(SESSION_VISIT_KEY)) {
        return;
      }

      hasRecordedThisLoad = true;
      sessionStorage.setItem(SESSION_VISIT_KEY, '1');

      // Record a single hit for this new visit session
      fetch('https://abacus.jasoncameron.dev/hit/strativa-hrms.com/visitors')
        .catch(() => {});
    } catch {
      // Silently ignore if storage or network is restricted
    }
  }, []);

  return (
    <div className={isDark ? 'dark' : ''} dir={dir}>
      <PageLoader />
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
        <Navbar userLogged={userLogged} />
        <Outlet />
        <Footer />
        <ThemeToggle />
        <LiveChat />
      </div>
    </div>
  );
};

const AppLayout = ({ userLogged }) => (
  <ThemeProvider>
    <LanguageProvider>
      <AppLayoutInner userLogged={userLogged} />
    </LanguageProvider>
  </ThemeProvider>
);

export default AppLayout;
