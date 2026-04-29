import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB_SCHEMA } from '../data/db_schema';
import { supabase } from '../lib/supabase';

const DataContext = createContext();

export const DataProvider = ({ children }) => {
  // --- SITE CONTENT STATE ---
  const [facultyData, setFacultyData] = useState(DB_SCHEMA.facultyInfo);
  const [roadmap, setRoadmap] = useState(DB_SCHEMA.roadmap);
  const [gradTemplates, setGradTemplates] = useState(DB_SCHEMA.gradTemplates);
  const [projectBank, setProjectBank] = useState([]);
  const [cvTemplates, setCvTemplates] = useState([]);
  const [interviewResources, setInterviewResources] = useState([]);
  const [linkedinTips, setLinkedinTips] = useState([]);
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [offeredCourses, setOfferedCourses] = useState([]);
  const [studentTips, setStudentTips] = useState([]);
  const [quests, setQuests] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH DATA FROM SUPABASE ---
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [
          { data: facultyRes },
          { data: coursesRes },
          { data: projectsRes }
        ] = await Promise.all([
          supabase.from('faculty_members').select('*'),
          supabase.from('offered_courses').select('*'),
          supabase.from('project_bank').select('*')
        ]);

        if (facultyRes) setFacultyMembers(facultyRes);
        if (coursesRes) setOfferedCourses(coursesRes);
        if (projectsRes) setProjectBank(projectsRes.map(p => ({
          ...p,
          name: { ar: p.name_ar, en: p.name_en },
          notes: { ar: p.notes_ar, en: '' }
        })));
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching Supabase data:', error);
        setLoading(false);
      }
    };

  // Roadmap
  const [roadmap, setRoadmap] = useState(DB_SCHEMA.roadmap);

  // Alumni & Career
  const [gradTemplates, setGradTemplates] = useState(DB_SCHEMA.gradTemplates);
  const [cvTemplates, setCvTemplates] = useState(DB_SCHEMA.careerReadiness.cvTemplates);
  const [interviewResources, setInterviewResources] = useState(DB_SCHEMA.careerReadiness.interviews);
  const [linkedinTips, setLinkedinTips] = useState(DB_SCHEMA.careerReadiness.linkedinTips);

  const [studentTips, setStudentTips] = useState(DB_SCHEMA.studentTips);
  const [quests, setQuests] = useState(DB_SCHEMA.quests);

  // Persistence (only for non-Supabase data if needed)
  useEffect(() => {
    // We can keep localStorage as a fallback or for session-only data if desired, 
    // but the main data should come from Supabase now.
  }, [roadmap, gradTemplates, cvTemplates, interviewResources, linkedinTips, studentTips, quests]);

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
