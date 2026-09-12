import React from 'react';
import { Link } from 'react-scroll';
import { Mail, Phone, MapPin, Printer } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = ({ leader }) => {
  const { t } = useLanguage();

  const name = leader?.name || t('quote.leader');
  const tagline = leader?.tagline || t('quote.tagline') || t('hero.tagline');

  const handlePrint = () => {
    window.print();
  };

  return (
    <footer className="relative bg-charcoal text-white pt-16 pb-8 border-t-4 border-saffron overflow-hidden print:pt-6 print:pb-4 print:border-t-2 print:border-gray-300 print:bg-white print:text-black">
      
      {/* Grayscale Watermark Silhouette Background */}
      <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-end pr-20 print:hidden">
        <img
          src={leader?.heroImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600'}
          alt="Leader Silhouette"
          className="h-full object-contain filter grayscale"
          loading="lazy"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 items-start text-left print:grid-cols-3">
        
        {/* Col 1: Name, Tagline & Lotus */}
        <div className="lg:col-span-4 space-y-4 print:col-span-1">
          <div className="flex items-center gap-2">
            {/* Saffron Lotus SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className="w-7 h-7 fill-current text-saffron"
            >
              <path d="M50 15 C46 26 35 34 22 39 C36 43 45 43 50 56 C55 43 64 43 78 39 C65 34 54 26 50 15 Z" />
              <path d="M50 37 C42 47 28 52 10 52 C28 56 40 56 50 71 C60 56 72 56 90 52 C72 52 58 47 50 37 Z" />
              <path d="M50 80 C46 85 38 88 30 91 L70 91 C62 88 54 85 50 80 Z" />
            </svg>
            <span className="text-xl font-bold font-serif tracking-wide">
              {name}
            </span>
          </div>
          <p className="text-gray-400 text-sm font-devanagari print:text-gray-700 italic">
            "{tagline}"
          </p>
          <p className="text-xs text-gray-500 font-devanagari max-w-sm pt-2 leading-relaxed print:hidden">
            {t('footer.tagline')}
          </p>
        </div>

        {/* Col 2: Quick Links */}
        <div className="lg:col-span-3 space-y-4 no-print print:hidden">
          <h4 className="text-sm font-bold uppercase tracking-wider text-saffron">
            {t('footer.quickLinks')}
          </h4>
          <ul className="space-y-2">
            {[
              { id: 'intro', label: t('nav.intro') },
              { id: 'journey', label: t('nav.journey') },
              { id: 'achievements', label: t('nav.achievements') },
              { id: 'vision', label: t('nav.vision') },
              { id: 'gallery', label: t('nav.gallery') },
              { id: 'contact', label: t('nav.contact') },
            ].map((link) => (
              <li key={link.id}>
                <Link
                  to={link.id}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="text-gray-400 hover:text-saffron text-sm cursor-pointer transition-colors font-devanagari"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Contact Info */}
        <div className="lg:col-span-3 space-y-4 print:col-span-1">
          <h4 className="text-sm font-bold uppercase tracking-wider text-saffron">
            {t('footer.contactInfo')}
          </h4>
          <ul className="space-y-3 text-sm text-gray-400 print:text-gray-800">
            <li className="flex items-start gap-2.5">
              <MapPin size={16} className="text-saffron shrink-0 mt-0.5" />
              <span className="font-devanagari">{t('footer.address')}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone size={16} className="text-saffron shrink-0" />
              <span>{t('footer.phone')}</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail size={16} className="text-saffron shrink-0" />
              <span>{t('footer.email')}</span>
            </li>
          </ul>
        </div>

        {/* Col 4: Print Portfolio Option */}
        <div className="lg:col-span-2 space-y-4 print:col-span-1">
          <h4 className="text-sm font-bold uppercase tracking-wider text-saffron">
            विकल्प / Option
          </h4>
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 border border-white/20 hover:border-saffron hover:bg-saffron text-white rounded text-sm transition-all duration-300 w-full md:w-auto font-devanagari focus-visible:outline focus-visible:outline-3 focus-visible:outline-saffron focus-visible:outline-offset-2 print:border-gray-300 print:text-black"
          >
            <Printer size={16} />
            {t('footer.printBtn')}
          </button>
        </div>

      </div>

      {/* Bottom bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-6 border-t border-white/5 relative z-10 w-full flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 print:mt-6 print:pt-4 print:border-t-2 print:border-gray-300 print:text-black">
        <p className="font-devanagari">
          {t('footer.copyright')}
        </p>
        
        <div className="flex gap-4 no-print">
          <a href="#privacy" className="hover:text-saffron transition-colors font-devanagari">
            {t('footer.privacy')}
          </a>
          <span>|</span>
          <a href="#terms" className="hover:text-saffron transition-colors font-devanagari">
            {t('footer.terms')}
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
