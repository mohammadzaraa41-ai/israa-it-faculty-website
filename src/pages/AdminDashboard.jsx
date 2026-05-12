import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';

import { useLocale } from '../contexts/LocalizationContext';
import { Users, UserPlus, CheckSquare, LogOut, Check, X, Edit, Trash2, GraduationCap, Clock, AlertCircle, Info, Send, Plus, Search, Shield, BookOpen, Settings, Phone } from 'lucide-react';
import './AdminDashboard.css';

import { useToast } from '../contexts/ToastContext';
import { FLAT_COURSES } from '../constants/courses';

const AdminDashboard = () => {
  const { lang, t } = useLocale();
  const { addToast } = useToast();
  const { 
    user, logout, loading: authLoading,
    users,
    pendingUsers, approveUser, rejectUser,
    alumniRequests, approveAlumniRequest, rejectAlumniRequest,
    deleteUser, registerUserDirectly, updateUserRole, updateUser,
    fetchAllUsers, fetchPendingUsers
  } = useAuth();

  const { 
    facultyMembers, addFaculty, editFaculty, deleteFaculty,
    students,
    pendingRegistrations, approveRegistration, rejectRegistration,
    offeredCourses, addCourse, deleteCourse, editCourse,
    projectBank, addProject, deleteProject,
    cvTemplates, addCvTemplate, deleteCvTemplate,
    interviewResources, addInterviewResource, deleteInterviewResource,
    linkedinTips, addLinkedinTip, deleteLinkedinTip,
    departments, addDepartment, deleteDepartment, updateDepartment,
    posts, addPost, deletePost, editPost, toggleLike, approvePost, rejectPost, pendingPosts,
    announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement,
    events, addEvent, deleteEvent, updateEvent,
    gradTemplates, addGradTemplate, deleteGradTemplate, editGradTemplate,
    liveLabs, addLab, editLab, deleteLab,
    honorRoll, addHonorStudent, deleteHonorStudent, editHonorStudent,
    achievements, addAchievement, deleteAchievement, editAchievement,
    roadmapCourses, addRoadmapCourse, updateRoadmapCourse, deleteRoadmapCourse,
    loading, fetchAdminDashboardData 
  } = useAdmin();

  useEffect(() => {
    fetchAdminDashboardData();
    fetchAllUsers();
    fetchPendingUsers();
  }, []);

  const navigate = useNavigate();
  const location = useLocation();

  const [activeTab, setActiveTab] = useState(location.state?.tab || 'approvals');
  const [selectedUser, setSelectedUser] = useState(null);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state?.tab]);

  const isAdminRole = user?.role ? ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user.role) : false;

  useEffect(() => {
    if (!authLoading && (!user || !isAdminRole)) {
      navigate('/');
    }
  }, [user, isAdminRole, authLoading, navigate]);

  if (authLoading || !user || !isAdminRole) {
    return (
      <div className="flex-center-vh">
        <div className="loader-spinner" />
        <p className="text-secondary">{lang === 'ar' ? 'جارٍ التحقق من الصلاحيات...' : 'Checking permissions...'}</p>
      </div>
    );
  }

  const tabs = [
    { id: 'approvals', label: t('admin.pending'), icon: <CheckSquare size={20} /> },
    { id: 'social', label: lang === 'ar' ? 'إدارة المنشورات والإعلانات' : 'Social & Announcements', icon: <Send size={20} /> },
    { id: 'alumni', label: lang === 'ar' ? 'طلبات الخريجين' : 'Alumni Requests', icon: <GraduationCap size={20} /> },
    { id: 'faculty', label: t('admin.faculty'), icon: <Users size={20} /> },
    { id: 'courses', label: lang === 'ar' ? 'إدارة المواد' : 'Manage Courses', icon: <BookOpen size={20} /> },
    { id: 'analytics', label: t('admin.analytics'), icon: <Shield size={20} /> },
    { id: 'register', label: lang === 'ar' ? 'تسجيل مستخدم' : 'Register User', icon: <UserPlus size={20} /> },
    { id: 'users', label: t('admin.accounts'), icon: <Users size={20} /> }
  ];

  return (
    <div className="admin-container">
      <div className="admin-header">
        <h1 className="title" style={{ margin: 0 }}>
          {t('admin.dashboard')}
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

      <div className="admin-tabs">
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={`${activeTab === tab.id ? 'btn-primary' : 'btn-outline'} admin-tab-btn`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 'approvals' && pendingUsers.length > 0 && (
              <span className="badge-count">
                {pendingUsers.length}
              </span>
            )}
            {tab.id === 'social' && pendingPosts.length > 0 && (
              <span className="badge-count">
                {pendingPosts.length}
              </span>
            )}
            {tab.id === 'alumni' && alumniRequests?.length > 0 && (
              <span className="badge-count">
                {alumniRequests.length}
              </span>
            )}
          </button>
        ))}
      </div>

      <div className="glass-panel admin-content-panel">
        {activeTab === 'approvals' && pendingUsers && (
          <PendingApprovals 
            pendingUsers={pendingUsers} 
            approveUser={approveUser} 
            rejectUser={rejectUser} 
            lang={lang}
            fetchPendingUsers={fetchPendingUsers}
            addToast={addToast}
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
        {activeTab === 'courses' && (
          <CourseManagement 
            courses={roadmapCourses || []}
            addCourse={addRoadmapCourse}
            updateCourse={updateRoadmapCourse}
            deleteCourse={deleteRoadmapCourse}
            departments={departments || []}
            lang={lang}
          />
        )}
        {activeTab === 'analytics' && (
          <AnalyticsDashboard 
            users={users} 
            pendingUsers={pendingUsers} 
            alumniRequests={alumniRequests}
            departments={departments || []}
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
            departments={departments || []}
            setSelectedUser={setSelectedUser}
          />
        )}
        {activeTab === 'register' && (
          <RegisterUser 
            registerUserDirectly={registerUserDirectly} 
            departments={departments || []}
            lang={lang}
            addToast={addToast}
          />
        )}
      </div>

      {/* Global User Detail Modal - Outside glass panels for fixed positioning */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="glass-panel modal-content-scrollable" 
            onClick={e => e.stopPropagation()}
            style={{ padding: '2.5rem', position: 'relative' }}
          >
            <button 
              onClick={() => setSelectedUser(null)}
              style={{ position: 'absolute', top: '1rem', left: lang === 'ar' ? '1rem' : 'auto', right: lang === 'ar' ? 'auto' : '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '20px', background: 'var(--primary-color)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                <Users size={40} />
              </div>
              <h2 style={{ margin: 0, color: 'var(--text-primary)' }}>
                {selectedUser.name_ar || (typeof selectedUser.name === 'object' ? (selectedUser.name[lang] || selectedUser.name.ar) : selectedUser.name) || selectedUser.username}
              </h2>
              <p style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>#{selectedUser.username}</p>
            </div>

            <div style={{ display: 'grid', gap: '1rem' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>{lang === 'ar' ? 'الرتبة' : 'Role'}</label>
                <div style={{ fontWeight: 'bold' }}>{selectedUser.role || 'STUDENT'}</div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>{lang === 'ar' ? 'القسم' : 'Department'}</label>
                <div style={{ fontWeight: 'bold' }}>
                  {(() => {
                    const deptId = selectedUser.department_id || selectedUser.departmentId;
                    const dept = (departments || []).find(d => d.id === deptId);
                    return dept ? (dept.name?.[lang] || dept.name?.ar) : (deptId || '---');
                  })()}
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>{lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
                <div style={{ fontWeight: 'bold', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={16} /> {selectedUser.phone_number || selectedUser.phone || '---'}
                </div>
              </div>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                <label style={{ display: 'block', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>{lang === 'ar' ? 'تاريخ الانضمام' : 'Join Date'}</label>
                <div style={{ fontWeight: 'bold' }}>{selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB') : '---'}</div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

const AlumniRequests = ({ alumniRequests, approveAlumniRequest, rejectAlumniRequest, lang }) => {
  const [loadingId, setLoadingId] = React.useState(null);

  const handleApprove = async (reg) => {
    setLoadingId(reg.id + '-approve');
    const result = await approveAlumniRequest(reg.id);
    setLoadingId(null);
    if (result?.success) {
      alert(lang === 'ar' ? `✅ تمت الموافقة على ${reg.fullName || reg.full_name}` : `✅ Approved ${reg.fullName || reg.full_name}`);
    } else {
      alert(lang === 'ar' ? `❌ فشل: ${result?.message || 'خطأ غير معروف'}` : `❌ Failed: ${result?.message || 'Unknown error'}`);
    }
  };

  const handleReject = async (reg) => {
    if (!window.confirm(lang === 'ar' ? `هل تريد رفض طلب ${reg.fullName || reg.full_name}؟` : `Reject request from ${reg.fullName || reg.full_name}?`)) return;
    setLoadingId(reg.id + '-reject');
    const result = await rejectAlumniRequest(reg.id);
    setLoadingId(null);
    if (!result?.success) {
      alert(lang === 'ar' ? `❌ فشل الرفض: ${result?.message || 'خطأ غير معروف'}` : `❌ Reject Failed: ${result?.message}`);
    }
  };

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
                <h4 style={{ fontSize: '1.25rem', color: 'var(--text-primary)' }}>{reg.fullName || reg.full_name || '---'}</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>{reg.universityId || reg.university_id || '---'}</p>
              </div>
              <div style={{ background: 'var(--primary-color)', color: 'white', padding: '4px 10px', borderRadius: '6px', fontSize: '0.8rem' }}>
                {reg.hours} {lang === 'ar' ? 'ساعة' : 'Hours'}
              </div>
            </div>
            
            {(reg.scheduleImage || reg.schedule_image) && (
              <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
                <img 
                  src={reg.scheduleImage || reg.schedule_image} 
                  alt="Schedule" 
                  style={{ width: '100%', height: '150px', objectFit: 'cover', cursor: 'pointer' }} 
                  onClick={() => window.open(reg.scheduleImage || reg.schedule_image)} 
                />
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
              <button 
                onClick={() => handleApprove(reg)}
                disabled={loadingId === reg.id + '-approve' || loadingId === reg.id + '-reject'}
                style={{ 
                  flex: 1, padding: '0.75rem', 
                  background: loadingId === reg.id + '-approve' ? '#27ae60' : '#2ecc71', 
                  color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold',
                  opacity: loadingId ? 0.7 : 1
                }}
              >
                {loadingId === reg.id + '-approve' ? '...' : <><Check size={18} /> {lang === 'ar' ? 'موافقة' : 'Approve'}</>}
              </button>
              <button 
                onClick={() => handleReject(reg)}
                disabled={loadingId === reg.id + '-approve' || loadingId === reg.id + '-reject'}
                style={{ 
                  flex: 1, padding: '0.75rem', 
                  background: loadingId === reg.id + '-reject' ? '#c0392b' : '#e74c3c', 
                  color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', 
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold',
                  opacity: loadingId ? 0.7 : 1
                }}
              >
                {loadingId === reg.id + '-reject' ? '...' : <><X size={18} /> {lang === 'ar' ? 'رفض' : 'Reject'}</>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PendingApprovals = ({ pendingUsers, approveUser, rejectUser, lang, fetchPendingUsers, addToast }) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchPendingUsers();
    setTimeout(() => setIsRefreshing(false), 500);
  };

  if (pendingUsers.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
        <CheckSquare size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
        <h3>{lang === 'ar' ? 'لا يوجد طلبات معلقة' : 'No pending registrations.'}</h3>
        <button 
          onClick={handleRefresh} 
          className="btn-outline" 
          style={{ marginTop: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', marginInline: 'auto' }}
        >
          <Clock size={18} className={isRefreshing ? 'spin-animation' : ''} />
          {lang === 'ar' ? 'تحديث القائمة' : 'Refresh List'}
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h3 style={{ color: 'var(--primary-light)', fontSize: '1.5rem', margin: 0 }}>
          {lang === 'ar' ? 'طلبات التسجيل المعلقة' : 'Pending Registrations'}
        </h3>
        <button 
          onClick={handleRefresh} 
          className="btn-outline" 
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          disabled={isRefreshing}
        >
          <Clock size={18} className={isRefreshing ? 'spin-animation' : ''} />
          {lang === 'ar' ? 'تحديث' : 'Refresh'}
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {pendingUsers.map(reg => (
          <div key={reg.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
            <div>
              <h4 style={{ fontSize: '1.25rem', marginBottom: '0.25rem', color: 'var(--text-primary)' }}>{reg.fullName}</h4>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{lang === 'ar' ? 'طالب' : 'Student'}</span> • {reg.universityId} • {reg.major}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button 
                onClick={async () => {
                  try {
                    const result = await approveUser(reg.id);
                    if (result.success) {
                      addToast(
                        lang === 'ar' ? 'تمت الموافقة' : 'Approved',
                        lang === 'ar' ? `تم تفعيل حساب ${reg.fullName} بنجاح` : `Account for ${reg.fullName} activated.`,
                        'success'
                      );
                    } else {
                      addToast(
                        lang === 'ar' ? 'خطأ' : 'Error',
                        result.message || (lang === 'ar' ? 'فشل قبول المستخدم' : 'Failed to approve user'),
                        'error'
                      );
                    }
                  } catch (err) {
                    console.error("Approval click error:", err);
                  }
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

const IT_SPECIALIZATIONS = [
  { ar: "الذكاء الاصطناعي", en: "Artificial Intelligence" },
  { ar: "شبكات الحاسوب", en: "Computer Networks" },
  { ar: "هندسة الالكترونيات والاتصالات/ امن شبكات", en: "Electronics and Communications Engineering / Network Security" },
  { ar: "الحاسوب/انظمة ذكية", en: "Computer / Intelligent Systems" },
  { ar: "هندسة البرمجيات", en: "Software Engineering" },
  { ar: "الأمن السيبراني", en: "Cyber Security" },
  { ar: "علم البيانات والذكاء الاصطناعي", en: "Data Science and AI" },
  { ar: "نظم المعلومات الحاسوبية", en: "Computer Information Systems" },
  { ar: "الوسائط المتعددة", en: "Multimedia" },
  { ar: "أنظمة الشبكات", en: "Network Systems" },
  { ar: "الحوسبة السحابية", en: "Cloud Computing" },
  { ar: "تطوير تطبيقات الويب", en: "Web Development" },
  { ar: "تطوير تطبيقات الموبايل", en: "Mobile Development" },
  { ar: "إنترنت الأشياء (IoT)", en: "Internet of Things" },
  { ar: "الواقع الافتراضي والمعزز", en: "VR/AR" },
  { ar: "أمن المعلومات", en: "Information Security" },
  { ar: "إدارة قواعد البيانات", en: "Database Management" },
  { ar: "هندسة النظم المدمجة", en: "Embedded Systems Engineering" },
  { ar: "تقنيات بلوكتشين", en: "Blockchain Technologies" },
  { ar: "أخرى (كتابة يدوية)", en: "Other (Manual)" }
];

const FacultyManagement = ({ 
  facultyMembers = [], addFaculty, editFaculty, deleteFaculty, 
  departments = [], addDepartment, deleteDepartment, updateDepartment,
  lang = 'ar' 
}) => {
  const [courseSearch, setCourseSearch] = useState('');
  const [showCourseSuggestions, setShowCourseSuggestions] = useState(false);
  const [isEditing, setIsEditing] = useState(null);
  const [activeSubTab, setActiveSubTab] = useState('faculty');
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
    
    // Ensure name is a string for the input field
    const nameStr = typeof member.name === 'object' 
      ? (member.name.ar || member.name.en || '') 
      : (member.name || '');
      
    setFormData({
      ...member,
      name: nameStr,
      departmentId: member.departmentId || member.department_id || member.department || member.dept_id || (departments[0]?.id || '')
    });
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
          
          <form onSubmit={handleSave} style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '3rem', padding: '1.5rem', background: 'var(--surface-color)', borderRadius: '12px', border: '1px solid var(--surface-border)' }}>
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
            <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <select 
                required
                value={IT_SPECIALIZATIONS.some(s => (lang === 'ar' ? s.ar : s.en) === formData.specialization) ? formData.specialization : (formData.specialization ? (lang === 'ar' ? "أخرى (كتابة يدوية)" : "Other (Manual)") : "")} 
                onChange={e => {
                  if (e.target.value === "أخرى (كتابة يدوية)" || e.target.value === "Other (Manual)") {
                    setFormData({...formData, specialization: ''});
                  } else {
                    setFormData({...formData, specialization: e.target.value});
                  }
                }} 
                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="">{lang === 'ar' ? 'اختر التخصص' : 'Select Specialization'}</option>
                {IT_SPECIALIZATIONS.map(spec => (
                  <option key={spec.en} value={lang === 'ar' ? spec.ar : spec.en}>
                    {lang === 'ar' ? spec.ar : spec.en}
                  </option>
                ))}
              </select>
              {(!IT_SPECIALIZATIONS.some(s => (lang === 'ar' ? s.ar : s.en) === formData.specialization) || formData.specialization === '') && (
                <input 
                  type="text" 
                  placeholder={lang === 'ar' ? 'اكتب التخصص هنا...' : 'Write specialization here...'} 
                  value={formData.specialization || ''} 
                  onChange={e => setFormData({...formData, specialization: e.target.value})}
                  style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--accent-color)', background: 'rgba(var(--accent-rgb), 0.1)', color: 'var(--text-primary)' }}
                />
              )}
            </div>
            <div style={{ flex: '1 1 100%', position: 'relative' }}>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                {lang === 'ar' ? 'المواد التي يدرسها (اختر من القائمة)' : 'Courses Taught (Select from list)'}
              </label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', padding: '0.5rem', border: '1px solid var(--border-color)', borderRadius: '8px', background: 'var(--bg-color)', minHeight: '50px' }}>
                {formData.courses && formData.courses.split(',').filter(c => c.trim()).map((course, idx) => (
                  <span key={idx} style={{ background: 'var(--primary-color)', color: 'white', padding: '2px 10px', borderRadius: '15px', fontSize: '0.8rem', display: 'flex', alignItems: 'center', gap: '5px' }}>
                    {course.trim()}
                    <X size={14} style={{ cursor: 'pointer' }} onClick={() => {
                      const current = formData.courses.split(',').filter(c => c.trim() !== course.trim());
                      setFormData({...formData, courses: current.join(',')});
                    }} />
                  </span>
                ))}
                <input 
                  type="text" 
                  placeholder={lang === 'ar' ? 'ابحث عن مادة...' : 'Search course...'} 
                  value={courseSearch}
                  onChange={e => {
                    setCourseSearch(e.target.value);
                    setShowCourseSuggestions(true);
                  }}
                  onFocus={() => setShowCourseSuggestions(true)}
                  style={{ flex: 1, border: 'none', background: 'transparent', color: 'var(--text-primary)', outline: 'none', minWidth: '150px' }}
                />
              </div>
              
              {showCourseSuggestions && courseSearch && (
                <div className="glass-panel" style={{ position: 'absolute', top: '100%', left: 0, right: 0, zIndex: 100, maxHeight: '200px', overflowY: 'auto', marginTop: '5px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
                  {FLAT_COURSES.filter(c => c.includes(courseSearch) && !(formData.courses || '').includes(c)).map((c, idx) => (
                    <div 
                      key={idx} 
                      onClick={() => {
                        const current = formData.courses ? formData.courses.split(',').filter(v => v.trim()) : [];
                        setFormData({...formData, courses: [...current, c].join(',')});
                        setCourseSearch('');
                        setShowCourseSuggestions(false);
                      }}
                      style={{ padding: '0.8rem 1.2rem', cursor: 'pointer', borderBottom: '1px solid rgba(255,255,255,0.05)', hover: { background: 'rgba(255,255,255,0.1)' } }}
                      onMouseEnter={e => e.target.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseLeave={e => e.target.style.background = 'transparent'}
                    >
                      {c}
                    </div>
                  ))}
                </div>
              )}
            </div>
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
                    <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                      {member.name_ar || (typeof member.name === 'object' ? (member.name[lang] || member.name.ar) : member.name) || '---'}
                    </h4>
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

const RegisterUser = ({ registerUserDirectly, departments = [], lang, addToast }) => {
  const [formData, setFormData] = useState({ 
    username: '', 
    password: '', 
    role: 'STUDENT', 
    nameAr: '', 
    nameEn: '',
    phone: '',
    dob: '',
    major: 'cs',
    year: '1',
    semester: '1',
    hours: 0,
    departmentId: (departments && departments.length > 0) ? departments[0].id : 'cs'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password.length < 6) {
      addToast(
        lang === 'ar' ? 'كلمة المرور قصيرة' : 'Short Password',
        lang === 'ar' ? 'يجب أن تكون كلمة المرور 6 أحرف على الأقل' : 'Password must be at least 6 characters',
        'error'
      );
      return;
    }
    try {
      const yearSemLabel = lang === 'ar' ? `سنة ${formData.year} - فصل ${formData.semester}` : `Year ${formData.year} - Sem ${formData.semester}`;
      
      const result = await registerUserDirectly({ 
        username: formData.username,
        password: formData.password,
        role: formData.role,
        name: { ar: formData.nameAr, en: formData.nameEn },
        departmentId: formData.departmentId,
        phone: formData.phone,
        dob: formData.dob,
        major: formData.major,
        yearSem: yearSemLabel,
        hours: formData.hours
      });
      
      if (result.success) {
        setFormData({ 
          username: '', password: '', role: 'STUDENT', nameAr: '', nameEn: '', 
          phone: '', dob: '', major: 'cs', year: '1', semester: '1', hours: 0, 
          departmentId: (departments && departments.length > 0) ? departments[0].id : 'cs' 
        });
        addToast(
          lang === 'ar' ? 'تم بنجاح' : 'Success',
          lang === 'ar' ? 'تم إنشاء الحساب بنجاح' : 'Account created successfully',
          'success'
        );
      } else {
        addToast(
          lang === 'ar' ? 'خطأ' : 'Error',
          result.message || (lang === 'ar' ? 'فشل إنشاء الحساب' : 'Failed to create account'),
          'error'
        );
      }
    } catch (err) {
      addToast(lang === 'ar' ? 'خطأ تقني' : 'System Error', err.message, 'error');
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)', fontSize: '1.5rem', textAlign: 'center' }}>
        {lang === 'ar' ? 'تسجيل مستخدم جديد (بيانات كاملة)' : 'Full User Registration'}
      </h3>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div className="glass-panel" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', border: '1px solid var(--border-color)' }}>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'نوع الحساب' : 'Account Type'}</label>
              <select 
                value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} 
                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
              >
                <option value="STUDENT">{lang === 'ar' ? 'طالب' : 'Student'}</option>
                <option value="DOCTOR">{lang === 'ar' ? 'دكتور / مدرس' : 'Doctor / Instructor'}</option>
                <option value="HOD">{lang === 'ar' ? 'رئيس قسم' : 'Head of Department'}</option>
                <option value="DEAN">{lang === 'ar' ? 'العميد' : 'Dean'}</option>
                <option value="SUPER_ADMIN">{lang === 'ar' ? 'مدير نظام' : 'Super Admin'}</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الرقم الجامعي / اسم المستخدم' : 'University ID / Username'}</label>
              <input 
                required type="text" autoComplete="new-password" 
                value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} 
                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} 
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الاسم بالعربي' : 'Name (Arabic)'}</label>
              <input required type="text" value={formData.nameAr} onChange={e => setFormData({...formData, nameAr: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الاسم بالإنجليزي' : 'Name (English)'}</label>
              <input required type="text" value={formData.nameEn} onChange={e => setFormData({...formData, nameEn: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
              <input 
                required type="password" autoComplete="new-password" 
                value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} 
                style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} 
                minLength="6"
              />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
              <input type="text" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'التخصص' : 'Major'}</label>
              <select value={formData.major} onChange={e => setFormData({...formData, major: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                <option value="cs">{lang === 'ar' ? 'علوم حاسوب' : 'Computer Science'}</option>
                <option value="se">{lang === 'ar' ? 'هندسة برمجيات' : 'Software Engineering'}</option>
                <option value="cyber">{lang === 'ar' ? 'أمن سيبراني' : 'Cyber Security'}</option>
                <option value="dsai">{lang === 'ar' ? 'ذكاء اصطناعي' : 'AI & Data Science'}</option>
                <option value="mm">{lang === 'ar' ? 'وسائط متعددة' : 'Multimedia'}</option>
                <option value="cis">{lang === 'ar' ? 'نظم معلومات' : 'CIS'}</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'القسم الإداري' : 'Department'}</label>
              <select value={formData.departmentId} onChange={e => setFormData({...formData, departmentId: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                {departments.map(dept => (
                  <option key={dept.id} value={dept.id}>{dept.name?.[lang] || dept.name?.ar || dept.id}</option>
                ))}
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth'}</label>
              <input type="date" value={formData.dob} onChange={e => setFormData({...formData, dob: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'السنة الدراسية' : 'Academic Year'}</label>
              <select value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                <option value="1">{lang === 'ar' ? 'سنة أولى' : 'Year 1'}</option>
                <option value="2">{lang === 'ar' ? 'سنة ثانية' : 'Year 2'}</option>
                <option value="3">{lang === 'ar' ? 'سنة ثالثة' : 'Year 3'}</option>
                <option value="4">{lang === 'ar' ? 'سنة رابعة' : 'Year 4'}</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الفصل الدراسي' : 'Semester'}</label>
              <select value={formData.semester} onChange={e => setFormData({...formData, semester: e.target.value})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}>
                <option value="1">{lang === 'ar' ? 'فصل أول' : 'Semester 1'}</option>
                <option value="2">{lang === 'ar' ? 'فصل ثاني' : 'Semester 2'}</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', marginBottom: '0.5rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'الساعات المنجزة' : 'Hours Done'}</label>
              <input type="number" value={formData.hours} onChange={e => setFormData({...formData, hours: parseInt(e.target.value) || 0})} style={{ width: '100%', padding: '1rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }} />
            </div>
          </div>

          <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1.2rem', fontSize: '1.1rem' }}>
            {lang === 'ar' ? 'إنشاء الحساب فوراً' : 'Create Account Now'}
          </button>
        </div>
      </form>
    </div>
  );
};

const UserManagement = ({ users, lang, deleteUser, updateUserRole, updateUser, departments = [], setSelectedUser }) => {
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

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
      case 'DEAN': return { bg: '#f1c40f22', text: '#f1c40f', label: lang === 'ar' ? 'عضو هيئة تدريس' : 'Faculty Member' };
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
                 role === 'DEAN' ? (lang === 'ar' ? 'أعضاء هيئة التدريس' : 'Faculty') : (lang === 'ar' ? 'طلاب' : 'Students')}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filteredUsers.map(u => {
          const badge = getRoleBadgeStyle(u.role);
          const isGeneric = !u.name_ar || u.name_ar === "مستخدم جديد";
          const userName = isGeneric ? u.username : u.name_ar;
          const userPhone = u.phone_number || u.phone || '---';
          
          return (
            <div key={u.id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', position: 'relative', overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.2s' }} onClick={() => setSelectedUser(u)}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: badge.bg, color: badge.text, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Shield size={24} />
                  </div>
                  <div>
                    <h4 style={{ color: 'var(--text-primary)', fontSize: '1.1rem', margin: 0 }}>{userName}</h4>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', margin: 0 }}>#{u.username}</p>
                  </div>
                </div>
                <span style={{ padding: '4px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold', background: badge.bg, color: badge.text }}>
                  {badge.label}
                </span>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <BookOpen size={14} /> 
                  {(() => {
                    const dept = departments.find(d => d.id === u.departmentId);
                    return dept ? (dept.name?.[lang] || dept.name?.ar) : u.departmentId;
                  })()}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <Phone size={14} /> {userPhone}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <Shield size={14} /> {lang === 'ar' ? 'كلمة المرور:' : 'Password:'} <span style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>********</span>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid var(--border-color)', paddingTop: '1rem' }} onClick={e => e.stopPropagation()}>
                <button 
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (window.confirm(lang === 'ar' ? 'هل أنت متأكد من حذف هذا الحساب نهائياً من الموقع ونظام الدخول؟' : 'Are you sure you want to delete this account permanently from the site and Auth system?')) {
                      const result = await deleteUser(u.id);
                      if (result.success) {
                        addToast(
                          lang === 'ar' ? 'تم الحذف' : 'Deleted',
                          lang === 'ar' ? 'تم حذف المستخدم وحسابه بنجاح' : 'User and auth account deleted successfully',
                          'success'
                        );
                      } else {
                        addToast(
                          lang === 'ar' ? 'خطأ' : 'Error',
                          result.message || (lang === 'ar' ? 'فشل حذف المستخدم' : 'Failed to delete user'),
                          'error'
                        );
                      }
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
                  <option value="DOCTOR">Doctor</option>
                  <option value="HOD">Head of Dept (HOD)</option>
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

  const [isEditPostOpen, setIsEditPostOpen] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [editPostContent, setEditPostContent] = useState('');
  const [editPostImage, setEditPostImage] = useState('');

  const [isEditAnnOpen, setIsEditAnnOpen] = useState(false);
  const [editingAnn, setEditingAnn] = useState(null);
  const [editAnnText, setEditAnnText] = useState({ ar: '', en: '' });
  const [editAnnType, setEditAnnType] = useState('info');

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

  const handleEditPost = (post) => {
    setEditingPost(post);
    setEditPostContent(post.content);
    setEditPostImage(post.image || '');
    setIsEditPostOpen(true);
  };

  const saveEditedPost = async () => {
    if (!editingPost) return;
    await editPost(editingPost.id, {
      content: editPostContent,
      image: editPostImage
    });
    setIsEditPostOpen(false);
    setEditingPost(null);
  };

  const handleEditAnn = (ann) => {
    setEditingAnn(ann);
    setEditAnnText({ ar: ann.text?.ar || '', en: ann.text?.en || '' });
    setEditAnnType(ann.type || 'info');
    setIsEditAnnOpen(true);
  };

  const saveEditedAnn = async () => {
    if (!editingAnn) return;
    await updateAnnouncement(editingAnn.id, {
      text: editAnnText,
      type: editAnnType
    });
    setIsEditAnnOpen(false);
    setEditingAnn(null);
    addToast(lang === 'ar' ? 'تم التحديث' : 'Updated', lang === 'ar' ? 'تم تحديث الإعلان بنجاح' : 'Announcement updated successfully', 'success');
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

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.2rem' }}>
          {(announcements || []).map((ann) => (
            <div key={ann.id} className="glass-panel" style={{ padding: '1.2rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.8rem' }}>
                <div style={{ padding: '8px', borderRadius: '8px', background: ann.type === 'warning' ? '#e74c3c22' : '#3498db22', color: ann.type === 'warning' ? '#e74c3c' : '#3498db' }}>
                  {ann.type === 'warning' ? <AlertCircle size={20} /> : <Info size={20} />}
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 'bold', color: 'var(--text-primary)', fontSize: '0.95rem', lineHeight: '1.4' }}>{ann.text?.[lang] || ann.text?.ar}</p>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>{ann.type}</span>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '0.8rem' }}>
                <button onClick={() => handleEditAnn(ann)} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #f1c40f', color: '#f1c40f', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Edit size={16} /> {lang === 'ar' ? 'تعديل' : 'Edit'}
                </button>
                <button onClick={() => deleteAnnouncement(ann.id)} style={{ flex: 1, padding: '0.5rem', borderRadius: '6px', border: '1px solid #e74c3c', color: '#e74c3c', background: 'transparent', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                  <Trash2 size={16} /> {lang === 'ar' ? 'حذف' : 'Delete'}
                </button>
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
            style={{ flex: '1 1 120px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
          <input 
            required type="text" placeholder={lang === 'ar' ? 'الحدث بالعربي' : 'Event in Arabic'} 
            value={newEvent.ar} onChange={e => setNewEvent({...newEvent, ar: e.target.value})}
            style={{ flex: '1 1 200px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
          <input 
            required type="text" placeholder={lang === 'ar' ? 'الحدث بالإنجليزي' : 'Event in English'} 
            value={newEvent.en} onChange={e => setNewEvent({...newEvent, en: e.target.value})}
            style={{ flex: '1 1 200px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
          <button type="submit" className="btn-primary" style={{ flex: '1 1 100px' }}>
            {editingEvent ? <Check size={18} /> : <Plus size={18} />}
            {editingEvent ? (lang === 'ar' ? 'تحديث' : 'Update') : (lang === 'ar' ? 'إضافة' : 'Add')}
          </button>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.2rem' }}>
          {(events || []).map((event) => (
            <div key={event.id} className="glass-panel" style={{ padding: '1.2rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ background: 'var(--primary-color)', color: 'white', padding: '4px 12px', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold' }}>{event.date}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => { setEditingEvent(event); setNewEvent({ date: event.date, ar: event.text?.ar || '', en: event.text?.en || '' }); }} style={{ color: '#f1c40f', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Edit size={18} />
                  </button>
                  <button onClick={() => deleteEvent(event.id)} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}>
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
              <p style={{ margin: 0, color: 'var(--text-primary)', fontWeight: '500' }}>{event.text?.[lang] || event.text?.ar || ''}</p>
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {pendingPosts.map((post) => (
              <div key={post.id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--primary-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                      {(post.author?.name || 'U').charAt(0)}
                    </div>
                    <div>
                      <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>{post.author?.name || 'Unknown'}</h4>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{post.date}</span>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleEditPost(post)}
                    style={{ background: 'transparent', border: 'none', color: '#f1c40f', cursor: 'pointer' }}
                  >
                    <Edit size={18} />
                  </button>
                </div>
                <p style={{ color: 'var(--text-primary)', marginBottom: '1.2rem', fontSize: '0.95rem', lineHeight: '1.5', flex: 1 }}>{post.content}</p>
                {post.image && <img src={post.image} alt="Post Attachment" style={{ width: '100%', borderRadius: '8px', marginBottom: '1.2rem', height: '180px', objectFit: 'cover' }} />}
                <div style={{ display: 'flex', gap: '0.8rem', marginTop: 'auto' }}>
                  <button 
                    onClick={() => approvePost(post.id)}
                    style={{ flex: 1, padding: '0.75rem', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}
                  >
                    <Check size={18} /> {lang === 'ar' ? 'موافقة' : 'Approve'}
                  </button>
                  <button 
                    onClick={() => rejectPost(post.id)}
                    style={{ flex: 1, padding: '0.75rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold' }}
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
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.2rem' }}>
          {(posts || []).map((post) => (
            <div key={post.id} className="glass-panel" style={{ padding: '1.2rem', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                  <div style={{ width: '35px', height: '35px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--primary-color)', fontWeight: 'bold', fontSize: '0.8rem' }}>
                    {(post.author?.name || 'U').charAt(0)}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{post.author?.name || 'Unknown'}</h4>
                    <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{post.author?.role} • {post.date}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button 
                    onClick={() => handleEditPost(post)}
                    style={{ background: 'transparent', border: '1px solid #f1c40f', color: '#f1c40f', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Edit size={14} />
                  </button>
                  <button 
                    onClick={() => deletePost(post.id)}
                    style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', padding: '0.4rem', borderRadius: '6px', cursor: 'pointer' }}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
              <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>{post.content}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Edit Post Modal */}
      {isEditPostOpen && (
        <div className="login-modal-overlay" style={{ zIndex: 10000 }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '600px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setIsEditPostOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
              {lang === 'ar' ? 'تعديل المنشور' : 'Edit Post'}
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="input-group">
                <label>{lang === 'ar' ? 'المحتوى' : 'Content'}</label>
                <textarea 
                  rows="6"
                  value={editPostContent}
                  onChange={(e) => setEditPostContent(e.target.value)}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', resize: 'vertical' }}
                />
              </div>
              
              <div className="input-group">
                <label>{lang === 'ar' ? 'رابط الصورة' : 'Image URL'}</label>
                <input 
                  type="text"
                  value={editPostImage}
                  onChange={(e) => setEditPostImage(e.target.value)}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button 
                  onClick={saveEditedPost}
                  className="btn-primary"
                  style={{ flex: 1, padding: '1rem' }}
                >
                  <Check size={20} /> {lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
                <button 
                  onClick={() => setIsEditPostOpen(false)}
                  className="btn-outline"
                  style={{ flex: 1, padding: '1rem' }}
                >
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditAnnOpen && (
        <div className="login-modal-overlay" style={{ zIndex: 10000 }}>
          <div className="glass-panel" style={{ width: '90%', maxWidth: '600px', padding: '2rem', position: 'relative' }}>
            <button 
              onClick={() => setIsEditAnnOpen(false)}
              style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
            >
              <X size={24} />
            </button>
            <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
              {lang === 'ar' ? 'تعديل الإعلان العلوي' : 'Edit Top Announcement'}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              <div className="input-group">
                <label>{lang === 'ar' ? 'النص بالعربي' : 'Arabic Text'}</label>
                <input 
                  type="text" value={editAnnText.ar}
                  onChange={(e) => setEditAnnText({ ...editAnnText, ar: e.target.value })}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <div className="input-group">
                <label>{lang === 'ar' ? 'النص بالإنجليزي' : 'English Text'}</label>
                <input 
                  type="text" value={editAnnText.en}
                  onChange={(e) => setEditAnnText({ ...editAnnText, en: e.target.value })}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                />
              </div>
              <div className="input-group">
                <label>{lang === 'ar' ? 'نوع الإعلان' : 'Announcement Type'}</label>
                <select 
                  value={editAnnType}
                  onChange={(e) => setEditAnnType(e.target.value)}
                  style={{ width: '100%', padding: '1rem', borderRadius: '12px', background: 'var(--bg-color)', border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                >
                  <option value="info">Info</option>
                  <option value="warning">Warning</option>
                </select>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button onClick={saveEditedAnn} className="btn-primary" style={{ flex: 1, padding: '1rem' }}>
                  <Check size={20} /> {lang === 'ar' ? 'حفظ' : 'Save'}
                </button>
                <button onClick={() => setIsEditAnnOpen(false)} className="btn-outline" style={{ flex: 1, padding: '1rem' }}>
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AnalyticsDashboard = ({ users = [], pendingUsers = [], alumniRequests = [], departments = [], lang }) => {
  // Filter to include only students in these analytics
  const studentUsers = users.filter(u => u.role === 'STUDENT' || !u.role);
  
  // Generate stats dynamically for all departments
  const byDept = {};
  departments.forEach(dept => {
    byDept[dept.id] = studentUsers.filter(u => u.departmentId === dept.id).length;
  });

  // Add "Unassigned" category for students without a departmentId
  const unassignedCount = studentUsers.filter(u => !u.departmentId || u.departmentId === '---').length;
  if (unassignedCount > 0) {
    byDept['unassigned'] = unassignedCount;
  }

  const stats = {
    totalUsers: users.length,
    totalStudents: studentUsers.length,
    pending: pendingUsers.length,
    alumni: alumniRequests.length,
    byDept
  };

  const maxDept = Math.max(...Object.values(stats.byDept), 1);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem', marginBottom: '1rem' }}>
        {[
          { label: lang === 'ar' ? 'إجمالي الحسابات' : 'Total Accounts', value: stats.totalUsers, color: 'var(--primary-color)', icon: <Users size={28} />, detail: lang === 'ar' ? 'جميع الرتب' : 'All roles' },
          { label: lang === 'ar' ? 'طلبات معلقة' : 'Pending Approvals', value: stats.pending, color: '#f1c40f', icon: <Clock size={28} />, detail: lang === 'ar' ? 'بانتظار المراجعة' : 'Awaiting review' },
          { label: lang === 'ar' ? 'طلبات الخريجين' : 'Alumni Requests', value: stats.alumni, color: 'var(--accent-color)', icon: <GraduationCap size={28} />, detail: lang === 'ar' ? 'بوابة الخريجين' : 'Alumni portal' }
        ].map((item, idx) => (
          <motion.div 
            key={idx} 
            whileHover={{ y: -5 }}
            className="glass-panel" 
            style={{ 
              padding: '2rem', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1.5rem',
              borderBottom: `5px solid ${item.color}`,
              background: 'var(--bg-color-secondary)',
              borderRadius: '25px'
            }}
          >
            <div style={{ background: `${item.color}15`, color: item.color, padding: '1rem', borderRadius: '18px' }}>
              {item.icon}
            </div>
            <div>
              <div style={{ fontSize: '2.2rem', fontWeight: '900', color: 'var(--text-primary)', lineHeight: '1' }}>{item.value}</div>
              <div style={{ color: 'var(--text-primary)', fontWeight: '700', fontSize: '1rem', marginTop: '0.3rem' }}>{item.label}</div>
              <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{item.detail}</div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '2.5rem', borderRadius: '30px', background: 'var(--bg-color-secondary)', border: '1px solid var(--surface-border)', boxShadow: 'var(--shadow-lg)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h3 style={{ color: 'var(--primary-color)', fontSize: '1.8rem', fontWeight: '900', marginBottom: '0.5rem' }}>
              {lang === 'ar' ? 'توزيع القوة الطلابية' : 'Student Force Distribution'}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              {lang === 'ar' ? 'إحصائيات دقيقة لانتشار الطلاب عبر التخصصات الأكاديمية' : 'Live analytics of student distribution across majors'}
            </p>
          </div>
          <div style={{ textAlign: 'center', background: 'var(--surface-color)', padding: '1rem 2rem', borderRadius: '20px', border: '1px solid var(--surface-border)' }}>
             <div style={{ fontSize: '0.8rem', color: 'var(--accent-color)', fontWeight: 'bold', textTransform: 'uppercase' }}>{lang === 'ar' ? 'إجمالي الطلاب' : 'Total Students'}</div>
             <div style={{ fontSize: '2rem', fontWeight: '900', color: 'var(--text-primary)' }}>{stats.totalStudents}</div>
          </div>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
          {Object.entries(stats.byDept)
            .filter(([_, count]) => count > 0) // Only show departments with students
            .sort((a, b) => b[1] - a[1]) // Sort by most students
            .map(([deptId, count], index) => {
              const percentage = stats.totalStudents > 0 ? (count / stats.totalStudents) * 100 : 0;
              const dept = departments.find(d => d.id === deptId);
              const label = deptId === 'unassigned' 
                ? (lang === 'ar' ? 'تخصص غير محدد' : 'Unassigned Specialization')
                : (dept?.name?.[lang] || dept?.name?.ar || deptId);
              
              return (
                <motion.div 
                  key={deptId}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  style={{ width: '100%' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                      <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: index === 0 ? 'var(--accent-color)' : 'var(--primary-color)' }}></div>
                      <span style={{ fontWeight: '800', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{label}</span>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontWeight: '900', color: 'var(--primary-color)', fontSize: '1.2rem' }}>{count}</span>
                      <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginInlineStart: '0.5rem' }}>({percentage.toFixed(1)}%)</span>
                    </div>
                  </div>
                  
                  <div style={{ width: '100%', height: '14px', background: 'var(--surface-color)', borderRadius: '10px', overflow: 'hidden', border: '1px solid var(--surface-border)', position: 'relative' }}>
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${percentage}%` }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      style={{ 
                        height: '100%', 
                        background: index === 0 
                          ? 'linear-gradient(90deg, var(--accent-color), var(--accent-hover))' 
                          : 'linear-gradient(90deg, var(--primary-color), var(--primary-light))',
                        borderRadius: '10px',
                        boxShadow: '0 0 15px rgba(0,0,0,0.1)'
                      }} 
                    />
                  </div>
                </motion.div>
              );
            })}
            
          {Object.values(stats.byDept).every(c => c === 0) && (
            <div style={{ textAlign: 'center', padding: '4rem', background: 'var(--surface-color)', borderRadius: '25px', border: '2px dashed var(--surface-border)' }}>
               <Users size={48} style={{ color: 'var(--text-secondary)', opacity: 0.3, marginBottom: '1rem' }} />
               <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                 {lang === 'ar' ? 'لا يوجد بيانات طلاب مسجلين حالياً للعرض' : 'No student data available to display'}
               </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const CourseManagement = ({ courses, addCourse, updateCourse, deleteCourse, departments = [], lang }) => {
  const [isEditing, setIsEditing] = useState(null);
  const [formData, setFormData] = useState({
    course_id: '', name_ar: '', description_ar: '', hours: 3, 
    difficulty: 3, skills: '', department: 'se', year: 1, semester: 1
  });

  const handleSave = async (e) => {
    e.preventDefault();
    const data = { ...formData, skills: formData.skills.split(',').map(s => s.trim()) };
    if (isEditing) {
      await updateCourse(isEditing, data);
    } else {
      await addCourse(data);
    }
    setIsEditing(null);
    setFormData({ course_id: '', name_ar: '', description_ar: '', hours: 3, difficulty: 3, skills: '', department: 'se', year: 1, semester: 1 });
  };

  const startEdit = (course) => {
    setIsEditing(course.course_id);
    setFormData({ ...course, skills: course.skills?.join(', ') || '' });
  };

  return (
    <div>
      <h3 style={{ marginBottom: '2rem', color: 'var(--primary-light)', fontSize: '1.8rem' }}>
        {lang === 'ar' ? 'إدارة مواد الخطة الدراسية' : 'Manage Curriculum Courses'}
      </h3>

      <form onSubmit={handleSave} className="glass-panel" style={{ padding: '2rem', marginBottom: '3rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.2rem', border: '1px solid var(--border-color)' }}>
        <input required placeholder="رقم المادة (مثلاً IT-101)" value={formData.course_id} onChange={e => setFormData({...formData, course_id: e.target.value})} disabled={isEditing} style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
        <input required placeholder="اسم المادة بالعربي" value={formData.name_ar} onChange={e => setFormData({...formData, name_ar: e.target.value})} style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
        <input required type="number" placeholder="الساعات" value={formData.hours} onChange={e => setFormData({...formData, hours: parseInt(e.target.value)})} style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
        
        <select value={formData.department} onChange={e => setFormData({...formData, department: e.target.value})} style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
          <option value="common">{lang === 'ar' ? 'مواد مشتركة' : 'Common Courses'}</option>
          {departments.map(dept => (
            <option key={dept.id} value={dept.id}>{dept.name?.[lang] || dept.name?.ar}</option>
          ))}
        </select>

        <select value={formData.year} onChange={e => setFormData({...formData, year: parseInt(e.target.value)})} style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
          {[1,2,3,4].map(y => <option key={y} value={y}>السنة {y}</option>)}
        </select>

        <select value={formData.semester} onChange={e => setFormData({...formData, semester: parseInt(e.target.value)})} style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
          <option value={1}>الفصل الأول</option>
          <option value={2}>الفصل الثاني</option>
        </select>

        <select value={formData.difficulty} onChange={e => setFormData({...formData, difficulty: parseInt(e.target.value)})} style={{ padding: '1rem', borderRadius: '10px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}>
          {[1,2,3,4,5].map(d => <option key={d} value={d}>الصعوبة: {d}/5</option>)}
        </select>

        <textarea required placeholder="وصف المادة..." value={formData.description_ar} onChange={e => setFormData({...formData, description_ar: e.target.value})} style={{ gridColumn: '1 / -1', padding: '1rem', borderRadius: '10px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)', minHeight: '100px' }} />
        <input placeholder="المهارات (افصل بينها بفاصلة ,)" value={formData.skills} onChange={e => setFormData({...formData, skills: e.target.value})} style={{ gridColumn: '1 / -1', padding: '1rem', borderRadius: '10px', background: 'var(--bg-color)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }} />
        
        <button type="submit" className="btn-primary" style={{ gridColumn: '1 / -1', padding: '1.2rem' }}>
          {isEditing ? 'تحديث المادة' : 'إضافة المادة للقاعدة'}
        </button>
      </form>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {courses.map(course => (
          <div key={course.course_id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
              <span style={{ color: 'var(--accent-color)', fontWeight: 'bold' }}>{course.course_id}</span>
              <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{course.department}</span>
            </div>
            <h4 style={{ marginBottom: '1rem' }}>{course.name_ar}</h4>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => startEdit(course)} style={{ flex: 1, padding: '0.5rem', background: '#f1c40f22', color: '#f1c40f', border: '1px solid #f1c40f', borderRadius: '8px' }}>تعديل</button>
              <button onClick={() => deleteCourse(course.course_id)} style={{ flex: 1, padding: '0.5rem', background: '#e74c3c22', color: '#e74c3c', border: '1px solid #e74c3c', borderRadius: '8px' }}>حذف</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;

