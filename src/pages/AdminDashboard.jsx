import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { useData } from '../contexts/DataContext';
import { useLocale } from '../contexts/LocalizationContext';
import { Users, UserPlus, CheckSquare, LogOut, GraduationCap, Shield, Send, RefreshCw } from 'lucide-react';

// Sub-components
import AlumniRequests from '../components/admin/AlumniRequests';
import PendingApprovals from '../components/admin/PendingApprovals';
import SocialManagement from '../components/admin/SocialManagement';
import FacultyManagement from '../components/admin/FacultyManagement';
import UserManagement from '../components/admin/UserManagement';
import RegisterUser from '../components/admin/RegisterUser';

const AdminDashboard = () => {
  const { 
    user, logout, 
    users,
    pendingUsers, approveUser, rejectUser,
    alumniRequests, approveAlumniRequest, rejectAlumniRequest,
    deleteUser, updateUserRole, updateUser,
    refreshData 
  } = useAuth();
  
  const { 
    facultyMembers, addFaculty, editFaculty, deleteFaculty,
    departments, addDepartment, deleteDepartment, updateDepartment,
    posts, pendingPosts, approvePost, rejectPost, deletePost,
    announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement,
    events, addEvent, deleteEvent, updateEvent
  } = useAdmin();

  const { lang } = useLocale();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('approvals');

  useEffect(() => {
    if (activeTab === 'alumni' || activeTab === 'approvals') {
      refreshData();
    }
  }, [activeTab]);

  useEffect(() => {
    if (!user || (user.role !== 'SUPER_ADMIN' && user.role !== 'DEAN')) {
      navigate('/');
    }
  }, [user, navigate]);

  const tabs = [
    { id: 'approvals', label: lang === 'ar' ? 'طلبات التسجيل' : 'Registrations', icon: <UserPlus size={20} /> },
    { id: 'alumni', label: lang === 'ar' ? 'طلبات الخريجين' : 'Alumni Requests', icon: <GraduationCap size={20} /> },
    { id: 'social', label: lang === 'ar' ? 'التواصل والإعلانات' : 'Social & News', icon: <Send size={20} /> },
    { id: 'faculty', label: lang === 'ar' ? 'الهيئة والأقسام' : 'Faculty & Depts', icon: <Shield size={20} /> },
    { id: 'users', label: lang === 'ar' ? 'إدارة المستخدمين' : 'Users', icon: <Users size={20} /> },
    { id: 'register', label: lang === 'ar' ? 'تسجيل مباشر' : 'Direct Reg', icon: <UserPlus size={20} /> },
  ];

  if (!user) return null;

  return (
    <div className="admin-dashboard animate-fade-in" style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '2rem' }}>
        <h1 className="title" style={{ margin: 0 }}>
          {lang === 'ar' ? 'لوحة التحكم والإدارة' : 'Admin Control Panel'}
        </h1>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            className="btn-outline" 
            onClick={() => refreshData()}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', borderColor: 'var(--primary-light)', color: 'var(--primary-light)' }}
          >
            <RefreshCw size={18} />
            {lang === 'ar' ? 'تحديث البيانات' : 'Refresh'}
          </button>
          <button 
            className="btn-outline" 
            onClick={() => { logout(); navigate('/'); }}
            style={{ borderColor: '#e74c3c', color: '#e74c3c', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
          >
            <LogOut size={18} />
            {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2.5rem', overflowX: 'auto', paddingBottom: '1rem', borderBottom: '1px solid var(--border-color)' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.5rem', borderRadius: '12px', border: 'none', cursor: 'pointer', transition: 'all 0.3s', whiteSpace: 'nowrap', fontSize: '1rem',
              background: activeTab === tab.id ? 'var(--primary-color)' : 'rgba(255,255,255,0.05)',
              color: activeTab === tab.id ? 'white' : 'var(--text-secondary)',
              boxShadow: activeTab === tab.id ? 'var(--shadow-md)' : 'none'
            }}
          >
            {tab.icon}
            {tab.label}
            {tab.id === 'approvals' && pendingUsers?.length > 0 && (
              <span style={{ background: '#e74c3c', color: 'white', borderRadius: '50%', padding: '2px 8px', fontSize: '0.8rem', marginLeft: '5px' }}>
                {pendingUsers.length}
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

      {/* Content Area */}
      <div className="glass-panel" style={{ padding: '2.5rem', minHeight: '600px', border: '1px solid var(--glass-border)' }}>
        {activeTab === 'approvals' && (
          <PendingApprovals 
            pendingUsers={pendingUsers || []} 
            approveUser={approveUser} 
            rejectUser={rejectUser} 
            lang={lang}
          />
        )}
        {activeTab === 'social' && (
          <SocialManagement 
            posts={posts || []}
            pendingPosts={pendingPosts || []}
            approvePost={approvePost}
            rejectPost={rejectPost}
            deletePost={deletePost}
            announcements={announcements || []}
            addAnnouncement={addAnnouncement}
            deleteAnnouncement={deleteAnnouncement}
            updateAnnouncement={updateAnnouncement}
            events={events || []}
            addEvent={addEvent}
            deleteEvent={deleteEvent}
            updateEvent={updateEvent}
            lang={lang}
          />
        )}
        {activeTab === 'alumni' && (
          <AlumniRequests 
            alumniRequests={alumniRequests || []} 
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
        {activeTab === 'users' && (
          <UserManagement 
            users={users || []} 
            lang={lang}
            deleteUser={deleteUser}
            updateUserRole={updateUserRole}
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

export default AdminDashboard;
