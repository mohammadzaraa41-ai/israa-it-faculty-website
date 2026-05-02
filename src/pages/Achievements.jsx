import React, { useState } from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Plus, Trash2, Edit2, X, Check, Calendar, Users, FileText, ChevronLeft } from 'lucide-react';

/**
 * Achievements Page: سجل إنجازات الكلية
 * تعرض هذه الصفحة النجاحات، المؤتمرات، والفعاليات التي حققتها الكلية وكوادرها
 */
const Achievements = () => {
  const { lang } = useLocale();
  const { user } = useAuth();
  const { achievements, addAchievement, deleteAchievement, editAchievement } = useAdmin();
  
  // التحقق من صلاحية الإدارة
  const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);

  // فرز الإنجازات تنازلياً حسب التاريخ
  const sortedData = [...achievements].sort((a, b) => new Date(b.date) - new Date(a.date));

  // حالات التحكم في العرض والإدارة
  const [activeAchievement, setActiveAchievement] = useState(null);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  
  const [formData, setFormData] = useState({
    title: { ar: '', en: '' },
    summary: { ar: '', en: '' },
    report: { ar: '', en: '' },
    year: '',
    participants: { ar: '', en: '' },
    images: [''],
    date: ''
  });

  // --- دوال الإدارة ---

  const openCreator = () => {
    setFormData({ title: { ar: '', en: '' }, summary: { ar: '', en: '' }, report: { ar: '', en: '' }, year: '', participants: { ar: '', en: '' }, images: [''], date: '' });
    setEditingItem(null);
    setIsEditorOpen(true);
  };

  const openEditor = (item, e) => {
    e.stopPropagation();
    setFormData({ ...item });
    setEditingItem(item);
    setIsEditorOpen(true);
  };

  const saveAchievement = (e) => {
    e.preventDefault();
    if (editingItem) editAchievement({ ...formData, id: editingItem.id });
    else addAchievement(formData);
    setIsEditorOpen(false);
  };

  const getLangText = (obj) => obj[lang] || obj;

  return (
    <div className="page-container" style={{ padding: '4rem 1rem', maxWidth: '1250px', margin: '0 auto' }}>
      {/* Header Section */}
      <header style={{ textAlign: 'center', marginBottom: '6rem' }}>
        <motion.h1 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="title" 
          style={{ fontSize: '3.8rem', fontWeight: '900', letterSpacing: '-1px' }}
        >
          {lang === 'ar' ? 'سجل التميز والإنجاز' : 'Milestones of Excellence'}
        </motion.h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.3rem', maxWidth: '800px', margin: '1.5rem auto 0', lineHeight: '1.8' }}>
          {lang === 'ar' 
            ? 'نستعرض هنا مسيرة الكلية المليئة بالنجاحات، من مؤتمرات علمية ومشاريع ابتكارية وفاعليات مجتمعية.' 
            : 'Explore our journey of success, from scientific conferences to innovative projects and community events.'}
        </p>
        
        {isAdmin && (
          <button onClick={openCreator} className="btn-primary" style={{ marginTop: '3rem', padding: '1rem 2.5rem', borderRadius: '12px', gap: '10px' }}>
            <Plus size={22} /> {lang === 'ar' ? 'توثيق إنجاز جديد' : 'Document New Achievement'}
          </button>
        )}
      </header>

      {/* Achievements Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '3rem' }}>
        {sortedData.map((ach) => (
          <motion.div 
            key={ach.id} 
            layoutId={`card-${ach.id}`}
            className="glass-panel"
            onClick={() => setActiveAchievement(ach)}
            style={{ overflow: 'hidden', cursor: 'pointer', border: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}
            whileHover={{ y: -12, boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}
          >
            {/* Achievement Image Overlay */}
            <div style={{ height: '240px', width: '100%', position: 'relative' }}>
              <img 
                src={ach.images[0] || 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=800'} 
                alt="ach-img" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', bottom: '1.2rem', left: lang === 'ar' ? 'auto' : '1.2rem', right: lang === 'ar' ? '1.2rem' : 'auto', background: 'var(--accent-color)', color: '#000', padding: '0.4rem 1.2rem', borderRadius: '50px', fontWeight: 'bold', fontSize: '0.9rem', boxShadow: '0 4px 15px rgba(0,0,0,0.3)' }}>
                {ach.year}
              </div>
              
              {isAdmin && (
                <div style={{ position: 'absolute', top: '1rem', right: lang === 'ar' ? 'auto' : '1rem', left: lang === 'ar' ? '1rem' : 'auto', display: 'flex', gap: '0.6rem' }}>
                  <button onClick={(e) => openEditor(ach, e)} style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', padding: '0.6rem', borderRadius: '10px', color: '#f1c40f', border: 'none', cursor: 'pointer' }}><Edit2 size={18} /></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteAchievement(ach.id); }} style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(5px)', padding: '0.6rem', borderRadius: '10px', color: '#e74c3c', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                </div>
              )}
            </div>

            {/* Achievement Info */}
            <div style={{ padding: '2rem', flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.6rem', fontWeight: 'bold', marginBottom: '1.2rem', color: 'var(--primary-color)', lineHeight: '1.4' }}>
                {getLangText(ach.title)}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '2rem', flexGrow: 1 }}>
                {getLangText(ach.summary)}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-light)', fontWeight: '600' }}>
                  <Calendar size={18} /> {ach.date}
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', fontWeight: 'bold', fontSize: '1.1rem' }}>
                  {lang === 'ar' ? 'التفاصيل' : 'Details'} 
                  <ChevronLeft size={20} style={{ transform: lang === 'ar' ? 'none' : 'rotate(180deg)', transition: 'transform 0.3s' }} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Full Report Modal */}
      <AnimatePresence>
        {activeAchievement && (
          <div className="login-modal-overlay" style={{ zIndex: 9500, backdropFilter: 'blur(12px)' }} onClick={() => setActiveAchievement(null)}>
            <motion.div 
              layoutId={`card-${activeAchievement.id}`}
              className="glass-panel"
              onClick={e => e.stopPropagation()}
              style={{ width: '95%', maxWidth: '1000px', maxHeight: '92vh', overflowY: 'auto', padding: 0, border: '1px solid var(--primary-color)' }}
            >
              <button onClick={() => setActiveAchievement(null)} style={{ position: 'absolute', top: '2rem', right: '2rem', zIndex: 100, background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(5px)', color: 'white', padding: '0.8rem', borderRadius: '50%', border: 'none', cursor: 'pointer' }}><X size={28} /></button>
              
              <div style={{ height: '450px', width: '100%', position: 'relative' }}>
                <img src={activeAchievement.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="hero" />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent 50%, rgba(0,0,0,0.8) 100%)' }} />
                <div style={{ position: 'absolute', bottom: '3rem', left: '4rem', right: '4rem' }}>
                   <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
                      <span style={{ background: 'var(--accent-color)', color: '#000', padding: '0.5rem 1.5rem', borderRadius: '50px', fontWeight: '900' }}>{activeAchievement.year}</span>
                      <span style={{ background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(10px)', color: '#fff', padding: '0.5rem 1.5rem', borderRadius: '50px', fontWeight: 'bold' }}>{activeAchievement.date}</span>
                   </div>
                   <h2 style={{ fontSize: '3.5rem', color: '#fff', fontWeight: '900', margin: 0, textShadow: '0 5px 15px rgba(0,0,0,0.5)' }}>{getLangText(activeAchievement.title)}</h2>
                </div>
              </div>

              <div style={{ padding: '4rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '3rem', marginBottom: '4rem' }}>
                  <div style={{ background: 'rgba(220,179,36,0.05)', padding: '2rem', borderRadius: '20px', border: '1px solid rgba(220,179,36,0.2)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '1.5rem', color: 'var(--accent-color)', fontSize: '1.3rem' }}><Users size={24} /> {lang === 'ar' ? 'فريق الإنجاز' : 'Success Team'}</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.8', fontSize: '1.1rem' }}>{getLangText(activeAchievement.participants)}</p>
                  </div>
                </div>

                <div className="full-report-content">
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem', color: 'var(--primary-light)', fontSize: '1.5rem' }}><FileText size={26} /> {lang === 'ar' ? 'التقرير التفصيلي' : 'Comprehensive Report'}</h4>
                  <div style={{ whiteSpace: 'pre-wrap', color: 'var(--text-primary)', lineHeight: '2', fontSize: '1.2rem', textAlign: 'justify' }}>
                    {getLangText(activeAchievement.report)}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Editor Modal */}
        {isEditorOpen && (
          <div className="login-modal-overlay" style={{ zIndex: 9999 }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-panel" style={{ width: '95%', maxWidth: '850px', maxHeight: '90vh', overflowY: 'auto', padding: '3.5rem', position: 'relative' }}>
              <button onClick={() => setIsEditorOpen(false)} style={{ position: 'absolute', top: '2rem', right: '2rem', background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}><X size={28} /></button>
              
              <h2 style={{ marginBottom: '3rem', color: 'var(--primary-color)', fontSize: '2.2rem', fontWeight: 'bold' }}>
                 {editingItem ? (lang === 'ar' ? 'تحديث بيانات الإنجاز' : 'Edit Achievement') : (lang === 'ar' ? 'توثيق إنجاز جديد' : 'New Milestone')}
              </h2>

              <form onSubmit={saveAchievement} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div className="input-group"><label>{lang === 'ar' ? 'العنوان (عربي)' : 'Title (AR)'}</label><input required value={formData.title.ar} onChange={e => setFormData({...formData, title: {...formData.title, ar: e.target.value}})} /></div>
                  <div className="input-group"><label>{lang === 'ar' ? 'العنوان (EN)' : 'Title (EN)'}</label><input required value={formData.title.en} onChange={e => setFormData({...formData, title: {...formData.title, en: e.target.value}})} /></div>
                </div>

                <div className="input-group">
                  <label>{lang === 'ar' ? 'نبذة مختصرة (للبطاقة الخارجية)' : 'Brief Summary'}</label>
                  <textarea rows="2" required value={formData.summary.ar} onChange={e => setFormData({...formData, summary: {...formData.summary, ar: e.target.value}})} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '1rem', color: '#fff', border: '1px solid var(--border-color)' }} />
                </div>

                <div className="input-group">
                  <label>{lang === 'ar' ? 'التقرير التفصيلي الكامل' : 'Detailed Report'}</label>
                  <textarea rows="6" required value={formData.report.ar} onChange={e => setFormData({...formData, report: {...formData.report, ar: e.target.value}})} style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '1rem', color: '#fff', border: '1px solid var(--border-color)' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                  <div className="input-group"><label>{lang === 'ar' ? 'السنة' : 'Year'}</label><input required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} placeholder="2024" /></div>
                  <div className="input-group"><label>{lang === 'ar' ? 'التاريخ الفعلي' : 'Exact Date'}</label><input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                </div>

                <div className="input-group">
                  <label>{lang === 'ar' ? 'فريق العمل والمشاركين' : 'Success Team / Participants'}</label>
                  <input value={formData.participants.ar} onChange={e => setFormData({...formData, participants: {...formData.participants, ar: e.target.value}})} placeholder="مثال: عميد الكلية، د. سارة، ومجموعة من الطلاب المبدعين" />
                </div>

                <div className="input-group">
                  <label>{lang === 'ar' ? 'رابط الصورة الرئيسية' : 'Main Image URL'}</label>
                  <input value={formData.images[0]} onChange={e => setFormData({...formData, images: [e.target.value]})} placeholder="https://..." />
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '1.2rem', fontSize: '1.2rem', fontWeight: 'bold', marginTop: '1rem' }}>
                  <Check size={24} style={{ marginInlineEnd: '10px' }} />
                  {lang === 'ar' ? 'حفظ وتوثيق الإنجاز' : 'Save and Document'}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Achievements;
