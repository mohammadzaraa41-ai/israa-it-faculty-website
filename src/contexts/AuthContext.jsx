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

  const [pendingUsers, setPendingUsers] = useState([]);
  const [alumniRequests, setAlumniRequests] = useState([]);

  useEffect(() => {
    const fetchAuthData = async () => {
      try {
        const savedUserStr = localStorage.getItem('site_user');
        
        if (savedUserStr) {
          const savedUser = JSON.parse(savedUserStr);
          const { data: usersFound, error: uErr } = await supabase
            .from('users')
            .select('*')
            .ilike('username', savedUser.username);
          
          const userData = usersFound && usersFound.length > 0 ? usersFound[0] : null;

          if (!uErr && userData) {
            const { password, ...safeUserData } = userData;
            const freshUser = {
              ...safeUserData,
              name: { ar: safeUserData.name_ar, en: safeUserData.name_en },
              departmentId: safeUserData.department_id
            };
            setUser(freshUser);
            localStorage.setItem('site_user', JSON.stringify(freshUser));
          }
        }

        const [
          { data: pendingData, error: pErr },
          { data: alumniData, error: aErr }
        ] = await Promise.all([
          supabase.from('pending_users').select('*').in('status', ['pending', 'PENDING']),
          supabase.from('alumni_requests').select('*').in('status', ['pending', 'rejected'])
        ]);

        if (pErr) console.error("Pending users fetch error:", pErr);
        if (aErr) console.error("Alumni requests fetch error:", aErr);

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
        console.error("Supabase fetch global error:", err);
      }
      setLoading(false);
    };
    fetchAuthData();
  }, []);

  const fetchAllUsers = async () => {
    const { data, error } = await supabase.from('users').select('*');
    if (error) return [];
    if (data) {
      const mapped = data.map(({ password, ...u }) => ({
        ...u,
        name: { ar: u.name_ar, en: u.name_en },
        departmentId: u.department_id
      }));
      setUsers(mapped);
      return mapped;
    }
    return [];
  };

  const fetchPendingUsers = async () => {
    const { data, error } = await supabase.from('pending_users').select('*').in('status', ['pending', 'PENDING']);
    if (!error && data) {
      const mapped = data.map(p => ({
        ...p,
        fullName: p.full_name,
        universityId: p.university_id,
        yearSem: p.year_sem
      }));
      setPendingUsers(mapped);
      return mapped;
    }
    return [];
  };

  // Sync to localStorage only when data exists to prevent overwriting with empty arrays during initial load
  useEffect(() => {
    if (users.length > 0) {
      const timer = setTimeout(() => localStorage.setItem('site_users', JSON.stringify(users)), 500);
      return () => clearTimeout(timer);
    }
  }, [users]);

  // No longer sync pending requests to localStorage to prevent stale data flickering

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

      const { password: _pw, ...safeData } = data;
      const loggedUser = { 
        ...safeData, 
        name: { ar: safeData.name_ar, en: safeData.name_en },
        departmentId: safeData.department_id,
        permissions: ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(safeData.role)
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
    const newUserRequest = {
      full_name: userData.fullName,
      phone: userData.phone,
      university_id: userData.universityId,
      dob: userData.dob,
      major: userData.major,
      year_sem: userData.yearSem,
      hours: userData.hours,
      password: userData.password,
      status: 'PENDING'
    };
    
    const { data, error } = await supabase.from('pending_users').insert([newUserRequest]).select();
    if (!error && data) {
      const inserted = data[0];
      const mapped = {
        ...inserted,
        fullName: inserted.full_name,
        universityId: inserted.university_id,
        yearSem: inserted.year_sem
      };
      setPendingUsers(prev => [...prev, mapped]);
      return { success: true };
    }
    
    if (error) {
      if (error.code === '23505') {
        return { 
          success: false, 
          message: lang === 'ar' ? 'عذراً، هذا الرقم الجامعي مسجل مسبقاً في النظام أو قيد المراجعة.' : 'Sorry, this university ID is already registered or under review.' 
        };
      }
      return { success: false, message: error.message };
    }
    return { success: false, message: 'Unknown error occurred' };
  };

  const submitAlumniRequest = async (userId, data) => {
    try {
      let imageUrl = data.scheduleImage;

      // Handle image upload if a file is provided
      if (data.imageFile) {
        const file = data.imageFile;
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `alumni_schedules/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('faculty_uploads')
          .upload(filePath, file);

        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage
            .from('faculty_uploads')
            .getPublicUrl(filePath);
          imageUrl = publicUrl;
        }
      }

      const request = {
        user_id: userId,
        full_name: data.fullName,
        university_id: data.universityId,
        hours: data.hours,
        schedule_image: imageUrl,
        status: 'pending'
      };
      
      const { data: insertedData, error } = await supabase
        .from('alumni_requests')
        .insert([request])
        .select();

      if (!error && insertedData) {
        const newRequest = { 
          ...data, 
          id: insertedData[0].id, 
          userId, 
          scheduleImage: imageUrl, 
          status: 'pending' 
        };
        setAlumniRequests(prev => [...prev, newRequest]);
        return { success: true };
      }
      
      return { success: false, message: error?.message };
    } catch (err) {
      return { success: false, message: err.message };
    }
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
    const { error } = await supabase
      .from('alumni_requests')
      .update({ status: 'rejected' })
      .eq('id', requestId);
    
    if (!error) {
      setAlumniRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
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
        console.error("RPC Error:", insertErr);
        return false;
      }

      // Save extra fields after account creation
      await supabase.from('users').update({
        phone: userToApprove.phone || userToApprove.phone_number,
        major: userToApprove.major,
        year_sem: userToApprove.yearSem || userToApprove.year_sem,
        hours: userToApprove.hours || 0,
        name_ar: userToApprove.fullName // Ensure name_ar is set
      }).ilike('username', userToApprove.universityId);

      // Force refresh users list from DB
      await fetchAllUsers();

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

    if (!error || (error.message && error.message.includes("No rows returned"))) {
      // Save extra fields after successful account creation
      await supabase.from('users').update({
        phone: userData.phone,
        dob: userData.dob,
        major: userData.major,
        year_sem: userData.yearSem,
        hours: userData.hours
      }).ilike('username', userData.username);

      // Force refresh users list from DB to get the correct generated ID and data
      const { data: refreshedUsers } = await supabase.from('users').select('*');
      if (refreshedUsers) setUsers(refreshedUsers);
      
      return { success: true };
    }
    
    return { success: false, message: error.message };
  };

  const deleteUser = async (userId) => {
    // Attempt deletion by username first if it looks like a university ID
    const { error } = await supabase.from('users').delete().or(`id.eq.${userId},username.eq.${userId}`);
    if (!error) {
      setUsers(prev => prev.filter(u => u.id !== userId));
      return { success: true };
    }
    return { success: false, message: error.message };
  };

  const updateUserRole = async (userId, newRole) => {
    const { error } = await supabase.from('users').update({ role: newRole }).or(`id.eq.${userId},username.eq.${userId}`);
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

    const { error } = await supabase.from('users').update(dbData).or(`id.eq.${userId},username.eq.${userId}`);
    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
      return { success: true };
    }
    return { success: false, message: error.message };
  };

  const updateUserProfile = async (updates) => {
    try {
      if (!user) return { success: false, message: 'No user logged in' };

      const { data, error } = await supabase
        .from('users')
        .update({
          name_ar: updates.name_ar,
          name_en: updates.name_en,
          phone: updates.phone,
          avatar_url: updates.avatar_url
        })
        .ilike('username', user.username)
        .select();

      if (error) throw error;

      if (data && data.length > 0) {
        const { password, ...safeData } = data[0];
        const updatedUser = { 
          ...user, 
          ...safeData,
          name: { ar: safeData.name_ar, en: safeData.name_en }
        };
        setUser(updatedUser);
        localStorage.setItem('site_user', JSON.stringify(updatedUser));
        return { success: true };
      }
      return { success: false, message: 'Failed to update' };
    } catch (error) {
      console.error('Update Profile Error:', error);
      return { success: false, message: error.message };
    }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      if (!user) return { success: false, message: 'لم يتم تسجيل الدخول' };
      
      // التحقق من كلمة المرور القديمة بشكل آمن عبر قاعدة البيانات
      const { data: userFound, error: authError } = await supabase
        .rpc('secure_login', { 
          p_username: user.username, 
          p_password: oldPassword 
        });

      if (authError || !userFound || userFound.length === 0) {
        return { success: false, message: 'كلمة المرور القديمة غير صحيحة' };
      }

      const { error } = await supabase
        .from('users')
        .update({ password: newPassword })
        .eq('id', user.id);

      if (error) throw error;

      return { success: true };
    } catch (error) {
      console.error('Change Password Error:', error);
      return { success: false, message: error.message };
    }
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
      updateUserProfile, changePassword, hasPermission, role: user?.role, isLoginOpen, toggleLogin,
      fetchAllUsers, fetchPendingUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
