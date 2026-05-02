import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ExternalLink } from 'lucide-react';
import './Footer.css';

const Footer = () => {
  const { lang, t } = useLocale();

  return (
    <footer className="institutional-footer">
      <div className="footer-container">
        <div className="footer-grid">
          {/* Column 1: Institutional Identity */}
          <div className="footer-col brand-col">
            <div className="footer-logo">
              <img src="/logo.png" alt="University Logo" />
              <div className="footer-logo-text">
                <h3>{t('faculty_name')}</h3>
                <span>{lang === 'ar' ? 'جامعة الإسراء' : 'Israa University'}</span>
              </div>
            </div>
            <p className="footer-description">
              {lang === 'ar' 
                ? 'نسعى للتميز في التعليم والبحث العلمي في مجالات تكنولوجيا المعلومات لإعداد جيل قادر على الابتكار والمنافسة عالمياً.' 
                : 'We strive for excellence in education and scientific research in IT fields to prepare a generation capable of innovation and global competition.'}
            </p>
            <div className="accreditation-badges">
              <div className="badge">{lang === 'ar' ? 'معتمد أكاديمياً' : 'Accredited'}</div>
              <div className="badge">ISO 9001</div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div className="footer-col">
            <h4>{lang === 'ar' ? 'روابط سريعة' : 'Quick Links'}</h4>
            <ul className="footer-links">
              <li><a href="#">{lang === 'ar' ? 'بوابة القبول' : 'Admissions Portal'}</a></li>
              <li><a href="#">{lang === 'ar' ? 'البحث العلمي' : 'Scientific Research'}</a></li>
              <li><a href="#">{lang === 'ar' ? 'الخطط الدراسية' : 'Study Plans'}</a></li>
              <li><a href="#">{lang === 'ar' ? 'التقويم الأكاديمي' : 'Academic Calendar'}</a></li>
              <li><a href="#">{lang === 'ar' ? 'المكتبة المركزية' : 'Central Library'}</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="footer-col">
            <h4>{lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}</h4>
            <ul className="contact-list">
              <li>
                <MapPin size={18} />
                <span>{lang === 'ar' ? 'غزة - شارع الرشيد' : 'Gaza - Al-Rasheed St.'}</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+970 8 2843433</span>
              </li>
              <li>
                <Mail size={18} />
                <span>it@israa.edu.ps</span>
              </li>
            </ul>
            <div className="social-links">
              <a href="#" className="social-icon"><Facebook size={20} /></a>
              <a href="#" className="social-icon"><Twitter size={20} /></a>
              <a href="#" className="social-icon"><Instagram size={20} /></a>
              <a href="#" className="social-icon"><Linkedin size={20} /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p>© {new Date().getFullYear()} {t('faculty_name')} - {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}</p>
            <div className="footer-bottom-links">
              <a href="#">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</a>
              <a href="#">{lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
