import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const VisionSection = ({ visions }) => {
  const { t } = useLanguage();

  return (
    <section id="vision" className="py-24 bg-white border-b border-gray-100 print:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-charcoal tracking-wide">
            {t('vision.heading')}
          </h2>
          <span className="w-16 h-1 bg-saffron inline-block mt-3"></span>
        </div>

        {/* 3-column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {(Array.isArray(visions) ? visions : []).map((vision, index) => (
            <motion.div
              key={vision._id || index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative group h-[400px] rounded-lg overflow-hidden border-2 border-transparent hover:border-saffron shadow-xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer print:h-auto print:border-gray-200 print:shadow-none"
            >
              {/* Background B&W Image */}
              <img
                src={vision.backgroundImage}
                alt={vision.title}
                className="w-full h-full object-cover filter grayscale group-hover:scale-110 duration-500 print:h-48"
                loading="lazy"
              />

              {/* Saffron Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent group-hover:from-saffron/80 group-hover:via-saffron/30 duration-300 pointer-events-none print:hidden"></div>

              {/* Card Content */}
              <div className="absolute inset-0 p-6 flex flex-col justify-end text-left z-10 print:relative print:p-4 print:text-black">
                <h3 className="text-2xl font-bold text-white font-serif font-devanagari mb-2 print:text-charcoal print:text-lg">
                  {vision.title}
                </h3>
                
                <p className="text-gray-200 text-sm font-sans line-clamp-2 mb-4 font-devanagari leading-relaxed group-hover:text-white print:text-gray-600 print:line-clamp-none">
                  {vision.description}
                </p>

                <span className="text-saffron group-hover:text-white text-xs font-semibold uppercase tracking-wider font-devanagari flex items-center gap-1.5 print:hidden">
                  {t('vision.learnMore')}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default VisionSection;
