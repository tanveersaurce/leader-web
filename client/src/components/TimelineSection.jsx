import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const TimelineSection = ({ timelineItems }) => {
  const { t } = useLanguage();

  return (
    <section id="journey" className="py-24 bg-cream/50 border-b border-gray-100 print:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-charcoal tracking-wide">
            {t('timeline.heading')}
          </h2>
          <span className="w-16 h-1 bg-saffron inline-block mt-3"></span>
        </div>

        {/* Timeline Core */}
        <div className="relative">
          {/* Vertical Connecting Line */}
          <div className="absolute left-4 lg:left-1/2 top-0 bottom-0 w-[4px] bg-saffron -translate-x-1/2 z-0"></div>

          {/* Timeline Items */}
          <div className="space-y-16">
            {(Array.isArray(timelineItems) ? timelineItems : []).map((item, index) => {
              const isEven = index % 2 === 0;
              
              return (
                <div key={item._id || index} className="relative flex flex-col lg:flex-row items-stretch z-10">
                  {/* Central Node Badge */}
                  <div className="absolute left-4 lg:left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 border-cream bg-saffron shadow z-20 flex items-center justify-center">
                    <div className="w-2.5 h-2.5 rounded-full bg-white animate-pulse"></div>
                  </div>

                  {/* Left Side (Empty on Odd index on Desktop) */}
                  <div className={`w-full lg:w-1/2 pl-12 lg:pl-0 lg:pr-12 flex ${isEven ? 'lg:justify-end' : 'hidden lg:flex pointer-events-none'}`}>
                    {isEven && (
                      <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        transition={{ duration: 0.5 }}
                        className="bg-white p-6 rounded shadow-lg border border-gray-100 max-w-xl text-left flex flex-col md:flex-row gap-6 w-full"
                      >
                        <div className="shrink-0 md:w-36 w-full aspect-video md:aspect-[3/4] overflow-hidden rounded border border-gray-200 bg-gray-50 shadow-inner">
                          <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover filter grayscale hover:grayscale-0 duration-300"
                            loading="lazy"
                          />
                        </div>
                        <div className="space-y-2">
                          <span className="block text-4xl font-extrabold text-saffron tracking-tight font-serif leading-none">
                            {item.year}
                          </span>
                          <h3 className="text-xl font-bold font-serif text-charcoal font-devanagari">
                            {item.title}
                          </h3>
                          <p className="text-gray-600 text-sm font-sans leading-relaxed line-clamp-3 font-devanagari">
                            {item.description}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  {/* Right Side (Empty on Even index on Desktop) */}
                  <div className={`w-full lg:w-1/2 pl-12 lg:pl-12 flex ${!isEven ? 'lg:justify-start' : 'lg:hidden'}`}>
                    <motion.div
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-100px" }}
                      transition={{ duration: 0.5 }}
                      className="bg-white p-6 rounded shadow-lg border border-gray-100 max-w-xl text-left flex flex-col md:flex-row gap-6 w-full"
                    >
                      <div className="shrink-0 md:w-36 w-full aspect-video md:aspect-[3/4] overflow-hidden rounded border border-gray-200 bg-gray-50 shadow-inner">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="w-full h-full object-cover filter grayscale hover:grayscale-0 duration-300"
                          loading="lazy"
                        />
                      </div>
                      <div className="space-y-2">
                        <span className="block text-4xl font-extrabold text-saffron tracking-tight font-serif leading-none">
                          {item.year}
                        </span>
                        <h3 className="text-xl font-bold font-serif text-charcoal font-devanagari">
                          {item.title}
                        </h3>
                        <p className="text-gray-600 text-sm font-sans leading-relaxed line-clamp-3 font-devanagari">
                          {item.description}
                        </p>
                      </div>
                    </motion.div>
                  </div>

                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
};

export default TimelineSection;
