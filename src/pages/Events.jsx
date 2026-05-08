import React, { useState, memo, useMemo } from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Edit2, 
  X, 
  Trophy, 
  Clock, 
  Image as ImageIcon,
  FileUp
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminModal = memo(({ title, onSave, onClose, isSubmitting, lang, children }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
      <button style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}><X size={20}/></button>
      <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: 'var(--accent-color)' }}>{title}</h3>
      {children}
      <button 
        className="btn-primary" 
        disabled={isSubmitting}
        style={{ width: '100%', padding: '1rem', marginTop: '1.5rem', opacity: isSubmitting ? 0.7 : 1 }} 
        onClick={onSave}
      >
        {isSubmitting 
          ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') 
          : (lang === 'ar' ? 'حفظ البيانات' : 'Save Data')}
      </button>
    </motion.div>
  </motion.div>
));

const Events = () => {
  const { lang } = useLocale();
  const { user } = useAuth();
  const { activities, addActivity, deleteActivity, updateActivity, uploadFile } = useAdmin();
  const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);

  const [isAdding, setIsAdding] = useState(false);
  const [editingAct, setEditingAct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  
  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    text: { ar: '', en: '' },
    date: new Date().toISOString().split('T')[0],
    tag: '',
    image_url: ''
  });

  const handleOpenAdd = () => {
    setFormData({
      title_ar: '', title_en: '',
      text: { ar: '', en: '' },
      date: new Date().toISOString().split('T')[0],
      tag: '', image_url: ''
    });
    setEditingAct(null);
    setIsAdding(true);
  };

  const handleOpenEdit = (act, e) => {
    e.stopPropagation();
    setFormData({
      title_ar: act.title_ar || '',
      title_en: act.title_en || '',
      text: typeof act.text === 'object' ? act.text : { ar: act.text || '', en: act.text || '' },
      date: act.date || '',
      tag: act.tag || '',
      image_url: act.image_url || ''
    });
    setEditingAct(act);
    setIsAdding(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      const url = await uploadFile(file);
      if (url) setFormData(prev => ({ ...prev, image_url: url }));
      setIsUploading(false);
    }
  };

  const handleSave = async () => {
    if (!formData.title_ar || !formData.date) {
      alert(lang === 'ar' ? 'يرجى ملء الحقول الأساسية' : 'Please fill basic fields');
      return;
    }
    
    setIsSubmitting(true);
    let result;
    if (editingAct) {
      result = await updateActivity({ ...formData, id: editingAct.id });
    } else {
      result = await addActivity(formData);
    }
    
    if (result?.success) setIsAdding(false);
    setIsSubmitting(false);
  };

  const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [activities]);

  return (
    <div style={{ padding: '2rem 1rem 5rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
          {lang === 'ar' ? 'الفعاليات والهاكاثون' : 'Events & Hackathons'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
          {lang === 'ar' ? 'أنشطة ومسابقات الكلية المتميزة.' : 'Distinctive faculty activities and competitions.'}
        </p>
        
        {isAdmin && (
          <button onClick={handleOpenAdd} className="btn-primary" style={{ marginTop: '2.5rem', gap: '0.5rem', padding: '0.8rem 2rem' }}>
            <Plus size={20} /> {lang === 'ar' ? 'إضافة فعالية/هاكاثون' : 'Add Activity/Hackathon'}
          </button>
        )}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {sortedActivities.map((act, i) => {
          const title = lang === 'ar' ? act.title_ar : act.title_en;
          const desc = typeof act.text === 'object' ? act.text[lang] : act.text;
          const isHackathon = act.tag?.toLowerCase().includes('hackathon') || act.tag?.includes('هاكاثون');

          return (
            <motion.div key={act.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass-panel" style={{ padding: '0', overflow: 'hidden', border: isHackathon ? '1px solid var(--accent-color)' : '1px solid var(--border-color)', borderRadius: '20px' }}>
              {act.image_url && <div style={{ height: '200px' }}><img src={act.image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>}
              <div style={{ padding: '1.5rem' }}>
                <span style={{ background: isHackathon ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', color: isHackathon ? '#000' : 'var(--text-secondary)', padding: '0.3rem 1rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 'bold', display: 'inline-block', marginBottom: '1rem' }}>
                  {isHackathon && <Trophy size={12} style={{marginInlineEnd: '5px'}}/>}
                  {act.tag}
                </span>
                <h2 style={{ fontSize: '1.3rem', fontWeight: 'bold', marginBottom: '0.8rem', color: isHackathon ? 'var(--accent-color)' : 'var(--primary-color)' }}>{title}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', marginBottom: '1.2rem', fontSize: '0.85rem' }}><Calendar size={14} color="var(--accent-color)" /><span>{act.date}</span></div>
                <p style={{ color: 'var(--text-primary)', marginBottom: '1.5rem', lineHeight: '1.6', fontSize: '0.9rem', opacity: 0.8 }}>{desc}</p>
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '1rem' }}>
                    <button onClick={(e) => handleOpenEdit(act, e)} className="btn-outline" style={{ flex: 1 }}><Edit2 size={14} /> {lang === 'ar' ? 'تعديل' : 'Edit'}</button>
                    <button onClick={() => deleteActivity(act.id)} className="btn-outline" style={{ color: '#ff4444' }}><Trash2 size={14} /></button>
                  </div>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isAdding && (
          <AdminModal title={editingAct ? 'تعديل' : 'إضافة جديد'} onClose={() => setIsAdding(false)} isSubmitting={isSubmitting} lang={lang} onSave={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input placeholder="العنوان بالعربي" className="glass-panel" style={{ width: '100%', padding: '0.8rem', color: 'white' }} value={formData.title_ar} onChange={e => setFormData({...formData, title_ar: e.target.value})} />
              <input placeholder="Title (EN)" className="glass-panel" style={{ width: '100%', padding: '0.8rem', color: 'white' }} value={formData.title_en} onChange={e => setFormData({...formData, title_en: e.target.value})} />
              <input type="date" className="glass-panel" style={{ width: '100%', padding: '0.8rem', color: 'white' }} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              <input placeholder="النوع (مثلاً هاكاثون)" className="glass-panel" style={{ width: '100%', padding: '0.8rem', color: 'white' }} value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} />
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                <button type="button" className="btn-outline" style={{ flex: 1 }} onClick={() => fileInputRef.current?.click()}>{isUploading ? '...' : 'رفع صورة'}</button>
                <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} accept="image/*" />
                {formData.image_url && <ImageIcon size={20} color="var(--accent-color)" />}
              </div>
              <textarea placeholder="الوصف بالعربي" className="glass-panel" style={{ width: '100%', padding: '0.8rem', color: 'white', minHeight: '80px' }} value={formData.text.ar} onChange={e => setFormData({...formData, text: {...formData.text, ar: e.target.value}})} />
              <textarea placeholder="Description (EN)" className="glass-panel" style={{ width: '100%', padding: '0.8rem', color: 'white', minHeight: '80px' }} value={formData.text.en} onChange={e => setFormData({...formData, text: {...formData.text, en: e.target.value}})} />
            </div>
          </AdminModal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
