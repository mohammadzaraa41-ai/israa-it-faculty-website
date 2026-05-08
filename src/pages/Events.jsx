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
  Image as ImageIcon,
  FileUp,
  Info,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AdminModal = memo(({ title, onSave, onClose, isSubmitting, lang, children }) => (
  <motion.div 
    initial={{ opacity: 0 }} 
    animate={{ opacity: 1 }} 
    exit={{ opacity: 0 }} 
    onClick={onClose}
    style={{ 
      position: 'fixed', 
      inset: 0, 
      background: 'rgba(0,0,0,0.9)', 
      zIndex: 3000, 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      padding: '1rem' 
    }}
  >
    <motion.div 
      initial={{ scale: 0.9, y: 20 }} 
      animate={{ scale: 1, y: 0 }} 
      onClick={e => e.stopPropagation()}
      className="glass-panel" 
      style={{ 
        width: '95%', 
        maxWidth: '550px', 
        maxHeight: '90vh',
        padding: '2rem', 
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        borderRadius: '24px',
        border: '1px solid rgba(255,255,255,0.1)'
      }}
    >
      <button 
        style={{ 
          position: 'absolute', 
          top: '1rem', 
          right: lang === 'ar' ? 'auto' : '1.5rem', 
          left: lang === 'ar' ? '1.5rem' : 'auto', 
          color: 'var(--text-secondary)', 
          background: 'rgba(255,255,255,0.05)', 
          border: 'none', 
          cursor: 'pointer',
          width: '32px',
          height: '32px',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} 
        onClick={onClose}
      >
        <X size={18}/>
      </button>

      <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: 'var(--accent-color)' }}>
        {title}
      </h3>

      <div style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
        <button className="btn-primary" disabled={isSubmitting} style={{ flex: 2, padding: '1rem' }} onClick={onSave}>
          {isSubmitting ? (lang === 'ar' ? 'جاري الحفظ...' : 'Saving...') : (lang === 'ar' ? 'حفظ البيانات' : 'Save Data')}
        </button>
        <button className="btn-outline" style={{ flex: 1 }} onClick={onClose}>
          {lang === 'ar' ? 'إلغاء' : 'Cancel'}
        </button>
      </div>
    </motion.div>
  </motion.div>
));

const ActivityDetailModal = memo(({ act, onClose, lang }) => {
  const isHackathon = act.tag?.toLowerCase().includes('hackathon') || act.tag?.includes('هاكاثون');
  const title = lang === 'ar' ? act.title_ar : act.title_en;
  const desc = typeof act.text === 'object' ? act.text[lang] : act.text;

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
      <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} onClick={e => e.stopPropagation()} className="glass-panel" style={{ width: '95%', maxWidth: '700px', maxHeight: '90vh', overflowY: 'auto', borderRadius: '30px', border: isHackathon ? '2px solid var(--accent-color)' : '1px solid rgba(255,255,255,0.1)', padding: 0 }}>
        <div style={{ position: 'relative', width: '100%', height: '300px' }}>
          <img src={act.image_url || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, transparent, #000)' }} />
          <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', background: 'rgba(0,0,0,0.5)', color: 'white', border: 'none', borderRadius: '50%', width: '40px', height: '40px', cursor: 'pointer' }}><X size={24}/></button>
          
          <div style={{ position: 'absolute', bottom: '1.5rem', right: '1.5rem', left: '1.5rem' }}>
             {act.tag && <span style={{ background: isHackathon ? 'var(--accent-color)' : 'var(--primary-color)', color: isHackathon ? '#000' : '#fff', padding: '0.4rem 1.2rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 'bold', display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                {isHackathon && <Trophy size={14}/>}
                {act.tag}
             </span>}
             <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'white' }}>{title}</h2>
          </div>
        </div>

        <div style={{ padding: '2rem' }}>
           <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Calendar size={18} color="var(--accent-color)" /><span>{act.date}</span></div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Clock size={18} color="var(--accent-color)" /><span>{lang === 'ar' ? 'فعالية متميزة' : 'Featured Activity'}</span></div>
           </div>
           <div style={{ lineHeight: '1.8', color: 'rgba(255,255,255,0.9)', fontSize: '1.1rem', whiteSpace: 'pre-wrap' }}>
              {desc}
           </div>
           
           <button onClick={onClose} className="btn-primary" style={{ marginTop: '3rem', width: '100%', padding: '1rem' }}>
              {lang === 'ar' ? 'إغلاق' : 'Close'}
           </button>
        </div>
      </motion.div>
    </motion.div>
  );
});

const Events = () => {
  const { lang } = useLocale();
  const { user } = useAuth();
  const { activities, addActivity, deleteActivity, updateActivity, uploadFile } = useAdmin();
  const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);

  const [isAdding, setIsAdding] = useState(false);
  const [editingAct, setEditingAct] = useState(null);
  const [selectedAct, setSelectedAct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = React.useRef(null);
  
  const [formData, setFormData] = useState({
    title_ar: '', title_en: '',
    text: { ar: '', en: '' },
    date: new Date().toISOString().split('T')[0],
    tag: '', image_url: ''
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
      text: typeof act.text === 'object' ? act.text : { ar: act.text_ar || act.text || '', en: act.text_en || act.text || '' },
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
           {lang === 'ar' ? 'تعرف على آخر الأنشطة والمسابقات البرمجية.' : 'Discover the latest activities and coding competitions.'}
        </p>
        
        {isAdmin && (
          <button onClick={handleOpenAdd} className="btn-primary" style={{ marginTop: '2.5rem', gap: '0.5rem', padding: '0.8rem 2rem' }}>
            <Plus size={20} /> {lang === 'ar' ? 'إضافة فعالية جديدة' : 'Add New Event'}
          </button>
        )}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {sortedActivities.map((act, i) => {
          const title = lang === 'ar' ? act.title_ar : act.title_en;
          const desc = typeof act.text === 'object' ? act.text[lang] : (act.text_ar || act.text);
          const isHackathon = act.tag?.toLowerCase().includes('hackathon') || act.tag?.includes('هاكاثون');

          return (
            <motion.div 
              key={act.id} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }} 
              className="glass-panel" 
              onClick={() => setSelectedAct(act)}
              style={{ 
                padding: '0', 
                overflow: 'hidden', 
                border: isHackathon ? '1px solid var(--accent-color)' : '1px solid var(--border-color)', 
                borderRadius: '24px', 
                cursor: 'pointer',
                transition: 'transform 0.3s'
              }}
              whileHover={{ y: -10 }}
            >
              <div style={{ height: '220px', position: 'relative' }}>
                <img src={act.image_url || 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1000'} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                   {isHackathon && <div style={{ background: 'var(--accent-color)', color: '#000', padding: '0.4rem', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Trophy size={18} /></div>}
                </div>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                  <span style={{ color: 'var(--accent-color)', fontSize: '0.8rem', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '1px' }}>{act.tag}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-secondary)' }}><Calendar size={12}/> {act.date}</div>
                </div>
                
                <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem', color: '#fff' }}>{title}</h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.5rem', display: '-webkit-box', WebkitLineClamp: '2', WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.6' }}>{desc}</p>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary-color)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>{lang === 'ar' ? 'عرض التفاصيل' : 'View Details'} <ChevronRight size={14}/></span>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={(e) => handleOpenEdit(act, e)} style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', borderRadius: '8px', padding: '0.4rem' }}><Edit2 size={14} /></button>
                      <button onClick={(e) => { e.stopPropagation(); deleteActivity(act.id); }} style={{ background: 'rgba(255,68,68,0.1)', color: '#ff4444', border: 'none', borderRadius: '8px', padding: '0.4rem' }}><Trash2 size={14} /></button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {isAdding && (
          <AdminModal title={editingAct ? 'تعديل الفعالية' : 'إضافة فعالية'} onClose={() => setIsAdding(false)} isSubmitting={isSubmitting} lang={lang} onSave={handleSave}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input placeholder="العنوان بالعربي" className="glass-panel" style={{ width: '100%', padding: '0.8rem', color: 'white' }} value={formData.title_ar} onChange={e => setFormData({...formData, title_ar: e.target.value})} />
              <input placeholder="Title (EN)" className="glass-panel" style={{ width: '100%', padding: '0.8rem', color: 'white' }} value={formData.title_en} onChange={e => setFormData({...formData, title_en: e.target.value})} />
              <input type="date" className="glass-panel" style={{ width: '100%', padding: '0.8rem', color: 'white' }} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
              <select className="glass-panel" style={{ width: '100%', padding: '0.8rem', color: 'white', background: '#1a1a1a' }} value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})}>
                <option value="">{lang === 'ar' ? 'اختر النوع...' : 'Select Type...'}</option>
                <option value="هاكاثون">هاكاثون</option>
                <option value="ورشة عمل">ورشة عمل</option>
                <option value="مسابقة برمجية">مسابقة برمجية</option>
                <option value="ندوة">ندوة</option>
              </select>
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
        {selectedAct && <ActivityDetailModal act={selectedAct} onClose={() => setSelectedAct(null)} lang={lang} />}
      </AnimatePresence>
    </div>
  );
};

export default Events;
