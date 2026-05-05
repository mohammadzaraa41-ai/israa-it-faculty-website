import React from 'react';
import { useLocale } from '../contexts/LocalizationContext';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
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
              <li><Link to="/prospective">{lang === 'ar' ? 'بوابة القبول' : 'Admissions Portal'}</Link></li>
              <li><Link to="/faculty">{lang === 'ar' ? 'البحث العلمي' : 'Scientific Research'}</Link></li>
              <li><Link to="/roadmap">{lang === 'ar' ? 'الخطط الدراسية' : 'Study Plans'}</Link></li>
              <li><Link to="/academic-calendar">{lang === 'ar' ? 'التقويم الأكاديمي' : 'Academic Calendar'}</Link></li>
              <li><a href="https://www.iu.edu.jo/index.php/ar/israa-library-ar" target="_blank" rel="noopener noreferrer">{lang === 'ar' ? 'المكتبة المركزية' : 'Central Library'}</a></li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="footer-col">
            <h4>{lang === 'ar' ? 'اتصل بنا' : 'Contact Us'}</h4>
            <ul className="contact-list">
              <li>
                <MapPin size={18} />
                <span>{lang === 'ar' ? 'الأردن - عمان - طريق المطار' : 'Jordan - Amman - Airport Road'}</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+962 6 4711710</span>
              </li>
              <li>
                <Mail size={18} />
                <span>info@iu.edu.jo</span>
              </li>
            </ul>
            <div className="social-links">
              <a href="https://www.facebook.com/alisrauni" target="_blank" rel="noopener noreferrer" className="social-icon" title="Facebook"><Facebook size={20} /></a>
              <a href="https://www.instagram.com/alisrauni/" target="_blank" rel="noopener noreferrer" className="social-icon" title="Instagram"><Instagram size={20} /></a>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <div className="footer-copyright">
              <p>© {new Date().getFullYear()} {t('faculty_name')} - {lang === 'ar' ? 'جميع الحقوق محفوظة' : 'All Rights Reserved'}</p>
              <p className="developer-credits">
                <span>
                  {lang === 'ar' ? 'إشراف: ' : 'Supervised by: '}
                  <span className="dev-name">
                    {lang === 'ar' ? 'د. عمرو الشواورة' : 'Dr. Amr Al-Shawawreh'}
                  </span>
                </span>
                <span style={{ margin: '0 10px', opacity: 0.3 }}>|</span>
                <span>
                  {lang === 'ar' ? 'تطوير: ' : 'Developed by: '}
                  <span className="dev-name">
                    <a 
                      href="https://www.linkedin.com/in/yousef-alhardan-726597408/" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ color: 'var(--accent-color)', fontWeight: 'bold', textDecoration: 'none', transition: 'opacity 0.3s' }}
                      onMouseOver={(e) => e.target.style.opacity = '0.8'}
                      onMouseOut={(e) => e.target.style.opacity = '1'}
                    >
                      {lang === 'ar' ? 'م. يوسف حردان' : 'Eng. Yousef Hardan'}
                    </a>
                  </span> 
                  {' & '}
                  <span className="dev-name">
                <a 
                  href="https://www.linkedin.com/in/mohammadalzaraa/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  style={{ color: 'var(--accent-color)', fontWeight: 'bold', textDecoration: 'none', transition: 'opacity 0.3s' }}
                  onMouseOver={(e) => e.target.style.opacity = '0.8'}
                  onMouseOut={(e) => e.target.style.opacity = '1'}
                >
                    {lang === 'ar' ? 'م. محمد الزراع' : 'Eng. Mohammad Zaraa'}
                </a>
                  </span>
                </span>
              </p>
            </div>
            <div className="footer-bottom-links">
              <Link to="/privacy-policy">{lang === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}</Link>
              <Link to="/terms-of-use">{lang === 'ar' ? 'شروط الاستخدام' : 'Terms of Use'}</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
