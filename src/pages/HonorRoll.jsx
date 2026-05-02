import React, { useState } from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { useAdmin } from '../contexts/AdminContext';
import { useAuth } from '../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Trophy, Plus, Trash2, Edit2, X, Check, User, Calendar, GraduationCap } from 'lucide-react';

const HonorRoll = () => {
  const { lang } = useLocale();
  const { user } = useAuth();
  const { honorRoll, addHonorStudent, deleteHonorStudent, editHonorStudent, departments } = useAdmin();
  const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [formData, setFormData] = useState({
    studentName: { ar: '', en: '' },
    major: 'cs',
    year: '',
    gpa: ''
  });

  const handleOpenAdd = () => {
    setFormData({ studentName: { ar: '', en: '' }, major: 'cs', year: '', gpa: '' });
    setEditingStudent(null);
    setShowAddModal(true);
  };

  const handleOpenEdit = (student) => {
    setFormData({ ...student });
    setEditingStudent(student);
    setShowAddModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingStudent) editHonorStudent({ ...formData, id: editingStudent.id });
    else addHonorStudent(formData);
    setShowAddModal(false);
  };

  const getMajorName = (id) => {
    const dept = departments.find(d => d.id === id);
    return dept ? (lang === 'ar' ? dept.name.ar : dept.name.en) : id;
  };

  // Group students by major and sort by year descending
  const groupedStudents = honorRoll.reduce((acc, student) => {
    if (!acc[student.major]) acc[student.major] = [];
    acc[student.major].push(student);
    return acc;
  }, {});

  // Sort each major group by year descending
  Object.keys(groupedStudents).forEach(major => {
    groupedStudents[major].sort((a, b) => b.year.localeCompare(a.year));
  });

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', minHeight: '80vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
          <Trophy size={64} color="var(--accent-color)" style={{ marginBottom: '1rem' }} />
        </motion.div>
        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>
          {lang === 'ar' ? 'لوحة الشرف' : 'Honor Roll'}
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem', maxWidth: '800px', margin: '0 auto' }}>
          {lang === 'ar' 
            ? 'نحتفي بنخبة طلابنا الذين تميزوا بأدائهم الأكاديمي الاستثنائي وتصدروا قوائم الشرف في تخصصاتهم.' 
            : 'Celebrating our elite students who excelled with exceptional academic performance and topped the honor lists.'}
        </p>
        
        {isAdmin && (
          <button onClick={handleOpenAdd} className="btn-primary" style={{ marginTop: '2rem', gap: '0.5rem' }}>
            <Plus size={20} /> {lang === 'ar' ? 'إضافة طالب متميز' : 'Add Top Student'}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
        {Object.entries(groupedStudents).map(([majorId, students]) => (
          <div key={majorId}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid var(--primary-color)', paddingBottom: '1rem' }}>
              <Star color="var(--accent-color)" fill="var(--accent-color)" />
              <h2 style={{ fontSize: '1.8rem', color: 'var(--primary-color)' }}>{getMajorName(majorId)}</h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '2rem' }}>
              {students.map((student) => (
                <motion.div 
                  key={student.id} 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="glass-panel"
                  style={{ padding: '2rem', textAlign: 'center', position: 'relative', border: '1px solid var(--accent-color)', boxShadow: '0 10px 30px rgba(220,179,36,0.1)' }}
                >
                  {isAdmin && (
                    <div style={{ position: 'absolute', top: '1rem', right: '1rem', display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleOpenEdit(student)} style={{ color: '#f1c40f' }}><Edit2 size={18} /></button>
                      <button onClick={() => deleteHonorStudent(student.id)} style={{ color: '#e74c3c' }}><Trash2 size={18} /></button>
                    </div>
                  )}
                  
                  <div style={{ width: '100px', height: '100px', background: 'var(--primary-color)', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 1.5rem', color: 'var(--accent-color)', border: '4px solid var(--accent-color)' }}>
                    <User size={50} />
                  </div>
                  
                  <h3 style={{ fontSize: '1.5rem', marginBottom: '0.5rem', color: 'var(--text-primary)' }}>
                    {student.studentName[lang] || student.studentName}
                  </h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', color: 'var(--text-secondary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                      <Calendar size={16} /> {student.year}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontWeight: 'bold', color: 'var(--accent-color)' }}>
                      <Check size={16} /> GPA: {student.gpa}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {showAddModal && (
          <div className="login-modal-overlay" style={{ zIndex: 6000 }}>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }} className="glass-panel" style={{ width: '95%', maxWidth: '500px', padding: '2.5rem', position: 'relative' }}>
              <button onClick={() => setShowAddModal(false)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', color: 'var(--text-secondary)' }}><X size={24} /></button>
              <h2 style={{ marginBottom: '2rem', color: 'var(--primary-color)' }}>{editingStudent ? 'تعديل بيانات الطالب' : 'إضافة طالب متفوق'}</h2>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div className="input-group">
                  <label>اسم الطالب (عربي)</label>
                  <input required type="text" value={formData.studentName.ar} onChange={e => setFormData({ ...formData, studentName: { ...formData.studentName, ar: e.target.value } })} />
                </div>
                <div className="input-group">
                  <label>Student Name (EN)</label>
                  <input required type="text" value={formData.studentName.en} onChange={e => setFormData({ ...formData, studentName: { ...formData.studentName, en: e.target.value } })} />
                </div>
                <div className="input-group">
                  <label>التخصص</label>
                  <select className="custom-select" value={formData.major} onChange={e => setFormData({ ...formData, major: e.target.value })}>
                    {departments.map(d => <option key={d.id} value={d.id}>{d.name.ar}</option>)}
                  </select>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="input-group">
                    <label>السنة</label>
                    <input required type="text" placeholder="2023/2024" value={formData.year} onChange={e => setFormData({ ...formData, year: e.target.value })} />
                  </div>
                  <div className="input-group">
                    <label>المعدل (GPA)</label>
                    <input required type="text" placeholder="3.95" value={formData.gpa} onChange={e => setFormData({ ...formData, gpa: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ marginTop: '1rem', padding: '1rem' }}><Check size={20} /> حفظ </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HonorRoll;
