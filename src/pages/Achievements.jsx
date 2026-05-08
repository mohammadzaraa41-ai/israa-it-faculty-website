import React, { useState, useMemo } from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Award, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Check, 
  Calendar, 
  Users, 
  FileText, 
  Image as ImageIcon, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  Layout
} from 'lucide-react';

// --- Global Helpers (Same as Alumni for consistency) ---
const getLoc = (item, prefix, lang) => {
  if (!item) return '';
  // Check snake_case first (Supabase style)
  if (item[`${prefix}_${lang}`]) return item[`${prefix}_${lang}`];
  if (item[`${prefix}_ar`]) return item[`${prefix}_ar`];
  if (item[`${prefix}_en`]) return item[`${prefix}_en`];
  // Check object style
  if (item[prefix] && typeof item[prefix] === 'object') return item[prefix][lang] || item[prefix].ar || item[prefix].en || '';
  // Check direct string
  if (item[prefix] && typeof item[prefix] === 'string') return item[prefix];
  return '';
};

const Achievements = () => {
  const { lang } = useLocale();
  const { user } = useAuth();
  const { achievements, addAchievement, deleteAchievement, editAchievement, uploadFile } = useAdmin();
  const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);

  const [selectedAch, setSelectedAch] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAch, setEditingAch] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  
  const [formData, setFormData] = useState({
    title: { ar: '', en: '' },
    summary: { ar: '', en: '' },
    report: { ar: '', en: '' },
    year: '1',
    participants: { ar: '', en: '' },
    images: [''],
    date: new Date().toISOString().split('T')[0]
  });

  const sortedAchievements = useMemo(() => {
    return [...achievements].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [achievements]);

  const resetForm = () => {
    setFormData({ 
      title: { ar: '', en: '' }, 
      summary: { ar: '', en: '' }, 
      report: { ar: '', en: '' }, 
      year: '1', 
      participants: { ar: '', en: '' }, 
      images: [''], 
      date: new Date().toISOString().split('T')[0] 
    });
  };

  const handleOpenAdd = () => {
    resetForm();
    setEditingAch(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (ach, e) => {
    e.stopPropagation();
    setFormData({ 
      ...ach,
      title: typeof ach.title === 'object' ? ach.title : { ar: ach.title_ar || ach.title || '', en: ach.title_en || '' },
      summary: typeof ach.summary === 'object' ? ach.summary : { ar: ach.summary_ar || ach.summary || '', en: ach.summary_en || '' },
      report: typeof ach.report === 'object' ? ach.report : { ar: ach.report_ar || ach.report || ach.content || '', en: ach.report_en || '' },
      participants: typeof ach.participants === 'object' ? ach.participants : { ar: ach.participants_ar || ach.participants || '', en: ach.participants_en || '' },
      images: Array.isArray(ach.images) ? ach.images : (ach.image_url ? [ach.image_url] : [''])
    });
    setEditingAch(ach);
    setShowAddModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let res;
    if (editingAch) res = await editAchievement({ ...formData, id: editingAch.id });
    else res = await addAchievement(formData);
    
    if (res?.success) setShowAddModal(false);
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem', padding: '1rem' }}>
        <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
          {lang === 'ar' ? 'إنجازات الكلية' : 'Faculty Achievements'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', maxWidth: '800px', margin: '0 auto', opacity: 0.8 }}>
          {lang === 'ar' 
            ? 'سجل حافل بالتميز، نستعرض هنا أبرز النجاحات التي حققتها كليتنا وكوادرها وطلابها.' 
            : 'A track record of excellence, showcasing the major successes achieved by our faculty and students.'}
        </p>
        
        {isAdmin && (
          <button onClick={handleOpenAdd} className="btn-primary" style={{ marginTop: '2rem', gap: '0.5rem' }}>
            <Plus size={20} /> {lang === 'ar' ? 'إضافة إنجاز جديد' : 'Add Achievement'}
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
        {sortedAchievements.map((ach) => (
          <motion.div 
            key={ach.id} 
            layoutId={`ach-${ach.id}`}
            className="glass-panel"
            onClick={() => setSelectedAch(ach)}
            style={{ 
              overflow: 'hidden', 
              cursor: 'pointer', 
              background: 'rgba(255,255,255,0.02)',
              border: '1px solid var(--border-color)',
              borderRadius: '20px',
              display: 'flex',
              flexDirection: 'column'
            }}
            whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.2)' }}
          >
            <div style={{ height: '220px', width: '100%', position: 'relative' }}>
              <img 
                src={(Array.isArray(ach.images) ? ach.images[0] : ach.images) || ach.image_url || 'https://images.unsplash.com/photo-1523240715632-d984bc31b32d?auto=format&fit=crop&q=80&w=800'} 
                alt="achievement" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
              <div style={{ position: 'absolute', top: '1rem', left: '1rem', background: 'var(--accent-color)', color: '#000', padding: '0.3rem 0.8rem', borderRadius: '50px', fontWeight: 'bold', fontSize: '0.75rem' }}>
                {ach.year ? (lang === 'ar' ? `سنة ${ach.year}` : `Year ${ach.year}`) : new Date(ach.date).getFullYear()}
              </div>
              {isAdmin && (
                <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={(e) => handleOpenEdit(ach, e)} style={{ background: 'rgba(0,0,0,0.6)', padding: '0.5rem', borderRadius: '10px', color: '#f1c40f', border: 'none' }}><Edit2 size={16} /></button>
                  <button onClick={(e) => { e.stopPropagation(); deleteAchievement(ach.id); }} style={{ background: 'rgba(0,0,0,0.6)', padding: '0.5rem', borderRadius: '10px', color: '#e74c3c', border: 'none' }}><Trash2 size={16} /></button>
                </div>
              )}
            </div>

            <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '0.8rem', color: 'var(--primary-color)', lineHeight: '1.4' }}>
                {getLoc(ach, 'title', lang)}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.6', marginBottom: '1.5rem', opacity: 0.8, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {getLoc(ach, 'summary', lang) || getLoc(ach, 'report', lang) || (lang === 'ar' ? 'انقر لعرض التفاصيل الكاملة' : 'Click to view full details')}
              </p>
              
              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--accent-color)', fontSize: '0.85rem', fontWeight: 'bold' }}>
                  <Clock size={14} />
                  <span>{ach.date}</span>
                </div>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', color: 'var(--primary-light)', fontSize: '0.85rem' }}>
                  {lang === 'ar' ? 'المزيد' : 'More'} <ChevronLeft size={16} style={{ transform: lang === 'ar' ? 'none' : 'rotate(180deg)' }} />
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {selectedAch && (
          <div className="login-modal-overlay" style={{ zIndex: 7000, padding: '1rem' }} onClick={() => setSelectedAch(null)}>
            <motion.div 
              layoutId={`ach-${selectedAch.id}`}
              className="glass-panel"
              onClick={e => e.stopPropagation()}
              style={{ width: '100%', maxWidth: '900px', maxHeight: '90vh', overflowY: 'auto', padding: 0, borderRadius: '25px' }}
            >
              <button onClick={() => setSelectedAch(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', zIndex: 10, background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }}><X size={20} /></button>
              
              <div style={{ height: '350px', width: '100%' }}>
                <img 
                  src={(Array.isArray(selectedAch.images) ? selectedAch.images[0] : selectedAch.images) || selectedAch.image_url || 'https://images.unsplash.com/photo-1523240715632-d984bc31b32d?auto=format&fit=crop&q=80&w=800'} 
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  alt=""
                />
              </div>

              <div style={{ padding: '2rem' }}>
                <div style={{ display: 'flex', gap: '0.8rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(220,179,36,0.1)', color: 'var(--accent-color)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    <Calendar size={18} /> {selectedAch.date}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(161, 23, 44, 0.1)', color: 'var(--primary-light)', padding: '0.5rem 1rem', borderRadius: '10px', fontSize: '0.9rem', fontWeight: 'bold' }}>
                    <Award size={18} /> {selectedAch.year ? (lang === 'ar' ? `سنة ${selectedAch.year}` : `Year ${selectedAch.year}`) : ''}
                  </div>
                </div>

                <h2 style={{ fontSize: '2rem', marginBottom: '1.5rem', color: 'var(--primary-color)', lineHeight: '1.3' }}>
                  {getLoc(selectedAch, 'title', lang)}
                </h2>
                
                {getLoc(selectedAch, 'participants', lang) && (
                  <div style={{ marginBottom: '2rem', padding: '1.2rem', background: 'rgba(255,255,255,0.03)', borderRadius: '15px', borderLeft: '4px solid var(--accent-color)' }}>
                    <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.8rem', color: 'var(--accent-color)', fontSize: '1.1rem' }}><Users size={20} /> {lang === 'ar' ? 'المشاركون' : 'Participants'}</h4>
                    <p style={{ margin: 0, color: 'var(--text-secondary)', lineHeight: '1.6' }}>
                      {getLoc(selectedAch, 'participants', lang)}
                    </p>
                  </div>
                )}
 
                <div style={{ color: 'var(--text-primary)', lineHeight: '1.8', fontSize: '1.05rem' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.2rem', color: 'var(--primary-light)', fontSize: '1.1rem' }}><FileText size={20} /> {lang === 'ar' ? 'التفاصيل الكاملة' : 'Full Details'}</h4>
                  <div style={{ whiteSpace: 'pre-wrap', opacity: 0.9 }}>
                    {getLoc(selectedAch, 'report', lang) || getLoc(selectedAch, 'summary', lang) || '---'}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {showAddModal && (
          <div className="login-modal-overlay" style={{ zIndex: 8000, padding: '1rem' }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-panel" style={{ width: '100%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', position: 'relative', borderRadius: '25px' }}>
              <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-secondary)', background: 'none', border: 'none' }}><X size={24} /></button>
              <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)', textAlign: 'center' }}>{editingAch ? 'تعديل الإنجاز' : 'إضافة إنجاز جديد'}</h2>
              
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.4rem', display: 'block'}}>العنوان بالعربي</label>
                    <input required className="glass-panel" style={{width: '100%', padding: '0.8rem', color: 'white'}} value={formData.title?.ar || ''} onChange={e => setFormData({...formData, title: {...formData.title, ar: e.target.value}})} />
                  </div>
                  <div className="input-group">
                    <label style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.4rem', display: 'block'}}>Title (EN)</label>
                    <input required className="glass-panel" style={{width: '100%', padding: '0.8rem', color: 'white'}} value={formData.title?.en || ''} onChange={e => setFormData({...formData, title: {...formData.title, en: e.target.value}})} />
                  </div>
                </div>

                <div className="input-group">
                  <label style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.4rem', display: 'block'}}>ملخص قصير بالعربي</label>
                  <textarea rows="2" className="glass-panel" style={{width: '100%', padding: '0.8rem', color: 'white'}} value={formData.summary?.ar || ''} onChange={e => setFormData({...formData, summary: {...formData.summary, ar: e.target.value}})} />
                </div>

                <div className="input-group">
                  <label style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.4rem', display: 'block'}}>التفاصيل / التقرير بالعربي</label>
                  <textarea rows="4" className="glass-panel" style={{width: '100%', padding: '0.8rem', color: 'white'}} value={formData.report?.ar || ''} onChange={e => setFormData({...formData, report: {...formData.report, ar: e.target.value}})} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.4rem', display: 'block'}}>السنة</label>
                    <select value={formData.year || '1'} className="glass-panel" style={{width: '100%', padding: '0.8rem', color: 'white'}} onChange={e => setFormData({...formData, year: e.target.value})}>
                      <option value="1">الأولى</option><option value="2">الثانية</option><option value="3">الثالثة</option><option value="4">الرابعة</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.4rem', display: 'block'}}>التاريخ</label>
                    <input required type="date" className="glass-panel" style={{width: '100%', padding: '0.8rem', color: 'white'}} value={formData.date || ''} onChange={e => setFormData({...formData, date: e.target.value})} />
                  </div>
                </div>

                <div className="input-group">
                  <label style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.4rem', display: 'block'}}>رابط الصورة</label>
                  <div style={{display: 'flex', gap: '1rem', alignItems: 'center'}}>
                    <input className="glass-panel" style={{flex: 1, padding: '0.8rem', color: 'white'}} value={formData.images[0] || ''} onChange={e => setFormData({...formData, images: [e.target.value]})} placeholder="https://..." />
                    <input type="file" hidden id="ach-img-up" onChange={async (e) => {
                      const file = e.target.files[0];
                      if (file) { setIsUploading(true); const url = await uploadFile(file); if (url) setFormData({...formData, images: [url]}); setIsUploading(false); }
                    }} />
                    <button type="button" className="btn-outline" onClick={() => document.getElementById('ach-img-up').click()} disabled={isUploading}>{isUploading ? '...' : <ImageIcon size={18}/>}</button>
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ padding: '1rem', marginTop: '1rem' }}><Check size={20} /> {lang === 'ar' ? 'حفظ الإنجاز' : 'Save Achievement'}</button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Achievements;
