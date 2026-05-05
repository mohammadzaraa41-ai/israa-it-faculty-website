import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { useLocale } from '../contexts/LocalizationContext';
import SEO from './SEO';

const lazyRetry = (componentImport) => {
  return new Promise((resolve, reject) => {
    const hasReloaded = window.sessionStorage.getItem('page-reloaded');
    
    componentImport()
      .then((val) => {
        window.sessionStorage.removeItem('page-reloaded');
        resolve(val);
      })
      .catch((error) => {
        if (!hasReloaded) {
          window.sessionStorage.setItem('page-reloaded', 'true');
          window.location.reload();
        } else {
          reject(error);
        }
      });
  });
};

const Home = lazy(() => lazyRetry(() => import('../pages/Home')));
const Prospective = lazy(() => lazyRetry(() => import('../pages/Prospective')));
const CurrentStudents = lazy(() => lazyRetry(() => import('../pages/CurrentStudents')));
const Faculty = lazy(() => lazyRetry(() => import('../pages/Faculty')));
const Alumni = lazy(() => lazyRetry(() => import('../pages/Alumni')));
const Contact = lazy(() => lazyRetry(() => import('../pages/Contact')));
const AcademicAdvisor = lazy(() => lazyRetry(() => import('../pages/AcademicAdvisor')));
const ThreeDRoadmap = lazy(() => lazyRetry(() => import('../pages/ThreeDRoadmap')));
const VirtualTour = lazy(() => lazyRetry(() => import('../pages/VirtualTour')));
const LiveLabs = lazy(() => lazyRetry(() => import('../pages/LiveLabs')));
const Events = lazy(() => lazyRetry(() => import('../pages/Events')));
const StudentPortal = lazy(() => lazyRetry(() => import('../pages/StudentPortal')));
const DevelopersNetwork = lazy(() => lazyRetry(() => import('../pages/DevelopersNetwork')));
const AdminDashboard = lazy(() => lazyRetry(() => import('../pages/AdminDashboard')));
const AdminLogin = lazy(() => lazyRetry(() => import('../pages/AdminLogin')));
const Profile = lazy(() => lazyRetry(() => import('../pages/Profile')));
const HonorRoll = lazy(() => lazyRetry(() => import('../pages/HonorRoll')));
const Achievements = lazy(() => lazyRetry(() => import('../pages/Achievements')));
const PrivacyPolicy = lazy(() => lazyRetry(() => import('../pages/PrivacyPolicy')));
const TermsOfUse = lazy(() => lazyRetry(() => import('../pages/TermsOfUse')));
const AcademicCalendar = lazy(() => lazyRetry(() => import('../pages/AcademicCalendar')));

const PageLoader = () => (
  <div className="page-loader">
    <div className="loader-spinner"></div>
  </div>
);

const PageWrapper = ({ children, bgClass }) => {
  const { lang } = useLocale();
  const isRtl = lang === 'ar';

  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
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
  const { lang } = useLocale();
  const location = useLocation();

  React.useEffect(() => {
    const bgClasses = ['bg-home', 'bg-prospective', 'bg-current', 'bg-faculty', 'bg-alumni', 'bg-contact', 'bg-academic-advisor'];
    document.body.classList.remove(...bgClasses);
    
    let currentClass = 'bg-home';
    const path = location.pathname;
    if (path === '/prospective' || path === '/virtual-tour') currentClass = 'bg-prospective';
    else if (path === '/current' || path === '/roadmap' || path === '/events') currentClass = 'bg-current';
    else if (path === '/faculty' || path === '/live-labs') currentClass = 'bg-faculty';
    else if (path === '/alumni' || path === '/honor-roll') currentClass = 'bg-alumni';
    else if (path === '/contact' || path === '/achievements') currentClass = 'bg-contact';
    else if (path === '/academic-advisor' || path === '/dev-network') currentClass = 'bg-academic-advisor';
    
    document.body.classList.add(currentClass);
  }, [location.pathname]);

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageWrapper><SEO /><Home /></PageWrapper>} />
        <Route path="/prospective" element={<PageWrapper><SEO title={lang === 'ar' ? 'الطلبة الجدد' : 'Prospective Students'} /><Prospective /></PageWrapper>} />
        <Route path="/current" element={<PageWrapper><SEO title={lang === 'ar' ? 'الطلبة الحاليون' : 'Current Students'} /><CurrentStudents /></PageWrapper>} />
        <Route path="/faculty" element={<PageWrapper><SEO title={lang === 'ar' ? 'الهيئة التدريسية' : 'Faculty'} /><Faculty /></PageWrapper>} />
        <Route path="/alumni" element={<PageWrapper><SEO title={lang === 'ar' ? 'الخريجون' : 'Alumni'} /><Alumni /></PageWrapper>} />
        <Route path="/contact" element={<PageWrapper><SEO title={lang === 'ar' ? 'تواصل معنا' : 'Contact Us'} /><Contact /></PageWrapper>} />
        
        <Route path="/academic-advisor" element={<PageWrapper><SEO title={lang === 'ar' ? 'الارشاد الأكاديمي' : 'Academic Advisor'} /><AcademicAdvisor /></PageWrapper>} />
        <Route path="/roadmap" element={<PageWrapper><SEO title={lang === 'ar' ? 'خريطة المواد 3D' : '3D Roadmap'} /><ThreeDRoadmap /></PageWrapper>} />
        <Route path="/virtual-tour" element={<PageWrapper><SEO title={lang === 'ar' ? 'الجولة الافتراضية' : 'Virtual Tour'} /><VirtualTour /></PageWrapper>} />
        
        <Route path="/live-labs" element={<PageWrapper><SEO title={lang === 'ar' ? 'المختبرات الحية' : 'Live Labs'} /><LiveLabs /></PageWrapper>} />
        <Route path="/events" element={<PageWrapper><SEO title={lang === 'ar' ? 'الفعاليات' : 'Events'} /><Events /></PageWrapper>} />
        <Route path="/student-portal" element={<PageWrapper><SEO title={lang === 'ar' ? 'بوابة الطالب' : 'Student Portal'} /><StudentPortal /></PageWrapper>} />
        <Route path="/admin-dashboard" element={<PageWrapper><SEO title={lang === 'ar' ? 'لوحة التحكم' : 'Admin Dashboard'} /><AdminDashboard /></PageWrapper>} />
        <Route path="/dev-network" element={<PageWrapper><SEO title={lang === 'ar' ? 'شبكة المطورين' : 'Dev Network'} /><DevelopersNetwork /></PageWrapper>} />
        <Route path="/profile" element={<PageWrapper><SEO title={lang === 'ar' ? 'الملف الشخصي' : 'Profile'} /><Profile /></PageWrapper>} />
        <Route path="/honor-roll" element={<PageWrapper><SEO title={lang === 'ar' ? 'لوحة الشرف' : 'Honor Roll'} /><HonorRoll /></PageWrapper>} />
        <Route path="/achievements" element={<PageWrapper><SEO title={lang === 'ar' ? 'الإنجازات' : 'Achievements'} /><Achievements /></PageWrapper>} />
        <Route path="/privacy-policy" element={<PageWrapper><SEO title={lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'} /><PrivacyPolicy /></PageWrapper>} />
        <Route path="/terms-of-use" element={<PageWrapper><SEO title={lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'} /><TermsOfUse /></PageWrapper>} />
        <Route path="/academic-calendar" element={<PageWrapper><SEO title={lang === 'ar' ? 'التقويم الجامعي' : 'Academic Calendar'} /><AcademicCalendar /></PageWrapper>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
