import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';

const PrivacyNotice = () => {
  const [showBanner, setShowBanner] = useState(false);
  const { t } = useLanguage();

  useEffect(() => {
    const consent = localStorage.getItem('privacyNoticeConsent');
    if (!consent) {
      // Small timeout to show banner after loading
      const timer = setTimeout(() => setShowBanner(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('privacyNoticeConsent', 'true');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-charcoal/95 backdrop-blur-md border-t-4 border-saffron text-white py-4 px-6 z-40 flex flex-col sm:flex-row justify-between items-center gap-4 no-print shadow-2xl">
      <p className="text-xs sm:text-sm font-sans max-w-4xl text-gray-300 text-center sm:text-left leading-relaxed">
        {t('cookie.text')}
      </p>
      <button
        onClick={handleAccept}
        className="shrink-0 px-6 py-2 bg-saffron hover:bg-saffron-dark text-white font-medium rounded text-xs sm:text-sm transition-colors duration-200"
      >
        {t('cookie.accept')}
      </button>
    </div>
  );
};

export default PrivacyNotice;
