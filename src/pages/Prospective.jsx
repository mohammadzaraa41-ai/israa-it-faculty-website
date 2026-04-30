import React, { useState } from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Monitor, Cpu, ShieldCheck, Database, GraduationCap, ClipboardCheck, UserCheck, Rocket, ArrowRight, ArrowLeft, Network, Video, Brain, PenTool, X, Briefcase, Star, TrendingUp, Info, Phone, Calendar, Clock, BookOpen, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../contexts/AdminContext';

import './Prospective.css';

const Prospective = () => {
  const { lang } = useLocale();
  const { } = useAuth();
  const isRtl = lang === 'ar';

  const [regForm, setRegForm] = useState({ 
    name: '', phone: '', studentId: '', dob: '', major: '', year: '', hours: '', password: '', confirmPassword: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [regSuccess, setRegSuccess] = useState(false);
  const [selectedMajor, setSelectedMajor] = useState(null);
  const { submitRegistrationApplication } = useAdmin();

  const handleRegister = (e) => {
    e.preventDefault();
    if (regForm.password !== regForm.confirmPassword) {
      alert(lang === 'ar' ? 'كلمات المرور غير متطابقة' : 'Passwords do not match');
      return;
    }

    submitRegistrationApplication({
      type: 'Student',
      name: regForm.name,
      major: regForm.major,
      email: regForm.studentId + '@israa.edu.jo'
    });
    setRegSuccess(true);
    setRegForm({ name: '', phone: '', studentId: '', dob: '', major: '', year: '', hours: '', password: '', confirmPassword: '' });
    setTimeout(() => setRegSuccess(false), 5000);
  };

  const majors = [
    {
      id: 'cis',
      name: lang === 'ar' ? 'نظم المعلومات الحاسوبية' : 'Computer Information Systems',
      desc: lang === 'ar' ? 'الجسر الذكي بين تكنولوجيا المعلومات وإدارة الأعمال لتحقيق كفاءة مؤسسية قصوى.' : 'The smart bridge between IT and business management for maximum efficiency.',
      icon: <Database size={32} />,
      details: lang === 'ar' ? 'يهدف هذا التخصص إلى تخريج كفاءات قادرة على دمج الحلول التقنية مع استراتيجيات الأعمال والمؤسسات لتحقيق أفضل أداء.' : 'Aims to graduate competencies capable of integrating tech solutions with business strategies.',
      jobs: lang === 'ar' ? ['محلل نظم (Systems Analyst)', 'مطور قواعد بيانات', 'مدير مشاريع تقنية', 'مستشار أنظمة أعمال'] : ['Systems Analyst', 'DB Developer', 'Tech Project Manager'],
      benefits: lang === 'ar' ? ['يجمع بين الإدارة والتكنولوجيا', 'مطلوب بشدة في قطاع الأعمال والبنوك', 'رواتب تنافسية ومسار وظيفي سريع'] : ['Combines Management and IT', 'High demand in business sector'],
      future: lang === 'ar' ? 'التحول الرقمي للشركات، ذكاء الأعمال (Business Intelligence)، وإدارة البيانات الضخمة.' : 'Digital Transformation, Business Intelligence, and Big Data.',
      tips: lang === 'ar' ? 'ركز على فهم دورة حياة تطوير النظم والتحليل المالي الأساسي لتتميز عن غيرك.' : 'Focus on understanding system development life cycle and basic financial analysis.'
    },
    {
      id: 'cs',
      name: lang === 'ar' ? 'علم الحاسوب' : 'Computer Science',
      desc: lang === 'ar' ? 'رحلتك لابتكار المستقبل تبدأ من فهم أسس البرمجة والخوارزميات.' : 'Your journey to innovate the future starts with understanding programming and algorithms.',
      icon: <Monitor size={32} />,
      details: lang === 'ar' ? 'التخصص الأم الذي يمنحك الفهم العميق لكيفية عمل الحواسيب وبناء الخوارزميات وتطوير البرامج المعقدة بكفاءة عالية.' : 'The core major giving you deep understanding of computers, algorithms and complex software.',
      jobs: lang === 'ar' ? ['مطور برمجيات (Software Developer)', 'باحث خوارزميات', 'مهندس أنظمة', 'مطور تطبيقات هواتف ذكية'] : ['Software Developer', 'Algorithms Researcher', 'Systems Engineer'],
      benefits: lang === 'ar' ? ['أساس قوي في البرمجة', 'يفتح لك أبواب كل مجالات التكنولوجيا الأخرى', 'مرونة عالية في العمل عن بعد'] : ['Strong programming foundation', 'Opens all IT fields', 'High remote work flexibility'],
      future: lang === 'ar' ? 'تطوير الذكاء الاصطناعي، الحوسبة الكمية، والبرمجيات فائقة الأداء.' : 'AI Development, Quantum Computing, and high-performance software.',
      tips: lang === 'ar' ? 'التدريب المستمر على حل المشكلات (Problem Solving) هو مفتاح نجاحك وتفوقك في المقابلات الوظيفية.' : 'Continuous training on Problem Solving is key for your success.'
    },
    {
      id: 'sec',
      name: lang === 'ar' ? 'أمن المعلومات والفضاء الالكتروني' : 'Information Security & Cyberspace',
      desc: lang === 'ar' ? 'تعلم كيفية حماية البيانات والأنظمة في الفضاء الرقمي الواسع.' : 'Learn how to protect data and systems in the vast digital space.',
      icon: <ShieldCheck size={32} />,
      details: lang === 'ar' ? 'تخصص يركز على حماية الشبكات، الأنظمة، والبيانات من الهجمات الرقمية، وتأمين البنية التحتية الحساسة للمؤسسات.' : 'Focuses on protecting networks, systems, and data from cyber attacks.',
      jobs: lang === 'ar' ? ['محلل أمن سيبراني', 'مخترق أخلاقي (Ethical Hacker)', 'مدير أمن الشبكات', 'محقق جنائي رقمي'] : ['Cyber Security Analyst', 'Ethical Hacker', 'Network Security Manager'],
      benefits: lang === 'ar' ? ['رواتب مجزية جداً', 'طلب عالٍ في الأسواق العالمية والمحلية', 'طبيعة عمل مليئة بالتحدي والتشويق'] : ['High salaries', 'High global demand', 'Challenging and exciting work'],
      future: lang === 'ar' ? 'الحروب السيبرانية، تأمين إنترنت الأشياء، واستخدام الذكاء الاصطناعي في رصد التهديدات.' : 'Cyber warfare, IoT security, and AI threat detection.',
      tips: lang === 'ar' ? 'ابدأ بتعلم أنظمة لينكس (Linux)، أساسيات الشبكات، وشارك في مسابقات (CTF).' : 'Start learning Linux, networking basics, and participate in CTF competitions.'
    },
    {
      id: 'multi',
      name: lang === 'ar' ? 'الوسائط المتعددة' : 'Multimedia',
      desc: lang === 'ar' ? 'ادمج الإبداع الفني مع التكنولوجيا لإنتاج محتوى رقمي تفاعلي.' : 'Combine artistic creativity with technology to produce interactive digital content.',
      icon: <Video size={32} />,
      details: lang === 'ar' ? 'يجمع بين الفن الرقمي والبرمجة لتصميم الألعاب، الرسوم المتحركة، وتجربة المستخدم (UX/UI) لبناء تطبيقات بصرية مبهرة.' : 'Combines digital art and programming for game design, animation, and UI/UX.',
      jobs: lang === 'ar' ? ['مطور واجهات مستخدم (UI/UX)', 'مصمم ثلاثي الأبعاد (3D Artist)', 'مطور ألعاب', 'منتج محتوى تفاعلي'] : ['UI/UX Developer', '3D Artist', 'Game Developer'],
      benefits: lang === 'ar' ? ['مجال ممتع للمبدعين', 'مطلوب في صناعة الترفيه والإعلانات', 'نتائج عملك مرئية وملموسة فوراً'] : ['Fun for creatives', 'Demanded in entertainment', 'Visible immediate results'],
      future: lang === 'ar' ? 'الواقع الافتراضي (VR)، الواقع المعزز (AR)، وتقنيات الميتافيرس.' : 'VR, AR, and Metaverse technologies.',
      tips: lang === 'ar' ? 'اصنع معرض أعمال (Portfolio) مميز منذ سنتك الأولى وابدأ في تصميم مشاريعك الخاصة.' : 'Create a standout Portfolio from your first year.'
    },
    {
      id: 'net',
      name: lang === 'ar' ? 'أنظمة شبكات حاسوبية' : 'Computer Network Systems',
      desc: lang === 'ar' ? 'صمم وأدر البنية التحتية للشبكات التي تربط العالم ببعضه.' : 'Design and manage the network infrastructure that connects the world.',
      icon: <Network size={32} />,
      details: lang === 'ar' ? 'يركز على ربط الحواسيب والأنظمة ببعضها، وإدارة السيرفرات، وضمان نقل البيانات بسرعة وأمان حول العالم.' : 'Focuses on connecting systems, managing servers, and ensuring secure fast data transfer.',
      jobs: lang === 'ar' ? ['مهندس شبكات', 'مدير بنية تحتية', 'مهندس سحابة (Cloud Engineer)', 'مسؤول خوادم'] : ['Network Engineer', 'Infrastructure Manager', 'Cloud Engineer'],
      benefits: lang === 'ar' ? ['لا غنى عنه في أي شركة أو بنك', 'تطور وظيفي مستقر وواضح', 'أساس قوي للعمل في أمن المعلومات أو السحابة'] : ['Indispensable in any company', 'Stable career path', 'Strong foundation for Cloud/Security'],
      future: lang === 'ar' ? 'إنترنت الأشياء (IoT)، الشبكات المعرفة بالبرمجيات (SDN)، والحوسبة السحابية.' : 'IoT, Software-Defined Networking (SDN), and Cloud Computing.',
      tips: lang === 'ar' ? 'احصل على شهادات احترافية مثل CCNA أثناء دراستك لتعزيز فرصك في السوق.' : 'Get professional certs like CCNA during your studies.'
    },
    {
      id: 'ai',
      name: lang === 'ar' ? 'علم البيانات والذكاء الاصطناعي' : 'Data Science & AI',
      desc: lang === 'ar' ? 'استخرج المعرفة من البيانات وطور أنظمة ذكية تحاكي العقل البشري.' : 'Extract knowledge from data and develop smart systems simulating the human mind.',
      icon: <Brain size={32} />,
      details: lang === 'ar' ? 'تخصص يركز على تدريب النماذج الذكية لتتعلم من البيانات وتتخذ قرارات معقدة، وهو المحرك الأساسي لثورة التكنولوجيا الحالية.' : 'Focuses on training smart models to learn from data and make complex decisions.',
      jobs: lang === 'ar' ? ['عالم بيانات (Data Scientist)', 'مهندس ذكاء اصطناعي', 'محلل بيانات كبرى', 'مهندس تعلم الآلة'] : ['Data Scientist', 'AI Engineer', 'Big Data Analyst', 'Machine Learning Engineer'],
      benefits: lang === 'ar' ? ['تخصص العصر والمستقبل', 'رواتب تعتبر الأعلى في السوق حالياً', 'مجال دائم التطور والابتكار'] : ['Major of the future', 'Highest salaries currently', 'Constantly evolving field'],
      future: lang === 'ar' ? 'أتمتة الوظائف، النماذج اللغوية الضخمة (LLMs)، التعلم العميق والرؤية الحاسوبية.' : 'Job automation, LLMs, Deep Learning, and Computer Vision.',
      tips: lang === 'ar' ? 'اهتم جداً بالرياضيات (الجبر الخطي والإحصاء) وبناء خوارزميات لغة بايثون.' : 'Focus heavily on Math (Linear Algebra/Statistics) and Python.'
    },
    {
      id: 'se',
      name: lang === 'ar' ? 'هندسة البرمجيات' : 'Software Engineering',
      desc: lang === 'ar' ? 'تعلم كيف تصمم وتبني أنظمة برمجية ضخمة ومعقدة بجودة عالية.' : 'Learn how to design and build large-scale software systems with high quality.',
      icon: <Cpu size={32} />,
      details: lang === 'ar' ? 'يعلمك كيفية إدارة المشاريع البرمجية من الفكرة حتى الإطلاق والصيانة، مع التركيز على الجودة، الميزانية، والعمل الجماعي.' : 'Teaches you how to manage software projects from idea to launch and maintenance.',
      jobs: lang === 'ar' ? ['مهندس برمجيات', 'قائد فريق تقني (Tech Lead)', 'مهندس جودة البرمجيات (QA)', 'مدير منتج (Product Manager)'] : ['Software Engineer', 'Tech Lead', 'QA Engineer', 'Product Manager'],
      benefits: lang === 'ar' ? ['مهارات إدارية وهندسية قوية', 'قدرة على بناء أنظمة كاملة قابلة للتوسع', 'فرص كبيرة للعمل كمدير مشاريع'] : ['Strong engineering & management skills', 'Ability to build scalable systems', 'Opportunities as Project Manager'],
      future: lang === 'ar' ? 'الحوسبة السحابية، معمارية الخدمات المصغرة (Microservices)، والبرمجة بمساعدة الذكاء الاصطناعي.' : 'Cloud Computing, Microservices, and AI-assisted programming.',
      tips: lang === 'ar' ? 'العمل الجماعي (Teamwork) واستخدام أنظمة إدارة الأكواد مثل (Git) هما أساس نجاحك.' : 'Teamwork and using code versioning like Git are keys to your success.'
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

      <motion.div 
        className="prospective-hero"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <h1 className="prospective-title">
          {lang === 'ar' ? 'أهلاً بك في كليتك.. مستقبلك يبدأ من هنا!' : 'Welcome to your faculty.. Your future starts here!'}
        </h1>
        <p className="prospective-subtitle">
          {lang === 'ar' 
            ? 'نرحب بالطلاب الجدد في كلية تكنولوجيا المعلومات، المكان الذي نصنع فيه المبتكرين ونزودهم بأحدث التقنيات.' 
            : 'We welcome new students to the IT Faculty, the place where we create innovators equipped with the latest tech.'}
        </p>
      </motion.div>

      <motion.div 
        className="pillars-grid"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
      >
        {majors.map((major) => (
          <motion.div 
            key={major.id} 
            className="pillar-card clickable-major" 
            variants={itemVariants}
            onClick={() => setSelectedMajor(major)}
            style={{ cursor: 'pointer', transition: 'all 0.3s' }}
            whileHover={{ scale: 1.05, boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
          >
            <div className="pillar-icon-box">{major.icon}</div>
            <h3 className="pillar-name" style={{fontSize: '1.2rem'}}>{major.name}</h3>
            <p className="pillar-desc">{major.desc}</p>
            <div style={{ marginTop: '1.5rem', color: 'var(--primary-light)', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {lang === 'ar' ? 'اكتشف المزيد' : 'Discover More'} <ArrowLeft size={16} style={{transform: isRtl ? 'none' : 'rotate(180deg)'}}/>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <AnimatePresence>
        {selectedMajor && (
          <div className="login-modal-overlay" onClick={() => setSelectedMajor(null)} style={{zIndex: 5000}}>
            <motion.div 
              className="glass-panel"
              initial={{ opacity: 0, y: 50, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 50, scale: 0.9 }}
              onClick={e => e.stopPropagation()}
              style={{ width: '95%', maxWidth: '800px', maxHeight: '90vh', overflowY: 'auto', padding: '2.5rem', position: 'relative', textAlign: isRtl ? 'right' : 'left' }}
            >
              <button onClick={() => setSelectedMajor(null)} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <X size={28} />
              </button>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem', color: 'var(--primary-color)' }}>
                {selectedMajor.icon}
                <h2 style={{ fontSize: '2rem', margin: 0 }}>{selectedMajor.name}</h2>
              </div>
              
              <p style={{ fontSize: '1.1rem', lineHeight: '1.8', color: 'var(--text-primary)', marginBottom: '2rem' }}>
                {selectedMajor.details}
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-color)', marginBottom: '1rem' }}><Briefcase size={20}/> {lang === 'ar' ? 'المسميات الوظيفية' : 'Job Titles'}</h4>
                  <ul style={{ paddingInlineStart: '1.5rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                    {selectedMajor.jobs.map((job, idx) => <li key={idx}>{job}</li>)}
                  </ul>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)' }}>
                  <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#f1c40f', marginBottom: '1rem' }}><Star size={20}/> {lang === 'ar' ? 'فوائد التخصص' : 'Major Benefits'}</h4>
                  <ul style={{ paddingInlineStart: '1.5rem', lineHeight: '1.8', color: 'var(--text-secondary)' }}>
                    {selectedMajor.benefits.map((benefit, idx) => <li key={idx}>{benefit}</li>)}
                  </ul>
                </div>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border-color)', marginBottom: '1.5rem' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#3498db', marginBottom: '1rem' }}><TrendingUp size={20}/> {lang === 'ar' ? 'مستقبل التخصص والاتجاه العالمي' : 'Future Trends'}</h4>
                <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)', margin: 0 }}>{selectedMajor.future}</p>
              </div>

              <div style={{ background: 'rgba(161, 23, 44, 0.1)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--primary-color)' }}>
                <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-light)', marginBottom: '1rem' }}><Info size={20}/> {lang === 'ar' ? 'نصيحة ذهبية للطلاب الجدد' : 'Golden Tip for New Students'}</h4>
                <p style={{ lineHeight: '1.8', color: 'var(--text-primary)', fontWeight: 'bold', margin: 0 }}>{selectedMajor.tips}</p>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

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

      <motion.div 
        className="glass-panel"
        style={{ maxWidth: '800px', margin: '4rem auto', padding: '3rem', position: 'relative', zIndex: 10 }}
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
      >
        <h2 className="cta-title" style={{ marginBottom: '1rem', color: 'var(--primary-color)', textAlign: 'center' }}>
          {lang === 'ar' ? 'إنشاء حساب طالب جديد' : 'Create New Student Account'}
        </h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', textAlign: 'center' }}>
          {lang === 'ar' ? 'سجل بياناتك الآن لتبدأ رحلتك الأكاديمية معنا.' : 'Register your details now to start your academic journey with us.'}
        </p>

        {regSuccess && (
          <div style={{ background: '#2ecc71', color: 'white', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem', textAlign: 'center' }}>
            {lang === 'ar' ? 'تم تسجيل الحساب بنجاح! سيتم مراجعة طلبك.' : 'Account registered successfully! Your application will be reviewed.'}
          </div>
        )}

        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-grid">
            <div className="input-group full-width">
              <label><UserCheck size={18} /> {lang === 'ar' ? 'الاسم الكامل (من 3 مقاطع)' : 'Full Name (3 segments)'}</label>
              <input 
                required type="text" placeholder={lang === 'ar' ? 'مثال: أحمد محمد علي' : 'e.g. Ahmed Mohamed Ali'} 
                value={regForm.name} onChange={e => setRegForm({...regForm, name: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label><Phone size={18} /> {lang === 'ar' ? 'رقم الهاتف' : 'Phone Number'}</label>
              <input 
                required type="tel" placeholder="07XXXXXXXX" 
                value={regForm.phone} onChange={e => setRegForm({...regForm, phone: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label><GraduationCap size={18} /> {lang === 'ar' ? 'الرقم الجامعي' : 'University ID'}</label>
              <input 
                required type="text" placeholder="20XXXXXXXX" 
                value={regForm.studentId} onChange={e => setRegForm({...regForm, studentId: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label><Calendar size={18} /> {lang === 'ar' ? 'تاريخ الميلاد' : 'Date of Birth'}</label>
              <input 
                required type="date" 
                value={regForm.dob} onChange={e => setRegForm({...regForm, dob: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label><BookOpen size={18} /> {lang === 'ar' ? 'التخصص' : 'Major'}</label>
              <select 
                required className="custom-select"
                value={regForm.major} onChange={e => setRegForm({...regForm, major: e.target.value})}
              >
                <option value="">{lang === 'ar' ? 'اختر التخصص' : 'Select Major'}</option>
                <optgroup label={lang === 'ar' ? 'علم الحاسوب وفروعه' : 'Computer Science Branches'}>
                  <option value="cs">{lang === 'ar' ? 'علم حاسوب (عام)' : 'Computer Science (General)'}</option>
                  <option value="cs_net">{lang === 'ar' ? 'علم حاسوب - فرع الشبكات' : 'CS - Networking Branch'}</option>
                  <option value="cs_multi">{lang === 'ar' ? 'علم حاسوب - فرع الوسائط' : 'CS - Multimedia Branch'}</option>
                </optgroup>
                <option value="se">{lang === 'ar' ? 'هندسة برمجيات' : 'Software Engineering'}</option>
                <option value="sec">{lang === 'ar' ? 'أمن المعلومات والفضاء الالكتروني' : 'Info Security & Cyberspace'}</option>
                <option value="cyber">{lang === 'ar' ? 'الأمن السيبراني' : 'Cyber Security'}</option>
                <option value="cis">{lang === 'ar' ? 'نظم المعلومات الحاسوبية' : 'Computer Info Systems'}</option>
                <option value="ds_ai">{lang === 'ar' ? 'علم البيانات والذكاء الاصطناعي' : 'Data Science & AI'}</option>
              </select>
            </div>

            <div className="input-group">
              <label><Clock size={18} /> {lang === 'ar' ? 'الوضع الجامعي (سنة/فصل)' : 'Year / Semester'}</label>
              <input 
                required type="text" placeholder={lang === 'ar' ? 'مثال: سنة 2 - فصل 1' : 'e.g. Year 2 - Sem 1'} 
                value={regForm.year} onChange={e => setRegForm({...regForm, year: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label><Clock size={18} /> {lang === 'ar' ? 'عدد الساعات المقطوعة' : 'Completed Hours'}</label>
              <input 
                required type="number" placeholder="0" 
                value={regForm.hours} onChange={e => setRegForm({...regForm, hours: e.target.value})}
              />
            </div>

            <div className="input-group">
              <label><Lock size={18} /> {lang === 'ar' ? 'كلمة المرور' : 'Password'}</label>
              <div className="password-input">
                <input 
                  required type={showPassword ? "text" : "password"} placeholder="••••••••" 
                  value={regForm.password} onChange={e => setRegForm({...regForm, password: e.target.value})}
                />
                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="input-group">
              <label><Lock size={18} /> {lang === 'ar' ? 'تأكيد كلمة المرور' : 'Confirm Password'}</label>
              <div className="password-input">
                <input 
                  required type={showConfirmPassword ? "text" : "password"} placeholder="••••••••" 
                  value={regForm.confirmPassword} onChange={e => setRegForm({...regForm, confirmPassword: e.target.value})}
                />
                <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          </div>

          <button type="submit" className="btn-primary register-btn" style={{ width: '100%', padding: '1rem', fontSize: '1.1rem', marginTop: '1rem' }}>
            {lang === 'ar' ? 'إنشاء الحساب' : 'Create Account'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Prospective;
