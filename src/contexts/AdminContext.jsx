import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB_SCHEMA } from '../data/db_schema';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from './ToastContext';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const isAdminRole = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);
  const isAuthenticated = isAdminRole;

  const [facultyMembers, setFacultyMembers] = useState([]);
  const [departments, setDepartments] = useState(DB_SCHEMA.departments);
  const [students, setStudents] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [offeredCourses, setOfferedCourses] = useState([]);
  const [studentTips, setStudentTips] = useState([]);
  const [quests, setQuests] = useState([]);
  const [gradTemplates, setGradTemplates] = useState(DB_SCHEMA.gradTemplates);
  const [projectBank, setProjectBank] = useState([]);
  const [cvTemplates, setCvTemplates] = useState([]);
  const [interviewResources, setInterviewResources] = useState([]);
  const [linkedinTips, setLinkedinTips] = useState([]);

  const [posts, setPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      
      const safeFetch = async (table, select = '*') => {
        try {
          const { data, error } = await supabase.from(table).select(select);
          if (error) {
            console.warn(`Table ${table} not found or inaccessible:`, error.message);
            return null;
          }
          return data;
        } catch (err) {
          console.error(`Unexpected error fetching ${table}:`, err);
          return null;
        }
      };

      try {
        // Step 1: Fetch all users to get avatars
        const { data: usersData } = await supabase.from('users').select('username, name_ar, name_en, role, avatar_url');
        const usersMap = {};
        if (usersData) {
          usersData.forEach(u => { usersMap[u.username] = u; });
        }

        // Step 2: Fetch Posts
        const { data: postsData } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'APPROVED')
          .order('created_at', { ascending: false });

        // Step 3: Fetch Comments
        const { data: commentsData } = await supabase
          .from('comments')
          .select('*');

        if (postsData) {
          const formattedPosts = postsData.map(p => {
            // Use author_username to find avatar, fallback to author_name
            const authorUser = usersMap[p.author_username] || {};
            return {
              ...p,
              likes: p.likes || [],
              author: {
                username: p.author_username || p.author_name,
                name: p.author_name || p.author_username,
                role: p.author_role,
                avatar_url: authorUser.avatar_url || null
              },
              date: new Date(p.created_at).toLocaleDateString('en-GB'),
              comments: (commentsData || [])
                .filter(c => c.post_id === p.id)
                .map(c => {
                  const commentAuthor = usersMap[c.author_username] || {};
                  return {
                    id: c.id,
                    author: c.author_name,
                    username: c.author_username,
                    avatar_url: commentAuthor.avatar_url || null,
                    text: c.content,
                    likes: c.likes || [],
                    parent_id: c.parent_id || null
                  };
                })
            };
          });
          setPosts(formattedPosts);
        }

        // Fetch pending posts
        const { data: pendingData } = await supabase
          .from('posts')
          .select('*')
          .eq('status', 'PENDING')
          .order('created_at', { ascending: false });
        if (pendingData) {
          setPendingPosts(pendingData.map(p => ({
            ...p,
            author: { name: p.author_name || p.author_id, role: p.author_role },
            date: new Date(p.created_at).toLocaleDateString('en-GB'),
            comments: []
          })));
        }

        // Fetch other tables individually to avoid one failure breaking all
        const facultyRes = await safeFetch('faculty_members');
        const coursesRes = await safeFetch('offered_courses');
        const tipsRes = await safeFetch('student_tips');
        const questsRes = await safeFetch('quests');
        const annRes = await safeFetch('announcements');
        const eventsRes = await safeFetch('events');
        const deptsRes = await safeFetch('departments');

        if (facultyRes) setFacultyMembers(facultyRes);
        else setFacultyMembers(DB_SCHEMA.facultyMembers);

        if (coursesRes) setOfferedCourses(coursesRes);
        else setOfferedCourses(DB_SCHEMA.offeredCourses);

        if (tipsRes) setStudentTips(tipsRes);
        else setStudentTips(DB_SCHEMA.studentTips);

        if (questsRes) setQuests(questsRes);
        else setQuests(DB_SCHEMA.quests);

        if (annRes) setAnnouncements(annRes);
        else setAnnouncements(DB_SCHEMA.announcements);

        if (eventsRes) setEvents(eventsRes);
        else setEvents(DB_SCHEMA.events);

        if (deptsRes && deptsRes.length > 0) setDepartments(deptsRes);
        else setDepartments(DB_SCHEMA.departments);

      } catch (err) {
        console.error("Critical error in AdminContext fetch:", err);
      }
      setLoading(false);
    };
    fetchAllData();
  }, []);

  // Faculty CRUD
  const addFaculty = async (member) => {
    const cleanMember = {
      name: member.name,
      department_id: member.departmentId || member.department_id,
      role: member.role,
      specialization: member.specialization,
      office: member.office,
      office_hours: member.officeHours || member.office_hours,
      courses: member.courses
    };
    const { data, error } = await supabase.from('faculty_members').insert([cleanMember]).select();
    if (!error && data && data.length > 0) {
      setFacultyMembers(prev => [...prev, data[0]]);
      addToast('تمت الإضافة', 'تم إضافة عضو هيئة التدريس بنجاح', 'success');
    } else {
      console.error("Supabase Error (addFaculty):", error);
      addToast('خطأ في الإضافة', error?.message || 'فشل الاتصال بقاعدة البيانات', 'error');
    }
  };

  const editFaculty = async (updatedMember) => {
    const dbData = {
      name: updatedMember.name,
      department_id: updatedMember.departmentId || updatedMember.department_id,
      role: updatedMember.role,
      specialization: updatedMember.specialization,
      office: updatedMember.office,
      office_hours: updatedMember.officeHours || updatedMember.office_hours,
      courses: updatedMember.courses
    };
    const { error } = await supabase.from('faculty_members').update(dbData).eq('id', updatedMember.id);
    if (!error) {
      setFacultyMembers(prev => prev.map(m => m.id === updatedMember.id ? { ...updatedMember } : m));
      addToast('تم التحديث', 'تم تحديث البيانات بنجاح', 'success');
    } else {
      console.error("Supabase Error (editFaculty):", error);
      addToast('خطأ في التحديث', error?.message || 'فشل تحديث البيانات', 'error');
    }
  };

  const deleteFaculty = async (id) => {
    const { error } = await supabase.from('faculty_members').delete().eq('id', id);
    if (!error) setFacultyMembers(prev => prev.filter(m => m.id !== id));
  };

  // Departments CRUD
  const addDepartment = async (dept) => {
    const newDept = { id: dept.id, name: dept.name };
    const { data, error } = await supabase.from('departments').insert([newDept]).select();
    if (!error && data) setDepartments(prev => [...prev, data[0]]);
  };

  const deleteDepartment = async (id) => {
    const { error } = await supabase.from('departments').delete().eq('id', id);
    if (!error) setDepartments(prev => prev.filter(d => d.id !== id));
  };

  const updateDepartment = async (updatedDept) => {
    const { error } = await supabase.from('departments').update({ name: updatedDept.name }).eq('id', updatedDept.id);
    if (!error) setDepartments(prev => prev.map(d => d.id === updatedDept.id ? updatedDept : d));
  };

  // Social & Feed
  const addPost = async (postData, user) => {
    if (!user) return { status: 'ERROR' };
    const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user.role);

    const { data, error } = await supabase.from('posts').insert([{
      content: postData.content,
      image: postData.image,
      author_username: user.username,
      author_name: user.name?.ar || user.name_ar || user.name?.en || user.name_en || user.username,
      author_role: user.role,
      status: isAdmin ? 'APPROVED' : 'PENDING'
    }]).select();

    if (error) return { status: 'ERROR', message: error.message };

    const newP = {
      ...data[0],
      author: {
        username: user.username,
        name: user.name?.ar || user.name_ar || user.name?.en || user.name_en || user.username,
        role: user.role,
        avatar_url: user.avatar_url || null
      },
      date: new Date().toLocaleDateString('en-GB'),
      comments: []
    };

    if (!isAdmin) {
      setPendingPosts(prev => [newP, ...prev]);
      return { status: 'PENDING' };
    } else {
      setPosts(prev => [newP, ...prev]);
      return { status: 'PUBLISHED' };
    }
  };

  const approvePost = async (postId) => {
    const { error } = await supabase.from('posts').update({ status: 'APPROVED' }).eq('id', postId);
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

  const addComment = async (postId, commentData) => {
    const { data, error } = await supabase.from('comments').insert([{
      post_id: postId,
      content: commentData.text,
      author_name: user.name?.ar || user.name_ar || user.name?.en || user.name_en || user.username,
      author_role: user.role,
      parent_id: commentData.parent_id || null
    }]).select();

    if (!error && data?.length > 0) {
      const newComment = {
        id: data[0].id,
        author: user.name?.ar || user.name_ar || user.name?.en || user.name_en || user.username,
        username: user.username,
        avatar_url: user.avatar_url || null,
        text: data[0].content,
        likes: [],
        parent_id: data[0].parent_id || null
      };
      setPosts(posts.map(p => p.id === postId
        ? { ...p, comments: [...(p.comments || []), newComment] }
        : p
      ));
    }
  };

  const deleteComment = async (commentId, postId) => {
    const { error } = await supabase.from('comments').delete().eq('id', commentId);
    if (!error) {
      setPosts(posts.map(p => p.id === postId
        ? { ...p, comments: p.comments.filter(c => c.id !== commentId) }
        : p
      ));
    }
  };

  const editComment = async (commentId, postId, newText) => {
    const { error } = await supabase.from('comments').update({ content: newText }).eq('id', commentId);
    if (!error) {
      setPosts(posts.map(p => p.id === postId
        ? { ...p, comments: p.comments.map(c => c.id === commentId ? { ...c, text: newText } : c) }
        : p
      ));
    }
  };

  // likeComment: saves to DB using the likes[] column
  const likeComment = async (commentId, postId, username) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;
    const hasLiked = (comment.likes || []).includes(username);
    const newLikes = hasLiked
      ? (comment.likes || []).filter(u => u !== username)
      : [...(comment.likes || []), username];
    
    // Try to save to DB, fallback to local state if column doesn't exist yet
    const { error } = await supabase.from('comments').update({ likes: newLikes }).eq('id', commentId);
    
    // Always update local state regardless of DB result
    setPosts(prev => prev.map(p => p.id === postId
      ? { ...p, comments: p.comments.map(c => c.id === commentId ? { ...c, likes: newLikes } : c) }
      : p
    ));

    if (error) console.warn('likes column may not exist yet, saved locally only:', error.message);
  };

  // Announcements & Events
  const addAnnouncement = async (ann) => {
    const { data, error } = await supabase.from('announcements').insert([{ text: ann.text, type: ann.type }]).select();
    if (!error && data) setAnnouncements(prev => [...prev, data[0]]);
  };
  const deleteAnnouncement = async (id) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (!error) setAnnouncements(prev => prev.filter(a => a.id !== id));
  };
  const updateAnnouncement = async (id, text, lang) => {
    const ann = announcements.find(a => a.id === id);
    if (!ann) return;
    const newText = { ...ann.text, [lang]: text };
    const { error } = await supabase.from('announcements').update({ text: newText }).eq('id', id);
    if (!error) setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, text: newText } : a));
  };

  const addEvent = async (event) => {
    const { data, error } = await supabase.from('events').insert([{ date: event.date, text: event.text }]).select();
    if (!error && data) setEvents(prev => [...prev, data[0]]);
  };
  const deleteEvent = async (id) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) setEvents(prev => prev.filter(e => e.id !== id));
  };
  const updateEvent = async (updatedEvent) => {
    const { error } = await supabase.from('events').update({ date: updatedEvent.date, text: updatedEvent.text }).eq('id', updatedEvent.id);
    if (!error) setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  // Courses, Tips, Quests
  const addCourse = async (course) => {
    const cleanCourse = {
      title: course.title,
      hours: course.hours,
      instructor: course.instructor,
      state: course.state
    };
    const { data, error } = await supabase.from('offered_courses').insert([cleanCourse]).select();
    
    if (!error && data && data.length > 0) {
      setOfferedCourses(prev => [...prev, data[0]]);
      addToast('تمت الإضافة', 'تم إضافة الدورة بنجاح', 'success');
    } else if (!error) {
      const { data: refreshed } = await supabase.from('offered_courses').select('*');
      if (refreshed) setOfferedCourses(refreshed);
      addToast('تمت الإضافة', 'تمت الإضافة بنجاح (تحديث تلقائي)', 'success');
    } else {
      console.error("Supabase Error (addCourse):", error);
      addToast('خطأ في الإضافة', error?.message || 'تأكد من وجود جدول الدورات في قاعدة البيانات', 'error');
    }
  };
  const deleteCourse = async (id) => {
    const { error } = await supabase.from('offered_courses').delete().eq('id', id);
    if (!error) setOfferedCourses(prev => prev.filter(c => c.id !== id));
  };
  const editCourse = async (updatedCourse) => {
    const { error } = await supabase.from('offered_courses').update(updatedCourse).eq('id', updatedCourse.id);
    if (!error) setOfferedCourses(prev => prev.map(c => c.id === updatedCourse.id ? updatedCourse : c));
  };
  const reorderCourses = (newOrder) => setOfferedCourses(newOrder);
  
  const addTip = async (text) => {
    const { data, error } = await supabase.from('student_tips').insert([{ text }]).select();
    if (!error && data && data.length > 0) {
      setStudentTips(prev => [...prev, data[0]]);
      addToast('تمت الإضافة', 'تم إضافة النصيحة بنجاح', 'success');
    } else if (!error) {
      const { data: refreshed } = await supabase.from('student_tips').select('*');
      if (refreshed) setStudentTips(refreshed);
      addToast('تمت الإضافة', 'تمت الإضافة بنجاح', 'success');
    } else {
      console.error("Supabase Error (addTip):", error);
      addToast('خطأ في الإضافة', error?.message || 'تأكد من وجود جدول النصائح في قاعدة البيانات', 'error');
    }
  };
  const deleteTip = async (id) => {
    const { error } = await supabase.from('student_tips').delete().eq('id', id);
    if (!error) setStudentTips(prev => prev.filter(t => t.id !== id));
  };
  const editTip = async (id, text) => {
    const { error } = await supabase.from('student_tips').update({ text }).eq('id', id);
    if (!error) setStudentTips(prev => prev.map(t => t.id === id ? { ...t, text } : t));
  };
  const reorderTips = (newOrder) => setStudentTips(newOrder);
  
  const addQuest = async (quest) => {
    const cleanQuest = {
      title: quest.title,
      xp: quest.xp
    };
    const { data, error } = await supabase.from('quests').insert([cleanQuest]).select();
    if (!error && data && data.length > 0) {
      setQuests(prev => [...prev, data[0]]);
      addToast('تمت الإضافة', 'تم إضافة التحدي بنجاح', 'success');
    } else if (!error) {
      const { data: refreshed } = await supabase.from('quests').select('*');
      if (refreshed) setQuests(refreshed);
      addToast('تمت الإضافة', 'تمت الإضافة بنجاح', 'success');
    } else {
      console.error("Supabase Error (addQuest):", error);
      addToast('خطأ في الإضافة', error?.message || 'تأكد من وجود جدول التحديات في قاعدة البيانات', 'error');
    }
  };
  const deleteQuest = async (id) => {
    const { error } = await supabase.from('quests').delete().eq('id', id);
    if (!error) setQuests(prev => prev.filter(q => q.id !== id));
  };
  const editQuest = async (updatedQuest) => {
    const { error } = await supabase.from('quests').update(updatedQuest).eq('id', updatedQuest.id);
    if (!error) setQuests(prev => prev.map(q => q.id === updatedQuest.id ? updatedQuest : q));
  };
  const reorderQuests = (newOrder) => setQuests(newOrder);

  // Remaining placeholders
  const approveRegistration = (reg) => {
    // This part should also be updated to sync with AuthContext or Supabase users
    setPendingRegistrations(prev => prev.filter(p => p.id !== reg.id));
  };

  const rejectRegistration = (id) => {
    setPendingRegistrations(pendingRegistrations.filter(p => p.id !== id));
  };

  const registerUserDirectly = (user) => {
    // Handled in AuthContext
  };

  const submitRegistrationApplication = (application) => {
    // Handled in AuthContext
  };

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
      posts, addPost, approvePost, rejectPost, deletePost, toggleLike,
      addComment, deleteComment, editComment, likeComment, pendingPosts,
      announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement,
      events, addEvent, deleteEvent, updateEvent,
      loading
    }}>
      {children}
    </AdminContext.Provider>
  );
};
