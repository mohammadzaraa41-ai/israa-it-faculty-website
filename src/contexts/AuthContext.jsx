import React, { createContext, useContext, useState, useEffect } from 'react';
import { DB_SCHEMA } from '../data/db_schema';
import { supabase } from '../lib/supabase';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('site_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [pendingUsers, setPendingUsers] = useState([]);
  const [alumniRequests, setAlumniRequests] = useState([]);

  // --- FETCH USERS FROM SUPABASE ---
  useEffect(() => {
    const fetchAuthData = async () => {
      const { data: usersData } = await supabase.from('users').select('*');
      if (usersData) {
        setUsers(usersData.map(u => ({
          ...u,
          name: { ar: u.name_ar, en: u.name_en }
        })));
      }
      setLoading(false);
    };
    fetchAuthData();
  }, []);

  useEffect(() => {
    localStorage.setItem('site_users', JSON.stringify(users));
    localStorage.setItem('site_pending_users', JSON.stringify(pendingUsers));
    localStorage.setItem('site_alumni_requests', JSON.stringify(alumniRequests));
  }, [users, pendingUsers, alumniRequests]);

  const login = (username, password) => {
    const foundUser = users.find(u => u.username === username && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('site_user', JSON.stringify(foundUser));
      return { success: true, user: foundUser };
    }
    return { success: false, message: 'اسم المستخدم أو كلمة المرور غير صحيحة' };
  };

  const registerRequest = (userData) => {
    const newUserRequest = {
      ...userData,
      id: 'p' + Date.now(),
      requestDate: new Date().toISOString(),
      status: 'pending'
    };
    setPendingUsers(prev => [...prev, newUserRequest]);
    return { success: true };
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

  const approveUser = (pendingId) => {
    const userToApprove = pendingUsers.find(u => u.id === pendingId);
    if (userToApprove) {
      const activeUser = {
        ...userToApprove,
        id: 'u' + Date.now(),
        role: 'STUDENT',
        status: 'active',
        username: userToApprove.universityId, // The ID becomes the username as requested
        permissions: ['VIEW_PORTAL', 'ACCESS_RESOURCES']
      };
      setUsers(prev => [...prev, activeUser]);
      setPendingUsers(prev => prev.filter(u => u.id !== pendingId));
      return true;
    }
    return false;
  };

  const rejectUser = (pendingId) => {
    setPendingUsers(prev => prev.filter(u => u.id !== pendingId));
  };

  const registerUserDirectly = (userData) => {
    const newUser = {
      ...userData,
      id: 'u' + Date.now(),
      status: 'active',
      permissions: userData.role === 'SUPER_ADMIN' || userData.role === 'DEAN' 
        ? ['EDIT_ALL', 'MANAGE_USERS', 'VIEW_ANALYTICS'] 
        : ['VIEW_PORTAL', 'ACCESS_RESOURCES']
    };
    setUsers(prev => [...prev, newUser]);
    return { success: true };
  };

  const deleteUser = (userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId));
  };

  const updateUserRole = (userId, newRole) => {
    setUsers(prev => prev.map(u => u.id === userId ? { 
      ...u, 
      role: newRole,
      permissions: newRole === 'SUPER_ADMIN' || newRole === 'DEAN' 
        ? ['EDIT_ALL', 'MANAGE_USERS', 'VIEW_ANALYTICS'] 
        : ['VIEW_PORTAL', 'ACCESS_RESOURCES']
    } : u));
  };

  const updateUser = (userId, updatedData) => {
    setUsers(prev => prev.map(u => u.id === userId ? { ...u, ...updatedData } : u));
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
