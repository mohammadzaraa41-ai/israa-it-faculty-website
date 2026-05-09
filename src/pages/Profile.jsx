import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocalizationContext';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Camera, Save, LogOut, Shield, BookOpen, Calendar, Phone, CheckCircle, Edit3 } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, logout, loading: authLoading, updateUserProfile, changePassword } = useAuth();
  const { lang, t } = useLocale();
  const { addToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [showPassModal, setShowPassModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [passData, setPassData] = useState({ old: '', new: '', confirm: '' });

  const [formData, setFormData] = useState({
    name_ar: user?.name?.ar || user?.name_ar || '',
    name_en: user?.name?.en || user?.name_en || '',
    phone: user?.phone || '',
    avatar_url: user?.avatar_url || ''
  });

  const fileInputRef = useRef(null);

  const [showError, setShowError] = useState(false);
  const { lastError } = useAuth(); // We'll add this to AuthContext

  React.useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) setShowError(true);
    }, 5000);
    return () => clearTimeout(timer);
  }, [user]);

  if (authLoading || !user) {
    return (
      <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', background: 'var(--bg-color)', color: 'var(--text-primary)', padding: '2rem', textAlign: 'center' }}>
        {authLoading || !showError ? (
          <div className="loading-spinner">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              style={{ width: '50px', height: '50px', border: '3px solid var(--primary-color)', borderTopColor: 'transparent', borderRadius: '50%', margin: '0 auto' }}
            />
            <p style={{ marginTop: '1rem', opacity: 0.7 }}>{lang === 'ar' ? 'جاري تحميل الملف الشخصي...' : 'Loading profile...'}</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ maxWidth: '600px' }}>
            <Shield size={64} color="#e74c3c" style={{ marginBottom: '1rem' }} />
            <h2 style={{ marginBottom: '1rem' }}>{lang === 'ar' ? 'عذراً، لم نتمكن من العثور على ملفك الشخصي' : 'Sorry, we couldn\'t find your profile'}</h2>
            
            {lastError && (
              <div style={{ background: 'rgba(231, 76, 60, 0.1)', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', border: '1px solid rgba(231, 76, 60, 0.2)' }}>
                <p style={{ color: '#e74c3c', fontSize: '0.9rem', fontFamily: 'monospace', margin: 0 }}>
                  <strong>Error Details:</strong> {lastError}
                </p>
              </div>
            )}

            <p style={{ marginBottom: '2rem', opacity: 0.8 }}>{lang === 'ar' ? 'قد يكون هناك تأخير في مزامنة البيانات أو أن حسابك غير مكتمل.' : 'There might be a sync delay or your account is incomplete.'}</p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
              <button className="btn-primary" onClick={() => window.location.reload()}>{lang === 'ar' ? 'إعادة المحاولة' : 'Retry'}</button>
              <button className="btn-outline" onClick={() => { logout(); window.location.href = '/'; }}>{lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}</button>
            </div>
          </motion.div>
        )}
      </div>
    );
  }

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, avatar_url: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setLoading(true);
    const result = await updateUserProfile(formData);
    if (result.success) {
      addToast(
        lang === 'ar' ? 'تم التحديث' : 'Updated',
        lang === 'ar' ? 'تم تحديث معلومات حسابك بنجاح' : 'Account information updated successfully',
        'success'
      );
      setIsEditing(false);
    } else {
      addToast(
        lang === 'ar' ? 'خطأ' : 'Error',
        result.message,
        'error'
      );
    }
    setLoading(false);
  };

  const handlePassChange = async (e) => {
    e.preventDefault();
    if (passData.new !== passData.confirm) {
      addToast(lang === 'ar' ? 'خطأ' : 'Error', lang === 'ar' ? 'كلمات المرور الجديدة غير متطابقة' : 'New passwords do not match', 'error');
      return;
    }
    setLoading(true);
    const res = await changePassword(passData.old, passData.new);
    if (res.success) {
      addToast(lang === 'ar' ? 'تم بنجاح' : 'Success', lang === 'ar' ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully', 'success');
      setShowPassModal(false);
      setPassData({ old: '', new: '', confirm: '' });
    } else {
      addToast(lang === 'ar' ? 'فشل' : 'Failed', res.message, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="profile-container">
      <div className="profile-header-bg" />
      
      <div className="profile-content">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel profile-card"
        >
          <div className="profile-avatar-section">
            <div className="avatar-wrapper">
              {formData.avatar_url ? (
                <img src={formData.avatar_url} alt="Profile" className="avatar-img" />
              ) : (
                <div className="avatar-placeholder">
                  <User size={60} />
                </div>
              )}
              <button className="change-avatar-btn" onClick={() => fileInputRef.current.click()}>
                <Camera size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                hidden 
                accept="image/*" 
                onChange={handleImageUpload} 
              />
            </div>
            
            <div className="profile-main-info">
              <h1>{lang === 'ar' ? formData.name_ar : formData.name_en}</h1>
              <div className="role-badge">
                <Shield size={14} />
                <span>{user?.role}</span>
              </div>
            </div>
          </div>

          <div className="profile-tabs-nav">
            <button className="tab-btn active">{lang === 'ar' ? 'معلومات الحساب' : 'Account Info'}</button>
          </div>

          <div className="profile-details-grid">
            <div className="detail-item">
              <label><Edit3 size={16} /> {lang === 'ar' ? 'الاسم (بالعربي)' : 'Name (Arabic)'}</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.name_ar} 
                  onChange={e => setFormData({...formData, name_ar: e.target.value})} 
                />
              ) : (
                <p>{formData.name_ar || '---'}</p>
              )}
            </div>

            <div className="detail-item">
              <label><Edit3 size={16} /> {lang === 'ar' ? 'الاسم (بالإنجليزي)' : 'Name (English)'}</label>
              {isEditing ? (
                <input 
                  type="text" 
                  value={formData.name_en} 
                  onChange={e => setFormData({...formData, name_en: e.target.value})} 
                />
              ) : (
                <p>{formData.name_en || '---'}</p>
              )}
            </div>

            <div className="detail-item">
              <label><Mail size={16} /> {lang === 'ar' ? 'اسم المستخدم / الرقم' : 'Username / ID'}</label>
              <p className="immutable">{user.username}</p>
            </div>

            <div className="detail-item">
              <label><BookOpen size={16} /> {lang === 'ar' ? 'القسم' : 'Department'}</label>
              <p className="immutable">{user.department_id?.toUpperCase() || 'N/A'}</p>
            </div>

            <div className="detail-item">
              <label><Phone size={16} /> {lang === 'ar' ? 'رقم الهاتف' : 'Phone'}</label>
              {isEditing ? (
                <input 
                  type="tel" 
                  value={formData.phone} 
                  onChange={e => setFormData({...formData, phone: e.target.value})} 
                />
              ) : (
                <p>{formData.phone || '---'}</p>
              )}
            </div>

            <div className="detail-item">
              <label><CheckCircle size={16} /> {lang === 'ar' ? 'حالة الحساب' : 'Account Status'}</label>
              <p className="status-active">{lang === 'ar' ? 'نشط' : 'Active'}</p>
            </div>
          </div>

          <div className="profile-actions">
            {isEditing ? (
              <>
                <button className="btn-primary" onClick={handleSave} disabled={loading}>
                  <Save size={18} />
                  {lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
                <button className="btn-outline" onClick={() => setIsEditing(false)}>
                  {lang === 'ar' ? 'إلغاء' : 'Cancel'}
                </button>
              </>
            ) : (
              <>
                <button className="btn-primary" onClick={() => setIsEditing(true)}>
                  <Edit3 size={18} />
                  {lang === 'ar' ? 'تعديل المعلومات' : 'Edit Info'}
                </button>
                <button className="btn-outline" onClick={() => setShowPassModal(true)}>
                  <Shield size={18} />
                  {lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}
                </button>
              </>
            )}
            
            <button className="btn-danger" onClick={() => { logout(); window.location.href = '/'; }}>
              <LogOut size={18} />
              {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showPassModal && (
          <div className="login-modal-overlay" style={{ zIndex: 1000 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel pass-modal"
              style={{ width: '90%', maxWidth: '450px', padding: '2rem' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                <h2 style={{ color: 'var(--primary-color)', margin: 0 }}>{lang === 'ar' ? 'تغيير كلمة المرور' : 'Change Password'}</h2>
                <button onClick={() => setShowPassModal(false)} className="close-modal-btn">&times;</button>
              </div>
              
              <form onSubmit={handlePassChange} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="input-group">
                  <label>{lang === 'ar' ? 'كلمة المرور القديمة' : 'Current Password'}</label>
                  <input 
                    required type="password" 
                    value={passData.old} 
                    onChange={e => setPassData({...passData, old: e.target.value})} 
                  />
                </div>
                <div className="input-group">
                  <label>{lang === 'ar' ? 'كلمة المرور الجديدة' : 'New Password'}</label>
                  <input 
                    required type="password" 
                    value={passData.new} 
                    onChange={e => setPassData({...passData, new: e.target.value})} 
                  />
                </div>
                <div className="input-group">
                  <label>{lang === 'ar' ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password'}</label>
                  <input 
                    required type="password" 
                    value={passData.confirm} 
                    onChange={e => setPassData({...passData, confirm: e.target.value})} 
                  />
                </div>
                
                <button type="submit" className="btn-primary" disabled={loading} style={{ padding: '1rem', marginTop: '1rem' }}>
                  {loading ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'تحديث كلمة المرور' : 'Update Password')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Profile;
