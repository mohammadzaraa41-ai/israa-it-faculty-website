import React from 'react';
import { GraduationCap, Check, X, Eye } from 'lucide-react';

const AlumniRequests = ({ alumniRequests, approveAlumniRequest, rejectAlumniRequest, lang }) => {
  if (!alumniRequests || alumniRequests.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
        <GraduationCap size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h3>{lang === 'ar' ? 'لا يوجد طلبات تفعيل خريجين' : 'No alumni access requests.'}</h3>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)', fontSize: '1.5rem' }}>
        {lang === 'ar' ? 'طلبات تفعيل بوابة الخريجين' : 'Alumni Access Requests'}
      </h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {alumniRequests.map(reg => (
          <div key={reg.id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{reg.fullName}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{reg.universityId}</p>
              </div>
              <div style={{ background: 'var(--primary-color)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                {reg.hours} {lang === 'ar' ? 'ساعة' : 'Hours'}
              </div>
            </div>
            
            {reg.scheduleImage && (
              <div 
                style={{ 
                  borderRadius: '12px', 
                  overflow: 'hidden', 
                  border: '1px solid var(--border-color)', 
                  position: 'relative', 
                  height: '180px',
                  cursor: 'pointer',
                  group: 'true'
                }} 
                onClick={() => window.open(reg.scheduleImage, '_blank')}
              >
                <img 
                  src={reg.scheduleImage} 
                  alt="Schedule" 
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }} 
                  onMouseOver={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={(e) => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{ 
                  position: 'absolute', 
                  inset: 0, 
                  background: 'rgba(0,0,0,0.4)', 
                  display: 'flex', 
                  flexDirection: 'column',
                  alignItems: 'center', 
                  justifyContent: 'center',
                  opacity: 0.8,
                  transition: 'opacity 0.3s'
                }}>
                  <Eye size={24} color="white" />
                  <span style={{ color: 'white', fontSize: '0.8rem', marginTop: '5px' }}>
                    {lang === 'ar' ? 'عرض الصورة كاملة' : 'View Full Image'}
                  </span>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              <button 
                onClick={() => approveAlumniRequest(reg.id)}
                style={{ flex: 1, padding: '0.75rem', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}
              >
                <Check size={18} /> {lang === 'ar' ? 'موافقة' : 'Approve'}
              </button>
              <button 
                onClick={() => rejectAlumniRequest(reg.id)}
                style={{ flex: 1, padding: '0.75rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}
              >
                <X size={18} /> {lang === 'ar' ? 'رفض' : 'Reject'}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlumniRequests;
