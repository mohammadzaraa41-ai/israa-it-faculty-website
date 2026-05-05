import React, { useState, useEffect, useMemo } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '../contexts/LocalizationContext';
import { useAdmin } from '../contexts/AdminContext';
import { ChevronDown, X, Layers, Clock, User, Target, BarChart3, Loader2, BookOpen } from 'lucide-react';

const CourseRoadmap = () => {
  const { lang } = useLocale();
  const { facultyMembers, roadmapCourses, loading } = useAdmin(); // التغيير هنا لـ roadmapCourses
  const [selectedMajor, setSelectedMajor] = useState('se');
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [showMajorSelect, setShowMajorSelect] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const majors = [
    { id: 'cyber', nameAr: 'قسم أمن المعلومات والفضاء الإلكتروني' },
    { id: 'se', nameAr: 'قسم هندسة البرمجيات' },
    { id: 'cs', nameAr: 'قسم علم الحاسوب' },
    { id: 'ns', nameAr: 'شبكات الحاسوب' },
    { id: 'mm', nameAr: 'أنظمة الوسائط المتعددة' },
    { id: 'cis', nameAr: 'قسم نظم المعلومات الحاسوبية' },
    { id: 'dsai', nameAr: 'قسم علم البيانات والذكاء الاصطناعي' }
  ];

  const majorCourses = useMemo(() => {
    if (!roadmapCourses || roadmapCourses.length === 0) return [];
    
    const filtered = roadmapCourses.filter(c => c.department === 'common' || c.department === selectedMajor);
    
    return filtered.map(c => {
      const instructors = facultyMembers
        .filter(m => m.courses && (m.courses.includes(c.course_id) || m.courses.includes(c.name_ar)))
        .map(m => {
          const rawName = m.nameAr || m.name_ar || m.name;
          let nameStr = '';
          
          if (typeof rawName === 'object' && rawName !== null) {
            nameStr = rawName.ar || rawName.en || '';
          } else {
            nameStr = typeof rawName === 'string' ? rawName : (typeof m === 'string' ? m : '');
          }

          if (nameStr && !nameStr.includes('د.') && !nameStr.includes('دكتور')) {
            return `د. ${nameStr}`;
          }
          return nameStr;
        })
        .filter(name => !!name);
      return { 
        ...c, 
        name: c.name_ar, 
        desc: c.description_ar, 
        instructors 
      };
    });
  }, [roadmapCourses, facultyMembers, selectedMajor]);

  const currentCourses = majorCourses;

  const coursesByYearAndSem = useMemo(() => {
    const data = {};
    [1, 2, 3, 4].forEach(y => {
      data[y] = { 1: [], 2: [] };
      [1, 2].forEach(s => {
        data[y][s] = currentCourses.filter(c => c.year === y && c.semester === s);
      });
    });
    return data;
  }, [currentCourses]);

  const isActuallyLoading = loading || (roadmapCourses.length === 0);

  return (
    <div className="roadmap-container" style={{ padding: isMobile ? '0.5rem' : '1.5rem', position: 'relative' }}>
      {/* Header */}
      <div className="glass-panel" style={{ 
        display: 'flex', 
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between', 
        alignItems: isMobile ? 'stretch' : 'center', 
        marginBottom: '3rem', 
        padding: isMobile ? '1.2rem' : '2.5rem', 
        borderRadius: '30px', 
        border: '1px solid var(--glass-border)', 
        background: 'var(--glass-bg)', 
        backdropFilter: 'blur(20px)',
        gap: isMobile ? '1.5rem' : '0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.2rem' }}>
          <div style={{ padding: '1rem', background: 'var(--primary-color)', borderRadius: '18px', color: 'white' }}>
            <Layers size={isMobile ? 24 : 36} />
          </div>
          <div>
            <h2 style={{ margin: 0, fontSize: isMobile ? '1.1rem' : '2.4rem', fontWeight: '900', color: 'var(--text-primary)' }}>خارطة المواد الذكية</h2>
            <p style={{ margin: '5px 0 0', fontSize: '0.9rem', color: 'var(--text-secondary)' }}>الدليل الأكاديمي الشامل لطلبة الكلية</p>
          </div>
        </div>
        
        <div style={{ position: 'relative' }}>
          <button 
            className="btn-outline" 
            onClick={() => setShowMajorSelect(!showMajorSelect)}
            style={{ padding: '0.8rem 1.5rem', borderRadius: '40px', fontWeight: '900', display: 'flex', alignItems: 'center', gap: '0.8rem', cursor: 'pointer' }}
          >
            {majors.find(m => m.id === selectedMajor)?.nameAr}
            <ChevronDown size={18} />
          </button>

          <AnimatePresence>
            {showMajorSelect && (
              <motion.div 
                initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 15 }}
                style={{ 
                  position: 'absolute', 
                  top: '120%', 
                  [lang === 'ar' ? 'right' : 'left']: 0, 
                  zIndex: 999999, 
                  background: 'var(--bg-color-secondary)', 
                  border: '1px solid var(--surface-border)', 
                  borderRadius: '25px', 
                  padding: '1.2rem', 
                  width: '320px', 
                  boxShadow: 'var(--shadow-lg)' 
                }}
              >
                {majors.map(m => (
                  <div key={m.id} onClick={() => { setSelectedMajor(m.id); setShowMajorSelect(false); }} style={{ padding: '1rem 1.2rem', cursor: 'pointer', borderRadius: '15px', background: selectedMajor === m.id ? 'rgba(var(--primary-rgb), 0.1)' : 'transparent', color: selectedMajor === m.id ? 'var(--primary-color)' : 'var(--text-primary)', marginBottom: '0.5rem', textAlign: 'right', fontWeight: 'bold' }}>{m.nameAr}</div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Course Grid */}
      {isActuallyLoading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {[1, 2].map(year => (
            <div key={year} style={{ display: 'flex', flexDirection: 'column', gap: '2rem', opacity: 0.5 }}>
              <div style={{ width: '200px', height: '40px', background: 'rgba(255,255,255,0.1)', borderRadius: '20px' }}></div>
              <div style={{ display: 'flex', gap: '3rem' }}>
                {[1, 2].map(s => (
                  <div key={s} style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem' }}>
                    {[1, 2, 3, 4].map(i => (
                      <div key={i} style={{ height: '100px', background: 'rgba(255,255,255,0.05)', borderRadius: '22px' }}></div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : currentCourses.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '5rem', color: 'var(--text-secondary)', borderRadius: '30px' }}>
           <BookOpen size={48} style={{ marginBottom: '1.5rem', opacity: 0.3 }} />
           <h3>لا توجد مواد مسجلة لهذا القسم حالياً.</h3>
           <p>يرجى التأكد من تشغيل كود الـ SQL في Supabase.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '5rem' }}>
          {[1, 2, 3, 4].map(year => (
            <div key={year} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <div style={{ padding: '0.8rem 3rem', background: 'rgba(var(--accent-rgb), 0.15)', borderRadius: '50px', width: 'fit-content', border: '1px solid rgba(var(--accent-rgb), 0.3)', color: 'var(--accent-color)', fontWeight: '900', fontSize: '1.3rem' }}>السنة الدراسية {year}</div>
              <div style={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '3rem' }}>
                {[1, 2].map(sem => (
                  <div key={sem} style={{ flex: 1 }}>
                    <div style={{ padding: '0.8rem 1.2rem', borderBottom: '3px solid rgba(255,255,255,0.05)', marginBottom: '1.8rem', color: 'var(--text-secondary)', textAlign: 'right', fontWeight: '900', fontSize: '1.2rem' }}>الفصل {sem === 1 ? 'الأول' : 'الثاني'}</div>
                    <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1.2rem' }}>
                      {coursesByYearAndSem[year][sem].map(course => (
                        <div 
                          key={course.course_id} 
                          onClick={() => setSelectedCourse(course)}
                          className="course-card-optimized"
                          style={{ 
                            padding: '1.5rem 1.2rem', 
                            borderRadius: '22px', 
                            background: 'var(--surface-color)', 
                            border: '1px solid var(--surface-border)', 
                            cursor: 'pointer', 
                            textAlign: 'right', 
                            boxShadow: 'var(--shadow-md)',
                            transition: 'transform 0.2s, background 0.2s'
                          }}
                        >
                          <div style={{ fontSize: '0.7rem', opacity: 0.4, marginBottom: '0.6rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>{course.course_id}</div>
                          <div style={{ fontWeight: '900', fontSize: '1rem', color: 'var(--text-primary)', lineHeight: '1.4' }}>{course.name_ar}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal - Force Perfect Centering using Portal to escape parent transforms */}
      {selectedCourse && ReactDOM.createPortal(
        <div style={{ 
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          zIndex: 99999999, 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          background: 'rgba(0,0,0,0.85)',
          padding: isMobile ? '10px' : '20px'
        }}>
          <div 
            onClick={() => setSelectedCourse(null)} 
            style={{ position: 'absolute', inset: 0, cursor: 'pointer' }} 
          />
          <div 
            style={{ 
              position: 'relative', 
              width: isMobile ? '95%' : '90%', 
              maxWidth: '600px', 
              background: 'linear-gradient(135deg, var(--bg-color-secondary) 0%, #1a1f2b 100%)', 
              padding: isMobile ? '1.5rem' : '2.5rem', 
              borderRadius: '30px', 
              border: '1px solid rgba(255,255,255,0.1)', 
              maxHeight: '90vh', 
              overflowY: 'auto', 
              boxShadow: '0 30px 70px rgba(0,0,0,0.8)',
              display: 'flex',
              flexDirection: 'column',
              zIndex: 100000000
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
               <div style={{ background: 'var(--primary-color)', padding: '0.4rem 1rem', borderRadius: '12px', color: '#fff', fontWeight: '900', fontSize: '0.85rem' }}>{selectedCourse.course_id}</div>
               <button onClick={() => setSelectedCourse(null)} style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white', padding: '0.7rem', borderRadius: '50%', cursor: 'pointer' }}><X size={22} /></button>
            </div>

            <h2 style={{ margin: '0 0 1.2rem', fontSize: isMobile ? '1.4rem' : '2rem', fontWeight: '900', color: 'var(--text-primary)', textAlign: 'right' }}>{selectedCourse.name_ar}</h2>
            
            <div style={{ background: 'rgba(255,255,255,0.03)', padding: '1.2rem', borderRadius: '22px', marginBottom: '1.5rem', textAlign: 'right', border: '1px solid rgba(255,255,255,0.05)' }}>
               <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', lineHeight: '1.7', margin: 0 }}>{selectedCourse.description_ar}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
               <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', textAlign: 'right', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--accent-color)', marginBottom: '0.6rem', fontWeight: 'bold' }}>مستوى الصعوبة</div>
                  <div style={{ display: 'flex', gap: '4px', flexDirection: 'row-reverse' }}>
                     {[1, 2, 3, 4, 5].map(i => <div key={i} style={{ flex: 1, height: '6px', borderRadius: '3px', background: i <= selectedCourse.difficulty ? 'var(--accent-color)' : 'rgba(255,255,255,0.1)' }} />)}
                  </div>
               </div>
               <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.02)', borderRadius: '20px', textAlign: 'right', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ fontSize: '0.7rem', color: 'var(--primary-color)', marginBottom: '0.6rem', fontWeight: 'bold' }}>الساعات المعتمدة</div>
                  <div style={{ fontWeight: '900', color: 'var(--text-primary)', fontSize: '1.1rem' }}>{selectedCourse.hours} ساعات</div>
               </div>
            </div>

            {selectedCourse.skills && selectedCourse.skills.length > 0 && (
              <div style={{ marginBottom: '1.5rem' }}>
                 <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.8rem', textAlign: 'right' }}>المهارات المكتسبة:</div>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'flex-end' }}>
                    {selectedCourse.skills.map(skill => (
                      <span key={skill} style={{ background: 'rgba(var(--primary-rgb), 0.1)', color: 'var(--primary-color)', padding: '0.3rem 0.8rem', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }}>{skill}</span>
                    ))}
                 </div>
              </div>
            )}

            <div style={{ background: 'rgba(var(--accent-rgb), 0.05)', padding: '1.2rem', borderRadius: '20px', marginBottom: '2rem', textAlign: 'right', border: '1px solid rgba(var(--accent-rgb), 0.1)' }}>
               <div style={{ fontSize: '0.75rem', color: 'var(--accent-color)', marginBottom: '0.5rem', fontWeight: 'bold' }}>الهيئة التدريسية المعتمدة:</div>
               <div style={{ fontWeight: 'bold', fontSize: '0.95rem', color: 'var(--text-primary)' }}>
                 {selectedCourse.instructors?.length > 0 ? selectedCourse.instructors.join(' - ') : 'سيتم التكليف بالهيئة التدريسية لاحقاً'}
               </div>
            </div>

            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '1.2rem', borderRadius: '18px', fontWeight: '900' }} 
              onClick={() => setSelectedCourse(null)}
            >
              إغلاق
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};

export default CourseRoadmap;
