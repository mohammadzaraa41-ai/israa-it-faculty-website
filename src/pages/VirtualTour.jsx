import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Box, 
  Cpu, 
  Globe, 
  Lock, 
  Terminal, 
  Layers, 
  Activity,
  ChevronLeft,
  Search,
  Code
} from 'lucide-react';
import { useLocale } from '../contexts/LocalizationContext';

const VirtualTour = () => {
  const { lang } = useLocale();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  const handleMouseMove = (e) => {
    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setMousePos({
        x: (e.clientX - rect.left - rect.width / 2) / 25,
        y: (e.clientY - rect.top - rect.height / 2) / 25,
      });
    }
  };

  const FloatingNode = ({ icon: Icon, delay, initialPos }) => (
    <motion.div
      initial={initialPos}
      animate={{
        y: [initialPos.y - 20, initialPos.y + 20, initialPos.y - 20],
        x: [initialPos.x - 10, initialPos.x + 10, initialPos.x - 10],
      }}
      transition={{
        duration: 5 + Math.random() * 5,
        repeat: Infinity,
        ease: "easeInOut",
        delay: delay
      }}
      style={{
        position: 'absolute',
        padding: '1rem',
        background: 'rgba(0, 243, 255, 0.05)',
        border: '1px solid rgba(0, 243, 255, 0.2)',
        borderRadius: '16px',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 0 20px rgba(0, 243, 255, 0.1)',
        zIndex: 2
      }}
    >
      <Icon size={24} color="var(--accent-color)" />
    </motion.div>
  );

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      style={{ 
        minHeight: '100vh', 
        background: '#050505', 
        color: '#fff', 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Inter, sans-serif'
      }}
    >
      {/* Background Coding Lines */}
      <div style={{ position: 'absolute', inset: 0, opacity: 0.1, zIndex: 0 }}>
        {[...Array(20)].map((_, i) => (
          <div 
            key={i}
            style={{
              position: 'absolute',
              top: `${i * 5}%`,
              left: 0,
              right: 0,
              height: '1px',
              background: 'linear-gradient(90deg, transparent, var(--accent-color), transparent)',
              animation: `slideLeft ${10 + i}s linear infinite`
            }}
          />
        ))}
      </div>

      {/* Floating Elements with Parallax */}
      <div style={{ 
        position: 'relative', 
        zIndex: 1, 
        transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
        transition: 'transform 0.1s ease-out'
      }}>
        
        {/* Central Glowing Core */}
        <motion.div
          animate={{ 
            scale: [1, 1.1, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          style={{
            width: '300px',
            height: '300px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(0,243,255,0.2) 0%, transparent 70%)',
            border: '2px dashed rgba(0,243,255,0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative'
          }}
        >
          <div style={{
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(0,0,0,0.8)',
            border: '1px solid var(--accent-color)',
            boxShadow: '0 0 50px rgba(0,243,255,0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Globe size={60} color="var(--accent-color)" />
          </div>
        </motion.div>

        {/* Nodes around the core */}
        <FloatingNode icon={Terminal} initialPos={{ x: -200, y: -100 }} delay={0} />
        <FloatingNode icon={Cpu} initialPos={{ x: 200, y: -150 }} delay={1} />
        <FloatingNode icon={Layers} initialPos={{ x: -180, y: 150 }} delay={2} />
        <FloatingNode icon={Activity} initialPos={{ x: 220, y: 100 }} delay={1.5} />
        <FloatingNode icon={Lock} initialPos={{ x: 0, y: -250 }} delay={0.5} />
      </div>

      {/* Hero Text Content */}
      <div style={{ 
        position: 'absolute', 
        zIndex: 10, 
        textAlign: 'center',
        padding: '0 2rem'
      }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <div style={{ 
            display: 'inline-flex', 
            alignItems: 'center', 
            gap: '0.8rem', 
            background: 'rgba(0, 243, 255, 0.1)',
            padding: '0.5rem 1.5rem',
            borderRadius: '50px',
            border: '1px solid var(--accent-color)',
            marginBottom: '2rem'
          }}>
            <Code size={18} color="var(--accent-color)" />
            <span style={{ fontSize: '0.9rem', letterSpacing: '2px', color: 'var(--accent-color)', fontWeight: 'bold' }}>
              {lang === 'ar' ? 'نظام المحاكاة قيد التطوير' : 'SYSTEM SIMULATION ACTIVE'}
            </span>
          </div>

          <h1 style={{ 
            fontSize: 'clamp(2.5rem, 8vw, 5rem)', 
            fontWeight: '900', 
            marginBottom: '1.5rem',
            lineHeight: '0.9',
            textTransform: 'uppercase',
            letterSpacing: '-2px'
          }}>
            {lang === 'ar' ? 'الجولة' : 'Virtual'}<br />
            <span style={{ color: 'transparent', WebkitTextStroke: '1px var(--accent-color)' }}>
              {lang === 'ar' ? 'الافتراضية' : 'Experience'}
            </span>
          </h1>

          <p style={{ 
            maxWidth: '600px', 
            margin: '0 auto', 
            fontSize: '1.2rem', 
            color: 'rgba(255,255,255,0.6)',
            lineHeight: '1.6'
          }}>
            {lang === 'ar' 
              ? 'نحن الآن نقوم بمعالجة البيانات المكانية لبناء تجربة 360 درجة فريدة لكلية تكنولوجيا المعلومات. ابقوا على اطلاع.' 
              : 'We are currently processing spatial data to build a unique 360-degree experience for the Faculty of IT. Stay tuned.'}
          </p>

          <div style={{ marginTop: '3rem', display: 'flex', gap: '1.5rem', justifyContent: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--accent-color)', borderRadius: '50%', boxShadow: '0 0 10px var(--accent-color)' }} />
              <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{lang === 'ar' ? 'معالجة الصور' : 'IMAGE PROCESSING'}</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ width: '8px', height: '8px', background: '#333', borderRadius: '50%' }} />
              <span style={{ fontSize: '0.8rem', opacity: 0.6 }}>{lang === 'ar' ? 'ربط النقاط' : 'HOTSPOT MAPPING'}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Global CSS for Animations */}
      <style>{`
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(-100%); }
        }
        .title-stroke {
          -webkit-text-stroke: 1px var(--accent-color);
          color: transparent;
        }
      `}</style>
    </div>
  );
};

export default VirtualTour;
