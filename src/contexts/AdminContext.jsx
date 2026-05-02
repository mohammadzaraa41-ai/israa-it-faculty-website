import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB_SCHEMA } from '../data/db_schema';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from './ToastContext';

/**
 * AdminContext: سياق الإدارة المركزي للموقع
 * هذا السياق مسؤول عن إدارة كافة البيانات الديناميكية (الطلاب، المدرسين، المختبرات، الإنجازات، إلخ)
 * ويقوم بالتنسيق بين قاعدة بيانات Supabase والبيانات المحلية (Fallback)
 */
const AdminContext = createContext();

export const useAdmin = () => useContext(AdminContext);

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  
  // التحقق من صلاحيات المشرف
  const isAdminRole = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);
  const isAuthenticated = isAdminRole;

  // --- حالات البيانات (State Management) ---
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
  const [honorRoll, setHonorRoll] = useState([]);
  const [achievements, setAchievements] = useState([]);

  // الحالات المتعلقة بالتفاعل الاجتماعي
  const [posts, setPosts] = useState([]);
  const [pendingPosts, setPendingPosts] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);

  // --- جلب البيانات عند بدء التشغيل ---
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      
      /**
       * وظيفة مساعدة لجلب البيانات بأمان من Supabase
       * في حال فشل الاتصال، تعيد null بدلاً من كسر التطبيق
       */
      const safeFetch = async (table, select = '*') => {
        try {
          const { data, error } = await supabase.from(table).select(select);
          if (error) {
            console.warn(`[Supabase Service] Table "${table}" access issue:`, error.message);
            return null;
          }
          return data;
        } catch (err) {
          console.error(`[Critical Error] Unexpected fetch error for "${table}":`, err);
          return null;
        }
      };

      try {
        // 1. جلب بيانات المستخدمين لبناء خريطة الصور الشخصية
        const { data: usersData } = await supabase.from('users').select('username, name_ar, name_en, role, avatar_url');
        const usersMap = {};
        if (usersData) {
          usersData.forEach(u => { usersMap[u.username] = u; });
        }

        // 2. جلب المنشورات والتعليقات
        const { data: postsData } = await supabase.from('posts').select('*').eq('status', 'APPROVED').order('created_at', { ascending: false });
        const { data: commentsData } = await supabase.from('comments').select('*');

        if (postsData) {
          const formattedPosts = postsData.map(p => {
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

        // 3. جلب المنشورات المعلقة للمراجعة
        const { data: pendingData } = await supabase.from('posts').select('*').eq('status', 'PENDING').order('created_at', { ascending: false });
        if (pendingData) {
          setPendingPosts(pendingData.map(p => ({
            ...p,
            author: { name: p.author_name || p.author_id, role: p.author_role },
            date: new Date(p.created_at).toLocaleDateString('en-GB'),
            comments: []
          })));
        }

        // 4. جلب كافة الجداول الأخرى بالتوازي
        const [facultyRes, coursesRes, tipsRes, questsRes, annRes, eventsRes, deptsRes, labsRes, honorRes, achRes] = await Promise.all([
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

        // تحديث الحالات (مع استخدام الـ Fallback من db_schema إذا كانت الجداول فارغة)
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
        console.error("Critical error in AdminContext initialization:", err);
      }
      setLoading(false);
    };

    fetchAllData();
  }, []);

  // --- وظائف التحكم (CRUD Operations) ---

  // 1. إدارة الهيئة التدريسية
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
    if (!error && data) {
      setFacultyMembers(prev => [...prev, data[0]]);
      addToast('إضافة ناجحة', 'تم إضافة المدرس بنجاح إلى القائمة', 'success');
    } else {
      addToast('خطأ في الإضافة', error?.message || 'تعذر الاتصال بقاعدة البيانات', 'error');
    }
  };

  const deleteFaculty = async (id) => {
    const { error } = await supabase.from('faculty_members').delete().eq('id', id);
    if (!error) {
      setFacultyMembers(prev => prev.filter(m => m.id !== id));
      addToast('حذف ناجح', 'تم إزالة المدرس من القائمة', 'success');
    }
  };

  // 2. إدارة المنشورات والتفاعل
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

    if (isAdmin) setPosts(prev => [newP, ...prev]);
    else setPendingPosts(prev => [newP, ...prev]);

    return { status: isAdmin ? 'PUBLISHED' : 'PENDING' };
  };

  // 3. إدارة المختبرات الحية
  const addLab = async (lab) => {
    const { data, error } = await supabase.from('live_labs').insert([lab]).select();
    if (!error && data) {
      setLiveLabs(prev => [...prev, data[0]]);
      addToast('تمت الإضافة', 'تم إضافة المختبر بنجاح', 'success');
    } else {
      setLiveLabs(prev => [...prev, { ...lab, id: Date.now() }]);
      addToast('حفظ محلي', 'تم الحفظ مؤقتاً في المتصفح', 'info');
    }
  };

  const deleteLab = async (id) => {
    const { error } = await supabase.from('live_labs').delete().eq('id', id);
    setLiveLabs(prev => prev.filter(l => l.id !== id));
    addToast('تم الحذف', 'تم إزالة المختبر بنجاح', 'success');
  };

  const editLab = async (updated) => {
    await supabase.from('live_labs').update(updated).eq('id', updated.id);
    setLiveLabs(prev => prev.map(l => l.id === updated.id ? updated : l));
    addToast('تم التحديث', 'تم تحديث بيانات المختبر', 'success');
  };

  // 4. إدارة لوحة الشرف (Honor Roll)
  const addHonorStudent = async (student) => {
    const { data, error } = await supabase.from('honor_roll').insert([student]).select();
    if (!error && data) setHonorRoll(prev => [...prev, data[0]]);
    else setHonorRoll(prev => [...prev, { ...student, id: Date.now() }]);
    addToast('مبارك التفوق', 'تم إضافة الطالب للوحة الشرف', 'success');
  };

  const deleteHonorStudent = async (id) => {
    await supabase.from('honor_roll').delete().eq('id', id);
    setHonorRoll(prev => prev.filter(s => s.id !== id));
  };

  const editHonorStudent = async (updated) => {
    await supabase.from('honor_roll').update(updated).eq('id', updated.id);
    setHonorRoll(prev => prev.map(s => s.id === updated.id ? updated : s));
  };

  // 5. إدارة إنجازات الكلية
  const addAchievement = async (ach) => {
    const { data, error } = await supabase.from('achievements').insert([ach]).select();
    if (!error && data) setAchievements(prev => [...prev, data[0]]);
    else setAchievements(prev => [...prev, { ...ach, id: Date.now() }]);
    addToast('إنجاز جديد', 'تم توثيق الإنجاز بنجاح', 'success');
  };

  const deleteAchievement = async (id) => {
    await supabase.from('achievements').delete().eq('id', id);
    setAchievements(prev => prev.filter(a => a.id !== id));
  };

  const editAchievement = async (updated) => {
    await supabase.from('achievements').update(updated).eq('id', updated.id);
    setAchievements(prev => prev.map(a => a.id === updated.id ? updated : a));
  };

  // --- بقية الوظائف المساعدة ---
  const addCourse = async (course) => {
    const { data, error } = await supabase.from('offered_courses').insert([course]).select();
    if (!error && data) setOfferedCourses(prev => [...prev, data[0]]);
    else setOfferedCourses(prev => [...prev, { ...course, id: Date.now() }]);
  };

  const deleteCourse = (id) => setOfferedCourses(prev => prev.filter(c => c.id !== id));
  const editCourse = (updated) => setOfferedCourses(prev => prev.map(c => c.id === updated.id ? updated : c));

  const addTip = (text) => setStudentTips(prev => [...prev, { id: Date.now(), text }]);
  const deleteTip = (id) => setStudentTips(prev => prev.filter(t => t.id !== id));

  const addQuest = (q) => setQuests(prev => [...prev, { ...q, id: Date.now() }]);
  const deleteQuest = (id) => setQuests(prev => prev.filter(q => q.id !== id));

  return (
    <AdminContext.Provider value={{
      isAuthenticated,
      facultyMembers, addFaculty, deleteFaculty,
      offeredCourses, addCourse, deleteCourse, editCourse,
      studentTips, addTip, deleteTip,
      quests, addQuest, deleteQuest,
      liveLabs, addLab, editLab, deleteLab,
      honorRoll, addHonorStudent, deleteHonorStudent, editHonorStudent,
      achievements, addAchievement, deleteAchievement, editAchievement,
      posts, addPost, pendingPosts,
      announcements, events,
      departments,
      loading
    }}>
      {children}
    </AdminContext.Provider>
  );
};
