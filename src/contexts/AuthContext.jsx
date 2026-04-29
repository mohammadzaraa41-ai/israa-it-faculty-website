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

  const refreshData = async () => {
    try {
      console.log("--- RefreshData Started ---");
      const [
        { data: usersData, error: usersErr },
        { data: pendingData },
        { data: alumniData }
      ] = await Promise.all([
        supabase.from('users').select('*'),
        supabase.from('pending_users').select('*').eq('status', 'pending'),
        supabase.from('alumni_requests').select('*') // Fetch both pending and approved for sync safety
      ]);

      if (usersErr) console.error("Users Fetch Error:", usersErr);

      if (usersData) {
        console.log("Users fetched count:", usersData.length);
        const mappedUsers = usersData.map(u => ({
          ...u,
          isAlumni: u.is_alumni === true || u.is_alumni === 'true',
          name: { ar: u.name_ar, en: u.name_en }
        }));
        setUsers(mappedUsers);
      }

      // Targeted update for current user (always runs if user logged in)
      if (user) {
        let currentUserRecord = null;
        
        // Try to find in already fetched data first if available
        if (usersData) {
           currentUserRecord = usersData.find(u => String(u.id) === String(user.id));
           if (currentUserRecord) {
              currentUserRecord = {
                ...currentUserRecord,
                isAlumni: currentUserRecord.is_alumni === true || currentUserRecord.is_alumni === 'true',
                name: { ar: currentUserRecord.name_ar, en: currentUserRecord.name_en }
              };
           }
        }

        // If not found or usersData was null, fetch specifically
        if (!currentUserRecord && user) {
          console.log("CRITICAL SYNC: Fetching data for UN:", user.username);
          const { data: specificUser, error: specErr } = await supabase
            .from('users')
            .select('*')
            .ilike('username', user.username)
            .maybeSingle();
            
          if (specErr) console.error("Targeted Fetch Error:", specErr);
          if (specificUser) {
            console.log("CRITICAL SYNC SUCCESS: Found DB record for", user.username);
            currentUserRecord = {
              ...specificUser,
              isAlumni: specificUser.is_alumni === true || specificUser.is_alumni === 'true',
              name: { ar: specificUser.name_ar, en: specificUser.name_en }
            };
          }
        }

        if (currentUserRecord && user) {
          const needsSync = 
            String(currentUserRecord.id) !== String(user.id) || 
            currentUserRecord.isAlumni !== user.isAlumni || 
            currentUserRecord.role !== user.role;

          if (needsSync) {
            console.log("FORCING LOCAL SESSION UPDATE...");
            const updatedUser = { 
              ...user, 
              ...currentUserRecord,
              id: currentUserRecord.id // Ensure ID is updated (migration fix)
            };
            setUser(updatedUser);
            localStorage.setItem('site_user', JSON.stringify(updatedUser));
            console.log("SESSION SYNCED: User ID is now", updatedUser.id, "Alumni:", updatedUser.isAlumni);
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
      console.log("--- RefreshData Complete ---");
    } catch (err) {
      console.error("Supabase fetch error:", err);
    }
  };

  // --- FETCH USERS FROM SUPABASE & SETUP REALTIME ---
  useEffect(() => {
    refreshData().then(() => setLoading(false));

    // Safety fallback: ensure loading is false after 5 seconds no matter what
    const timer = setTimeout(() => {
      setLoading(false);
    }, 5000);

    // Removed real-time subscription to prevent crash loops
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
        isAlumni: data.is_alumni,
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
      await refreshData();
      return { success: true };
    }
    console.error("Submit Alumni Request Error:", error);
    return { success: false, message: error.message };
  };

  const approveAlumniRequest = async (requestId) => {
    const req = alumniRequests.find(r => String(r.id) === String(requestId));
    if (req) {
      // 1. Update user to is_alumni = true
      const { error: userErr } = await supabase
        .from('users')
        .update({ is_alumni: true })
        .eq('id', req.userId);
      
      if (userErr) return false;

      // 2. Mark request as approved instead of deleting immediately to help UI sync
      const { error: reqErr } = await supabase
        .from('alumni_requests')
        .update({ status: 'approved' })
        .eq('id', requestId);
      
      if (!reqErr) {
        await refreshData();
        return true;
      }
    }
    return false;
  };

  const uploadFile = async (file, bucket = 'alumni-assets') => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data, error: uploadError } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (uploadError) {
        console.warn(`Storage Upload Error (bucket: ${bucket}):`, uploadError);
        // FALLBACK: Return a dummy URL so the request doesn't get blocked entirely
        return { success: true, url: 'https://via.placeholder.com/150?text=Schedule+Image+Not+Uploaded' };
      }

      const { data: { publicUrl } } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { success: true, url: publicUrl };
    } catch (error) {
      console.error("Storage Upload Exception:", error);
      return { success: true, url: 'https://via.placeholder.com/150?text=Schedule+Image+Error' };
    }
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
      const studentId = String(userToApprove.universityId);
      const activeUser = {
        id: studentId,
        username: studentId,
        password: userToApprove.password,
        role: 'STUDENT',
        name_ar: userToApprove.fullName,
        department_id: (['cs', 'se', 'cyber', 'dsai'].includes(userToApprove.major)) ? userToApprove.major : 'cs',
        is_alumni: false
      };

      console.log("Attempting to insert user with University ID:", studentId);
      
      // 1. Insert into users table
      const { data: insertedData, error: insertErr } = await supabase.from('users').insert([activeUser]).select();
      if (insertErr) {
        console.error("Approve User Insert Error:", insertErr);
        return false;
      }

      // 2. Delete from pending_users
      await supabase.from('pending_users').delete().eq('id', pendingId);
      
      // Refresh all data to ensure UI sync
      await refreshData();
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
    try {
      // Use university ID (student number) as the primary ID for the user
      const studentId = String(userData.username);
      
      const { data, error } = await supabase.from('users').insert([{
        id: studentId,
        username: studentId,
        password: userData.password,
        name_ar: userData.fullNameAr,
        name_en: userData.fullNameEn,
        role: userData.role || 'STUDENT',
        is_alumni: userData.isAlumni || false,
        permissions: userData.role === 'SUPER_ADMIN' ? ['all'] : []
      }]).select().single();

      if (error) throw error;
      
      await refreshData();
      return { success: true, data };
    } catch (err) {
      console.error("Direct registration error:", err);
      return { success: false, message: err.message };
    }
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
      user, login, logout, registerRequest, 
      users, setUsers, pendingUsers, alumniRequests, 
      approveAlumniRequest, rejectAlumniRequest,
      approveUser, rejectUser, registerUserDirectly,
      deleteUser, updateUserRole, updateUser,
      submitAlumniRequest,
      uploadFile,
      refreshData,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
