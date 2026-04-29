import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB_SCHEMA } from '../data/db_schema';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // --- SITE CONTENT STATE (THE "DATABASE") ---
  
  // Faculty Info
  const [facultyData, setFacultyData] = useState(() => {
    const saved = localStorage.getItem('db_faculty');
    return saved ? JSON.parse(saved) : DB_SCHEMA.facultyInfo;
  });

  // Roadmap
  const [roadmap, setRoadmap] = useState(() => {
    const saved = localStorage.getItem('db_roadmap');
    return saved ? JSON.parse(saved) : DB_SCHEMA.roadmap;
  });

  // Alumni & Career
  const [gradTemplates, setGradTemplates] = useState(() => {
    const saved = localStorage.getItem('db_grad_templates');
    return saved ? JSON.parse(saved) : DB_SCHEMA.gradTemplates;
  });

  const [projectBank, setProjectBank] = useState(() => {
    const saved = localStorage.getItem('db_projects');
    return saved ? JSON.parse(saved) : DB_SCHEMA.projectBank;
  });

  const [cvTemplates, setCvTemplates] = useState(() => {
    const saved = localStorage.getItem('db_cvs');
    return saved ? JSON.parse(saved) : DB_SCHEMA.careerReadiness.cvTemplates;
  });

  const [interviewResources, setInterviewResources] = useState(() => {
    const saved = localStorage.getItem('db_interviews');
    return saved ? JSON.parse(saved) : DB_SCHEMA.careerReadiness.interviews;
  });

  const [linkedinTips, setLinkedinTips] = useState(() => {
    const saved = localStorage.getItem('db_linkedin');
    return saved ? JSON.parse(saved) : DB_SCHEMA.careerReadiness.linkedinTips;
  });

  const [facultyMembers, setFacultyMembers] = useState(() => {
    const saved = localStorage.getItem('db_faculty_members');
    return saved ? JSON.parse(saved) : [];
  });

  // --- PERSISTENCE ---
  useEffect(() => {
    localStorage.setItem('db_faculty', JSON.stringify(facultyData));
    localStorage.setItem('db_roadmap', JSON.stringify(roadmap));
    localStorage.setItem('db_grad_templates', JSON.stringify(gradTemplates));
    localStorage.setItem('db_projects', JSON.stringify(projectBank));
    localStorage.setItem('db_cvs', JSON.stringify(cvTemplates));
    localStorage.setItem('db_interviews', JSON.stringify(interviewResources));
    localStorage.setItem('db_linkedin', JSON.stringify(linkedinTips));
    localStorage.setItem('db_faculty_members', JSON.stringify(facultyMembers));
  }, [facultyData, roadmap, gradTemplates, projectBank, cvTemplates, interviewResources, linkedinTips, facultyMembers]);

  // --- Current Students State ---
  const [offeredCourses, setOfferedCourses] = useState(() => JSON.parse(localStorage.getItem('db_courses') || '[]'));
  const [studentTips, setStudentTips] = useState(() => JSON.parse(localStorage.getItem('db_tips') || '[]'));
  const [quests, setQuests] = useState(() => JSON.parse(localStorage.getItem('db_quests') || '[]'));

  useEffect(() => {
    localStorage.setItem('db_courses', JSON.stringify(offeredCourses));
    localStorage.setItem('db_tips', JSON.stringify(studentTips));
    localStorage.setItem('db_quests', JSON.stringify(quests));
  }, [offeredCourses, studentTips, quests]);

  // --- CRUD OPERATIONS ---
  const addCourse = (c) => setOfferedCourses(prev => [...prev, { ...c, id: Date.now() }]);
  const deleteCourse = (id) => setOfferedCourses(prev => prev.filter(c => c.id !== id));
  
  const addTip = (t) => setStudentTips(prev => [...prev, { ...t, id: Date.now() }]);
  const deleteTip = (id) => setStudentTips(prev => prev.filter(t => t.id !== id));

  const addQuest = (q) => setQuests(prev => [...prev, { ...q, id: Date.now() }]);
  const deleteQuest = (id) => setQuests(prev => prev.filter(q => q.id !== id));
  const addFaculty = (member) => setFacultyMembers(prev => [...prev, { ...member, id: Date.now() }]);
  const editFaculty = (updated) => setFacultyMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
  const deleteFaculty = (id) => setFacultyMembers(prev => prev.filter(m => m.id !== id));
  
  const updateFaculty = (newData) => setFacultyData(prev => ({ ...prev, ...newData }));
  
  const addProject = (project) => setProjectBank(prev => [...prev, { ...project, id: Date.now() }]);
  const deleteProject = (id) => setProjectBank(prev => prev.filter(p => p.id !== id));

  const addGradTemplate = (t) => setGradTemplates(prev => [...prev, { ...t, id: Date.now() }]);
  const deleteGradTemplate = (id) => setGradTemplates(prev => prev.filter(t => t.id !== id));

  const addCvTemplate = (cv) => setCvTemplates(prev => [...prev, { ...cv, id: Date.now() }]);
  const deleteCvTemplate = (id) => setCvTemplates(prev => prev.filter(cv => cv.id !== id));

  const addInterviewResource = (res) => setInterviewResources(prev => [...prev, { ...res, id: Date.now() }]);
  const deleteInterviewResource = (id) => setInterviewResources(prev => prev.filter(r => r.id !== id));

  const addLinkedinTip = (tip) => setLinkedinTips(prev => [...prev, { ...tip, id: Date.now() }]);
  const deleteLinkedinTip = (id) => setLinkedinTips(prev => prev.filter(t => t.id !== id));

  return (
    <DataContext.Provider value={{
      facultyData, updateFaculty,
      facultyMembers, addFaculty, editFaculty, deleteFaculty,
      roadmap,
      gradTemplates, addGradTemplate, deleteGradTemplate,
      projectBank, addProject, deleteProject,
      cvTemplates, addCvTemplate, deleteCvTemplate,
      interviewResources, addInterviewResource, deleteInterviewResource,
      linkedinTips, addLinkedinTip, deleteLinkedinTip,
      offeredCourses, addCourse, deleteCourse,
      studentTips, addTip, deleteTip,
      quests, addQuest, deleteQuest
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => useContext(DataContext);
