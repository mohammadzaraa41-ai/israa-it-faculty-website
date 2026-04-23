import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Code2, Palette, Network, Cpu, ShieldAlert, Lock, Database, BrainCircuit, ArrowRight, Sparkles } from 'lucide-react';
import { useLocale } from '../contexts/LocalizationContext';
import { curriculumData } from '../constants/curriculum';
import './MajorsShowcase.css';

const IconMap = {
  Code2,
  Palette,
  Network,
  Cpu,
  ShieldAlert,
  Lock,
  Database,
  BrainCircuit
};

const MajorsShowcase = ({ isOpen, onClose }) => {
  const { lang, t } = useLocale();
  const majors = curriculumData[lang].specializations;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', damping: 15, stiffness: 100 }
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="showcase-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="showcase-container glass-panel"
            initial={{ scale: 0.9, opacity: 0, y: 40 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 40 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
          >
            <button className="showcase-close" onClick={onClose}>
              <X size={32} />
            </button>

            <header className="showcase-header">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <h2 className="showcase-title">
                  <Sparkles className="accent-color" size={24} />
                  {lang === 'ar' ? 'اكتشف تخصصات المستقبل' : 'Discover Future Majors'}
                </h2>
                <p className="showcase-subtitle">
                  {lang === 'ar' 
                    ? 'اختر مسارك المهني في أرقى كليات التكنولوجيا' 
                    : 'Choose your career path in the most prestigious tech faculty'}
                </p>
              </motion.div>
            </header>

            <motion.div 
              className="majors-grid"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {majors.map((major) => {
                const IconComponent = IconMap[major.icon] || Code2;
                return (
                  <motion.div 
                    key={major.id} 
                    className={`major-card ${major.parentId ? 'sub-branch' : ''}`}
                    variants={itemVariants}
                    whileHover={{ 
                      y: -10, 
                      scale: 1.02,
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)' 
                    }}
                  >
                    <div className="major-card-content">
                      <div className="major-icon-wrapper">
                        <IconComponent size={32} />
                      </div>
                      
                      {major.parentId === 'cs' && (
                        <div className="major-branch-tag">
                          {lang === 'ar' ? 'فرع علم الحاسوب' : 'CS Branch'}
                        </div>
                      )}

                      <h3 className="major-name">{major.name}</h3>

                      <p className="major-description">{major.description}</p>
                      <div className="major-footer">
                        <span className="learn-more">
                          {lang === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                          <ArrowRight size={16} />
                        </span>
                      </div>
                    </div>
                    <div className="major-card-bg" />
                  </motion.div>
                );
              })}
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MajorsShowcase;
