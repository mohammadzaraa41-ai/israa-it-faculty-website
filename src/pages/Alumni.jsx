import React, { useState, useEffect } from 'react';
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

// --- Global Sub-Components (Outside to prevent re-renders focus loss) ---

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

const AdminControl = ({ isAdmin, onAdd, label, icon: Icon = Plus }) => {
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

const AdminModal = ({ title, onSave, onClose, isSubmitting, lang, children }) => (
  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
    <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
      <button style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', color: '#ff4444' }} onClick={onClose}>✕</button>
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
);

const ProjectSection = ({ 
  lang, isAdmin, projectBank, addProject, deleteProject, editProject, getLoc, getArray, handleViewFile, handleDownload 
}) => {
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
    if (!getLoc(newProj, 'name') || !newProj.supervisor || newProj.rating === 0) {
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
    } finally { setIsSubmitting(false); }
  };

  if (viewingProject) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
        <button className="btn-outline" style={{ marginBottom: '2rem', padding: '0.5rem 1rem' }} onClick={() => setViewingProject(null)}>
          ← {lang === 'ar' ? 'العودة للمشاريع' : 'Back to Projects'}
        </button>
        <div className="glass-panel" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
            <div>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>{getLoc(viewingProject, 'name')}</h2>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {[1, 2, 3, 4, 5].map(s => <Star key={s} size={20} fill={s <= viewingProject.rating ? 'var(--accent-color)' : 'none'} color="var(--accent-color)" />)}
                <span style={{ fontWeight: 'bold', marginLeft: '0.5rem' }}>{viewingProject.rating}</span>
              </div>
            </div>
            {viewingProject.link && <a href={viewingProject.link} target="_blank" className="btn-primary"><ExternalLink size={18} /> {lang === 'ar' ? 'رابط المشروع' : 'Project Link'}</a>}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
            <div>
              <h4 style={{ fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{lang === 'ar' ? 'فريق العمل' : 'Project Team'}</h4>
              <p><strong>{lang === 'ar' ? 'المشرف:' : 'Supervisor:'}</strong> {viewingProject.supervisor}</p>
              {getArray(viewingProject.students).map((s, i) => <div key={i}><CheckCircle size={14} color="#2ecc71" /> {typeof s === 'string' ? s : s.name}</div>)}
            </div>
            {getArray(viewingProject.files).length > 0 && (
              <div>
                <h4 style={{ fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{lang === 'ar' ? 'الملفات' : 'Files'}</h4>
                {getArray(viewingProject.files).map((f, i) => (
                  <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <button className="btn-outline" onClick={() => handleViewFile(f.url)}><Eye size={12} /> {lang === 'ar' ? 'عرض' : 'View'}</button>
                    <button className="btn-outline" onClick={() => handleDownload(f.url, f.name)}><Download size={12} /> {lang === 'ar' ? 'تنزيل' : 'Download'}</button>
                  </div>
                ))}
              </div>
            )}
          </div>
          {getArray(viewingProject.images).length > 0 && (
            <div style={{ marginTop: '2rem' }}>
              <h4 style={{ fontWeight: 'bold', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>{lang === 'ar' ? 'الصور' : 'Photos'}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                {getArray(viewingProject.images).map((img, i) => <img key={i} src={typeof img === 'string' ? img : img.url} style={{ width: '100%', borderRadius: '10px', cursor: 'pointer' }} onClick={() => setActiveImageIndex(i)} />)}
              </div>
            </div>
          )}
        </div>
        <AnimatePresence>
          {activeImageIndex !== null && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setActiveImageIndex(null)}>
              <img src={typeof getArray(viewingProject.images)[activeImageIndex] === 'string' ? getArray(viewingProject.images)[activeImageIndex] : getArray(viewingProject.images)[activeImageIndex].url} style={{ maxWidth: '90%', maxHeight: '90%' }} />
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  return (
    <div className="glass-panel" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '2rem' }}>
        <SectionTitle title={lang === 'ar' ? 'بنك المشاريع' : 'Project Bank'} icon={Trophy} />
        {isAdmin && <button className="btn-primary" onClick={() => { setEditingProjectId(null); setIsAdding(true); }}><Plus size={16} /> {lang === 'ar' ? 'جديد' : 'New'}</button>}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {projectBank.map(p => (
          <div key={p.id} className="glass-panel" style={{ padding: '1.5rem', cursor: 'pointer' }} onClick={() => setViewingProject(p)}>
            <h4>{getLoc(p, 'name')}</h4>
            <p>{p.supervisor}</p>
            {isAdmin && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                <Edit2 size={16} onClick={(e) => {
                  e.stopPropagation();
                  setEditingProjectId(p.id);
                  setNewProj({
                    ...p,
                    name: { ar: p.name_ar || '', en: p.name_en || '' },
                    description: { ar: p.description_ar || '', en: p.description_en || '' },
                    notes: { ar: p.notes_ar || '', en: p.notes_en || '' },
                    students: [...getArray(p.students), '', '', '', '', ''].slice(0, 5),
                    files: getArray(p.files),
                    images: getArray(p.images)
                  });
                  setIsAdding(true);
                }} />
                <Trash2 size={16} color="red" onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }} />
              </div>
            )}
          </div>
        ))}
      </div>
      <AnimatePresence>
        {isAdding && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="glass-panel" style={{ width: '800px', maxHeight: '90vh', overflow: 'auto', padding: '2rem' }}>
              <button onClick={() => setIsAdding(false)}>✕</button>
              <form onSubmit={handleAddProjectClick}>
                <input type="text" placeholder="Name AR" value={newProj.name.ar} onChange={e => setNewProj({...newProj, name: {...newProj.name, ar: e.target.value}})} required />
                <input type="text" placeholder="Name EN" value={newProj.name.en} onChange={e => setNewProj({...newProj, name: {...newProj.name, en: e.target.value}})} required />
                <input type="text" placeholder="Supervisor" value={newProj.supervisor} onChange={e => setNewProj({...newProj, supervisor: e.target.value})} required />
                <button type="submit" disabled={isSubmitting}>{isSubmitting ? '...' : 'Save'}</button>
              </form>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const CareerSection = ({ 
  lang, isAdmin, cvTemplates, interviewResources, linkedinTips, deleteCvTemplate, deleteInterviewResource, deleteLinkedinTip, setActiveModal, setModalData, getLoc, handleViewFile, handleDownload, handleAddCvTemplate 
}) => {
  const [selectedCv, setSelectedCv] = useState(null);
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <SectionTitle title={lang === 'ar' ? 'السيرة الذاتية' : 'CV Templates'} icon={FileText} />
        <AdminControl isAdmin={isAdmin} label={lang === 'ar' ? 'إضافة قالب' : 'Add Template'} onAdd={handleAddCvTemplate} />
        {cvTemplates.map(cv => (
          <div key={cv.id} className="glass-panel" style={{ padding: '1rem', marginBottom: '0.5rem', cursor: 'pointer' }} onClick={() => setSelectedCv(cv)}>
            <span>{getLoc(cv, 'name')}</span>
            {isAdmin && <Trash2 size={14} color="red" onClick={(e) => { e.stopPropagation(); deleteCvTemplate(cv.id); }} />}
          </div>
        ))}
        {selectedCv && (
           <div style={{ marginTop: '1rem', background: 'rgba(255,255,255,0.05)', padding: '1rem' }}>
              <button onClick={() => handleViewFile(selectedCv.url)}>View</button>
              <button onClick={() => handleDownload(selectedCv.url, selectedCv.name_ar + '.docx')}>Download</button>
           </div>
        )}
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <SectionTitle title={lang === 'ar' ? 'المقابلات' : 'Interviews'} icon={Video} />
        <AdminControl isAdmin={isAdmin} label={lang === 'ar' ? 'إضافة' : 'Add'} onAdd={() => { setModalData({ titleAr: '', titleEn: '', type: 'video', url: '' }); setActiveModal('interview'); }} />
        {interviewResources.map(res => (
          <div key={res.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem' }}>
            <span>{getLoc(res, 'title')}</span>
            <button onClick={() => window.open(res.url, '_blank')}>Open</button>
            {isAdmin && <Trash2 size={14} color="red" onClick={() => deleteInterviewResource(res.id)} />}
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <SectionTitle title="LinkedIn" icon={ExternalLink} />
        <AdminControl isAdmin={isAdmin} label={lang === 'ar' ? 'إضافة' : 'Add'} onAdd={() => { setModalData({ titleAr: '', titleEn: '', type: 'tip', content: '' }); setActiveModal('linkedin'); }} />
        {linkedinTips.map(tip => (
          <div key={tip.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.05)', marginBottom: '0.5rem' }}>
            <span>{getLoc(tip, 'title')}</span>
            <p>{tip.content}</p>
            {isAdmin && <Trash2 size={14} color="red" onClick={() => deleteLinkedinTip(tip.id)} />}
          </div>
        ))}
      </div>
    </div>
  );
};

const ChecklistSection = ({ lang }) => (
  <div className="glass-panel" style={{ padding: '2rem', maxWidth: '700px', margin: '0 auto' }}>
    <SectionTitle title={lang === 'ar' ? 'الخطوات النهائية' : 'Final Steps'} icon={ClipboardList} />
    {[
      { ar: 'امتحان الكفاءة', en: 'National Exam', done: true },
      { ar: 'رفع المشروع', en: 'Upload Project', done: false },
      { ar: 'براءة الذمة', en: 'Clearance', done: false },
    ].map((item, i) => (
      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.02)', marginBottom: '0.5rem' }}>
        <CheckCircle size={18} color={item.done ? '#2ecc71' : '#555'} />
        <span>{lang === 'ar' ? item.ar : item.en}</span>
      </div>
    ))}
  </div>
);

// --- Main Alumni Component ---

const Alumni = () => {
  const { lang, t } = useLocale();
  const { user, submitAlumniRequest, alumniRequests, toggleLogin } = useAuth();
  const { 
    projectBank, addProject, deleteProject, editProject,
    cvTemplates, addCvTemplate, deleteCvTemplate,
    interviewResources, addInterviewResource, deleteInterviewResource,
    linkedinTips, addLinkedinTip, deleteLinkedinTip,
    gradTemplates, addGradTemplate
  } = useAdmin();

  const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);
  const isAuthenticated = !!user;
  const isApprovedAlumni = user?.is_alumni || user?.isAlumni || isAdmin;
  const myAlumniRequest = alumniRequests?.find(r => r.userId === user?.id);
  const hasPendingRequest = !!myAlumniRequest;

  const [activeTab, setActiveTab] = useState('projects');
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestForm, setRequestForm] = useState({ hours: '', scheduleImage: null });
  const [requestSent, setRequestSent] = useState(false);
  
  const fileInputRef = React.useRef(null);
  const cvFileInputRef = React.useRef(null);
  const scheduleRef = React.useRef(null);

  const getLoc = (item, prefix) => {
    if (!item) return '';
    if (item[`${prefix}_${lang}`]) return item[`${prefix}_${lang}`];
    if (item[`${prefix}_ar`]) return item[`${prefix}_ar`];
    if (item[`${prefix}_en`]) return item[`${prefix}_en`];
    if (item[prefix] && typeof item[prefix] === 'object') return item[prefix][lang] || item[prefix].ar || item[prefix].en || '';
    return item[prefix] || '';
  };

  const getArray = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    try { const parsed = JSON.parse(val); return Array.isArray(parsed) ? parsed : [val]; } catch { return [val]; }
  };

  const handleViewFile = (url) => window.open(url, '_blank');
  const handleDownload = async (url, name) => {
    try {
      const res = await fetch(url);
      const blob = await res.blob();
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = name || 'file';
      link.click();
    } catch { window.open(url, '_blank'); }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setModalData({ file, nameAr: file.name, nameEn: file.name, type: file.name.split('.').pop() });
      setActiveModal('template');
    }
  };

  const handleCvFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setModalData({ file, nameAr: file.name, nameEn: file.name });
      setActiveModal('cv');
    }
  };

  const handleAddCvTemplate = () => cvFileInputRef.current?.click();

  if (!isAuthenticated) return (
    <div style={{ textAlign: 'center', padding: '5rem' }}>
       <Lock size={60} style={{ margin: '0 auto 2rem' }} />
       <h2>{lang === 'ar' ? 'يرجى تسجيل الدخول' : 'Please Login'}</h2>
       <button className="btn-primary" onClick={() => toggleLogin(true)}>Login</button>
    </div>
  );

  if (!isApprovedAlumni) return (
    <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '2rem' }} className="glass-panel">
       <h2 style={{ textAlign: 'center' }}>{lang === 'ar' ? 'طلب الانضمام للبوابة' : 'Request Access'}</h2>
       <form onSubmit={async (e) => {
          e.preventDefault();
          setIsSubmitting(true);
          await submitAlumniRequest(user.id, { hours: requestForm.hours, scheduleImage: requestForm.scheduleImage });
          setRequestSent(true);
          setIsSubmitting(false);
       }}>
          <input type="number" placeholder="Hours" value={requestForm.hours} onChange={e => setRequestForm({...requestForm, hours: e.target.value})} required />
          <button type="submit" disabled={isSubmitting}>{isSubmitting ? '...' : 'Submit'}</button>
       </form>
    </div>
  );

  const tabs = [
    { id: 'projects', label: lang === 'ar' ? 'المشاريع' : 'Projects', icon: Presentation },
    { id: 'career', label: lang === 'ar' ? 'المسار المهني' : 'Career', icon: Briefcase },
    { id: 'checklist', label: lang === 'ar' ? 'الخطوات' : 'Steps', icon: ClipboardList },
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      <AnimatePresence>
        {activeModal && (
          <AdminModal 
            lang={lang}
            isSubmitting={isSubmitting}
            title={activeModal.toUpperCase()}
            onClose={() => setActiveModal(null)}
            onSave={async () => {
              setIsSubmitting(true);
              try {
                if (activeModal === 'template') await addGradTemplate({ name: { ar: modalData.nameAr, en: modalData.nameEn }, fileObject: modalData.file });
                else if (activeModal === 'cv') await addCvTemplate({ name: { ar: modalData.nameAr, en: modalData.nameEn }, fileObject: modalData.file });
                else if (activeModal === 'interview') await addInterviewResource({ title: { ar: modalData.titleAr, en: modalData.titleEn }, type: modalData.type, url: modalData.url });
                else if (activeModal === 'linkedin') await addLinkedinTip({ title: { ar: modalData.titleAr, en: modalData.titleEn }, type: modalData.type, content: modalData.content, url: modalData.url });
                setActiveModal(null);
              } finally { setIsSubmitting(false); }
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <input type="text" placeholder="Title AR" value={modalData.nameAr || modalData.titleAr || ''} onChange={e => setModalData({...modalData, nameAr: e.target.value, titleAr: e.target.value})} />
              <input type="text" placeholder="Title EN" value={modalData.nameEn || modalData.titleEn || ''} onChange={e => setModalData({...modalData, nameEn: e.target.value, titleEn: e.target.value})} />
              {(activeModal === 'interview' || activeModal === 'linkedin') && (
                <input type="text" placeholder="URL" value={modalData.url || ''} onChange={e => setModalData({...modalData, url: e.target.value})} />
              )}
              {activeModal === 'linkedin' && (
                <textarea placeholder="Tip Content" value={modalData.content || ''} onChange={e => setModalData({...modalData, content: e.target.value})} />
              )}
            </div>
          </AdminModal>
        )}
      </AnimatePresence>

      <input type="file" ref={fileInputRef} hidden onChange={handleFileChange} />
      <input type="file" ref={cvFileInputRef} hidden onChange={handleCvFileChange} />

      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: 'var(--accent-color)' }}>{lang === 'ar' ? 'بوابة الخريجين' : 'Alumni Portal'}</h1>
      </header>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '3rem' }}>
        {tabs.map(t => (
          <button key={t.id} onClick={() => setActiveTab(t.id)} className={activeTab === t.id ? 'btn-primary' : 'btn-outline'}>
            <t.icon size={18} /> {t.label}
          </button>
        ))}
      </div>

      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'projects' && <ProjectSection key="p" lang={lang} isAdmin={isAdmin} projectBank={projectBank} addProject={addProject} deleteProject={deleteProject} editProject={editProject} getLoc={getLoc} getArray={getArray} handleViewFile={handleViewFile} handleDownload={handleDownload} />}
          {activeTab === 'career' && <CareerSection key="c" lang={lang} isAdmin={isAdmin} cvTemplates={cvTemplates} interviewResources={interviewResources} linkedinTips={linkedinTips} deleteCvTemplate={deleteCvTemplate} deleteInterviewResource={deleteInterviewResource} deleteLinkedinTip={deleteLinkedinTip} setActiveModal={setActiveModal} setModalData={setModalData} getLoc={getLoc} handleViewFile={handleViewFile} handleDownload={handleDownload} handleAddCvTemplate={handleAddCvTemplate} />}
          {activeTab === 'checklist' && <ChecklistSection key="chk" lang={lang} />}
        </AnimatePresence>
      </main>
    </div>
  );
};

export default Alumni;
