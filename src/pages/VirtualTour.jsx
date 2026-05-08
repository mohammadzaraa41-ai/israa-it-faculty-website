import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Terminal, 
  Cpu, 
  Database, 
  ShieldAlert, 
  Zap, 
  Maximize,
  Box,
  Binary
} from 'lucide-react';
import { useLocale } from '../contexts/LocalizationContext';

const VirtualTour = () => {
  const { lang } = useLocale();
  const canvasRef = useRef(null);
  const [logs, setLogs] = useState([]);
  const [progress, setProgress] = useState(0);

  // Simulation Logs
  const logMessages = [
    "> INITIALIZING SPATIAL RECONSTRUCTION...",
    "> CONNECTING TO NEURAL MAPPING ENGINE...",
    "> DOWNLOADING TERRAIN MESH DATA...",
    "> RESOLVING EQUIRECTANGULAR PROJECTION...",
    "> OPTIMIZING GPU SHADERS...",
    "> SYNCHRONIZING REAL-TIME LIGHTING...",
    "> GENERATING HOTSPOT MAPPING NODES...",
    "> CALIBRATING 360 FIELD OF VIEW...",
    "> RENDERING FACULTY MAIN HALL...",
    "> SECURITY PROTOCOLS: ACTIVE",
    "> LOADING ASSETS: 84% COMPLETE"
  ];

  useEffect(() => {
    let currentLog = 0;
    const interval = setInterval(() => {
      if (currentLog < logMessages.length) {
        setLogs(prev => [...prev.slice(-8), logMessages[currentLog]]);
        currentLog++;
      } else {
        currentLog = 0;
        setLogs([]);
      }
    }, 2000);

    const progressInterval = setInterval(() => {
      setProgress(prev => (prev < 100 ? prev + 1 : 0));
    }, 100);

    return () => {
      clearInterval(interval);
      clearInterval(progressInterval);
    };
  }, []);

  // Neural Network Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let particles = [];
    const particleCount = 100;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 1.5;
        this.vy = (Math.random() - 0.5) * 1.5;
        this.size = Math.random() * 2 + 1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.fillStyle = 'rgba(0, 243, 255, 0.5)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    const init = () => {
      resize();
      particles = [];
      for (let i = 0; i < particleCount; i++) particles.push(new Particle());
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach((p, i) => {
        p.update();
        p.draw();

        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 150) {
            ctx.strokeStyle = `rgba(0, 243, 255, ${1 - dist / 150})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    window.addEventListener('resize', resize);
    init();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div style={{ 
      position: 'relative', 
      width: '100vw', 
      height: '100vh', 
      background: '#020202', 
      color: '#00f3ff', 
      overflow: 'hidden',
      fontFamily: '"Share Tech Mono", monospace'
    }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, zIndex: 0 }} />

      {/* Futuristic Grid Overlay */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(rgba(0,243,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.03) 1px, transparent 1px)',
        backgroundSize: '40px 40px',
        zIndex: 1
      }} />

      {/* Main Content Interface */}
      <div style={{ position: 'relative', zIndex: 10, height: '100%', padding: '2rem', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header HUD */}
        <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(0,243,255,0.2)', paddingBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <Zap size={24} className="pulse" />
            <div>
              <div style={{ fontSize: '1.2rem', fontWeight: 'bold', letterSpacing: '2px' }}>ISRAA-IT-NODE_01</div>
              <div style={{ fontSize: '0.7rem', opacity: 0.7 }}>STATUS: INITIALIZING_SIMULATION</div>
            </div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', opacity: 0.6 }}>COORD: 31.42°N, 34.42°E</div>
            <div style={{ fontSize: '0.8rem', color: '#ff0055' }}>VULNERABILITY_CHECK: 0 ERRORS</div>
          </div>
        </div>

        {/* Centerpiece Visualization */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
            style={{ position: 'relative' }}
          >
            {/* The "Building" Wireframe Core */}
            <div className="wireframe-sphere">
               <Box size={180} strokeWidth={0.5} style={{ opacity: 0.5 }} />
            </div>
            
            {/* Orbiting Elements */}
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
              style={{ position: 'absolute', inset: -50, border: '1px solid rgba(0,243,255,0.1)', borderRadius: '50%' }}
            />
          </motion.div>

          <div style={{ position: 'absolute', textAlign: 'center' }}>
            <h1 style={{ 
              fontSize: '4rem', 
              fontWeight: 'bold', 
              textTransform: 'uppercase', 
              letterSpacing: '10px',
              textShadow: '0 0 30px rgba(0,243,255,0.5)',
              margin: 0
            }}>
              {lang === 'ar' ? 'الجولة 360' : 'CORE_TOUR'}
            </h1>
            <div style={{ fontSize: '1.2rem', letterSpacing: '5px', marginTop: '1rem', opacity: 0.8 }}>
              {progress}% {lang === 'ar' ? 'جاري بناء العالم الرقمي' : 'BUILDING DIGITAL TWIN'}
            </div>
          </div>
        </div>

        {/* Bottom HUD - Console & Stats */}
        <div style={{ display: 'flex', gap: '2rem', height: '200px' }}>
          {/* Real-time Console */}
          <div style={{ 
            flex: 1, 
            background: 'rgba(0,243,255,0.05)', 
            border: '1px solid rgba(0,243,255,0.2)', 
            padding: '1rem',
            overflow: 'hidden',
            borderRadius: '4px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', fontSize: '0.8rem', color: 'rgba(0,243,255,0.6)' }}>
              <Terminal size={14} /> SYSTEM_LOGS.EXE
            </div>
            {logs.map((log, i) => (
              <div key={i} style={{ fontSize: '0.8rem', marginBottom: '4px', opacity: (i + 1) / logs.length }}>
                {log}
              </div>
            ))}
          </div>

          {/* Stats Panel */}
          <div style={{ width: '300px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
            {[
              { label: 'MEM', val: '4.2GB', icon: Database },
              { label: 'LATENCY', val: '12ms', icon: Cpu },
              { label: 'NODES', val: '842', icon: Binary },
              { label: 'UPLINK', val: 'GigaBit', icon: Maximize }
            ].map((stat, i) => (
              <div key={i} style={{ background: 'rgba(0,243,255,0.05)', border: '1px solid rgba(0,243,255,0.2)', padding: '0.8rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <stat.icon size={16} style={{ marginBottom: '0.3rem', opacity: 0.6 }} />
                <div style={{ fontSize: '0.6rem', opacity: 0.5 }}>{stat.label}</div>
                <div style={{ fontSize: '1rem', fontWeight: 'bold' }}>{stat.val}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Loading Progress Bar */}
        <div style={{ marginTop: '2rem', height: '4px', background: 'rgba(255,255,255,0.05)', borderRadius: '2px', position: 'relative' }}>
          <motion.div 
            style={{ height: '100%', background: 'var(--accent-color)', boxShadow: '0 0 15px var(--accent-color)' }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Global Animations Style */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');
        
        .pulse {
          animation: pulse 2s infinite;
        }
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.1); opacity: 0.7; }
          100% { transform: scale(1); opacity: 1; }
        }
        .wireframe-sphere {
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );
};

export default VirtualTour;
