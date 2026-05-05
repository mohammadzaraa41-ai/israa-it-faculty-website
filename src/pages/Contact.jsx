import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';

const Contact = () => {
  const { t, lang } = useLocale();

  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 className="title" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        {t('nav.contact')}
      </h1>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <form style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              {lang === 'ar' ? 'الاسم' : 'Name'}
            </label>
            <input type="text" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              {lang === 'ar' ? 'البريد الإلكتروني' : 'Email'}
            </label>
            <input type="email" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              {lang === 'ar' ? 'الرسالة' : 'Message'}
            </label>
            <textarea rows="5" style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', backgroundColor: 'var(--bg-color)', color: 'var(--text-primary)' }}></textarea>
          </div>
          <button type="button" className="btn-primary" style={{ alignSelf: 'flex-start' }}>
            {lang === 'ar' ? 'إرسال' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};
export default Contact;
