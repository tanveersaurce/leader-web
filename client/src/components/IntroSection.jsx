import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { useLanguage } from '../context/LanguageContext';

const IntroSection = ({ leader }) => {
  const { t } = useLanguage();

  const bioText = leader?.bio || '';
  // Fallback portrait image
  const portrait = leader?.heroImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=600';

  return (
    <section id="intro" className="py-24 bg-white border-b border-gray-100 print:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Column - Biography */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-6 text-left"
          >
            <div className="flex items-center gap-3">
              <span className="w-12 h-1 bg-saffron inline-block"></span>
              <h2 className="text-3xl sm:text-4xl font-bold font-serif text-charcoal">
                {t('intro.heading')}
              </h2>
            </div>
            
            <p className="text-gray-700 text-base leading-relaxed font-sans whitespace-pre-line text-justify font-devanagari">
              {bioText || "प्रधानमंत्री श्री नरेन्द्र मोदी का जीवन राष्ट्र के प्रति पूर्ण समर्पण और सेवा की एक अद्वितीय गाथा है। अत्यंत सामान्य पृष्ठभूमि से उठकर उन्होंने जन-कल्याण और राष्ट्र-उत्थान को ही अपना सर्वोपरि ध्येय बनाया है। उनका प्रत्येक कदम 'राष्ट्र प्रथम' के संकल्प से प्रेरित है।"}
            </p>

            <div className="flex flex-wrap gap-4 pt-4 no-print">
              <Link
                to="journey"
                smooth={true}
                offset={-70}
                duration={500}
                className="px-6 py-2.5 border-2 border-saffron hover:bg-saffron text-saffron hover:text-white font-medium rounded transition-all duration-300 cursor-pointer font-devanagari text-sm"
              >
                {t('intro.startJourney')}
              </Link>
              <Link
                to="achievements"
                smooth={true}
                offset={-70}
                duration={500}
                className="px-6 py-2.5 border-2 border-charcoal hover:border-saffron text-charcoal hover:text-saffron font-medium rounded transition-all duration-300 cursor-pointer font-devanagari text-sm"
              >
                {t('intro.viewAchievements')}
              </Link>
            </div>
          </motion.div>

          {/* Right Column - Portrait & Saffron Geometric Border Offset */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="lg:col-span-5 relative flex justify-center items-center print:mt-6"
          >
            {/* Saffron geometric border overlay (offset bottom-right or top-left) */}
            <div className="absolute top-4 left-4 w-[280px] sm:w-[350px] aspect-[4/5] border-4 border-saffron z-0 pointer-events-none rounded"></div>
            
            {/* Grayscale portrait picture */}
            <div className="relative w-[280px] sm:w-[350px] aspect-[4/5] bg-white border-2 border-white shadow-xl rounded overflow-hidden z-10 group">
              <img
                src={portrait}
                alt={leader?.name || "Portrait"}
                className="w-full h-full object-cover photo-bw transform group-hover:scale-105 transition-all duration-500"
                loading="lazy"
              />
              {/* Multiplying subtle overlay */}
              <div className="absolute inset-0 bg-saffron/10 double-exposure-blend pointer-events-none transition-opacity duration-300 group-hover:opacity-0"></div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};

export default IntroSection;
