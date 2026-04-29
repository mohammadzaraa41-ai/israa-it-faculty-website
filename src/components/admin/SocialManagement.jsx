import React, { useState } from 'react';
import { Plus, Trash2, Edit, AlertCircle, Info, Check, X } from 'lucide-react';

const SocialManagement = ({ 
  posts, pendingPosts, approvePost, rejectPost, deletePost, 
  announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement, 
  events, addEvent, deleteEvent, updateEvent, lang 
}) => {
  const [newAnn, setNewAnn] = useState({ ar: '', en: '', type: 'info' });
  const [newEvent, setNewEvent] = useState({ date: '', ar: '', en: '' });
  const [editingEvent, setEditingEvent] = useState(null);

  const handleAddAnn = (e) => {
    e.preventDefault();
    addAnnouncement({ text: { ar: newAnn.ar, en: newAnn.en }, type: newAnn.type });
    setNewAnn({ ar: '', en: '', type: 'info' });
  };

  const handleAddEvent = (e) => {
    e.preventDefault();
    if (editingEvent) {
      updateEvent({ id: editingEvent.id, date: newEvent.date, text: { ar: newEvent.ar, en: newEvent.en } });
      setEditingEvent(null);
    } else {
      addEvent({ date: newEvent.date, text: { ar: newEvent.ar, en: newEvent.en } });
    }
    setNewEvent({ date: '', ar: '', en: '' });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      {/* Announcements Management */}
      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h3 style={{ color: 'var(--primary-light)', fontSize: '1.5rem', margin: 0 }}>
            {lang === 'ar' ? 'إدارة الإعلانات العلوية' : 'Manage Top Announcements'}
          </h3>
        </div>
        
        {/* Add New Announcement Form */}
        <form onSubmit={handleAddAnn} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', border: '1px solid var(--primary-color)' }}>
          <input 
            required type="text" placeholder={lang === 'ar' ? 'نص الإعلان بالعربي' : 'Arabic Text'} 
            value={newAnn.ar} onChange={e => setNewAnn({...newAnn, ar: e.target.value})}
            style={{ flex: '1 1 300px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
          <input 
            required type="text" placeholder={lang === 'ar' ? 'نص الإعلان بالإنجليزي' : 'English Text'} 
            value={newAnn.en} onChange={e => setNewAnn({...newAnn, en: e.target.value})}
            style={{ flex: '1 1 300px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
          <select 
            value={newAnn.type} onChange={e => setNewAnn({...newAnn, type: e.target.value})}
            style={{ flex: '0 0 150px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
          </select>
          <button type="submit" className="btn-primary" style={{ flex: '0 0 100px' }}>
            <Plus size={18} /> {lang === 'ar' ? 'إضافة' : 'Add'}
          </button>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
          {(announcements || []).map((ann) => (
            <div key={ann.id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: ann.type === 'warning' ? '#e74c3c' : '#3498db' }}>
                  {ann.type === 'warning' ? <AlertCircle size={20} /> : <Info size={20} />}
                  <h4 style={{ margin: 0 }}>{lang === 'ar' ? `إعلان` : `Announcement`}</h4>
                </div>
                <button onClick={() => deleteAnnouncement(ann.id)} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <input 
                  type="text" value={ann.text?.ar || ''} 
                  onChange={(e) => updateAnnouncement(ann.id, e.target.value, 'ar')}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                />
                <input 
                  type="text" value={ann.text?.en || ''} 
                  onChange={(e) => updateAnnouncement(ann.id, e.target.value, 'en')}
                  style={{ width: '100%', padding: '0.6rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'rgba(255,255,255,0.05)', color: 'var(--text-primary)' }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Events Management */}
      <section>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)', fontSize: '1.5rem' }}>
          {lang === 'ar' ? 'إدارة الأحداث القادمة' : 'Manage Upcoming Events'}
        </h3>
        
        <form onSubmit={handleAddEvent} className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem', display: 'flex', flexWrap: 'wrap', gap: '1rem', border: '1px solid var(--primary-color)' }}>
          <input 
            required type="text" placeholder={lang === 'ar' ? 'التاريخ (مثلاً: 28 APR)' : 'Date (e.g. 28 APR)'} 
            value={newEvent.date} onChange={e => setNewEvent({...newEvent, date: e.target.value})}
            style={{ flex: '0 0 150px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
          <input 
            required type="text" placeholder={lang === 'ar' ? 'الحدث بالعربي' : 'Event in Arabic'} 
            value={newEvent.ar} onChange={e => setNewEvent({...newEvent, ar: e.target.value})}
            style={{ flex: '1 1 250px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
          <input 
            required type="text" placeholder={lang === 'ar' ? 'الحدث بالإنجليزي' : 'Event in English'} 
            value={newEvent.en} onChange={e => setNewEvent({...newEvent, en: e.target.value})}
            style={{ flex: '1 1 250px', padding: '0.8rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'var(--bg-color)', color: 'var(--text-primary)' }}
          />
          <button type="submit" className="btn-primary" style={{ flex: '0 0 120px' }}>
            {editingEvent ? <Check size={18} /> : <Plus size={18} />}
            {editingEvent ? (lang === 'ar' ? 'تحديث' : 'Update') : (lang === 'ar' ? 'إضافة' : 'Add')}
          </button>
        </form>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {(events || []).map((event) => (
            <div key={event.id} className="glass-panel" style={{ padding: '1rem', border: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <span style={{ color: 'var(--primary-color)', fontWeight: 'bold' }}>{event.date}</span>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-primary)' }}>{event.text?.[lang] || event.text?.ar || ''}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={() => { setEditingEvent(event); setNewEvent({ date: event.date, ar: event.text?.ar || '', en: event.text?.en || '' }); }} style={{ color: '#f1c40f', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Edit size={18} />
                </button>
                <button onClick={() => deleteEvent(event.id)} style={{ color: '#e74c3c', background: 'none', border: 'none', cursor: 'pointer' }}>
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Pending Posts Management */}
      <section>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)', fontSize: '1.5rem' }}>
          {lang === 'ar' ? 'منشورات الطلاب المعلقة' : 'Pending Student Posts'}
        </h3>
        {(!pendingPosts || pendingPosts.length === 0) ? (
          <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <p style={{ color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'لا يوجد منشورات تنتظر الموافقة' : 'No posts awaiting approval.'}</p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))', gap: '1.5rem' }}>
            {pendingPosts.map((post) => (
              <div key={post.id} className="glass-panel" style={{ padding: '1.5rem', border: '1px solid var(--border-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>{post.author?.name || 'Unknown'}</h4>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>{post.date}</span>
                  </div>
                </div>
                <p style={{ color: 'var(--text-primary)', marginBottom: '1.5rem' }}>{post.content}</p>
                {post.image && <img src={post.image} alt="Post Attachment" style={{ width: '100%', borderRadius: '8px', marginBottom: '1rem' }} />}
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button 
                    onClick={() => approvePost(post.id)}
                    style={{ flex: 1, padding: '0.6rem', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <Check size={18} /> {lang === 'ar' ? 'موافقة' : 'Approve'}
                  </button>
                  <button 
                    onClick={() => rejectPost(post.id)}
                    style={{ flex: 1, padding: '0.6rem', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
                  >
                    <X size={18} /> {lang === 'ar' ? 'رفض' : 'Reject'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Published Posts Management */}
      <section>
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-light)', fontSize: '1.5rem' }}>
          {lang === 'ar' ? 'المنشورات المنشورة' : 'Published Posts'}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {(posts || []).map((post) => (
            <div key={post.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1rem 1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
              <div>
                <h4 style={{ margin: 0, color: 'var(--text-primary)', fontSize: '1rem' }}>{post.author?.name || 'Unknown'} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 'normal' }}>({post.author?.role})</span></h4>
                <p style={{ margin: '0.25rem 0 0 0', color: 'var(--text-secondary)', fontSize: '0.9rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '600px' }}>{post.content}</p>
              </div>
              <button 
                onClick={() => deletePost(post.id)}
                style={{ background: 'transparent', border: '1px solid #e74c3c', color: '#e74c3c', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SocialManagement;
