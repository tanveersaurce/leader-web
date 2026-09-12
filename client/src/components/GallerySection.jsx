import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight, MapPin, Calendar } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const GallerySection = ({ gallery }) => {
  const { t } = useLanguage();
  const [index, setIndex] = useState(null);

  // Keyboard navigation for Lightbox
  useEffect(() => {
    if (index === null) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') setIndex(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };

    document.addEventListener('keydown', handleKeyDown);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'unset';
    };
  }, [index]);

  const handleNext = () => {
    setIndex((prev) => (prev === gallery.length - 1 ? 0 : prev + 1));
  };

  const handlePrev = () => {
    setIndex((prev) => (prev === 0 ? gallery.length - 1 : prev - 1));
  };

  // Convert URLs to full URLs if they are local paths
  const getFullUrl = (url) => {
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
  };

  return (
    <section id="gallery" className="py-24 bg-white border-b border-gray-100 print:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-charcoal tracking-wide">
            {t('gallery.heading')}
          </h2>
          <span className="w-16 h-1 bg-saffron inline-block mt-3"></span>
        </div>

        {/* Masonry Grid (CSS Columns) */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6 [column-fill:_balance] w-full">
          {(Array.isArray(gallery) ? gallery : []).map((item, idx) => (
            <motion.div
              key={item._id || idx}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.4 }}
              onClick={() => setIndex(idx)}
              className="relative break-inside-avoid inline-block w-full rounded border-2 border-transparent bg-gray-100 shadow overflow-hidden group cursor-pointer hover:border-saffron hover:scale-[1.02] transition-all duration-300"
            >
              <img
                src={getFullUrl(item.imageUrl)}
                alt={item.caption}
                className="w-full h-auto object-cover photo-bw"
                loading="lazy"
              />

              {/* Caption Overlay on Hover */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col justify-end p-5 text-left transition-opacity duration-300 pointer-events-none">
                <p className="text-white font-bold font-devanagari text-base mb-1.5 leading-snug">
                  {item.caption}
                </p>
                <div className="flex items-center gap-3 text-xs text-gray-300 font-sans">
                  {item.location && (
                    <span className="flex items-center gap-1 font-devanagari">
                      <MapPin size={12} className="text-saffron" />
                      {item.location}
                    </span>
                  )}
                  {item.year && (
                    <span className="flex items-center gap-1 font-devanagari">
                      <Calendar size={12} className="text-saffron" />
                      {item.year}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {index !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/95 p-4 no-print"
            onClick={() => setIndex(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setIndex(null)}
              className="absolute top-6 right-6 p-2 text-white/70 hover:text-white bg-white/10 hover:bg-saffron rounded-full transition-all"
              aria-label="Close Lightbox"
            >
              <X size={24} />
            </button>

            {/* Left Nav Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-6 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-saffron rounded-full transition-all"
              aria-label="Previous Image"
            >
              <ChevronLeft size={28} />
            </button>

            {/* Right Nav Arrow */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-6 p-3 text-white/70 hover:text-white bg-white/10 hover:bg-saffron rounded-full transition-all"
              aria-label="Next Image"
            >
              <ChevronRight size={28} />
            </button>

            {/* Lightbox Center Content */}
            <div
              className="relative max-w-4xl max-h-[80vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.img
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.3 }}
                src={getFullUrl(gallery[index].imageUrl)}
                alt={gallery[index].caption}
                className="max-w-full max-h-[70vh] object-contain rounded shadow-2xl border border-white/10"
              />

              {/* Caption Card below Lightbox Image */}
              <div className="mt-4 text-center text-white px-4 space-y-1">
                <h4 className="text-lg font-bold font-devanagari">
                  {gallery[index].caption}
                </h4>
                <div className="flex justify-center items-center gap-4 text-sm text-gray-400">
                  {gallery[index].location && (
                    <span className="flex items-center gap-1 font-devanagari">
                      <MapPin size={14} className="text-saffron" />
                      {gallery[index].location}
                    </span>
                  )}
                  {gallery[index].year && (
                    <span className="flex items-center gap-1">
                      <Calendar size={14} className="text-saffron" />
                      {gallery[index].year}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default GallerySection;
