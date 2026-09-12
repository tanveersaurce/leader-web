import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../locales/en';
import hi from '../locales/hi';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'hi');

  const toggleLanguage = () => {
    setLang((prev) => {
      const next = prev === 'hi' ? 'en' : 'hi';
      localStorage.setItem('lang', next);
      return next;
    });
  };

  // Helper to translate deep object paths e.g., t("contact.submitBtn")
  const t = (keyPath) => {
    const keys = keyPath.split('.');
    let translation = lang === 'hi' ? hi : en;
    for (const key of keys) {
      if (translation && translation[key] !== undefined) {
        translation = translation[key];
      } else {
        return keyPath; // Fallback
      }
    }
    return translation;
  };

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
