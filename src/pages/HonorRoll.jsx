import React, { useState } from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Plus, Trash2, Edit2, X, Check, User, Calendar } from 'lucide-react';

/**
 * HonorRoll Component: لوحة الشرف للطلاب المتميزين
 * تقوم هذه الصفحة بعرض الطلاب الأوائل حسب التخصص، مع إمكانية الإدارة للمشرفين
 */
const HonorRoll = () => {
  const { lang, t } = useLocale();
  const { user } = useAuth();
  const { honorRoll, addHonorStudent, deleteHonorStudent, editHonorStudent, departments } = useAdmin();
  
  // التحقق مما إذا كان المستخدم يملك صلاحيات تعديل
  const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);

  // حالات التحكم في النوافذ المنبثقة (Modals)
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    studentName: { ar: '', en: '' },
    major: 'cs',
    year: '',
    gpa: ''
  });

  // --- دوال التحكم في الواجهة ---
  
  const openAddModal = () => {
    setFormData({ studentName: { ar: '', en: '' }, major: 'cs', year: '', gpa: '' });
    setEditingId(null);
    setShowModal(true);
  };

  const openEditModal = (student) => {
    setFormData({ ...student });
    setEditingId(student.id);
    setShowModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingId) {
      editHonorStudent({ ...formData, id: editingId });
    } else {
      addHonorStudent(formData);
    }
    setShowModal(false);
  };

  const getNameByLang = (obj) => obj[lang] || obj;

  // تنظيم الطلاب حسب التخصص وترتيبهم زمنياً (الأحدث أولاً)
  const categorizedStudents = honorRoll.reduce((acc, student) => {
    const major = student.major || 'other';
    if (!acc[major]) acc[major] = [];
    acc[major].push(student);
    return acc;
  }, {});

  // فرز السنوات تنازلياً لكل تخصص
  Object.keys(categorizedStudents).forEach(m => {
    categorizedStudents[m].sort((a, b) => b.year.localeCompare(a.year));
  });

  return (
    <div className="page-container" style={{ padding: '3rem 1rem', maxWidth: '1300px', margin: '0 auto' }}>
      {/* رأس الصفحة */}
      <section style={{ textAlign: 'center', marginBottom: '5rem' }}>
        <motion.div 
          initial={{ y: -20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6 }}
        >
          <Trophy size={80} color="#f1c40f" style={{ marginBottom: '1.5rem', filter: 'drop-shadow(0 0 10px rgba(241,196,15,0.3))' }} />
          <h1 className="title" style={{ fontSize: '3.5rem', fontWeight: '900', marginBottom: '1rem' }}>
            {lang === 'ar' ? 'لوحة الشرف الأكاديمية' : 'Academic Honor Roll'}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', maxWidth: '700px', margin: '0 auto', lineHeight: '1.8' }}>
            {lang === 'ar' 
              ? 'فخورون بطلابنا المتميزين الذين أثبتوا جدارتهم وتفوقهم الأكاديمي خلال مسيرتهم في الكلية.' 
              : 'We take pride in our outstanding students who demonstrated academic excellence during their journey.'}
          </p>
        </motion.div>

        {isAdmin && (
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={openAddModal} 
            className="btn-primary" 
            style={{ marginTop: '2.5rem', padding: '0.8rem 2rem', fontSize: '1.1rem', borderRadius: '50px' }}
          >
            <Plus size={22} style={{ marginInlineEnd: '8px' }} />
            {lang === 'ar' ? 'إضافة متفوق جديد' : 'Add New Achiever'}
          </motion.button>
        )}
      </section>

      {/* عرض القوائم حسب التخصص */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
        {Object.entries(categorizedStudents).map(([majorKey, list]) => {
          const deptInfo = departments.find(d => d.id === majorKey);
          return (
            <motion.div 
              key={majorKey}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem' }}>
                <div style={{ background: 'var(--primary-color)', padding: '1rem', borderRadius: '15px', color: '#f1c40f' }}>
                  <Star size={28} fill="#f1c40f" />
                </div>
                <h2 style={{ fontSize: '2.2rem', fontWeight: 'bold', borderBottom: '3px solid #f1c40f', paddingBottom: '5px' }}>
                  {deptInfo ? getNameByLang(deptInfo.name) : majorKey}
                </h2>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2.5rem' }}>
                {list.map((student) => (
                  <motion.div 
                    key={student.id} 
                    whileHover={{ y: -10 }}
                    className="glass-panel"
                    style={{ 
                      padding: '2.5rem', 
                      textAlign: 'center', 
                      position: 'relative', 
                      border: '1px solid rgba(241,196,15,0.3)',
                      background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)'
                    }}
                  >
                    {isAdmin && (
                      <div style={{ position: 'absolute', top: '1.2rem', right: '1.2rem', display: 'flex', gap: '0.8rem' }}>
                        <button onClick={() => openEditModal(student)} style={{ color: '#f1c40f', background: 'none', border: 'none', cursor: 'pointer' }}><Edit2 size={20} /></button>
                        <button onClick={() => deleteHonorStudent(student.id)} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={20} /></button>
                      </div>
                    )}

                    <div style={{ 
                      width: '110px', height: '110px', 
                      background: 'var(--primary-color)', 
                      borderRadius: '50%', 
                      display: 'flex', justifyContent: 'center', alignItems: 'center', 
                      margin: '0 auto 2rem', 
                      border: '4px solid #f1c40f',
                      boxShadow: '0 0 20px rgba(241,196,15,0.2)'
                    }}>
                      <User size={55} color="#f1c40f" />
                    </div>

                    <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.8rem', color: 'white' }}>
                      {getNameByLang(student.studentName)}
                    </h3>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-secondary)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.6rem', fontSize: '1.1rem' }}>
                        <Calendar size={18} /> {student.year}
                      </div>
                      <div style={{ 
                        fontSize: '1.3rem', fontWeight: 'bold', color: '#f1c40f', 
                        background: 'rgba(241,196,15,0.1)', padding: '0.4rem 1rem', borderRadius: '10px',
                        width: 'fit-content', margin: '0.5rem auto 0'
                      }}>
                        GPA: {student.gpa}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* نافذة الإضافة والتعديل */}
      <AnimatePresence>
        {showModal && (
          <div className="login-modal-overlay" style={{ zIndex: 9000, backdropFilter: 'blur(8px)' }}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }} 
              animate={{ opacity: 1, scale: 1, y: 0 }} 
              exit={{ opacity: 0, scale: 0.9, y: 20 }} 
              className="glass-panel" 
              style={{ width: '90%', maxWidth: '550px', padding: '3rem', position: 'relative', border: '1px solid var(--primary-color)' }}
            >
              <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={28} /></button>
              
              <h2 style={{ marginBottom: '2.5rem', color: '#f1c40f', fontSize: '2rem' }}>
                {editingId ? (lang === 'ar' ? 'تحديث بيانات الطالب' : 'Update Record') : (lang === 'ar' ? 'إضافة متفوق جديد' : 'New Achiever')}
              </h2>

              <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                  <div className="input-group">
                    <label>{lang === 'ar' ? 'الاسم (عربي)' : 'Name (AR)'}</label>
                    <input required type="text" value={formData.studentName.ar} onChange={e => setFormData({ ...formData, studentName: { ...formData.studentName, ar: e.target.value } })} />
                  </div>
                  <div className="input-group">
                    <label>{lang === 'ar' ? 'الاسم (EN)' : 'Name (EN)'}</label>
                    <input required type="text" value={formData.studentName.en} onChange={e => setFormData({ ...formData, studentName: { ...formData.studentName, en: e.target.value } })} />
                  </div>
                </div>

                <div className="input-group">
                  <label>{lang === 'ar' ? 'التخصص الدراسي' : 'Academic Major'}</label>
                  <select className="custom-select" value={formData.major} onChange={e => setFormData({ ...formData, major: e.target.value })}>
                    {departments.map(d => <option key={d.id} value={d.id}>{getNameByLang(d.name)}</option>)}
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.2rem' }}>
                  <div className="input-group">
                    <label>{lang === 'ar' ? 'العام الدراسي' : 'Academic Year'}</label>
                    <input required type="text" placeholder="2023/2024" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>{lang === 'ar' ? 'المعدل التراكمي' : 'Cumulative GPA'}</label>
                    <input required type="text" placeholder="3.98" value={formData.gpa} onChange={e => setFormData({ ...formData, gpa: e.target.value })} />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1.1rem', fontSize: '1.1rem', fontWeight: 'bold' }}>
                  <Check size={22} style={{ marginInlineEnd: '8px' }} />
                  {lang === 'ar' ? 'حفظ البيانات' : 'Save Achievement'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HonorRoll;
