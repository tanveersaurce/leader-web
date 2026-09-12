import React, { useState, useEffect } from 'react';
import { Link } from 'react-scroll';
import { Menu, X, Globe, LogIn } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar = () => {
  const { lang, toggleLanguage, t } = useLanguage();
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const isAdminPage = location.pathname.startsWith('/admin');
  const token = localStorage.getItem('token');

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleAdminAuthAction = () => {
    if (token) {
      localStorage.removeItem('token');
      localStorage.removeItem('username');
      navigate('/');
      window.location.reload();
    } else {
      navigate('/admin');
    }
  };

  const navItems = [
    { id: 'intro', label: t('nav.intro') },
    { id: 'journey', label: t('nav.journey') },
    { id: 'achievements', label: t('nav.achievements') },
    { id: 'vision', label: t('nav.vision') },
    { id: 'documentary', label: t('nav.documentary') },
    { id: 'gallery', label: t('nav.gallery') },
    { id: 'contact', label: t('nav.contact') },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 no-print ${
        scrolled || isOpen || isAdminPage
          ? 'bg-white/95 backdrop-blur-md border-b-4 border-saffron shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-12">
          {/* Logo Brand */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => { if(isAdminPage) navigate('/'); else window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
            {/* Saffron Lotus SVG Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className="w-8 h-8 fill-current text-saffron"
            >
              <path d="M50 15 C46 26 35 34 22 39 C36 43 45 43 50 56 C55 43 64 43 78 39 C65 34 54 26 50 15 Z" />
              <path d="M50 37 C42 47 28 52 10 52 C28 56 40 56 50 71 C60 56 72 56 90 52 C72 52 58 47 50 37 Z" />
              <path d="M50 80 C46 85 38 88 30 91 L70 91 C62 88 54 85 50 80 Z" />
            </svg>
            <span className="text-charcoal text-xl sm:text-2xl font-bold font-serif tracking-wide select-none">
              नरेन्द्र मोदी
            </span>
          </div>

          {/* Desktop Navigation Links */}
          {!isAdminPage && (
            <div className="hidden lg:flex items-center space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.id}
                  spy={true}
                  smooth={true}
                  offset={-70}
                  duration={500}
                  className="text-gray-700 hover:text-saffron font-medium font-devanagari text-sm cursor-pointer transition-colors duration-200"
                  activeClass="text-saffron font-bold relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[2px] after:bg-saffron"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Right Controls */}
          <div className="hidden md:flex items-center gap-4">
            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded border border-gray-300 hover:border-saffron text-gray-700 hover:text-saffron transition-colors text-xs font-semibold uppercase tracking-wider"
              aria-label="Language Toggle"
            >
              <Globe size={14} />
              {lang === 'hi' ? 'English' : 'हिंदी'}
            </button>

            {/* Admin Authentication Shortcut */}
            <button
              onClick={handleAdminAuthAction}
              className="p-2 text-gray-500 hover:text-saffron transition-colors rounded"
              title={token ? t('nav.logout') : t('nav.adminDashboard')}
              aria-label={token ? t('nav.logout') : t('nav.adminDashboard')}
            >
              <LogIn size={18} />
            </button>

            {/* Saffron Primary Action Button */}
            {!isAdminPage && (
              <Link
                to="contact"
                smooth={true}
                offset={-70}
                duration={500}
                className="px-5 py-2 bg-saffron hover:bg-saffron-dark text-white font-medium rounded text-sm transition-all shadow hover:shadow-lg hover:-translate-y-0.5 cursor-pointer font-devanagari"
              >
                {t('nav.join')}
              </Link>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleLanguage}
              className="flex items-center gap-1 px-2.5 py-1.5 rounded border border-gray-300 text-gray-700 text-[10px] font-bold uppercase"
              aria-label="Toggle language"
            >
              {lang === 'hi' ? 'EN' : 'हिं'}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-charcoal hover:text-saffron transition-colors"
              aria-label="Main menu"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && !isAdminPage && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-inner">
          <div className="px-2 pt-2 pb-4 space-y-1">
            {navItems.map((item) => (
              <Link
                key={item.id}
                to={item.id}
                spy={true}
                smooth={true}
                offset={-70}
                duration={500}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-saffron hover:bg-gray-50 rounded font-devanagari cursor-pointer"
                activeClass="bg-saffron/10 text-saffron font-bold"
              >
                {item.label}
              </Link>
            ))}
            <Link
              to="contact"
              smooth={true}
              offset={-70}
              duration={500}
              onClick={() => setIsOpen(false)}
              className="block w-full text-center px-4 py-2 mt-3 bg-saffron hover:bg-saffron-dark text-white font-semibold rounded font-devanagari cursor-pointer"
            >
              {t('nav.join')}
            </Link>
            {token ? (
              <button
                onClick={() => { setIsOpen(false); handleAdminAuthAction(); }}
                className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded"
              >
                {t('nav.logout')}
              </button>
            ) : (
              <button
                onClick={() => { setIsOpen(false); navigate('/admin'); }}
                className="block w-full text-center px-4 py-2 border border-gray-300 text-gray-700 font-semibold rounded"
              >
                {t('nav.adminDashboard')}
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
