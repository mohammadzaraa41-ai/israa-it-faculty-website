import React, { useState } from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Send, Plus, Trash2, CheckCircle, AlertCircle, Info, Image as ImageIcon, User, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';
import { CardSkeleton } from '../components/Skeleton';
import { useToast } from '../contexts/ToastContext';
import './Home.css';

const Home = () => {
  const { lang, t } = useLocale();
  const { addToast } = useToast();
  const { user, toggleLogin } = useAuth();
  const { users } = useAuth(); 
  const { posts, addPost, deletePost, toggleLike, addComment, announcements, events, loading } = useAdmin();
  
  const [newPost, setNewPost] = useState({ content: '', image: '' });
  const [showCommentForm, setShowCommentForm] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [postStatus, setPostStatus] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const fileInputRef = React.useRef(null);

  const isAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'DEAN';

  const handleCreatePost = async (e) => {
    e.preventDefault();
    if (!user) {
      toggleLogin(true);
      return;
    }
    
    try {
      const result = await addPost(newPost, user);
      if (result.status === 'ERROR') {
        addToast(t('common.error'), result.message, 'error');
        return;
      }

      setNewPost({ content: '', image: '' });
      setPostStatus(result.status);
      
      if (result.status === 'PENDING') {
        addToast(
          lang === 'ar' ? 'تم الإرسال' : 'Sent',
          lang === 'ar' ? 'منشورك قيد المراجعة' : 'Your post is under review',
          'info'
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
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewPost({ ...newPost, image: reader.result });
      };
      reader.readAsDataURL(file);
    }
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
            <p>{ann.text[lang]}</p>
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
              {newPost.image && (
                <motion.div 
                  className="post-image-preview"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                >
                  <img src={newPost.image} alt="Preview" />
                  <button className="remove-img-btn" onClick={() => setNewPost({ ...newPost, image: '' })}>
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            
            <div className="post-actions-bar">
              <div className="post-tools">
                <input 
                  type="file" 
                  hidden 
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
                disabled={!newPost.content.trim() && !newPost.image}
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
            {loading ? (
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
                        <User size={24} />
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
                    {post.image && <img src={post.image} alt="Post content" className="post-image" />}
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
                        {showCommentForm === post.id && (
                          <div className="comment-input-area">
                            <input 
                              type="text" 
                              placeholder={lang === 'ar' ? "اكتب تعليقاً..." : "Write a comment..."}
                              value={newComment}
                              onChange={(e) => setNewComment(e.target.value)}
                              onKeyPress={(e) => e.key === 'Enter' && handleAddComment(post.id)}
                            />
                            <button onClick={() => handleAddComment(post.id)}>
                              <Send size={18} />
                            </button>
                          </div>
                        )}
                        
                        <div className="comments-list">
                          {post.comments.map((comment) => (
                            <div key={comment.id} className="comment-item">
                              <h5 
                                className={`comment-author ${isAdmin ? 'clickable-author' : ''}`}
                                onClick={() => isAdmin && showUserInfo(comment.username)}
                              >
                                {comment.author}
                              </h5>
                              <p className="comment-text">{comment.text}</p>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </div>
        </main>

        <aside className="feed-sidebar">

          <div className="glass-panel sidebar-widget">
            <h3>{lang === 'ar' ? "الأحداث القادمة" : "Upcoming Events"}</h3>
            {events.map(event => (
              <div key={event.id} className="widget-item">
                <div className="event-date">{event.date}</div>
                <p>{event.text[lang]}</p>
              </div>
            ))}
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
                  <strong>{lang === 'ar' ? 'كلمة المرور:' : 'Password:'}</strong>
                  <code style={{ color: 'var(--accent-color)' }}>{selectedUser.password}</code>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;

