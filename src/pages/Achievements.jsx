import React, { useState } from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Award, Plus, Trash2, Edit2, X, Check, Calendar, Users, FileText, Image as ImageIcon, ChevronLeft, ChevronRight } from 'lucide-react';

const Achievements = () => {
  const { lang } = useLocale();
  const { user } = useAuth();
  const { achievements, addAchievement, deleteAchievement, editAchievement } = useAdmin();
  const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);

  const [selectedAch, setSelectedAch] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAch, setEditingAch] = useState(null);
  
  const [formData, setFormData] = useState({
    title: { ar: '', en: '' },
    summary: { ar: '', en: '' },
    report: { ar: '', en: '' },
    year: '',
    participants: { ar: '', en: '' },
    images: [''],
    date: ''
  });

  const handleOpenAdd = () => {
    setFormData({ title: { ar: '', en: '' }, summary: { ar: '', en: '' }, report: { ar: '', en: '' }, year: '', participants: { ar: '', en: '' }, images: [''], date: '' });
    setEditingAch(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (ach, e) => {
    e.stopPropagation();
    setFormData({ ...ach });
    setEditingAch(ach);
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingAch) editAchievement({ ...formData, id: editingAch.id });
    else addAchievement(formData);
    setShowAddModal(false);
  };

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {lang === 'ar' ? 'إنجازات الكلية' : 'Faculty Achievements'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          {lang === 'ar' 
            ? 'سجل حافل بالعطاء والتميز، نستعرض هنا أبرز المحطات والنجاحات التي حققتها كليتنا وكوادرها وطلابها.' 
            : 'A track record of excellence, showcasing the major milestones and successes achieved by our faculty, staff, and students.'}
        </p>
        
        {isAdmin && (
          <button onClick={handleOpenAdd} className="btn-primary" style={{ marginTop: '2rem', gap: '0.5rem' }}>
            <Plus size={20} /> {lang === 'ar' ? 'إضافة إنجاز جديد' : 'Add New Achievement'}
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2.5rem' }}>
        {achievements.map((ach) => (
          <motion.div 
            key={ach.id} 
            layoutId={`ach-${ach.id}`}
            className="glass-panel"
            onClick={() => setSelectedAch(ach)}
            style={{ overflow: 'hidden', cursor: 'pointer', transition: 'transform 0.3s' }}
            whileHover={{ y: -10 }}
          >
            <div style={{ height: '200px', width: '100%', position: 'relative' }}>
              <img src={ach.images[0] || 'https://via.placeholder.com/800x400'} alt="achievement" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--accent-color)', color: '#000', padding: '0.2rem 0.8rem', borderRadius: '50px', fontWeight: 'bold', fontSize: '0.85rem' }}>
                {ach.year}
              </div>
              {isAdmin && (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={(e) => handleOpenEdit(ach, e)} style={{ background: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '8px', color: '#f1c40f' }}><Edit2 size={18} /></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteAchievement(ach.id); }} style={{ background: 'rgba(0,0,0,0.5)', padding: '0.5rem', borderRadius: '8px', color: '#e74c3c' }}><Trash2 size={18} /></button>
                </div>
              )}
            </div>

            <div style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.3rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>{ach.title[lang] || ach.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {ach.summary[lang] || ach.summary}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: 'var(--primary-light)', fontWeight: 'bold' }}>{ach.date}</span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>
                  {lang === 'ar' ? 'المزيد' : 'More'} <ChevronLeft size={16} style={{ transform: lang === 'ar' ? 'none' : 'rotate(180deg)' }} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedAch && (
          <div className="login-modal-overlay" style={{ zIndex: 7000 }} onClick={() => setSelectedAch(null)}>
            <motion.div 
              layoutId={`ach-${selectedAch.id}`}
              className="glass-panel"
              onClick={e => e.stopPropagation()}
              style={{ width: '95%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: 0 }}
            >
              <button onClick={() => setSelectedAch(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, background: 'rgba(0,0,0,0.5)', color: 'white', padding: '0.5rem', borderRadius: '50%' }}><X size={24} /></button>
              
              <div style={{ height: '400px', width: '100%' }}>
                <img src={selectedAch.images[0]} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>

              <div style={{ padding: '3rem' }}>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '2rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(220,179,36,0.1)', color: 'var(--accent-color)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold' }}>
                    <Calendar size={18} /> {selectedAch.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(161, 23, 44, 0.1)', color: 'var(--primary-light)', padding: '0.5rem 1rem', borderRadius: '8px', fontWeight: 'bold' }}>
                    <Award size={18} /> {selectedAch.year}
                  </div>
                </div>

                <h2 style={{ fontSize: '2.5rem', marginBottom: '2rem', color: 'var(--primary-color)' }}>{selectedAch.title[lang] || selectedAch.title}</h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
                  <div style={{ borderLeft: lang === 'ar' ? 'none' : '4px solid var(--accent-color)', borderRight: lang === 'ar' ? '4px solid var(--accent-color)' : 'none', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.03)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--accent-color)' }}><Users size={20} /> {lang === 'ar' ? 'المشاركون' : 'Participants'}</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>{selectedAch.participants[lang] || selectedAch.participants}</p>
                  </div>
                </div>

                <div className="report-content" style={{ color: 'var(--text-primary)', lineHeight: '1.8', fontSize: '1.1rem' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', color: 'var(--primary-light)' }}><FileText size={20} /> {lang === 'ar' ? 'التقرير الكامل' : 'Full Report'}</h4>
                  <div style={{ whiteSpace: 'pre-wrap' }}>{selectedAch.report[lang] || selectedAch.report}</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showAddModal && (
          <div className="login-modal-overlay" style={{ zIndex: 8000 }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-panel" style={{ width: '95%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', position: 'relative' }}>
              <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-secondary)' }}><X size={24} /></button>
              <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>{editingAch ? 'تعديل الإنجاز' : 'إضافة إنجاز جديد'}</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="form-grid">
                  <div className="input-group full-width"><label>العنوان (عربي)</label><input required value={formData.title.ar} onChange={e => setFormData({...formData, title: {...formData.title, ar: e.target.value}})} /></div>
                  <div className="input-group full-width"><label>Title (EN)</label><input required value={formData.title.en} onChange={e => setFormData({...formData, title: {...formData.title, en: e.target.value}})} /></div>
                  <div className="input-group full-width"><label>ملخص قصير (عربي)</label><textarea rows="2" value={formData.summary.ar} onChange={e => setFormData({...formData, summary: {...formData.summary, ar: e.target.value}})} /></div>
                  <div className="input-group full-width"><label>Short Summary (EN)</label><textarea rows="2" value={formData.summary.en} onChange={e => setFormData({...formData, summary: {...formData.summary, en: e.target.value}})} /></div>
                  <div className="input-group full-width"><label>التقرير الكامل (عربي)</label><textarea rows="5" value={formData.report.ar} onChange={e => setFormData({...formData, report: {...formData.report, ar: e.target.value}})} /></div>
                  <div className="input-group full-width"><label>Full Report (EN)</label><textarea rows="5" value={formData.report.en} onChange={e => setFormData({...formData, report: {...formData.report, en: e.target.value}})} /></div>
                  <div className="input-group"><label>السنة</label><input required value={formData.year} onChange={e => setFormData({...formData, year: e.target.value})} /></div>
                  <div className="input-group"><label>التاريخ</label><input required type="date" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} /></div>
                  <div className="input-group full-width"><label>المشاركون</label><input value={formData.participants.ar} onChange={e => setFormData({...formData, participants: {...formData.participants, ar: e.target.value}})} placeholder="أسماء العميد، الدكاترة، الطلاب..." /></div>
                  <div className="input-group full-width"><label>رابط الصورة</label><input value={formData.images[0]} onChange={e => setFormData({...formData, images: [e.target.value]})} /></div>
                </div>
                <button type="submit" className="btn-primary" style={{ padding: '1rem' }}><Check size={20} /> حفظ الإنجاز</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Achievements;
