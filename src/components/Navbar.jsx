import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLocale } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { Moon, Sun, Menu, X, Globe, ChevronDown, ChevronUp, PlayCircle, ArrowRight, ArrowLeft, User, Lock, Eye, EyeOff, Phone, Calendar, GraduationCap, Clock, BookOpen, UserCheck } from 'lucide-react';
import logoUrl from '../assets/WhatsApp Image 2026-04-20 at 10.05.30 PM.jpeg';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';
import MajorsShowcase from './MajorsShowcase';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLocale();
  const { isLoginOpen, toggleLogin } = useAuth();
  const [activeTab, setActiveTab ] = useState('login'); // 'login' or 'register'
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    academics: false,
    campus: false,
    portals: false
  });


  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const closeMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const menuItems = React.useMemo(() => [
    {
      id: 'academics',
      title: t('nav.academics'),
      links: [
        { to: '/prospective', label: t('nav.prospective') },
        { to: '/current', label: t('nav.current') },
        { to: '/faculty', label: t('nav.faculty') },
        { to: '/ai-advisor', label: t('nav.ai_advisor') },
        { to: '/roadmap', label: t('nav.roadmap') }
      ]
    },
    {
      id: 'campus',
      title: t('nav.campus'),
      links: [
        { to: '/virtual-tour', label: t('nav.virtual_tour') },
        { to: '/live-labs', label: t('nav.live_labs') },
        { to: '/events', label: t('nav.events') },
        { to: '/contact', label: t('nav.contact') }
      ]
    },
    {
      id: 'portals',
      title: t('nav.portals'),
      links: [
        { to: '/student-portal', label: t('nav.student_portal') },
        { to: '/admin-dashboard', label: t('nav.admin_dashboard') },
        { to: '/alumni', label: t('nav.alumni') },
        { to: '/dev-network', label: t('nav.dev_network') }
      ]
    },
    {
      id: 'auth',
      title: lang === 'ar' ? 'نظام التسجيل' : 'Registration System',
      links: [
        { to: '#', label: lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account', onClick: () => { setActiveTab('register'); toggleLogin(true); } },
        { to: '#', label: lang === 'ar' ? 'تسجيل الدخول' : 'Sign In', onClick: () => { setActiveTab('login'); toggleLogin(true); } }
      ]
    }
  ], [t, lang, toggleLogin]);

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="mobile-toggle" 
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
      </button>

      {/* Backdrop for mobile */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="sidebar-backdrop"
            onClick={closeMenu}
          />
        )}
      </AnimatePresence>

      <nav className={`sidebar ${isMobileMenuOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo clickable-logo" onClick={() => { setActiveTab('login'); toggleLogin(true); }}>
            <img src={logoUrl} alt="Logo" className="logo-img" />
            <span className="logo-text">{t('faculty_name')}</span>
          </div>
        </div>

        <div className="sidebar-content">
          <ul className="sidebar-links">
            <li className="sidebar-item">
              <NavLink 
                to="/" 
                className={({isActive}) => isActive ? 'sidebar-link active' : 'sidebar-link'}
                onClick={closeMenu}
              >
                {t('nav.home') || 'Home'}
              </NavLink>
            </li>

            {menuItems.map((section) => (
              <li key={section.id} className="sidebar-section">
                <button 
                  className={`section-header ${expandedSections[section.id] ? 'expanded' : ''}`}
                  onClick={() => toggleSection(section.id)}
                >
                  <span>{section.title}</span>
                  {expandedSections[section.id] ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>
                
                <AnimatePresence>
                  {expandedSections[section.id] && (
                    <motion.ul 
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="section-links"
                    >
                      {section.links.map(link => (
                        <li key={link.to}>
                          {link.to === '#' ? (
                            <button className="sub-link" onClick={() => { link.onClick(); closeMenu(); }}>
                              {link.label}
                            </button>
                          ) : (
                            <NavLink 
                              to={link.to} 
                              className={({isActive}) => isActive ? 'sub-link active' : 'sub-link'}
                              onClick={closeMenu}
                            >
                              {link.label}
                            </NavLink>
                          )}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </li>
            ))}
          </ul>

          <div className="sidebar-main-actions">
            <button className="btn-primary sidebar-btn" onClick={() => { setIsShowcaseOpen(true); closeMenu(); }}>
               {t('hero.cta')}
               {lang === 'ar' ? <ArrowLeft size={18} /> : <ArrowRight size={18} />}
            </button>
            <button className="btn-outline sidebar-btn">
               <PlayCircle size={18} />
               {t('hero.video_text')}
            </button>
          </div>
        </div>

        <div className="sidebar-footer">
          <div className="sidebar-actions">
            <button className="icon-btn highlight-btn" onClick={toggleLang} title="Toggle Language">
              <Globe size={18} />
              <span>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>
            <button className="icon-btn highlight-btn" onClick={toggleTheme} title="Toggle Theme">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <MajorsShowcase isOpen={isShowcaseOpen} onClose={() => setIsShowcaseOpen(false)} />


      {/* Login Modal */}
      <AnimatePresence>
        {isLoginOpen && (
          <div className="login-modal-overlay">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="login-modal glass-panel"
            >
              <button className="close-modal" onClick={() => toggleLogin(false)}>
                <X size={24} />
              </button>
              
              <div className="login-header">
                <div className="tab-switcher">
                  <button 
                    className={activeTab === 'login' ? 'active' : ''} 
                    onClick={() => setActiveTab('login')}
                  >
                    {lang === 'ar' ? 'دخول' : 'Login'}
                  </button>
                  <button 
                    className={activeTab === 'register' ? 'active' : ''} 
                    onClick={() => setActiveTab('register')}
                  >
                    {lang === 'ar' ? 'تسجيل جديد' : 'Register'}
                  </button>
                </div>
              </div>

              {activeTab === 'login' ? (
                <form className="login-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="input-group">
                    <label>
                      <User size={18} />
                      {lang === 'ar' ? 'الرقم الجامعي' : 'University ID'}
                    </label>
                    <input type="text" placeholder={lang === 'ar' ? 'مثال: 20240001' : 'e.g. 20240001'} />
                  </div>

                  <div className="input-group">
                    <label>
                      <Lock size={18} />
                      {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                    </label>
                    <div className="password-input">
                      <input type={showPassword ? "text" : "password"} placeholder="••••••••" />
                      <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary login-btn">
                    {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  </button>

                  <div className="login-help">
                    <a href="#">{lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}</a>
                  </div>
                </form>
              ) : (
                <form className="register-form" onSubmit={(e) => e.preventDefault()}>
                  <div className="form-grid">
                    <div className="input-group full-width">
                      <label><UserCheck size={18} /> {lang === 'ar' ? 'الاسم الكامل (من 3 مقاطع)' : 'Full Name (3 segments)'}</label>
                      <input type="text" placeholder={lang === 'ar' ? 'مثال: أحمد محمد علي' : 'e.g. Ahmed Mohamed Ali'} />
                    </div>

                    <div className="input-group">
                      <label><Phone size={18} /> {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                      <input type="tel" placeholder="07XXXXXXXX" />
                    </div>

                    <div className="input-group">
                      <label><GraduationCap size={18} /> {lang === 'ar' ? 'الرقم الجامعي' : 'University ID'}</label>
                      <input type="text" placeholder="20XXXXXXXX" />
                    </div>

                    <div className="input-group">
                      <label><Calendar size={18} /> {lang === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth'}</label>
                      <input type="date" />
                    </div>

                    <div className="input-group">
                      <label><BookOpen size={18} /> {lang === 'ar' ? 'التخصص' : 'Major'}</label>
                      <select className="custom-select">
                        <option value="">{lang === 'ar' ? 'اختر التخصص' : 'Select Major'}</option>
                        <optgroup label={lang === 'ar' ? 'علم الحاسوب وفروعه' : 'Computer Science Branches'}>
                          <option value="cs">{lang === 'ar' ? 'علم حاسوب (عام)' : 'Computer Science (General)'}</option>
                          <option value="cs_net">{lang === 'ar' ? 'علم حاسوب - فرع الشبكات' : 'CS - Networking Branch'}</option>
                          <option value="cs_multi">{lang === 'ar' ? 'علم حاسوب - فرع الوسائط' : 'CS - Multimedia Branch'}</option>
                        </optgroup>
                        <option value="se">{lang === 'ar' ? 'هندسة برمجيات' : 'Software Engineering'}</option>
                        <option value="sec">{lang === 'ar' ? 'أمن المعلومات والفضاء الالكتروني' : 'Info Security & Cyberspace'}</option>
                        <option value="cyber">{lang === 'ar' ? 'الأمن السيبراني' : 'Cyber Security'}</option>
                        <option value="cis">{lang === 'ar' ? 'نظم المعلومات الحاسوبية' : 'Computer Info Systems'}</option>
                        <option value="ds_ai">{lang === 'ar' ? 'علم البيانات والذكاء الاصطناعي' : 'Data Science & AI'}</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label><Clock size={18} /> {lang === 'ar' ? 'الوضع الجامعي (سنة/فصل)' : 'Year / Semester'}</label>
                      <input type="text" placeholder={lang === 'ar' ? 'مثال: سنة 2 - فصل 1' : 'e.g. Year 2 - Sem 1'} />
                    </div>

                    <div className="input-group">
                      <label><Clock size={18} /> {lang === 'ar' ? 'عدد الساعات المقطوعة' : 'Completed Hours'}</label>
                      <input type="number" placeholder="0" />
                    </div>

                    <div className="input-group">
                      <label><Lock size={18} /> {lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                      <div className="password-input">
                        <input type={showPassword ? "text" : "password"} placeholder="••••••••" />
                        <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="input-group">
                      <label><Lock size={18} /> {lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                      <div className="password-input">
                        <input type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" />
                        <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="btn-primary register-btn">
                    {lang === 'ar' ? 'إنشاء الحساب' : 'Create Account'}
                  </button>
                </form>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
