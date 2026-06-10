import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB_SCHEMA } from '../data/db_schema';
import { supabase, supabaseAdmin } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [alumniRequests, setAlumniRequests] = useState([]);
  const [lastError, setLastError] = useState(null);

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
          departmentId: profile.department_id || profile.departmentId || 'cs',
          phone: profile.phone || profile.phone_number || '---',
          permissions: ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(profile.role)
            ? ['EDIT_ALL', 'MANAGE_USERS', 'VIEW_ANALYTICS', 'MANAGE_CONTENT', 'APPROVE_REQUESTS']
            : ['VIEW_PORTAL', 'ACCESS_RESOURCES'],
          isAdminRole: ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(profile.role),
          isStudent: profile.role === 'STUDENT'
        };
      } else {
        console.warn("No profile record found in 'users' table for this Auth user.");
        return null;
      }
    } catch (err) {
      console.error("Critical Profile Fetch Error:", err);
      return null;
    }
  };

  const fetchPendingUsers = async () => {
    const client = supabaseAdmin || supabase;
    const { data, error } = await client.from('pending_users').select('*').in('status', ['pending', 'PENDING']);
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
    const client = supabaseAdmin || supabase;
    const { data, error } = await client.from('alumni_requests').select('*').in('status', ['pending', 'rejected']);
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

  const fetchAllUsers = async () => {
    const CACHE_KEY = 'cached_users_v2';

    const mapUser = (u) => {
      const { password, ...rest } = u;
      return {
        ...rest,
        name: { 
          ar: u.name_ar || u.full_name || u.username, 
          en: u.name_en || u.name_ar || u.full_name || u.username 
        },
        name_ar: u.name_ar || u.full_name,
        full_name: u.full_name || u.name_ar,
        universityId: u.university_id || u.username,
        university_id: u.university_id || u.username,
        departmentId: u.department_id,
        department_id: u.department_id,
        phone: u.phone || u.phone_number,
        phone_number: u.phone_number || u.phone,
        year_sem: u.year_sem || u.yearSem,
        yearSem: u.yearSem || u.year_sem,
      };
    };

    // Always use admin client if available (bypasses RLS), else use anon client
    const client = supabaseAdmin || supabase;
    
    const { data, error } = await client.from('users').select('*').limit(10000);
    if (error) {
      console.error('fetchAllUsers error:', error.message);
      // Fallback to cache
      try {
        const raw = localStorage.getItem(CACHE_KEY);
        if (raw) {
          const { data: cData } = JSON.parse(raw);
          if (Array.isArray(cData) && cData.length > 0) {
            setUsers(cData);
            return cData;
          }
        }
      } catch {}
      return [];
    }

    if (data && data.length > 0) {
      const mapped = data.map(mapUser);
      setUsers(mapped);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify({ data: mapped, ts: Date.now() })); } catch {}
      return mapped;
    }

    return [];
  };


  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
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
        if (error.message.includes('Invalid login credentials')) msg = 'اسم المستخدم أو كلمة مور غير صحيحة';
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

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // 1. Get initial session
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const profile = await fetchUserProfile(session.user);
          if (profile) {
            setUser(profile);
            // If admin, fetch all users automatically
            if (['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(profile.role)) {
              fetchAllUsers();
            }
          } else {
            // Profile deleted or missing -> Kill session
            await supabase.auth.signOut();
            setUser(null);
          }
        }

        // 2. Listen for auth changes
        const { data: { subscription: authSub } } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (session?.user) {
            const profile = await fetchUserProfile(session.user);
            if (profile) {
              setUser(profile);
              // If admin, fetch all users automatically
              if (['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(profile.role)) {
                fetchAllUsers();
              }
            } else {
              await supabase.auth.signOut();
              setUser(null);
            }
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

        const usersSub = supabase
          .channel('public:users')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'users' }, payload => {
            console.log('Realtime Users Update:', payload);
            if (['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role)) {
              fetchAllUsers();
            }
          })
          .subscribe();

        return () => {
          authSub.unsubscribe();
          supabase.removeChannel(pendingSub);
          supabase.removeChannel(alumniSub);
          supabase.removeChannel(usersSub);
        };

      } catch (err) {
        console.error("Auth Init Error:", err);
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  // Kill Switch: Kick user out if their profile is deleted in real-time
  useEffect(() => {
    if (!user?.id) return;

    const killSwitch = supabase
      .channel(`kill-switch-${user.id}`)
      .on('postgres_changes', {
        event: 'DELETE',
        schema: 'public',
        table: 'users',
        filter: `id=eq.${user.id}`
      }, () => {
        console.warn("Account deleted by admin. Logging out...");
        logout();
        window.location.href = '/';
      })
      .subscribe();

    return () => {
      supabase.removeChannel(killSwitch);
    };
  }, [user?.id, logout]);



  const robustProfileInsert = async (profileData) => {
    let currentData = { ...profileData };
    let attempt = 0;
    const maxAttempts = 5;

    while (attempt < maxAttempts) {
      // Use admin client to bypass RLS during profile creation (if available)
      const client = supabaseAdmin || supabase;
      const { data, error } = await client.from('users').insert([currentData]).select();

      if (!error) return { data, error: null };

      // If the error is about a missing column (42703 / PGRST204), remove it and try again
      if (error.code === '42703' || error.code === 'PGRST204' || error.message.includes('column')) {
        // Find all single/double quoted substrings in the error message
        const matches = [...error.message.matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
        const missingColumn = matches.find(col => currentData[col] !== undefined);

        if (missingColumn) {
          console.warn(`[Auth] Detected missing column '${missingColumn}'. Removing and retrying (Attempt ${attempt + 1})...`);
          delete currentData[missingColumn];
          attempt++;
          continue;
        }
      }

      // Other error or couldn't identify column
      return { data: null, error };
    }
    return { data: null, error: { message: "Maximum retry attempts reached" } };
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
      let { data: authData, error: authError } = await tempClient.auth.signUp({
        email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name?.ar || userData.nameAr,
            role: userData.role
          }
        }
      });

      // Workaround: If user already exists in Auth but profile is missing, try to sign in to get the ID
      if (authError && authError.message.includes('already registered')) {
        console.log("User already in Auth, attempting to retrieve ID via sign-in...");
        const { data: signInData, error: signInError } = await tempClient.auth.signInWithPassword({
          email,
          password: userData.password,
        });

        if (!signInError) {
          authData = signInData;
          authError = null;
        }
      }

      if (authError) throw authError;

      // 2. Create Profile in public.users using robust strategy
      const profileData = {
        id: authData.user.id,
        username: userData.username,
        university_id: userData.username,
        universityId: userData.username,
        full_name: userData.nameAr,
        fullName: userData.nameAr,
        name_ar: userData.name?.ar || userData.nameAr || "مستخدم جديد",
        name_en: userData.name?.en || userData.nameEn || "",
        role: userData.role || 'STUDENT',
        department_id: userData.departmentId || 'cs',
        departmentId: userData.departmentId || 'cs',
        phone: userData.phone,
        phone_number: userData.phone,
        dob: userData.dob,
        major: userData.major,
        year_sem: userData.yearSem,
        yearSem: userData.yearSem,
        hours: userData.hours,
        avatar_url: userData.avatarUrl || null
      };

      const { error: profileError } = await robustProfileInsert(profileData);

      if (profileError) {
        console.error("Critical: Profile creation failed after robust attempts:", profileError);
        return { success: false, message: `فشل إنشاء ملف المستخدم: ${profileError.message}` };
      }

      localStorage.removeItem('cached_users_v2');
      await fetchAllUsers();
      return { success: true, user: authData.user };
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

      const rawMajor = (userToApprove.major || '').toLowerCase();
      let validDeptId = 'cs'; // Default fallback
      const validIds = ['cis', 'cs', 'cyber', 'mm', 'ns', 'dsai', 'se'];
      
      if (validIds.includes(rawMajor)) {
        validDeptId = rawMajor;
      } else if (rawMajor.includes('وسائط') || rawMajor.includes('multimedia')) {
        validDeptId = 'mm';
      } else if (rawMajor.includes('نظم') || rawMajor.includes('cis')) {
        validDeptId = 'cis';
      } else if (rawMajor.includes('هندسة') || rawMajor.includes('software')) {
        validDeptId = 'se';
      } else if (rawMajor.includes('أمن') || rawMajor.includes('سيبراني')) {
        validDeptId = 'cyber';
      } else if (rawMajor.includes('بيانات') || rawMajor.includes('data')) {
        validDeptId = 'dsai';
      } else if (rawMajor.includes('شبكات') || rawMajor.includes('network')) {
        validDeptId = 'ns';
      }

      const result = await registerUserDirectly({
        username: userToApprove.universityId || userToApprove.university_id,
        password: userToApprove.password,
        role: 'STUDENT',
        nameAr: userToApprove.fullName || userToApprove.full_name,
        nameEn: userToApprove.name_en || userToApprove.nameEn || '',
        departmentId: validDeptId,
        phone: userToApprove.phone,
        dob: userToApprove.dob,
        major: validDeptId,
        yearSem: userToApprove.yearSem || userToApprove.year_sem,
        hours: userToApprove.hours,
        avatarUrl: userToApprove.avatar_url || null
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

      // Upload avatar if provided
      let avatarUrl = null;
      if (userData.avatarFile) {
        const file = userData.avatarFile;
        const ext = file.name.split('.').pop();
        const path = `avatars/${userData.universityId}-${Date.now()}.${ext}`;
        const { error: uploadErr } = await supabase.storage.from('faculty_uploads').upload(path, file);
        if (!uploadErr) {
          const { data: { publicUrl } } = supabase.storage.from('faculty_uploads').getPublicUrl(path);
          avatarUrl = publicUrl;
        }
      }

      const newUserRequest = {
        full_name: userData.fullName,
        name_en: userData.nameEn || null,
        phone: userData.phone,
        university_id: userData.universityId,
        dob: userData.dob,
        major: userData.major,
        year_sem: userData.yearSem,
        hours: userData.hours,
        password: userData.password,
        avatar_url: avatarUrl,
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
      // 1. Get the absolute definitive UID from the current session
      const { data: sessionData } = await supabase.auth.getSession();
      const authUid = sessionData?.session?.user?.id;
      
      if (!authUid) {
        return { success: false, message: 'يجب تسجيل الدخول أولاً' };
      }

      console.log("[AlumniRequest] Using Auth UID:", authUid);
      
      let imageUrl = data.scheduleImage;
      if (data.imageFile) {
        const file = data.imageFile;
        const fileExt = file.name.split('.').pop();
        const fileName = `${authUid}-${Date.now()}.${fileExt}`;
        const filePath = `alumni_schedules/${fileName}`;
        
        const { error: uploadError } = await supabase.storage.from('faculty_uploads').upload(filePath, file);
        if (!uploadError) {
          const { data: { publicUrl } } = supabase.storage.from('faculty_uploads').getPublicUrl(filePath);
          imageUrl = publicUrl;
        }
      }

      if (imageUrl && imageUrl.startsWith('blob:')) imageUrl = null;

      const request = { 
        user_id: authUid, 
        full_name: data.fullName || user?.name?.ar || user?.fullName || user?.full_name || 'Student', 
        university_id: data.universityId || user?.universityId || user?.university_id || user?.username || '000000', 
        hours: parseInt(data.hours) || 0, 
        schedule_image: imageUrl, 
        status: 'pending' 
      };

      console.log("[AlumniRequest] Final Object:", request);

      const client = supabaseAdmin || supabase;
      if (!supabaseAdmin) console.warn("[AlumniRequest] Running without Admin Key - RLS active");

      // Stage 1: Full Insert
      const { data: insertedData, error } = await client.from('alumni_requests').insert([request]).select();
      
      if (!error && insertedData) {
        setAlumniRequests(prev => [...prev, { ...data, id: insertedData[0].id, userId: authUid, scheduleImage: imageUrl, status: 'pending' }]);
        return { success: true };
      }

      if (error && (error.code === '42501' || error.message?.includes('RLS'))) {
        console.warn("[AlumniRequest] RLS Violation. Attempting Stage 2: Minimal Insert...");
        
        // Stage 2: Bare Minimum (User ID and Hours only)
        // This helps identify if the policy restricts specific columns
        const minimalRequest = {
          user_id: authUid,
          hours: parseInt(data.hours) || 0,
          status: 'pending'
        };
        
        const { data: retryData, error: retryError } = await client.from('alumni_requests').insert([minimalRequest]).select();
        
        if (!retryError && retryData) {
          console.log("[AlumniRequest] Stage 2 Success. Updating with remaining data...");
          // If minimal insert worked, try to update the rest (though this might also fail if update policy is same)
          await client.from('alumni_requests').update({
            full_name: request.full_name,
            university_id: request.university_id,
            schedule_image: request.schedule_image
          }).eq('id', retryData[0].id);
          
          setAlumniRequests(prev => [...prev, { ...data, id: retryData[0].id, userId: authUid, scheduleImage: imageUrl, status: 'pending' }]);
          return { success: true };
        }
        
        console.error("[AlumniRequest] Stage 2 Failed:", retryError);
        return { success: false, message: "فشل الإرسال: سياسة الحماية تمنع الإضافة. يرجى التأكد من صلاحيات الجدول." };
      }

      return { success: false, message: error?.message || 'فشل إرسال الطلب' };
    } catch (err) { 
      return { success: false, message: err.message }; 
    }
  };

  const approveAlumniRequest = async (requestId) => {
    const req = alumniRequests.find(r => r.id === requestId);
    if (!req) return { success: false, message: 'الطلب غير موجود' };
    
    const client = supabaseAdmin || supabase;
    
    // 1. Mark user as alumni
    const { error: userErr } = await client.from('users').update({ is_alumni: true }).eq('id', req.userId);
    if (userErr) {
      console.error('[ApproveAlumni] Failed to update user:', userErr);
      return { success: false, message: userErr.message };
    }
    
    // 2. Delete the request
    await client.from('alumni_requests').delete().eq('id', requestId);
    
    // 3. Update local state
    setUsers(prev => prev.map(u => u.id === req.userId ? { ...u, is_alumni: true } : u));
    setAlumniRequests(prev => prev.filter(r => r.id !== requestId));
    if (user?.id === req.userId) setUser({ ...user, is_alumni: true });
    return { success: true };
  };

  const rejectAlumniRequest = async (requestId) => {
    const client = supabaseAdmin || supabase;
    const { error } = await client.from('alumni_requests').delete().eq('id', requestId);
    if (!error) {
      setAlumniRequests(prev => prev.filter(r => r.id !== requestId));
      return { success: true };
    }
    console.error('[RejectAlumni] Failed:', error);
    return { success: false, message: error.message };
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
    try {
      // Strategy 1: Use admin client to delete from auth (cascades to public.users)
      if (supabaseAdmin) {
        const { error } = await supabaseAdmin.auth.admin.deleteUser(userId);
        if (error) {
          console.warn("Admin auth delete failed:", error.message);
        } else {
          console.log("Deleted from Auth successfully.");
        }
      }

      // Strategy 2: Always delete from public.users directly (handles ghost accounts too)
      const client = supabaseAdmin || supabase;
      const { error: tableError } = await client.from('users').delete().eq('id', userId);
      if (tableError) {
        console.error("Table delete error:", tableError.message);
        // Fallback: If it's a foreign key constraint, we might need to delete related posts/comments first.
        // We will attempt to delete them if there's an FK error
        if (tableError.message.includes('foreign key constraint')) {
          await client.from('comments').delete().eq('username', (users.find(u => u.id === userId)?.username));
          await client.from('posts').delete().eq('author_username', (users.find(u => u.id === userId)?.username));
          await client.from('posts').delete().eq('author_id', userId);
          // Try again
          const { error: retryError } = await client.from('users').delete().eq('id', userId);
          if (retryError) throw new Error(retryError.message);
        } else {
          throw new Error(tableError.message);
        }
      }

      setUsers(prev => prev.filter(u => u.id !== userId));
      return { success: true };
    } catch (err) {
      console.error("Delete user error:", err);
      return { success: false, message: err.message || "حدث خطأ أثناء الحذف" };
    }
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

      const dbData = {
        name_ar: updates.name_ar,
        name_en: updates.name_en,
        phone: updates.phone,
        phone_number: updates.phone,
        avatar_url: updates.avatar_url
      };

      // Remove undefined values
      Object.keys(dbData).forEach(k => dbData[k] === undefined && delete dbData[k]);

      let currentData = { ...dbData };
      let attempt = 0;
      let succeeded = false;

      while (attempt < 5) {
        const { error } = await supabase.from('users').update(currentData).eq('id', user.id);

        if (!error) {
          succeeded = true;
          break;
        }

        if (error.code === '42703' || error.code === 'PGRST204' || error.message.includes('column')) {
          const matches = [...error.message.matchAll(/['"]([^'"]+)['"]/g)].map(m => m[1]);
          const missingColumn = matches.find(col => currentData[col] !== undefined);
          if (missingColumn) {
            console.warn(`[Profile] Removing missing column '${missingColumn}' and retrying...`);
            delete currentData[missingColumn];
            attempt++;
            continue;
          }
        }
        throw error;
      }

      if (succeeded) {
        // Update local state directly from form data (don't wait for DB response)
        const updatedUser = {
          ...user,
          ...currentData,
          name: {
            ar: currentData.name_ar || (typeof user.name === 'object' ? user.name.ar : user.name),
            en: currentData.name_en || (typeof user.name === 'object' ? user.name.en : user.name)
          }
        };
        setUser(updatedUser);

        // Update posts and comments with new avatar and name
        try {
          const client = supabaseAdmin || supabase;
          const nameToUpdate = currentData.name_ar || (typeof user.name === 'object' ? user.name.ar : user.name);
          
          await client.from('posts')
            .update({ 
              author_avatar_url: currentData.avatar_url || user.avatar_url,
              author_name: nameToUpdate
            })
            .eq('author_username', user.username);

          await client.from('comments')
            .update({ 
              author_avatar_url: currentData.avatar_url || user.avatar_url,
              author_name: nameToUpdate
            })
            .eq('author_username', user.username);
            
        } catch (e) {
          console.error("Failed to update avatar in posts/comments:", e);
        }

        return { success: true };
      }
      return { success: false, message: 'فشل التحديث' };
    } catch (error) {
      console.error("Profile Update Error:", error);
      return { success: false, message: error.message };
    }
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
      fetchAllUsers, fetchPendingUsers, fetchAlumniRequests, lastError
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
