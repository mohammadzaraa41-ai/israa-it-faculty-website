import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB_SCHEMA } from '../data/db_schema';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('adminAuth') === 'true';
  });

  const [facultyMembers, setFacultyMembers] = useState(() => {
    try {
      const saved = localStorage.getItem('facultyMembers');
      if (saved === 'null' || saved === null) return DB_SCHEMA.facultyMembers;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : DB_SCHEMA.facultyMembers;
    } catch (e) {
      console.error("Error parsing facultyMembers:", e);
      return DB_SCHEMA.facultyMembers;
    }
  });

  const [departments, setDepartments] = useState(() => {
    try {
      const saved = localStorage.getItem('site_departments');
      if (saved === 'null' || saved === null) return DB_SCHEMA.departments;
      const parsed = JSON.parse(saved);
      return Array.isArray(parsed) ? parsed : DB_SCHEMA.departments;
    } catch (e) {
      return DB_SCHEMA.departments;
    }
  });

  const [students, setStudents] = useState(() => {
    try {
      const saved = localStorage.getItem('students');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { return []; }
  });

  const [pendingRegistrations, setPendingRegistrations] = useState(() => {
    try {
      const saved = localStorage.getItem('pendingRegistrations');
      return saved ? JSON.parse(saved) : [
        { id: 101, name: 'محمد علي', type: 'Student', major: 'علم حاسوب', date: '2026-04-20' },
        { id: 102, name: 'د. خالد حسن', type: 'Faculty', department: 'أمن المعلومات', date: '2026-04-21' }
      ];
    } catch (e) { return []; }
  });

  const [offeredCourses, setOfferedCourses] = useState(() => {
    try {
      const saved = localStorage.getItem('offeredCourses');
      return saved ? JSON.parse(saved) : [
        { id: 1, title: 'معسكر تطوير واجهات الويب (React)', hours: '40 ساعة', instructor: 'د. أحمد', state: 'متاح للتسجيل' },
        { id: 2, title: 'دورة الأمن السيبراني المتقدم', hours: '30 ساعة', instructor: 'م. سارة', state: 'متاح للتسجيل' },
        { id: 3, title: 'تحليل البيانات باستخدام Python', hours: '25 ساعة', instructor: 'د. عمر', state: 'مغلق' },
      ];
    } catch (e) { return []; }
  });

  const [studentTips, setStudentTips] = useState(() => {
    const saved = localStorage.getItem('studentTips');
    return saved ? JSON.parse(saved) : [
      { id: 1, text: 'احرص على تنظيم وقتك بين المحاضرات والمشاريع العملية.' },
      { id: 2, text: 'لا تعتمد على المادة النظرية فقط، البرمجة تحتاج لممارسة يومية بيدك.' },
      { id: 3, text: 'شارك في المسابقات البرمجية (مثل IEEE و ACM) لتقوية مهاراتك.' },
      { id: 4, text: 'ابنِ شبكة علاقات مع زملائك ودكاترتك، العمل الجماعي أساس النجاح.' },
    ];
  });

  const [quests, setQuests] = useState(() => {
    const saved = localStorage.getItem('quests');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: 'حل 5 تحديات على LeetCode', xp: 50 },
      { id: 2, title: 'بناء مشروع React.js بسيط', xp: 100 },
      { id: 3, title: 'تعلم أساسيات Git & GitHub', xp: 80 },
      { id: 4, title: 'حضور ورشة عمل تقنية في الكلية', xp: 120 },
      { id: 5, title: 'المساهمة في مشروع مفتوح المصدر', xp: 200 },
    ];
  });

  // Prospective Graduates content
  const [gradTemplates, setGradTemplates] = useState(() => {
    const saved = localStorage.getItem('gradTemplates');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: { ar: 'قالب التقرير النهائي', en: 'Final Report Template' }, type: 'doc' },
      { id: 2, name: { ar: 'نموذج العرض التقديمي', en: 'Presentation Template' }, type: 'ppt' }
    ];
  });

  const [projectBank, setProjectBank] = useState(() => {
    const saved = localStorage.getItem('projectBank');
    return saved ? JSON.parse(saved) : [
      { 
        id: 1, 
        name: { ar: 'نظام إدارة المستشفيات الذكي', en: 'Smart Hospital Management' }, 
        students: ['أحمد محمد', 'خالد علي', 'رامي حسن'], 
        supervisor: 'د. سارة عيسى', 
        link: 'https://demo.project.com',
        files: [{ name: 'Final Report.pdf', type: 'pdf' }, { name: 'Manual.docx', type: 'docx' }],
        images: ['https://placehold.co/600x400?text=Project+1', 'https://placehold.co/600x400?text=Project+2'],
        rating: 4.5,
        notes: { ar: 'مشروع متميز جداً واستخدم تقنيات حديثة.', en: 'Excellent project using modern tech.' }
      }
    ];
  });

  const [cvTemplates, setCvTemplates] = useState(() => {
    const saved = localStorage.getItem('cvTemplates');
    return saved ? JSON.parse(saved) : [
      { id: 1, name: { ar: 'سيرة ذاتية تقنية - نمط 1', en: 'Tech CV - Style 1' }, file: 'template1.docx' }
    ];
  });

  const [interviewResources, setInterviewResources] = useState(() => {
    const saved = localStorage.getItem('interviewResources');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: { ar: 'أسئلة خوارزميات', en: 'Algo Questions' }, type: 'text', content: '...' },
      { id: 2, title: { ar: 'فيديو تحضيري', en: 'Prep Video' }, type: 'video', url: 'https://youtube.com/...' }
    ];
  });

  const [linkedinTips, setLinkedinTips] = useState(() => {
    const saved = localStorage.getItem('linkedinTips');
    return saved ? JSON.parse(saved) : [
      { id: 1, title: { ar: 'تحسين البروفايل', en: 'Profile Optimization' }, type: 'tip', content: '...' },
      { id: 2, title: { ar: 'رابط خبير', en: 'Expert Link' }, type: 'link', url: 'https://linkedin.com/in/...' }
    ];
  });

  // Social Feed & Announcements
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem('site_posts');
    return saved ? JSON.parse(saved) : DB_SCHEMA.posts;
  });

  const [pendingPosts, setPendingPosts] = useState(() => {
    const saved = localStorage.getItem('site_pending_posts');
    return saved ? JSON.parse(saved) : DB_SCHEMA.pendingPosts;
  });

  const [announcements, setAnnouncements] = useState(() => {
    const saved = localStorage.getItem('site_announcements');
    return saved ? JSON.parse(saved) : DB_SCHEMA.announcements;
  });

  const [events, setEvents] = useState(() => {
    const saved = localStorage.getItem('site_events');
    return saved ? JSON.parse(saved) : [
      { id: 1, date: '28 APR', text: { ar: "يوم مفتوح لمشاريع التخرج", en: "Graduation Projects Open Day" } },
      { id: 2, date: '30 APR', text: { ar: "ورشة عمل الأمن السيبراني", en: "Cyber Security Workshop" } }
    ];
  });

  // Persist data
  useEffect(() => {
    localStorage.setItem('adminAuth', isAuthenticated);
  }, [isAuthenticated]);

  useEffect(() => {
    localStorage.setItem('facultyMembers', JSON.stringify(facultyMembers || []));
    localStorage.setItem('site_departments', JSON.stringify(departments || []));
    localStorage.setItem('students', JSON.stringify(students || []));
    localStorage.setItem('pendingRegistrations', JSON.stringify(pendingRegistrations || []));
    localStorage.setItem('offeredCourses', JSON.stringify(offeredCourses || []));
    localStorage.setItem('studentTips', JSON.stringify(studentTips || []));
    localStorage.setItem('quests', JSON.stringify(quests || []));
    localStorage.setItem('gradTemplates', JSON.stringify(gradTemplates || []));
    localStorage.setItem('projectBank', JSON.stringify(projectBank || []));
    localStorage.setItem('cvTemplates', JSON.stringify(cvTemplates || []));
    localStorage.setItem('interviewResources', JSON.stringify(interviewResources || []));
    localStorage.setItem('linkedinTips', JSON.stringify(linkedinTips || []));
    localStorage.setItem('site_posts', JSON.stringify(posts || []));
    localStorage.setItem('site_pending_posts', JSON.stringify(pendingPosts || []));
    localStorage.setItem('site_announcements', JSON.stringify(announcements || []));
    localStorage.setItem('site_events', JSON.stringify(events || []));
  }, [facultyMembers, departments, students, pendingRegistrations, offeredCourses, studentTips, quests, gradTemplates, projectBank, cvTemplates, interviewResources, linkedinTips, posts, pendingPosts, announcements, events]);

  // Auth functions
  const login = (username, password) => {
    const cleanUser = username.trim();
    const cleanPass = password.trim();
    if (cleanUser === 'AE2551' && cleanPass === 'AE12345') {
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

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
  const addPost = (post, user) => {
    if (!user) return { status: 'ERROR' };
    const newPost = {
      ...post,
      id: Date.now(),
      author: { 
        name: user.name?.ar || user.name || user.username, 
        role: user.role,
        username: user.username 
      },
      date: new Date().toLocaleDateString('en-GB'),
      likes: [],
      comments: []
    };

    if (user.role === 'STUDENT') {
      setPendingPosts(prev => [newPost, ...(prev || [])]);
      return { status: 'PENDING' };
    } else {
      setPosts(prev => [newPost, ...(prev || [])]);
      return { status: 'PUBLISHED' };
    }
  };

  const approvePost = (postId) => {
    const post = pendingPosts.find(p => p.id === postId);
    if (post) {
      setPosts([post, ...posts]);
      setPendingPosts(pendingPosts.filter(p => p.id !== postId));
    }
  };

  const rejectPost = (postId) => {
    setPendingPosts(pendingPosts.filter(p => p.id !== postId));
  };

  const deletePost = (postId) => {
    setPosts(posts.filter(p => p.id !== postId));
  };

  const toggleLike = (postId, username) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        const hasLiked = p.likes.includes(username);
        return {
          ...p,
          likes: hasLiked ? p.likes.filter(u => u !== username) : [...p.likes, username]
        };
      }
      return p;
    }));
  };

  const addComment = (postId, comment) => {
    setPosts(posts.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          comments: [...p.comments, { ...comment, id: Date.now(), date: new Date().toISOString() }]
        };
      }
      return p;
    }));
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
      login,
      logout,
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

