import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import CourseRoadmap from '../components/CourseRoadmap';

const CurrentStudents = () => {
  const { t } = useLocale();

  return (
    <div style={{ padding: '2rem', maxWidth: '1280px', margin: '0 auto' }}>
      <CourseRoadmap />
    </div>
  );
};

export default CurrentStudents;
