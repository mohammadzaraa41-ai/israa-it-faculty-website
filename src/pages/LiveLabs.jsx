import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';

const LiveLabs = () => {
  const { lang, t } = useLocale();
  const labs = [
    { name: lang === 'ar' ? 'مختبر سيسكو 1' : 'Cisco Lab 1', status: 'available', time: '10:00 AM' },
    { name: lang === 'ar' ? 'مختبر البرمجة المتقدمة' : 'Advanced Programming Lab', status: 'busy', time: '10:00 AM' },
    { name: lang === 'ar' ? 'مختبر الأمن السيبراني' : 'Cyber Security Lab', status: 'maintenance', time: '-' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 className="title" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        {t('nav.live_labs')}
      </h1>
      
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {labs.map((lab, i) => (
          <div key={i} className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem 2rem' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>{lab.name}</h2>
            <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
              <span style={{ fontWeight: 'bold' }}>{lab.time}</span>
              <span style={{
                padding: '0.5rem 1rem',
                borderRadius: '50px',
                backgroundColor: lab.status === 'available' ? 'rgba(34, 197, 94, 0.2)' : lab.status === 'busy' ? 'rgba(239, 68, 68, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                color: lab.status === 'available' ? '#4ade80' : lab.status === 'busy' ? '#f87171' : '#fbbf24',
                border: `1px solid ${lab.status === 'available' ? '#4ade80' : lab.status === 'busy' ? '#f87171' : '#fbbf24'}`
              }}>
                {lab.status.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default LiveLabs;
