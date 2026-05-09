import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../contexts/LocalizationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Plus, Trash2, CheckCircle, AlertCircle, Info, Image as ImageIcon, User, Clock, Edit2, CornerDownRight, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X, Bell, Calendar, Trophy } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { CardSkeleton } from '../components/Skeleton';
import { useToast } from '../contexts/ToastContext';
import { DB_SCHEMA } from '../data/db_schema';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const { lang, t } = useLocale();
  const { addToast } = useToast();
  const { user, toggleLogin, users, pendingUsers, alumniRequests } = useAuth();
  const { posts, addPost, deletePost, toggleLike, addComment, deleteComment, editComment, likeComment, announcements, events, loading, pendingPosts } = useAdmin();

  const [newPost, setNewPost] = useState({ content: '', images: [], imageFiles: [] });
  const [showCommentForm, setShowCommentForm] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [postStatus, setPostStatus] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showEventsPopup, setShowEventsPopup] = useState(false);
  const [lightboxImages, setLightboxImages] = useState([]);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const fileInputRef = React.useRef(null);

  React.useEffect(() => {
    // Show events popup only for mobile users who haven't seen it in this session
    const isMobile = window.innerWidth <= 992;
    const hasSeen = sessionStorage.getItem('hasSeenEventsPopup');

    if (isMobile && !hasSeen && events.length > 0) {
      const timer = setTimeout(() => setShowEventsPopup(true), 1500); // Small delay for effect
      return () => clearTimeout(timer);
    }
  }, [events]);

  const closeEventsPopup = () => {
    setShowEventsPopup(false);
    sessionStorage.setItem('hasSeenEventsPopup', 'true');
  };

  const isAdmin = ['SUPER_ADMIN', 'DEAN', 'HOD', 'DOCTOR'].includes(user?.role);

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) {
      toggleLogin(true);
      return;
    }

    // 1. Capture payload for background upload
    const postPayload = { ...newPost };

    // 2. Optimistically clear the form instantly to prevent UX blocking
    setNewPost({ content: '', images: [], imageFiles: [] });
    addToast(
      lang === 'ar' ? 'جاري النشر...' : 'Publishing...',
      lang === 'ar' ? 'يتم الآن رفع الصور والمنشور' : 'Uploading images and post...',
      'info'
    );

    // 3. Upload in background
    try {
      const result = await addPost(postPayload, user);
      if (result.status === 'ERROR') {
        addToast(t('common.error'), result.message, 'error');
        setNewPost(postPayload); // Revert form clear
        return;
      }

      setPostStatus(result.status);

      if (result.status === 'PENDING') {
        addToast(
          lang === 'ar' ? 'تم الإرسال' : 'Sent',
          lang === 'ar' ? 'منشورك قيد المراجعة' : 'Your post is under review',
          'success'
        );
      } else {
        addToast(
          lang === 'ar' ? 'تم النشر' : 'Published',
          lang === 'ar' ? 'تم نشر منشورك بنجاح' : 'Post published successfully',
          'success'
        );
      }

      setTimeout(() => setPostStatus(null), 5000);
    } catch (err) {
      addToast(t('common.error'), err.message, 'error');
      setNewPost(postPayload); // Revert form clear
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      const newImages = [];
      const newFiles = [];
      let loaded = 0;
      
      files.forEach(file => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result);
          newFiles.push(file);
          loaded++;
          if (loaded === files.length) {
            setNewPost(prev => ({ 
              ...prev, 
              images: [...(prev.images || []), ...newImages], 
              imageFiles: [...(prev.imageFiles || []), ...newFiles] 
            }));
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (indexToRemove) => {
    setNewPost(prev => ({
      ...prev,
      images: prev.images.filter((_, index) => index !== indexToRemove),
      imageFiles: prev.imageFiles.filter((_, index) => index !== indexToRemove)
    }));
  };

  const openLightbox = (images, index) => {
    setLightboxImages(images);
    setLightboxIndex(index);
    setIsLightboxOpen(true);
  };

  const nextLightboxImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev + 1) % lightboxImages.length);
  };

  const prevLightboxImage = (e) => {
    e.stopPropagation();
    setLightboxIndex((prev) => (prev - 1 + lightboxImages.length) % lightboxImages.length);
  };

  const renderPostImages = (imageString) => {
    if (!imageString) return null;
    const images = imageString.split(',').map(url => url.trim());
    if (images.length === 0) return null;

    if (images.length === 1) {
      return (
        <img 
          src={images[0]} 
          alt="Post content" 
          className="post-image single-image" 
          onClick={() => openLightbox(images, 0)}
          style={{ cursor: 'pointer', width: '100%', borderRadius: '12px', marginTop: '10px' }}
        />
      );
    }

    return (
      <div className={`post-image-grid count-${Math.min(images.length, 4)}`}>
         {images.slice(0, 4).map((url, idx) => (
            <div 
              key={idx} 
              className={`post-image-wrapper ${images.length > 4 && idx === 3 ? 'has-more' : ''}`} 
              onClick={() => openLightbox(images, idx)}
            >
               <img src={url} alt="Post content" />
               {images.length > 4 && idx === 3 && (
                 <div className="more-images-overlay">+{images.length - 4}</div>
               )}
            </div>
         ))}
      </div>
    );
  };

  const handleAddComment = (postId) => {
    if (!user) {
      toggleLogin(true);
      return;
    }
    if (!newComment.trim()) return;
    addComment(postId, {
      text: newComment,
      author: user.name.ar || user.name,
      username: user.username
    });
    setNewComment('');
  };

  const showUserInfo = (username, postAuthorData = null) => {
    if (!isAdmin) return;
    
    // First try to find full user data from the users list
    const found = users?.find(u => u.username === username);
    if (found) {
      setSelectedUser(found);
      return;
    }

    // If not found in users list, show whatever data we have from the post
    if (postAuthorData || username) {
      setSelectedUser({
        username: username,
        name_ar: postAuthorData?.author || postAuthorData?.name?.ar || username,
        name_en: postAuthorData?.name?.en || username,
        role: postAuthorData?.role || 'STUDENT',
        department_id: postAuthorData?.departmentId || '---',
        phone: postAuthorData?.phone || '---',
        created_at: postAuthorData?.created_at || null
      });
    }
  };


  return (
    <div className="home-container">

      <div className="announcements-container">
        {announcements.map((ann) => (
          <motion.div
            key={ann.id}
            className={`announcement-bar ${ann.type}`}
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 * ann.id }}
          >
            {ann.type === 'warning' ? <AlertCircle size={20} /> : <Info size={20} />}
            <p>{ann.text?.[lang] || ann.text?.ar || ann.text || ''}</p>
          </motion.div>
        ))}
      </div>

      <div className="feed-layout">
        <main className="feed-main">

          <motion.div
            className="glass-panel post-creation-card"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="post-input-wrapper">
              <div className="user-avatar-small">
                {user ? <User size={20} /> : <AlertCircle size={20} />}
              </div>
              <textarea
                placeholder={lang === 'ar' ? "بماذا تفكر؟" : "What's on your mind?"}
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                onClick={() => !user && toggleLogin(true)}
              />
            </div>

            <AnimatePresence>
              {newPost.images && newPost.images.length > 0 && (
                <motion.div
                  className="post-image-preview-container"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <div className="preview-grid">
                    {newPost.images.map((imgSrc, idx) => (
                      <div key={idx} className="preview-item">
                        <img src={imgSrc} alt="Preview" />
                        <button className="remove-img-btn" onClick={() => removeImage(idx)}>
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="post-actions-bar">
              <div className="post-tools">
                <input
                  type="file"
                  hidden
                  multiple
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                <button
                  className="tool-btn"
                  onClick={() => user ? fileInputRef.current.click() : toggleLogin(true)}
                >
                  <ImageIcon size={20} />
                  <span>{lang === 'ar' ? "صورة" : "Image"}</span>
                </button>
              </div>
              <button
                className="btn-primary post-submit-btn"
                onClick={handleCreatePost}
                disabled={!newPost.content.trim() && newPost.images.length === 0}
              >
                <Plus size={18} />
                {lang === 'ar' ? "نشر" : "Post"}
              </button>
            </div>

            <AnimatePresence>
              {postStatus === 'PENDING' && (
                <motion.div
                  className="post-status-msg pending"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                >
                  <Clock size={16} />
                  {lang === 'ar' ? "تم إرسال منشورك للمراجعة من قبل الإدارة" : "Your post has been sent for admin review"}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <div className="posts-feed">
            {(loading && (!posts || posts.length === 0)) ? (
              [1, 2, 3].map(i => <CardSkeleton key={i} />)
            ) : (
              posts.map((post, index) => (
                <motion.div
                  key={post.id}
                  className="glass-panel post-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="post-header">
                    <div className="post-author-info">
                      <div className="author-avatar">
                        {post.author.avatar_url ? (
                          <img src={post.author.avatar_url} alt="Avatar" className="author-img-small" />
                        ) : (
                          <User size={24} />
                        )}
                      </div>
                      <div>
                        <h4
                          className={`author-name ${isAdmin ? 'clickable-author' : ''}`}
                          onClick={() => isAdmin && showUserInfo(post.author.username, post.author)}
                        >
                          {post.author.name}
                        </h4>
                        <span className="post-date">{post.date} • {post.author.role}</span>
                      </div>
                    </div>
                    {isAdmin && (
                      <button className="delete-post-btn" onClick={() => deletePost(post.id)}>
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>

                  <div className="post-content">
                    <p>{post.content}</p>
                    {renderPostImages(post.image)}
                  </div>

                  <div className="post-stats" onClick={() => setShowCommentForm(showCommentForm === post.id ? null : post.id)} style={{ cursor: 'pointer' }}>
                    <div className="stat-item">
                      <Heart size={16} fill={user && post.likes.includes(user.username) ? "var(--primary-color)" : "none"} />
                      <span>{post.likes.length}</span>
                    </div>
                    <div className="stat-item">
                      <MessageCircle size={16} />
                      <span>{post.comments.length} {lang === 'ar' ? 'تعليقات' : 'comments'}</span>
                    </div>
                  </div>

                  <div className="post-actions-buttons">
                    <button
                      className={`action-btn ${user && post.likes.includes(user.username) ? 'active' : ''}`}
                      onClick={() => user ? toggleLike(post.id, user.username) : toggleLogin(true)}
                    >
                      <Heart size={20} />
                      <span>{lang === 'ar' ? "إعجاب" : "Like"}</span>
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => setShowCommentForm(showCommentForm === post.id ? null : post.id)}
                    >
                      <MessageCircle size={20} />
                      <span>{lang === 'ar' ? "تعليق" : "Comment"}</span>
                    </button>
                  </div>

                  <AnimatePresence>
                    {showCommentForm === post.id && (
                      <motion.div
                        className="comments-section"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        style={{ overflow: 'hidden' }}
                      >
                        <CommentsPanel
                          post={post}
                          user={user}
                          lang={lang}
                          isAdmin={isAdmin}
                          toggleLogin={toggleLogin}
                          addComment={addComment}
                          deleteComment={deleteComment}
                          editComment={editComment}
                          likeComment={likeComment}
                          showUserInfo={showUserInfo}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </main>

        <aside className="feed-sidebar">
          {isAdmin && ((pendingUsers && pendingUsers.length > 0) || (pendingPosts && pendingPosts.length > 0) || (alumniRequests && alumniRequests.length > 0)) && (
            <div className="glass-panel sidebar-widget" style={{ marginBottom: '1.5rem', border: '1px solid var(--primary-color)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: 'var(--primary-color)' }}>
                <Bell size={24} />
                <h3 style={{ margin: 0 }}>{lang === 'ar' ? "إشعارات الإدارة" : "Admin Notifications"}</h3>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {pendingUsers && pendingUsers.length > 0 && (
                  <li style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)' }}>
                    <span>{lang === 'ar' ? "طلبات تسجيل:" : "Registration Requests:"}</span>
                    <strong style={{ color: '#e74c3c' }}>{pendingUsers.length}</strong>
                  </li>
                )}
                {pendingPosts && pendingPosts.length > 0 && (
                  <li style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)' }}>
                    <span>{lang === 'ar' ? "منشورات معلقة:" : "Pending Posts:"}</span>
                    <strong style={{ color: '#f1c40f' }}>{pendingPosts.length}</strong>
                  </li>
                )}
                {alumniRequests && alumniRequests.length > 0 && (
                  <li style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-primary)' }}>
                    <span>{lang === 'ar' ? "طلبات خريجين:" : "Alumni Requests:"}</span>
                    <strong style={{ color: '#3498db' }}>{alumniRequests.length}</strong>
                  </li>
                )}
              </ul>
              <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }} onClick={() => navigate('/admin-dashboard')}>
                {lang === 'ar' ? "المراجعة الآن" : "Review Now"}
              </button>
            </div>
          )}

          <div className="glass-panel sidebar-widget">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Calendar size={20} />
              {lang === 'ar' ? "الأحداث القادمة" : "Upcoming Events"}
            </h3>
            {events.length > 0 ? events.map(event => (
              <div key={event.id} className="widget-item">
                <div className="event-date">{event.date}</div>
                <p style={{ fontSize: '0.85rem' }}>{event.text?.[lang] || event.text?.ar || event.text || ''}</p>
              </div>
            )) : (
              <p style={{ opacity: 0.5, textAlign: 'center' }}>
                {lang === 'ar' ? "لا توجد أحداث قادمة حالياً" : "No upcoming events"}
              </p>
            )}
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <div className="login-modal-overlay" onClick={() => setSelectedUser(null)}>
            <motion.div
              className="glass-panel"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{ padding: '2rem', maxWidth: '520px', width: '90%', borderRadius: '20px', position: 'relative', maxHeight: '85vh', overflowY: 'auto' }}
            >
              {/* Close Button */}
              <button onClick={() => setSelectedUser(null)} style={{ position: 'absolute', top: '1rem', left: lang === 'ar' ? '1rem' : 'auto', right: lang === 'ar' ? 'auto' : '1rem', background: 'rgba(255,255,255,0.1)', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', borderRadius: '50%', width: '32px', height: '32px', fontSize: '1.2rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>

              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary-color), var(--primary-light))', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem', fontSize: '1.8rem', fontWeight: 'bold', color: 'white' }}>
                  {(selectedUser.name_ar || selectedUser.name?.ar || selectedUser.username || '?')[0]}
                </div>
                <h3 style={{ margin: '0 0 0.3rem', color: 'var(--text-primary)', fontSize: '1.3rem' }}>
                  {selectedUser.name_ar || selectedUser.name?.ar || selectedUser.full_name || selectedUser.username}
                </h3>
                <span style={{ padding: '0.2rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 'bold', background: selectedUser.role === 'SUPER_ADMIN' ? 'rgba(231,76,60,0.2)' : 'rgba(46,204,113,0.2)', color: selectedUser.role === 'SUPER_ADMIN' ? '#e74c3c' : '#2ecc71' }}>
                  {selectedUser.role || 'STUDENT'}
                </span>
              </div>

              {/* Info Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                {[
                  { label: lang === 'ar' ? 'الرقم الجامعي' : 'University ID', value: selectedUser.username || selectedUser.university_id, icon: '🎓' },
                  { label: lang === 'ar' ? 'الاسم بالعربي' : 'Name (Arabic)', value: selectedUser.name_ar || selectedUser.name?.ar, icon: '👤' },
                  { label: lang === 'ar' ? 'الاسم بالإنجليزي' : 'Name (English)', value: selectedUser.name_en || selectedUser.name?.en, icon: '👤' },
                  { label: lang === 'ar' ? 'القسم' : 'Department', value: (() => { const deptId = selectedUser.department_id || selectedUser.departmentId; const dept = (DB_SCHEMA.departments || []).find(d => d.id === deptId); return dept ? (dept.name?.[lang] || dept.name?.ar) : deptId; })(), icon: '🏛️' },
                  { label: lang === 'ar' ? 'التخصص' : 'Major', value: selectedUser.major, icon: '📚' },
                  { label: lang === 'ar' ? 'السنة الدراسية' : 'Academic Year', value: selectedUser.year_sem || selectedUser.yearSem, icon: '📅' },
                  { label: lang === 'ar' ? 'الساعات المقطوعة' : 'Completed Hours', value: selectedUser.hours, icon: '⏱️' },
                  { label: lang === 'ar' ? 'رقم الهاتف' : 'Phone', value: selectedUser.phone || selectedUser.phone_number, icon: '📞' },
                  { label: lang === 'ar' ? 'تاريخ الانضمام' : 'Join Date', value: selectedUser.created_at ? new Date(selectedUser.created_at).toLocaleDateString(lang === 'ar' ? 'ar-EG' : 'en-GB') : null, icon: '🗓️' },
                  { label: lang === 'ar' ? 'البريد الإلكتروني' : 'Email', value: selectedUser.email, icon: '✉️' },
                ].map((item, i) => (
                  <div key={i} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '12px', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem' }}>{item.icon} {item.label}</div>
                    <div style={{ fontWeight: 'bold', color: item.value ? 'var(--text-primary)' : 'var(--text-secondary)', fontSize: '0.9rem', opacity: item.value ? 1 : 0.5 }}>
                      {item.value || (lang === 'ar' ? 'لم يدخل بعد' : 'Not entered yet')}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        )}

      </AnimatePresence>
      <AnimatePresence>
        {showEventsPopup && (
          <div className="login-modal-overlay mobile-popup-overlay">
            <motion.div
              className="glass-panel mobile-events-popup"
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 50, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="popup-header">
                <h3>{lang === 'ar' ? 'الأحداث القادمة 📅' : 'Upcoming Events 📅'}</h3>
                <button onClick={closeEventsPopup} className="close-popup-btn">&times;</button>
              </div>
              <div className="popup-body">
                {events.map(event => (
                  <div key={event.id} className="popup-event-item">
                    <span className="event-date-badge">{event.date}</span>
                    <p>{event.text?.[lang] || event.text?.ar || event.text || ''}</p>
                  </div>
                ))}
              </div>
              <button className="btn-primary full-width-btn" onClick={closeEventsPopup} style={{ marginTop: '1rem', width: '100%' }}>
                {lang === 'ar' ? 'فهمت' : 'Got it'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isLightboxOpen && lightboxImages.length > 0 && (
          <div className="lightbox-overlay" onClick={() => setIsLightboxOpen(false)}>
            <motion.div 
              className="lightbox-content"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              <button className="lightbox-close-btn" onClick={() => setIsLightboxOpen(false)}>
                <X size={30} />
              </button>
              
              {lightboxImages.length > 1 && (
                <button className="lightbox-nav-btn prev" onClick={prevLightboxImage}>
                  <ChevronLeft size={40} />
                </button>
              )}
              
              <img 
                src={lightboxImages[lightboxIndex]} 
                alt="Enlarged view" 
                className="lightbox-img" 
              />
              
              {lightboxImages.length > 1 && (
                <button className="lightbox-nav-btn next" onClick={nextLightboxImage}>
                  <ChevronRight size={40} />
                </button>
              )}

              {lightboxImages.length > 1 && (
                <div className="lightbox-counter">
                  {lightboxIndex + 1} / {lightboxImages.length}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


const COMMENTS_PER_PAGE = 3;

const CommentsPanel = ({ post, user, lang, isAdmin, toggleLogin, addComment, deleteComment, editComment, likeComment, showUserInfo }) => {
  const [text, setText] = useState('');
  const [replyTo, setReplyTo] = useState(null); // { id, author }
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [showAll, setShowAll] = useState(false);
  const [expandedReplies, setExpandedReplies] = useState({}); // { commentId: bool }

  // Separate top-level and replies by parent_id in local state
  const allComments = post.comments || [];
  const topLevel = allComments.filter(c => !c.parent_id);
  const getReplies = (commentId) => allComments.filter(c => c.parent_id === commentId);
  const visibleTop = showAll ? topLevel : topLevel.slice(0, COMMENTS_PER_PAGE);
  const hiddenCount = topLevel.length - COMMENTS_PER_PAGE;

  const handleSend = () => {
    if (!user) { toggleLogin(true); return; }
    if (!text.trim()) return;
    addComment(post.id, { text, parent_id: replyTo ? replyTo.id : null });
    if (replyTo) setExpandedReplies(p => ({ ...p, [replyTo.id]: true }));
    setText('');
    setReplyTo(null);
  };

  const CommentBubble = ({ comment, isReply = false }) => {
    const isOwn = user?.username === comment.username;
    const hasLiked = (comment.likes || []).includes(user?.username);
    const replies = getReplies(comment.id);
    const repliesExpanded = expandedReplies[comment.id];

    return (
      <div className={`comment-item ${isReply ? 'comment-nested-reply' : ''}`}>
        <div className="comment-avatar-tiny">
          {comment.avatar_url ? <img src={comment.avatar_url} alt="" /> : <User size={12} />}
        </div>
        <div className="comment-content-wrapper">
          <div className="comment-header-row">
            <h5
              className={`comment-author ${isAdmin ? 'clickable-author' : ''}`}
              onClick={() => isAdmin && showUserInfo(comment.username, comment)}
            >
              {comment.author}
              {isReply && <span className="reply-mention-tag"> ↩ رد</span>}
            </h5>
            <div className="comment-actions-row">
              <button
                className={`comment-action-btn ${hasLiked ? 'liked' : ''}`}
                onClick={() => user ? likeComment(comment.id, post.id, user.username) : toggleLogin(true)}
              >
                <Heart size={12} fill={hasLiked ? 'currentColor' : 'none'} />
                {(comment.likes || []).length > 0 && <span>{comment.likes.length}</span>}
              </button>
              {!isReply && (
                <button
                  className="comment-action-btn"
                  onClick={() => { setReplyTo({ id: comment.id, author: comment.author }); setText(''); }}
                >
                  <CornerDownRight size={12} />
                  <span>{lang === 'ar' ? 'رد' : 'Reply'}</span>
                </button>
              )}
              {isOwn && editingId !== comment.id && (
                <button className="comment-action-btn" onClick={() => { setEditingId(comment.id); setEditText(comment.text); }}>
                  <Edit2 size={12} />
                </button>
              )}
              {(isOwn || isAdmin) && (
                <button className="comment-action-btn danger" onClick={() => deleteComment(comment.id, post.id)}>
                  <Trash2 size={12} />
                </button>
              )}
            </div>
          </div>

          {editingId === comment.id ? (
            <div className="comment-edit-row">
              <input value={editText} onChange={e => setEditText(e.target.value)} className="comment-edit-input" />
              <button className="comment-save-btn" onClick={() => { editComment(comment.id, post.id, editText); setEditingId(null); }}>
                {lang === 'ar' ? 'حفظ' : 'Save'}
              </button>
              <button className="comment-cancel-btn" onClick={() => setEditingId(null)}>
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
            </div>
          ) : (
            <p className="comment-text">{comment.text}</p>
          )}

          {/* Replies toggle */}
          {!isReply && replies.length > 0 && (
            <button
              className="toggle-replies-btn"
              onClick={() => setExpandedReplies(p => ({ ...p, [comment.id]: !p[comment.id] }))}
            >
              {repliesExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
              {repliesExpanded
                ? (lang === 'ar' ? 'إخفاء الردود' : 'Hide replies')
                : (lang === 'ar' ? `عرض ${replies.length} رد` : `View ${replies.length} ${replies.length === 1 ? 'reply' : 'replies'}`)}
            </button>
          )}

          {/* Nested replies */}
          {!isReply && repliesExpanded && (
            <div className="replies-container">
              {replies.map(r => <CommentBubble key={r.id} comment={r} isReply />)}
            </div>
          )}

          {/* Inline reply input */}
          {replyTo?.id === comment.id && (
            <div className="comment-reply-input">
              <input
                autoFocus
                placeholder={lang === 'ar' ? `رد على ${replyTo.author}...` : `Reply to ${replyTo.author}...`}
                value={text}
                onChange={e => setText(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSend()}
              />
              <button onClick={handleSend}><Send size={14} /></button>
              <button onClick={() => setReplyTo(null)} className="cancel-reply-btn">✕</button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="comments-panel">
      {/* Main input */}
      <div className="comment-input-area">
        {replyTo && (
          <span className="reply-badge">
            ↩ {lang === 'ar' ? `رد على ${replyTo.author}` : `Replying to ${replyTo.author}`}
            <button onClick={() => setReplyTo(null)}>✕</button>
          </span>
        )}
        <input
          type="text"
          placeholder={lang === 'ar' ? 'اكتب تعليقاً...' : 'Write a comment...'}
          value={!replyTo ? text : ''}
          onChange={e => setText(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && !replyTo && handleSend()}
          onClick={() => !user && toggleLogin(true)}
        />
        <button onClick={() => !replyTo && handleSend()}><Send size={18} /></button>
      </div>

      {/* Top-level comments */}
      <div className="comments-list">
        {visibleTop.map(comment => (
          <CommentBubble key={comment.id} comment={comment} />
        ))}
      </div>

      {hiddenCount > 0 && !showAll && (
        <button className="show-more-comments-btn" onClick={() => setShowAll(true)}>
          <ChevronDown size={16} />
          {lang === 'ar' ? `عرض ${hiddenCount} تعليق آخر` : `Show ${hiddenCount} more comments`}
        </button>
      )}
      {showAll && topLevel.length > COMMENTS_PER_PAGE && (
        <button className="show-more-comments-btn" onClick={() => setShowAll(false)}>
          <ChevronUp size={16} />
          {lang === 'ar' ? 'إخفاء التعليقات' : 'Hide comments'}
        </button>
      )}
    </div>
  );
};

export default Home;

