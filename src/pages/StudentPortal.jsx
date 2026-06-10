import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLocale } from '../contexts/LocalizationContext';
import { useAuth } from '../contexts/AuthContext';

/* ─── Floating Orb ─────────────────────────────────────────────────── */
const Orb = ({ style }) => (
  <div
    style={{
      position: 'absolute',
      borderRadius: '50%',
      filter: 'blur(80px)',
      opacity: 0.18,
      pointerEvents: 'none',
      animation: 'orbFloat 8s ease-in-out infinite alternate',
      ...style,
    }}
  />
);

/* ─── Floating Particle ─────────────────────────────────────────────── */
const Particle = ({ x, y, delay, size }) => (
  <div
    style={{
      position: 'absolute',
      left: `${x}%`,
      top: `${y}%`,
      width: `${size}px`,
      height: `${size}px`,
      borderRadius: '50%',
      background: 'rgba(161,23,44,0.6)',
      animation: `particleFloat ${4 + delay}s ease-in-out ${delay}s infinite alternate`,
      pointerEvents: 'none',
    }}
  />
);

const PARTICLES = [
  { x: 10, y: 20, delay: 0, size: 4 },
  { x: 85, y: 15, delay: 1.2, size: 3 },
  { x: 30, y: 75, delay: 0.5, size: 5 },
  { x: 70, y: 60, delay: 2.1, size: 3 },
  { x: 50, y: 40, delay: 1.7, size: 2 },
  { x: 15, y: 55, delay: 0.9, size: 4 },
  { x: 92, y: 80, delay: 3.0, size: 3 },
  { x: 60, y: 90, delay: 1.4, size: 2 },
];

/* ─── Eye SVG icons ─────────────────────────────────────────────────── */
const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
    <circle cx="12" cy="12" r="3"/>
  </svg>
);
const EyeOffIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
    <line x1="1" y1="1" x2="23" y2="23"/>
  </svg>
);

/* ─── Main Component ─────────────────────────────────────────────────── */
const StudentPortal = () => {
  const { lang, t } = useLocale();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    const cleanUser = userId.trim();
    const cleanPass = password.trim();

    try {
      const result = await login(cleanUser, cleanPass);
      if (result && result.success) {
        if (result.user?.role === 'SUPER_ADMIN' || result.user?.role === 'DEAN') {
          navigate('/admin-dashboard');
        } else {
          navigate('/');
        }
      } else {
        setError(lang === 'ar' ? 'بيانات الدخول غير صحيحة، يرجى التحقق والمحاولة مجدداً' : 'Invalid credentials. Please check and try again.');
      }
    } catch (err) {
      setError(lang === 'ar' ? 'حدث خطأ، يرجى المحاولة لاحقاً' : 'An error occurred. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const isRTL = lang === 'ar';

  return (
    <>
      {/* Global keyframes */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Cairo:wght@300;400;600;700&display=swap');

        @keyframes orbFloat {
          from { transform: translate(0, 0) scale(1); }
          to   { transform: translate(30px, -30px) scale(1.1); }
        }
        @keyframes particleFloat {
          from { transform: translateY(0) rotate(0deg); opacity: 0.6; }
          to   { transform: translateY(-20px) rotate(180deg); opacity: 0.2; }
        }
        @keyframes loginSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes errorShake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.9); opacity: 0.8; }
          100% { transform: scale(1.4); opacity: 0; }
        }

        .login-input {
          width: 100%;
          padding: 0.95rem 1.1rem;
          border-radius: 12px;
          border: 1.5px solid rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.06);
          color: var(--text-primary, #f0f0f0);
          font-size: 0.97rem;
          font-family: inherit;
          transition: border-color 0.25s, background 0.25s, box-shadow 0.25s;
          outline: none;
          box-sizing: border-box;
        }
        .login-input:focus {
          border-color: rgba(161,23,44,0.8);
          background: rgba(161,23,44,0.07);
          box-shadow: 0 0 0 4px rgba(161,23,44,0.12);
        }
        .login-input::placeholder { color: rgba(255,255,255,0.3); }

        .login-btn {
          width: 100%;
          padding: 1rem;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
          letter-spacing: 0.5px;
          position: relative;
          overflow: hidden;
          transition: transform 0.2s, box-shadow 0.2s;
          background: linear-gradient(135deg, #a1172c 0%, #c0392b 50%, #a1172c 100%);
          background-size: 200% auto;
          color: white;
        }
        .login-btn:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 12px 30px rgba(161,23,44,0.5);
          animation: shimmer 1.5s linear infinite;
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .login-field-label {
          display: block;
          font-size: 0.82rem;
          font-weight: 600;
          letter-spacing: 0.8px;
          text-transform: uppercase;
          color: rgba(255,255,255,0.5);
          margin-bottom: 0.5rem;
          transition: color 0.2s;
        }
        .login-field-label.focused { color: rgba(192,57,43,0.9); }

        .pwd-toggle {
          position: absolute;
          right: 14px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          cursor: pointer;
          color: rgba(255,255,255,0.35);
          padding: 4px;
          transition: color 0.2s;
          display: flex;
          align-items: center;
        }
        .pwd-toggle:hover { color: rgba(192,57,43,0.9); }

        .error-box {
          animation: errorShake 0.5s ease-out;
          padding: 0.85rem 1.1rem;
          background: rgba(231,76,60,0.12);
          border: 1px solid rgba(231,76,60,0.4);
          border-radius: 10px;
          color: #ff6b6b;
          font-size: 0.88rem;
          line-height: 1.5;
        }

        .spinner {
          width: 18px;
          height: 18px;
          border: 2px solid rgba(255,255,255,0.3);
          border-top-color: white;
          border-radius: 50%;
          animation: spin 0.7s linear infinite;
          display: inline-block;
          vertical-align: middle;
          margin-right: 8px;
        }

        .logo-pulse::before {
          content: '';
          position: absolute;
          inset: -4px;
          border-radius: 50%;
          border: 2px solid rgba(161,23,44,0.5);
          animation: pulse-ring 2s ease-out infinite;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        background: 'var(--bg-color, #0d0d0f)',
        fontFamily: isRTL ? "'Cairo', sans-serif" : "'Inter', sans-serif",
        direction: isRTL ? 'rtl' : 'ltr',
        padding: '2rem 1rem',
      }}>

        {/* Background orbs */}
        <Orb style={{ width: '600px', height: '600px', top: '-200px', left: '-200px', background: 'radial-gradient(circle, #a1172c, #6b0f1e)' }} />
        <Orb style={{ width: '500px', height: '500px', bottom: '-180px', right: '-150px', background: 'radial-gradient(circle, #1a0a0e, #a1172c)', animationDelay: '2s' }} />
        <Orb style={{ width: '350px', height: '350px', top: '40%', left: '40%', background: 'radial-gradient(circle, #2c0a12, #a1172c)', animationDelay: '4s', opacity: 0.1 }} />

        {/* Particles */}
        {PARTICLES.map((p, i) => <Particle key={i} {...p} />)}

        {/* Grid lines overlay */}
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(161,23,44,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(161,23,44,0.04) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
          pointerEvents: 'none',
        }} />

        {/* Login card */}
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '440px',
          padding: '2.5rem 2.5rem 2.8rem',
          borderRadius: '24px',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.09)',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.08)',
          animation: mounted ? 'loginSlideUp 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards' : 'none',
          opacity: mounted ? 1 : 0,
        }}>

          {/* Top accent line */}
          <div style={{
            position: 'absolute',
            top: 0, left: '10%', right: '10%', height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(161,23,44,0.8), transparent)',
            borderRadius: '2px',
          }} />

          {/* Logo area */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <div className="logo-pulse" style={{
              width: '68px', height: '68px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a1172c, #6b0f1e)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 1.2rem',
              boxShadow: '0 8px 28px rgba(161,23,44,0.4)',
              position: 'relative',
              fontSize: '1.8rem',
            }}>
              🎓
            </div>
            <h1 style={{
              fontSize: '1.6rem',
              fontWeight: '700',
              color: 'var(--text-primary, #f0f0f0)',
              margin: '0 0 0.3rem',
              letterSpacing: '-0.3px',
            }}>
              {isRTL ? 'كلية تقنية المعلومات' : 'IT Faculty Portal'}
            </h1>
            <p style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '0.875rem',
              margin: 0,
              fontWeight: '400',
            }}>
              {isRTL ? 'تسجيل الدخول إلى حسابك' : 'Sign in to your account'}
            </p>
          </div>

          {/* Error box */}
          {error && (
            <div className="error-box" style={{ marginBottom: '1.25rem', textAlign: isRTL ? 'right' : 'left' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

            {/* University ID field */}
            <div>
              <label className={`login-field-label ${focusedField === 'id' ? 'focused' : ''}`}>
                {isRTL ? 'الرقم الجامعي / اسم المستخدم' : 'University ID / Username'}
              </label>
              <input
                id="login-user-id"
                className="login-input"
                type="text"
                value={userId}
                onChange={e => setUserId(e.target.value)}
                onFocus={() => setFocusedField('id')}
                onBlur={() => setFocusedField(null)}
                placeholder={isRTL ? 'أدخل رقمك الجامعي...' : 'Enter your university ID...'}
                autoComplete="username"
                required
                disabled={isLoading}
              />
            </div>

            {/* Password field */}
            <div>
              <label className={`login-field-label ${focusedField === 'pwd' ? 'focused' : ''}`}>
                {isRTL ? 'كلمة المرور' : 'Password'}
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  id="login-password"
                  className="login-input"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  onFocus={() => setFocusedField('pwd')}
                  onBlur={() => setFocusedField(null)}
                  placeholder={isRTL ? 'أدخل كلمة المرور...' : 'Enter your password...'}
                  autoComplete="current-password"
                  required
                  disabled={isLoading}
                  style={{
                    width: '100%',
                    padding: isRTL ? '0.95rem 1.1rem 0.95rem 3rem' : '0.95rem 3rem 0.95rem 1.1rem',
                    borderRadius: '12px',
                    border: '1.5px solid rgba(255,255,255,0.1)',
                    background: 'rgba(255,255,255,0.06)',
                    color: 'var(--text-primary, #f0f0f0)',
                    fontSize: '0.97rem',
                    fontFamily: 'inherit',
                    outline: 'none',
                    boxSizing: 'border-box',
                    transition: 'border-color 0.25s, background 0.25s, box-shadow 0.25s',
                  }}
                />
                <button
                  type="button"
                  className="pwd-toggle"
                  style={{ [isRTL ? 'left' : 'right']: '14px', right: isRTL ? 'auto' : '14px', left: isRTL ? '14px' : 'auto' }}
                  onClick={() => setShowPassword(!showPassword)}
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>

            {/* Submit button */}
            <button
              id="login-submit-btn"
              type="submit"
              className="login-btn"
              disabled={isLoading || !userId.trim() || !password.trim()}
              style={{ marginTop: '0.5rem' }}
            >
              {isLoading ? (
                <>
                  <span className="spinner" />
                  {isRTL ? 'جارٍ الدخول...' : 'Signing in...'}
                </>
              ) : (
                isRTL ? 'تسجيل الدخول' : 'Sign In'
              )}
            </button>
          </form>

          {/* Footer note */}
          <div style={{
            marginTop: '1.8rem',
            paddingTop: '1.5rem',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            textAlign: 'center',
          }}>
            <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.78rem', margin: 0 }}>
              {isRTL
                ? 'للطلاب وأعضاء هيئة التدريس والإداريين فقط'
                : 'For students, faculty, and administrators only'}
            </p>
          </div>

          {/* Bottom accent corner dots */}
          <div style={{ position: 'absolute', bottom: '18px', right: '22px', display: 'flex', gap: '5px', opacity: 0.25 }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#a1172c', opacity: 1 - i * 0.25 }} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default StudentPortal;
