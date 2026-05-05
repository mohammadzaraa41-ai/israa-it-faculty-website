import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import { useLocale } from './LocalizationContext';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const { addToast } = useToast();
  const { lang } = useLocale();
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (!user) return;

    // 1. Subscribe to post approvals (where current user is the author)
    const postsChannel = supabase
      .channel('post-approvals')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'posts',
          filter: `author_username=eq.${user.username}`
        },
        (payload) => {
          if (payload.new.status === 'APPROVED' && payload.old.status === 'PENDING') {
            const title = lang === 'ar' ? 'تمت الموافقة!' : 'Post Approved!';
            const message = lang === 'ar' ? 'تمت الموافقة على منشورك وهو الآن متاح للجميع.' : 'Your post has been approved and is now public.';
            
            addNotification(title, message, 'post');
            addToast(title, message, 'success');
          }
        }
      )
      .subscribe();

    // 2. Subscribe to new announcements
    const announcementsChannel = supabase
      .channel('new-announcements')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'announcements'
        },
        (payload) => {
          const title = lang === 'ar' ? 'إعلان جديد' : 'New Announcement';
          const textObj = typeof payload.new.text === 'object' ? payload.new.text : JSON.parse(payload.new.text || '{}');
          const message = lang === 'ar' ? (textObj.ar || 'يوجد إعلان جديد من الكلية') : (textObj.en || 'There is a new announcement from the faculty');

          addNotification(title, message, 'announcement');
          addToast(title, message, 'info');
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(postsChannel);
      supabase.removeChannel(announcementsChannel);
    };
  }, [user, lang, addToast]);

  const addNotification = (title, message, type) => {
    const newNotif = {
      id: Date.now(),
      title,
      message,
      type,
      timestamp: new Date(),
      read: false
    };
    setNotifications(prev => [newNotif, ...prev]);
    setUnreadCount(prev => prev + 1);
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearNotifications = () => {
    setNotifications([]);
    setUnreadCount(0);
  };

  return (
    <NotificationContext.Provider value={{ 
      notifications, 
      unreadCount, 
      markAsRead, 
      markAllAsRead, 
      clearNotifications 
    }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
