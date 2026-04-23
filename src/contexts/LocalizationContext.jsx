import React, { createContext, useState, useEffect, useContext } from 'react';
import en from '../locales/en.json';
import ar from '../locales/ar.json';

const LocalizationContext = createContext();

const translations = { en, ar };

export const LocalizationProvider = ({ children }) => {
  const [lang, setLang] = useState(() => {
    return localStorage.getItem('lang') || 'ar'; // Default Arabic
  });

  useEffect(() => {
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = lang;
    localStorage.setItem('lang', lang);
  }, [lang]);

  const t = (key) => {
    const keys = key.split('.');
    let value = translations[lang];
    for (let k of keys) {
      if (value === undefined) return key;
      value = value[k];
    }
    return value || key;
  };

  const toggleLang = () => setLang(lang === 'ar' ? 'en' : 'ar');

  return (
    <LocalizationContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LocalizationContext.Provider>
  );
};

export const useLocale = () => useContext(LocalizationContext);
