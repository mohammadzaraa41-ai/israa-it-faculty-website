import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Stars, Float } from '@react-three/drei';
import { useLocale } from '../contexts/LocalizationContext';

const CourseNode = ({ position, label, color, delay }) => {
  const mesh = useRef();
  const [hovered, setHover] = useState(false);
  
  useFrame((state) => {
    mesh.current.rotation.x = state.clock.elapsedTime * 0.5 + delay;
    mesh.current.rotation.y = state.clock.elapsedTime * 0.5 + delay;
  });

  return (
    <Float speed={2} rotationIntensity={1} floatIntensity={2}>
      <group position={position}>
        <mesh
          ref={mesh}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          <icosahedronGeometry args={[1, 0]} />
          <meshStandardMaterial 
            color={hovered ? '#f4b41a' : color} 
            wireframe={true} 
            emissive={hovered ? '#f4b41a' : color}
            emissiveIntensity={hovered ? 2 : 0.5}
          />
        </mesh>
        <Text position={[0, -1.8, 0]} fontSize={0.4} color="white" anchorX="center" anchorY="middle">
          {label}
        </Text>
      </group>
    </Float>
  );
};

const ThreeDRoadmap = () => {
  const { lang, t } = useLocale();

  return (
    <div style={{ padding: '2rem', maxWidth: '1280px', margin: '0 auto', height: 'calc(100vh - 120px)' }}>
      <h1 className="title" style={{ textAlign: 'center', marginBottom: '0.5rem' }}>
        {t('nav.roadmap')}
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--text-secondary)', margin: '0 0 2rem 0' }}>
        {lang === 'ar' ? 'قم بتدوير الشاشة لاستكشاف ترابط المواد' : 'Rotate to explore course prerequisites'}
      </p>
      
      <div className="glass-panel" style={{ width: '100%', height: '80%', borderRadius: '24px', overflow: 'hidden' }}>
        <Canvas camera={{ position: [0, 0, 15] }}>
          <color attach="background" args={['#040812']} />
          <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
          <ambientLight intensity={0.2} />
          <pointLight position={[10, 10, 10]} intensity={1.5} color="#dcb324" />
          <pointLight position={[-10, -10, -10]} intensity={1} color="#0c2340" />
          
          <CourseNode position={[-5, 3, 0]} label="Programming 1" color="#1a365d" delay={0} />
          <CourseNode position={[0, 3, -2]} label="Programming 2" color="#1a365d" delay={1} />
          <CourseNode position={[5, 3, 0]} label="Data Structures" color="#1a365d" delay={2} />
          
          <CourseNode position={[-3, -2, 4]} label="Math 101" color="#dcb324" delay={0.5} />
          <CourseNode position={[3, -2, 2]} label="Physics" color="#dcb324" delay={1.5} />
          
          <OrbitControls enableZoom={true} autoRotate autoRotateSpeed={0.5} />
        </Canvas>
      </div>
    </div>
  );
};

export default ThreeDRoadmap;
