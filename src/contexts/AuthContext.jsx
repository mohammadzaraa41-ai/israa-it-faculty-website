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
      console.log("Fetching profile for:", supabaseUser.id, supabaseUser.email);
      
      // 1. Try fetching by ID first (Most reliable)
      let { data: profile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', supabaseUser.id)
        .maybeSingle();

      // 2. If not found by ID, try by Username (Legacy fallback)
      if (!profile && !error) {
        const username = supabaseUser.email?.split('@')[0];
        if (username) {
          const { data: legacyProfile, error: legacyError } = await supabase
            .from('users')
            .select('*')
            .eq('username', username)
            .maybeSingle();
          profile = legacyProfile;
          error = legacyError;
        }
      }

      if (error) {
        console.error("Profile fetch error details:", error);
        return null;
      }

      if (profile) {
        console.log("Profile found:", profile.username, "Role:", profile.role);
        return {
          ...profile,
          name: { ar: profile.name_ar, en: profile.name_en },
          departmentId: profile.department_id,
          permissions: ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(profile.role)
            ? ['EDIT_ALL', 'MANAGE_USERS', 'VIEW_ANALYTICS', 'MANAGE_CONTENT', 'APPROVE_REQUESTS'] 
            : ['VIEW_PORTAL', 'ACCESS_RESOURCES']
        };
      } else {
        console.warn("No profile record found in 'users' table for this auth user.");
      }
    } catch (err) {
      console.error("Fetch profile exception:", err);
    }
    return null;
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

  const fetchAlumniRequests = async () => {
    const { data, error } = await supabase.from('alumni_requests').select('*').in('status', ['pending', 'rejected']);
    if (!error && data) {
      const mapped = data.map(a => ({ 
        ...a, 
        fullName: a.full_name, 
        universityId: a.university_id, 
        userId: a.user_id, 
        scheduleImage: a.schedule_image 
      }));
      setAlumniRequests(mapped);
      return mapped;
    }
    return [];
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
        const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            const profile = await fetchUserProfile(session.user);
            setUser(profile);
          } else {
            setUser(null);
          }
          setLoading(false);
        });

        // 3. Fetch initial data
        await Promise.all([
          fetchPendingUsers(),
          fetchAlumniRequests()
        ]);

        // 4. Setup Realtime Listeners for immediate updates
        const pendingSub = supabase
          .channel('public:pending_users')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'pending_users' }, payload => {
            console.log('Realtime Pending Users:', payload);
            fetchPendingUsers(); // Re-fetch for consistency
          })
          .subscribe();

        const alumniSub = supabase
          .channel('public:alumni_requests')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'alumni_requests' }, payload => {
            console.log('Realtime Alumni Requests:', payload);
            fetchAlumniRequests(); // Re-fetch for consistency
          })
          .subscribe();

        return () => {
          authSub.unsubscribe();
          supabase.removeChannel(pendingSub);
          supabase.removeChannel(alumniSub);
        };

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
      const cleanPassword = password.trim();
      
      // 1. Try normal Supabase Auth login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: cleanPassword,
      });

      if (error) {
        // 2. If Auth login fails, check if this is a legacy user (Migration path)
        if (error.message.includes('Invalid login credentials')) {
          const { data: legacyUser, error: legacyError } = await supabase
            .from('users')
            .select('*')
            .eq('username', username.trim())
            .maybeSingle();

          if (!legacyError && legacyUser && legacyUser.password === cleanPassword) {
            // Found a match in legacy table! Migrate them now
            console.log("Migrating legacy user:", username);
            
            // Use a temporary client for migration signup to avoid logging out the current user if any
            const { data: newData, error: signUpError } = await supabase.auth.signUp({
              email,
              password: cleanPassword,
            });

            if (!signUpError && newData.user) {
              // Successfully signed up, update their record in public.users to link them
              await supabase.from('users').update({ id: newData.user.id }).eq('username', username.trim());
              const profile = await fetchUserProfile(newData.user);
              setUser(profile);
              return { success: true, user: profile, message: 'تم تحديث حسابك بنجاح ونقله للنظام الجديد' };
            }
          }
        }

        let msg = 'خطأ في تسجيل الدخول';
        if (error.message.includes('Invalid login credentials')) msg = 'اسم المستخدم أو كلمة المرور غير صحيحة';
        return { success: false, message: msg };
      }

      const profile = await fetchUserProfile(data.user);
      setUser(profile);
      return { success: true, user: profile, message: 'تم تسجيل الدخول بنجاح' };
    } catch (err) {
      console.error("Login catch:", err);
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
      
      // IMPORTANT: To prevent logging out the Admin when they create a user,
      // we need to use a secondary Supabase client with 'persistSession: false'
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
      
      const tempClient = createClient(supabaseUrl, supabaseAnonKey, {
        auth: { persistSession: false }
      });

      // 1. Create Auth User using the temporary client
      const { data: authData, error: authError } = await tempClient.auth.signUp({
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
      console.error("Direct Registration Error:", err);
      return { success: false, message: err.message || "حدث خطأ أثناء إنشاء الحساب" };
    }
  };

  const approveUser = async (pendingId) => {
    try {
      const userToApprove = pendingUsers.find(u => u.id === pendingId);
      if (!userToApprove) return { success: false, message: "لم يتم العثور على بيانات الطلب" };

      console.log("Approving user:", userToApprove.universityId);

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
        return { success: true };
      }
      return result;
    } catch (err) {
      console.error("Approve error:", err);
      return { success: false, message: err.message };
    }
  };

  const registerRequest = async (userData) => {
    try {
      // 1. Check if user already exists in users table (Using list check for 406 safety)
      const { data: usersFound } = await supabase
        .from('users')
        .select('username')
        .eq('username', userData.universityId)
        .limit(1);

      if (usersFound && usersFound.length > 0) {
        return { success: false, message: 'هذا الرقم الجامعي مسجل بالفعل في النظام' };
      }

      // 2. Check if there's already a pending request
      const { data: requestsFound } = await supabase
        .from('pending_users')
        .select('university_id')
        .eq('university_id', userData.universityId)
        .limit(1);

      if (requestsFound && requestsFound.length > 0) {
        return { success: false, message: 'لديك طلب تسجيل معلق بالفعل، يرجى انتظار موافقة الأدمن' };
      }

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
    } catch (err) {
      return { success: false, message: 'حدث خطأ أثناء إرسال الطلب' };
    }
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

  const hasPermission = (permission) => {
    if (!user?.role) return false;
    const adminRoles = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'];
    return adminRoles.includes(user.role) || (user.permissions && user.permissions.includes(permission));
  };

  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const toggleLogin = (val) => setIsLoginOpen(val !== undefined ? val : !isLoginOpen);

  return (
    <AuthContext.Provider value={{ 
      user, users, pendingUsers, alumniRequests, loading,
      login, logout, registerRequest, approveUser, rejectUser,
      submitAlumniRequest, approveAlumniRequest, rejectAlumniRequest,
      registerUserDirectly, deleteUser, updateUserRole, updateUser,
      updateUserProfile, changePassword, hasPermission, role: user?.role, isLoginOpen, toggleLogin,
      fetchAllUsers, fetchPendingUsers, fetchAlumniRequests
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
