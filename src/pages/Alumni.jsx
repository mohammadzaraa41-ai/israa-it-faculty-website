import React, { useState, useEffect, memo, useMemo } from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';

import { 
  FileText, 
  Briefcase, 
  CheckCircle, 
  Download, 
  ExternalLink, 
  ClipboardList, 
  Presentation,
  BookOpen,
  Trophy,
  Plus,
  Trash2,
  Edit2,
  Video,
  Link as LinkIcon,
  Star,
  FileUp,
  Eye,
  Lock,
  Clock,
  GraduationCap,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// --- Global Helpers ---
const getLoc = (item, prefix, lang) => {
  if (!item) return '';
  if (item[`${prefix}_${lang}`]) return item[`${prefix}_${lang}`];
  if (item[`${prefix}_ar`]) return item[`${prefix}_ar`];
  if (item[`${prefix}_en`]) return item[`${prefix}_en`];
  if (item[prefix] && typeof item[prefix] === 'object') return item[prefix][lang] || item[prefix].ar || item[prefix].en || '';
  if (item[prefix] && typeof item[prefix] === 'string') return item[prefix];
  return '';
};

const getArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
     try { const parsed = JSON.parse(val); return Array.isArray(parsed) ? parsed : [val]; } catch(e) { return [val]; }
  }
  return [];
};

// --- Memoized Components for Performance ---

const AdminModal = memo(({ title, onSave, onClose, isSubmitting, lang, children }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
      <button style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', color: '#ff4444', background: 'none', border: 'none', cursor: 'pointer' }} onClick={onClose}>✕</button>
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

const ProjectCard = memo(({ project, lang, isAdmin, onEdit, onDelete, onView }) => {
  const name = useMemo(() => getLoc(project, 'name', lang), [project, lang]);
  const studentsCount = useMemo(() => getArray(project.students).length, [project.students]);
  const imagesCount = useMemo(() => getArray(project.images).length, [project.images]);

  return (
    <motion.div 
      whileHover={{ y: -5, boxShadow: '0 10px 20px rgba(161, 23, 44, 0.15)' }}
      onClick={() => onView(project)}
      className="glass-panel"
      style={{ 
        padding: '1.5rem', 
        cursor: 'pointer', 
        background: 'rgba(255,255,255,0.03)',
        borderRadius: '16px',
        border: '1px solid var(--border-color)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <h4 style={{ fontWeight: 'bold', color: 'var(--accent-color)', fontSize: '1.1rem', lineHeight: '1.4' }}>
            {name}
          </h4>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem', background: 'rgba(255,255,255,0.05)', padding: '2px 8px', borderRadius: '20px' }}>
            <Star size={12} fill="var(--accent-color)" color="var(--accent-color)" />
            <span style={{ fontSize: '0.8rem', fontWeight: 'bold' }}>{project.rating}</span>
          </div>
        </div>
        <p style={{ fontSize: '0.85rem', opacity: 0.7, marginBottom: '1rem', borderLeft: '2px solid var(--accent-color)', paddingLeft: '8px' }}>
          {lang === 'ar' ? 'بإشراف:' : 'Supervisor:'} {project.supervisor}
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{studentsCount} {lang === 'ar' ? 'طلاب' : 'Students'}</span>
          <span style={{ fontSize: '0.7rem', opacity: 0.4 }}>•</span>
          <span style={{ fontSize: '0.7rem', opacity: 0.6 }}>{imagesCount} {lang === 'ar' ? 'صور' : 'Photos'}</span>
        </div>
        <button className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem', borderRadius: '8px' }}>
          {lang === 'ar' ? 'عرض التفاصيل' : 'View Details'}
        </button>
      </div>
      
      {isAdmin && (
        <div style={{ position: 'absolute', top: '-10px', left: '-10px', display: 'flex', gap: '0.3rem' }}>
          <button onClick={(e) => { e.stopPropagation(); onEdit(project); }} style={{ background: 'var(--primary-color)', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', cursor: 'pointer' }}>
            <Edit2 size={12} />
          </button>
          <button onClick={(e) => { e.stopPropagation(); onDelete(project.id); }} style={{ background: '#ff4444', color: 'white', border: 'none', borderRadius: '50%', width: '28px', height: '28px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgba(0,0,0,0.3)', cursor: 'pointer' }}>
            <Trash2 size={12} />
          </button>
        </div>
      )}
    </motion.div>
  );
});

const SectionTitle = ({ title, icon: Icon }) => (
  <h3 style={{ 
    display: 'flex', 
    alignItems: 'center', 
    gap: '0.75rem', 
    fontSize: '1.4rem', 
    fontWeight: 'bold', 
    marginBottom: '1.25rem', 
    color: 'var(--accent-color)' 
  }}>
    <Icon size={24} />
    {title}
  </h3>
);

const AdminControl = ({ onAdd, label, icon: Icon = Plus, isAdmin }) => {
  if (!isAdmin) return null;
  return (
    <button onClick={onAdd} className="btn-primary" style={{ 
      padding: '0.5rem 1rem', 
      fontSize: '0.8rem', 
      marginBottom: '1rem',
      width: 'fit-content',
      gap: '0.5rem'
    }}>
      <Icon size={16} /> {label}
    </button>
  );
};

const ProjectSection = memo(({ isAdmin, lang, projectBank, addProject, deleteProject, editProject }) => {
  const [viewingProject, setViewingProject] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const projectFilesRef = React.useRef(null);
  const projectImagesRef = React.useRef(null);

  const [newProj, setNewProj] = useState({
    name: { ar: '', en: '' },
    students: ['', '', '', '', ''],
    supervisor: '',
    link: '',
    rating: 0,
    description: { ar: '', en: '' },
    notes: { ar: '', en: '' },
    files: [],
    images: []
  });

  const handleViewFile = (url) => window.open(url, '_blank', 'noopener,noreferrer');

  const handleDownload = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = filename || 'download';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      window.open(url, '_blank');
    }
  };

  const handleProjectFilesChange = (e) => {
    const selectedFiles = Array.from(e.target.files).slice(0, 7);
    const fileObjects = selectedFiles.map(f => ({ 
      name: f.name, 
      type: f.name.split('.').pop(),
      url: URL.createObjectURL(f),
      fileObject: f
    }));
    setNewProj(prev => ({ ...prev, files: [...prev.files, ...fileObjects].slice(0, 7) }));
  };

  const handleProjectImagesChange = (e) => {
    const selectedImages = Array.from(e.target.files).slice(0, 50);
    const imageObjects = selectedImages.map(img => ({ 
      url: URL.createObjectURL(img),
      fileObject: img
    }));
    setNewProj(prev => ({ ...prev, images: [...prev.images, ...imageObjects].slice(0, 50) }));
  };

  const handleAddProjectClick = async (e) => {
    e.preventDefault();
    if (!getLoc(newProj, 'name', lang) || !newProj.supervisor || newProj.rating === 0) {
      alert(lang === 'ar' ? 'يرجى ملء الحقول الإجبارية' : 'Please fill mandatory fields');
      return;
    }
    setIsSubmitting(true);
    const projectData = { ...newProj, students: newProj.students.filter(s => s && s.trim() !== '') };
    try {
      if (editingProjectId) await editProject({ ...projectData, id: editingProjectId });
      else await addProject(projectData);
      setIsAdding(false);
      setEditingProjectId(null);
      setNewProj({ name: { ar: '', en: '' }, students: ['', '', '', '', ''], supervisor: '', link: '', rating: 0, description: { ar: '', en: '' }, notes: { ar: '', en: '' }, files: [], images: [] });
    } catch (err) {
      console.error("Save error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (project) => {
    setNewProj({
      ...project,
      name: { ar: project.name_ar || project.name?.ar || '', en: project.name_en || project.name?.en || '' },
      description: { ar: project.description_ar || '', en: project.description_en || '' },
      notes: { ar: project.notes_ar || project.notes?.ar || '', en: project.notes_en || project.notes?.en || '' },
      students: [...getArray(project.students), '', '', '', '', ''].slice(0, 5),
      files: getArray(project.files),
      images: getArray(project.images)
    });
    setEditingProjectId(project.id);
    setIsAdding(true);
  };

  if (viewingProject) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <button className="btn-outline" style={{ marginBottom: '2rem', padding: '0.5rem 1rem' }} onClick={() => setViewingProject(null)}>
          ← {lang === 'ar' ? 'العودة لمشاريع التخرج' : 'Back to Graduation Projects'}
        </button>
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>{getLoc(viewingProject, 'name', lang)}</h2>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Star key={star} size={20} fill={star <= viewingProject.rating ? 'var(--accent-color)' : 'transparent'} color="var(--accent-color)" />
                ))}
                <span style={{ fontWeight: 'bold', marginLeft: '0.5rem' }}>{viewingProject.rating}</span>
              </div>
            </div>
            {viewingProject.link && (
              <a href={viewingProject.link} target="_blank" rel="noopener noreferrer" className="btn-primary">
                <ExternalLink size={18} /> {lang === 'ar' ? 'رابط المشروع' : 'Project Link'}
              </a>
            )}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                {lang === 'ar' ? 'فريق العمل' : 'Project Team'}
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.9rem', marginBottom: '0.5rem' }}><strong>{lang === 'ar' ? 'المشرف:' : 'Supervisor:'}</strong> {viewingProject.supervisor || 'غير محدد'}</div>
                {getArray(viewingProject.students).map((s, i) => (
                  <div key={i} style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <CheckCircle size={14} color="#2ecc71" /> {typeof s === 'string' ? s : (s.name || JSON.stringify(s))}
                  </div>
                ))}
              </div>
            </div>
            {getArray(viewingProject.files).length > 0 && (
              <div>
                <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  {lang === 'ar' ? 'ملفات المشروع' : 'Project Files'}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {getArray(viewingProject.files).map((file, i) => (
                    <div key={i} className="glass-panel" style={{ padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(255,255,255,0.02)' }}>
                       <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem' }}>
                          <FileText size={16} color="var(--accent-color)" />
                          <span>{file.name || 'ملف'}</span>
                       </div>
                       <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }} onClick={() => handleViewFile(file.url)}><Eye size={12} /> {lang === 'ar' ? 'عرض' : 'View'}</button>
                          <button className="btn-outline" style={{ padding: '0.3rem 0.6rem', fontSize: '0.7rem' }} onClick={() => handleDownload(file.url, file.name)}><Download size={12} /> {lang === 'ar' ? 'تنزيل' : 'Download'}</button>
                       </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {getArray(viewingProject.images).length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <SectionTitle title={lang === 'ar' ? 'معرض صور المشروع' : 'Project Gallery'} icon={Trophy} />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '1rem' }}>
                {getArray(viewingProject.images).map((img, i) => (
                  <motion.img key={i} src={typeof img === 'string' ? img : img.url} whileHover={{ scale: 1.05 }} onClick={() => setActiveImageIndex(i)} style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: '12px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.1)' }} alt="" />
                ))}
              </div>
            </div>
          )}

          {(viewingProject.description_ar || viewingProject.description_en) && (
            <div style={{ marginTop: '2rem', padding: '1.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <h4 style={{ color: 'var(--accent-color)', fontWeight: 'bold', marginBottom: '1rem' }}>{lang === 'ar' ? 'وصف المشروع' : 'Project Description'}</h4>
              <p style={{ fontSize: '1rem', opacity: 0.9, lineHeight: '1.8', whiteSpace: 'pre-wrap' }}>{lang === 'ar' ? viewingProject.description_ar : viewingProject.description_en}</p>
            </div>
          )}
        </div>

        <AnimatePresence>
          {activeImageIndex !== null && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setActiveImageIndex(null)}>
              <button style={{ position: 'absolute', top: '2rem', right: '2rem', color: 'white', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer' }}>✕</button>
              <div style={{ position: 'relative', width: '100%', maxWidth: '1000px', height: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev > 0 ? prev - 1 : getArray(viewingProject.images).length - 1)); }} style={{ position: 'absolute', left: '-5rem', color: 'white', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer' }}>‹</button>
                <motion.img key={activeImageIndex} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} src={typeof getArray(viewingProject.images)[activeImageIndex] === 'string' ? getArray(viewingProject.images)[activeImageIndex] : getArray(viewingProject.images)[activeImageIndex].url} style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain', borderRadius: '8px' }} />
                <button onClick={(e) => { e.stopPropagation(); setActiveImageIndex(prev => (prev < getArray(viewingProject.images).length - 1 ? prev + 1 : 0)); }} style={{ position: 'absolute', right: '-5rem', color: 'white', background: 'rgba(255,255,255,0.1)', border: 'none', borderRadius: '50%', width: '50px', height: '50px', cursor: 'pointer' }}>›</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <SectionTitle title={lang === 'ar' ? 'بنك المشاريع المتميزة' : 'Excellence Project Bank'} icon={Trophy} />
        <AdminControl isAdmin={isAdmin} label={lang === 'ar' ? 'جديد' : 'New'} onAdd={() => { setEditingProjectId(null); setIsAdding(true); }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {projectBank.map(project => (
          <ProjectCard key={project.id} project={project} lang={lang} isAdmin={isAdmin} onEdit={handleEdit} onDelete={deleteProject} onView={setViewingProject} />
        ))}
      </div>
      <AnimatePresence>
        {isAdding && (
          <AdminModal title={editingProjectId ? (lang === 'ar' ? 'تعديل مشروع' : 'Edit Project') : (lang === 'ar' ? 'إضافة مشروع تخرج جديد' : 'Add New Graduation Project')} onClose={() => setIsAdding(false)} isSubmitting={isSubmitting} lang={lang} onSave={handleAddProjectClick}>
            <form style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem', maxHeight: '70vh', overflowY: 'auto', padding: '0.5rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <input type="text" placeholder={lang === 'ar' ? 'اسم المشروع بالعربي' : 'Project Name AR'} className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white' }} value={newProj.name.ar} onChange={e => setNewProj({...newProj, name: {...newProj.name, ar: e.target.value}})} required />
                <input type="text" placeholder={lang === 'ar' ? 'اسم المشروع بالإنجليزي' : 'Project Name EN'} className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white' }} value={newProj.name.en} onChange={e => setNewProj({...newProj, name: {...newProj.name, en: e.target.value}})} required />
              </div>
              <input type="text" placeholder={lang === 'ar' ? 'اسم المشرف' : 'Supervisor Name'} className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white' }} value={newProj.supervisor} onChange={e => setNewProj({...newProj, supervisor: e.target.value})} required />
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem' }}>
                {newProj.students.map((s, i) => (
                  <input key={i} type="text" placeholder={`${lang === 'ar' ? 'طالب' : 'Student'} ${i+1}`} className="glass-panel" style={{ width: '100%', padding: '0.5rem', fontSize: '0.8rem', color: 'white' }} value={s} onChange={e => { const u = [...newProj.students]; u[i] = e.target.value; setNewProj({...newProj, students: u}); }} />
                ))}
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                 <button type="button" onClick={() => projectFilesRef.current?.click()} className="btn-outline" style={{ flex: 1, fontSize: '0.8rem' }}><FileUp size={14}/> {lang === 'ar' ? 'إضافة ملفات' : 'Add Files'} ({newProj.files.length})</button>
                 <button type="button" onClick={() => projectImagesRef.current?.click()} className="btn-outline" style={{ flex: 1, fontSize: '0.8rem' }}><Plus size={14}/> {lang === 'ar' ? 'إضافة صور' : 'Add Images'} ({newProj.images.length})</button>
                 <input type="file" multiple ref={projectFilesRef} hidden onChange={handleProjectFilesChange} />
                 <input type="file" multiple ref={projectImagesRef} hidden onChange={handleProjectImagesChange} />
              </div>
              <textarea placeholder={lang === 'ar' ? 'وصف المشروع' : 'Project Description'} className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white', minHeight: '80px' }} value={newProj.description.ar} onChange={e => setNewProj({...newProj, description: {...newProj.description, ar: e.target.value}})} />
            </form>
          </AdminModal>
        )}
      </AnimatePresence>
    </div>
  );
});

const CareerSection = memo(({ 
  isAdmin, lang, cvTemplates, interviewResources, linkedinTips, 
  deleteCvTemplate, deleteInterviewResource, deleteLinkedinTip,
  handleViewFile, handleDownload, handleAddCvTemplate,
  setModalData, setActiveModal 
}) => {
  const [selectedCv, setSelectedCv] = useState(null);

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
        
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <SectionTitle title={lang === 'ar' ? 'السيرة الذاتية' : 'CV Builder'} icon={FileText} />
          <AdminControl isAdmin={isAdmin} label={lang === 'ar' ? 'إضافة قالب من الجهاز' : 'Add Template from Device'} onAdd={handleAddCvTemplate} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {cvTemplates.map(cv => (
              <div key={cv.id} onClick={() => setSelectedCv(cv)} className="glass-panel" style={{ cursor: 'pointer', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><FileText size={16} color="var(--accent-color)" /><span>{getLoc(cv, 'name', lang)}</span></div>
                {isAdmin && (
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <Edit2 size={16} color="var(--primary-light)" onClick={(e) => { e.stopPropagation(); setModalData({ ...cv, nameAr: cv.name_ar, nameEn: cv.name_en }); setActiveModal('cv'); }} />
                    <Trash2 size={16} color="#ff4444" onClick={(e) => { e.stopPropagation(); deleteCvTemplate(cv.id); }} />
                  </div>
                )}
              </div>
            ))}
          </div>
          <AnimatePresence>
            {selectedCv && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn-outline" onClick={() => handleViewFile(selectedCv.url)}>{lang === 'ar' ? 'عرض' : 'View'}</button>
                  <button className="btn-outline" onClick={() => handleDownload(selectedCv.url, getLoc(selectedCv, 'name', lang))}>{lang === 'ar' ? 'تحميل' : 'Download'}</button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <SectionTitle title={lang === 'ar' ? 'المقابلات' : 'Interviews'} icon={Video} />
          <AdminControl isAdmin={isAdmin} label={lang === 'ar' ? 'إضافة فيديو/أسئلة' : 'Add Video/Questions'} onAdd={() => { setModalData({ titleAr: '', titleEn: '', type: 'video', url: 'https://' }); setActiveModal('interview'); }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {interviewResources.map(res => (
              <div key={res.id} className="glass-panel" style={{ padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{getLoc(res, 'title', lang)}</span>
                  {isAdmin && <Trash2 size={16} color="#ff4444" onClick={() => deleteInterviewResource(res.id)} />}
                </div>
                <button onClick={() => window.open(res.url, '_blank')} className="btn-outline" style={{ width: '100%', fontSize: '0.75rem' }}>{lang === 'ar' ? 'فتح المورد' : 'Open Resource'}</button>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <SectionTitle title="LinkedIn" icon={ExternalLink} />
          <AdminControl isAdmin={isAdmin} label={lang === 'ar' ? 'إضافة نصيحة/فيديو' : 'Add Tip/Video'} onAdd={() => { setModalData({ titleAr: '', titleEn: '', type: 'tip', content: '', url: 'https://' }); setActiveModal('linkedin'); }} />
          {linkedinTips.map(tip => (
            <div key={tip.id} className="glass-panel" style={{ padding: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{getLoc(tip, 'title', lang)}</span>
                {isAdmin && <Trash2 size={16} color="#ff4444" onClick={() => deleteLinkedinTip(tip.id)} />}
              </div>
              <p style={{ fontSize: '0.8rem', opacity: 0.8 }}>{tip.content || tip.url}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
});

const ChecklistSection = memo(({ lang }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ maxWidth: '700px', margin: '0 auto' }}>
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <SectionTitle title={lang === 'ar' ? 'الخطوات النهائية' : 'Final Steps'} icon={ClipboardList} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {[
          { t: lang === 'ar' ? 'امتحان الكفاءة الوطني' : 'National Exit Exam', done: true },
          { t: lang === 'ar' ? 'رفع مشروع التخرج' : 'Upload final GP', done: false },
          { t: lang === 'ar' ? 'براءة الذمة الإلكترونية' : 'Electronic Clearance', done: false },
          { t: lang === 'ar' ? 'تحديث البيانات' : 'Update your info', done: false },
        ].map((item, i) => (
          <div key={i} className="glass-panel" style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem' }}>
            <div style={{ width: '20px', height: '20px', borderRadius: '50%', border: '2px solid', borderColor: item.done ? '#2ecc71' : 'rgba(255,255,255,0.2)', backgroundColor: item.done ? '#2ecc71' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{item.done && <CheckCircle size={12} color="white" />}</div>
            <span style={{ fontSize: '0.95rem', color: item.done ? 'var(--text-secondary)' : 'inherit' }}>{item.t}</span>
          </div>
        ))}
      </div>
    </div>
  </motion.div>
));

const Alumni = () => {
  const { lang } = useLocale();
  const { user, submitAlumniRequest, alumniRequests, toggleLogin } = useAuth();
  const { 
    projectBank, addProject, deleteProject, editProject,
    cvTemplates, addCvTemplate, deleteCvTemplate, editCvTemplate,
    interviewResources, addInterviewResource, deleteInterviewResource, editInterviewResource,
    linkedinTips, addLinkedinTip, deleteLinkedinTip, editLinkedinTip,
    gradTemplates, addGradTemplate, deleteGradTemplate, editGradTemplate
  } = useAdmin();

  const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);
  const isAuthenticated = !!user;
  const isApprovedAlumni = user?.is_alumni || user?.isAlumni || isAdmin;
  const myAlumniRequest = alumniRequests?.find(r => r.userId === user?.id);
  const [activeTab, setActiveTab] = useState('projects');
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState({});
  const [requestForm, setRequestForm] = useState({ hours: '', scheduleImage: null });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestSent, setRequestSent] = useState(false);
  const fileInputRef = React.useRef(null);
  const cvFileInputRef = React.useRef(null);
  const scheduleRef = React.useRef(null);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const result = await submitAlumniRequest(user.id, { hours: requestForm.hours, scheduleImage: requestForm.scheduleImage, imageFile: requestForm.imageFile });
    setIsSubmitting(false);
    if (result?.success) setRequestSent(true);
  };

  const handleViewFile = (url) => url && window.open(url, '_blank');

  const handleDownload = async (url, fileName) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (e) { window.open(url, '_blank'); }
  };

  if (!isAuthenticated) return (
    <div style={{ textAlign: 'center', padding: '5rem 2rem' }}>
      <Lock size={80} style={{ marginBottom: '2rem', opacity: 0.5 }}/>
      <h2>{lang === 'ar' ? 'بوابة المتوقع تخرجهم مغلقة' : 'Graduation Portal Closed'}</h2>
      <button className="btn-primary" onClick={() => toggleLogin(true)} style={{ marginTop: '2rem' }}>{lang === 'ar' ? 'تسجيل الدخول' : 'Login'}</button>
    </div>
  );

  if (!isApprovedAlumni) return (
    <div style={{ maxWidth: '600px', margin: '4rem auto' }} className="glass-panel">
      {requestSent || myAlumniRequest ? (
         <div style={{ textAlign: 'center', padding: '2rem' }}><Clock size={60} style={{ marginBottom: '1rem' }}/><h3>{lang === 'ar' ? 'طلبك قيد المراجعة' : 'Under Review'}</h3></div>
      ) : (
        <form onSubmit={handleRequestSubmit} style={{ padding: '2rem' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>{lang === 'ar' ? 'تفعيل بوابة المتوقع تخرجهم' : 'Activate Graduation Portal'}</h2>
          <input type="number" placeholder={lang === 'ar' ? 'عدد الساعات المقطوعة' : 'Completed Hours'} required className="glass-panel" style={{ width: '100%', padding: '1rem', marginBottom: '1.5rem', color: 'white' }} value={requestForm.hours} onChange={e => setRequestForm({...requestForm, hours: e.target.value})}/>
          <div onClick={() => scheduleRef.current.click()} style={{ border: '2px dashed #444', padding: '2rem', textAlign: 'center', cursor: 'pointer', borderRadius: '15px' }}>
            {requestForm.scheduleImage ? (lang === 'ar' ? 'تم اختيار الصورة ✅' : 'Selected ✅') : (lang === 'ar' ? 'اضغط لرفع صورة الجدول' : 'Upload Schedule Image')}
            <input type="file" ref={scheduleRef} hidden onChange={e => setRequestForm({...requestForm, scheduleImage: URL.createObjectURL(e.target.files[0]), imageFile: e.target.files[0]})} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '2rem' }}>{lang === 'ar' ? 'إرسال الطلب' : 'Submit Request'}</button>
        </form>
      )}
    </div>
  );

  const tabs = [
    { id: 'projects', label: lang === 'ar' ? 'مشاريع التخرج' : 'Graduation Projects', icon: Presentation },
    { id: 'career', label: lang === 'ar' ? 'التأهيل المهني' : 'Career Readiness', icon: Briefcase },
    { id: 'checklist', label: lang === 'ar' ? 'خطوات التخرج' : 'Graduation Steps', icon: ClipboardList },
  ];

  return (
    <div style={{ padding: '1rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto' }}>
      <AnimatePresence>
        {activeModal && (
          <AdminModal lang={lang} isSubmitting={isSubmitting} onClose={() => setActiveModal(null)} title={
              activeModal === 'cv' ? (lang === 'ar' ? 'قالب السيرة الذاتية' : 'CV Template') :
              activeModal === 'interview' ? (lang === 'ar' ? 'إضافة مقابلة' : 'Add Interview') :
              (lang === 'ar' ? 'LinkedIn نصيحة' : 'LinkedIn Tip')
          } onSave={async () => {
              setIsSubmitting(true);
              try {
                if (activeModal === 'cv') {
                  if (modalData.id) await editCvTemplate(modalData.id, modalData.nameAr, lang);
                  else await addCvTemplate({ name: { ar: modalData.nameAr, en: modalData.nameEn }, file: modalData.file.name, url: URL.createObjectURL(modalData.file), fileObject: modalData.file });
                } else if (activeModal === 'interview') {
                  await addInterviewResource({ title: { ar: modalData.titleAr, en: modalData.titleEn }, type: modalData.type, url: modalData.url });
                } else if (activeModal === 'linkedin') {
                  await addLinkedinTip({ title: { ar: modalData.titleAr, en: modalData.titleEn }, type: modalData.type, content: modalData.content, url: modalData.url });
                }
                setActiveModal(null); setModalData({});
              } catch (e) { alert('Save failed'); } finally { setIsSubmitting(false); }
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder={lang === 'ar' ? 'العنوان بالعربي' : 'Title AR'} className="glass-panel" style={{ width: '100%', padding: '0.8rem', color: 'white' }} value={modalData.titleAr || modalData.nameAr || ''} onChange={e => setModalData({...modalData, titleAr: e.target.value, nameAr: e.target.value})} />
              <input type="text" placeholder={lang === 'ar' ? 'العنوان بالإنجليزي' : 'Title EN'} className="glass-panel" style={{ width: '100%', padding: '0.8rem', color: 'white' }} value={modalData.titleEn || modalData.nameEn || ''} onChange={e => setModalData({...modalData, titleEn: e.target.value, nameEn: e.target.value})} />
              {activeModal === 'linkedin' && <textarea placeholder={lang === 'ar' ? 'محتوى النصيحة' : 'Tip Content'} className="glass-panel" style={{ width: '100%', padding: '0.8rem', color: 'white', minHeight: '100px' }} value={modalData.content || ''} onChange={e => setModalData({...modalData, content: e.target.value})} />}
              <input type="url" placeholder={lang === 'ar' ? 'الرابط URL' : 'Link URL'} className="glass-panel" style={{ width: '100%', padding: '0.8rem', color: 'white' }} value={modalData.url || ''} onChange={e => setModalData({...modalData, url: e.target.value})} />
            </div>
          </AdminModal>
        )}
      </AnimatePresence>

      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="title" style={{ fontSize: '2.5rem', color: 'var(--primary-color)' }}>{lang === 'ar' ? 'بوابة المتوقع تخرجهم' : 'Graduation Portal'}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>{lang === 'ar' ? 'خطواتك الأخيرة نحو التخرج وسوق العمل.' : 'Your final steps towards graduation and career.'}</p>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', marginBottom: '2.5rem', background: 'rgba(255,255,255,0.02)', padding: '0.5rem', borderRadius: '15px', width: 'fit-content', margin: '0 auto 2.5rem' }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '0.6rem 1.2rem', borderRadius: '10px', border: 'none', background: activeTab === tab.id ? 'var(--accent-color)' : 'transparent', color: activeTab === tab.id ? '#000' : '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}><tab.icon size={18}/>{tab.label}</button>
        ))}
      </div>

      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'projects' && <ProjectSection key="p" isAdmin={isAdmin} lang={lang} projectBank={projectBank} addProject={addProject} deleteProject={deleteProject} editProject={editProject} />}
          {activeTab === 'career' && <CareerSection key="c" isAdmin={isAdmin} lang={lang} cvTemplates={cvTemplates} interviewResources={interviewResources} linkedinTips={linkedinTips} deleteCvTemplate={deleteCvTemplate} deleteInterviewResource={deleteInterviewResource} deleteLinkedinTip={deleteLinkedinTip} handleViewFile={handleViewFile} handleDownload={handleDownload} handleAddCvTemplate={() => cvFileInputRef.current?.click()} setModalData={setModalData} setActiveModal={setActiveModal} />}
          {activeTab === 'checklist' && <ChecklistSection key="chk" lang={lang} />}
        </AnimatePresence>
      </main>

      <input type="file" ref={cvFileInputRef} hidden onChange={e => { const f = e.target.files[0]; if(f) { setModalData({ file: f, nameAr: f.name, nameEn: f.name }); setActiveModal('cv'); } }} />
    </div>
  );
};

export default Alumni;
