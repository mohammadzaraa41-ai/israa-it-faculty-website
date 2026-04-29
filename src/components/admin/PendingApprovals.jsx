import React from 'react';
import { CheckSquare, Check, X } from 'lucide-react';

const PendingApprovals = ({ pendingUsers, approveUser, rejectUser, lang }) => {
  if (pendingUsers.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
        <CheckSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h3>{lang === 'ar' ? 'لا يوجد طلبات معلقة' : 'No pending registrations.'}</h3>
      </div>
    );
  }

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)', fontSize: '1.5rem' }}>
        {lang === 'ar' ? 'طلبات التسجيل المعلقة' : 'Pending Registrations'}
      </h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pendingUsers.map(reg => (
          <div key={reg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{reg.fullName}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{lang === 'ar' ? 'طالب' : 'Student'}</span> • {reg.universityId} • {reg.major}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={async () => {
                  const success = await approveUser(reg.id);
                  if (!success) alert(lang === 'ar' ? 'فشل قبول المستخدم' : 'Failed to approve user');
                }}
                style={{ padding: '0.5rem 1rem', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
              >
                <Check size={18} /> {lang === 'ar' ? 'موافقة' : 'Approve'}
              </button>
              <button 
                onClick={async () => {
                  const success = await rejectUser(reg.id);
                  if (!success) alert(lang === 'ar' ? 'فشل رفض المستخدم' : 'Failed to reject user');
                }}
                style={{ padding: '0.5rem 1rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 'bold' }}
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

export default PendingApprovals;
