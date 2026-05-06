import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { useAdmin } from '../contexts/AdminContext';
import { Calendar } from 'lucide-react';

const Events = () => {
  const { lang, t } = useLocale();
  const { events } = useAdmin();

  return (
    <div style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto', minHeight: '60vh' }}>
      <h1 className="title" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        {t('nav.events')}
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {events && events.length > 0 ? (
          events.map((ev, i) => {
            const title = ev.title_ar || ev.title_en ? (lang === 'ar' ? ev.title_ar : ev.title_en) : (ev.title || (typeof ev.text === 'object' ? ev.text[lang] : ev.text));
            const desc = typeof ev.text === 'object' ? ev.text[lang] : ev.text;
            return (
              <div key={ev.id || i} className="glass-panel" style={{ padding: '2rem', position: 'relative' }}>
                {ev.tag && <span style={{ background: 'var(--accent-color)', color: '#000', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-block', marginBottom: '1rem' }}>{ev.tag}</span>}
                <h2 style={{ fontSize: '1.5rem', margin: '0.5rem 0 1rem', color: 'var(--primary-color)' }}>{title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
                  <Calendar size={16} /> <span>{ev.date}</span>
                </div>
                {desc && desc !== title && <p style={{ color: 'var(--text-primary)', marginBottom: '2rem', lineHeight: '1.6' }}>{desc}</p>}
                <button className="btn-primary" style={{ width: '100%' }}>{lang === 'ar' ? 'المزيد من التفاصيل' : 'More Details'}</button>
              </div>
            );
          })
        ) : (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', gridColumn: '1 / -1' }}>{lang === 'ar' ? 'لا توجد فعاليات قادمة حالياً.' : 'No upcoming events at the moment.'}</p>
        )}
      </div>
    </div>
  );
};
export default Events;
