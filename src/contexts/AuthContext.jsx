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

  // --- FETCH USERS FROM SUPABASE ---
  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const [
          { data: usersData },
          { data: pendingData }
        ] = await Promise.all([
          supabase.from('users').select('*'),
          supabase.from('pending_users').select('*').eq('status', 'pending')
        ]);

        if (usersData) {
          setUsers(usersData.map(u => ({
            ...u,
            name: { ar: u.name_ar, en: u.name_en }
          })));
        }

        if (pendingData) {
          setPendingUsers(pendingData.map(p => ({
            ...p,
            fullName: p.full_name,
            universityId: p.university_id,
            yearSem: p.year_sem
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

      console.log("Attempting login for:", cleanUsername);
      
      // Fetch the first user that matches the username AND password
      const { data: usersFound, error: fetchError } = await supabase
        .from('users')
        .select('*')
        .ilike('username', cleanUsername)
        .eq('password', cleanPassword)
        .limit(1);
      
      if (fetchError) {
        console.error("Supabase Login Error:", fetchError);
        return { success: false, message: 'خطأ في الاتصال: ' + fetchError.message };
      }

      const data = usersFound && usersFound.length > 0 ? usersFound[0] : null;
      console.log("Login query result:", data);

      if (!data) {
        // Let's check if the user exists at all without checking password
        const { count, error: countError } = await supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .ilike('username', cleanUsername);
        
        console.log("User existence check (count):", count);
        
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

  const submitAlumniRequest = (userId, data) => {
    const request = {
      ...data,
      id: 'ar' + Date.now(),
      userId,
      requestDate: new Date().toISOString(),
      status: 'pending'
    };
    setAlumniRequests(prev => [...prev, request]);
    return { success: true };
  };

  const approveAlumniRequest = (requestId) => {
    const req = alumniRequests.find(r => r.id === requestId);
    if (req) {
      setUsers(prev => prev.map(u => u.id === req.userId ? { ...u, isAlumni: true, permissions: [...u.permissions, 'ACCESS_ALUMNI'] } : u));
      setAlumniRequests(prev => prev.filter(r => r.id !== requestId));
      
      // Update current user if it's the one being approved
      if (user?.id === req.userId) {
        const updatedUser = { ...user, isAlumni: true, permissions: [...user.permissions, 'ACCESS_ALUMNI'] };
        setUser(updatedUser);
        localStorage.setItem('site_user', JSON.stringify(updatedUser));
      }
      return true;
    }
    return false;
  };

  const rejectAlumniRequest = (requestId) => {
    setAlumniRequests(prev => prev.filter(r => r.id !== requestId));
  };

  const approveUser = async (pendingId) => {
    const userToApprove = pendingUsers.find(u => u.id === pendingId);
    if (userToApprove) {
      const activeUser = {
        id: 'u' + Date.now(),
        username: userToApprove.universityId,
        password: userToApprove.password,
        role: 'STUDENT',
        name_ar: userToApprove.fullName,
        department_id: userToApprove.major === 'cs' ? 'cs' : userToApprove.major,
        is_alumni: false
      };
      
      // 1. Insert into users table
      const { error: insertErr } = await supabase.from('users').insert([activeUser]);
      if (insertErr) {
        console.error("Approve User Insert Error:", JSON.stringify(insertErr, null, 2));
        return false;
      }

      // 2. Delete from pending_users
      const { error: deleteErr } = await supabase.from('pending_users').delete().eq('id', pendingId);
      
      setUsers(prev => [...prev, { ...activeUser, name: { ar: activeUser.name_ar, en: '' } }]);
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
    const newUser = {
      id: 'u' + Date.now(),
      username: userData.username,
      password: userData.password,
      role: userData.role,
      name_ar: userData.name?.ar || userData.nameAr,
      name_en: userData.name?.en || userData.nameEn,
      department_id: userData.departmentId,
      is_alumni: false
    };

    const { error } = await supabase.from('users').insert([newUser]);
    if (!error) {
      setUsers(prev => [...prev, { 
        ...newUser, 
        name: { ar: newUser.name_ar, en: newUser.name_en } 
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
    // Remove undefined fields
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
