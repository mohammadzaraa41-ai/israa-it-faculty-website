import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';

const Events = () => {
  const { lang, t } = useLocale();
  const events = [
    { title: 'AI Hackathon 2026', date: 'Oct 15, 2026', tag: 'Competition' },
    { title: 'Cyber Security Workshop', date: 'Nov 2, 2026', tag: 'Workshop' }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 className="title" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        {t('nav.events')}
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {events.map((ev, i) => (
          <div key={i} className="glass-panel" style={{ padding: '2rem' }}>
            <span style={{ background: 'var(--accent-color)', color: '#000', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{ev.tag}</span>
            <h2 style={{ fontSize: '1.5rem', margin: '1rem 0' }}>{ev.title}</h2>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>{ev.date}</p>
            <button className="btn-primary" style={{ width: '100%' }}>{lang === 'ar' ? 'احجز تذكرتك' : 'Reserve Ticket'}</button>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Events;
