import React, { useState, useRef, useEffect } from 'react';
import { Bell, Check, Trash2, X, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../contexts/NotificationContext';
import { useLocale } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';

const NotificationDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearNotifications } = useNotifications();
  const { lang } = useLocale();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const { user, pendingUsers, alumniRequests } = useAuth();
  const { pendingPosts } = useAdmin();

  const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);
  const pendingUsersCount = pendingUsers?.length || 0;
  const pendingPostsCount = pendingPosts?.length || 0;
  const alumniRequestsCount = alumniRequests?.length || 0;
  const adminPendingCount = isAdmin ? (pendingUsersCount + pendingPostsCount + alumniRequestsCount) : 0;
  const totalBadgeCount = unreadCount + adminPendingCount;

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="notification-dropdown-wrapper" ref={dropdownRef} style={{ position: 'relative' }}>
      <button 
        className="icon-btn highlight-btn" 
        onClick={() => setIsOpen(!isOpen)}
        style={{ position: 'relative' }}
      >
        <Bell size={18} />
        {totalBadgeCount > 0 && (
          <span className="notification-badge" style={{
            position: 'absolute',
            top: '-5px',
            right: '-5px',
            background: 'var(--accent-color)',
            color: '#000',
            fontSize: '10px',
            fontWeight: 'bold',
            borderRadius: '50%',
            width: '16px',
            height: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 10px rgba(0,0,0,0.5)'
          }}>
            {totalBadgeCount > 9 ? '9+' : totalBadgeCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="glass-panel"
            style={{
              position: 'absolute',
              top: '50px',
              right: lang === 'ar' ? 'auto' : '0',
              left: lang === 'ar' ? '0' : 'auto',
              width: '300px',
              maxHeight: '400px',
              zIndex: 1000,
              padding: '1rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.75rem',
              boxShadow: '0 10px 30px rgba(0,0,0,0.5)',
              border: '1px solid var(--border-color)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h4 style={{ margin: 0, fontSize: '0.9rem' }}>{lang === 'ar' ? 'الإشعارات' : 'Notifications'}</h4>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button onClick={markAllAsRead} className="icon-btn-small" title={lang === 'ar' ? 'تمت القراءة للكل' : 'Mark all as read'}>
                  <Check size={14} />
                </button>
                <button onClick={clearNotifications} className="icon-btn-small" title={lang === 'ar' ? 'مسح الكل' : 'Clear all'}>
                  <Trash2 size={14} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {isAdmin && adminPendingCount > 0 && (
                <div style={{ 
                  background: 'rgba(241, 196, 15, 0.1)', 
                  border: '1px solid #f1c40f', 
                  borderRadius: '12px', 
                  padding: '0.75rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.5rem'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f1c40f', fontWeight: 'bold', fontSize: '0.85rem' }}>
                    <ShieldAlert size={16} />
                    {lang === 'ar' ? 'مهام إدارية بانتظار المراجعة' : 'Admin Tasks Pending'}
                  </div>
                  <ul style={{ margin: 0, padding: 0, listStyle: 'none', fontSize: '0.8rem', color: 'var(--text-primary)', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                    {pendingUsersCount > 0 && <li>• {lang === 'ar' ? 'طلبات التسجيل:' : 'Registration Requests:'} <strong>{pendingUsersCount}</strong></li>}
                    {pendingPostsCount > 0 && <li>• {lang === 'ar' ? 'منشورات معلقة:' : 'Pending Posts:'} <strong>{pendingPostsCount}</strong></li>}
                    {alumniRequestsCount > 0 && <li>• {lang === 'ar' ? 'طلبات خريجين:' : 'Alumni Requests:'} <strong>{alumniRequestsCount}</strong></li>}
                  </ul>
                  <button 
                    onClick={() => { setIsOpen(false); navigate('/admin'); }}
                    style={{ background: '#f1c40f', color: '#000', border: 'none', borderRadius: '6px', padding: '0.4rem', fontSize: '0.8rem', fontWeight: 'bold', cursor: 'pointer', marginTop: '0.25rem' }}
                  >
                    {lang === 'ar' ? 'المراجعة الآن' : 'Review Now'}
                  </button>
                </div>
              )}

              {notifications.length === 0 && adminPendingCount === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                  {lang === 'ar' ? 'لا توجد إشعارات جديدة' : 'No new notifications'}
                </div>
              ) : (
                notifications.map(notif => (
                  <div 
                    key={notif.id}
                    className={`notification-item ${notif.read ? '' : 'unread'}`}
                    onClick={() => markAsRead(notif.id)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '12px',
                      background: notif.read ? 'rgba(255,255,255,0.03)' : 'rgba(161, 23, 44, 0.1)',
                      border: `1px solid ${notif.read ? 'rgba(255,255,255,0.05)' : 'var(--accent-color)'}`,
                      cursor: 'pointer',
                      transition: 'all 0.2s'
                    }}
                  >
                    <div style={{ fontWeight: 'bold', fontSize: '0.8rem', marginBottom: '0.2rem' }}>{notif.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>{notif.message}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', marginTop: '0.4rem', textAlign: 'right' }}>
                      {new Date(notif.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationDropdown;
