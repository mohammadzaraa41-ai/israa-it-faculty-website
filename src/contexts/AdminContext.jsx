import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { DB_SCHEMA } from '../data/db_schema';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from './ToastContext';

const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  // -- Auth State --
  const isAdminRole = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);
  const isAuthenticated = isAdminRole;

  // -- Data State --
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
  const [liveLabs, setLiveLabs] = useState([]);
  const [posts, setPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);
  const [honorRoll, setHonorRoll] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  // -- Helpers --
  const safeFetch = useCallback(async (table, select = '*') => {
    try {
      const { data, error } = await supabase.from(table).select(select);
      if (error) {
        console.warn(`Table ${table} issue:`, error.message);
        return null;
      }
      return data;
    } catch (err) {
      console.error(`Fetch error ${table}:`, err);
      return null;
    }
  }, []);

  const handleAction = async (operation, successMsg, errorMsg) => {
    try {
      const { data, error } = await operation();
      if (error) throw error;
      if (successMsg) addToast('نجاح', successMsg, 'success');
      return { data, error: null };
    } catch (err) {
      console.error('Admin Action Error:', err);
      addToast('خطأ', errorMsg || err.message, 'error');
      return { data: null, error: err };
    }
  };

  // -- Data Loading --
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // 1. Users Map for Avatars
        const { data: usersData } = await supabase.from('users').select('username, name_ar, name_en, role, avatar_url');
        const usersMap = {};
        if (usersData) usersData.forEach(u => { usersMap[u.username] = u; });

        // 2. Social Data (Posts & Comments)
        const [postsData, commentsData, pendingData] = await Promise.all([
          supabase.from('posts').select('*').eq('status', 'APPROVED').order('created_at', { ascending: false }),
          supabase.from('comments').select('*'),
          supabase.from('posts').select('*').eq('status', 'PENDING').order('created_at', { ascending: false })
        ]);

        if (postsData.data) {
          const formatted = postsData.data.map(p => {
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
              comments: (commentsData.data || [])
                .filter(c => c.post_id === p.id)
                .map(c => {
                  const commentAuthor = usersMap[c.author_username] || {};
                  return {
                    id: c.id, author: c.author_name, username: c.author_username,
                    avatar_url: commentAuthor.avatar_url || null,
                    text: c.content, likes: c.likes || [], parent_id: c.parent_id || null
                  };
                })
            };
          });
          setPosts(formatted);
        }

        if (pendingData.data) {
          setPendingPosts(pendingData.data.map(p => ({
            ...p,
            author: { name: p.author_name || p.author_id, role: p.author_role },
            date: new Date(p.created_at).toLocaleDateString('en-GB'),
            comments: []
          })));
        }

        // 3. Independent Tables
        const results = await Promise.all([
          safeFetch('faculty_members'),
          safeFetch('offered_courses'),
          safeFetch('student_tips'),
          safeFetch('quests'),
          safeFetch('announcements'),
          safeFetch('events'),
          safeFetch('departments'),
          safeFetch('live_labs'),
          safeFetch('honor_roll'),
          safeFetch('achievements')
        ]);

        const [facultyRes, coursesRes, tipsRes, questsRes, annRes, eventsRes, deptsRes, labsRes, honorRes, achRes] = results;

        setFacultyMembers(facultyRes || DB_SCHEMA.facultyMembers);
        setOfferedCourses(coursesRes || DB_SCHEMA.offeredCourses);
        setStudentTips(tipsRes || DB_SCHEMA.studentTips);
        setQuests(questsRes || DB_SCHEMA.quests);
        setAnnouncements(annRes || DB_SCHEMA.announcements);
        setEvents(eventsRes || DB_SCHEMA.events);
        setDepartments(deptsRes && deptsRes.length > 0 ? deptsRes : DB_SCHEMA.departments);
        setLiveLabs(labsRes || DB_SCHEMA.liveLabs);
        setHonorRoll(honorRes || DB_SCHEMA.honorRoll);
        setAchievements(achRes || DB_SCHEMA.achievements);

      } catch (err) {
        console.error("Critical error in AdminContext fetch:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, [safeFetch]);

  // -- CRUD Operations --

  // Faculty
  const addFaculty = async (member) => {
    const dbMember = {
      name: member.name,
      department_id: member.departmentId || member.department_id,
      role: member.role,
      specialization: member.specialization,
      office: member.office,
      office_hours: member.officeHours || member.office_hours,
      courses: member.courses
    };
    const { data } = await handleAction(
      () => supabase.from('faculty_members').insert([dbMember]).select(),
      'تم إضافة عضو هيئة التدريس بنجاح',
      'فشل إضافة العضو'
    );
    if (data) setFacultyMembers(prev => [...prev, data[0]]);
  };

  const editFaculty = async (updated) => {
    const dbData = {
      name: updated.name,
      department_id: updated.departmentId || updated.department_id,
      role: updated.role,
      specialization: updated.specialization,
      office: updated.office,
      office_hours: updated.officeHours || updated.office_hours,
      courses: updated.courses
    };
    const { error } = await handleAction(
      () => supabase.from('faculty_members').update(dbData).eq('id', updated.id),
      'تم تحديث البيانات بنجاح'
    );
    if (!error) setFacultyMembers(prev => prev.map(m => m.id === updated.id ? { ...updated } : m));
  };

  const deleteFaculty = async (id) => {
    const { error } = await handleAction(() => supabase.from('faculty_members').delete().eq('id', id));
    if (!error) setFacultyMembers(prev => prev.filter(m => m.id !== id));
  };

  // Social
  const addPost = async (postData, currentUser) => {
    if (!currentUser) return { status: 'ERROR' };
    const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(currentUser.role);
    const status = isAdmin ? 'APPROVED' : 'PENDING';

    const { data, error } = await handleAction(
      () => supabase.from('posts').insert([{
        content: postData.content,
        image: postData.image,
        author_username: currentUser.username,
        author_name: currentUser.name?.ar || currentUser.name_ar || currentUser.username,
        author_role: currentUser.role,
        status
      }]).select(),
      isAdmin ? 'تم النشر بنجاح' : 'طلبك قيد المراجعة'
    );

    if (error) return { status: 'ERROR' };

    const newP = {
      ...data[0],
      author: {
        username: currentUser.username,
        name: currentUser.name?.ar || currentUser.name_ar || currentUser.username,
        role: currentUser.role,
        avatar_url: currentUser.avatar_url || null
      },
      date: new Date().toLocaleDateString('en-GB'),
      comments: []
    };

    if (isAdmin) setPosts(prev => [newP, ...prev]);
    else setPendingPosts(prev => [newP, ...prev]);

    return { status: isAdmin ? 'PUBLISHED' : 'PENDING' };
  };

  const approvePost = async (postId) => {
    const { error } = await handleAction(() => supabase.from('posts').update({ status: 'APPROVED' }).eq('id', postId));
    if (!error) {
      const post = pendingPosts.find(p => p.id === postId);
      if (post) {
        setPosts(prev => [post, ...prev]);
        setPendingPosts(prev => prev.filter(p => p.id !== postId));
      }
    }
  };

  const rejectPost = async (postId) => {
    const { error } = await handleAction(() => supabase.from('posts').delete().eq('id', postId));
    if (!error) setPendingPosts(prev => prev.filter(p => p.id !== postId));
  };

  const deletePost = async (postId) => {
    const { error } = await handleAction(() => supabase.from('posts').delete().eq('id', postId));
    if (!error) setPosts(prev => prev.filter(p => p.id !== postId));
  };

  const toggleLike = async (postId, username) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const hasLiked = post.likes.includes(username);
    const newLikes = hasLiked ? post.likes.filter(u => u !== username) : [...post.likes, username];
    
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, likes: newLikes } : p));
    await supabase.from('posts').update({ likes: newLikes }).eq('id', postId);
  };

  // Comments
  const addComment = async (postId, commentData) => {
    const { data } = await handleAction(
      () => supabase.from('comments').insert([{
        post_id: postId,
        content: commentData.text,
        author_name: user.name?.ar || user.name_ar || user.username,
        author_role: user.role,
        parent_id: commentData.parent_id || null
      }]).select()
    );

    if (data) {
      const newComment = {
        id: data[0].id,
        author: user.name?.ar || user.name_ar || user.username,
        username: user.username,
        avatar_url: user.avatar_url || null,
        text: data[0].content,
        likes: [],
        parent_id: data[0].parent_id || null
      };
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, comments: [...(p.comments || []), newComment] } : p));
    }
  };

  const likeComment = async (commentId, postId, username) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    const comment = post.comments.find(c => c.id === commentId);
    if (!comment) return;
    const newLikes = (comment.likes || []).includes(username)
      ? (comment.likes || []).filter(u => u !== username)
      : [...(comment.likes || []), username];
    
    setPosts(prev => prev.map(p => p.id === postId 
      ? { ...p, comments: p.comments.map(c => c.id === commentId ? { ...c, likes: newLikes } : c) } 
      : p
    ));
    await supabase.from('comments').update({ likes: newLikes }).eq('id', commentId);
  };

  // Lab Management
  const addLab = async (lab) => {
    const { data } = await handleAction(() => supabase.from('live_labs').insert([lab]).select(), 'تم إضافة المختبر');
    if (data) setLiveLabs(prev => [...prev, data[0]]);
    else setLiveLabs(prev => [...prev, { ...lab, id: Date.now() }]);
  };
  const deleteLab = async (id) => {
    await handleAction(() => supabase.from('live_labs').delete().eq('id', id));
    setLiveLabs(prev => prev.filter(l => l.id !== id));
  };
  const editLab = async (updated) => {
    await handleAction(() => supabase.from('live_labs').update(updated).eq('id', updated.id));
    setLiveLabs(prev => prev.map(l => l.id === updated.id ? updated : l));
  };

  // Honor Roll
  const addHonorStudent = async (student) => {
    const { data } = await handleAction(() => supabase.from('honor_roll').insert([student]).select(), 'تمت الإضافة للوحة الشرف');
    if (data) setHonorRoll(prev => [...prev, data[0]]);
    else setHonorRoll(prev => [...prev, { ...student, id: Date.now() }]);
  };
  const deleteHonorStudent = async (id) => {
    await handleAction(() => supabase.from('honor_roll').delete().eq('id', id));
    setHonorRoll(prev => prev.filter(s => s.id !== id));
  };
  const editHonorStudent = async (updated) => {
    await handleAction(() => supabase.from('honor_roll').update(updated).eq('id', updated.id));
    setHonorRoll(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  // Achievements
  const addAchievement = async (ach) => {
    const { data } = await handleAction(() => supabase.from('achievements').insert([ach]).select(), 'تم إضافة الإنجاز');
    if (data) setAchievements(prev => [...prev, data[0]]);
    else setAchievements(prev => [...prev, { ...ach, id: Date.now() }]);
  };
  const deleteAchievement = async (id) => {
    await handleAction(() => supabase.from('achievements').delete().eq('id', id));
    setAchievements(prev => prev.filter(a => a.id !== id));
  };
  const editAchievement = async (updated) => {
    await handleAction(() => supabase.from('achievements').update(updated).eq('id', updated.id));
    setAchievements(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  // Courses, Tips, Quests
  const addCourse = async (course) => {
    const { data } = await handleAction(() => supabase.from('offered_courses').insert([course]).select(), 'تم إضافة الدورة');
    if (data) setOfferedCourses(prev => [...prev, data[0]]);
  };
  const deleteCourse = async (id) => {
    await handleAction(() => supabase.from('offered_courses').delete().eq('id', id));
    setOfferedCourses(prev => prev.filter(c => c.id !== id));
  };
  
  const addTip = async (text) => {
    const { data } = await handleAction(() => supabase.from('student_tips').insert([{ text }]).select(), 'تم إضافة النصيحة');
    if (data) setStudentTips(prev => [...prev, data[0]]);
  };
  const deleteTip = async (id) => {
    await handleAction(() => supabase.from('student_tips').delete().eq('id', id));
    setStudentTips(prev => prev.filter(t => t.id !== id));
  };

  const addQuest = async (quest) => {
    const { data } = await handleAction(() => supabase.from('quests').insert([quest]).select(), 'تم إضافة التحدي');
    if (data) setQuests(prev => [...prev, data[0]]);
  };
  const deleteQuest = async (id) => {
    await handleAction(() => supabase.from('quests').delete().eq('id', id));
    setQuests(prev => prev.filter(q => q.id !== id));
  };

  // Simple Sync Placeholders
  const approveRegistration = (reg) => setPendingRegistrations(prev => prev.filter(p => p.id !== reg.id));
  const rejectRegistration = (id) => setPendingRegistrations(prev => prev.filter(p => p.id !== id));
  const submitRegistrationApplication = (app) => addToast('تم التقديم', 'طلبك قيد المراجعة', 'success');

  return (
    <AdminContext.Provider value={{
      isAuthenticated, loading,
      facultyMembers, addFaculty, editFaculty, deleteFaculty,
      offeredCourses, addCourse, deleteCourse,
      studentTips, addTip, deleteTip,
      quests, addQuest, deleteQuest,
      liveLabs, addLab, editLab, deleteLab,
      honorRoll, addHonorStudent, editHonorStudent, deleteHonorStudent,
      achievements, addAchievement, editAchievement, deleteAchievement,
      posts, addPost, approvePost, rejectPost, deletePost, toggleLike,
      pendingPosts, addComment, likeComment,
      announcements, addAnnouncement, deleteAnnouncement,
      events, addEvent, deleteEvent,
      departments, pendingRegistrations, approveRegistration, rejectRegistration, submitRegistrationApplication,
      gradTemplates, projectBank, cvTemplates, interviewResources, linkedinTips
    }}>
      {children}
    </AdminContext.Provider>
  );
};
