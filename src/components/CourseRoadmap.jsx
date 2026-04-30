import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocale } from '../contexts/LocalizationContext';

const courseData = [
  { id: 'CS101', name: 'Intro to Programming', type: 'core', prereqs: [], year: 1 },
  { id: 'CS102', name: 'Object Oriented Programming', type: 'core', prereqs: ['CS101'], year: 1 },
  { id: 'CS201', name: 'Data Structures', type: 'core', prereqs: ['CS102'], year: 2 },
  { id: 'CS202', name: 'Algorithms', type: 'core', prereqs: ['CS201'], year: 2 },
  { id: 'CS301', name: 'Database Systems', type: 'core', prereqs: ['CS201'], year: 3 },
  { id: 'CS401', name: 'Software Engineering', type: 'major', prereqs: ['CS301'], year: 4 },
  { id: 'CS402', name: 'Graduation Project', type: 'major', prereqs: ['CS401'], year: 4 },
];

const CourseRoadmap = () => {
  const { lang } = useLocale();
  const [selectedCourse, setSelectedCourse] = useState(null);

  const handleCourseClick = (course) => {
    setSelectedCourse(selectedCourse?.id === course.id ? null : course);
  };

  const isHighlighted = (course) => {
    if (!selectedCourse) return false;
    if (course.id === selectedCourse.id) return true;

    return false;
  };

  return (
    <div className="roadmap-container glass-panel" style={{ padding: '2rem', marginTop: '2rem' }}>
      <h2 className="title" style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '2rem' }}>
        {lang === 'ar' ? 'خريطة المواد التفاعلية' : 'Interactive Course Roadmap'}
      </h2>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
        {[1, 2, 3, 4].map(year => (
          <div key={year} style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
            <div style={{ fontWeight: 'bold', width: '80px', textAlign: 'center', color: 'var(--accent-color)' }}>
              {lang === 'ar' ? `السنة ${year}` : `Year ${year}`}
            </div>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', flex: 1 }}>
              {courseData.filter(c => c.year === year).map(course => (
                <motion.div
                  key={course.id}
                  onClick={() => handleCourseClick(course)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    padding: '1rem',
                    borderRadius: '8px',
                    border: `2px solid ${isHighlighted(course) ? 'var(--accent-color)' : 'var(--border-color)'}`,
                    backgroundColor: selectedCourse?.id === course.id ? 'var(--primary-light)' : 'var(--glass-bg)',
                    color: selectedCourse?.id === course.id ? '#fff' : 'inherit',
                    cursor: 'pointer',
                    minWidth: '200px',
                    textAlign: 'center',
                    boxShadow: isHighlighted(course) ? '0 0 15px rgba(244, 180, 26, 0.4)' : 'none',
                    transition: 'all 0.3s'
                  }}
                >
                  <div style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>{course.id}</div>
                  <div style={{ fontSize: '0.9rem' }}>{course.name}</div>
                </motion.div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CourseRoadmap;
