import React, { useState, useMemo } from 'react';
import { NavLink } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useLocale } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useNavigate } from 'react-router-dom';
import { Moon, Sun, Menu, X, Globe, ChevronDown, ChevronUp, PlayCircle, ArrowRight, ArrowLeft, User, Lock, Eye, EyeOff, Phone, Calendar, GraduationCap, Clock, BookOpen, UserCheck, LogOut, Mail } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import './Navbar.css';
import MajorsShowcase from './MajorsShowcase';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLocale();
  const { user, login, logout, registerRequest, isLoginOpen, toggleLogin } = useAuth();
  const [activeTab, setActiveTab ] = useState('login'); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  const navigate = useNavigate();
  const [expandedSections, setExpandedSections] = useState({
    academics: false,
    campus: false,
    portals: false
  });


  const [loginId, setLoginId] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [regData, setRegData] = useState({
    fullName: '',
    phone: '',
    universityId: '',
    dob: '',
    major: '',
    yearSem: '',
    hours: '',
    password: '',
    confirmPassword: ''
  });

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    const result = await login(loginId, loginPassword);
    if (result.success) {
      toggleLogin(false);
      if (result.user.role === 'SUPER_ADMIN' || result.user.role === 'DEAN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/'); 
      }
    } else {
      setLoginError(result.message);
    }
  };

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    if (regData.password !== regData.confirmPassword) {
      alert(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }
    
    const result = await registerRequest(regData);
    if (result.success) {
      setRegistrationSuccess(true);
      setTimeout(() => {
        setRegistrationSuccess(false);
        toggleLogin(false);
        setRegData({ fullName: '', phone: '', universityId: '', dob: '', major: '', yearSem: '', hours: '', password: '', confirmPassword: '' });
      }, 5000);
    } else {
      alert(lang === 'ar' ? 'حدث خطأ أثناء التسجيل: ' + result.message : 'Error during registration: ' + result.message);
    }
  };


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
        { to: '/alumni', label: t('nav.alumni') },
        { to: '/dev-network', label: t('nav.dev_network') },
        ...(user?.role === 'SUPER_ADMIN' ? [{ to: '/admin-dashboard', label: lang === 'ar' ? 'لوحة التحكم (أدمن)' : 'Admin Dashboard' }] : [])
      ]
    },
    ...(!!user ? [] : [{
      id: 'auth',
      title: lang === 'ar' ? 'نظام التسجيل' : 'Registration System',
      links: [
        { to: '#', label: lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account', onClick: () => { setActiveTab('register'); toggleLogin(true); } },
        { to: '#', label: lang === 'ar' ? 'تسجيل الدخول' : 'Sign In', onClick: () => { setActiveTab('login'); toggleLogin(true); } }
      ]
    }])
  ], [t, lang, toggleLogin, user]);

  return (
    <>
      <header className="institutional-header">
        <div className="utility-bar">
          <div className="utility-container">
            <div className="utility-links">
              <a href="mailto:info@iu.edu.jo" className="utility-link">
                <Mail size={12} />
                <span>info@iu.edu.jo</span>
              </a>
              <a href="#" className="utility-link">
                <BookOpen size={12} />
                <span>{lang === 'ar' ? 'المكتبة الرقمية' : 'Digital Library'}</span>
              </a>
              <a href="#" className="utility-link">
                <GraduationCap size={12} />
                <span>{lang === 'ar' ? 'بوابة الطالب' : 'Student Portal'}</span>
              </a>
            </div>
            <div className="utility-actions">
              <button className="utility-btn" onClick={toggleLang}>
                <Globe size={12} />
                <span>{lang === 'ar' ? 'English' : 'عربي'}</span>
              </button>
              <button className="utility-btn" onClick={toggleTheme}>
                {isDark ? <Sun size={12} /> : <Moon size={12} />}
                <span>{isDark ? (lang === 'ar' ? 'نهاري' : 'Light') : (lang === 'ar' ? 'ليلي' : 'Dark')}</span>
              </button>
            </div>
          </div>
        </div>

        <div className="top-bar">
          <button 
            className="mobile-toggle" 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {isMobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
          <div className="top-bar-brand" onClick={() => navigate('/')}>
            <img src="/logo.png" alt="Logo" className="top-logo" />
            <span className="top-title">{t('faculty_name')}</span>
          </div>
        </div>
      </header>

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
          <div className="sidebar-logo-container">
            <div className="sidebar-logo clickable-logo" onClick={() => { setActiveTab('login'); toggleLogin(true); }}>
              <img src="/logo.png" alt="Logo" className="logo-img" />
              <div className="logo-info">
                <span className="logo-text">{t('faculty_name')}</span>
                {user && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="user-badge"
                  >
                    <User size={12} />
                    <span>{lang === 'ar' ? user.name?.ar || user.username : user.name?.en || user.username}</span>
                  </motion.div>
                )}
              </div>
            </div>
            
            {user && (
              <button 
                className="logout-minimal-btn" 
                onClick={() => { logout(); navigate('/'); }}
                title={lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
              >
                <LogOut size={18} />
              </button>
            )}
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
        {isLoginOpen && !user && (
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
                <form className="login-form" onSubmit={handleLoginSubmit}>
                  {loginError && <div style={{color: '#e74c3c', marginBottom: '1rem', textAlign: 'center'}}>{loginError}</div>}
                  <div className="input-group">
                    <label>
                      <User size={18} />
                      {lang === 'ar' ? 'الرقم الجامعي أو اسم المستخدم' : 'University ID or Username'}
                    </label>
                    <input 
                      type="text" 
                      value={loginId} 
                      onChange={e => setLoginId(e.target.value)} 
                      placeholder={lang === 'ar' ? 'مثال: 20240001 أو AE2551' : 'e.g. 20240001 or AE2551'} 
                    />
                  </div>

                  <div className="input-group">
                    <label>
                      <Lock size={18} />
                      {lang === 'ar' ? 'كلمة المرور' : 'Password'}
                    </label>
                    <div className="password-input">
                      <input 
                        type={showPassword ? "text" : "password"} 
                        value={loginPassword} 
                        onChange={e => setLoginPassword(e.target.value)} 
                        placeholder="••••••••" 
                      />
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
              ) : registrationSuccess ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }} 
                  animate={{ opacity: 1, scale: 1 }} 
                  style={{ textAlign: 'center', padding: '2rem' }}
                >
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                  <h3 style={{ color: 'var(--accent-color)', marginBottom: '1rem' }}>
                    {lang === 'ar' ? 'تم استلام طلبك بنجاح!' : 'Request Received Successfully!'}
                  </h3>
                  <p style={{ fontSize: '0.9rem', opacity: 0.8, lineHeight: '1.6' }}>
                    {lang === 'ar' 
                      ? 'شكراً لك على التسجيل. طلبك الآن قيد المراجعة من قبل الإدارة. ستتمكن من الدخول فور الموافقة عليه باستخدام رقمك الجامعي.' 
                      : 'Thank you for registering. Your request is now being reviewed by the administration. You will be able to log in once approved using your University ID.'}
                  </p>
                </motion.div>
              ) : (
                <form className="register-form" onSubmit={handleRegisterSubmit}>
                  <div className="form-grid">
                    <div className="input-group full-width">
                      <label><UserCheck size={18} /> {lang === 'ar' ? 'الاسم الكامل (من 3 مقاطع)' : 'Full Name (3 segments)'}</label>
                      <input type="text" value={regData.fullName} onChange={e => setRegData({...regData, fullName: e.target.value})} placeholder={lang === 'ar' ? 'مثال: أحمد محمد علي' : 'e.g. Ahmed Mohamed Ali'} required />
                    </div>

                    <div className="input-group">
                      <label><Phone size={18} /> {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                      <input type="tel" value={regData.phone} onChange={e => setRegData({...regData, phone: e.target.value})} placeholder="07XXXXXXXX" required />
                    </div>

                    <div className="input-group">
                      <label><GraduationCap size={18} /> {lang === 'ar' ? 'الرقم الجامعي' : 'University ID'}</label>
                      <input type="text" value={regData.universityId} onChange={e => setRegData({...regData, universityId: e.target.value})} placeholder="20XXXXXXXX" required />
                    </div>

                    <div className="input-group">
                      <label><Calendar size={18} /> {lang === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth'}</label>
                      <input type="date" value={regData.dob} onChange={e => setRegData({...regData, dob: e.target.value})} required />
                    </div>

                    <div className="input-group">
                      <label><BookOpen size={18} /> {lang === 'ar' ? 'التخصص' : 'Major'}</label>
                      <select className="custom-select" value={regData.major} onChange={e => setRegData({...regData, major: e.target.value})} required>
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
                      <input type="text" value={regData.yearSem} onChange={e => setRegData({...regData, yearSem: e.target.value})} placeholder={lang === 'ar' ? 'مثال: سنة 2 - فصل 1' : 'e.g. Year 2 - Sem 1'} required />
                    </div>

                    <div className="input-group">
                      <label><Clock size={18} /> {lang === 'ar' ? 'عدد الساعات المقطوعة' : 'Completed Hours'}</label>
                      <input type="number" value={regData.hours} onChange={e => setRegData({...regData, hours: e.target.value})} placeholder="0" required />
                    </div>

                    <div className="input-group">
                      <label><Lock size={18} /> {lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                      <div className="password-input">
                        <input type={showPassword ? "text" : "password"} value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} placeholder="••••••••" required />
                        <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="input-group">
                      <label><Lock size={18} /> {lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                      <div className="password-input">
                        <input type={showConfirmPassword ? "text" : "password"} value={regData.confirmPassword} onChange={e => setRegData({...regData, confirmPassword: e.target.value})} placeholder="••••••••" required />
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
