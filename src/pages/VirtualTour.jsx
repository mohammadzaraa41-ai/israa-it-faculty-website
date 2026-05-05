import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Sphere } from '@react-three/drei';

const VirtualTour = () => {
  const { lang, t } = useLocale();

  return (
    <div style={{ padding: '2rem', maxWidth: '1280px', margin: '0 auto', height: 'calc(100vh - 120px)' }}>
      <h1 className="title" style={{ textAlign: 'center', marginBottom: '1rem' }}>
        {t('nav.virtual_tour')}
      </h1>
      
      <div className="glass-panel" style={{ width: '100%', height: '80%', borderRadius: '24px', overflow: 'hidden', position: 'relative' }}>
        <div style={{ position: 'absolute', top: '20px', left: '20px', zIndex: 10, background: 'rgba(0,0,0,0.5)', padding: '1rem', borderRadius: '12px', color: 'white' }}>
            {lang === 'ar' ? 'مختبر سيسكو للشبكات المتقدمة' : 'Advanced Cisco Networks Lab'}
        </div>
        <Canvas camera={{ position: [0, 0, 0.1] }}>
          <ambientLight intensity={0.5} />
          <Sphere args={[500, 60, 40]}>
            <meshBasicMaterial color="#0c2340" side={2} wireframe />
          </Sphere>
          <OrbitControls enableZoom={false} autoRotate autoRotateSpeed={-0.5} target={[0,0,0]} />
        </Canvas>
      </div>
    </div>
  );
};

export default VirtualTour;
