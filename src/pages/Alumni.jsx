import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';

const Alumni = () => {
  const { t, lang } = useLocale();

  return (
    <div style={{ padding: '2rem', maxWidth: '1280px', margin: '0 auto' }}>
      <h1 className="title" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        {t('nav.alumni')}
      </h1>
      
      <div className="glass-panel" style={{ padding: '2rem' }}>
        <h2 style={{ marginBottom: '1rem', color: 'var(--primary-color)' }}>
          {lang === 'ar' ? 'معرض إنجازات الخريجين والمشاريع' : 'Alumni Projects & Achievements Gallery'}
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
          {[1,2,3].map(i => (
            <div key={i} style={{ height: '200px', backgroundColor: 'var(--bg-color-secondary)', borderRadius: '8px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ color: 'var(--text-secondary)' }}>Project {i} Placeholder</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default Alumni;
