import React, { useState, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLocale } from '../contexts/LocalizationContext';
import { useToast } from '../contexts/ToastContext';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Mail, Camera, Save, LogOut, Shield, BookOpen, Calendar, Phone, CheckCircle, Edit3 } from 'lucide-react';
import './Profile.css';

const Profile = () => {
  const { user, logout, updateUserProfile } = useAuth();
  const { lang, t } = useLocale();
  const { addToast } = useToast();
  
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name_ar: user?.name?.ar || user?.name_ar || '',
    name_en: user?.name?.en || user?.name_en || '',
    phone: user?.phone || '',
    avatar_url: user?.avatar_url || ''
  });

  const fileInputRef = useRef(null);

  if (!user) return null;

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
                <span>{user.role}</span>
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
              <button className="btn-primary" onClick={() => setIsEditing(true)}>
                <Edit3 size={18} />
                {lang === 'ar' ? 'تعديل المعلومات' : 'Edit Info'}
              </button>
            )}
            
            <button className="btn-danger" onClick={() => { logout(); window.location.href = '/'; }}>
              <LogOut size={18} />
              {lang === 'ar' ? 'تسجيل الخروج' : 'Logout'}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
