import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import AnimatedRoutes from './components/AnimatedRoutes';
import { AdminProvider } from './contexts/AdminContext';
import { AuthProvider } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import './App.css';

// Global Background Component that reacts to route changes
const GlobalBackground = () => {
  const location = useLocation();
  const [bgStyle, setBgStyle] = useState({});
  const [bgClass, setBgClass] = useState('bg-home');

  useEffect(() => {
    const path = location.pathname;
    let currentClass = 'bg-home';
    let currentStyle = {};
    
    if (path === '/' || path === '') {
      currentClass = 'bg-home';
      currentStyle = {
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.7)), url('/main-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      };
    } else if (path === '/prospective' || path === '/virtual-tour') currentClass = 'bg-prospective';
    else if (path === '/current' || path === '/roadmap' || path === '/events') currentClass = 'bg-current';
    else if (path === '/faculty' || path === '/live-labs') {
      currentClass = 'bg-faculty';
      currentStyle = {
        backgroundImage: `linear-gradient(rgba(5, 23, 56, 0.7), rgba(5, 23, 56, 0.9)), url('/faculty-bg.jpg')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed'
      };
    }
    else if (path === '/alumni') currentClass = 'bg-alumni';
    else if (path === '/contact') currentClass = 'bg-contact';
    else if (path === '/ai-advisor' || path === '/dev-network') currentClass = 'bg-ai-advisor';
    
    setBgClass(currentClass);
    setBgStyle(currentStyle);
  }, [location.pathname]);

  return <div className={`global-page-bg ${bgClass}`} style={bgStyle} />;
};

const App = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <AdminProvider>
          <Router>
            <GlobalBackground />
            <Navbar />
            <main className="main-content">
              <AnimatedRoutes />
            </main>
            <Chatbot />
          </Router>
        </AdminProvider>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;
