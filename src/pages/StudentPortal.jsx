import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';

const StudentPortal = () => {
  const { lang, t } = useLocale();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    const cleanUser = userId.trim();
    const cleanPass = password.trim();

    const result = login(cleanUser, cleanPass);
    if (result.success) {
      if (result.user.role === 'SUPER_ADMIN' || result.user.role === 'DEAN') {
        navigate('/admin-dashboard');
      } else {
        navigate('/'); // Students go to home or student portal
      }
    } else {
      setError(lang === 'ar' ? 'بيانات الدخول غير صحيحة' : 'Invalid login credentials');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <form onSubmit={handleLogin} className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '2rem' }}>{t('nav.student_portal')} / {lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</h2>
        
        {error && <div style={{ background: '#e74c3c', color: 'white', padding: '10px', borderRadius: '5px', marginBottom: '15px' }}>{error}</div>}

        <input 
          type="text" 
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          placeholder={lang === 'ar' ? 'الرقم الجامعي أو اسم المستخدم' : 'Student ID or Username'} 
          style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} 
        />
        <input 
          type="password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'} 
          style={{ width: '100%', padding: '1rem', marginBottom: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} 
        />
        <button type="submit" className="btn-primary" style={{ width: '100%' }}>{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</button>
      </form>
    </div>
  );
};
export default StudentPortal;
