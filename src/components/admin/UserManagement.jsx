import React, { useState } from 'react';
import { Search, Users, Shield, BookOpen, Settings, Trash2 } from 'lucide-react';

const UserManagement = ({ users, lang, deleteUser, updateUserRole }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.username?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         u.name?.ar?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         u.name?.en?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case 'SUPER_ADMIN': return { bg: '#e74c3c22', text: '#e74c3c', label: lang === 'ar' ? 'مدير نظام' : 'Super Admin' };
      case 'DEAN': return { bg: '#f1c40f22', text: '#f1c40f', label: lang === 'ar' ? 'عميد / رئيس قسم' : 'Dean / Head' };
      default: return { bg: '#2ecc7122', text: '#2ecc71', label: lang === 'ar' ? 'طالب' : 'Student' };
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ color: 'var(--primary-light)', fontSize: '1.5rem' }}>
          {lang === 'ar' ? 'إدارة حسابات المستخدمين' : 'User Accounts Management'}
        </h3>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%', maxWidth: '800px' }}>
          {/* Search Bar */}
          <div style={{ flex: 1, position: 'relative', minWidth: '250px' }}>
            <Search size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
            <input 
              type="text" 
              placeholder={lang === 'ar' ? 'بحث بالاسم أو رقم التسجيل...' : 'Search by name or ID...'} 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              style={{ width: '100%', padding: '0.8rem 2.8rem 0.8rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
            />
          </div>

          {/* Role Filter Tabs */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.05)', padding: '4px', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
            {['ALL', 'SUPER_ADMIN', 'DEAN', 'STUDENT'].map(role => (
              <button 
                key={role}
                onClick={() => setRoleFilter(role)}
                style={{ 
                  padding: '0.5rem 1rem', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '0.85rem',
                  background: roleFilter === role ? 'var(--primary-color)' : 'transparent',
                  color: roleFilter === role ? 'white' : 'var(--text-secondary)'
                }}
              >
                {role === 'ALL' ? (lang === 'ar' ? 'الكل' : 'All') : 
                 role === 'SUPER_ADMIN' ? (lang === 'ar' ? 'مدراء' : 'Admins') :
                 role === 'DEAN' ? (lang === 'ar' ? 'عمداء' : 'Deans') : (lang === 'ar' ? 'طلاب' : 'Students')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredUsers.map(u => {
          const badge = getRoleBadgeStyle(u.role);
          return (
            <div key={u.id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: badge.bg, color: badge.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', margin: 0 }}>{u.name?.ar || u.username}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>#{u.username}</p>
                  </div>
                </div>
                <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold', background: badge.bg, color: badge.text }}>
                  {badge.label}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <BookOpen size={14} /> {u.departmentId === 'cs' ? 'Computer Science' : u.departmentId === 'se' ? 'Software Engineering' : u.departmentId}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <Settings size={14} /> {lang === 'ar' ? 'كلمة المرور:' : 'Pass:'} <code style={{ color: 'var(--accent-color)' }}>{u.password}</code>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }}>
                <button 
                  onClick={async () => {
                    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا الحساب؟' : 'Are you sure you want to delete this account?')) {
                      await deleteUser(u.id);
                    }
                  }}
                  className="btn-outline" 
                  style={{ flex: 1, padding: '0.5rem', fontSize: '0.8rem', borderColor: '#e74c3c33', color: '#e74c3c' }}
                >
                  <Trash2 size={14} /> {lang === 'ar' ? 'حذف' : 'Delete'}
                </button>
                <select 
                  value={u.role}
                  onChange={(e) => updateUserRole(u.id, e.target.value)}
                  style={{ flex: 1, padding: '0.5rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)', fontSize: '0.8rem' }}
                >
                  <option value="STUDENT">Student</option>
                  <option value="DEAN">Dean</option>
                  <option value="SUPER_ADMIN">Admin</option>
                </select>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredUsers.length === 0 && (
        <div style={{ textAlign: 'center', padding: '5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '15px', border: '1px dashed var(--border-color)' }}>
          <Users size={48} style={{ opacity: 0.2, marginBottom: '1rem' }} />
          <p style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'لم يتم العثور على مستخدمين يطابقون بحثك' : 'No users found matching your search.'}</p>
        </div>
      )}
    </div>
  );
};

export default UserManagement;
