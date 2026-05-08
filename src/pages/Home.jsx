import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../contexts/LocalizationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Plus, Trash2, CheckCircle, AlertCircle, Info, Image as ImageIcon, User, Clock, Edit2, CornerDownRight, ChevronDown, ChevronUp, ChevronLeft, ChevronRight, X, Bell } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { CardSkeleton } from '../components/Skeleton';
import { useToast } from '../contexts/ToastContext';
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

  const showUserInfo = (username) => {
    if (!isAdmin) return;
    const found = users?.find(u => u.username === username);
    if (found) setSelectedUser(found);
    else alert(lang === 'ar' ? 'لم يتم العثور على معلومات المستخدم' : 'User info not found');
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
                          onClick={() => isAdmin && showUserInfo(post.author.username)}
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
            {events.length > 0 ? events.map(event => {
              const isHackathon = event.tag?.toLowerCase().includes('hackathon') || event.tag?.includes('هاكاثون');
              const title = event.title_ar || event.title_en ? (lang === 'ar' ? event.title_ar : event.title_en) : (event.title || (typeof event.text === 'object' ? event.text[lang] : event.text));
              
              return (
                <div key={event.id} className="widget-item" onClick={() => navigate('/events')} style={{ cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <div className="event-date">{event.date}</div>
                    {isHackathon && <Trophy size={14} color="var(--accent-color)" />}
                  </div>
                  <h4 style={{ margin: '0 0 0.3rem', fontSize: '0.9rem', color: isHackathon ? 'var(--accent-color)' : 'inherit' }}>{title}</h4>
                  <p style={{ fontSize: '0.8rem', opacity: 0.7 }}>{typeof event.text === 'object' ? event.text[lang] : event.text}</p>
                </div>
              );
            }) : (
              <p style={{ opacity: 0.5, textAlign: 'center' }}>
                {lang === 'ar' ? "لا توجد أحداث قادمة حالياً" : "No upcoming events"}
              </p>
            )}
            <button className="btn-outline" style={{ width: '100%', marginTop: '1rem', fontSize: '0.8rem' }} onClick={() => navigate('/events')}>
              {lang === 'ar' ? 'عرض الكل' : 'View All'}
            </button>
          </div>
        </aside>
      </div>

      <AnimatePresence>
        {selectedUser && (
          <div className="login-modal-overlay" onClick={() => setSelectedUser(null)}>
            <motion.div
              className="glass-panel user-info-modal"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="modal-header">
                <h3>{lang === 'ar' ? 'معلومات المستخدم الكاملة' : 'Full User Info'}</h3>
                <button onClick={() => setSelectedUser(null)} className="close-modal-btn">&times;</button>
              </div>
              <div className="modal-body">
                <div className="info-row">
                  <strong>{lang === 'ar' ? 'الاسم:' : 'Name:'}</strong>
                  <span>{selectedUser.name?.ar || selectedUser.name}</span>
                </div>
                <div className="info-row">
                  <strong>{lang === 'ar' ? 'اسم المستخدم / الرقم:' : 'Username / ID:'}</strong>
                  <span>{selectedUser.username}</span>
                </div>
                <div className="info-row">
                  <strong>{lang === 'ar' ? 'الرتبة:' : 'Role:'}</strong>
                  <span>{selectedUser.role}</span>
                </div>
                <div className="info-row">
                  <strong>{lang === 'ar' ? 'القسم:' : 'Department:'}</strong>
                  <span>{selectedUser.departmentId || 'N/A'}</span>
                </div>
                <div className="info-row">
                  <strong>{lang === 'ar' ? 'رقم الهاتف:' : 'Phone:'}</strong>
                  <span>{selectedUser.phone || '---'}</span>
                </div>
                <div className="info-row">
                  <strong>{lang === 'ar' ? 'كلمة المرور:' : 'Password:'}</strong>
                  <span style={{ color: 'var(--text-secondary)', opacity: 0.5 }}>********</span>
                </div>
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
              <div className="popup-body" style={{ maxHeight: '60vh', overflowY: 'auto' }}>
                {events.map(event => {
                  const isHackathon = event.tag?.toLowerCase().includes('hackathon') || event.tag?.includes('هاكاثون');
                  const title = event.title_ar || event.title_en ? (lang === 'ar' ? event.title_ar : event.title_en) : (event.title || (typeof event.text === 'object' ? event.text[lang] : event.text));
                  
                  return (
                    <div key={event.id} className="popup-event-item" onClick={() => { closeEventsPopup(); navigate('/events'); }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span className="event-date-badge">{event.date}</span>
                        {isHackathon && <Trophy size={16} color="var(--accent-color)" />}
                      </div>
                      <h4 style={{ color: isHackathon ? 'var(--accent-color)' : 'var(--primary-light)', marginBottom: '0.3rem' }}>{title}</h4>
                      <p style={{ fontSize: '0.85rem' }}>{typeof event.text === 'object' ? event.text[lang] : event.text}</p>
                    </div>
                  );
                })}
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
              onClick={() => isAdmin && showUserInfo(comment.username)}
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

