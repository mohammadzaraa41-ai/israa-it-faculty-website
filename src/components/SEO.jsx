import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocale } from '../contexts/LocalizationContext';

const SEO = ({ title, description, image, article }) => {
  const { lang, t } = useLocale();
  const siteName = t('faculty_name') || 'Israa UN_IT';
  const fullTitle = title ? `${title} | ${siteName}` : siteName;
  const defaultDescription = lang === 'ar' 
    ? 'كلية تكنولوجيا المعلومات بجامعة الإسراء - ريادة في التعليم والبحث العلمي والابتكار التقني.'
    : 'Faculty of IT at Israa University - Excellence in education, research, and technical innovation.';
  
  const seoDescription = description || defaultDescription;
  const seoImage = image || '/logo.png';
  const url = window.location.href;

  return (
    <Helmet>
      {/* General tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={seoDescription} />
      <meta name="image" content={seoImage} />

      {/* Open Graph / Facebook */}
      <meta property="og:url" content={url} />
      {article ? <meta property="og:type" content="article" /> : <meta property="og:type" content="website" />}
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={seoDescription} />
      <meta property="og:image" content={seoImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={seoDescription} />
      <meta name="twitter:image" content={seoImage} />
      
      {/* Language Alternates */}
      <link rel="alternate" hrefLang={lang === 'ar' ? 'ar' : 'en'} href={url} />
    </Helmet>
  );
};

export default SEO;
