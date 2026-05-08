import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB_SCHEMA } from '../data/db_schema';
import { useAuth } from './AuthContext';
import { supabase } from '../lib/supabase';
import { useToast } from './ToastContext';
import { useLocale } from './LocalizationContext';

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { lang } = useLocale();
  const isAdminRole = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);
  const isAuthenticated = isAdminRole;

  const [facultyMembers, setFacultyMembers] = useState([]);
  const [departments, setDepartments] = useState(DB_SCHEMA.departments);
  const [students, setStudents] = useState([]);
  const [pendingRegistrations, setPendingRegistrations] = useState([]);
  const [offeredCourses, setOfferedCourses] = useState([]);
  const [studentTips, setStudentTips] = useState([]);
  const [quests, setQuests] = useState([]);
  const [gradTemplates, setGradTemplates] = useState([]);
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
  const [roadmapCourses, setRoadmapCourses] = useState(() => {
    const saved = localStorage.getItem('site_roadmap_v2');
    return saved ? JSON.parse(saved) : [];
  });
  const [studentQuests, setStudentQuests] = useState(() => {
    try {
      const saved = localStorage.getItem('student_quests_local');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Failed to parse local quests:", e);
      return [];
    }
  });
  const [loading, setLoading] = useState(false);

  // Optimized Global Fetch for Speed with Hybrid Caching
  useEffect(() => {
    const initializePublicData = async () => {
      try {
        const currentVersion = 'v3_flat';
        if (localStorage.getItem('site_version') !== currentVersion) {
          localStorage.clear();
          localStorage.setItem('site_version', currentVersion);
        }
        const getCache = (key) => {
          try {
            return localStorage.getItem(key);
          } catch (e) {
            return null;
          }
        };

        const cachedAnn = getCache('site_ann_v2');
        const cachedEvents = getCache('site_events_v2');
        const cachedPosts = getCache('site_posts_v2');
        const cachedCourses = getCache('site_roadmap_v2');

        if (cachedAnn) {
          try { const p = JSON.parse(cachedAnn); if(p) setAnnouncements(p); } catch(e) {}
        }
        if (cachedEvents) {
          try { const p = JSON.parse(cachedEvents); if(p) setEvents(p); } catch(e) {}
        }
        if (cachedCourses) {
          try { const p = JSON.parse(cachedCourses); if(p) setRoadmapCourses(p); } catch(e) {}
        }
        if (cachedPosts) {
          try { 
            const parsed = JSON.parse(cachedPosts);
            if (Array.isArray(parsed)) setPosts(parsed);
          } catch(e) {}
        }

        if (!cachedAnn && !cachedEvents && !cachedPosts) {
          setLoading(true);
        }
      } catch (criticalErr) {
        console.error("Critical Cache Error:", criticalErr);
      }
      
      try {
        const [annRes, eventsRes, postsRes, coursesRes] = await Promise.all([
          supabase.from('announcements').select('*').limit(10),
          supabase.from('events').select('*').limit(10),
          supabase.from('posts').select('*, comments(*)').eq('status', 'APPROVED').order('created_at', { ascending: false }).limit(10),
          supabase.from('courses').select('*')
        ]);

        if (annRes.data) {
          const normalizedAnn = annRes.data.map(ann => ({
            ...ann,
            text: {
              ar: ann.text_ar || ann.text?.ar || ann.text || '',
              en: ann.text_en || ann.text?.en || ann.text || ''
            }
          }));
          setAnnouncements(normalizedAnn);
          try { localStorage.setItem('site_ann_v3', JSON.stringify(normalizedAnn)); } catch(e){}
        }
        if (eventsRes.data) {
          const normalizedEvents = eventsRes.data.map(ev => ({
            ...ev,
            text: {
              ar: ev.text_ar || ev.text?.ar || ev.text || '',
              en: ev.text_en || ev.text?.en || ev.text || ''
            }
          }));
          setEvents(normalizedEvents);
          try { localStorage.setItem('site_events_v3', JSON.stringify(normalizedEvents)); } catch(e){}
        }
        if (coursesRes.data) {
          setRoadmapCourses(coursesRes.data);
          try { localStorage.setItem('site_roadmap_v2', JSON.stringify(coursesRes.data)); } catch(e){}
        }
        if (postsRes.data) {
          const formattedPosts = postsRes.data.map(p => ({
            ...p,
            author: typeof p.author === 'object' ? p.author : { 
              name: p.author_name || p.author_username || 'User', 
              role: p.author_role || 'STUDENT' 
            },
            date: new Date(p.created_at).toLocaleDateString('en-GB'),
            comments: (p.comments || []).map(c => ({
              id: c.id,
              author: c.author_name,
              username: c.author_username,
              text: c.content,
              likes: c.likes || [],
              parent_id: c.parent_id || null
            }))
          }));
          setPosts(formattedPosts);
          try { localStorage.setItem('site_posts_v2', JSON.stringify(formattedPosts)); } catch(e){}
        }

        fetchAdminDashboardData();
        
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    initializePublicData();
  }, [user?.id]);

  useEffect(() => {
    if (roadmapCourses.length > 0) {
      localStorage.setItem('site_roadmap_v2', JSON.stringify(roadmapCourses));
    }
  }, [roadmapCourses]);

  const fetchFaculty = async () => {
    try {
      const { data, error } = await supabase.from('faculty_members').select('*');
      if (error) throw error;
      if (data) {
        const mapped = data.map(m => ({
          ...m,
          name: typeof m.name === 'object' ? m.name : { ar: m.name_ar || m.name || 'No Name', en: m.name_en || m.name_ar || m.name || 'No Name' },
          specialization: m.specialization_ar || m.specialization || '',
          office: m.office_location || m.office || ''
        }));
        setFacultyMembers(mapped);
        localStorage.setItem('site_faculty_v2', JSON.stringify(mapped));
      }
    } catch (error) {
      console.error('Error fetching faculty:', error.message);
    }
  };

  const fetchRoadmapCourses = async () => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('year', { ascending: true });
      if (error) throw error;
      if (data) {
        setRoadmapCourses(data);
        localStorage.setItem('site_roadmap_v2', JSON.stringify(data));
      }
    } catch (error) {
      console.error('Error fetching roadmap courses:', error.message);
    }
  };

  const fetchOfferedCourses = async () => {
    try {
      const { data, error } = await supabase.from('offered_courses').select('*');
      if (error) return;
      if (data) {
        const mappedData = data.map(c => ({
          ...c,
          instructor: c.instructor || c.instructor_id || 'لم يحدد'
        }));
        setOfferedCourses(mappedData);
        localStorage.setItem('site_offered_v2', JSON.stringify(mappedData));
      }
    } catch (err) {}
  };

  const fetchStudentTips = async () => {
    try {
      const { data, error } = await supabase.from('student_tips').select('*');
      if (!error && data) {
        setStudentTips(data);
        localStorage.setItem('site_tips_v2', JSON.stringify(data));
      }
    } catch (err) { console.error(err); }
  };

  const fetchQuests = async () => {
    try {
      const { data, error } = await supabase.from('quests').select('*');
      if (!error && data) {
        setQuests(data);
        localStorage.setItem('site_quests_v2', JSON.stringify(data));
      }
    } catch (err) { console.error(err); }
  };

  const fetchAchievements = async () => {
    try {
      const { data, error } = await supabase.from('achievements').select('*');
      
      if (error) {
        if (error.code === 'PGRST116' || error.message.includes('relation "achievements" does not exist')) {
          console.error("CRITICAL: Achievements table is missing in Supabase!");
          addToast('نظام الإنجازات معطل', 'جدول achievements غير موجود في قاعدة البيانات. يرجى إنشاؤه.', 'error');
        } else {
          console.error("Fetch achievements error:", error.message);
        }
        return;
      }

      if (data && data.length > 0) {
        const mappedData = data.map(a => {
          const getField = (val, arVal, enVal) => {
            if (typeof val === 'object' && val !== null) return val;
            return { ar: arVal || val || '', en: enVal || val || '' };
          };

          return {
            ...a,
            title: getField(a.title, a.title_ar, a.title_en),
            summary: getField(a.summary, a.summary_ar, a.summary_en),
            report: getField(a.report, a.report_ar, a.report_en),
            participants: getField(a.participants, a.participants_ar, a.participants_en),
            images: Array.isArray(a.images) ? a.images : [a.image_url || a.images || 'https://via.placeholder.com/800x400'],
            year: a.year || '2024',
            date: a.date || new Date().toISOString().split('T')[0]
          };
        });
        setAchievements(mappedData);
        localStorage.setItem('site_ach_v2', JSON.stringify(mappedData));
      }
    } catch (err) { console.error(err); }
  };

    const fetchLiveLabs = async () => {
      try {
        const { data, error } = await supabase.from('live_labs').select('*');
        if (!error && data) {
          const normalized = data.map(l => ({
            ...l,
            name_ar: l.name_ar || l.name?.ar || '',
            name_en: l.name_en || l.name?.en || '',
            info_ar: l.info_ar || l.info?.ar || '',
            info_en: l.info_en || l.info?.en || ''
          }));
          setLiveLabs(normalized);
          localStorage.setItem('site_labs_v2', JSON.stringify(normalized));
        }
      } catch (err) { console.error(err); }
    };

  const addRoadmapCourse = async (courseData) => {
    try {
      const { data, error } = await supabase
        .from('courses')
        .insert([courseData])
        .select();
      if (error) throw error;
      setRoadmapCourses([...roadmapCourses, data[0]]);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const updateRoadmapCourse = async (id, courseData) => {
    try {
      const { error } = await supabase
        .from('courses')
        .update(courseData)
        .eq('course_id', id);
      if (error) throw error;
      setRoadmapCourses(roadmapCourses.map(c => c.course_id === id ? { ...c, ...courseData } : c));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const deleteRoadmapCourse = async (id) => {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('course_id', id);
      if (error) throw error;
      setRoadmapCourses(roadmapCourses.filter(c => c.course_id !== id));
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const uploadFile = async (file, bucket = 'faculty_uploads') => {
    try {
      addToast(lang === 'ar' ? 'جاري الرفع...' : 'Uploading...', lang === 'ar' ? 'يرجى الانتظار' : 'Please wait', 'info');
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        addToast(lang === 'ar' ? 'فشل الرفع' : 'Upload Failed', uploadError.message, 'error');
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      addToast(lang === 'ar' ? 'تم الرفع' : 'Uploaded', lang === 'ar' ? 'جاري حفظ البيانات...' : 'Saving...', 'success');
      return publicUrl;
    } catch (error) {
      return null;
    }
  };

  const fetchAdminDashboardData = async () => {
    setLoading(true);
    try {
      const safeFetch = async (table) => {
        const { data, error } = await supabase.from(table).select('*');
        if (error) return null;
        return data;
      };

      const [
        facultyRes,
        studentsRes,
        offeredCoursesRes,
        projectsRes,
        cvRes,
        interviewRes,
        linkedinRes,
        gradRes,
        labsRes,
        honorRes,
        achievementsRes,
        deptsRes,
        questsRes,
        announcementsRes,
        eventsRes,
        roadmapCoursesRes,
        tipsRes,
        postsResRaw
      ] = await Promise.all([
        safeFetch('faculty_members'),
        safeFetch('users'),
        safeFetch('offered_courses'),
        safeFetch('project_bank'),
        safeFetch('cv_templates'),
        safeFetch('interview_resources'),
        safeFetch('linkedin_tips'),
        safeFetch('grad_templates'),
        safeFetch('live_labs'),
        safeFetch('honor_roll'),
        safeFetch('achievements'),
        safeFetch('departments'),
        safeFetch('quests'),
        safeFetch('announcements'),
        safeFetch('events'),
        safeFetch('courses'),
        safeFetch('student_tips'),
        supabase.from('posts').select('*, comments(*)').order('created_at', { ascending: false })
      ]);

      if (roadmapCoursesRes) setRoadmapCourses(roadmapCoursesRes);
      if (tipsRes) setStudentTips(tipsRes);
      if (studentsRes) setStudents(studentsRes);
      if (offeredCoursesRes) setOfferedCourses(offeredCoursesRes);
      
      if (cvRes) {
        setCvTemplates(cvRes.map(t => ({
          ...t,
          name_ar: t.name_ar || t.name?.ar || 'قالب',
          name_en: t.name_en || t.name?.en || 'Template'
        })));
      }
      
      if (projectsRes) {
        setProjectBank(projectsRes.map(p => ({
          ...p,
          name_ar: p.name_ar || p.name?.ar || 'مشروع',
          name_en: p.name_en || p.name?.en || 'Project',
          notes_ar: p.notes_ar || p.notes?.ar || '',
          notes_en: p.notes_en || p.notes?.en || ''
        })));
      }
      
      if (interviewRes) setInterviewResources(interviewRes);
      if (linkedinRes) setLinkedinTips(linkedinRes);
      if (gradRes) setGradTemplates(gradRes);
      
      if (labsRes) {
        setLiveLabs(labsRes.map(l => ({
          ...l,
          name_ar: l.name_ar || l.name?.ar || 'مختبر',
          name_en: l.name_en || l.name?.en || 'Lab',
          info_ar: l.info_ar || l.info?.ar || '',
          info_en: l.info_en || l.info?.en || ''
        })));
      }
      
      if (honorRes && honorRes.length > 0) {
        setHonorRoll(honorRes);
      } else if (honorRes && honorRes.length === 0) {
        setHonorRoll([
          { id: '1', studentName: { ar: 'أحمد محمود', en: 'Ahmad Mahmoud' }, major: 'cs', year: '4', gpa: '3.95' },
          { id: '2', studentName: { ar: 'سارة خالد', en: 'Sara Khalid' }, major: 'se', year: '3', gpa: '3.90' },
          { id: '3', studentName: { ar: 'عمر ياسين', en: 'Omar Yassin' }, major: 'ai', year: '2', gpa: '3.98' }
        ]);
      }
      if (achievementsRes) setAchievements(achievementsRes);
      if (questsRes) setQuests(questsRes);

      if (facultyRes) {
        setFacultyMembers(facultyRes.map(m => ({
          ...m,
          name: typeof m.name === 'object' ? m.name : { ar: m.name_ar || m.name || 'No Name', en: m.name_en || m.name_ar || m.name || 'No Name' },
          specialization: m.specialization_ar || m.specialization || '',
          office: m.office_location || m.office || '',
          officeHours: m.office_hours || m.officeHours || ''
        })));
      }

      if (announcementsRes) {
        setAnnouncements(announcementsRes.map(a => ({
          ...a,
          text: typeof a.text === 'object' ? a.text : { ar: a.text_ar || a.text || a.content || '', en: a.text_en || a.text_ar || a.text || a.content || '' }
        })));
      }

      if (eventsRes) {
        setEvents(eventsRes.map(e => ({
          ...e,
          text: typeof e.text === 'object' ? e.text : { ar: e.text_ar || e.text || e.title || '', en: e.text_en || e.text_ar || e.text || e.title || '' }
        })));
      }

      if (postsResRaw.data) {
        const mapPost = (p) => ({
          ...p,
          author: typeof p.author === 'object' ? p.author : { name: p.author_name || p.author_username || 'User', role: p.author_role || 'STUDENT' },
          date: new Date(p.created_at).toLocaleDateString('en-GB'),
          comments: (p.comments || []).map(c => ({
            id: c.id,
            author: c.author_name,
            username: c.author_username,
            text: c.content,
            likes: c.likes || [],
            parent_id: c.parent_id || null
          }))
        });
        const postsData = postsResRaw.data;
        setPosts(postsData.filter(p => p.status === 'APPROVED').map(mapPost));
        setPendingPosts(postsData.filter(p => p.status === 'PENDING').map(mapPost));
      }

      if (projectsRes) {
        setProjectBank(projectsRes.map(p => ({
          ...p,
          name: { ar: p.name_ar || p.name || p.title || 'No Name', en: p.name_en || p.name_ar || p.name || p.title || 'No Name' },
          notes: { ar: p.notes_ar || p.notes || p.description || '', en: p.notes_en || p.notes_ar || p.notes || p.description || '' }
        })));
      }

      if (cvRes) {
        setCvTemplates(cvRes.map(c => ({
          ...c,
          name: { 
            ar: c.name_ar || c.name || 'CV Template', 
            en: c.name_en || c.name_ar || c.name || 'CV Template' 
          }
        })));
      }

      if (interviewRes) {
        setInterviewResources(interviewRes.map(i => ({
          ...i,
          title: { 
            ar: i.title_ar || i.title || 'Resource', 
            en: i.title_en || i.title_ar || i.title || 'Resource' 
          }
        })));
      }

      if (gradRes) {
        setGradTemplates(gradRes.map(g => ({
          ...g,
          name: { 
            ar: g.name_ar || g.name || g.title || 'Template', 
            en: g.name_en || g.name_ar || g.name || g.title || 'Template' 
          }
        })));
      }

      if (deptsRes) {
        const mergedDepts = [...DB_SCHEMA.departments];
        deptsRes.forEach(dbDept => {
          const index = mergedDepts.findIndex(d => d.id === dbDept.id);
          if (index !== -1) mergedDepts[index] = dbDept;
          else mergedDepts.push(dbDept);
        });
        setDepartments(mergedDepts);
      }
      return true;
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const addFaculty = async (member) => {
    try {
      const cleanMember = {
        name_ar: typeof member.name === 'object' ? (member.name.ar || member.name.en) : member.name,
        name_en: typeof member.name === 'object' ? (member.name.en || member.name.ar) : member.name,
        department_id: member.departmentId || member.department_id,
        role: member.role,
        specialization: member.specialization,
        courses: Array.isArray(member.courses) ? member.courses.join(', ') : member.courses,
        office_location: member.office || member.office_location,
        office_hours: member.officeHours || member.office_hours
      };

      const { data, error } = await supabase.from('faculty_members').insert([cleanMember]).select();
      
      if (!error && data) {
        const normalized = {
          ...data[0],
          name: { ar: data[0].name_ar, en: data[0].name_en },
          office: data[0].office_location,
          officeHours: data[0].office_hours
        };
        setFacultyMembers(prev => [...prev, normalized]);
        addToast(lang === 'ar' ? 'تمت الإضافة' : 'Added', lang === 'ar' ? 'تم إضافة عضو الهيئة بنجاح' : 'Faculty added successfully', 'success');
        return { success: true };
      } else {
        throw error;
      }
    } catch (err) {
      console.error("Add Faculty Error:", err);
      addToast(lang === 'ar' ? 'خطأ في الحفظ' : 'Save Error', err.message, 'error');
      return { success: false, error: err };
    }
  };

  const editFaculty = async (updatedMember) => {
    try {
      const dbData = {
        name_ar: typeof updatedMember.name === 'object' ? (updatedMember.name.ar || updatedMember.name.en) : updatedMember.name,
        name_en: typeof updatedMember.name === 'object' ? (updatedMember.name.en || updatedMember.name.ar) : updatedMember.name,
        department_id: updatedMember.departmentId || updatedMember.department_id,
        role: updatedMember.role,
        specialization: updatedMember.specialization,
        office_location: updatedMember.office || updatedMember.office_location,
        office_hours: updatedMember.officeHours || updatedMember.office_hours,
        courses: Array.isArray(updatedMember.courses) ? updatedMember.courses.join(', ') : updatedMember.courses
      };

      const { error } = await supabase.from('faculty_members').update(dbData).eq('id', updatedMember.id);
      
      if (!error) {
        setFacultyMembers(prev => prev.map(m => m.id === updatedMember.id ? { 
          ...updatedMember,
          name: typeof updatedMember.name === 'object' ? updatedMember.name : { ar: updatedMember.name, en: updatedMember.name }
        } : m));
        addToast('تم التحديث', 'تم تحديث البيانات بنجاح', 'success');
        return { success: true };
      } else {
        throw error;
      }
    } catch (err) {
      console.error("Supabase Error (editFaculty):", err);
      addToast('خطأ في التحديث', err?.message || 'فشل تحديث البيانات', 'error');
      return { success: false, error: err };
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

  const addPost = async (postData, user) => {
    if (!user) return { status: 'ERROR' };
    const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user.role);
    
    // 1. CREATE OPTIMISTIC POST (Instantly displayed to the user)
    const optimisticId = 'temp-' + Date.now();
    const optimisticPost = {
      id: optimisticId,
      content: postData.content,
      // Use local base64 images for instant display
      image: postData.images && postData.images.length > 0 ? postData.images.join(',') : null,
      author: {
        username: user.username,
        name: user.name?.ar || user.name_ar || user.name?.en || user.name_en || user.username,
        role: user.role,
        avatar_url: user.avatar_url || null
      },
      date: new Date().toLocaleDateString('en-GB'),
      comments: [],
      likes: [],
      status: isAdmin ? 'APPROVED' : 'PENDING'
    };

    // 2. IMMEDIATELY UPDATE STATE
    if (isAdmin) {
      setPosts(prev => [optimisticPost, ...prev]);
    } else {
      setPendingPosts(prev => [optimisticPost, ...prev]);
    }

    // 3. UPLOAD IN BACKGROUND
    let finalImageUrls = [];

    if (postData.imageFiles && postData.imageFiles.length > 0) {
      try {
        for (const file of postData.imageFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `post-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
          const filePath = `posts/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('faculty_uploads')
            .upload(filePath, file);

          if (uploadError) {
            console.error("Upload Error for file:", file.name, uploadError);
            continue; // Skip failed uploads but continue with others
          }

          const { data: { publicUrl } } = supabase.storage
            .from('faculty_uploads')
            .getPublicUrl(filePath);
          finalImageUrls.push(publicUrl);
        }
      } catch (err) {
        console.error("Image Upload Exception:", err);
      }
    } else if (postData.image && typeof postData.image === 'string') {
      finalImageUrls = [postData.image];
    }

    const imageValue = finalImageUrls.length > 0 ? finalImageUrls.join(',') : null;

    // 4. INSERT REAL DATA TO DB
    const { data, error } = await supabase.from('posts').insert([{
      content: postData.content,
      image: imageValue,
      author_username: user.username,
      author_name: user.name?.ar || user.name_ar || user.name?.en || user.name_en || user.username,
      author_role: user.role,
      status: isAdmin ? 'APPROVED' : 'PENDING'
    }]).select();

    if (error) {
      // Revert optimistic update on failure
      if (isAdmin) {
        setPosts(prev => prev.filter(p => p.id !== optimisticId));
      } else {
        setPendingPosts(prev => prev.filter(p => p.id !== optimisticId));
      }
      return { status: 'ERROR', message: error.message };
    }

    // 5. REPLACE OPTIMISTIC POST WITH REAL DB POST (Real IDs)
    const newP = {
      ...data[0],
      author: optimisticPost.author,
      date: optimisticPost.date,
      comments: [],
      likes: []
    };

    if (isAdmin) {
      setPosts(prev => prev.map(p => p.id === optimisticId ? newP : p));
      return { status: 'PUBLISHED' };
    } else {
      setPendingPosts(prev => prev.map(p => p.id === optimisticId ? newP : p));
      return { status: 'PENDING' };
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

  const editPost = async (postId, updatedData) => {
    const { error } = await supabase.from('posts').update({
      content: updatedData.content,
      image: updatedData.image
    }).eq('id', postId);

    if (!error) {
      setPosts(prev => prev.map(p => p.id === postId ? { ...p, ...updatedData } : p));
      addToast('تم التحديث', 'تم تحديث المنشور بنجاح', 'success');
    } else {
      addToast('خطأ', 'فشل تحديث المنشور', 'error');
    }
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
    const newData = { text_ar: ann.text.ar, text_en: ann.text.en, type: ann.type };
    const legacyData = { text: ann.text, type: ann.type };
    const { data, error } = await robustInsert('announcements', newData, legacyData);
    if (!error && data) setAnnouncements(prev => [...prev, { ...data[0], text: ann.text }]);
  };
  const deleteAnnouncement = async (id) => {
    const { error } = await supabase.from('announcements').delete().eq('id', id);
    if (!error) setAnnouncements(prev => prev.filter(a => a.id !== id));
  };
  const updateAnnouncement = async (id, updatedData) => {
    const newData = { text_ar: updatedData.text.ar, text_en: updatedData.text.en, type: updatedData.type };
    let { error } = await supabase.from('announcements').update(newData).eq('id', id);
    if (error && (error.message.includes('column') || error.code === '42703')) {
      error = (await supabase.from('announcements').update({ text: updatedData.text, type: updatedData.type }).eq('id', id)).error;
    }

    if (!error) {
      setAnnouncements(prev => prev.map(a => a.id === id ? { ...a, ...updatedData } : a));
    }
  };

  const addEvent = async (event) => {
    const newData = { date: event.date, text_ar: event.text.ar, text_en: event.text.en };
    const legacyData = { date: event.date, text: event.text };
    const { data, error } = await robustInsert('events', newData, legacyData);
    if (!error && data) setEvents(prev => [...prev, { ...data[0], text: event.text }]);
  };
  const deleteEvent = async (id) => {
    const { error } = await supabase.from('events').delete().eq('id', id);
    if (!error) setEvents(prev => prev.filter(e => e.id !== id));
  };
  const updateEvent = async (updatedEvent) => {
    const newData = { date: updatedEvent.date, text_ar: updatedEvent.text.ar, text_en: updatedEvent.text.en };
    let { error } = await supabase.from('events').update(newData).eq('id', updatedEvent.id);
    if (error && (error.message.includes('column') || error.code === '42703')) {
      error = (await supabase.from('events').update({ date: updatedEvent.date, text: updatedEvent.text }).eq('id', updatedEvent.id)).error;
    }
    if (!error) setEvents(prev => prev.map(e => e.id === updatedEvent.id ? updatedEvent : e));
  };

  // Courses, Tips, Quests
  const addCourse = async (course) => {
    const cleanCourse = {
      title: course.title,
      hours: course.hours,
      instructor_id: course.instructorId || course.instructor_id || course.instructor,
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

  const robustInsert = async (table, newData, legacyData, minimalData) => {
    let result = await supabase.from(table).insert([newData]).select();
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703')) {
      console.warn(`[Admin] Fallback L1 for ${table}:`, result.error.message);
      if (legacyData) result = await supabase.from(table).insert([legacyData]).select();
    }
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703')) {
      console.warn(`[Admin] Fallback L2 for ${table}:`, result.error.message);
      if (minimalData) result = await supabase.from(table).insert([minimalData]).select();
    }
    return result;
  };

  const addGradTemplate = async (t) => {
    let finalUrl = t.url;
    if (t.fileObject) {
      const uploadedUrl = await uploadFile(t.fileObject, 'faculty_uploads');
      if (!uploadedUrl) return;
      finalUrl = uploadedUrl;
    }

    const newData = { name_ar: t.name.ar, name_en: t.name.en, type: t.type, url: finalUrl };
    const legacyData = { name_ar: t.name.ar, type: t.type, url: finalUrl };
    
    const { data, error } = await robustInsert('grad_templates', newData, legacyData);
    if (!error && data) {
      setGradTemplates(prev => [...prev, { ...data[0], name: t.name }]);
      addToast(lang === 'ar' ? 'تمت الإضافة' : 'Added', lang === 'ar' ? 'تم رفع وحفظ النموذج بنجاح' : 'Template saved', 'success');
    } else if (error) {
      addToast(lang === 'ar' ? 'خطأ' : 'Error', error.message, 'error');
    }
  };

  const deleteGradTemplate = async (id) => {
    const { error } = await supabase.from('grad_templates').delete().eq('id', id);
    if (!error) {
      setGradTemplates(prev => prev.filter(t => t.id !== id));
      addToast(lang === 'ar' ? 'تم الحذف' : 'Deleted', lang === 'ar' ? 'تم حذف النموذج' : 'Template deleted', 'info');
    }
  };

  const editGradTemplate = async (id, newName, lang) => {
    const template = gradTemplates.find(t => t.id === id);
    if (!template) return;
    const updatedName = { ...template.name, [lang]: newName };
    
    // Try update with new names first
    let { error } = await supabase.from('grad_templates').update({
      name_ar: updatedName.ar,
      name_en: updatedName.en
    }).eq('id', id);

    // Fallback
    if (error && (error.message.includes('column') || error.code === '42703')) {
      const fallback = await supabase.from('grad_templates').update({
        name: updatedName.ar
      }).eq('id', id);
      error = fallback.error;
    }
    
    if (!error) {
      setGradTemplates(prev => prev.map(t => t.id === id ? { ...t, name: updatedName } : t));
    }
  };

  const deleteProject = async (id) => {
    const { error } = await supabase.from('project_bank').delete().eq('id', id);
    if (!error) setProjectBank(prev => prev.filter(p => p.id !== id));
  };

  const editProject = async (p) => {
    addToast(lang === 'ar' ? 'جاري الحفظ' : 'Saving', lang === 'ar' ? 'جاري رفع الملفات وتحديث البيانات...' : 'Uploading files and updating data...', 'info');
    
    // 1. Upload files
    const uploadedFiles = [];
    for (const f of p.files || []) {
      if (f.fileObject) {
        const url = await uploadFile(f.fileObject, 'faculty_uploads');
        if (url) uploadedFiles.push({ name: f.name, url });
      } else {
        uploadedFiles.push(f);
      }
    }

    // 2. Upload images
    const uploadedImages = [];
    for (const img of p.images || []) {
      if (img.fileObject) {
        const url = await uploadFile(img.fileObject, 'faculty_uploads');
        if (url) uploadedImages.push(url);
      } else if (typeof img === 'string') {
        uploadedImages.push(img);
      } else if (img.url) {
        uploadedImages.push(img.url);
      }
    }

    const dbData = {
      name_ar: p.name_ar || p.name?.ar,
      name_en: p.name_en || p.name?.en,
      students: p.students,
      supervisor: p.supervisor,
      link: p.link,
      rating: p.rating,
      notes_ar: p.notes_ar || p.notes?.ar,
      notes_en: p.notes_en || p.notes?.en,
      files: uploadedFiles,
      images: uploadedImages
    };
    
    let { error } = await supabase.from('project_bank').update(dbData).eq('id', p.id);
    
    if (error && error.message.includes('supervisor')) {
      const { supervisor, ...fallbackData } = dbData;
      const fallback = await supabase.from('project_bank').update(fallbackData).eq('id', p.id);
      error = fallback.error;
    }
    
    if (!error) {
      setProjectBank(prev => prev.map(oldP => oldP.id === p.id ? { ...oldP, ...dbData } : oldP));
      addToast(lang === 'ar' ? 'تم التعديل' : 'Updated', lang === 'ar' ? 'تم تعديل المشروع بنجاح' : 'Project updated', 'success');
    } else {
      addToast(lang === 'ar' ? 'خطأ' : 'Error', error.message, 'error');
    }
  };

  // Final verified project insertion logic - 3-level fallback
  const addProject = async (p) => {
    addToast(lang === 'ar' ? 'جاري الرفع' : 'Uploading', lang === 'ar' ? 'جاري رفع الملفات والصور...' : 'Uploading files and images...', 'info');
    
    // 1. Upload files
    const uploadedFiles = [];
    for (const f of p.files || []) {
      if (f.fileObject) {
        const url = await uploadFile(f.fileObject, 'faculty_uploads');
        if (url) uploadedFiles.push({ name: f.name, url });
      } else {
        uploadedFiles.push(f);
      }
    }

    // 2. Upload images
    const uploadedImages = [];
    for (const img of p.images || []) {
      if (img.fileObject) {
        const url = await uploadFile(img.fileObject, 'faculty_uploads');
        if (url) uploadedImages.push(url);
      } else if (typeof img === 'string') {
        uploadedImages.push(img);
      } else if (img.url) {
        uploadedImages.push(img.url);
      }
    }

    const newData = {
      name_ar: p.name.ar, 
      name_en: p.name.en, 
      students: p.students,
      supervisor: p.supervisor, 
      rating: p.rating,
      notes_ar: p.notes.ar, 
      notes_en: p.notes.en, 
      files: uploadedFiles, 
      images: uploadedImages,
      link: p.link
    };

    // L2 fallback: extreme minimum
    const minimalData = {
      name_ar: p.name.ar, 
      rating: p.rating, 
      notes_ar: p.notes.ar
    };

    let { data, error } = await supabase.from('project_bank').insert([newData]).select();
    
    if (error) {
      console.error("Project Bank Add Error:", error);
      // Fallback 1: Try without supervisor
      const { supervisor, ...legacyData } = newData;
      const fallback1 = await supabase.from('project_bank').insert([legacyData]).select();
      
      if (fallback1.error) {
        // Fallback 2: Absolute minimum
        const fallback2 = await supabase.from('project_bank').insert([minimalData]).select();
        data = fallback2.data;
        error = fallback2.error;
      } else {
        data = fallback1.data;
        error = null;
      }
    }
    if (!error && data) {
      setProjectBank(prev => [...prev, { ...data[0], name: p.name, notes: p.notes }]);
      addToast(lang === 'ar' ? 'تم بنجاح' : 'Success', lang === 'ar' ? 'تم إضافة المشروع لبنك المشاريع' : 'Project added', 'success');
    } else if (error) {
      addToast(lang === 'ar' ? 'خطأ' : 'Error', error.message, 'error');
    }
  };

  const addCvTemplate = async (t) => {
    let finalUrl = t.url;
    if (t.fileObject) {
      const uploadedUrl = await uploadFile(t.fileObject, 'faculty_uploads');
      if (!uploadedUrl) return;
      finalUrl = uploadedUrl;
    }

    const nameObj = typeof t.name === 'object' ? t.name : { ar: t.name, en: t.name };
    const nameStr = nameObj.ar || nameObj.en || 'CV Template';

    const payload1 = { name: nameObj, url: finalUrl, file_name: t.file };
    const payload2 = { name: nameStr, url: finalUrl, file_name: t.file };
    const payload3 = { name: nameStr, url: finalUrl };
    const payload4 = { name_ar: nameObj.ar, name_en: nameObj.en, url: finalUrl, file_name: t.file };
    const payload5 = { name_ar: nameObj.ar, name_en: nameObj.en, url: finalUrl };
    const payload6 = { title: nameStr, url: finalUrl };
    const payload7 = { template_name: nameStr, url: finalUrl };
    const payload8 = { cv_name: nameStr, url: finalUrl };

    console.log('[addCvTemplate] Starting insertion fallbacks...');

    let result = await supabase.from('cv_templates').insert([payload1]).select();
    
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703' || result.error.message.includes('type'))) {
      console.log('[addCvTemplate] Fallback to payload2 (name as string + file_name)');
      result = await supabase.from('cv_templates').insert([payload2]).select();
    }
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703' || result.error.message.includes('type'))) {
      console.log('[addCvTemplate] Fallback to payload3 (name as string)');
      result = await supabase.from('cv_templates').insert([payload3]).select();
    }
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703' || result.error.message.includes('type'))) {
      console.log('[addCvTemplate] Fallback to payload4 (name_ar/name_en)');
      result = await supabase.from('cv_templates').insert([payload4]).select();
    }
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703' || result.error.message.includes('type'))) {
      console.log('[addCvTemplate] Fallback to payload5');
      result = await supabase.from('cv_templates').insert([payload5]).select();
    }
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703' || result.error.message.includes('type'))) {
      console.log('[addCvTemplate] Fallback to payload6 (title as string)');
      result = await supabase.from('cv_templates').insert([payload6]).select();
    }
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703' || result.error.message.includes('type'))) {
      console.log('[addCvTemplate] Fallback to payload7 (template_name)');
      result = await supabase.from('cv_templates').insert([payload7]).select();
    }
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703' || result.error.message.includes('type'))) {
      console.log('[addCvTemplate] Fallback to payload8 (cv_name)');
      result = await supabase.from('cv_templates').insert([payload8]).select();
    }

    const { data, error } = result;
    console.log('[addCvTemplate] Final result:', { data, error });

    if (!error && data) {
      setCvTemplates(prev => [...prev, { ...data[0], name: t.name }]);
      addToast(lang === 'ar' ? 'تمت الإضافة' : 'Added', lang === 'ar' ? 'تم حفظ قالب السيرة الذاتية بنجاح' : 'CV Template saved', 'success');
    } else if (error) {
      addToast(lang === 'ar' ? 'خطأ' : 'Error', error.message, 'error');
    }
  };

  const deleteCvTemplate = async (id) => {
    const { error } = await supabase.from('cv_templates').delete().eq('id', id);
    if (!error) setCvTemplates(prev => prev.filter(t => t.id !== id));
  };

  const editCvTemplate = async (t) => {
    const nameObj = typeof t.name === 'object' && t.name !== null ? t.name : { ar: t.name_ar || t.name, en: t.name_en || t.name };
    const nameStr = nameObj.ar || nameObj.en || t.name_ar || t.name || 'CV Template';

    const payload1 = { name: nameObj, url: t.url, file_name: t.file_name || t.file };
    const payload2 = { name: nameStr, url: t.url, file_name: t.file_name || t.file };
    const payload3 = { name: nameStr, url: t.url };
    const payload4 = { name_ar: nameObj.ar, name_en: nameObj.en, url: t.url, file_name: t.file_name || t.file };
    const payload5 = { name_ar: nameObj.ar, name_en: nameObj.en, url: t.url };
    const payload6 = { title: nameStr, url: t.url };
    const payload7 = { template_name: nameStr, url: t.url };
    const payload8 = { cv_name: nameStr, url: t.url };

    let result = await supabase.from('cv_templates').update(payload1).eq('id', t.id);
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703' || result.error.message.includes('type'))) {
      result = await supabase.from('cv_templates').update(payload2).eq('id', t.id);
    }
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703' || result.error.message.includes('type'))) {
      result = await supabase.from('cv_templates').update(payload3).eq('id', t.id);
    }
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703' || result.error.message.includes('type'))) {
      result = await supabase.from('cv_templates').update(payload4).eq('id', t.id);
    }
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703' || result.error.message.includes('type'))) {
      result = await supabase.from('cv_templates').update(payload5).eq('id', t.id);
    }
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703' || result.error.message.includes('type'))) {
      result = await supabase.from('cv_templates').update(payload6).eq('id', t.id);
    }
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703' || result.error.message.includes('type'))) {
      result = await supabase.from('cv_templates').update(payload7).eq('id', t.id);
    }
    if (result.error && (result.error.message.includes('column') || result.error.code === '42703' || result.error.message.includes('type'))) {
      result = await supabase.from('cv_templates').update(payload8).eq('id', t.id);
    }

    const { error } = result;

    if (!error) {
      setCvTemplates(prev => prev.map(oldT => oldT.id === t.id ? { ...oldT, ...payload3, name: payload1.name } : oldT));
      addToast(lang === 'ar' ? 'تم التعديل' : 'Updated', lang === 'ar' ? 'تم التعديل بنجاح' : 'Updated successfully', 'success');
    }
  };
  
  const addInterviewResource = async (r) => {
    const newData = { title_ar: r.title.ar, title_en: r.title.en, type: r.type, url: r.url };
    const legacyData = { title_ar: r.title.ar, type: r.type, url: r.url };
    const minimalData = { title: r.title.ar, type: r.type, url: r.url };
    const { data, error } = await robustInsert('interview_resources', newData, legacyData, minimalData);
    if (!error && data) {
      setInterviewResources(prev => [...prev, { ...data[0], title: r.title }]);
      addToast('تمت الإضافة', 'تم إضافة المصدر بنجاح', 'success');
    } else if (error) {
      addToast('خطأ', error.message, 'error');
    }
  };

  const deleteInterviewResource = async (id) => {
    const { error } = await supabase.from('interview_resources').delete().eq('id', id);
    if (!error) setInterviewResources(prev => prev.filter(r => r.id !== id));
  };

  const editInterviewResource = async (r) => {
    const dbData = {
      title_ar: r.title_ar || r.title?.ar,
      title_en: r.title_en || r.title?.en,
      type: r.type,
      url: r.url
    };
    const { error } = await supabase.from('interview_resources').update(dbData).eq('id', r.id);
    if (!error) {
      setInterviewResources(prev => prev.map(oldR => oldR.id === r.id ? { ...oldR, ...dbData } : oldR));
      addToast('تم التعديل', 'تم التعديل بنجاح', 'success');
    }
  };
  
  const addLinkedinTip = async (t) => {
    const newData = { title_ar: t.title.ar, title_en: t.title.en, type: t.type, content: t.content, url: t.url };
    const legacyData = { title_ar: t.title.ar, type: t.type, url: t.url };
    const minimalData = { title: t.title.ar, type: t.type, url: t.url };
    const { data, error } = await robustInsert('linkedin_tips', newData, legacyData, minimalData);
    if (!error && data) {
      setLinkedinTips(prev => [...prev, { ...data[0], title: t.title }]);
      addToast('تمت الإضافة', 'تم إضافة النصيحة بنجاح', 'success');
    } else if (error) {
      addToast('خطأ', error.message, 'error');
    }
  };

  const deleteLinkedinTip = async (id) => {
    const { error } = await supabase.from('linkedin_tips').delete().eq('id', id);
    if (!error) setLinkedinTips(prev => prev.filter(t => t.id !== id));
  };

  const editLinkedinTip = async (t) => {
    const dbData = {
      title_ar: t.title_ar || t.title?.ar,
      title_en: t.title_en || t.title?.en,
      type: t.type,
      content: t.content,
      url: t.url
    };
    const { error } = await supabase.from('linkedin_tips').update(dbData).eq('id', t.id);
    if (!error) {
      setLinkedinTips(prev => prev.map(oldT => oldT.id === t.id ? { ...oldT, ...dbData } : oldT));
      addToast('تم التعديل', 'تم التعديل بنجاح', 'success');
    }
  };

  // Live Labs CRUD
  const addLab = async (lab) => {
    // Only send the columns that exist in the SQL table
    const dbData = {
      name_ar: lab.name_ar,
      name_en: lab.name_en,
      status: lab.status || 'متاح',
      current_class: lab.current_class || '',
      next_class: lab.next_class || '',
      capacity: parseInt(lab.capacity) || 0
    };

    const { data, error } = await supabase.from('live_labs').insert([dbData]).select();
    
    if (!error && data) {
      setLiveLabs(prev => [...prev, data[0]]);
      addToast(lang === 'ar' ? 'تمت الإضافة' : 'Added', lang === 'ar' ? 'تم إضافة المختبر بنجاح' : 'Lab added successfully', 'success');
    } else {
      console.error("Supabase Lab Add Error:", error);
      // Local fallback
      setLiveLabs(prev => [...prev, { ...dbData, id: Date.now() }]);
      const errorMsg = error?.message || (lang === 'ar' ? 'تعذر الحفظ في السيرفر' : 'Server error');
      addToast(lang === 'ar' ? 'خطأ في قاعدة البيانات' : 'DB Error', errorMsg + (lang === 'ar' ? ' (تم الحفظ محلياً)' : ' (Saved locally)'), 'error');
    }
  };

  const deleteLab = async (id) => {
    const { error } = await supabase.from('live_labs').delete().eq('id', id);
    if (!error) setLiveLabs(prev => prev.filter(l => l.id !== id));
    else setLiveLabs(prev => prev.filter(l => l.id !== id)); // Local fallback
  };

  const editLab = async (updatedLab) => {
    const dbData = {
      name_ar: updatedLab.name_ar,
      name_en: updatedLab.name_en,
      status: updatedLab.status,
      current_class: updatedLab.current_class,
      next_class: updatedLab.next_class,
      capacity: parseInt(updatedLab.capacity) || 0
    };

    const { error } = await supabase.from('live_labs').update(dbData).eq('id', updatedLab.id);
    
    if (!error) {
      setLiveLabs(prev => prev.map(l => l.id === updatedLab.id ? { ...l, ...dbData } : l));
      addToast(lang === 'ar' ? 'تم التعديل' : 'Updated', lang === 'ar' ? 'تم تحديث بيانات المختبر' : 'Lab updated', 'success');
    } else {
      console.error("Edit Lab Error:", error);
      // Local fallback
      setLiveLabs(prev => prev.map(l => l.id === updatedLab.id ? { ...l, ...dbData } : l));
      addToast(lang === 'ar' ? 'خطأ في قاعدة البيانات' : 'DB Error', error.message || 'تم الحفظ محلياً فقط', 'info');
    }
  };

  // Honor Roll CRUD
  const addHonorStudent = async (student) => {
    const dbData = {
      student_name: student.studentName,
      major: student.major,
      year: student.year
    };
    const { data, error } = await supabase.from('honor_roll').insert([dbData]).select();
    if (!error && data) {
      // Map back to UI format
      const newStudent = {
        ...data[0],
        studentName: data[0].student_name
      };
      setHonorRoll(prev => [...prev, newStudent]);
      addToast('تمت الإضافة', 'تم إضافة الطالب إلى لوحة الشرف بنجاح', 'success');
    } else {
      console.error("Honor Roll Insert Error:", error);
      addToast('فشل الاتصال بقاعدة البيانات', `[SQL_ERROR]: ${error?.message || 'لا توجد استجابة من السيرفر'}`, 'error');
    }
  };

  const editHonorStudent = async (student) => {
    const dbData = {
      student_name: student.studentName,
      major: student.major,
      year: student.year
    };
    const { error } = await supabase.from('honor_roll').update(dbData).eq('id', student.id);
    if (!error) {
      setHonorRoll(prev => prev.map(s => s.id === student.id ? student : s));
      addToast('تم التحديث', 'تم تحديث بيانات الطالب بنجاح', 'success');
    } else {
      console.error("Honor Roll Update Error:", error);
      addToast('خطأ في التحديث', error.message, 'error');
    }
  };

  const deleteHonorStudent = async (id) => {
    const { error } = await supabase.from('honor_roll').delete().eq('id', id);
    if (!error) {
      setHonorRoll(prev => prev.filter(s => s.id !== id));
      addToast('تم الحذف', 'تم حذف الطالب من لوحة الشرف', 'info');
    }
  };
  // Achievements CRUD

  // Achievements CRUD
  const addAchievement = async (achData) => {
    try {
      const dbData = {
        title_ar: achData.title?.ar,
        title_en: achData.title?.en,
        summary_ar: achData.summary?.ar,
        summary_en: achData.summary?.en,
        report_ar: achData.report?.ar,
        report_en: achData.report?.en,
        year: achData.year,
        date: achData.date,
        participants_ar: achData.participants?.ar,
        participants_en: achData.participants?.en,
        images: achData.images || []
      };

      const { data, error } = await supabase.from('achievements').insert([dbData]).select();
      if (error) {
        console.error("Supabase Save Error:", error);
        addToast('فشل الحفظ في السيرفر', `[SQL_ERROR]: ${error.message}`, 'error');
        return { success: false, error: error.message };
      }
      
      fetchAchievements();
      addToast('تمت الإضافة بنجاح', 'تم حفظ الإنجاز في قاعدة البيانات', 'success');
      return { success: true };
    } catch (err) { 
      console.error("Add Catch Error:", err);
      addToast('خطأ غير متوقع', err.message, 'error');
      return { success: false }; 
    }
  };

  const editAchievement = async (achData) => {
    try {
      const dbData = {
        title_ar: achData.title?.ar,
        title_en: achData.title?.en,
        summary_ar: achData.summary?.ar,
        summary_en: achData.summary?.en,
        report_ar: achData.report?.ar,
        report_en: achData.report?.en,
        year: achData.year,
        date: achData.date,
        participants_ar: achData.participants?.ar,
        participants_en: achData.participants?.en,
        images: achData.images
      };
      const { error } = await supabase.from('achievements').update(dbData).eq('id', achData.id);
      if (error) throw error;
      fetchAchievements();
      return { success: true };
    } catch (err) { console.error(err); return { success: false }; }
  };

  const deleteAchievement = async (id) => {
    try {
      // Use .select() to verify if a row was actually deleted
      const { data, error } = await supabase.from('achievements').delete().eq('id', id).select();
      
      if (error) {
        addToast('خطأ في السيرفر', error.message, 'error');
        return { success: false };
      }

      if (!data || data.length === 0) {
        addToast('تنبيه', 'لم يتم العثور على هذا الإنجاز في السيرفر (ربما حُذف مسبقاً)', 'warning');
      } else {
        addToast('تم الحذف بنجاح', 'تم إزالة الإنجاز من قاعدة البيانات', 'success');
      }

      // Force update local state and clear cache
      const newList = achievements.filter(a => a.id !== id);
      setAchievements(newList);
      localStorage.setItem('site_ach_v2', JSON.stringify(newList));
      
      return { success: true };
    } catch (err) { 
      console.error("Delete Catch:", err);
      return { success: false }; 
    }
  };

  const addQuest = async (questData) => {
    try {
      const { data, error } = await supabase.from('quests').insert([questData]).select();
      if (error) throw error;
      fetchQuests();
      return { success: true };
    } catch (err) { console.error(err); return { success: false }; }
  };

  const editQuest = async (questData) => {
    try {
      const { error } = await supabase.from('quests').update(questData).eq('id', questData.id);
      if (error) throw error;
      fetchQuests();
      return { success: true };
    } catch (err) { console.error(err); return { success: false }; }
  };

  const deleteQuest = async (id) => {
    try {
      const { error } = await supabase.from('quests').delete().eq('id', id);
      if (error) throw error;
      setQuests(quests.filter(q => q.id !== id));
      return { success: true };
    } catch (err) { console.error(err); return { success: false }; }
  };

  const completeQuest = async (questId, userId) => {
    try {
      const newAchievement = { student_id: userId, quest_id: questId, completed_at: new Date().toISOString() };
      const updatedQuests = [...studentQuests, newAchievement];
      
      setStudentQuests(updatedQuests);
      localStorage.setItem('student_quests_local', JSON.stringify(updatedQuests));
      
      return { success: true };
    } catch (err) {
      console.error("Error saving achievement locally:", err.message);
      return { success: false };
    }
  };

  const reorderQuests = async (newQuests) => {
    setQuests(newQuests);
    localStorage.setItem('site_quests_v2', JSON.stringify(newQuests));
  };

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
      quests, addQuest, deleteQuest, editQuest, reorderQuests, completeQuest, studentQuests,
      gradTemplates, addGradTemplate, deleteGradTemplate, editGradTemplate,
      projectBank,
      addProject,
      editProject,
      deleteProject,
      cvTemplates,
      addCvTemplate,
      editCvTemplate,
      deleteCvTemplate,
      interviewResources,
      addInterviewResource,
      editInterviewResource,
      deleteInterviewResource,
      linkedinTips,
      addLinkedinTip,
      editLinkedinTip,
      deleteLinkedinTip,
      departments, addDepartment, deleteDepartment, updateDepartment,
      posts, addPost, approvePost, rejectPost, deletePost, editPost, toggleLike,
      addComment, deleteComment, editComment, likeComment, pendingPosts,
      announcements, addAnnouncement, deleteAnnouncement, updateAnnouncement,
      events, addEvent, deleteEvent, updateEvent,
      liveLabs, addLab, editLab, deleteLab,
      honorRoll, addHonorStudent, deleteHonorStudent, editHonorStudent,
      achievements, addAchievement, deleteAchievement, editAchievement,
      roadmapCourses, addRoadmapCourse, updateRoadmapCourse, deleteRoadmapCourse,
      uploadFile,
      loading, fetchAdminDashboardData
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
