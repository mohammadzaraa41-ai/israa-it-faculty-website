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
import NotificationDropdown from './NotificationDropdown';
import { useToast } from '../contexts/ToastContext';

const Navbar = () => {
  const { isDark, toggleTheme } = useTheme();
  const { lang, toggleLang, t } = useLocale();
  const { addToast } = useToast();
  const { user, login, logout, registerRequest, isLoginOpen, toggleLogin } = useAuth();
  const { departments } = useAdmin();
  const [activeTab, setActiveTab ] = useState('login'); 
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isShowcaseOpen, setIsShowcaseOpen] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  
  React.useEffect(() => {
    if (user) {
      toggleLogin(false);
    }
  }, [user, toggleLogin]);

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
    nameEn: '',
    phone: '',
    universityId: '',
    dob: '',
    major: '',
    year: '1',
    semester: '1',
    hours: '',
    password: '',
    confirmPassword: ''
  });
  const [navAvatarFile, setNavAvatarFile] = useState(null);
  const [navAvatarPreview, setNavAvatarPreview] = useState(null);

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setLoginError('');
    const result = await login(loginId, loginPassword);
    if (result.success) {
      addToast(
        lang === 'ar' ? 'تم تسجيل الدخول' : 'Login Successful',
        result.message || (lang === 'ar' ? `أهلاً بك مجدداً ${result.user.name?.ar || result.user.username}` : `Welcome back ${result.user.name?.en || result.user.username}`),
        'success'
      );
      toggleLogin(false);
      if (result.user?.role === 'SUPER_ADMIN' || result.user?.role === 'DEAN' || result.user?.role === 'HOD' || result.user?.role === 'DOCTOR') {
        window.location.href = '/admin-dashboard';
      } else {
        window.location.href = '/';
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

    if (regData.password.length < 6) {
      alert(lang === 'ar' ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters');
      return;
    }
    
    const yearSemLabel = lang === 'ar' ? `سنة ${regData.year} - فصل ${regData.semester}` : `Year ${regData.year} - Sem ${regData.semester}`;

    const result = await registerRequest({
      ...regData,
      fullName: regData.fullName,
      nameEn: regData.nameEn,
      yearSem: yearSemLabel,
      avatarFile: navAvatarFile || null
    });

    if (result.success) {
      setRegistrationSuccess(true);
      setNavAvatarFile(null);
      setNavAvatarPreview(null);
      setTimeout(() => {
        setRegistrationSuccess(false);
        toggleLogin(false);
        setRegData({ fullName: '', nameEn: '', phone: '', universityId: '', dob: '', major: '', year: '1', semester: '1', hours: '', password: '', confirmPassword: '' });
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
        { to: '/academic-advisor', label: t('nav.ai_advisor') },
        { to: '/roadmap', label: lang === 'ar' ? '🗺️ خريطة المواد 3D' : '🗺️ 3D Course Roadmap' },
        { to: '/current', label: lang === 'ar' ? 'الخطط الدراسية' : 'Study Plans' },
        { to: '/academic-calendar', label: lang === 'ar' ? 'التقويم الجامعي' : 'Academic Calendar' },
        { to: '/honor-roll', label: lang === 'ar' ? 'لوحة الشرف' : 'Honor Roll' }
      ]
    },
    {
      id: 'campus',
      title: t('nav.campus'),
      links: [
        { to: '/virtual-tour', label: t('nav.virtual_tour') },
        { to: '/live-labs', label: t('nav.live_labs') },
        { to: '/events', label: t('nav.events') },
        { to: '/achievements', label: lang === 'ar' ? 'إنجازات الكلية' : 'Faculty Achievements' }
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
    ...(user ? [{
      id: 'account',
      title: lang === 'ar' ? 'حسابي' : 'My Account',
      links: [
        { to: '/profile', label: lang === 'ar' ? 'الملف الشخصي' : 'Profile Settings' },
        { to: '#', label: lang === 'ar' ? 'تسجيل الخروج' : 'Logout', onClick: () => { logout(); navigate('/'); } }
      ]
    }] : []),
    ...(user ? [] : [{
      id: 'auth',
      title: lang === 'ar' ? 'نظام التسجيل' : 'Registration System',
      links: [
        { to: '#', label: lang === 'ar' ? 'إنشاء حساب جديد' : 'Create Account', onClick: () => { setActiveTab('register'); toggleLogin(true); } },
        { to: '#', label: lang === 'ar' ? 'تسجيل الدخول' : 'Sign In', onClick: () => { setActiveTab('login'); toggleLogin(true); } }
      ]
    }])
  ], [t, lang, toggleLogin, user, logout, navigate]);

  return (
    <>
      <header className="utility-bar">
        <div className="utility-container">
          {/* Logo Section */}
          <div className="top-bar-brand-v2" onClick={() => navigate('/')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <img src="/logo.png" alt="Logo" className="top-logo-v2" />
            <span className="top-title-v2">{t('faculty_name')}</span>
          </div>

          {/* Desktop Links (Hidden on Mobile) */}
          <div className="utility-links desktop-only">
            <a href="mailto:info@iu.edu.jo" className="utility-link">
              <Mail size={12} />
              <span>info@iu.edu.jo</span>
            </a>
            <a
              href="https://elearn.iu.edu.jo/login/index.php"
              target="_blank"
              rel="noopener noreferrer"
              className="utility-link"
            >
              <BookOpen size={12} />
              <span>{lang === 'ar' ? 'التعليم الإلكتروني' : 'E-Learning'}</span>
            </a>
          </div>

          {/* Actions & Mobile Menu Button */}
          <div className="utility-actions">
            {['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role) && <NotificationDropdown />}
            <div className="utility-sep">|</div>
            <button className="utility-btn" onClick={(e) => { e.stopPropagation(); toggleTheme(); }}>
              {isDark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
            <button className="utility-btn" onClick={(e) => { e.stopPropagation(); toggleLang(); }}>
              <Globe size={14} />
              <span style={{ fontSize: '0.8rem' }}>{lang === 'ar' ? 'EN' : 'عربي'}</span>
            </button>
            
            <button 
              className="mobile-toggle-v3" 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setIsMobileMenuOpen(!isMobileMenuOpen);
              }}
              style={{ 
                zIndex: 100000, 
                position: 'relative',
                display: 'flex'
              }}
            >
              {isMobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
            </button>
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

      <nav className={`sidebar ${isMobileMenuOpen ? 'open' : ''} ${lang === 'ar' ? 'sidebar-rtl' : 'sidebar-ltr'}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo-container">
            <div className="sidebar-logo clickable-logo" onClick={() => { closeMenu(); if (user) navigate('/profile'); else { setActiveTab('login'); toggleLogin(true); } }}>
              <img src={user?.avatar_url || "/logo.png"} alt="Logo" className="logo-img profile-preview" />
              <div className="logo-info">
                <span className="logo-text">{user ? (lang === 'ar' ? user.name?.ar || user.username : user.name?.en || user.username) : t('faculty_name')}</span>
                {user && (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }} 
                    animate={{ opacity: 1, x: 0 }}
                    className="user-badge"
                  >
                    <User size={12} />
                    <span>{user?.role}</span>
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
            <NotificationDropdown />
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
                <X size={20} />
              </button>
              
              <div className="login-header">
                {/* Logo area */}
                <div style={{ textAlign: 'center', marginBottom: '1.8rem' }}>
                  <div style={{
                    width: '60px', height: '60px', borderRadius: '50%',
                    background: 'linear-gradient(135deg, #a1172c, #6b0f1e)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '0 auto 1rem', boxShadow: '0 8px 24px rgba(161,23,44,0.35)',
                    fontSize: '1.6rem'
                  }}>
                    🎓
                  </div>
                  <h2 style={{ fontSize: '1.35rem', fontWeight: '700', color: 'var(--text-primary)', margin: '0 0 0.25rem', letterSpacing: '-0.3px' }}>
                    {lang === 'ar' ? 'كلية تقنية المعلومات' : 'IT Faculty Portal'}
                  </h2>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.82rem', margin: 0, opacity: 0.6 }}>
                    {lang === 'ar' ? 'تسجيل الدخول أو إنشاء حساب جديد' : 'Sign in or create a new account'}
                  </p>
                </div>

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
                  {loginError && <div style={{color: '#ff6b6b', marginBottom: '1rem', textAlign: 'center', padding: '0.8rem 1rem', background: 'rgba(231,76,60,0.1)', borderRadius: '10px', border: '1px solid rgba(231,76,60,0.3)', fontSize: '0.9rem'}}>{loginError}</div>}
                  <div className="input-group">
                    <label>
                      <User size={16} />
                      {lang === 'ar' ? 'الرقم الجامعي أو اسم المستخدم' : 'University ID or Username'}
                    </label>
                    <input 
                      type="text" 
                      value={loginId} 
                      onChange={e => setLoginId(e.target.value)} 
                      placeholder={lang === 'ar' ? 'مثال: 20240001 أو AE2551' : 'e.g. 20240001 or AE2551'} 
                    />
                  </div>

                  <div className="input-group" style={{ marginTop: '1rem' }}>
                    <label>
                      <Lock size={16} />
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

                  <button type="submit" className="btn-primary login-btn" style={{ marginTop: '1.5rem' }}>
                    {lang === 'ar' ? 'تسجيل الدخول' : 'Sign In'}
                  </button>

                  <div className="login-help">
                    <button 
                      type="button" 
                      className="text-btn" 
                      onClick={() => addToast(
                        lang === 'ar' ? 'استعادة كلمة المرور' : 'Password Recovery',
                        lang === 'ar' ? 'يرجى مراجعة سكرتاريا كلية تكنولوجيا المعلومات لاستعادة كلمة المرور الخاصة بك.' : 'Please visit the IT Faculty office to reset your password.',
                        'info'
                      )}
                      style={{ background: 'none', border: 'none', color: 'var(--primary-color)', cursor: 'pointer', fontSize: '0.85rem' }}
                    >
                      {lang === 'ar' ? 'نسيت كلمة المرور؟' : 'Forgot Password?'}
                    </button>
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

                    {/* Avatar Upload */}
                    <div className="input-group full-width" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{ width: '80px', height: '80px', borderRadius: '50%', border: '2px dashed var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', overflow: 'hidden', background: 'rgba(255,255,255,0.05)' }}
                        onClick={() => document.getElementById('nav-avatar-upload').click()}
                      >
                        {navAvatarPreview
                          ? <img src={navAvatarPreview} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                          : <span style={{ fontSize: '2rem' }}>📷</span>
                        }
                      </div>
                      <label style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', cursor: 'pointer' }} onClick={() => document.getElementById('nav-avatar-upload').click()}>
                        {lang === 'ar' ? 'صورة شخصية (اختياري)' : 'Profile Photo (Optional)'}
                      </label>
                      <input
                        id="nav-avatar-upload"
                        type="file"
                        accept="image/*"
                        style={{ display: 'none' }}
                        onChange={e => {
                          const file = e.target.files[0];
                          if (file) { setNavAvatarFile(file); setNavAvatarPreview(URL.createObjectURL(file)); }
                        }}
                      />
                    </div>

                    {/* Arabic Name */}
                    <div className="input-group">
                      <label><UserCheck size={18} /> {lang === 'ar' ? 'الاسم بالعربية' : 'Name (Arabic)'}</label>
                      <input type="text" value={regData.fullName} onChange={e => setRegData({...regData, fullName: e.target.value})} placeholder={lang === 'ar' ? 'مثال: أحمد محمد علي' : 'e.g. أحمد محمد علي'} required />
                    </div>

                    {/* English Name */}
                    <div className="input-group">
                      <label><UserCheck size={18} /> {lang === 'ar' ? 'الاسم بالإنجليزية' : 'Name (English)'}</label>
                      <input type="text" value={regData.nameEn} onChange={e => setRegData({...regData, nameEn: e.target.value})} placeholder="Ahmed Mohamed Ali" required />
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
                        {departments && departments.length > 0 ? (
                          departments.map(dept => (
                            <option key={dept.id} value={dept.id}>{dept.name?.[lang] || dept.name?.ar || dept.id}</option>
                          ))
                        ) : (
                          <>
                            <option value="cs">{lang === 'ar' ? 'علم حاسوب' : 'Computer Science'}</option>
                            <option value="se">{lang === 'ar' ? 'هندسة برمجيات' : 'Software Engineering'}</option>
                          </>
                        )}
                      </select>
                    </div>

                    <div className="input-group">
                      <label><Clock size={18} /> {lang === 'ar' ? 'السنة الدراسية' : 'Academic Year'}</label>
                      <select 
                        required 
                        className="custom-select" 
                        value={regData.year} 
                        onChange={e => setRegData({...regData, year: e.target.value})}
                      >
                        <option value="1">{lang === 'ar' ? 'سنة أولى' : 'Year 1'}</option>
                        <option value="2">{lang === 'ar' ? 'سنة ثانية' : 'Year 2'}</option>
                        <option value="3">{lang === 'ar' ? 'سنة ثالثة' : 'Year 3'}</option>
                        <option value="4">{lang === 'ar' ? 'سنة رابعة' : 'Year 4'}</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label><Clock size={18} /> {lang === 'ar' ? 'الفصل الدراسي' : 'Semester'}</label>
                      <select 
                        required 
                        className="custom-select" 
                        value={regData.semester} 
                        onChange={e => setRegData({...regData, semester: e.target.value})}
                      >
                        <option value="1">{lang === 'ar' ? 'فصل أول' : 'Semester 1'}</option>
                        <option value="2">{lang === 'ar' ? 'فصل ثاني' : 'Semester 2'}</option>
                      </select>
                    </div>

                    <div className="input-group">
                      <label><Clock size={18} /> {lang === 'ar' ? 'عدد الساعات المقطوعة' : 'Completed Hours'}</label>
                      <input type="number" value={regData.hours} onChange={e => setRegData({...regData, hours: e.target.value})} placeholder="0" required />
                    </div>

                    <div className="input-group">
                      <label><Lock size={18} /> {lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
                      <div className="password-input">
                        <input type={showPassword ? "text" : "password"} value={regData.password} onChange={e => setRegData({...regData, password: e.target.value})} placeholder="••••••••" required minLength="6" />
                        <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="input-group">
                      <label><Lock size={18} /> {lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
                      <div className="password-input">
                        <input type={showConfirmPassword ? "text" : "password"} value={regData.confirmPassword} onChange={e => setRegData({...regData, confirmPassword: e.target.value})} placeholder="••••••••" required minLength="6" />
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
