import React from 'react';
import { motion } from 'framer-motion';
import { Share2, Send, Twitter, Facebook } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const QuoteSection = () => {
  const { t } = useLanguage();

  const quoteText = t('quote.text');
  const quoteLeader = t('quote.leader');
  const designation = t('quote.designation');

  const shareText = encodeURIComponent(`"${quoteText}" - ${quoteLeader} | ${window.location.origin}`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${shareText}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.origin)}`;

  return (
    <section className="relative py-24 bg-charcoal text-white overflow-hidden print:py-8 print:bg-white print:text-black">
      {/* Grayscale Crowd Background Photo */}
      <div className="absolute inset-0 z-0 opacity-15 pointer-events-none select-none print:hidden">
        <img
          src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1600"
          alt="Crowd background"
          className="w-full h-full object-cover filter grayscale"
          loading="lazy"
        />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8 w-full">
        
        {/* Saffron Quotation Mark SVG */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="flex justify-center"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-24 h-24 text-saffron opacity-85"
          >
            <path d="M13 14.725c0-5.141 3.892-10.519 10-11.725l.944 2c-3.077 1.183-4.944 3.309-4.944 6.725h5v9h-11v-6zm-13 0c0-5.141 3.892-10.519 10-11.725l.944 2c-3.077 1.183-4.944 3.309-4.944 6.725h5v9h-11v-6z" />
          </svg>
        </motion.div>

        {/* Quote Content */}
        <motion.div
          initial={{ opacity: 0, y: 30, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="space-y-6"
        >
          <blockquote className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-serif italic leading-tight text-white font-devanagari max-w-3xl mx-auto print:text-black">
            "{quoteText}"
          </blockquote>

          <div className="flex flex-col items-center space-y-2 pt-2">
            <span className="w-12 h-[2px] bg-saffron"></span>
            <cite className="not-italic text-lg sm:text-xl font-bold font-serif text-saffron uppercase tracking-widest font-devanagari">
              {quoteLeader}
            </cite>
            <span className="text-xs sm:text-sm text-gray-400 tracking-wider uppercase font-devanagari print:text-gray-600">
              {designation}
            </span>
          </div>
        </motion.div>

        {/* Social Share Buttons */}
        <div className="flex justify-center items-center gap-4 pt-4 no-print">
          <span className="text-xs text-gray-400 font-semibold tracking-wider flex items-center gap-1.5 font-devanagari">
            <Share2 size={14} className="text-saffron" />
            साझा करें:
          </span>
          
          {/* WhatsApp share */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-white/10 hover:bg-saffron text-white transition-all shadow hover:scale-110 active:scale-95"
            title="Share on WhatsApp"
            aria-label="Share on WhatsApp"
          >
            <Send size={18} />
          </a>

          {/* Twitter share */}
          <a
            href={twitterUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-white/10 hover:bg-saffron text-white transition-all shadow hover:scale-110 active:scale-95"
            title="Share on Twitter"
            aria-label="Share on Twitter"
          >
            <Twitter size={18} />
          </a>

          {/* Facebook share */}
          <a
            href={facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2.5 rounded-full bg-white/10 hover:bg-saffron text-white transition-all shadow hover:scale-110 active:scale-95"
            title="Share on Facebook"
            aria-label="Share on Facebook"
          >
            <Facebook size={18} />
          </a>
        </div>

      </div>
    </section>
  );
};

export default QuoteSection;
