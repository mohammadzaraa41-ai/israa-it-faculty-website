import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { motion } from 'framer-motion';
import { Scale, UserCheck, AlertTriangle, Copyright, HelpCircle } from 'lucide-react';

const TermsOfUse = () => {
  const { lang } = useLocale();

  const content = {
    ar: {
      title: 'شروط الاستخدام',
      subtitle: 'القواعد والضوابط التي تحكم استخدامك لمنصة الكلية الرقمية',
      sections: [
        {
          title: 'قبول الشروط',
          icon: <UserCheck size={24} />,
          text: 'بمجرد دخولك واستخدامك للموقع، فإنك تقر بموافقتك الكاملة على هذه الشروط والالتزام بكافة القوانين واللوائح المعمول بها في جامعة الإسراء.'
        },
        {
          title: 'السلوك المحظور',
          icon: <AlertTriangle size={24} />,
          text: 'يُحظر تماماً محاولة اختراق الموقع، أو نشر محتوى مسيء، أو انتحال شخصية طالب أو موظف آخر. أي مخالفة قد تؤدي إلى تعليق الحساب والملاحقة القانونية.'
        },
        {
          title: 'الملكية الفكرية',
          icon: <Copyright size={24} />,
          text: 'جميع حقوق الملكية الفكرية للمواد المنشورة على هذا الموقع (نصوص، صور، تصاميم) تعود لكلية تكنولوجيا المعلومات، ولا يجوز نسخها أو توزيعها دون موافقة خطية.'
        },
        {
          title: 'تحديد المسؤولية',
          icon: <Scale size={24} />,
          text: 'تبذل الكلية قصارى جهدها لضمان دقة المعلومات، ولكنها لا تتحمل المسؤولية عن أي أخطاء غير مقصودة أو أعطال تقنية خارجة عن إرادتنا.'
        }
      ],
      footer: 'تحتفظ الكلية بالحق في تعديل هذه الشروط في أي وقت لتناسب التطورات التقنية والأكاديمية.'
    },
    en: {
      title: 'Terms of Use',
      subtitle: 'Rules and regulations governing your use of our digital platform',
      sections: [
        {
          title: 'Acceptance of Terms',
          icon: <UserCheck size={24} />,
          text: 'By accessing and using this website, you acknowledge your full agreement to these terms and compliance with all laws and regulations applicable at Israa University.'
        },
        {
          title: 'Prohibited Conduct',
          icon: <AlertTriangle size={24} />,
          text: 'Hacking attempts, posting offensive content, or impersonating other students or staff is strictly prohibited and may lead to account suspension and legal action.'
        },
        {
          title: 'Intellectual Property',
          icon: <Copyright size={24} />,
          text: 'All intellectual property rights for materials on this site (text, images, designs) belong to the Faculty of IT and may not be copied or distributed without written consent.'
        },
        {
          title: 'Limitation of Liability',
          icon: <Scale size={24} />,
          text: 'The faculty strives to ensure information accuracy but is not liable for unintentional errors or technical malfunctions beyond our control.'
        }
      ],
      footer: 'The faculty reserves the right to modify these terms at any time to suit technical and academic developments.'
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
        <Scale size={64} color="var(--primary-color)" style={{ marginBottom: '1.5rem' }} />
        <h1 className="title" style={{ fontSize: '3rem', marginBottom: '1rem' }}>{current.title}</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.2rem' }}>{current.subtitle}</p>
      </motion.div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
        {current.sections.map((section, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1 }}
            className="glass-panel"
            style={{ padding: '2rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}
          >
            <div style={{ padding: '1rem', background: 'var(--accent-color)', color: 'white', borderRadius: '12px' }}>
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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
          <HelpCircle size={20} />
          <span>{current.footer}</span>
        </div>
      </motion.div>
    </div>
  );
};

export default TermsOfUse;
