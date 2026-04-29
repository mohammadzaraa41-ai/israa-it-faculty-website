import React, { useState } from 'react';
import { Edit, Trash2 } from 'lucide-react';

const FacultyManagement = ({ 
  facultyMembers = [], addFaculty, editFaculty, deleteFaculty, 
  departments = [], addDepartment, deleteDepartment, updateDepartment,
  lang = 'ar' 
}) => {
  const [isEditing, setIsEditing] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('faculty'); // 'faculty' or 'departments'
  const [formData, setFormData] = useState({ 
    name: '', 
    departmentId: (departments && departments.length > 0) ? departments[0].id : '', 
    role: 'دكتور', 
    specialization: '', 
    courses: '', 
    office: '', 
    officeHours: '' 
  });

  const [deptFormData, setDeptFormData] = useState({ id: '', nameAr: '', nameEn: '' });
  const [isEditingDept, setIsEditingDept] = useState(null);

  if (!Array.isArray(departments)) {
    return <div style={{ padding: '2rem', color: '#e74c3c' }}>Error: Departments data is invalid.</div>;
  }

  const handleEdit = (member) => {
    if (!member) return;
    setIsEditing(member.id);
    setFormData(member);
  };

  const handleSave = (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        if (typeof editFaculty === 'function') {
           editFaculty(formData);
        }
      } else {
        if (typeof addFaculty === 'function') {
           addFaculty(formData);
        }
      }
      setIsEditing(null);
      setFormData({ 
        name: '', 
        departmentId: departments[0]?.id || '', 
        role: 'دكتور', 
        specialization: '', 
        courses: '', 
        office: '', 
        officeHours: '' 
      });
    } catch (err) {
      console.error("Save error in FacultyManagement:", err);
    }
  };

  const handleDeptSave = (e) => {
    e.preventDefault();
    if (isEditingDept) {
      updateDepartment({ id: deptFormData.id, name: { ar: deptFormData.nameAr, en: deptFormData.nameEn } });
    } else {
      addDepartment({ id: deptFormData.id || `dept_${Date.now()}`, name: { ar: deptFormData.nameAr, en: deptFormData.nameEn } });
    }
    setDeptFormData({ id: '', nameAr: '', nameEn: '' });
    setIsEditingDept(null);
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button 
          onClick={() => setActiveSubTab('faculty')} 
          style={{ background: 'none', border: 'none', color: activeSubTab === 'faculty' ? 'var(--primary-color)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: activeSubTab === 'faculty' ? 'bold' : 'normal', fontSize: '1.1rem' }}
        >
          {lang === 'ar' ? 'إدارة أعضاء الهيئة' : 'Manage Faculty'}
        </button>
        <button 
          onClick={() => setActiveSubTab('departments')} 
          style={{ background: 'none', border: 'none', color: activeSubTab === 'departments' ? 'var(--primary-color)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: activeSubTab === 'departments' ? 'bold' : 'normal', fontSize: '1.1rem' }}
        >
          {lang === 'ar' ? 'إدارة الأقسام' : 'Manage Departments'}
        </button>
      </div>

      {activeSubTab === 'faculty' ? (
        <>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)', fontSize: '1.5rem' }}>
            {lang === 'ar' ? 'إضافة / تعديل عضو هيئة تدريس' : 'Add / Edit Faculty'}
          </h3>
          
          <form onSubmit={handleSave} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <input 
              required type="text" placeholder={lang === 'ar' ? 'الاسم الكامل' : 'Full Name'} 
              value={formData.name || ''} onChange={e => setFormData({...formData, name: e.target.value})} 
              style={{ flex: '1 1 200px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
            />
            <select 
              required 
              value={formData.departmentId || ''} onChange={e => setFormData({...formData, departmentId: e.target.value})} 
              style={{ flex: '1 1 200px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
            >
              <option value="">{lang === 'ar' ? 'اختر القسم' : 'Select Department'}</option>
              {departments.map(dept => (
                <option key={dept.id} value={dept.id}>{dept.name?.[lang] || dept.name?.ar || dept.id}</option>
              ))}
            </select>
            <select 
              required 
              value={formData.role || 'دكتور'} onChange={e => setFormData({...formData, role: e.target.value})} 
              style={{ flex: '1 1 200px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
            >
              <option value="العميد">{lang === 'ar' ? 'العميد' : 'Dean'}</option>
              <option value="رئيس قسم">{lang === 'ar' ? 'رئيس قسم' : 'Head of Department'}</option>
              <option value="دكتور">{lang === 'ar' ? 'دكتور' : 'Doctor'}</option>
            </select>
            <input 
              type="text" placeholder={lang === 'ar' ? 'التخصص' : 'Specialization'} 
              value={formData.specialization || ''} onChange={e => setFormData({...formData, specialization: e.target.value})} 
              style={{ flex: '1 1 200px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
            />
            <input 
              type="text" placeholder={lang === 'ar' ? 'المواد التي يدرسها' : 'Courses Taught'} 
              value={formData.courses || ''} onChange={e => setFormData({...formData, courses: e.target.value})} 
              style={{ flex: '1 1 200px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
            />
            <input 
              type="text" placeholder={lang === 'ar' ? 'موقع المكتب' : 'Office Location'} 
              value={formData.office || ''} onChange={e => setFormData({...formData, office: e.target.value})} 
              style={{ flex: '1 1 200px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
            />
            <input 
              type="text" placeholder={lang === 'ar' ? 'الساعات المكتبية' : 'Office Hours'} 
              value={formData.officeHours || ''} onChange={e => setFormData({...formData, officeHours: e.target.value})} 
              style={{ flex: '1 1 200px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
            />
            
            <div style={{ flex: '1 1 100%', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                {isEditing ? (lang === 'ar' ? 'تحديث البيانات' : 'Update') : (lang === 'ar' ? 'إضافة جديد' : 'Add New')}
              </button>
              {isEditing && (
                <button type="button" className="btn-outline" onClick={() => { setIsEditing(null); setFormData({name:'', departmentId: departments[0]?.id || '', role:'دكتور'}) }} style={{ flex: 1 }}>
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              )}
            </div>
          </form>

          <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)', fontSize: '1.5rem' }}>
            {lang === 'ar' ? 'الهيئة التدريسية الحالية' : 'Current Faculty'}
          </h3>
          {facultyMembers.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px' }}>
               <p style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'لا يوجد أعضاء هيئة تدريس مضافين حالياً' : 'No faculty members found.'}</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {facultyMembers.map(member => {
                const dept = departments.find(d => d.id === member.departmentId);
                return (
                  <div key={member.id} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                    <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>{member.name?.ar || member.name}</h4>
                    <p style={{ color: 'var(--text-secondary)', marginBottom: '0.25rem' }}>
                      {dept?.name?.[lang] || dept?.name?.ar || member.departmentId || 'N/A'} - {member.role}
                    </p>
                    <p style={{ color: 'var(--primary-color)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>{member.specialization}</p>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', flex: 1 }}>
                      <p>📍 {member.office || '-'}</p>
                      <p>⏰ {member.officeHours || '-'}</p>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button 
                        onClick={() => handleEdit(member)}
                        style={{ flex: 1, padding: '0.5rem', background: 'transparent', color: '#f1c40f', border: '1px solid #f1c40f', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <Edit size={16} /> {lang === 'ar' ? 'تعديل' : 'Edit'}
                      </button>
                      <button 
                        onClick={() => deleteFaculty(member.id)}
                        style={{ flex: 1, padding: '0.5rem', background: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                      >
                        <Trash2 size={16} /> {lang === 'ar' ? 'حذف' : 'Delete'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        <>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)', fontSize: '1.5rem' }}>
            {lang === 'ar' ? 'إضافة / تعديل قسم' : 'Add / Edit Department'}
          </h3>
          <form onSubmit={handleDeptSave} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <input 
              required type="text" placeholder={lang === 'ar' ? 'رمز القسم (مثلاً: cs)' : 'Dept ID (e.g., cs)'} 
              value={deptFormData.id} onChange={e => setDeptFormData({...deptFormData, id: e.target.value})} 
              disabled={isEditingDept}
              style={{ flex: '1 1 150px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
            />
            <input 
              required type="text" placeholder={lang === 'ar' ? 'الاسم بالعربية' : 'Name in Arabic'} 
              value={deptFormData.nameAr} onChange={e => setDeptFormData({...deptFormData, nameAr: e.target.value})} 
              style={{ flex: '1 1 200px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
            />
            <input 
              required type="text" placeholder={lang === 'ar' ? 'الاسم بالإنجليزية' : 'Name in English'} 
              value={deptFormData.nameEn} onChange={e => setDeptFormData({...deptFormData, nameEn: e.target.value})} 
              style={{ flex: '1 1 200px', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
            />
            <div style={{ flex: '1 1 100%', display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="btn-primary" style={{ flex: 1 }}>
                {isEditingDept ? (lang === 'ar' ? 'تحديث القسم' : 'Update Dept') : (lang === 'ar' ? 'إضافة قسم جديد' : 'Add New Dept')}
              </button>
              {isEditingDept && (
                <button type="button" className="btn-outline" onClick={() => { setIsEditingDept(null); setDeptFormData({id:'', nameAr:'', nameEn:''}) }} style={{ flex: 1 }}>
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              )}
            </div>
          </form>

          <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)', fontSize: '1.5rem' }}>
            {lang === 'ar' ? 'الأقسام الحالية' : 'Current Departments'}
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {departments.map(dept => (
              <div key={dept.id} style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.5rem' }}>{dept.name?.[lang] || dept.name?.ar}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '1rem' }}>ID: {dept.id}</p>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setIsEditingDept(true); setDeptFormData({id: dept.id, nameAr: dept.name.ar, nameEn: dept.name.en}); }} style={{ flex: 1, padding: '0.4rem', background: 'transparent', color: '#f1c40f', border: '1px solid #f1c40f', borderRadius: '6px', cursor: 'pointer' }}>
                    <Edit size={14} />
                  </button>
                  <button onClick={() => deleteDepartment(dept.id)} style={{ flex: 1, padding: '0.4rem', background: 'transparent', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '6px', cursor: 'pointer' }}>
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default FacultyManagement;
