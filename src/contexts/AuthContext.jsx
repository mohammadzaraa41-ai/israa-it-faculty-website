import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB_SCHEMA } from '../data/db_schema';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('site_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState(() => {
    const saved = localStorage.getItem('site_users');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);

  const [pendingUsers, setPendingUsers] = useState(() => {
    const saved = localStorage.getItem('site_pending_users');
    return saved ? JSON.parse(saved) : [];
  });
  const [alumniRequests, setAlumniRequests] = useState(() => {
    const saved = localStorage.getItem('site_alumni_requests');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const [
          { data: usersData },
          { data: pendingData },
          { data: alumniData }
        ] = await Promise.all([
          supabase.from('users').select('*'),
          supabase.from('pending_users').select('*').eq('status', 'pending'),
          supabase.from('alumni_requests').select('*').eq('status', 'pending')
        ]);

        if (usersData) {
          const mappedUsers = usersData.map(u => ({
            ...u,
            name: { ar: u.name_ar, en: u.name_en }
          }));
          setUsers(mappedUsers);
          
          const savedUserStr = localStorage.getItem('site_user');
          if (savedUserStr) {
            const savedUser = JSON.parse(savedUserStr);
            const freshUser = mappedUsers.find(u => u.id === savedUser.id);
            if (freshUser) {
              const updatedSession = { ...savedUser, ...freshUser };
              setUser(updatedSession);
              localStorage.setItem('site_user', JSON.stringify(updatedSession));
            }
          }
        }

        if (pendingData) {
          setPendingUsers(pendingData.map(p => ({
            ...p,
            fullName: p.full_name,
            universityId: p.university_id,
            yearSem: p.year_sem
          })));
        }

        if (alumniData) {
          setAlumniRequests(alumniData.map(a => ({
            ...a,
            fullName: a.full_name,
            universityId: a.university_id,
            userId: a.user_id,
            scheduleImage: a.schedule_image
          })));
        }
      } catch (err) {
        console.error("Supabase fetch error:", err);
      }
      setLoading(false);
    };
    fetchAuthData();
  }, []);

  useEffect(() => {
    if (users.length > 0) localStorage.setItem('site_users', JSON.stringify(users));
    if (pendingUsers.length > 0) localStorage.setItem('site_pending_users', JSON.stringify(pendingUsers));
    if (alumniRequests.length > 0) localStorage.setItem('site_alumni_requests', JSON.stringify(alumniRequests));
  }, [users, pendingUsers, alumniRequests]);

  const login = async (username, password) => {
    try {
      const cleanUsername = username.trim();
      const cleanPassword = password.trim();

      const { data: usersFound, error: fetchError } = await supabase
        .rpc('secure_login', { 
          p_username: cleanUsername, 
          p_password: cleanPassword 
        });
      
      if (fetchError) {
        console.error("Login Error:", fetchError);
        return { success: false, message: 'خطأ في الاتصال بقاعدة البيانات' };
      }

      const data = usersFound && usersFound.length > 0 ? usersFound[0] : null;

      if (!data) {

        const { count, error: countError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .ilike('username', cleanUsername);
        
        if (!countError && count === 0) {
          return { success: false, message: 'اسم المستخدم غير موجود في النظام' };
        }
        return { success: false, message: 'كلمة المرور غير صحيحة' };
      }

      const loggedUser = { 
        ...data, 
        name: { ar: data.name_ar, en: data.name_en },
        permissions: (data.role === 'SUPER_ADMIN' || data.role === 'DEAN')
          ? ['EDIT_ALL', 'MANAGE_USERS', 'VIEW_ANALYTICS'] 
          : ['VIEW_PORTAL', 'ACCESS_RESOURCES']
      };

      setUser(loggedUser);
      localStorage.setItem('site_user', JSON.stringify(loggedUser));
      return { success: true, user: loggedUser };
    } catch (err) {
      console.error("Login catch error:", err);
      return { success: false, message: 'حدث خطأ تقني في تسجيل الدخول' };
    }
  };

  const registerRequest = async (userData) => {
    const requestId = 'p' + Date.now();
    const newUserRequest = {
      id: requestId,
      full_name: userData.fullName,
      phone: userData.phone,
      university_id: userData.universityId,
      dob: userData.dob,
      major: userData.major,
      year_sem: userData.yearSem,
      hours: userData.hours,
      password: userData.password,
      status: 'pending'
    };
    
    const { error } = await supabase.from('pending_users').insert([newUserRequest]);
    if (!error) {
      setPendingUsers(prev => [...prev, { ...userData, id: requestId, status: 'pending' }]);
      return { success: true };
    }
    return { success: false, message: error.message };
  };

  const submitAlumniRequest = async (userId, data) => {
    const requestId = 'ar' + Date.now();
    const request = {
      id: requestId,
      user_id: userId,
      full_name: data.fullName,
      university_id: data.universityId,
      hours: data.hours,
      schedule_image: data.scheduleImage,
      status: 'pending'
    };
    
    const { error } = await supabase.from('alumni_requests').insert([request]);
    if (!error) {
      setAlumniRequests(prev => [...prev, { ...data, id: requestId, userId, status: 'pending' }]);
      return { success: true };
    }
    return { success: false, message: error.message };
  };

  const approveAlumniRequest = async (requestId) => {
    const req = alumniRequests.find(r => r.id === requestId);
    if (req) {

      const { error: userErr } = await supabase
        .from('users')
        .update({ is_alumni: true })
        .eq('id', req.userId);
      
      if (userErr) return false;

      const { error: reqErr } = await supabase.from('alumni_requests').delete().eq('id', requestId);
      
      setUsers(prev => prev.map(u => u.id === req.userId ? { ...u, isAlumni: true, is_alumni: true } : u));
      setAlumniRequests(prev => prev.filter(r => r.id !== requestId));
      
      if (user?.id === req.userId) {
        const updatedUser = { ...user, isAlumni: true, is_alumni: true };
        setUser(updatedUser);
        localStorage.setItem('site_user', JSON.stringify(updatedUser));
      }
      return true;
    }
    return false;
  };

  const rejectAlumniRequest = async (requestId) => {
    const { error } = await supabase.from('alumni_requests').delete().eq('id', requestId);
    if (!error) {
      setAlumniRequests(prev => prev.filter(r => r.id !== requestId));
      return true;
    }
    return false;
  };
  const approveUser = async (pendingId) => {
    const userToApprove = pendingUsers.find(u => u.id === pendingId);
    if (userToApprove) {
      const { error: insertErr } = await supabase.rpc('register_user_secure', {
        p_username: userToApprove.universityId,
        p_password: userToApprove.password,
        p_role: 'STUDENT',
        p_name_ar: userToApprove.fullName,
        p_name_en: '',
        p_dept_id: (['cs', 'se', 'cyber', 'dsai'].includes(userToApprove.major)) ? userToApprove.major : 'cs'
      });

      if (insertErr) {
        console.error("Approve User Error:", insertErr);
        return false;
      }

      setUsers(prev => [...prev, { 
        id: 'u' + Date.now(),
        username: userToApprove.universityId,
        role: 'STUDENT',
        name: { ar: userToApprove.fullName, en: '' },
        department_id: (['cs', 'se', 'cyber', 'dsai'].includes(userToApprove.major)) ? userToApprove.major : 'cs',
        is_alumni: false
      }]);

      await supabase.from('pending_users').delete().eq('id', pendingId);
      setPendingUsers(prev => prev.filter(u => u.id !== pendingId));
      return true;
    }
    return false;
  };

  const rejectUser = async (pendingId) => {
    const { error } = await supabase.from('pending_users').delete().eq('id', pendingId);
    if (!error) {
      setPendingUsers(prev => prev.filter(u => u.id !== pendingId));
      return true;
    }
    return false;
  };

  const registerUserDirectly = async (userData) => {
    const { error } = await supabase.rpc('register_user_secure', {
      p_username: userData.username,
      p_password: userData.password,
      p_role: userData.role,
      p_name_ar: userData.name?.ar || userData.nameAr,
      p_name_en: userData.name?.en || userData.nameEn,
      p_dept_id: userData.departmentId
    });

    if (!error) {
      setUsers(prev => [...prev, { 
        id: 'u' + Date.now(),
        username: userData.username,
        role: userData.role,
        name: { 
          ar: userData.name?.ar || userData.nameAr, 
          en: userData.name?.en || userData.nameEn 
        },
        department_id: userData.departmentId,
        is_alumni: false
      }]);
      return { success: true };
    }
    return { success: false, message: error.message };
  };

  const deleteUser = async (userId) => {
    const { error } = await supabase.from('users').delete().eq('id', userId);
    if (!error) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      return { success: true };
    }
    return { success: false, message: error.message };
  };

  const updateUserRole = async (userId, newRole) => {
    const { error } = await supabase.from('users').update({ role: newRole }).eq('id', userId);
    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
      return { success: true };
    }
    return { success: false, message: error.message };
  };

  const updateUser = async (userId, updatedData) => {
    const dbData = {
      username: updatedData.username,
      password: updatedData.password,
      name_ar: updatedData.name?.ar,
      name_en: updatedData.name?.en,
      department_id: updatedData.departmentId
    };

    Object.keys(dbData).forEach(key => dbData[key] === undefined && delete dbData[key]);

    const { error } = await supabase.from('users').update(dbData).eq('id', userId);
    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
      return { success: true };
    }
    return { success: false, message: error.message };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('site_user');
  };

  const hasPermission = (permission) => {
    return user?.permissions.includes(permission) || user?.role === 'SUPER_ADMIN';
  };

  const [isLoginOpen, setIsLoginOpen] = useState(false);

  const toggleLogin = (val) => setIsLoginOpen(val !== undefined ? val : !isLoginOpen);

  return (
    <AuthContext.Provider value={{ 
      user, users, pendingUsers, alumniRequests,
      login, logout, registerRequest, approveUser, rejectUser,
      submitAlumniRequest, approveAlumniRequest, rejectAlumniRequest,
      registerUserDirectly, deleteUser, updateUserRole, updateUser,
      hasPermission, role: user?.role, isLoginOpen, toggleLogin 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
