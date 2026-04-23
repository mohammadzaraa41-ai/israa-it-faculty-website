import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { motion } from 'framer-motion';
import { Monitor, Cpu, ShieldCheck, Database, GraduationCap, ClipboardCheck, UserCheck, Rocket, ArrowRight, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Prospective.css';

const Prospective = () => {
  const { t, lang } = useLocale();
  const { toggleLogin } = useAuth();
  const isRtl = lang === 'ar';

  const pillars = [
    {
      id: 'cs',
      name: lang === 'ar' ? 'علم الحاسوب' : 'Computer Science',
      desc: lang === 'ar' ? 'رحلتك لابتكار المستقبل تبدأ من فهم أسس البرمجة والخوارزميات والذكاء الاصطناعي.' : 'Your journey to innovate the future starts with understanding programming and AI.',
      icon: <Monitor size={32} />,
      jobs: lang === 'ar' ? ['مطور تطبيقات', 'مهندس AI', 'باحث خوارزميات'] : ['App Developer', 'AI Engineer', 'Researcher']
    },
    {
      id: 'se',
      name: lang === 'ar' ? 'هندسة البرمجيات' : 'Software Engineering',
      desc: lang === 'ar' ? 'تعلم كيف تصمم وتبني أنظمة برمجية ضخمة ومعقدة بجودة عالية وكفاءة عالمية.' : 'Learn how to design and build large-scale software systems with global efficiency.',
      icon: <Cpu size={32} />,
      jobs: lang === 'ar' ? ['مدير مشاريع', 'مهندس نظم', 'مطور DevOps'] : ['Project Manager', 'Systems Architect', 'DevOps']
    },
    {
      id: 'cyber',
      name: lang === 'ar' ? 'الأمن السيبراني' : 'Cyber Security',
      desc: lang === 'ar' ? 'كن حائط الصد الأول ضد التهديدات الرقمية وحافظ على أمن البيانات والخصوصية.' : 'Be the first line of defense against digital threats and protect data privacy.',
      icon: <ShieldCheck size={32} />,
      jobs: lang === 'ar' ? ['محلل أمني', 'محقق جنائي', 'مخترق أخلاقي'] : ['Security Analyst', 'Forensics', 'Ethical Hacker']
    },
    {
      id: 'is',
      name: lang === 'ar' ? 'نظم المعلومات' : 'Information Systems',
      desc: lang === 'ar' ? 'الجسر الذكي بين تكنولوجيا المعلومات وإدارة الأعمال لتحقيق كفاءة مؤسسية قصوى.' : 'The smart bridge between IT and business management for maximum efficiency.',
      icon: <Database size={32} />,
      jobs: lang === 'ar' ? ['محلل نظم', 'إداري قواعد بيانات', 'مستشار تقني'] : ['Systems Analyst', 'DB Admin', 'IT Consultant']
    }
  ];

  const steps = [
    {
      num: '01',
      title: lang === 'ar' ? 'تقديم الطلب' : 'Apply',
      desc: lang === 'ar' ? 'عبئ نموذج التسجيل الإلكتروني' : 'Fill out the online form',
      icon: <ClipboardCheck size={24} />
    },
    {
      num: '02',
      title: lang === 'ar' ? 'مقابلة القبول' : 'Interview',
      desc: lang === 'ar' ? 'تعرف علينا ونتعرف على طموحك' : 'Let us meet and see your ambition',
      icon: <UserCheck size={24} />
    },
    {
      num: '03',
      title: lang === 'ar' ? 'استلام القبول' : 'Admission',
      desc: lang === 'ar' ? 'مبروك! أنت الآن جزء من عائلتنا' : 'Congrats! You are part of the family',
      icon: <GraduationCap size={24} />
    },
    {
      num: '04',
      title: lang === 'ar' ? 'البداية' : 'The Start',
      desc: lang === 'ar' ? 'انطلق في أول يوم دراسي لك' : 'Blast off on your first day',
      icon: <Rocket size={24} />
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="prospective-container">
      {/* Hero Section */}
      <motion.div 
        className="prospective-hero"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="prospective-title">{t('nav.prospective')}</h1>
        <p className="prospective-subtitle">
          {lang === 'ar' 
            ? 'انضم إلى جيل جديد من رواد التكنولوجيا والمبتكرين. مستقبلك يبدأ هنا في أرقى كليات تكنولوجيا المعلومات.' 
            : 'Join a new generation of tech pioneers. Your future starts here in the most prestigious IT faculty.'}
        </p>
      </motion.div>

      {/* Pillars Section */}
      <motion.div 
        className="pillars-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {pillars.map((pillar) => (
          <motion.div key={pillar.id} className="pillar-card" variants={itemVariants}>
            <div className="pillar-icon-box">{pillar.icon}</div>
            <h3 className="pillar-name">{pillar.name}</h3>
            <p className="pillar-desc">{pillar.desc}</p>
            <div className="pillar-jobs">
              {pillar.jobs.map((job, i) => (
                <span key={i} className="job-tag">{job}</span>
              ))}
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Steps Section */}
      <div className="steps-section">
        <h2 className="section-title">
          {lang === 'ar' ? 'رحلة الالتحاق بالكلية' : 'College Enrollment Journey'}
        </h2>
        <motion.div 
          className="steps-timeline"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {steps.map((step) => (
            <motion.div key={step.num} className="step-item" variants={itemVariants}>
              <div className="step-number">{step.num}</div>
              <h4 className="step-title">{step.title}</h4>
              <p className="step-desc">{step.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Final CTA */}
      <motion.div 
        className="prospective-cta"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="cta-title">
          {lang === 'ar' ? 'هل أنت مستعد لتكون جزءاً من المستقبل؟' : 'Ready to be part of the future?'}
        </h2>
        <button className="cta-btn" onClick={() => toggleLogin(true)}>
          {lang === 'ar' ? 'قدم طلب الالتحاق الآن' : 'Submit Admission Application'}
          {isRtl ? <ArrowLeft size={24} /> : <ArrowRight size={24} />}
        </button>
      </motion.div>
    </div>
  );
};

export default Prospective;
