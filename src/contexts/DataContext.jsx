import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB_SCHEMA } from '../data/db_schema';
import { supabase } from '../lib/supabase';

const DataContext = createContext();

export const DataProvider = ({ children }) => {

  const [facultyData, setFacultyData] = useState(DB_SCHEMA.facultyInfo);
  const [roadmap, setRoadmap] = useState(DB_SCHEMA.roadmap);
  const [gradTemplates, setGradTemplates] = useState(DB_SCHEMA.gradTemplates);
  const [projectBank, setProjectBank] = useState([]);
  const [cvTemplates, setCvTemplates] = useState(DB_SCHEMA.careerReadiness.cvTemplates);
  const [interviewResources, setInterviewResources] = useState(DB_SCHEMA.careerReadiness.interviews);
  const [linkedinTips, setLinkedinTips] = useState(DB_SCHEMA.careerReadiness.linkedinTips);
  const [facultyMembers, setFacultyMembers] = useState([]);
  const [offeredCourses, setOfferedCourses] = useState([]);
  const [studentTips, setStudentTips] = useState(DB_SCHEMA.studentTips);
  const [quests, setQuests] = useState(DB_SCHEMA.quests);
  const [loading, setLoading] = useState(true);

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

    fetchAllData();
  }, []);

  const addCourse = async (c) => {
    const newCourse = {
      title: c.title,
      hours: c.hours,
      instructor_id: c.instructorId || c.instructor_id,
      state: c.state
    };
    const { data, error } = await supabase.from('offered_courses').insert([newCourse]).select();
    if (data) setOfferedCourses(prev => [...prev, data[0]]);
  };

  const deleteCourse = async (id) => {
    const { error } = await supabase.from('offered_courses').delete().eq('id', id);
    if (!error) setOfferedCourses(prev => prev.filter(c => c.id !== id));
  };
  
  const addTip = (t) => setStudentTips(prev => [...prev, { ...t, id: Date.now() }]);
  const deleteTip = (id) => setStudentTips(prev => prev.filter(t => t.id !== id));

  const addQuest = (q) => setQuests(prev => [...prev, { ...q, id: Date.now() }]);
  const deleteQuest = (id) => setQuests(prev => prev.filter(q => q.id !== id));

  const addFaculty = async (member) => {
    const newMember = {
      name: member.name,
      department_id: member.departmentId || member.department_id,
      role: member.role,
      specialization: member.specialization,
      office: member.office,
      office_hours: member.officeHours || member.office_hours
    };
    const { data, error } = await supabase.from('faculty_members').insert([newMember]).select();
    if (data) setFacultyMembers(prev => [...prev, data[0]]);
  };

  const editFaculty = async (updated) => {
    const dbData = {
      name: updated.name,
      department_id: updated.departmentId || updated.department_id,
      role: updated.role,
      specialization: updated.specialization,
      office: updated.office,
      office_hours: updated.officeHours || updated.office_hours
    };
    const { error } = await supabase.from('faculty_members').update(dbData).eq('id', updated.id);
    if (!error) setFacultyMembers(prev => prev.map(m => m.id === updated.id ? updated : m));
  };

  const deleteFaculty = async (id) => {
    const { error } = await supabase.from('faculty_members').delete().eq('id', id);
    if (!error) setFacultyMembers(prev => prev.filter(m => m.id !== id));
  };
  
  const updateFaculty = (newData) => setFacultyData(prev => ({ ...prev, ...newData }));
  
  const addProject = async (project) => {
    const newProject = {
      name_ar: project.name?.ar || project.name_ar,
      name_en: project.name?.en || project.name_en,
      supervisor_id: project.supervisorId || project.supervisor_id,
      rating: project.rating || 0,
      notes_ar: project.notes?.ar || project.notes_ar
    };
    const { data, error } = await supabase.from('project_bank').insert([newProject]).select();
    if (data) setProjectBank(prev => [...prev, {
      ...data[0],
      name: { ar: data[0].name_ar, en: data[0].name_en },
      notes: { ar: data[0].notes_ar, en: '' }
    }]);
  };

  const deleteProject = async (id) => {
    const { error } = await supabase.from('project_bank').delete().eq('id', id);
    if (!error) setProjectBank(prev => prev.filter(p => p.id !== id));
  };

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
