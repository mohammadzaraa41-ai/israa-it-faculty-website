import React, { useState } from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Calculator, Lightbulb, GraduationCap, Code, CheckCircle, Plus, Trash2, Edit2, GripVertical } from 'lucide-react';
import CourseRoadmap from '../components/CourseRoadmap';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { useAdmin } from '../contexts/AdminContext';

const CurrentStudents = () => {
  const { user } = useAuth();
  const { t, lang } = useLocale();
  const [activeTab, setActiveTab] = useState('roadmap');

  const tabs = [
    { id: 'roadmap', label: lang === 'ar' ? 'الخطة والمواد' : 'Plan & Courses', icon: <BookOpen size={20} /> },
    { id: 'gpa', label: lang === 'ar' ? 'حاسبة المعدل' : 'GPA Calculator', icon: <Calculator size={20} /> },
    { id: 'courses', label: lang === 'ar' ? 'الدورات المطروحة' : 'Offered Trainings', icon: <GraduationCap size={20} /> },
    { id: 'tips', label: lang === 'ar' ? 'نصائح للطلاب' : 'Student Tips', icon: <Lightbulb size={20} /> },
    { id: 'quests', label: lang === 'ar' ? 'تحديات برمجية (XP)' : 'Coding Quests', icon: <Code size={20} /> }
  ];

  return (
    <div style={{ padding: '2rem', maxWidth: '1280px', margin: '0 auto', minHeight: '80vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '3rem' }}
      >
        <h1 className="title">{lang === 'ar' ? 'بوابة الطلاب الحاليين' : 'Current Students Portal'}</h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          {lang === 'ar' ? 'كل ما تحتاجه لتنظيم دراستك وتطوير مهاراتك في مكان واحد.' : 'Everything you need to organize your studies and develop your skills in one place.'}
        </p>
      </motion.div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
        {tabs.map(tab => (
          <button 
            key={tab.id}
            className={activeTab === tab.id ? 'btn-primary' : 'btn-outline'}
            onClick={() => setActiveTab(tab.id)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flex: '1 1 180px', justifyContent: 'center' }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '2rem', minHeight: '500px', position: 'relative', overflow: 'hidden' }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'roadmap' && <CourseRoadmapTab lang={lang} />}
            {activeTab === 'gpa' && <GPACalculator lang={lang} />}
            {activeTab === 'courses' && <OfferedCourses lang={lang} user={user} />}
            {activeTab === 'tips' && <StudentTips lang={lang} />}
            {activeTab === 'quests' && <CodingQuests lang={lang} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const CourseRoadmapTab = ({ lang }) => (
  <div>
    <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)', fontSize: '1.5rem' }}>
      {lang === 'ar' ? 'الخطة الدراسية التفاعلية والمواد' : 'Interactive Study Plan & Courses'}
    </h3>
    <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
      {lang === 'ar' ? 'استعرض المواد ومسارها الدراسي (المتطلبات السابقة واللاحقة).' : 'Browse courses and their prerequisites.'}
    </p>
    <CourseRoadmap />
  </div>
);

const GPACalculator = ({ lang }) => {
  const [courses, setCourses] = useState([{ id: 1, name: '', hours: 3, grade: 85 }]);
  const [result, setResult] = useState(null);

  const addCourse = () => setCourses([...courses, { id: Date.now(), name: '', hours: 3, grade: 85 }]);
  const removeCourse = (id) => setCourses(courses.filter(c => c.id !== id));
  
  const updateCourse = (id, field, value) => {
    setCourses(courses.map(c => c.id === id ? { ...c, [field]: value } : c));
  };

  const calculateGPA = () => {
    let totalPoints = 0;
    let totalHours = 0;
    courses.forEach(c => {
      totalPoints += (parseFloat(c.grade) * parseFloat(c.hours));
      totalHours += parseFloat(c.hours);
    });
    const gpa = totalHours > 0 ? (totalPoints / totalHours).toFixed(2) : 0;
    setResult(gpa);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)', fontSize: '1.5rem', textAlign: 'center' }}>
        {lang === 'ar' ? 'حاسبة المعدل الفصلي' : 'Semester GPA Calculator'}
      </h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {courses.map((course, idx) => (
          <div key={course.id} style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px' }}>
            <span style={{ fontWeight: 'bold', color: 'var(--text-secondary)' }}>{idx + 1}</span>
            <input 
              type="text" placeholder={lang === 'ar' ? 'اسم المادة (اختياري)' : 'Course Name'} 
              value={course.name} onChange={e => updateCourse(course.id, 'name', e.target.value)}
              style={{ flex: 2, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)' }}
            />
            <input 
              type="number" min="1" max="6" placeholder={lang === 'ar' ? 'الساعات' : 'Hours'} 
              value={course.hours} onChange={e => updateCourse(course.id, 'hours', e.target.value)}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)' }}
            />
            <input 
              type="number" min="35" max="100" placeholder={lang === 'ar' ? 'العلامة %' : 'Grade %'} 
              value={course.grade} onChange={e => updateCourse(course.id, 'grade', e.target.value)}
              style={{ flex: 1, padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-color)', background: 'transparent', color: 'var(--text-primary)' }}
            />
            <button onClick={() => removeCourse(course.id)} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer', padding: '0.5rem' }}>
              <Trash2 size={20} />
            </button>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={addCourse} className="btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Plus size={18} /> {lang === 'ar' ? 'إضافة مادة' : 'Add Course'}
        </button>
        <button onClick={calculateGPA} className="btn-primary" style={{ padding: '0.75rem 2rem' }}>
          {lang === 'ar' ? 'احسب المعدل' : 'Calculate GPA'}
        </button>
      </div>

      {result && (
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
          style={{ marginTop: '2rem', padding: '2rem', background: 'var(--primary-color)', borderRadius: '12px', textAlign: 'center', color: '#fff' }}
        >
          <h4 style={{ fontSize: '1.2rem', marginBottom: '0.5rem' }}>{lang === 'ar' ? 'معدلك الفصلي المتوقع' : 'Expected Semester GPA'}</h4>
          <div style={{ fontSize: '3rem', fontWeight: '900' }}>{result} %</div>
        </motion.div>
      )}
    </div>
  );
};

const OfferedCourses = ({ lang, user }) => {
  const { offeredCourses, addCourse, deleteCourse, editCourse, reorderCourses } = useAdmin();
  const [newCourse, setNewCourse] = useState({ title: '', hours: '', instructor: '', state: 'متاح للتسجيل' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ id: null, title: '', hours: '', instructor: '', state: '' });
  
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'DEAN';
  
  const startEdit = (course) => {
    setEditingId(course.id);
    setEditForm(course);
  };

  const saveEdit = () => {
    editCourse(editForm);
    setEditingId(null);
  };
  
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('index', index);
  };
  
  const handleDrop = (e, targetIndex) => {
    const sourceIndex = e.dataTransfer.getData('index');
    if (sourceIndex === targetIndex.toString()) return;
    
    const newItems = [...offeredCourses];
    const [draggedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);
    reorderCourses(newItems);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div>
      <h3 style={{ marginBottom: '1.5rem', color: 'var(--primary-color)', fontSize: '1.5rem' }}>
        {lang === 'ar' ? 'الدورات وورش العمل المطروحة' : 'Offered Courses & Workshops'}
      </h3>
      
      {isAdmin && (
        <form onSubmit={e => { e.preventDefault(); addCourse(newCourse); setNewCourse({ title: '', hours: '', instructor: '', state: 'متاح للتسجيل' }); }} style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '2rem', padding: '1rem', background: 'rgba(255,255,255,0.05)', borderRadius: '8px' }}>
          <input required type="text" placeholder={lang === 'ar' ? 'عنوان الدورة' : 'Title'} value={newCourse.title} onChange={e => setNewCourse({...newCourse, title: e.target.value})} style={{ flex: 2, padding: '0.5rem', borderRadius: '4px' }} />
          <input required type="text" placeholder="الساعات" value={newCourse.hours} onChange={e => setNewCourse({...newCourse, hours: e.target.value})} style={{ flex: 1, padding: '0.5rem', borderRadius: '4px' }} />
          <input required type="text" placeholder="المدرب" value={newCourse.instructor} onChange={e => setNewCourse({...newCourse, instructor: e.target.value})} style={{ flex: 1, padding: '0.5rem', borderRadius: '4px' }} />
          <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1rem' }}><Plus size={18} /></button>
        </form>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {offeredCourses.map((c, i) => (
          <div 
            key={c.id || i} 
            draggable={isAdmin && editingId !== c.id}
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, i)}
            style={{ padding: '1.5rem', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid var(--border-color)', position: 'relative' }}
          >
            {isAdmin && editingId !== c.id && (
              <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', display: 'flex', gap: '0.5rem', direction: 'ltr' }}>
                <button onClick={() => deleteCourse(c.id)} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }} title={lang === 'ar' ? 'حذف' : 'Delete'}><Trash2 size={18} /></button>
                <button onClick={() => startEdit(c)} style={{ background: 'transparent', border: 'none', color: '#f1c40f', cursor: 'pointer' }} title={lang === 'ar' ? 'تعديل' : 'Edit'}><Edit2 size={18} /></button>
                <span style={{ cursor: 'grab', color: 'var(--text-secondary)' }}><GripVertical size={18} /></span>
              </div>
            )}
            
            {editingId === c.id ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px' }} />
                <input type="text" value={editForm.hours} onChange={e => setEditForm({...editForm, hours: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px' }} />
                <input type="text" value={editForm.instructor} onChange={e => setEditForm({...editForm, instructor: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px' }} />
                <select value={editForm.state} onChange={e => setEditForm({...editForm, state: e.target.value})} style={{ padding: '0.5rem', borderRadius: '4px' }}>
                  <option value="متاح للتسجيل">متاح للتسجيل</option>
                  <option value="مغلق">مغلق</option>
                </select>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  <button onClick={saveEdit} className="btn-primary" style={{ padding: '0.5rem', flex: 1 }}>{lang === 'ar' ? 'حفظ' : 'Save'}</button>
                  <button onClick={() => setEditingId(null)} className="btn-outline" style={{ padding: '0.5rem', flex: 1 }}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
                </div>
              </div>
            ) : (
              <>
                <h4 style={{ fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: '1rem', paddingLeft: isAdmin ? '4.5rem' : 0 }}>{c.title}</h4>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>⏱ {c.hours}</p>
                <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>👨‍🏫 {c.instructor}</p>
                <span style={{ 
                  padding: '0.3rem 0.8rem', borderRadius: '20px', fontSize: '0.85rem', fontWeight: 'bold',
                  background: c.state === 'مغلق' ? 'rgba(231, 76, 60, 0.2)' : 'rgba(46, 204, 113, 0.2)',
                  color: c.state === 'مغلق' ? '#e74c3c' : '#2ecc71'
                }}>
                  {c.state}
                </span>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

const StudentTips = ({ lang }) => {
  const { user } = useAuth();
  const { studentTips, addTip, deleteTip, editTip, reorderTips } = useAdmin();
  const [newTip, setNewTip] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState('');
  
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'DEAN';

  const startEdit = (tip) => {
    setEditingId(tip.id);
    setEditForm(tip.text);
  };

  const saveEdit = (id) => {
    editTip(id, editForm);
    setEditingId(null);
  };

  const handleDragStart = (e, index) => e.dataTransfer.setData('index', index);
  
  const handleDrop = (e, targetIndex) => {
    const sourceIndex = e.dataTransfer.getData('index');
    if (sourceIndex === targetIndex.toString()) return;
    const newItems = [...studentTips];
    const [draggedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);
    reorderTips(newItems);
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <h3 style={{ marginBottom: '1.5rem', color: '#f1c40f', fontSize: '1.5rem', textAlign: 'center' }}>
        {lang === 'ar' ? 'نصائح ذهبية لطلاب الكلية' : 'Golden Tips for Faculty Students'}
      </h3>
      
      {isAdmin && (
        <form onSubmit={e => { e.preventDefault(); addTip(newTip); setNewTip(''); }} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <input required type="text" placeholder="إضافة نصيحة جديدة..." value={newTip} onChange={e => setNewTip(e.target.value)} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px' }} />
          <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1.5rem' }}><Plus size={18} /></button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {studentTips.map((tip, i) => (
          <motion.div 
            key={tip.id || i} 
            draggable={isAdmin && editingId !== tip.id}
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, i)}
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
            style={{ display: 'flex', gap: '1rem', alignItems: 'center', background: 'rgba(241, 196, 15, 0.1)', padding: '1.5rem', borderRadius: '12px', borderLeft: '4px solid #f1c40f', position: 'relative' }}
          >
            {isAdmin && editingId !== tip.id && (
              <span style={{ cursor: 'grab', color: 'var(--text-secondary)' }}><GripVertical size={20} /></span>
            )}
            <Lightbulb color="#f1c40f" size={24} style={{ flexShrink: 0 }} />
            
            {editingId === tip.id ? (
              <div style={{ display: 'flex', gap: '0.5rem', flex: 1 }}>
                <input type="text" value={editForm} onChange={e => setEditForm(e.target.value)} style={{ flex: 1, padding: '0.5rem', borderRadius: '4px' }} />
                <button onClick={() => saveEdit(tip.id)} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>{lang === 'ar' ? 'حفظ' : 'Save'}</button>
                <button onClick={() => setEditingId(null)} className="btn-outline" style={{ padding: '0.5rem 1rem' }}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              </div>
            ) : (
              <p style={{ margin: 0, fontSize: '1.1rem', color: 'var(--text-primary)', lineHeight: '1.6', flex: 1 }}>{tip.text}</p>
            )}

            {isAdmin && editingId !== tip.id && (
              <div style={{ display: 'flex', gap: '0.5rem', direction: 'ltr' }}>
                <button onClick={() => startEdit(tip)} style={{ background: 'transparent', border: 'none', color: '#f1c40f', cursor: 'pointer' }}><Edit2 size={20} /></button>
                <button onClick={() => deleteTip(tip.id)} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}><Trash2 size={20} /></button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

const CodingQuests = ({ lang }) => {
  const { user } = useAuth();
  const { quests, addQuest, deleteQuest, editQuest, reorderQuests } = useAdmin();
  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'DEAN';
  const [xp, setXp] = useState(150);
  const maxXp = 1000;
  
  const [newQuest, setNewQuest] = useState({ title: '', xp: '' });
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ id: null, title: '', xp: '' });

  const startEdit = (quest) => {
    setEditingId(quest.id);
    setEditForm({ id: quest.id, title: quest.title, xp: quest.xp.toString() });
  };

  const saveEdit = () => {
    editQuest({ ...editForm, xp: parseInt(editForm.xp) });
    setEditingId(null);
  };

  const [questsState, setQuestsState] = useState(quests.map(q => ({ ...q, done: false })));

  React.useEffect(() => {
    setQuestsState(quests.map(q => ({ ...q, done: false })));
  }, [quests]);

  const completeQuest = (id, reward) => {
    setQuestsState(questsState.map(q => q.id === id ? { ...q, done: true } : q));
    setXp(Math.min(xp + reward, maxXp));
  };

  const handleDragStart = (e, index) => e.dataTransfer.setData('index', index);
  
  const handleDrop = (e, targetIndex) => {
    const sourceIndex = e.dataTransfer.getData('index');
    if (sourceIndex === targetIndex.toString()) return;
    const newItems = [...quests];
    const [draggedItem] = newItems.splice(sourceIndex, 1);
    newItems.splice(targetIndex, 0, draggedItem);
    reorderQuests(newItems);
  };

  const level = Math.floor(xp / 200) + 1;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h3 style={{ color: 'var(--primary-color)', fontSize: '1.8rem', marginBottom: '0.5rem' }}>
          {lang === 'ar' ? 'نظام مهام الخبرة البرمجية' : 'Programming Experience Quests'}
        </h3>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>
          {lang === 'ar' ? 'أنجز المهام التالية لزيادة نقاط خبرتك (XP) ورفع مستواك البرمجي!' : 'Complete tasks to earn XP and level up your programming skills!'}
        </p>

        <div style={{ background: 'rgba(0,0,0,0.3)', padding: '2rem', borderRadius: '15px', border: '1px solid var(--primary-color)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1rem' }}>
            <div style={{ textAlign: 'right' }}>
              <span style={{ fontSize: '1rem', color: 'var(--text-secondary)' }}>{lang === 'ar' ? 'المستوى' : 'Level'}</span>
              <div style={{ fontSize: '2.5rem', fontWeight: '900', color: 'var(--accent-color)', lineHeight: 1 }}>{level}</div>
            </div>
            <div style={{ textAlign: 'left', fontWeight: 'bold', color: 'var(--primary-light)' }}>
              {xp} / {maxXp} XP
            </div>
          </div>
          <div style={{ height: '12px', background: 'rgba(255,255,255,0.1)', borderRadius: '10px', overflow: 'hidden' }}>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(xp / maxXp) * 100}%` }}
              style={{ height: '100%', background: 'linear-gradient(90deg, var(--primary-color), var(--accent-color))' }}
            />
          </div>
        </div>
      </div>

      {isAdmin && (
        <form onSubmit={e => { e.preventDefault(); addQuest({ title: newQuest.title, xp: parseInt(newQuest.xp) }); setNewQuest({ title: '', xp: '' }); }} style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
          <input required type="text" placeholder="عنوان التحدي..." value={newQuest.title} onChange={e => setNewQuest({...newQuest, title: e.target.value})} style={{ flex: 3, padding: '0.75rem', borderRadius: '8px' }} />
          <input required type="number" placeholder="XP" value={newQuest.xp} onChange={e => setNewQuest({...newQuest, xp: e.target.value})} style={{ flex: 1, padding: '0.75rem', borderRadius: '8px' }} />
          <button type="submit" className="btn-primary" style={{ padding: '0.5rem 1.5rem' }}><Plus size={18} /></button>
        </form>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {questsState.map((quest, i) => (
          <div 
            key={quest.id} 
            draggable={isAdmin && editingId !== quest.id}
            onDragStart={(e) => handleDragStart(e, i)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => handleDrop(e, i)}
            style={{ 
              display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
              background: quest.done ? 'rgba(46, 204, 113, 0.1)' : 'rgba(255,255,255,0.05)', 
              padding: '1.5rem', borderRadius: '12px', 
              border: `1px solid ${quest.done ? '#2ecc71' : 'var(--border-color)'}`,
              opacity: quest.done && editingId !== quest.id ? 0.7 : 1,
              position: 'relative',
              flexWrap: 'wrap', gap: '1rem'
            }}
          >
            {editingId === quest.id ? (
              <div style={{ display: 'flex', gap: '0.5rem', flex: 1, width: '100%' }}>
                <input type="text" value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} style={{ flex: 3, padding: '0.5rem', borderRadius: '4px' }} />
                <input type="number" value={editForm.xp} onChange={e => setEditForm({...editForm, xp: e.target.value})} style={{ flex: 1, padding: '0.5rem', borderRadius: '4px' }} />
                <button onClick={saveEdit} className="btn-primary" style={{ padding: '0.5rem 1rem' }}>{lang === 'ar' ? 'حفظ' : 'Save'}</button>
                <button onClick={() => setEditingId(null)} className="btn-outline" style={{ padding: '0.5rem 1rem' }}>{lang === 'ar' ? 'إلغاء' : 'Cancel'}</button>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  {isAdmin && (
                    <span style={{ cursor: 'grab', color: 'var(--text-secondary)' }}><GripVertical size={20} /></span>
                  )}
                  {quest.done ? <CheckCircle color="#2ecc71" size={24} /> : <Code color="var(--text-secondary)" size={24} />}
                  <span style={{ fontSize: '1.1rem', color: quest.done ? '#2ecc71' : 'var(--text-primary)', textDecoration: quest.done ? 'line-through' : 'none' }}>
                    {quest.title}
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <span style={{ fontWeight: '900', color: '#f1c40f' }}>+{quest.xp} XP</span>
                  {!quest.done && !isAdmin && (
                    <button 
                      onClick={() => completeQuest(quest.id, quest.xp)}
                      style={{ background: 'var(--primary-color)', color: 'white', border: 'none', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}
                    >
                      {lang === 'ar' ? 'إنجاز' : 'Complete'}
                    </button>
                  )}
                  {isAdmin && (
                    <div style={{ display: 'flex', gap: '0.5rem', direction: 'ltr' }}>
                      <button onClick={() => startEdit(quest)} style={{ background: 'transparent', border: 'none', color: '#f1c40f', cursor: 'pointer' }}><Edit2 size={20} /></button>
                      <button onClick={() => deleteQuest(quest.id)} style={{ background: 'transparent', border: 'none', color: '#e74c3c', cursor: 'pointer' }}><Trash2 size={20} /></button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CurrentStudents;
