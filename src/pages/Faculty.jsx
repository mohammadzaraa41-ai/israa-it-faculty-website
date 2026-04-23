import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { Mail, Phone } from 'lucide-react';

const Faculty = () => {
  const { t, lang } = useLocale();
  
  const staff = [
    { name: lang === 'ar' ? 'أ.د. أحمد محمد' : 'Prof. Ahmad Mohammad', role: lang === 'ar' ? 'عميد الكلية' : 'Dean of IT Faculty' },
    { name: lang === 'ar' ? 'د. سارة عيسى' : 'Dr. Sarah Issa', role: lang === 'ar' ? 'رئيس قسم علم الحاسوب' : 'Head of CS Dept.' },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1280px', margin: '0 auto' }}>
      <h1 className="title" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        {t('nav.faculty')}
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem' }}>
        {staff.map((member, idx) => (
          <div key={idx} className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}>
            <div style={{ width: '100px', height: '100px', backgroundColor: 'var(--primary-color)', borderRadius: '50%', margin: '0 auto 1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent-color)', fontSize: '2rem', fontWeight: 'bold' }}>
              {member.name.charAt(0)}
            </div>
            <h3 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>{member.name}</h3>
            <p style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>{member.role}</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', color: 'var(--primary-light)' }}>
              <Mail size={20} />
              <Phone size={20} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Faculty;
