import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useLocale } from '../contexts/LocalizationContext';
import { Users, UserPlus, CheckSquare, LogOut, Check, X, Edit, Trash2, GraduationCap, Info, Send, Search, Shield, BookOpen, Settings } from 'lucide-react';
import './AdminDashboard.css';
import { useToast } from '../contexts/ToastContext';

const AdminDashboard = () => {
  const { lang, t } = useLocale();
  const { addToast } = useToast();
  const { 
    user, logout, 
    users, pendingUsers, approveUser, rejectUser,
    alumniRequests, approveAlumniRequest, rejectAlumniRequest,
    deleteUser, registerUserDirectly, updateUserRole, updateUser
  } = useAuth();
  
  const { 
    facultyMembers, addFaculty, editFaculty, deleteFaculty,
    departments, addDepartment, deleteDepartment, updateDepartment,
    posts, pendingPosts, approvePost, rejectPost, deletePost,
    announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement,
    events, addEvent, deleteEvent, updateEvent
  } = useAdmin();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('approvals');

  useEffect(() => {
    const isAdminRole = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);
    if (!user || !isAdminRole) navigate('/');
  }, [user, navigate]);

  if (!user || !['SUPER_ADMIN', 'DEAN'].includes(user.role)) {
    return (
      <div className="flex-center-vh">
        <div className="loader-spinner" />
        <p className="text-secondary">{lang === 'ar' ? 'جارٍ التحقق من الصلاحيات...' : 'Checking permissions...'}</p>
      </div>
    );
  }

  const tabs = [
    { id: 'approvals', label: t('admin.pending'), icon: <CheckSquare size={20} /> },
    { id: 'social', label: lang === 'ar' ? 'الإعلانات والمنشورات' : 'Social & Announcements', icon: <Send size={20} /> },
    { id: 'alumni', label: lang === 'ar' ? 'طلبات الخريجين' : 'Alumni Requests', icon: <GraduationCap size={20} /> },
    { id: 'faculty', label: t('admin.faculty'), icon: <Users size={20} /> },
    { id: 'analytics', label: t('admin.analytics'), icon: <Shield size={20} /> },
    { id: 'register', label: lang === 'ar' ? 'تسجيل مستخدم' : 'Register User', icon: <UserPlus size={20} /> },
    { id: 'users', label: t('admin.accounts'), icon: <Users size={20} /> }
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="title" style={{ margin: 0 }}>{t('admin.dashboard')}</h1>
        <button className="btn-outline" onClick={() => { logout(); navigate('/'); }} style={{ borderColor: '#e74c3c', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={18} /> {lang === 'ar' ? 'خروج' : 'Logout'}
        </button>
      </div>

      <div className="admin-tabs">
        {tabs.map(tab => (
          <button key={tab.id} className={`${activeTab === tab.id ? 'btn-primary' : 'btn-outline'} admin-tab-btn`} onClick={() => setActiveTab(tab.id)}>
            {tab.icon} {tab.label}
            {(tab.id === 'approvals' && pendingUsers.length > 0) && <span className="badge-count">{pendingUsers.length}</span>}
            {(tab.id === 'social' && pendingPosts.length > 0) && <span className="badge-count">{pendingPosts.length}</span>}
            {(tab.id === 'alumni' && alumniRequests?.length > 0) && <span className="badge-count">{alumniRequests.length}</span>}
          </button>
        ))}
      </div>

      <div className="glass-panel admin-content-panel">
        {activeTab === 'approvals' && <PendingApprovals pendingUsers={pendingUsers} approveUser={approveUser} rejectUser={rejectUser} lang={lang} addToast={addToast} />}
        {activeTab === 'social' && <SocialManagement posts={posts} pendingPosts={pendingPosts} approvePost={approvePost} rejectPost={rejectPost} deletePost={deletePost} announcements={announcements} addAnnouncement={addAnnouncement} deleteAnnouncement={deleteAnnouncement} updateAnnouncement={updateAnnouncement} events={events} addEvent={addEvent} deleteEvent={deleteEvent} updateEvent={updateEvent} lang={lang} />}
        {activeTab === 'alumni' && <AlumniRequests alumniRequests={alumniRequests} approveAlumniRequest={approveAlumniRequest} rejectAlumniRequest={rejectAlumniRequest} lang={lang} />}
        {activeTab === 'faculty' && <FacultyManagement facultyMembers={facultyMembers} addFaculty={addFaculty} editFaculty={editFaculty} deleteFaculty={deleteFaculty} departments={departments} addDepartment={addDepartment} deleteDepartment={deleteDepartment} updateDepartment={updateDepartment} lang={lang} />}
        {activeTab === 'analytics' && <AnalyticsDashboard users={users} pendingUsers={pendingUsers} alumniRequests={alumniRequests} lang={lang} />}
        {activeTab === 'users' && <UserManagement users={users} lang={lang} deleteUser={deleteUser} updateUserRole={updateUserRole} updateUser={updateUser} />}
        {activeTab === 'register' && <RegisterUser registerUserDirectly={registerUserDirectly} lang={lang} addToast={addToast} departments={departments} />}
      </div>
    </div>
  );
};

const AlumniRequests = ({ alumniRequests, approveAlumniRequest, rejectAlumniRequest, lang }) => {
  if (!alumniRequests || alumniRequests.length === 0) {
    return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}><GraduationCap size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} /><h3>{lang === 'ar' ? 'لا يوجد طلبات خريجين' : 'No alumni requests.'}</h3></div>;
  }
  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)' }}>{lang === 'ar' ? 'طلبات تفعيل بوابة الخريجين' : 'Alumni Access Requests'}</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {alumniRequests.map(reg => (
          <div key={reg.id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <div><h4>{reg.fullName}</h4><p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{reg.universityId}</p></div>
              <div style={{ background: 'var(--primary-color)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>{reg.hours} {lang === 'ar' ? 'ساعة' : 'Hours'}</div>
            </div>
            {reg.scheduleImage && <img src={reg.scheduleImage} alt="Schedule" style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px', cursor: 'pointer' }} onClick={() => window.open(reg.scheduleImage)} />}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              <button onClick={() => approveAlumniRequest(reg.id)} style={{ flex: 1, padding: '0.75rem', background: '#2ecc71', color: 'white', borderRadius: '8px' }}><Check size={18} /> {lang === 'ar' ? 'موافقة' : 'Approve'}</button>
              <button onClick={() => rejectAlumniRequest(reg.id)} style={{ flex: 1, padding: '0.75rem', background: '#e74c3c', color: 'white', borderRadius: '8px' }}><X size={18} /> {lang === 'ar' ? 'رفض' : 'Reject'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PendingApprovals = ({ pendingUsers, approveUser, rejectUser, lang, addToast }) => {
  if (pendingUsers.length === 0) return <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}><CheckSquare size={48} style={{ opacity: 0.5, marginBottom: '1rem' }} /><h3>{lang === 'ar' ? 'لا يوجد طلبات معلقة' : 'No pending registrations.'}</h3></div>;
  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)' }}>{lang === 'ar' ? 'طلبات التسجيل المعلقة' : 'Pending Registrations'}</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pendingUsers.map(reg => (
          <div key={reg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <div>
              <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{reg.fullName}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{reg.universityId} • {reg.major}</p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={async () => { if (await approveUser(reg.id)) addToast(lang === 'ar' ? 'تمت الموافقة' : 'Approved', '', 'success'); }} style={{ padding: '0.5rem 1rem', background: '#2ecc71', color: 'white', borderRadius: '8px' }}><Check size={18} /> {lang === 'ar' ? 'موافقة' : 'Approve'}</button>
              <button onClick={() => rejectUser(reg.id)} style={{ padding: '0.5rem 1rem', background: '#e74c3c', color: 'white', borderRadius: '8px' }}><X size={18} /> {lang === 'ar' ? 'رفض' : 'Reject'}</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const FacultyManagement = ({ facultyMembers = [], addFaculty, editFaculty, deleteFaculty, departments = [], addDepartment, deleteDepartment, updateDepartment, lang = 'ar' }) => {
  const [isEditing, setIsEditing] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('faculty');
  const [formData, setFormData] = useState({ name: '', departmentId: departments[0]?.id || '', role: 'دكتور', specialization: '', courses: '', office: '', officeHours: '' });
  const [deptFormData, setDeptFormData] = useState({ id: '', nameAr: '', nameEn: '' });
  const [isEditingDept, setIsEditingDept] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();
    if (isEditing) editFaculty(formData);
    else addFaculty(formData);
    setIsEditing(null);
    setFormData({ name: '', departmentId: departments[0]?.id || '', role: 'دكتور', specialization: '', courses: '', office: '', officeHours: '' });
  };

  return (
    <div>
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button onClick={() => setActiveSubTab('faculty')} style={{ background: 'none', border: 'none', color: activeSubTab === 'faculty' ? 'var(--primary-color)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: activeSubTab === 'faculty' ? 'bold' : 'normal' }}>{lang === 'ar' ? 'أعضاء الهيئة' : 'Faculty'}</button>
        <button onClick={() => setActiveSubTab('departments')} style={{ background: 'none', border: 'none', color: activeSubTab === 'departments' ? 'var(--primary-color)' : 'var(--text-secondary)', cursor: 'pointer', fontWeight: activeSubTab === 'departments' ? 'bold' : 'normal' }}>{lang === 'ar' ? 'الأقسام' : 'Departments'}</button>
      </div>
      {activeSubTab === 'faculty' ? (
        <>
          <form onSubmit={handleSave} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
            <input required placeholder={lang === 'ar' ? 'الاسم' : 'Name'} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} style={{ flex: '1 1 200px', padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }} />
            <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} style={{ flex: '1 1 200px', padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }}>
              {departments.map(d => <option key={d.id} value={d.id}>{d.name?.[lang] || d.name?.ar}</option>)}
            </select>
            <input placeholder={lang === 'ar' ? 'التخصص' : 'Specialization'} value={formData.specialization} onChange={e => setFormData({...formData, specialization: e.target.value})} style={{ flex: '1 1 200px', padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }} />
            <button type="submit" className="btn-primary" style={{ flex: '1 1 100%' }}>{isEditing ? (lang === 'ar' ? 'تحديث' : 'Update') : (lang === 'ar' ? 'إضافة' : 'Add')}</button>
          </form>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {facultyMembers.map(m => (
              <div key={m.id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)' }}>
                <h4>{m.name?.ar || m.name}</h4><p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{m.role} - {departments.find(d=>d.id===m.departmentId)?.name?.[lang] || m.departmentId}</p>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                  <button onClick={() => { setIsEditing(m.id); setFormData(m); }} style={{ flex: 1, color: '#f1c40f', background: 'none', border: '1px solid #f1c40f', borderRadius: '6px', padding: '0.4rem' }}><Edit size={14}/></button>
                  <button onClick={() => deleteFaculty(m.id)} style={{ flex: 1, color: '#e74c3c', background: 'none', border: '1px solid #e74c3c', borderRadius: '6px', padding: '0.4rem' }}><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </>
      ) : (
        /* Departments UI - Simplified */
        <div>
          <form onSubmit={(e) => { e.preventDefault(); if (isEditingDept) updateDepartment({id: deptFormData.id, name: {ar: deptFormData.nameAr, en: deptFormData.nameEn}}); else addDepartment({id: deptFormData.id, name: {ar: deptFormData.nameAr, en: deptFormData.nameEn}}); setDeptFormData({id:'', nameAr:'', nameEn:''}); setIsEditingDept(null); }} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
            <input required placeholder="ID (cs, se...)" value={deptFormData.id} onChange={e => setDeptFormData({...deptFormData, id: e.target.value})} disabled={isEditingDept} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }} />
            <input required placeholder="Name (AR)" value={deptFormData.nameAr} onChange={e => setDeptFormData({...deptFormData, nameAr: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }} />
            <input required placeholder="Name (EN)" value={deptFormData.nameEn} onChange={e => setDeptFormData({...deptFormData, nameEn: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }} />
            <button type="submit" className="btn-primary">{isEditingDept ? 'Update' : 'Add'}</button>
          </form>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
            {departments.map(d => (
              <div key={d.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div><strong>{d.name?.[lang] || d.name?.ar}</strong><div style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>{d.id}</div></div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setIsEditingDept(true); setDeptFormData({id: d.id, nameAr: d.name.ar, nameEn: d.name.en}); }} style={{ color: '#f1c40f' }}><Edit size={14}/></button>
                  <button onClick={() => deleteDepartment(d.id)} style={{ color: '#e74c3c' }}><Trash2 size={14}/></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const RegisterUser = ({ registerUserDirectly, lang, addToast, departments }) => {
  const [formData, setFormData] = useState({ username: '', password: '', role: 'STUDENT', nameAr: '', nameEn: '', departmentId: 'cs' });
  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await registerUserDirectly({ username: formData.username, password: formData.password, role: formData.role, name: { ar: formData.nameAr, en: formData.nameEn }, departmentId: formData.departmentId });
    if (res.success) { setFormData({ username: '', password: '', role: 'STUDENT', nameAr: '', nameEn: '', departmentId: 'cs' }); addToast('Success', '', 'success'); }
    else addToast('Error', res.message, 'error');
  };
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto' }}>
      <h3 style={{ marginBottom: '2rem', textAlign: 'center' }}>{lang === 'ar' ? 'تسجيل مستخدم جديد' : 'Register User'}</h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <input required placeholder="Username / ID" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }} />
          <input required type="password" placeholder="Password" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }} />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
          <input required placeholder="Name (AR)" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }} />
          <input required placeholder="Name (EN)" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }} />
        </div>
        <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }}>
          {departments.map(d => <option key={d.id} value={d.id}>{d.name?.[lang] || d.name?.ar}</option>)}
        </select>
        <select value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }}>
          <option value="STUDENT">Student</option><option value="DEAN">Dean / Head</option><option value="SUPER_ADMIN">Admin</option>
        </select>
        <button type="submit" className="btn-primary" style={{ padding: '1rem' }}>{lang === 'ar' ? 'إنشاء الحساب' : 'Create Account'}</button>
      </form>
    </div>
  );
};

const UserManagement = ({ users, lang, deleteUser, updateUserRole }) => {
  const [query, setQuery] = useState('');
  const filtered = users.filter(u => u.username.includes(query) || u.name?.ar?.includes(query) || u.name?.en?.toLowerCase().includes(query.toLowerCase()));
  return (
    <div>
      <div style={{ marginBottom: '2rem', position: 'relative' }}>
        <Search size={18} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-secondary)' }} />
        <input placeholder={lang === 'ar' ? 'بحث...' : 'Search...'} value={query} onChange={e => setQuery(e.target.value)} style={{ width: '100%', padding: '0.8rem 2.8rem 0.8rem 1rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filtered.map(u => (
          <div key={u.id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)' }}>
            <h4>{u.name?.ar || u.username}</h4><p style={{fontSize: '0.8rem', color: 'var(--text-secondary)'}}>#{u.username} - {u.role}</p>
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
              <button onClick={() => deleteUser(u.id)} style={{ flex: 1, color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '6px', padding: '0.4rem', background: 'none' }}>Delete</button>
              <select value={u.role} onChange={(e) => updateUserRole(u.id, e.target.value)} style={{ flex: 1, padding: '0.4rem', borderRadius: '6px', background: 'rgba(255,255,255,0.05)', color: 'white', border: '1px solid var(--border-color)' }}>
                <option value="STUDENT">Student</option><option value="DEAN">Dean</option><option value="SUPER_ADMIN">Admin</option>
              </select>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const SocialManagement = ({ posts, pendingPosts, approvePost, rejectPost, deletePost, announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement, events, addEvent, deleteEvent, updateEvent, lang }) => {
  const [newAnn, setNewAnn] = useState({ ar: '', en: '', type: 'info' });
  const [newEvent, setNewEvent] = useState({ date: '', ar: '', en: '' });
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Announcements */}
      <section>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--accent-color)' }}>{lang === 'ar' ? 'شريط الإعلانات المتحرك' : 'Scrolling Announcements'}</h3>
        <form onSubmit={(e) => { e.preventDefault(); addAnnouncement({ text: { ar: newAnn.ar, en: newAnn.en }, type: newAnn.type }); setNewAnn({ ar: '', en: '', type: 'info' }); }} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <input required placeholder="AR" value={newAnn.ar} onChange={e => setNewAnn({...newAnn, ar: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }} />
          <input required placeholder="EN" value={newAnn.en} onChange={e => setNewAnn({...newAnn, en: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }} />
          <button type="submit" className="btn-primary">Add</button>
        </form>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {announcements.map(a => (
            <div key={a.id} className="glass-panel" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <p style={{ margin: 0 }}>{a.text?.[lang] || a.text?.ar}</p>
              <button onClick={() => deleteAnnouncement(a.id)} style={{ color: '#e74c3c' }}><Trash2 size={16}/></button>
            </div>
          ))}
        </div>
      </section>

      {/* Events */}
      <section>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)' }}>{lang === 'ar' ? 'جدول الفعاليات' : 'Events Calendar'}</h3>
        <form onSubmit={(e) => { e.preventDefault(); addEvent({ date: newEvent.date, text: { ar: newEvent.ar, en: newEvent.en } }); setNewEvent({ date: '', ar: '', en: '' }); }} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
          <input required type="date" value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})} style={{ padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }} />
          <input required placeholder="AR" value={newEvent.ar} onChange={e => setNewEvent({...newEvent, ar: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }} />
          <input required placeholder="EN" value={newEvent.en} onChange={e => setNewEvent({...newEvent, en: e.target.value})} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', background: 'var(--bg-color)', color: 'white', border: '1px solid var(--border-color)' }} />
          <button type="submit" className="btn-primary">Add</button>
        </form>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem' }}>
          {events.map(ev => (
            <div key={ev.id} className="glass-panel" style={{ padding: '1rem' }}>
              <strong>{ev.date}</strong><p style={{ margin: '0.5rem 0' }}>{ev.text?.[lang] || ev.text?.ar}</p>
              <button onClick={() => deleteEvent(ev.id)} style={{ color: '#e74c3c' }}><Trash2 size={14}/></button>
            </div>
          ))}
        </div>
      </section>

      {/* Pending Posts */}
      <section>
        <h3 style={{ marginBottom: '1.5rem', color: '#f1c40f' }}>{lang === 'ar' ? 'منشورات بانتظار الموافقة' : 'Pending Posts'}</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {pendingPosts.map(p => (
            <div key={p.id} className="glass-panel" style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <strong>{p.author?.name}</strong><span>{p.date}</span>
              </div>
              <p>{p.content}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={() => approvePost(p.id)} style={{ padding: '0.5rem 1rem', background: '#2ecc71', color: 'white', borderRadius: '8px' }}>Approve</button>
                <button onClick={() => rejectPost(p.id)} style={{ padding: '0.5rem 1rem', background: '#e74c3c', color: 'white', borderRadius: '8px' }}>Reject</button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

const AnalyticsDashboard = ({ users = [], pendingUsers = [], alumniRequests = [], lang }) => (
  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '2rem' }}>
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}><h2 style={{ fontSize: '3rem', color: 'var(--primary-color)' }}>{users.length}</h2><p>{lang === 'ar' ? 'إجمالي المستخدمين' : 'Total Users'}</p></div>
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}><h2 style={{ fontSize: '3rem', color: '#f1c40f' }}>{pendingUsers.length}</h2><p>{lang === 'ar' ? 'طلبات معلقة' : 'Pending Requests'}</p></div>
    <div className="glass-panel" style={{ padding: '2rem', textAlign: 'center' }}><h2 style={{ fontSize: '3rem', color: 'var(--accent-color)' }}>{alumniRequests.length}</h2><p>{lang === 'ar' ? 'طلبات الخريجين' : 'Alumni Requests'}</p></div>
  </div>
);

export default AdminDashboard;
