import React, { useState } from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Edit2, X, Check, Clock, Info, Monitor } from 'lucide-react';

/**
 * LiveLabs Component: متابعة حالة المختبرات بشكل حي
 * تتيح هذه الصفحة للطلاب معرفة توفر المختبرات، وللمسؤولين تحديث الحالة فوراً
 */
const LiveLabs = () => {
  const { lang, t } = useLocale();
  const { user } = useAuth();
  const { liveLabs, addLab, editLab, deleteLab } = useAdmin();
  
  // صلاحيات المشرف لتعديل الحالة
  const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);
  
  const [showModal, setShowModal] = useState(false);
  const [activeLab, setActiveLab] = useState(null);
  const [formData, setFormData] = useState({ 
    name: { ar: '', en: '' }, 
    status: 'available', 
    time: '', 
    info: { ar: '', en: '' } 
  });

  // --- دوال التحكم ---

  const handleOpenCreate = () => {
    setFormData({ name: { ar: '', en: '' }, status: 'available', time: '', info: { ar: '', en: '' } });
    setActiveLab(null);
    setShowModal(true);
  };

  const handleOpenEdit = (lab) => {
    setFormData({ ...lab });
    setActiveLab(lab);
    setShowModal(true);
  };

  const onSave = (e) => {
    e.preventDefault();
    if (activeLab) editLab({ ...formData, id: activeLab.id });
    else addLab(formData);
    setShowModal(false);
  };

  // مساعدات بصرية للألوان
  const statusConfig = {
    available: { color: '#2ecc71', ar: 'متاح الآن', en: 'Available Now' },
    busy: { color: '#e74c3c', ar: 'قيد الاستخدام', en: 'In Use' },
    maintenance: { color: '#f1c40f', ar: 'تحت الصيانة', en: 'Maintenance' }
  };

  const getStatusInfo = (status) => statusConfig[status] || { color: '#95a5a6', ar: status, en: status };

  return (
    <div className="page-container" style={{ padding: '3rem 1rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      {/* رأس الصفحة */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem', flexWrap: 'wrap', gap: '2rem' }}>
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="title" style={{ marginBottom: '0.8rem', fontSize: '3rem' }}>{t('nav.live_labs')}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem' }}>
            {lang === 'ar' ? 'تتبع حالة توفر المختبرات العلمية والتقنية في الكلية بشكل فوري.' : 'Real-time status tracking for the faculty scientific and technical labs.'}
          </p>
        </motion.div>
        
        {isAdmin && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleOpenCreate} 
            className="btn-primary" 
            style={{ padding: '0.8rem 2rem', borderRadius: '12px', gap: '8px' }}
          >
            <Plus size={22} /> {lang === 'ar' ? 'إضافة مختبر جديد' : 'Register New Lab'}
          </motion.button>
        )}
      </div>
      
      {/* شبكة المختبرات */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: '2rem' }}>
        {liveLabs.map((lab) => {
          const s = getStatusInfo(lab.status);
          return (
            <motion.div 
              key={lab.id} 
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel" 
              style={{ 
                padding: '2.5rem', 
                position: 'relative', 
                borderTop: `5px solid ${s.color}`,
                boxShadow: `0 10px 30px ${s.color}11`
              }}
            >
              {isAdmin && (
                <div style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', display: 'flex', gap: '0.8rem' }}>
                  <button onClick={() => handleOpenEdit(lab)} style={{ color: '#f1c40f', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={18} /></button>
                  <button onClick={() => deleteLab(lab.id)} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </div>
              )}

              <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', marginBottom: '2rem' }}>
                <div style={{ background: 'var(--primary-color)', padding: '0.8rem', borderRadius: '12px', color: s.color }}>
                  <Monitor size={26} />
                </div>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>{lab.name[lang] || lab.name}</h2>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', fontSize: '1.1rem' }}>
                    <Clock size={18} />
                    <span>{lab.time}</span>
                  </div>
                  <span style={{
                    padding: '0.4rem 1.2rem',
                    borderRadius: '50px',
                    backgroundColor: `${s.color}15`,
                    color: s.color,
                    border: `1px solid ${s.color}33`,
                    fontSize: '0.9rem',
                    fontWeight: 'bold'
                  }}>
                    {lang === 'ar' ? s.ar : s.en}
                  </span>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '15px', border: '1px solid var(--border-color)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--primary-light)', marginBottom: '0.6rem', fontSize: '0.95rem', fontWeight: 'bold' }}>
                    <Info size={18} /> {lang === 'ar' ? 'ملاحظات وتجهيزات' : 'Specifications & Info'}
                  </div>
                  <p style={{ margin: 0, fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: '1.7' }}>
                    {lab.info?.[lang] || lab.info || (lang === 'ar' ? 'لا توجد تفاصيل إضافية حالياً.' : 'No specific details provided.')}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* نافذة الإدارة (Modal) */}
      <AnimatePresence>
        {showModal && (
          <div className="login-modal-overlay" style={{ zIndex: 9000 }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="glass-panel" 
              style={{ width: '95%', maxWidth: '650px', padding: '3.5rem', position: 'relative', border: '1px solid var(--primary-color)' }}
            >
              <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.8rem', right: '1.8rem', color: 'var(--text-secondary)', background: 'none', border: 'none', cursor: 'pointer' }}>
                <X size={30} />
              </button>

              <h2 style={{ marginBottom: '2.5rem', color: 'var(--primary-color)', fontSize: '2.2rem', fontWeight: '900' }}>
                {activeLab ? (lang === 'ar' ? 'تحديث حالة المختبر' : 'Update Lab State') : (lang === 'ar' ? 'تسجيل مختبر جديد' : 'New Lab Registration')}
              </h2>

              <form onSubmit={onSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="input-group">
                    <label>{lang === 'ar' ? 'اسم المختبر (عربي)' : 'Lab Name (AR)'}</label>
                    <input required value={formData.name.ar} onChange={e => setFormData({ ...formData, name: { ...formData.name, ar: e.target.value } })} />
                  </div>
                  <div className="input-group">
                    <label>{lang === 'ar' ? 'اسم المختبر (EN)' : 'Lab Name (EN)'}</label>
                    <input required value={formData.name.en} onChange={e => setFormData({ ...formData, name: { ...formData.name, en: e.target.value } })} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                  <div className="input-group">
                    <label>{lang === 'ar' ? 'الحالة الحالية' : 'Current Status'}</label>
                    <select className="custom-select" value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })}>
                      <option value="available">{lang === 'ar' ? 'متاح' : 'Available'}</option>
                      <option value="busy">{lang === 'ar' ? 'مشغول' : 'Busy'}</option>
                      <option value="maintenance">{lang === 'ar' ? 'تحت الصيانة' : 'Maintenance'}</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label>{lang === 'ar' ? 'أوقات التوفر' : 'Availability Hours'}</label>
                    <input required placeholder="08:00 AM - 04:00 PM" value={formData.time} onChange={e => setFormData({ ...formData, time: e.target.value })} />
                  </div>
                </div>

                <div className="input-group">
                  <label>{lang === 'ar' ? 'معلومات إضافية (عربي)' : 'Extra Information (AR)'}</label>
                  <textarea rows="3" value={formData.info.ar} onChange={e => setFormData({ ...formData, info: { ...formData.info, ar: e.target.value } })} />
                </div>

                <div className="input-group">
                  <label>{lang === 'ar' ? 'معلومات إضافية (EN)' : 'Extra Information (EN)'}</label>
                  <textarea rows="3" value={formData.info.en} onChange={e => setFormData({ ...formData, info: { ...formData.info, en: e.target.value } })} />
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1.2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
                  <Check size={24} style={{ marginInlineEnd: '10px' }} /> 
                  {activeLab ? (lang === 'ar' ? 'حفظ التغييرات' : 'Save Changes') : (lang === 'ar' ? 'تأكيد الإضافة' : 'Confirm Registration')}
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
