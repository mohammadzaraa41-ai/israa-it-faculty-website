import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, PlayCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import heroBg from '../assets/WhatsApp Image 2026-04-20 at 10.29.04 PM.jpeg';
import logoUrl from '../assets/WhatsApp Image 2026-04-20 at 10.05.30 PM.jpeg';
import './Home.css';

const Home = () => {
  const { t, lang } = useLocale();
  const { toggleLogin } = useAuth();

  return (
    <div className="home-container">
      <section className="hero-section">
        <div className="hero-content-wrapper">
          <motion.img 
            src={logoUrl} 
            alt="Israa IT Faculty" 
            className="hero-logo-large clickable-logo"
            onClick={() => toggleLogin(true)}
            initial={{ opacity: 0, scale: 0.5, y: -50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.5 }}
          />

          <div className="hero-bottom-content">
            {/* Main actions have been moved to the sidebar */}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
