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
  Check, 
  Trophy, 
  Clock, 
  ExternalLink,
  Presentation,
  Layout,
  Type
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
  const { lang, t } = useLocale();
  const { user } = useAuth();
  const { events, addEvent, deleteEvent, updateEvent } = useAdmin();
  const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);

  const [isAdding, setIsAdding] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    title_ar: '',
    title_en: '',
    text: { ar: '', en: '' },
    date: new Date().toISOString().split('T')[0],
    tag: ''
  });

  const handleOpenAdd = () => {
    setFormData({
      title_ar: '',
      title_en: '',
      text: { ar: '', en: '' },
      date: new Date().toISOString().split('T')[0],
      tag: ''
    });
    setEditingEvent(null);
    setIsAdding(true);
  };

  const handleOpenEdit = (ev, e) => {
    e.stopPropagation();
    setFormData({
      title_ar: ev.title_ar || '',
      title_en: ev.title_en || '',
      text: typeof ev.text === 'object' ? ev.text : { ar: ev.text || '', en: ev.text || '' },
      date: ev.date || '',
      tag: ev.tag || ''
    });
    setEditingEvent(ev);
    setIsAdding(true);
  };

  const handleSave = async () => {
    if (!formData.title_ar || !formData.date) {
      alert(lang === 'ar' ? 'يرجى ملء الحقول الأساسية' : 'Please fill basic fields');
      return;
    }
    
    setIsSubmitting(true);
    try {
      const eventPayload = {
        ...formData,
        text: formData.text // This will be handled by Context (text_ar, text_en fallbacks)
      };

      if (editingEvent) {
        await updateEvent({ ...eventPayload, id: editingEvent.id });
      } else {
        await addEvent(eventPayload);
      }
      setIsAdding(false);
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [events]);

  return (
    <div style={{ padding: '2rem 1rem 5rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <header style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
          {lang === 'ar' ? 'الفعاليات والهاكاثون' : 'Events & Hackathons'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '700px', margin: '0 auto' }}>
          {lang === 'ar' 
            ? 'ابقَ على اطلاع بأحدث الفعاليات، المسابقات البرمجية، والهاكاثونات التي تنظمها الكلية.' 
            : 'Stay updated with the latest events, coding competitions, and hackathons organized by our faculty.'}
        </p>
        
        {isAdmin && (
          <button onClick={handleOpenAdd} className="btn-primary" style={{ marginTop: '2.5rem', gap: '0.5rem', padding: '0.8rem 2rem' }}>
            <Plus size={20} /> {lang === 'ar' ? 'إضافة فعالية جديدة' : 'Add New Event'}
          </button>
        )}
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {sortedEvents.length > 0 ? (
          sortedEvents.map((ev, i) => {
            const title = ev.title_ar || ev.title_en ? (lang === 'ar' ? ev.title_ar : ev.title_en) : (ev.title || (typeof ev.text === 'object' ? ev.text[lang] : ev.text));
            const desc = typeof ev.text === 'object' ? ev.text[lang] : ev.text;
            const isHackathon = ev.tag?.toLowerCase().includes('hackathon') || ev.tag?.includes('هاكاثون');

            return (
              <motion.div 
                key={ev.id || i} 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="glass-panel" 
                style={{ 
                  padding: '2rem', 
                  position: 'relative',
                  display: 'flex',
                  flexDirection: 'column',
                  border: isHackathon ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                  boxShadow: isHackathon ? '0 0 15px rgba(220,179,36,0.1)' : 'none'
                }}
              >
                {ev.tag && (
                  <span style={{ 
                    background: isHackathon ? 'var(--accent-color)' : 'rgba(255,255,255,0.05)', 
                    color: isHackathon ? '#000' : 'var(--text-secondary)', 
                    padding: '0.3rem 1rem', 
                    borderRadius: '50px', 
                    fontSize: '0.75rem', 
                    fontWeight: 'bold', 
                    display: 'inline-block', 
                    marginBottom: '1.2rem',
                    width: 'fit-content'
                  }}>
                    {isHackathon && <Trophy size={12} style={{marginInlineEnd: '5px'}}/>}
                    {ev.tag}
                  </span>
                )}

                <h2 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '1rem', color: isHackathon ? 'var(--accent-color)' : 'var(--primary-color)' }}>
                  {title}
                </h2>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  <Calendar size={16} color="var(--accent-color)" />
                  <span>{ev.date}</span>
                </div>

                {desc && desc !== title && (
                  <p style={{ color: 'var(--text-primary)', marginBottom: '2.5rem', lineHeight: '1.7', fontSize: '0.95rem', opacity: 0.8 }}>
                    {desc}
                  </p>
                )}

                <div style={{ marginTop: 'auto', display: 'flex', gap: '0.8rem' }}>
                  <button className="btn-outline" style={{ flex: 1, fontSize: '0.85rem' }}>
                    {lang === 'ar' ? 'التفاصيل' : 'Details'}
                  </button>
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={(e) => handleOpenEdit(ev, e)} style={{ background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '8px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Edit2 size={16} />
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); deleteEvent(ev.id); }} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '8px', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            );
          })
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem' }}>
            <Calendar size={60} style={{ opacity: 0.1, marginBottom: '1.5rem' }} />
            <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>
              {lang === 'ar' ? 'لا توجد فعاليات قادمة حالياً.' : 'No upcoming events at the moment.'}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isAdding && (
          <AdminModal 
            title={editingEvent ? (lang === 'ar' ? 'تعديل فعالية' : 'Edit Event') : (lang === 'ar' ? 'إضافة فعالية جديدة' : 'Add New Event')} 
            onClose={() => setIsAdding(false)} 
            isSubmitting={isSubmitting} 
            lang={lang} 
            onSave={handleSave}
          >
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.4rem', display: 'block'}}>{lang === 'ar' ? 'العنوان بالعربي' : 'Title AR'}</label>
                  <input type="text" className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white' }} value={formData.title_ar} onChange={e => setFormData({...formData, title_ar: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.4rem', display: 'block'}}>{lang === 'ar' ? 'العنوان بالإنجليزي' : 'Title EN'}</label>
                  <input type="text" className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white' }} value={formData.title_en} onChange={e => setFormData({...formData, title_en: e.target.value})} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="input-group">
                  <label style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.4rem', display: 'block'}}>{lang === 'ar' ? 'التاريخ' : 'Date'}</label>
                  <input type="date" className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white' }} value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} required />
                </div>
                <div className="input-group">
                  <label style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.4rem', display: 'block'}}>{lang === 'ar' ? 'نوع الفعالية (تاغ)' : 'Event Tag'}</label>
                  <input type="text" placeholder="e.g. هاكاثون, Workshop" className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white' }} value={formData.tag} onChange={e => setFormData({...formData, tag: e.target.value})} />
                </div>
              </div>

              <div className="input-group">
                <label style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.4rem', display: 'block'}}>{lang === 'ar' ? 'الوصف بالعربي' : 'Description AR'}</label>
                <textarea className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white', minHeight: '100px' }} value={formData.text.ar} onChange={e => setFormData({...formData, text: {...formData.text, ar: e.target.value}})} />
              </div>

              <div className="input-group">
                <label style={{fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.4rem', display: 'block'}}>{lang === 'ar' ? 'الوصف بالإنجليزي' : 'Description EN'}</label>
                <textarea className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white', minHeight: '100px' }} value={formData.text.en} onChange={e => setFormData({...formData, text: {...formData.text, en: e.target.value}})} />
              </div>
            </form>
          </AdminModal>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
