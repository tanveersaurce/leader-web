import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import VideoModal from './VideoModal';

const DocumentarySection = ({ videos }) => {
  const { lang, t } = useLanguage();
  const [selectedVideo, setSelectedVideo] = useState(null);

  const safeVideos = Array.isArray(videos) ? videos : [];

  // Separate featured video from the grid
  const featured = safeVideos.find((v) => v.isFeatured) || safeVideos[0];
  const gridVideos = featured ? safeVideos.filter((v) => v._id !== featured._id) : safeVideos;

  // Safe date formatting helper to prevent RangeErrors
  const formatDate = (dateVal) => {
    if (!dateVal) return '';
    const date = new Date(dateVal);
    if (isNaN(date.getTime())) return '';
    try {
      return date.toLocaleDateString(lang === 'en' ? 'en-US' : 'hi-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return date.toDateString();
    }
  };

  return (
    <section id="documentary" className="py-24 bg-cream/40 border-b border-gray-100 print:hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-charcoal tracking-wide">
            {t('documentary.heading')}
          </h2>
          <span className="w-16 h-1 bg-saffron inline-block mt-3"></span>
        </div>

        {/* Featured Video Banner (Full Width Dark Card) */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="bg-charcoal text-white rounded-lg shadow-xl overflow-hidden mb-12 border border-white/5 flex flex-col md:flex-row items-stretch"
          >
            {/* Banner Left Image */}
            <div
              onClick={() => setSelectedVideo(featured.youtubeId)}
              className="relative md:w-3/5 w-full aspect-video md:aspect-auto overflow-hidden group cursor-pointer"
            >
              <img
                src={`https://img.youtube.com/vi/${featured.youtubeId}/hqdefault.jpg`}
                alt={featured.title}
                className="w-full h-full object-cover filter grayscale group-hover:scale-105 duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-charcoal/20 group-hover:bg-saffron/10 duration-300"></div>
              
              {/* Play Saffron Badge Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="p-5 bg-saffron hover:bg-saffron-dark text-white rounded-full shadow-2xl scale-95 group-hover:scale-110 duration-300 transform">
                  <Play size={28} fill="currentColor" />
                </div>
              </div>
            </div>

            {/* Banner Right Content */}
            <div className="md:w-2/5 w-full p-8 flex flex-col justify-center items-start space-y-4">
              <span className="text-saffron text-xs font-bold uppercase tracking-[0.2em] font-devanagari">
                {t('documentary.watchNow')}
              </span>
              
              <h3 className="text-2xl font-bold font-serif leading-tight font-devanagari">
                {featured.title}
              </h3>
              
              <p className="text-gray-300 text-sm leading-relaxed font-sans font-devanagari">
                {featured.description || "प्रधानमंत्री नरेन्द्र मोदी के जीवन, यात्रा और उनके महान दृष्टिकोण पर आधारित एक प्रेरणादायक वृत्तचित्र।"}
              </p>

              <button
                onClick={() => setSelectedVideo(featured.youtubeId)}
                className="px-6 py-2.5 bg-saffron hover:bg-saffron-dark text-white font-medium rounded text-sm transition-colors duration-200 font-devanagari"
              >
                {t('documentary.watchNow')}
              </button>
            </div>
          </motion.div>
        )}

        {/* 2-Column Video Grid */}
        {gridVideos.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {gridVideos.map((video, index) => (
              <motion.div
                key={video._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded border border-gray-100 shadow overflow-hidden text-left"
              >
                {/* Thumbnail card with play overlay */}
                <div
                  onClick={() => setSelectedVideo(video.youtubeId)}
                  className="relative aspect-video w-full overflow-hidden group cursor-pointer"
                >
                  <img
                    src={`https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`}
                    alt={video.title}
                    className="w-full h-full object-cover filter grayscale group-hover:scale-105 duration-500"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-saffron/10 duration-300"></div>
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="p-4 bg-saffron hover:bg-saffron-dark text-white rounded-full shadow-lg scale-90 group-hover:scale-105 duration-300">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>
                </div>

                {/* Video Info */}
                <div className="p-5 space-y-1">
                  <h4 className="text-lg font-bold font-serif text-charcoal leading-snug line-clamp-1 font-devanagari">
                    {video.title}
                  </h4>
                  {video.date && (
                    <span className="text-xs text-gray-500 font-sans block">
                      {formatDate(video.date)}
                    </span>
                  )}
                  {video.description && (
                    <p className="text-gray-600 text-xs mt-2 line-clamp-2 font-devanagari leading-relaxed">
                      {video.description}
                    </p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>

      {/* Video Lightbox Player Modal */}
      {selectedVideo && (
        <VideoModal
          youtubeId={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </section>
  );
};

export default DocumentarySection;
