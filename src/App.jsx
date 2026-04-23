import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Chatbot from './components/Chatbot';
import AnimatedRoutes from './components/AnimatedRoutes';
import './App.css';

// Global Background Component that reacts to route changes
const GlobalBackground = () => {
  const location = useLocation();
  const [bgClass, setBgClass] = useState('bg-home');

  useEffect(() => {
    const path = location.pathname;
    let currentClass = 'bg-home';
    if (path === '/prospective' || path === '/virtual-tour') currentClass = 'bg-prospective';
    else if (path === '/current' || path === '/roadmap' || path === '/events') currentClass = 'bg-current';
    else if (path === '/faculty' || path === '/live-labs') currentClass = 'bg-faculty';
    else if (path === '/alumni') currentClass = 'bg-alumni';
    else if (path === '/contact') currentClass = 'bg-contact';
    else if (path === '/ai-advisor' || path === '/dev-network') currentClass = 'bg-ai-advisor';
    
    setBgClass(currentClass);
  }, [location.pathname]);

  return <div className={`global-page-bg ${bgClass}`} />;
};

const App = () => {
  return (
    <Router>
      <GlobalBackground />
      <Navbar />
      <main className="main-content">
        <AnimatedRoutes />
      </main>
      <Chatbot />
    </Router>
  );
};

export default App;
