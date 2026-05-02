import React, { useRef, useState, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Stars, Float, Line, PerspectiveCamera, Sparkles } from '@react-three/drei';
import { useLocale } from '../contexts/LocalizationContext';
import { majorRoadmaps } from '../data/roadmapData';
import * as THREE from 'three';

const CourseNode = ({ position, label, color, delay, isActive, onClick }) => {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  
  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.x = state.clock.elapsedTime * 0.3 + delay;
      mesh.current.rotation.y = state.clock.elapsedTime * 0.3 + delay;
    }
  });

  return (
    <Float speed={3} rotationIntensity={0.5} floatIntensity={1.5}>
      <group position={position} onClick={onClick}>
        <mesh
          ref={mesh}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          <icosahedronGeometry args={[0.8, 0]} />
          <meshStandardMaterial 
            color={isActive || hovered ? '#f4b41a' : color} 
            wireframe={true} 
            emissive={isActive || hovered ? '#f4b41a' : color}
            emissiveIntensity={isActive || hovered ? 2 : 0.8}
          />
        </mesh>
        
        {/* Inner core glow */}
        <mesh>
          <sphereGeometry args={[0.3, 16, 16]} />
          <meshBasicMaterial color={color} transparent opacity={0.6} />
        </mesh>

        <Text 
          position={[0, -1.3, 0]} 
          fontSize={0.28} 
          color="white" 
          anchorX="center" 
          anchorY="middle"
          maxWidth={2.5}
          textAlign="center"
        >
          {label}
        </Text>
      </group>
    </Float>
  );
};

const Connection = ({ start, end, color }) => {
  const lineRef = useRef();
  const points = useMemo(() => [new THREE.Vector3(...start), new THREE.Vector3(...end)], [start, end]);
  
  useFrame((state) => {
    if (lineRef.current) {
      lineRef.current.material.dashOffset -= 0.01;
    }
  });

  return (
    <Line
      ref={lineRef}
      points={points}
      color={color}
      lineWidth={1.5}
      dashed
      dashScale={2}
      dashSize={0.5}
      gapSize={0.2}
      transparent
      opacity={0.5}
    />
  );
};

const RoadmapScene = ({ majorKey, lang }) => {
  const major = majorRoadmaps[majorKey];
  const [activeNode, setActiveNode] = useState(null);
  const groupRef = useRef();

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.1) * 0.1;
    }
  });

  const nodePositions = useMemo(() => {
    const positions = {};
    const levelCounts = {};

    major.nodes.forEach(node => {
      const level = node.level;
      if (!levelCounts[level]) levelCounts[level] = 0;
      
      const x = (level - 2) * 7; 
      const y = (levelCounts[level] - 1) * 4.5; 
      const z = Math.sin(level * 2 + levelCounts[level]) * 2.5; 
      
      positions[node.id] = [x, y, z];
      levelCounts[level]++;
    });

    return positions;
  }, [major]);

  return (
    <group ref={groupRef}>
      <Stars radius={100} depth={50} count={7000} factor={4} saturation={0} fade speed={1.5} />
      <Sparkles count={100} scale={20} size={2} speed={0.5} opacity={0.3} color={major.color} />
      <ambientLight intensity={0.6} />
      <pointLight position={[10, 10, 10]} intensity={2} color={major.color} />
      <pointLight position={[-10, -10, -10]} intensity={1.5} color="#ffffff" />
      
      {major.links.map((link, i) => (
        <Connection 
          key={`${majorKey}-link-${i}`} 
          start={nodePositions[link.from]} 
          end={nodePositions[link.to]} 
          color={major.color}
        />
      ))}

      {major.nodes.map((node, i) => (
        <CourseNode 
          key={`${majorKey}-${node.id}`}
          position={nodePositions[node.id]}
          label={node.name[lang]}
          color={major.color}
          delay={i * 0.1}
          isActive={activeNode === node.id}
          onClick={() => setActiveNode(node.id === activeNode ? null : node.id)}
        />
      ))}

      <OrbitControls 
        enableZoom={true} 
        enablePan={true}
        screenSpacePanning={true}
        autoRotate={false} 
        autoRotateSpeed={0.4} 
        enableDamping={true}
        dampingFactor={0.05}
      />
    </group>
  );
};

const ThreeDRoadmap = () => {
  const { lang, t } = useLocale();
  const [selectedMajor, setSelectedMajor] = useState('se');
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  return (
    <div style={{
      padding: isMobile ? '0.75rem' : '1.5rem',
      width: '100%',
      boxSizing: 'border-box',
      height: 'calc(100vh - 75px)',
      display: 'flex',
      flexDirection: 'column',
      gap: isMobile ? '0.75rem' : '1rem'
    }}>
      {/* Header */}
      <header style={{ textAlign: 'center' }}>
        <h1 className="title" style={{ fontSize: isMobile ? '1.6rem' : '2.5rem', marginBottom: '0.5rem' }}>
          {lang === 'ar' ? 'خريطة المواد التفاعلية 3D' : 'Interactive 3D Roadmap'}
        </h1>

        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '0.5rem', marginTop: '0.75rem' }}>
          {Object.entries(majorRoadmaps).map(([key, data]) => (
            <button
              key={key}
              onClick={() => setSelectedMajor(key)}
              style={{
                padding: isMobile ? '0.4rem 0.8rem' : '0.6rem 1.2rem',
                borderRadius: '20px',
                border: 'none',
                background: selectedMajor === key ? data.color : 'rgba(255,255,255,0.05)',
                color: 'white',
                cursor: 'pointer',
                fontWeight: 'bold',
                fontSize: isMobile ? '0.8rem' : '0.95rem',
                transition: 'all 0.3s',
                boxShadow: selectedMajor === key ? `0 0 20px ${data.color}` : 'none',
                transform: selectedMajor === key ? 'scale(1.05)' : 'scale(1)'
              }}
            >
              {data.title[lang]}
            </button>
          ))}
        </div>
      </header>

      {/* Canvas Container — fills remaining height */}
      <div
        className="glass-panel"
        style={{
          flex: 1,
          height: 0,         /* forces flex to control height */
          borderRadius: isMobile ? '16px' : '24px',
          overflow: 'hidden',
          position: 'relative',
          background: '#02040a',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        {/* Instructions overlay */}
        <div style={{
          position: 'absolute',
          top: '0.75rem',
          left: '0.75rem',
          zIndex: 10,
          pointerEvents: 'none'
        }}>
          <h2 style={{
            color: majorRoadmaps[selectedMajor].color,
            margin: 0,
            textShadow: '0 0 15px rgba(0,0,0,0.8)',
            fontSize: isMobile ? '1rem' : '1.8rem'
          }}>
            {majorRoadmaps[selectedMajor].title[lang]}
          </h2>
          {!isMobile && (
            <div style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '2px' }}>
              <span>{lang === 'ar' ? '• سحب يسار: تدوير' : '• Left Click: Rotate'}</span>
              <span>{lang === 'ar' ? '• سحب يمين: تحريك' : '• Right Click: Pan'}</span>
              <span>{lang === 'ar' ? '• عجلة: تكبير' : '• Scroll: Zoom'}</span>
            </div>
          )}
          {isMobile && (
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem', marginTop: '0.3rem' }}>
              <span>{lang === 'ar' ? '• إصبع واحد: تدوير | إصبعين: تكبير' : '• 1 finger: rotate | 2 fingers: zoom'}</span>
            </div>
          )}
        </div>

        {/* Canvas fills entire panel */}
        <div style={{ flex: 1, width: '100%', height: '100%' }}>
          <Suspense fallback={
            <div style={{ color: 'white', textAlign: 'center', paddingTop: '20%', fontSize: '1.2rem' }}>
              Initializing Galaxy...
            </div>
          }>
            <Canvas
              camera={{ position: [0, 5, isMobile ? 40 : 28], fov: isMobile ? 55 : 45 }}
              gl={{ antialias: !isMobile }}
              style={{ width: '100%', height: '100%', display: 'block' }}
            >
              <RoadmapScene majorKey={selectedMajor} lang={lang} />
            </Canvas>
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ThreeDRoadmap;

