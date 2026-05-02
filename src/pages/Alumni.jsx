import React, { useState } from 'react';
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
  GraduationCap
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Alumni = () => {
  const { lang } = useLocale();
  const { user, submitAlumniRequest, alumniRequests, toggleLogin } = useAuth();
  const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);
  const isAuthenticated = !!user;
  
  const myAlumniRequest = alumniRequests?.find(r => r.userId === user?.id);
  const isApprovedAlumni = user?.is_alumni || user?.isAlumni || isAdmin;
  const hasPendingRequest = myAlumniRequest && !isApprovedAlumni;

  const { 
    gradTemplates, addGradTemplate, deleteGradTemplate, editGradTemplate,
    projectBank, addProject, deleteProject,
    cvTemplates, addCvTemplate, deleteCvTemplate,
    interviewResources, addInterviewResource, deleteInterviewResource,
    linkedinTips, addLinkedinTip, deleteLinkedinTip
  } = useAdmin();
  
  const [activeTab, setActiveTab] = useState('projects');
  const [activeModal, setActiveModal] = useState(null);
  const [modalData, setModalData] = useState({});
  const [requestForm, setRequestForm] = useState({ hours: '', scheduleImage: null });
  const [requestSent, setRequestSent] = useState(false);
  const fileInputRef = React.useRef(null);
  const cvFileInputRef = React.useRef(null);
  const scheduleRef = React.useRef(null);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    await submitAlumniRequest(user.id, {
      fullName: user.fullName || user.username,
      universityId: user.universityId || user.username,
      hours: requestForm.hours,
      scheduleImage: requestForm.scheduleImage
    });
    setRequestSent(true);
  };

  if (!isAuthenticated) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', textAlign: 'center', padding: '2rem' }}>
        <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Lock size={80} style={{ marginBottom: '2rem', color: 'var(--primary-color)', opacity: 0.6 }} />
          <h2 style={{ fontSize: '2.5rem', marginBottom: '1.5rem' }}>{lang === 'ar' ? 'بوابة الخريجين مغلقة' : 'Alumni Portal Closed'}</h2>
          <p style={{ fontSize: '1.1rem', marginBottom: '2.5rem', opacity: 0.8, maxWidth: '500px' }}>
            {lang === 'ar' ? 'يجب عليك تسجيل الدخول بحسابك الجامعي للتمكن من تقديم طلب الوصول لهذه الصفحة.' : 'You must log in with your university account to be able to request access to this page.'}
          </p>
          <button className="btn-primary" onClick={() => toggleLogin(true)} style={{ padding: '1rem 3rem', fontSize: '1.1rem' }}>
            {lang === 'ar' ? 'تسجيل الدخول الآن' : 'Login Now'}
          </button>
        </motion.div>
      </div>
    );
  }

  if (!isApprovedAlumni) {
    return (
      <div style={{ maxWidth: '650px', margin: '4rem auto', padding: '2.5rem' }} className="glass-panel">
        {requestSent || hasPendingRequest ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} style={{ textAlign: 'center', padding: '2rem' }}>
             <Clock size={70} style={{ color: 'var(--accent-color)', marginBottom: '2rem' }} />
             <h3 style={{ fontSize: '1.8rem', marginBottom: '1.5rem' }}>{lang === 'ar' ? 'طلبك قيد المراجعة' : 'Request Under Review'}</h3>
             <p style={{ fontSize: '1.05rem', opacity: 0.8, lineHeight: '1.7' }}>
               {lang === 'ar' 
                 ? 'شكراً لك. لقد استلمنا طلبك للوصول إلى صفحة الخريجين. سيتم تفعيل الصفحة لك فور مراجعة الإدارة لبياناتك وصورة الجدول الدراسي.' 
                 : 'Thank you. We have received your request for alumni access. The page will be activated for you once the administration reviews your data and schedule image.'}
             </p>
          </motion.div>
        ) : (
          <form onSubmit={handleRequestSubmit}>
            <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
              <GraduationCap size={60} style={{ color: 'var(--primary-light)', marginBottom: '1rem' }} />
              <h2 style={{ fontSize: '2rem', color: 'var(--text-primary)' }}>
                {lang === 'ar' ? 'فتح بوابة الخريجين' : 'Unlock Alumni Portal'}
              </h2>
              <p style={{ opacity: 0.7, marginTop: '0.5rem' }}>
                {lang === 'ar' ? 'يرجى تقديم البيانات التالية للتحقق من حالة التخرج' : 'Please provide the following data to verify graduation status'}
              </p>
            </div>

            <div className="input-group" style={{ marginBottom: '2rem' }}>
               <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '1.1rem' }}>{lang === 'ar' ? 'عدد الساعات المقطوعة' : 'Completed Hours'}</label>
               <input 
                 type="number" 
                 required 
                 style={{ width: '100%', padding: '1.2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border-color)', borderRadius: '10px', color: 'white' }}
                 value={requestForm.hours}
                 onChange={e => setRequestForm({...requestForm, hours: e.target.value})}
                 placeholder={lang === 'ar' ? 'مثال: 120 ساعة' : 'e.g. 120 hours'} 
               />
            </div>

            <div className="input-group" style={{ marginBottom: '2.5rem' }}>
               <label style={{ display: 'block', marginBottom: '0.8rem', fontSize: '1.1rem' }}>{lang === 'ar' ? 'صورة الجدول الدراسي الحالي' : 'Current Schedule Image'}</label>
               <div 
                 style={{ border: '2px dashed var(--border-color)', padding: '3rem 2rem', borderRadius: '15px', textAlign: 'center', cursor: 'pointer', transition: 'all 0.3s' }}
                 onClick={() => scheduleRef.current.click()}
                 onMouseOver={(e) => e.currentTarget.style.borderColor = 'var(--primary-color)'}
                 onMouseOut={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
               >
                 {requestForm.scheduleImage ? (
                   <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
                     <img src={requestForm.scheduleImage} alt="Schedule" style={{ maxWidth: '100%', maxHeight: '200px', borderRadius: '8px' }} />
                     <span style={{ color: '#2ecc71', fontWeight: 'bold' }}>{lang === 'ar' ? 'تم اختيار الصورة ✅' : 'Image selected ✅'}</span>
                   </div>
                 ) : (
                   <>
                     <FileUp size={40} style={{ marginBottom: '1rem', opacity: 0.4 }} />
                     <p style={{ opacity: 0.8 }}>{lang === 'ar' ? 'اضغط لرفع صورة الجدول' : 'Click to upload schedule image'}</p>
                   </>
                 )}
                 <input 
                   type="file" 
                   ref={scheduleRef} 
                   hidden 
                   onChange={e => setRequestForm({...requestForm, scheduleImage: URL.createObjectURL(e.target.files[0])})}
                   accept="image/*"
                   required
                 />
               </div>
            </div>

            <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1.2rem', fontSize: '1.2rem', fontWeight: 'bold' }}>
              {lang === 'ar' ? 'إرسال طلب التفعيل' : 'Submit Activation Request'}
            </button>
          </form>
        )}
      </div>
    );
  }

  const handleEditTemplate = (id, currentName) => {
    const newName = prompt(lang === 'ar' ? 'أدخل الاسم الجديد:' : 'Enter new name:', currentName);
    if (newName) editGradTemplate(id, newName, lang);
  };

  const handleDownload = (url, fileName) => {
    if (!url || url === '#') {
      alert(lang === 'ar' ? 'ملف تجريبي فقط' : 'Demo file only');
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleViewFile = (url) => {
    if (!url || url === '#') {
      alert(lang === 'ar' ? 'معاينة غير متاحة للملفات التجريبية' : 'Preview not available for demo files');
      return;
    }
    window.open(url, '_blank');
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setModalData({ 
        file, 
        nameAr: file.name, 
        nameEn: file.name,
        type: file.name.split('.').pop()
      });
      setActiveModal('template');
    }
    e.target.value = '';
  };

  const handleCvFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setModalData({ 
        file, 
        nameAr: file.name, 
        nameEn: file.name
      });
      setActiveModal('cv');
    }
    e.target.value = '';
  };

  const AdminModal = ({ title, type, onSave, children }) => (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem', position: 'relative' }}>
        <button style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', color: '#ff4444' }} onClick={() => setActiveModal(null)}>✕</button>
        <h3 style={{ fontSize: '1.4rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center', color: 'var(--accent-color)' }}>{title}</h3>
        {children}
        <button className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1.5rem' }} onClick={onSave}>
          {lang === 'ar' ? 'حفظ البيانات' : 'Save Data'}
        </button>
      </motion.div>
    </motion.div>
  );

  const handleAddTemplate = () => fileInputRef.current?.click();
  const handleAddCvTemplate = () => cvFileInputRef.current?.click();

  const tabs = [
    { id: 'projects', label: lang === 'ar' ? 'مشاريع التخرج' : 'Graduation Projects', icon: Presentation },
    { id: 'career', label: lang === 'ar' ? 'التأهيل المهني' : 'Career Readiness', icon: Briefcase },
    { id: 'checklist', label: lang === 'ar' ? 'خطوات التخرج' : 'Graduation Steps', icon: ClipboardList },
  ];

  const AdminControl = ({ onAdd, label, icon: Icon = Plus }) => {
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

  const ProjectSection = () => {
    const [viewingProject, setViewingProject] = useState(null);
    const [isAdding, setIsAdding] = useState(false);
    const projectFilesRef = React.useRef(null);
    const projectImagesRef = React.useRef(null);
    
    const [newProj, setNewProj] = useState({
      name: { ar: '', en: '' },
      students: ['', '', '', '', ''],
      supervisor: '',
      link: '',
      rating: 0,
      notes: { ar: '', en: '' },
      files: [],
      images: []
    });

    const handleProjectFilesChange = (e) => {
      const selectedFiles = Array.from(e.target.files).slice(0, 7);
      const fileObjects = selectedFiles.map(f => ({ 
        name: f.name, 
        type: f.name.split('.').pop(),
        url: URL.createObjectURL(f) 
      }));
      setNewProj(prev => ({ ...prev, files: [...prev.files, ...fileObjects].slice(0, 7) }));
    };

    const handleProjectImagesChange = (e) => {
      const selectedImages = Array.from(e.target.files).slice(0, 50);
      const imageUrls = selectedImages.map(img => URL.createObjectURL(img));
      setNewProj(prev => ({ ...prev, images: [...prev.images, ...imageUrls].slice(0, 50) }));
    };

    const handleSaveProject = (e) => {
      e.preventDefault();
      if (!newProj.name[lang] || !newProj.supervisor || newProj.rating === 0) {
        alert(lang === 'ar' ? 'يرجى ملء الحقول الإجبارية (اسم المشروع، المشرف، والتقييم)' : 'Please fill mandatory fields (Name, Supervisor, Rating)');
        return;
      }
      addProject({
        ...newProj,
        students: newProj.students.filter(s => s.trim() !== '')
      });
      setIsAdding(false);
      setNewProj({ name: { ar: '', en: '' }, students: ['', '', '', '', ''], supervisor: '', link: '', rating: 0, notes: { ar: '', en: '' }, files: [], images: [] });
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
                <h2 style={{ fontSize: '2rem', fontWeight: 'bold', color: 'var(--accent-color)', marginBottom: '0.5rem' }}>{viewingProject.name[lang]}</h2>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {[1, 2, 3, 4, 5].map(star => {
                    const full = star <= viewingProject.rating;
                    const half = !full && (star - 0.5) <= viewingProject.rating;
                    return (
                      <Star 
                        key={star} 
                        size={20} 
                        fill={full ? 'var(--accent-color)' : (half ? 'url(#halfGrad)' : 'transparent')} 
                        color="var(--accent-color)" 
                      />
                    );
                  })}
                  <svg width="0" height="0" style={{ position: 'absolute' }}>
                    <defs>
                      <linearGradient id="halfGrad">
                        <stop offset="50%" stopColor="var(--accent-color)" />
                        <stop offset="50%" stopColor="transparent" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                  </svg>
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
                  <div style={{ fontSize: '0.9rem' }}><strong>{lang === 'ar' ? 'المشرف:' : 'Supervisor:'}</strong> {viewingProject.supervisor}</div>
                  {viewingProject.students.map((s, i) => (
                    <div key={i} style={{ fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={14} color="#2ecc71" /> {s}
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontWeight: 'bold', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>
                  {lang === 'ar' ? 'الملفات المرفقة' : 'Project Files'}
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {viewingProject.files.map((file, i) => (
                    <div key={i} style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between', 
                      padding: '0.75rem 1rem', 
                      background: 'rgba(255,255,255,0.03)', 
                      borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.05)'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <FileText size={16} color="var(--accent-color)" />
                        <span style={{ fontSize: '0.85rem' }}>{file.name}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '0.75rem' }}>
                        <Eye 
                          size={18} 
                          style={{ cursor: 'pointer', color: 'var(--primary-light)', transition: '0.2s' }} 
                          onClick={() => handleViewFile(file.url)} 
                          title={lang === 'ar' ? 'عرض الملف' : 'View File'}
                        />
                        <Download 
                          size={18} 
                          style={{ cursor: 'pointer', color: 'var(--accent-color)', transition: '0.2s' }} 
                          onClick={() => handleDownload(file.url, file.name)} 
                          title={lang === 'ar' ? 'تحميل الملف' : 'Download File'}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '3rem' }}>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{lang === 'ar' ? 'ملاحظات المشرف' : 'Supervisor Notes'}</h4>
              <p style={{ lineHeight: '1.8', opacity: 0.8, padding: '1.5rem', background: 'rgba(244, 180, 26, 0.05)', borderRadius: '12px', borderLeft: '4px solid var(--accent-color)' }}>
                {viewingProject.notes[lang]}
              </p>
            </div>

            <div>
              <h4 style={{ fontWeight: 'bold', marginBottom: '1.5rem' }}>{lang === 'ar' ? 'معرض الصور' : 'Image Gallery'}</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '1rem' }}>
                {viewingProject.images.map((img, i) => (
                  <img key={i} src={img} alt="Project" style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '12px', cursor: 'pointer', transition: '0.3s' }} onClick={() => window.open(img)} />
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <SectionTitle title={lang === 'ar' ? 'نماذج وتقارير' : 'Templates & Reports'} icon={FileText} />
            <AdminControl 
              label={lang === 'ar' ? 'رفع نموذج جديد' : 'Upload New Template'} 
              icon={FileUp}
              onAdd={handleAddTemplate} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {gradTemplates.map((file) => (
                <div key={file.id} style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between', 
                  padding: '0.8rem 1rem', 
                  backgroundColor: 'rgba(255,255,255,0.02)', 
                  borderRadius: '10px', 
                  border: '1px solid rgba(255,255,255,0.05)' 
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.9rem' }}>{file.name[lang]}</span>
                    {file.type === 'img' && <span style={{ fontSize: '0.7rem', opacity: 0.5 }}>(Image)</span>}
                  </div>
                  <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                    <Download 
                      size={18} 
                      style={{ color: 'var(--accent-color)', cursor: 'pointer' }} 
                      title="Download" 
                      onClick={() => handleDownload(file.url, file.name[lang] + '.' + (file.type || 'pdf'))}
                    />
                    {isAdmin && (
                      <>
                        <Edit2 size={16} color="var(--primary-light)" style={{ cursor: 'pointer' }} onClick={() => handleEditTemplate(file.id, file.name[lang])} title="Edit Name" />
                        <Trash2 size={18} color="#ff4444" style={{ cursor: 'pointer' }} onClick={() => deleteGradTemplate(file.id)} title="Delete" />
                      </>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <SectionTitle title={lang === 'ar' ? 'بنك المشاريع المتميزة' : 'Excellence Project Bank'} icon={Trophy} />
              {isAdmin && (
                <button className="btn-primary" onClick={() => setIsAdding(true)} style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}>
                  <Plus size={16} /> {lang === 'ar' ? 'جديد' : 'New'}
                </button>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {projectBank.map(project => (
                <motion.div 
                  key={project.id} 
                  whileHover={{ x: 5 }}
                  onClick={() => setViewingProject(project)}
                  style={{ 
                    padding: '1.25rem', 
                    cursor: 'pointer', 
                    background: 'rgba(255,255,255,0.02)',
                    borderRadius: '12px',
                    border: '1px solid rgba(255,255,255,0.05)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <h4 style={{ fontWeight: 'bold', color: 'var(--accent-color)' }}>{project.name[lang]}</h4>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                      <Star size={12} fill="var(--accent-color)" color="var(--accent-color)" />
                      <span style={{ fontSize: '0.75rem' }}>{project.rating}</span>
                    </div>
                  </div>
                  <p style={{ fontSize: '0.8rem', opacity: 0.7, marginBottom: '0.5rem' }}>{lang === 'ar' ? 'بإشراف:' : 'By:'} {project.supervisor}</p>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>{project.students.length} {lang === 'ar' ? 'طلاب' : 'Students'}</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>•</span>
                    <span style={{ fontSize: '0.65rem', opacity: 0.5 }}>{project.images.length} {lang === 'ar' ? 'صور' : 'Photos'}</span>
                  </div>
                  
                  {isAdmin && (
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteProject(project.id); }} 
                      style={{ position: 'absolute', top: '1.25rem', left: '1.25rem', color: '#ff4444', opacity: 0.3 }}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        <AnimatePresence>
          {isAdding && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
              <motion.div initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} className="glass-panel" style={{ width: '100%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', position: 'relative' }}>
                <button style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', color: '#ff4444' }} onClick={() => setIsAdding(false)}>✕</button>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '2rem', textAlign: 'center' }}>{lang === 'ar' ? 'إضافة مشروع تخرج جديد' : 'Add New Graduation Project'}</h3>
                
                <form onSubmit={handleSaveProject} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>{lang === 'ar' ? 'اسم المشروع (عربي) *' : 'Project Name (AR) *'}</label>
                      <input type="text" className="glass-panel" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)' }} value={newProj.name.ar} onChange={e => setNewProj({...newProj, name: {...newProj.name, ar: e.target.value}})} required />
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>{lang === 'ar' ? 'اسم المشروع (EN) *' : 'Project Name (EN) *'}</label>
                      <input type="text" className="glass-panel" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)' }} value={newProj.name.en} onChange={e => setNewProj({...newProj, name: {...newProj.name, en: e.target.value}})} required />
                    </div>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>{lang === 'ar' ? 'اسم المشرف *' : 'Supervisor Name *'}</label>
                    <input type="text" className="glass-panel" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)' }} value={newProj.supervisor} onChange={e => setNewProj({...newProj, supervisor: e.target.value})} required />
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>{lang === 'ar' ? 'أسماء الطلاب (حتى 5 طلاب)' : 'Students (up to 5)'}</label>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.5rem' }}>
                      {newProj.students.map((s, i) => (
                        <input key={i} type="text" placeholder={`${lang === 'ar' ? 'طالب' : 'Student'} ${i+1}`} className="glass-panel" style={{ width: '100%', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', fontSize: '0.8rem' }} value={s} onChange={e => {
                          const updated = [...newProj.students];
                          updated[i] = e.target.value;
                          setNewProj({...newProj, students: updated});
                        }} />
                      ))}
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div>
                      <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>{lang === 'ar' ? 'التقييم (0-5 نجوم) *' : 'Rating (0-5 Stars) *'}</label>
                      <div style={{ display: 'flex', gap: '0.25rem' }}>
                        {[0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(val => (
                          <button key={val} type="button" onClick={() => setNewProj({...newProj, rating: val})} style={{ padding: '0.25rem', color: newProj.rating >= val ? 'var(--accent-color)' : '#555' }}>
                            {val % 1 === 0 ? <Star size={16} fill={newProj.rating >= val ? 'var(--accent-color)' : 'none'} /> : '½'}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>{lang === 'ar' ? 'رابط المشروع (اختياري)' : 'Project Link (Optional)'}</label>
                      <input type="url" className="glass-panel" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)' }} value={newProj.link} onChange={e => setNewProj({...newProj, link: e.target.value})} />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <input type="file" multiple ref={projectFilesRef} style={{ display: 'none' }} onChange={handleProjectFilesChange} accept=".pdf,.doc,.docx" />
                    <input type="file" multiple ref={projectImagesRef} style={{ display: 'none' }} onChange={handleProjectImagesChange} accept="image/*" />
                    
                    <button type="button" className="btn-outline" onClick={() => projectFilesRef.current?.click()} style={{ fontSize: '0.8rem' }}>
                      <FileUp size={14} /> {lang === 'ar' ? 'إضافة ملفات (حتى 7)' : 'Add Files (Up to 7)'} 
                      <span style={{ marginLeft: '5px', color: 'var(--accent-color)' }}>({newProj.files.length})</span>
                    </button>
                    
                    <button type="button" className="btn-outline" onClick={() => projectImagesRef.current?.click()} style={{ fontSize: '0.8rem' }}>
                      <Plus size={14} /> {lang === 'ar' ? 'إضافة صور (حتى 50)' : 'Add Images (Up to 50)'} 
                      <span style={{ marginLeft: '5px', color: 'var(--accent-color)' }}>({newProj.images.length})</span>
                    </button>
                  </div>

                  <div>
                    <label style={{ fontSize: '0.85rem', display: 'block', marginBottom: '0.5rem' }}>{lang === 'ar' ? 'ملاحظات المشرف (AR)' : 'Supervisor Notes (AR)'}</label>
                    <textarea className="glass-panel" style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', minHeight: '80px' }} value={newProj.notes.ar} onChange={e => setNewProj({...newProj, notes: {...newProj.notes, ar: e.target.value}})} />
                  </div>

                  <button type="submit" className="btn-primary" style={{ width: '100%', padding: '1rem', marginTop: '1rem' }}>
                    {lang === 'ar' ? 'حفظ المشروع ونشره' : 'Save & Publish Project'}
                  </button>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  };

  const CareerSection = () => {
    const [selectedCv, setSelectedCv] = useState(null);

    const handleAddInterview = () => {
      setModalData({ titleAr: '', titleEn: '', type: 'video', url: 'https://' });
      setActiveModal('interview');
    };

    const handleAddLinkedin = () => {
      setModalData({ titleAr: '', titleEn: '', type: 'tip', content: '', url: 'https://' });
      setActiveModal('linkedin');
    };

    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
          
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <SectionTitle title={lang === 'ar' ? 'السيرة الذاتية' : 'CV Builder'} icon={FileText} />
            <AdminControl label={lang === 'ar' ? 'إضافة قالب من الجهاز' : 'Add Template from Device'} onAdd={handleAddCvTemplate} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {cvTemplates.map(cv => (
                <div key={cv.id} onClick={() => setSelectedCv(cv)} style={{ 
                  cursor: 'pointer',
                  padding: '1rem', 
                  backgroundColor: 'rgba(255,255,255,0.02)', 
                  borderRadius: '10px', 
                  border: '1px solid rgba(255,255,255,0.05)',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <FileText size={16} color="var(--accent-color)" />
                    <span>{cv.name[lang]}</span>
                  </div>
                  {isAdmin && <Trash2 size={16} color="#ff4444" onClick={(e) => { e.stopPropagation(); deleteCvTemplate(cv.id); }} />}
                </div>
              ))}
            </div>
            
            <AnimatePresence>
              {selectedCv && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} style={{ marginTop: '1rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '10px' }}>
                  <div style={{ fontSize: '0.9rem', marginBottom: '1rem' }}>{lang === 'ar' ? 'خيارات القالب:' : 'Template Options:'}</div>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => handleViewFile(selectedCv.url)}><Eye size={14} /> {lang === 'ar' ? 'عرض' : 'View'}</button>
                    <button className="btn-outline" style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }} onClick={() => handleDownload(selectedCv.url, selectedCv.name[lang] + '.' + (selectedCv.file.split('.').pop()))}><Download size={14} /> {lang === 'ar' ? 'تحميل' : 'Download'}</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <SectionTitle title={lang === 'ar' ? 'المقابلات' : 'Interviews'} icon={Video} />
            <AdminControl label={lang === 'ar' ? 'إضافة فيديو/أسئلة' : 'Add Video/Questions'} onAdd={handleAddInterview} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {interviewResources.map(res => (
                <div key={res.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      {res.type === 'video' ? <Video size={16} color="var(--accent-color)" /> : <BookOpen size={16} color="#3498db" />}
                      <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{res.title[lang]}</span>
                    </div>
                    {isAdmin && <Trash2 size={16} color="#ff4444" style={{ cursor: 'pointer' }} onClick={() => deleteInterviewResource(res.id)} />}
                  </div>
                  <button onClick={() => window.open(res.url, '_blank')} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', width: '100%' }}>
                    {res.type === 'video' ? (lang === 'ar' ? 'مشاهدة الفيديو' : 'Watch Video') : (lang === 'ar' ? 'فتح الأسئلة' : 'Open Questions')}
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <SectionTitle title="LinkedIn" icon={ExternalLink} />
            <AdminControl label={lang === 'ar' ? 'إضافة نصيحة/فيديو' : 'Add Tip/Video'} onAdd={handleAddLinkedin} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {linkedinTips.map(tip => (
                <div key={tip.id} style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{tip.title[lang]}</span>
                    {isAdmin && <Trash2 size={16} color="#ff4444" style={{ cursor: 'pointer' }} onClick={() => deleteLinkedinTip(tip.id)} />}
                  </div>
                  {tip.type !== 'tip' ? (
                    <button onClick={() => window.open(tip.url, '_blank')} className="btn-outline" style={{ padding: '0.4rem 0.8rem', fontSize: '0.75rem', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.3rem' }}>
                      <ExternalLink size={12} /> {lang === 'ar' ? 'فتح الرابط' : 'Open Link'}
                    </button>
                  ) : (
                    <p style={{ fontSize: '0.8rem', opacity: 0.8, lineHeight: '1.5' }}>{tip.content}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    );
  };

  const ChecklistSection = () => (
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
            <div key={i} style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '1rem', 
              padding: '1rem', 
              backgroundColor: 'rgba(255,255,255,0.02)', 
              borderRadius: '10px', 
              border: '1px solid rgba(255,255,255,0.05)'
            }}>
              <div style={{ 
                width: '20px', 
                height: '20px', 
                borderRadius: '50%', 
                border: '2px solid', 
                borderColor: item.done ? '#2ecc71' : 'rgba(255,255,255,0.2)', 
                backgroundColor: item.done ? '#2ecc71' : 'transparent', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {item.done && <CheckCircle size={12} color="white" />}
              </div>
              <span style={{ fontSize: '0.95rem', color: item.done ? 'var(--text-secondary)' : 'inherit' }}>{item.t}</span>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );

  return (
    <div style={{ padding: '1rem 2rem 4rem', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
      <AnimatePresence>
        {activeModal && (
          <AdminModal 
            title={
              activeModal === 'template' ? (lang === 'ar' ? 'بيانات النموذج' : 'Template Data') :
              activeModal === 'cv' ? (lang === 'ar' ? 'قالب السيرة الذاتية' : 'CV Template') :
              activeModal === 'interview' ? (lang === 'ar' ? 'إضافة مقابلة' : 'Add Interview') :
              (lang === 'ar' ? 'LinkedIn نصيحة' : 'LinkedIn Tip')
            }
            onSave={() => {
              if (activeModal === 'template') {
                addGradTemplate({ 
                  name: { ar: modalData.nameAr, en: modalData.nameEn }, 
                  type: modalData.type,
                  url: URL.createObjectURL(modalData.file)
                });
              } else if (activeModal === 'cv') {
                addCvTemplate({ 
                  name: { ar: modalData.nameAr, en: modalData.nameEn }, 
                  file: modalData.file.name,
                  url: URL.createObjectURL(modalData.file)
                });
              } else if (activeModal === 'interview') {
                addInterviewResource({ 
                  title: { ar: modalData.titleAr, en: modalData.titleEn }, 
                  type: modalData.type, 
                  url: modalData.url 
                });
              } else if (activeModal === 'linkedin') {
                addLinkedinTip({ 
                  title: { ar: modalData.titleAr, en: modalData.titleEn }, 
                  type: modalData.type, 
                  content: modalData.type === 'tip' ? modalData.content : '', 
                  url: modalData.type !== 'tip' ? modalData.url : '' 
                });
              }
              setActiveModal(null);
            }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {(activeModal === 'template' || activeModal === 'cv') ? (
                <>
                  <input type="text" placeholder={lang === 'ar' ? 'الاسم بالعربي' : 'Name in Arabic'} className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)' }} value={modalData.nameAr} onChange={e => setModalData({...modalData, nameAr: e.target.value})} />
                  <input type="text" placeholder={lang === 'ar' ? 'الاسم بالإنجليزي' : 'Name in English'} className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)' }} value={modalData.nameEn} onChange={e => setModalData({...modalData, nameEn: e.target.value})} />
                </>
              ) : (
                <>
                  <input type="text" placeholder={lang === 'ar' ? 'العنوان بالعربي' : 'Title in Arabic'} className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)' }} value={modalData.titleAr} onChange={e => setModalData({...modalData, titleAr: e.target.value})} />
                  <input type="text" placeholder={lang === 'ar' ? 'العنوان بالإنجليزي' : 'Title in English'} className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)' }} value={modalData.titleEn} onChange={e => setModalData({...modalData, titleEn: e.target.value})} />
                  <select className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', color: 'white' }} value={modalData.type} onChange={e => setModalData({...modalData, type: e.target.value})}>
                    {activeModal === 'interview' ? (
                      <>
                        <option value="video">Video</option>
                        <option value="questions">Questions</option>
                      </>
                    ) : (
                      <>
                        <option value="tip">Tip</option>
                        <option value="link">Link</option>
                        <option value="video">Video</option>
                      </>
                    )}
                  </select>
                  {modalData.type === 'tip' ? (
                    <textarea placeholder={lang === 'ar' ? 'النصيحة...' : 'Tip content...'} className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)', minHeight: '100px' }} value={modalData.content} onChange={e => setModalData({...modalData, content: e.target.value})} />
                  ) : (
                    <input type="url" placeholder={lang === 'ar' ? 'الرابط URL' : 'Link URL'} className="glass-panel" style={{ width: '100%', padding: '0.8rem', background: 'rgba(255,255,255,0.05)' }} value={modalData.url} onChange={e => setModalData({...modalData, url: e.target.value})} />
                  )}
                </>
              )}
            </div>
          </AdminModal>
        )}
      </AnimatePresence>

      {/* Hidden File Inputs for Admins */}
      <input 
        type="file" 
        ref={fileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleFileChange}
        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
      />
      <input 
        type="file" 
        ref={cvFileInputRef} 
        style={{ display: 'none' }} 
        onChange={handleCvFileChange}
        accept=".pdf,.doc,.docx"
      />
      
      <header style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 className="title" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>
          {lang === 'ar' ? 'بوابة المتوقع تخرجهم' : 'Graduation Portal'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>
          {lang === 'ar' ? 'خطواتك الأخيرة نحو التخرج وسوق العمل.' : 'Your final steps towards graduation and career.'}
        </p>
      </header>

      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        gap: '0.75rem', 
        marginBottom: '2.5rem', 
        flexWrap: 'wrap',
        background: 'rgba(255,255,255,0.02)',
        padding: '0.5rem',
        borderRadius: '15px',
        width: 'fit-content',
        margin: '0 auto 2.5rem',
        border: '1px solid rgba(255,255,255,0.05)'
      }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.6rem 1.2rem',
              borderRadius: '10px',
              border: 'none',
              background: activeTab === tab.id ? 'var(--accent-color)' : 'transparent',
              color: activeTab === tab.id ? '#000' : 'var(--text-secondary)',
              fontWeight: 'bold',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              transition: 'all 0.3s'
            }}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <main>
        <AnimatePresence mode="wait">
          {activeTab === 'projects' && <ProjectSection key="p" />}
          {activeTab === 'career' && <CareerSection key="c" />}
          {activeTab === 'checklist' && <ChecklistSection key="chk" />}
        </AnimatePresence>
      </main>

      <footer style={{ marginTop: '4rem', textAlign: 'center', padding: '2rem 0', borderTop: '1px solid var(--border-color)' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          {lang === 'ar' ? 'تمنياتنا لكم بالتوفيق في حياتكم المهنية.' : 'Wishing you success in your professional life.'}
        </p>
      </footer>
    </div>
  );
};

export default Alumni;
