import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';

import { useLocale } from '../contexts/LocalizationContext';
import { Users, UserPlus, CheckSquare, LogOut, Check, X, Edit, Trash2, GraduationCap, AlertCircle, Info, Send, Plus } from 'lucide-react';

const AdminDashboard = () => {
  const { 
    user, logout, 
    users,
    pendingUsers, approveUser, rejectUser,
    alumniRequests, approveAlumniRequest, rejectAlumniRequest,
    deleteUser
  } = useAuth();
  
  useEffect(() => {
    if (users) localStorage.setItem('site_users', JSON.stringify(users));
    if (pendingUsers) localStorage.setItem('site_pending_users', JSON.stringify(pendingUsers));
    if (alumniRequests) localStorage.setItem('site_alumni_requests', JSON.stringify(alumniRequests));

  }, [users, pendingUsers, alumniRequests]);
  
  const { 
    facultyMembers, addFaculty, editFaculty, deleteFaculty,
    departments, addDepartment, deleteDepartment, updateDepartment,
    posts, pendingPosts, approvePost, rejectPost, deletePost,
    announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement,
    events, addEvent, deleteEvent, updateEvent
  } = useAdmin();
  const navigate = useNavigate();
  const { lang } = useLocale();

  const [activeTab, setActiveTab] = useState('approvals');

  useEffect(() => {
    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'DEAN')) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'DEAN')) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="loader-spinner" />
        <p style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'جارٍ التحقق من الصلاحيات...' : 'Checking permissions...'}</p>
      </div>
    );
  }

  const tabs = [
    { id: 'approvals', label: lang === 'ar' ? 'الموافقات المعلقة' : 'Pending Approvals', icon: <CheckSquare size={20} /> },
    { id: 'social', label: lang === 'ar' ? 'إدارة المنشورات والإعلانات' : 'Social & Announcements', icon: <Send size={20} /> },
    { id: 'alumni', label: lang === 'ar' ? 'طلبات الخريجين' : 'Alumni Requests', icon: <GraduationCap size={20} /> },
    { id: 'faculty', label: lang === 'ar' ? 'إدارة الأقسام / الهيئة' : 'Faculty Management', icon: <Users size={20} /> },
    { id: 'register', label: lang === 'ar' ? 'تسجيل مستخدم' : 'Register User', icon: <UserPlus size={20} /> },
    { id: 'users', label: lang === 'ar' ? 'إدارة الحسابات' : 'User Accounts', icon: <Users size={20} /> }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1280px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <h1 className="title" style={{ margin: 0 }}>
          {lang === 'ar' ? 'لوحة التحكم والإدارة' : 'Admin Control Panel'}
        </h1>
        <button 
          className="btn-outline" 
          onClick={() => { logout(); navigate('/'); }}
          style={{ borderColor: '#e74c3c', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          <LogOut size={18} />
          {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
        </button>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={activeTab === tab.id ? 'btn-primary' : 'btn-outline'}
            onClick={() => setActiveTab(tab.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, justifyContent: 'center' }}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 'approvals' && pendingUsers.length > 0 && (
              <span style={{ background: '#e74c3c', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.8rem', marginLeft: '5px' }}>
                {pendingUsers.length}
              </span>
            )}
            {tab.id === 'social' && pendingPosts.length > 0 && (
              <span style={{ background: '#e74c3c', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.8rem', marginLeft: '5px' }}>
                {pendingPosts.length}
              </span>
            )}
            {tab.id === 'alumni' && alumniRequests?.length > 0 && (
              <span style={{ background: '#e74c3c', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.8rem', marginLeft: '5px' }}>
                {alumniRequests.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '2rem', minHeight: '500px' }}>
        {activeTab === 'approvals' && pendingUsers && (
          <PendingApprovals 
            pendingUsers={pendingUsers} 
            approveUser={approveUser} 
            rejectUser={rejectUser} 
            lang={lang}
          />
        )}
        {activeTab === 'social' && (
          <SocialManagement 
            posts={posts}
            pendingPosts={pendingPosts}
            approvePost={approvePost}
            rejectPost={rejectPost}
            deletePost={deletePost}
            announcements={announcements}
            addAnnouncement={addAnnouncement}
            deleteAnnouncement={deleteAnnouncement}
            updateAnnouncement={updateAnnouncement}
            events={events}
            addEvent={addEvent}
            deleteEvent={deleteEvent}
            updateEvent={updateEvent}
            lang={lang}
          />
        )}
        {activeTab === 'alumni' && alumniRequests && (
          <AlumniRequests 
            alumniRequests={alumniRequests} 
            approveAlumniRequest={approveAlumniRequest} 
            rejectAlumniRequest={rejectAlumniRequest} 
            lang={lang}
          />
        )}
        {activeTab === 'faculty' && (
          <FacultyManagement 
            facultyMembers={facultyMembers || []} 
            addFaculty={addFaculty} 
            editFaculty={editFaculty} 
            deleteFaculty={deleteFaculty} 
            departments={departments || []}
            addDepartment={addDepartment}
            deleteDepartment={deleteDepartment}
            updateDepartment={updateDepartment}
            lang={lang}
          />
        )}
        {activeTab === 'users' && users && (
          <UserManagement 
            users={users} 
            lang={lang}
            deleteUser={deleteUser}
            updateUserRole={updateUserRole}
            updateUser={updateUser}
          />
        )}
        {activeTab === 'register' && (
          <RegisterUser 
            registerUserDirectly={registerUserDirectly} 
            lang={lang}
          />
        )}
      </div>
    </div>
  );
};

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
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <img src={reg.scheduleImage} alt="Schedule" style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer' }} onClick={() => window.open(reg.scheduleImage)} />
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
          <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
            <option value="cs">Computer Science</option>
            <option value="se">Software Engineering</option>
            <option value="cyber">Cyber Security</option>
            <option value="dsai">Data Science & AI</option>
          </select>
        </div>
        
        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
          {lang === 'ar' ? 'إنشاء الحساب فوراً' : 'Create Account Now'}
        </button>
      </form>
    </div>
  );
};

const UserManagement = ({ users, lang, deleteUser, updateUserRole, updateUser }) => {
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingUser, setEditingUser] = useState(null);

  const filteredUsers = users.filter(u => {
    const matchesRole = roleFilter === 'ALL' || u.role === roleFilter;
    const matchesSearch = u.username.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (u.name?.ar && u.name.ar.includes(searchQuery)) ||
                          (u.name?.en && u.name.en.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesRole && matchesSearch;
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

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <h3 style={{ color: 'var(--primary-light)', fontSize: '1.5rem' }}>
          {lang === 'ar' ? 'إدارة حسابات المستخدمين' : 'User Accounts Management'}
        </h3>
        
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', width: '100%', maxWidth: '800px' }}>

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

const SocialManagement = ({ posts, pendingPosts, approvePost, rejectPost, deletePost, announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement, events, addEvent, deleteEvent, updateEvent, lang }) => {
  const [newAnn, setNewAnn] = useState({ ar: '', en: '', type: 'info' });
  const [newEvent, setNewEvent] = useState({ date: '', ar: '', en: '' });
  const [editingEvent, setEditingEvent] = useState(null);

  const handleAddAnn = (e) => {
    e.preventDefault();
    addAnnouncement({ text: { ar: newAnn.ar, en: newAnn.en }, type: newAnn.type });
    setNewAnn({ ar: '', en: '', type: 'info' });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (editingEvent) {
      updateEvent({ id: editingEvent.id, date: newEvent.date, text: { ar: newEvent.ar, en: newEvent.en } });
      setEditingEvent(null);
    } else {
      addEvent({ date: newEvent.date, text: { ar: newEvent.ar, en: newEvent.en } });
    }
    setNewEvent({ date: '', ar: '', en: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--primary-light)', fontSize: '1.5rem', margin: 0 }}>
            {lang === 'ar' ? 'إدارة الإعلانات العلوية' : 'Manage Top Announcements'}
          </h3>
        </div>
        
        <form onSubmit={handleAddAnn} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', border: '1px solid var(--primary-color)' }}>
          <input 
            required type="text" placeholder={lang === 'ar' ? 'نص الإعلان بالعربي' : 'Arabic Text'} 
            value={newAnn.ar} onChange={e => setNewAnn({...newAnn, ar: e.target.value})}
            style={{ flex: '1 1 300px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
          <input 
            required type="text" placeholder={lang === 'ar' ? 'نص الإعلان بالإنجليزي' : 'English Text'} 
            value={newAnn.en} onChange={e => setNewAnn({...newAnn, en: e.target.value})}
            style={{ flex: '1 1 300px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
          <select 
            value={newAnn.type} onChange={e => setNewAnn({...newAnn, type: e.target.value})}
            style={{ flex: '0 0 150px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
          </select>
          <button type="submit" className="btn-primary" style={{ flex: '0 0 100px' }}>
            <Plus size={18} /> {lang === 'ar' ? 'إضافة' : 'Add'}
          </button>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {(announcements || []).map((ann) => (
            <div key={ann.id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: ann.type === 'warning' ? '#e74c3c' : '#3498db' }}>
                  {ann.type === 'warning' ? <AlertCircle size={20} /> : <Info size={20} />}
                  <h4 style={{ margin: 0 }}>{lang === 'ar' ? `إعلان` : `Announcement`}</h4>
                </div>
                <button onClick={() => deleteAnnouncement(ann.id)} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                  type="text" value={ann.text?.ar || ''} 
                  onChange={(e) => updateAnnouncement(ann.id, e.target.value, 'ar')}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                />
                <input 
                  type="text" value={ann.text?.en || ''} 
                  onChange={(e) => updateAnnouncement(ann.id, e.target.value, 'en')}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events Management */}
      <section>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)', fontSize: '1.5rem' }}>
          {lang === 'ar' ? 'إدارة الأحداث القادمة' : 'Manage Upcoming Events'}
        </h3>
        
        <form onSubmit={handleAddEvent} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', border: '1px solid var(--primary-color)' }}>
          <input 
            required type="text" placeholder={lang === 'ar' ? 'التاريخ (مثلاً: 28 APR)' : 'Date (e.g. 28 APR)'} 
            value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})}
            style={{ flex: '0 0 150px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
          <input 
            required type="text" placeholder={lang === 'ar' ? 'الحدث بالعربي' : 'Event in Arabic'} 
            value={newEvent.ar} onChange={e => setNewEvent({...newEvent, ar: e.target.value})}
            style={{ flex: '1 1 250px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
          <input 
            required type="text" placeholder={lang === 'ar' ? 'الحدث بالإنجليزي' : 'Event in English'} 
            value={newEvent.en} onChange={e => setNewEvent({...newEvent, en: e.target.value})}
            style={{ flex: '1 1 250px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
          <button type="submit" className="btn-primary" style={{ flex: '0 0 120px' }}>
            {editingEvent ? <Check size={18} /> : <Plus size={18} />}
            {editingEvent ? (lang === 'ar' ? 'تحديث' : 'Update') : (lang === 'ar' ? 'إضافة' : 'Add')}
          </button>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {(events || []).map((event) => (
            <div key={event.id} className="glass-panel" style={{ padding: '1rem', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{event.date}</span>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-primary)' }}>{event.text?.[lang] || event.text?.ar || ''}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => { setEditingEvent(event); setNewEvent({ date: event.date, ar: event.text?.ar || '', en: event.text?.en || '' }); }} style={{ color: '#f1c40f', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Edit size={18} />
                </button>
                <button onClick={() => deleteEvent(event.id)} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pending Posts Management */}
      <section>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)', fontSize: '1.5rem' }}>
          {lang === 'ar' ? 'منشورات الطلاب المعلقة' : 'Pending Student Posts'}
        </h3>
        {(!pendingPosts || pendingPosts.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'لا يوجد منشورات تنتظر الموافقة' : 'No posts awaiting approval.'}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {pendingPosts.map((post) => (
              <div key={post.id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{post.author?.name || 'Unknown'}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{post.date}</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>{post.content}</p>
                {post.image && <img src={post.image} alt="Post Attachment" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => approvePost(post.id)}
                    style={{ flex: 1, padding: '0.6rem', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Check size={18} /> {lang === 'ar' ? 'موافقة' : 'Approve'}
                  </button>
                  <button 
                    onClick={() => rejectPost(post.id)}
                    style={{ flex: 1, padding: '0.6rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <X size={18} /> {lang === 'ar' ? 'رفض' : 'Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Published Posts Management */}
      <section>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)', fontSize: '1.5rem' }}>
          {lang === 'ar' ? 'المنشورات المنشورة' : 'Published Posts'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(posts || []).map((post) => (
            <div key={post.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div>
                <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>{post.author?.name || 'Unknown'} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>({post.author?.role})</span></h4>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '600px' }}>{post.content}</p>
              </div>
              <button 
                onClick={() => deletePost(post.id)}
                style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;

