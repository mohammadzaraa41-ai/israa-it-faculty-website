import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from '../contexts/LocalizationContext';

// Lazy load pages for better performance
const Home = lazy(() => import('../pages/Home'));
const Prospective = lazy(() => import('../pages/Prospective'));
const CurrentStudents = lazy(() => import('../pages/CurrentStudents'));
const Faculty = lazy(() => import('../pages/Faculty'));
const Alumni = lazy(() => import('../pages/Alumni'));
const Contact = lazy(() => import('../pages/Contact'));
const AIAdvisor = lazy(() => import('../pages/AIAdvisor'));
const ThreeDRoadmap = lazy(() => import('../pages/ThreeDRoadmap'));
const VirtualTour = lazy(() => import('../pages/VirtualTour'));
const LiveLabs = lazy(() => import('../pages/LiveLabs'));
const Events = lazy(() => import('../pages/Events'));
const StudentPortal = lazy(() => import('../pages/StudentPortal'));
const DevelopersNetwork = lazy(() => import('../pages/DevelopersNetwork'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const AdminLogin = lazy(() => import('../pages/AdminLogin'));

const PageLoader = () => (
  <div className="page-loader">
    <div className="loader-spinner"></div>
  </div>
);

const PageWrapper = ({ children, bgClass }) => {
  const { lang } = useLocale();
  const isRtl = lang === 'ar';

  const pageVariants = {
    initial: { opacity: 0, x: isRtl ? -20 : 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: isRtl ? 20 : -20 },
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      transition={{ type: 'tween', ease: 'anticipate', duration: 0.4 }}
      className={`page-wrapper-motion ${bgClass}`}
    >
      <Suspense fallback={<PageLoader />}>
        {children}
      </Suspense>
    </motion.div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  React.useEffect(() => {
    const bgClasses = ['bg-home', 'bg-prospective', 'bg-current', 'bg-faculty', 'bg-alumni', 'bg-contact', 'bg-ai-advisor'];
    document.body.classList.remove(...bgClasses);
    
    let currentClass = 'bg-home';
    const path = location.pathname;
    if (path === '/prospective' || path === '/virtual-tour') currentClass = 'bg-prospective';
    else if (path === '/current' || path === '/roadmap' || path === '/events') currentClass = 'bg-current';
    else if (path === '/faculty' || path === '/live-labs') currentClass = 'bg-faculty';
    else if (path === '/alumni') currentClass = 'bg-alumni';
    else if (path === '/contact') currentClass = 'bg-contact';
    else if (path === '/ai-advisor' || path === '/dev-network') currentClass = 'bg-ai-advisor';
    
    document.body.classList.add(currentClass);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
        <Route path="/prospective" element={<PageWrapper><Prospective /></PageWrapper>} />
        <Route path="/current" element={<PageWrapper><CurrentStudents /></PageWrapper>} />
        <Route path="/faculty" element={<PageWrapper><Faculty /></PageWrapper>} />
        <Route path="/alumni" element={<PageWrapper><Alumni /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
        
        <Route path="/ai-advisor" element={<PageWrapper><AIAdvisor /></PageWrapper>} />
        <Route path="/roadmap" element={<PageWrapper><ThreeDRoadmap /></PageWrapper>} />
        <Route path="/virtual-tour" element={<PageWrapper><VirtualTour /></PageWrapper>} />
        
        <Route path="/live-labs" element={<PageWrapper><LiveLabs /></PageWrapper>} />
        <Route path="/events" element={<PageWrapper><Events /></PageWrapper>} />
        <Route path="/student-portal" element={<PageWrapper><StudentPortal /></PageWrapper>} />
        <Route path="/admin-dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
        <Route path="/dev-network" element={<PageWrapper><DevelopersNetwork /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
