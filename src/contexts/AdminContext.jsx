import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB_SCHEMA } from '../data/db_schema';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const isAuthenticated = user?.role === 'SUPER_ADMIN' || user?.role === 'DEAN';

  const [facultyMembers, setFacultyMembers] = useState(DB_SCHEMA.facultyMembers);
  const [departments, setDepartments] = useState(DB_SCHEMA.departments);
  const [students, setStudents] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [offeredCourses, setOfferedCourses] = useState([]);
  const [studentTips, setStudentTips] = useState(DB_SCHEMA.studentTips);
  const [quests, setQuests] = useState(DB_SCHEMA.quests);
  const [gradTemplates, setGradTemplates] = useState(DB_SCHEMA.gradTemplates);
  const [projectBank, setProjectBank] = useState([]);
  const [cvTemplates, setCvTemplates] = useState([]);
  const [interviewResources, setInterviewResources] = useState([]);
  const [linkedinTips, setLinkedinTips] = useState([]);

  // Social Feed & Announcements
  const [posts, setPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [announcements, setAnnouncements] = useState(DB_SCHEMA.announcements);
  const [events, setEvents] = useState([
    { id: 1, date: '28 APR', text: { ar: "يوم مفتوح لمشاريع التخرج", en: "Graduation Projects Open Day" } },
    { id: 2, date: '30 APR', text: { ar: "ورشة عمل الأمن السيبراني", en: "Cyber Security Workshop" } }
  ]);

  const [loading, setLoading] = useState(true);

  // --- FETCH SOCIAL FEED FROM SUPABASE ---
  useEffect(() => {
    const fetchSocialData = async () => {
      try {
        const [
          { data: postsData },
          { data: commentsData },
          { data: pendingData }
        ] = await Promise.all([
          supabase.from('posts').select('*').eq('status', 'published').order('created_at', { ascending: false }),
          supabase.from('comments').select('*').order('created_at', { ascending: true }),
          supabase.from('posts').select('*').eq('status', 'pending').order('created_at', { ascending: false })
        ]);

        if (postsData) {
          const processedPosts = postsData.map(p => ({
            ...p,
            author: { name: p.author_name, role: p.author_role },
            date: new Date(p.created_at).toLocaleDateString('en-GB'),
            comments: commentsData ? commentsData.filter(c => c.post_id === p.id) : []
          }));
          setPosts(processedPosts);
        }

        if (pendingData) {
          setPendingPosts(pendingData.map(p => ({
            ...p,
            author: { name: p.author_name, role: p.author_role },
            date: new Date(p.created_at).toLocaleDateString('en-GB'),
            comments: []
          })));
        }
      } catch (err) {
        console.error("Error fetching social feed:", err);
      }
      setLoading(false);
    };
    fetchSocialData();
  }, []);

  // Persistence (Fallback for non-DB entities)
  useEffect(() => {
    localStorage.setItem('facultyMembers', JSON.stringify(facultyMembers || []));
    localStorage.setItem('site_departments', JSON.stringify(departments || []));
    localStorage.setItem('site_announcements', JSON.stringify(announcements || []));
    localStorage.setItem('site_events', JSON.stringify(events || []));
  }, [facultyMembers, departments, announcements, events]);



  // Faculty functions
  const addFaculty = (member) => {
    setFacultyMembers([...facultyMembers, { ...member, id: Date.now() }]);
  };
  const editFaculty = (updatedMember) => {
    setFacultyMembers(facultyMembers.map(m => m.id === updatedMember.id ? updatedMember : m));
  };
  const deleteFaculty = (id) => {
    setFacultyMembers(prev => prev.filter(m => m.id !== id));
  };

  // Department functions
  const addDepartment = (dept) => {
    setDepartments(prev => [...prev, { ...dept, id: dept.id || `dept_${Date.now()}` }]);
  };
  const deleteDepartment = (id) => {
    setDepartments(prev => prev.filter(d => d.id !== id));
  };
  const updateDepartment = (updatedDept) => {
    setDepartments(prev => prev.map(d => d.id === updatedDept.id ? updatedDept : d));
  };

  // Social Feed Actions
  const addPost = async (post, user) => {
    if (!user) return { status: 'ERROR' };
    
    const newPost = {
      content: post.content,
      image: post.image,
      author_id: user.id,
      author_name: user.name?.ar || user.name || user.username,
      author_role: user.role,
      status: user.role === 'STUDENT' ? 'pending' : 'published',
      likes: []
    };

    const { data, error } = await supabase.from('posts').insert([newPost]).select();
    if (error) return { status: 'ERROR', message: error.message };

    const processed = {
      ...data[0],
      author: { name: data[0].author_name, role: data[0].author_role },
      date: new Date(data[0].created_at).toLocaleDateString('en-GB'),
      comments: []
    };

    if (newPost.status === 'pending') {
      setPendingPosts(prev => [processed, ...prev]);
      return { status: 'PENDING' };
    } else {
      setPosts(prev => [processed, ...prev]);
      return { status: 'PUBLISHED' };
    }
  };

  const approvePost = async (postId) => {
    const { error } = await supabase.from('posts').update({ status: 'published' }).eq('id', postId);
    if (!error) {
      const post = pendingPosts.find(p => p.id === postId);
      if (post) {
        setPosts([post, ...posts]);
        setPendingPosts(pendingPosts.filter(p => p.id !== postId));
      }
    }
  };

  const rejectPost = async (postId) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) setPendingPosts(pendingPosts.filter(p => p.id !== postId));
  };

  const deletePost = async (postId) => {
    const { error } = await supabase.from('posts').delete().eq('id', postId);
    if (!error) setPosts(posts.filter(p => p.id !== postId));
  };

  const toggleLike = async (postId, username) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;

    const hasLiked = post.likes.includes(username);
    const newLikes = hasLiked ? post.likes.filter(u => u !== username) : [...post.likes, username];

    const { error } = await supabase.from('posts').update({ likes: newLikes }).eq('id', postId);
    if (!error) {
      setPosts(posts.map(p => p.id === postId ? { ...p, likes: newLikes } : p));
    }
  };

  const addComment = async (postId, comment) => {
    const newComment = {
      post_id: postId,
      author_name: comment.author?.name || 'User',
      author_role: comment.author?.role || 'STUDENT',
      content: comment.content
    };

    const { data, error } = await supabase.from('comments').insert([newComment]).select();
    if (!error && data) {
      setPosts(posts.map(p => {
        if (p.id === postId) {
          return {
            ...p,
            comments: [...(p.comments || []), data[0]]
          };
        }
        return p;
      }));
    }
  };

  const addAnnouncement = (ann) => setAnnouncements([...announcements, { ...ann, id: Date.now() }]);
  const deleteAnnouncement = (id) => setAnnouncements(announcements.filter(a => a.id !== id));
  const updateAnnouncement = (id, text, lang) => {
    setAnnouncements(announcements.map(a => 
      a.id === id ? { ...a, text: { ...a.text, [lang]: text } } : a
    ));
  };

  const addEvent = (event) => setEvents([...events, { ...event, id: Date.now() }]);
  const deleteEvent = (id) => setEvents(events.filter(e => e.id !== id));
  const updateEvent = (updatedEvent) => {
    setEvents(events.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  // Registration functions
  const approveRegistration = (reg) => {
    if (reg.type === 'Student') {
      setStudents(prev => [...prev, { id: Date.now(), name: reg.name, major: reg.major, year: '1st Year' }]);
    } else {
      addFaculty({ 
        name: reg.name, 
        departmentId: reg.departmentId || (departments[0]?.id), 
        role: 'New Faculty' 
      });
    }
    setPendingRegistrations(prev => prev.filter(p => p.id !== reg.id));
  };

  const rejectRegistration = (id) => {
    setPendingRegistrations(pendingRegistrations.filter(p => p.id !== id));
  };

  const registerUserDirectly = (user) => {
    if (user.type === 'Student') {
      setStudents([...students, { id: Date.now(), name: user.name, major: user.major, year: user.year || '1st Year' }]);
    } else {
      addFaculty({ name: user.name, department: user.department, role: user.role || 'Faculty' });
    }
  };

  const submitRegistrationApplication = (application) => {
    setPendingRegistrations([
      ...pendingRegistrations, 
      { 
        id: Date.now(), 
        name: application.name, 
        type: application.type || 'Student', 
        major: application.major, 
        date: new Date().toISOString().split('T')[0] 
      }
    ]);
  };

  // Content Management Functions
  const addCourse = (course) => setOfferedCourses([...offeredCourses, { ...course, id: Date.now() }]);
  const deleteCourse = (id) => setOfferedCourses(offeredCourses.filter(c => c.id !== id));
  const editCourse = (updatedCourse) => setOfferedCourses(offeredCourses.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  const reorderCourses = (newOrder) => setOfferedCourses(newOrder);
  
  const addTip = (text) => setStudentTips([...studentTips, { text, id: Date.now() }]);
  const deleteTip = (id) => setStudentTips(studentTips.filter(t => t.id !== id));
  const editTip = (id, text) => setStudentTips(studentTips.map(t => t.id === id ? { ...t, text } : t));
  const reorderTips = (newOrder) => setStudentTips(newOrder);
  
  const addQuest = (quest) => setQuests([...quests, { ...quest, id: Date.now() }]);
  const deleteQuest = (id) => setQuests(quests.filter(q => q.id !== id));
  const editQuest = (updatedQuest) => setQuests(quests.map(q => q.id === updatedQuest.id ? updatedQuest : q));
  const reorderQuests = (newOrder) => setQuests(newOrder);

  // Alumni Management
  const addGradTemplate = (t) => setGradTemplates([...gradTemplates, { ...t, id: Date.now() }]);
  const deleteGradTemplate = (id) => setGradTemplates(gradTemplates.filter(t => t.id !== id));
  const editGradTemplate = (id, newName, lang) => {
    setGradTemplates(gradTemplates.map(t => t.id === id ? { ...t, name: { ...t.name, [lang]: newName } } : t));
  };
  
  const addProject = (p) => setProjectBank([...projectBank, { ...p, id: Date.now() }]);
  const deleteProject = (id) => setProjectBank(projectBank.filter(p => p.id !== id));
  
  const addCvTemplate = (t) => setCvTemplates([...cvTemplates, { ...t, id: Date.now() }]);
  const deleteCvTemplate = (id) => setCvTemplates(cvTemplates.filter(t => t.id !== id));
  
  const addInterviewResource = (r) => setInterviewResources([...interviewResources, { ...r, id: Date.now() }]);
  const deleteInterviewResource = (id) => setInterviewResources(interviewResources.filter(r => r.id !== id));
  
  const addLinkedinTip = (t) => setLinkedinTips([...linkedinTips, { ...t, id: Date.now() }]);
  const deleteLinkedinTip = (id) => setLinkedinTips(linkedinTips.filter(t => t.id !== id));

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      facultyMembers,
      addFaculty,
      editFaculty,
      deleteFaculty,
      students,
      pendingRegistrations,
      approveRegistration,
      rejectRegistration,
      registerUserDirectly,
      submitRegistrationApplication,
      offeredCourses, addCourse, deleteCourse, editCourse, reorderCourses,
      studentTips, addTip, deleteTip, editTip, reorderTips,
      quests, addQuest, deleteQuest, editQuest, reorderQuests,
      gradTemplates, addGradTemplate, deleteGradTemplate, editGradTemplate,
      projectBank, addProject, deleteProject,
      cvTemplates, addCvTemplate, deleteCvTemplate,
      interviewResources, addInterviewResource, deleteInterviewResource,
      linkedinTips, addLinkedinTip, deleteLinkedinTip,
      departments, addDepartment, deleteDepartment, updateDepartment,
      posts, addPost, approvePost, rejectPost, deletePost, toggleLike, addComment, pendingPosts,
      announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement,
      events, addEvent, deleteEvent, updateEvent
    }}>
      {children}
    </AdminContext.Provider>
  );
};

