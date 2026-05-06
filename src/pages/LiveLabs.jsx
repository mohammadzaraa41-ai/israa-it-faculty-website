import React, { useState } from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Check, Clock, Info, Monitor } from 'lucide-react';

const LiveLabs = () => {
  const { lang, t } = useLocale();
  const { user } = useAuth();
  const { liveLabs, addLab, editLab, deleteLab } = useAdmin();
  const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLab, setEditingLab] = useState(null);
  const [formData, setFormData] = useState({ 
    name_ar: '', 
    name_en: '', 
    status: 'متاح', 
    capacity: 30, 
    current_class: '', 
    next_class: '' 
  });

  const handleOpenAdd = () => {
    setFormData({ name_ar: '', name_en: '', status: 'متاح', capacity: 30, current_class: '', next_class: '' });
    setEditingLab(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (lab) => {
    setFormData({ 
      ...lab, 
      name_ar: lab.name_ar || lab.name?.ar || '',
      name_en: lab.name_en || lab.name?.en || ''
    });
    setEditingLab(lab);
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingLab) {
      editLab({ ...formData, id: editingLab.id });
    } else {
      addLab(formData);
    }
    setShowAddModal(false);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available': return '#2ecc71';
      case 'busy': return '#e74c3c';
      case 'maintenance': return '#f1c40f';
      default: return 'var(--text-secondary)';
    }
  };

  const getStatusLabel = (status) => {
    if (lang === 'ar') {
      switch (status) {
        case 'available': return 'متاح';
        case 'busy': return 'مشغول';
        case 'maintenance': return 'صيانة';
        default: return status;
      }
    }
    return typeof status === 'string' ? status.toUpperCase() : 'UNKNOWN';
  };

  const getLocalizedText = (obj, fallback = '') => {
    if (!obj) return fallback;
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'object') {
      const val = obj[lang] || obj.ar || obj.en;
      if (typeof val === 'string') return val;
      if (typeof val === 'object') return fallback; // Prevent React Error 31
    }
    return fallback;
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="title" style={{ marginBottom: '0.5rem' }}>{t('nav.live_labs')}</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            {lang === 'ar' ? 'متابعة حالة المختبرات وتوفرها بشكل فوري.' : 'Real-time monitoring of lab availability and status.'}
          </p>
        </div>
        {isAdmin && (
          <button onClick={handleOpenAdd} className="btn-primary" style={{ gap: '0.5rem' }}>
            <Plus size={20} /> {lang === 'ar' ? 'إضافة مختبر' : 'Add Lab'}
          </button>
        )}
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
        {liveLabs.map((lab) => (
          <motion.div 
            key={lab.id} 
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel" 
            style={{ padding: '2rem', position: 'relative', overflow: 'hidden', borderTop: `4px solid ${getStatusColor(lab.status)}` }}
          >
            {isAdmin && (
              <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => handleOpenEdit(lab)} style={{ color: '#f1c40f' }}><Edit2 size={18} /></button>
                <button onClick={() => deleteLab(lab.id)} style={{ color: '#e74c3c' }}><Trash2 size={18} /></button>
              </div>
            )}

            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ background: 'var(--primary-color)', padding: '0.75rem', borderRadius: '12px', color: 'var(--accent-color)' }}>
                <Monitor size={24} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: 0 }}>
                {lang === 'ar' ? (lab.name_ar || lab.name?.ar || 'مختبر') : (lab.name_en || lab.name?.en || 'Lab')}
              </h2>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '0.3rem 1rem',
                  borderRadius: '50px',
                  backgroundColor: `${getStatusColor(lab.status)}22`,
                  color: getStatusColor(lab.status),
                  border: `1px solid ${getStatusColor(lab.status)}44`,
                  fontSize: '0.85rem',
                  fontWeight: 'bold'
                }}>
                  {lab.status || (lang === 'ar' ? 'متاح' : 'Available')}
                </span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                  <Info size={16} />
                  <span>{lang === 'ar' ? 'السعة:' : 'Capacity:'} {lab.capacity || 0}</span>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1rem', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-light)', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      <Clock size={14} /> {lang === 'ar' ? 'وقت الانشغال الحالي' : 'Current Busy Time'}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-primary)' }}>
                      {lab.current_class || (lang === 'ar' ? 'لا يوجد' : 'None')}
                    </p>
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-light)', marginBottom: '0.5rem', fontSize: '0.85rem', fontWeight: 'bold' }}>
                      <Clock size={14} /> {lang === 'ar' ? 'وقت الانشغال القادم' : 'Next Busy Time'}
                    </div>
                    <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                      {lab.next_class || (lang === 'ar' ? 'لا يوجد' : 'None')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="login-modal-overlay" style={{ zIndex: 6000 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel" 
              style={{ width: '95%', maxWidth: '600px', padding: '2.5rem', position: 'relative' }}
            >
              <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-secondary)' }}>
                <X size={24} />
              </button>

              <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>
                {editingLab ? (lang === 'ar' ? 'تعديل بيانات المختبر' : 'Edit Lab Details') : (lang === 'ar' ? 'إضافة مختبر جديد' : 'Add New Lab')}
              </h2>

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label>{lang === 'ar' ? 'اسم المختبر (عربي)' : 'Lab Name (AR)'}</label>
                    <input 
                      required type="text" value={formData.name_ar || formData.name?.ar || ''} 
                      onChange={e => setFormData({ ...formData, name_ar: e.target.value })} 
                    />
                  </div>
                  <div className="input-group">
                    <label>{lang === 'ar' ? 'اسم المختبر (EN)' : 'Lab Name (EN)'}</label>
                    <input 
                      required type="text" value={formData.name_en || formData.name?.en || ''} 
                      onChange={e => setFormData({ ...formData, name_en: e.target.value })} 
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label>{lang === 'ar' ? 'الحالة' : 'Status'}</label>
                    <select 
                      className="custom-select" value={formData.status || 'متاح'} 
                      onChange={e => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="متاح">{lang === 'ar' ? 'متاح' : 'Available'}</option>
                      <option value="مشغول">{lang === 'ar' ? 'مشغول' : 'Busy'}</option>
                      <option value="صيانة">{lang === 'ar' ? 'صيانة' : 'Maintenance'}</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>{lang === 'ar' ? 'السعة (عدد الطلاب)' : 'Capacity'}</label>
                    <input 
                      type="number" placeholder="30" value={formData.capacity || ''} 
                      onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) || 0 })} 
                    />
                  </div>
                </div>

                <div className="input-group">
                  <label>{lang === 'ar' ? 'وقت الانشغال الحالي' : 'Current Busy Time'}</label>
                  <input 
                    type="text" value={formData.current_class || ''} 
                    onChange={e => setFormData({ ...formData, current_class: e.target.value })}
                    placeholder={lang === 'ar' ? 'مثال: 10:00 ص - 11:30 ص' : 'e.g., 10:00 AM - 11:30 AM'}
                  />
                </div>

                <div className="input-group">
                  <label>{lang === 'ar' ? 'وقت الانشغال القادم' : 'Next Busy Time'}</label>
                  <input 
                    type="text" value={formData.next_class || ''} 
                    onChange={e => setFormData({ ...formData, next_class: e.target.value })}
                    placeholder={lang === 'ar' ? 'مثال: 12:00 م - 01:30 م' : 'e.g., 12:00 PM - 01:30 PM'}
                  />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}>
                  <Check size={20} /> {editingLab ? (lang === 'ar' ? 'حفظ التعديلات' : 'Save Changes') : (lang === 'ar' ? 'إضافة المختبر' : 'Add Lab')}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveLabs;
