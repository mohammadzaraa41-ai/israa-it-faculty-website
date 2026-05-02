import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import AnimatedRoutes from './components/AnimatedRoutes';
import { AdminProvider } from './contexts/AdminContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { ToastProvider } from './contexts/ToastContext';
import './App.css';

const GlobalBackground = () => {
  const location = useLocation();
  const [bgClass, setBgClass] = useState('bg-home');

  useEffect(() => {
    const path = location.pathname;
    let currentClass = 'bg-home';
    
    if (path === '/' || path === '') currentClass = 'bg-home';
    else if (path === '/prospective' || path === '/virtual-tour') currentClass = 'bg-prospective';
    else if (path === '/current' || path === '/roadmap' || path === '/events') currentClass = 'bg-current';
    else if (path === '/faculty' || path === '/live-labs') currentClass = 'bg-faculty';
    else if (path === '/alumni') currentClass = 'bg-alumni';
    else if (path === '/contact') currentClass = 'bg-contact';
    else if (path === '/ai-advisor' || path === '/dev-network') currentClass = 'bg-ai-advisor';
    
    setBgClass(currentClass);
  }, [location.pathname]);

  return <div className={`global-page-bg ${bgClass}`} />;
};
 
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const App = () => {
  return (
    <ToastProvider>
      <AuthProvider>
        <DataProvider>
          <AdminProvider>
            <Router>
              <ScrollToTop />
              <GlobalBackground />
              <Navbar />
              <main className="main-content">
                <AnimatedRoutes />
              </main>
              <Footer />
              <Chatbot />
            </Router>
          </AdminProvider>
        </DataProvider>
      </AuthProvider>
    </ToastProvider>
  );
};

export default App;
