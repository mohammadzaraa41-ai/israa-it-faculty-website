import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';

const StudentPortal = () => {
  const { lang, t } = useLocale();
  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
      <div className="glass-panel" style={{ padding: '3rem', width: '100%', maxWidth: '400px', textAlign: 'center' }}>
        <h2 style={{ fontSize: '2rem', color: 'var(--primary-color)', marginBottom: '2rem' }}>{t('nav.student_portal')}</h2>
        <input type="text" placeholder={lang === 'ar' ? 'الرقم الجامعي' : 'Student ID'} style={{ width: '100%', padding: '1rem', marginBottom: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
        <input type="password" placeholder={lang === 'ar' ? 'كلمة المرور' : 'Password'} style={{ width: '100%', padding: '1rem', marginBottom: '2rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
        <button className="btn-primary" style={{ width: '100%' }}>{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</button>
      </div>
    </div>
  );
};
export default StudentPortal;
