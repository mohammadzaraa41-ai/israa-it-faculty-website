import React from 'react';
import { motion } from 'framer-motion';
import { 
  Compass, 
  Map, 
  Layers, 
  Loader2, 
  Camera,
  Layout,
  CheckCircle2
} from 'lucide-react';
import { useLocale } from '../contexts/LocalizationContext';

const VirtualTour = () => {
  const { lang } = useLocale();

  const steps = [
    { 
      id: 1, 
      label_ar: 'تصوير الموقع 360°', 
      label_en: '360° Site Photography', 
      status: 'completed',
      icon: Camera 
    },
    { 
      id: 2, 
      label_ar: 'المعالجة وربط البيانات', 
      label_en: 'Processing & Stitching', 
      status: 'active',
      icon: Layers 
    },
    { 
      id: 3, 
      label_ar: 'الإطلاق الرسمي', 
      label_en: 'Official Launch', 
      status: 'pending',
      icon: Layout 
    }
  ];

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-primary)', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      padding: '2rem',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Subtle Background Decoration */}
      <div style={{ 
        position: 'absolute', 
        width: '600px', 
        height: '600px', 
        background: 'radial-gradient(circle, var(--accent-color-transparent) 0%, transparent 70%)',
        top: '-10%',
        right: '-10%',
        opacity: 0.3,
        zIndex: 0
      }} />

      <div className="glass-panel" style={{ 
        maxWidth: '900px', 
        width: '100%', 
        padding: '4rem 2rem', 
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        borderRadius: '32px',
        border: '1px solid var(--border-color)'
      }}>
        
        {/* Animated Icon Header */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{ 
            width: '120px', 
            height: '120px', 
            margin: '0 auto 2rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--bg-secondary)',
            borderRadius: '50%',
            border: '2px solid var(--accent-color)',
            boxShadow: '0 0 30px var(--accent-color-transparent)'
          }}
        >
          <Compass size={60} color="var(--accent-color)" />
        </motion.div>

        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
          {lang === 'ar' ? 'الجولة الافتراضية 360°' : '360° Virtual Tour'}
        </h1>
        
        <p style={{ 
          color: 'var(--text-secondary)', 
          fontSize: '1.2rem', 
          maxWidth: '600px', 
          margin: '0 auto 4rem',
          lineHeight: '1.8'
        }}>
          {lang === 'ar' 
            ? 'نحن نعمل حالياً على تحويل مباني ومختبرات الكلية إلى تجربة رقمية تفاعلية بالكامل. هذه الميزة ستكون متاحة قريباً لتمكنكم من زيارة الكلية من أي مكان.' 
            : 'We are currently transforming our college buildings and labs into a fully interactive digital experience. This feature will be available soon to allow you to visit the faculty from anywhere.'}
        </p>

        {/* Realistic Progress Timeline */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', 
          gap: '2rem',
          textAlign: 'start'
        }}>
          {steps.map((step) => (
            <div 
              key={step.id} 
              style={{ 
                padding: '2rem',
                background: step.status === 'active' ? 'rgba(0, 243, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
                borderRadius: '24px',
                border: step.status === 'active' ? '1px solid var(--accent-color)' : '1px solid var(--border-color)',
                position: 'relative'
              }}
            >
              <div style={{ 
                width: '40px', 
                height: '40px', 
                borderRadius: '12px', 
                background: 'var(--bg-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.5rem'
              }}>
                <step.icon size={20} color={step.status === 'pending' ? 'var(--text-secondary)' : 'var(--accent-color)'} />
              </div>

              <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                {lang === 'ar' ? step.label_ar : step.label_en}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {step.status === 'active' ? (
                  <>
                    <Loader2 size={14} className="spin" color="var(--accent-color)" />
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-color)' }}>
                      {lang === 'ar' ? 'جاري العمل...' : 'In Progress...'}
                    </span>
                  </>
                ) : step.status === 'completed' ? (
                  <>
                    <CheckCircle2 size={14} color="#4CAF50" />
                    <span style={{ fontSize: '0.8rem', color: '#4CAF50' }}>
                      {lang === 'ar' ? 'مكتمل' : 'Completed'}
                    </span>
                  </>
                ) : (
                  <span style={{ fontSize: '0.8rem', opacity: 0.5 }}>
                    {lang === 'ar' ? 'قريباً' : 'Waiting'}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Footer Info */}
        <div style={{ marginTop: '4rem', opacity: 0.5, fontSize: '0.9rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            <Map size={16} />
            <span>{lang === 'ar' ? 'مركز تكنولوجيا المعلومات - وحدة التحول الرقمي' : 'IT Center - Digital Transformation Unit'}</span>
          </div>
        </div>

      </div>

      <style>{`
        .spin {
          animation: spin 2s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default VirtualTour;
