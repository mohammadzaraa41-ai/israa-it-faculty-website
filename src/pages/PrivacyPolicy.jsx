import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, FileText, CheckCircle } from 'lucide-react';

const PrivacyPolicy = () => {
  const { lang } = useLocale();

  const content = {
    ar: {
      title: 'سياسة الخصوصية',
      subtitle: 'نحن ملتزمون بحماية خصوصيتك وبياناتك الشخصية',
      sections: [
        {
          title: 'جمع المعلومات',
          icon: <Eye size={24} />,
          text: 'نقوم بجمع المعلومات التي تقدمها لنا مباشرة عند إنشاء حساب أو تقديم طلب انضمام لبوابة الخريجين، وتشمل الاسم، الرقم الجامعي، البريد الإلكتروني، والصور المرفقة.'
        },
        {
          title: 'كيفية استخدام بياناتك',
          icon: <FileText size={24} />,
          text: 'نستخدم معلوماتك لتوفير الخدمات الأكاديمية، والتحقق من الهوية، وعرض التميز في لوحة الشرف، والتواصل معك بخصوص التحديثات الهامة في الكلية.'
        },
        {
          title: 'حماية البيانات',
          icon: <Shield size={24} />,
          text: 'نطبق معايير أمنية صارمة وتشفير البيانات عبر خوادم آمنة لضمان عدم تسرب معلوماتك أو الوصول إليها من قبل أطراف غير مصرح لها.'
        },
        {
          title: 'مشاركة المعلومات',
          icon: <Lock size={24} />,
          text: 'لا نقوم ببيع أو تأجير بياناتك الشخصية لأي طرف ثالث. يتم استخدام البيانات حصرياً داخل نطاق كلية تكنولوجيا المعلومات والأغراض الأكاديمية الرسمية.'
        }
      ],
      footer: 'باستخدامك لموقع الكلية، فإنك توافق على سياسة الخصوصية المتبعة لدينا.'
    },
    en: {
      title: 'Privacy Policy',
      subtitle: 'We are committed to protecting your privacy and personal data',
      sections: [
        {
          title: 'Information Collection',
          icon: <Eye size={24} />,
          text: 'We collect information you provide directly to us when creating an account or submitting an alumni portal request, including name, student ID, email, and uploaded images.'
        },
        {
          title: 'How We Use Your Data',
          icon: <FileText size={24} />,
          text: 'We use your information to provide academic services, verify identity, showcase excellence in the honor roll, and communicate important faculty updates.'
        },
        {
          title: 'Data Protection',
          icon: <Shield size={24} />,
          text: 'We implement strict security standards and data encryption via secure servers to ensure your information is protected from unauthorized access.'
        },
        {
          title: 'Information Sharing',
          icon: <Lock size={24} />,
          text: 'We do not sell or rent your personal data to third parties. Data is used exclusively within the Faculty of IT for official academic purposes.'
        }
      ],
      footer: 'By using the faculty website, you agree to our privacy policy.'
    }
  };

  const current = content[lang];

  return (
    <div style={{ padding: '4rem 2rem', maxWidth: '1000px', margin: '0 auto', minHeight: '80vh' }}>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textAlign: 'center', marginBottom: '4rem' }}
      >
        <Shield size={64} color="var(--primary-color)" style={{ marginBottom: '1.5rem' }} />
        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{current.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>{current.subtitle}</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {current.sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: lang === 'ar' ? 50 : -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel"
            style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
          >
            <div style={{ padding: '1rem', background: 'var(--primary-color)', color: 'white', borderRadius: '12px' }}>
              {section.icon}
            </div>
            <div>
              <h3 style={{ fontSize: '1.5rem', marginBottom: '0.75rem', color: 'var(--primary-color)' }}>{section.title}</h3>
              <p style={{ lineHeight: '1.8', color: 'var(--text-secondary)' }}>{section.text}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        style={{ marginTop: '4rem', padding: '2rem', borderTop: '1px solid var(--border-color)', textAlign: 'center' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--accent-color)', fontWeight: 'bold' }}>
          <CheckCircle size={20} />
          <span>{current.footer}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default PrivacyPolicy;
