import React, { useState } from 'react';

const RegisterUser = ({ registerUserDirectly, lang }) => {
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    role: 'STUDENT', 
    nameAr: '', 
    nameEn: '',
    departmentId: 'cs'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await registerUserDirectly({ 
      username: formData.username,
      password: formData.password,
      role: formData.role,
      name: { ar: formData.nameAr, en: formData.nameEn },
      departmentId: formData.departmentId
    });
    
    if (result.success) {
      setFormData({ username: '', password: '', role: 'STUDENT', nameAr: '', nameEn: '', departmentId: 'cs' });
      alert(lang === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully');
    } else {
      alert(lang === 'ar' ? 'خطأ في إنشاء الحساب: ' + result.message : 'Error: ' + result.message);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)', fontSize: '1.5rem', textAlign: 'center' }}>
        {lang === 'ar' ? 'تسجيل مستخدم جديد' : 'Direct Registration'}
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'نوع الحساب (الصلاحيات)' : 'Account Type (Permissions)'}</label>
          <select 
            value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} 
            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          >
            <option value="STUDENT">{lang === 'ar' ? 'طالب' : 'Student'}</option>
            <option value="DEAN">{lang === 'ar' ? 'عميد / رئيس قسم (صلاحيات كاملة)' : 'Dean / Head (Full Permissions)'}</option>
            <option value="SUPER_ADMIN">{lang === 'ar' ? 'مدير نظام (صلاحيات كاملة)' : 'Super Admin (Full Permissions)'}</option>
          </select>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'اسم المستخدم / الرقم الوظيفي' : 'Username / ID'}</label>
            <input required type="text" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
            <input required type="password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الاسم بالعربي' : 'Name (Arabic)'}</label>
            <input required type="text" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الاسم بالإنجليزي' : 'Name (English)'}</label>
            <input required type="text" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'القسم' : 'Department'}</label>
          <select 
            value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} 
            style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          >
            <option value="cs">{lang === 'ar' ? 'علم الحاسوب' : 'Computer Science'}</option>
            <option value="se">{lang === 'ar' ? 'هندسة البرمجيات' : 'Software Engineering'}</option>
            <option value="cyber">{lang === 'ar' ? 'الأمن السيبراني' : 'Cyber Security'}</option>
            <option value="dsai">{lang === 'ar' ? 'علم البيانات والذكاء الاصطناعي' : 'Data Science & AI'}</option>
          </select>
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1.2rem' }}>
          {lang === 'ar' ? 'تسجيل المستخدم' : 'Register User'}
        </button>
      </form>
    </div>
  );
};

export default RegisterUser;
