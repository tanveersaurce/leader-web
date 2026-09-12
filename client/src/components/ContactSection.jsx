import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Twitter, Facebook, Instagram, Youtube, Send } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const ContactSection = () => {
  const { t } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    city: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validations
    if (!formData.name.trim() || !formData.email.trim() || !formData.city.trim() || !formData.message.trim()) {
      toast.error(t('contact.error') || 'सभी फ़ील्ड आवश्यक हैं।');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('कृपया सही ईमेल आईडी दर्ज करें।');
      return;
    }

    setLoading(true);
    const toastId = toast.loading(t('contact.submitting') || 'भेजा जा रहा है...');

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/contact`;
      await axios.post(apiUrl, formData);
      
      toast.success(t('contact.success') || 'संदेश सफलतापूर्वक भेजा गया!', { id: toastId });
      setFormData({ name: '', email: '', city: '', message: '' });
    } catch (error) {
      console.error(error);
      toast.error(t('contact.error') || 'संदेश भेजने में त्रुटि हुई। कृपया पुनः प्रयास करें।', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-gradient-to-br from-saffron to-saffron-dark text-white relative overflow-hidden print:py-8 print:bg-white print:text-black">
      
      {/* Saffron design shapes in background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-black/5 rounded-full blur-2xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column - Heading & Description */}
          <div className="lg:col-span-5 space-y-6 text-left">
            <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white leading-tight font-devanagari">
              {t('contact.heading')}
            </h2>
            <span className="w-16 h-1 bg-white inline-block"></span>
            
            <p className="text-white/80 font-sans text-sm sm:text-base leading-relaxed font-devanagari">
              {t('contact.description')}
            </p>

            {/* Social Share Media Connections */}
            <div className="flex gap-4 pt-4 no-print">
              {[
                { href: 'https://twitter.com', icon: <Twitter size={18} /> },
                { href: 'https://facebook.com', icon: <Facebook size={18} /> },
                { href: 'https://instagram.com', icon: <Instagram size={18} /> },
                { href: 'https://youtube.com', icon: <Youtube size={18} /> }
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 bg-white/10 hover:bg-white hover:text-saffron text-white rounded-full transition-all duration-300 shadow hover:scale-105 active:scale-95"
                  aria-label="Social Link"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Right Column - Form */}
          <div className="lg:col-span-7 bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-lg shadow-2xl relative w-full print:bg-white print:border-gray-200 print:shadow-none">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {/* Name field */}
                <div className="flex flex-col items-start space-y-2">
                  <label htmlFor="name" className="text-xs font-semibold tracking-wider font-devanagari text-white/95 print:text-charcoal">
                    {t('contact.namePlaceholder')} <span className="text-red-300 print:text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border border-white/25 rounded px-4 py-2.5 text-white placeholder-white/50 focus:bg-white focus:text-charcoal focus:placeholder-gray-400 focus:outline-none transition-all duration-200 font-devanagari text-sm print:bg-gray-50 print:border-gray-300 print:text-black"
                  />
                </div>

                {/* Email field */}
                <div className="flex flex-col items-start space-y-2">
                  <label htmlFor="email" className="text-xs font-semibold tracking-wider font-devanagari text-white/95 print:text-charcoal">
                    {t('contact.emailPlaceholder')} <span className="text-red-300 print:text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-white/10 border border-white/25 rounded px-4 py-2.5 text-white placeholder-white/50 focus:bg-white focus:text-charcoal focus:placeholder-gray-400 focus:outline-none transition-all duration-200 text-sm print:bg-gray-50 print:border-gray-300 print:text-black"
                  />
                </div>
              </div>

              {/* City field */}
              <div className="flex flex-col items-start space-y-2">
                <label htmlFor="city" className="text-xs font-semibold tracking-wider font-devanagari text-white/95 print:text-charcoal">
                  {t('contact.cityPlaceholder')} <span className="text-red-300 print:text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full bg-white/10 border border-white/25 rounded px-4 py-2.5 text-white placeholder-white/50 focus:bg-white focus:text-charcoal focus:placeholder-gray-400 focus:outline-none transition-all duration-200 font-devanagari text-sm print:bg-gray-50 print:border-gray-300 print:text-black"
                />
              </div>

              {/* Message field */}
              <div className="flex flex-col items-start space-y-2">
                <label htmlFor="message" className="text-xs font-semibold tracking-wider font-devanagari text-white/95 print:text-charcoal">
                  {t('contact.messagePlaceholder')} <span className="text-red-300 print:text-red-500">*</span>
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows="4"
                  className="w-full bg-white/10 border border-white/25 rounded px-4 py-2.5 text-white placeholder-white/50 focus:bg-white focus:text-charcoal focus:placeholder-gray-400 focus:outline-none transition-all duration-200 font-devanagari text-sm resize-none print:bg-gray-50 print:border-gray-300 print:text-black"
                ></textarea>
              </div>

              {/* Submit button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-charcoal hover:bg-charcoal/90 text-white hover:text-saffron font-bold rounded transition-all duration-200 flex items-center justify-center gap-2 border-2 border-transparent hover:border-saffron shadow-lg font-devanagari no-print"
              >
                <Send size={16} />
                {loading ? t('contact.submitting') : t('contact.submitBtn')}
              </button>

            </form>
          </div>

        </div>
      </div>
    </section>
  );
};

export default ContactSection;
