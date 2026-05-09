import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB_SCHEMA } from '../data/db_schema';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [alumniRequests, setAlumniRequests] = useState([]);

  // Fetch full user profile from the public.users table
  const fetchUserProfile = async (supabaseUser) => {
    if (!supabaseUser) return null;
    
    try {
      // Try fetching by id (preferred) or email/username
      const { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .or(`id.eq.${supabaseUser.id},username.eq.${supabaseUser.email.split('@')[0]}`)
        .single();

      if (error) {
        console.error("Profile fetch error:", error);
        return null;
      }

      if (profile) {
        return {
          ...profile,
          name: { ar: profile.name_ar, en: profile.name_en },
          departmentId: profile.department_id,
          permissions: ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(profile.role)
            ? ['EDIT_ALL', 'MANAGE_USERS', 'VIEW_ANALYTICS'] 
            : ['VIEW_PORTAL', 'ACCESS_RESOURCES']
        };
      }
    } catch (err) {
      console.error("Fetch profile catch:", err);
    }
    return null;
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 1. Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await fetchUserProfile(session.user);
          setUser(profile);
        }

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            const profile = await fetchUserProfile(session.user);
            setUser(profile);
          } else {
            setUser(null);
          }
          setLoading(false);
        });

        // 3. Fetch other shared data
        const [
          { data: pendingData },
          { data: alumniData }
        ] = await Promise.all([
          supabase.from('pending_users').select('*').in('status', ['pending', 'PENDING']),
          supabase.from('alumni_requests').select('*').in('status', ['pending', 'rejected'])
        ]);

        if (pendingData) setPendingUsers(pendingData.map(p => ({ ...p, fullName: p.full_name, universityId: p.university_id, yearSem: p.year_sem })));
        if (alumniData) setAlumniRequests(alumniData.map(a => ({ ...a, fullName: a.full_name, universityId: a.university_id, userId: a.user_id, scheduleImage: a.schedule_image })));

      } catch (err) {
        console.error("Auth Init Error:", err);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
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

  const login = async (username, password) => {
    try {
      const email = `${username.trim()}@israa.local`;
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password.trim(),
      });

      if (error) {
        let msg = 'خطأ في تسجيل الدخول';
        if (error.message.includes('Invalid login credentials')) msg = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        return { success: false, message: msg };
      }

      const profile = await fetchUserProfile(data.user);
      setUser(profile);
      return { success: true, user: profile };
    } catch (err) {
      return { success: false, message: 'حدث خطأ تقني' };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const registerUserDirectly = async (userData) => {
    try {
      const email = `${userData.username.trim()}@israa.local`;
      
      // 1. Create Auth User
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name?.ar || userData.nameAr,
            role: userData.role
          }
        }
      });

      if (authError) throw authError;

      // 2. Create Profile in public.users
      const profileData = {
        id: authData.user.id, // Link to auth user
        username: userData.username,
        name_ar: userData.name?.ar || userData.nameAr,
        name_en: userData.name?.en || userData.nameEn,
        role: userData.role,
        department_id: userData.departmentId,
        phone: userData.phone,
        dob: userData.dob,
        major: userData.major,
        year_sem: userData.yearSem,
        hours: userData.hours
      };

      const { error: profileError } = await supabase.from('users').insert([profileData]);
      if (profileError) {
        // Fallback or retry logic if needed
        console.error("Profile creation error:", profileError);
      }

      await fetchAllUsers();
      return { success: true };
    } catch (err) {
      return { success: false, message: err.message };
    }
  };

  const approveUser = async (pendingId) => {
    const userToApprove = pendingUsers.find(u => u.id === pendingId);
    if (!userToApprove) return false;

    const result = await registerUserDirectly({
      username: userToApprove.universityId,
      password: userToApprove.password,
      role: 'STUDENT',
      nameAr: userToApprove.fullName,
      departmentId: (['cs', 'se', 'cyber', 'dsai'].includes(userToApprove.major)) ? userToApprove.major : 'cs',
      phone: userToApprove.phone,
      dob: userToApprove.dob,
      major: userToApprove.major,
      yearSem: userToApprove.year_sem,
      hours: userToApprove.hours
    });

    if (result.success) {
      await supabase.from('pending_users').delete().eq('id', pendingId);
      setPendingUsers(prev => prev.filter(u => u.id !== pendingId));
      return true;
    }
    return false;
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
      setPendingUsers(prev => [...prev, { ...data[0], fullName: data[0].full_name, universityId: data[0].university_id, yearSem: data[0].year_sem }]);
      return { success: true };
    }
    return { success: false, message: error?.message || 'Unknown error' };
  };

  const submitAlumniRequest = async (userId, data) => {
    try {
      let imageUrl = data.scheduleImage;
      if (data.imageFile) {
        const file = data.imageFile;
        const fileExt = file.name.split('.').pop();
        const fileName = `${userId}-${Date.now()}.${fileExt}`;
        const filePath = `alumni_schedules/${fileName}`;
        const { error: uploadError } = await supabase.storage.from('faculty_uploads').upload(filePath, file);
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('faculty_uploads').getPublicUrl(filePath);
          imageUrl = publicUrl;
        }
      }
      const request = { user_id: userId, full_name: data.fullName, university_id: data.universityId, hours: data.hours, schedule_image: imageUrl, status: 'pending' };
      const { data: insertedData, error } = await supabase.from('alumni_requests').insert([request]).select();
      if (!error && insertedData) {
        setAlumniRequests(prev => [...prev, { ...data, id: insertedData[0].id, userId, scheduleImage: imageUrl, status: 'pending' }]);
        return { success: true };
      }
      return { success: false, message: error?.message };
    } catch (err) { return { success: false, message: err.message }; }
  };

  const approveAlumniRequest = async (requestId) => {
    const req = alumniRequests.find(r => r.id === requestId);
    if (req) {
      const { error: userErr } = await supabase.from('users').update({ is_alumni: true }).eq('id', req.userId);
      if (userErr) return false;
      await supabase.from('alumni_requests').delete().eq('id', requestId);
      setUsers(prev => prev.map(u => u.id === req.userId ? { ...u, is_alumni: true } : u));
      setAlumniRequests(prev => prev.filter(r => r.id !== requestId));
      if (user?.id === req.userId) setUser({ ...user, is_alumni: true });
      return true;
    }
    return false;
  };

  const rejectAlumniRequest = async (requestId) => {
    const { error } = await supabase.from('alumni_requests').update({ status: 'rejected' }).eq('id', requestId);
    if (!error) {
      setAlumniRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: 'rejected' } : r));
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
      name_ar: updatedData.name?.ar,
      name_en: updatedData.name?.en,
      department_id: updatedData.departmentId
    };
    const { error } = await supabase.from('users').update(dbData).eq('id', userId);
    if (!error) {
      setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
      return { success: true };
    }
    return { success: false, message: error.message };
  };

  const updateUserProfile = async (updates) => {
    try {
      if (!user) return { success: false, message: 'No user logged in' };
      const { data, error } = await supabase.from('users').update({
        name_ar: updates.name_ar,
        name_en: updates.name_en,
        phone: updates.phone,
        avatar_url: updates.avatar_url
      }).eq('id', user.id).select();

      if (error) throw error;
      if (data?.length > 0) {
        const updatedUser = { ...user, ...data[0], name: { ar: data[0].name_ar, en: data[0].name_en } };
        setUser(updatedUser);
        return { success: true };
      }
    } catch (error) { return { success: false, message: error.message }; }
  };

  const changePassword = async (oldPassword, newPassword) => {
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      return { success: true };
    } catch (error) { return { success: false, message: error.message }; }
  };

  const hasPermission = (permission) => user?.permissions?.includes(permission) || user?.role === 'SUPER_ADMIN';

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const toggleLogin = (val) => setIsLoginOpen(val !== undefined ? val : !isLoginOpen);

  return (
    <AuthContext.Provider value={{ 
      user, users, pendingUsers, alumniRequests, loading,
      login, logout, registerRequest, approveUser, rejectUser,
      submitAlumniRequest, approveAlumniRequest, rejectAlumniRequest,
      registerUserDirectly, deleteUser, updateUserRole, updateUser,
      updateUserProfile, changePassword, hasPermission, role: user?.role, isLoginOpen, toggleLogin,
      fetchAllUsers
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
