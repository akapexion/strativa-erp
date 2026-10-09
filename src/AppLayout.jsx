import React from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import { Outlet } from 'react-router-dom';
import { ThemeProvider, useTheme } from './context/ThemeContext';

const AppLayoutInner = ({ userLogged }) => {
  const { isDark } = useTheme();
  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300">
        <Navbar userLogged={userLogged} />
        <Outlet />
        <Footer />
      </div>
    </div>
  );
};

const AppLayout = ({ userLogged }) => (
  <ThemeProvider>
    <AppLayoutInner userLogged={userLogged} />
  </ThemeProvider>
);

export default AppLayout;
