import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-scroll';
import { useLanguage } from '../context/LanguageContext';

const HeroSection = ({ leader }) => {
  const { t } = useLanguage();
  
  const name = leader?.name || t('hero.title');
  const title = leader?.title || t('hero.tag');
  const tagline = leader?.tagline || t('hero.tagline');
  // 🖼️ Header ki main portrait image (Manual link - Admin Panel profile photo se alag rahegi):
  const mainImage = 'https://imgs.search.brave.com/oK9UIbmWjKBdnr4IK1ew2JuSEe_Ev73B45QOnD4V620/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZXR0eWltYWdl/cy5jb20vaWQvMTE0/NTgwNzg1NS9waG90/by9hbWl0LXNoYWgt/cHJlc2lkZW50LW9m/LXRoZS1iaGFydGl5/YS1qYW5hdGEtcGFy/dHktbGVmdC1hbmQt/bmFyZW5kcmEtbW9k/aS1pbmRpYXMtcHJp/bWUtbWluaXN0ZXIu/anBnP3M9NjEyeDYx/MiZ3PTAmaz0yMCZj/PUxKa3RmS0QyVVVF/a3NROEZaSE50cDA3/RTI3ZXAxeXZ5MFd1/ZHpBdlFDSGM9';
  
  // 📸 Header ke background mein aane wali 4 images yahan badal sakte hain:
  const defaultCollageImages = [
    'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=500',
    'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=500',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500',
    'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=500'
  ];

  const collage = defaultCollageImages;

  return (
    <section className="relative min-h-screen flex items-center bg-gradient-to-br from-cream via-[#F5F0EB] to-[#E2DBD5] pt-24 overflow-hidden print:min-h-0 print:pt-4">
      {/* Big Watermark background text */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] overflow-hidden no-print">
        <h1 className="text-[12vw] font-bold font-serif uppercase tracking-widest text-charcoal leading-none rotate-12">
          ONE LEADER ONE VISION
        </h1>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full z-10 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center print:grid-cols-1">
        {/* Left Side Content - Animates from Left */}
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="lg:col-span-6 space-y-6 text-center lg:text-left print:text-left"
        >
          <span className="inline-block text-saffron font-bold text-xs sm:text-sm tracking-[0.25em] uppercase font-devanagari">
            {title}
          </span>
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold font-serif text-charcoal leading-tight">
            {name}
          </h1>
          <p className="text-xl sm:text-2xl italic text-gray-700 font-devanagari border-l-4 border-saffron pl-4 inline-block lg:block text-left">
            "{tagline}"
          </p>

          <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-4 no-print">
            <Link
              to="journey"
              smooth={true}
              offset={-70}
              duration={600}
              className="px-8 py-3 bg-saffron hover:bg-saffron-dark text-white font-medium rounded shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all cursor-pointer font-devanagari"
            >
              {t('hero.journeyBtn')}
            </Link>
            <Link
              to="vision"
              smooth={true}
              offset={-70}
              duration={600}
              className="px-8 py-3 border-2 border-charcoal hover:border-saffron text-charcoal hover:text-saffron font-medium rounded hover:-translate-y-0.5 transition-all cursor-pointer font-devanagari"
            >
              {t('hero.visionBtn')}
            </Link>
          </div>
        </motion.div>

        {/* Right Side Collage - Animates from Right with Delay */}
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0, delay: 0.2 }}
          className="lg:col-span-6 relative flex justify-center items-center h-[450px] md:h-[600px] w-full print:hidden"
        >
          {/* Faint collage images placed absolutely behind */}
          {collage.slice(0, 5).map((imgUrl, index) => {
            const positions = [
              "top-6 -left-6 w-24 h-24 -rotate-12",
              "top-12 right-2 w-28 h-36 rotate-6",
              "bottom-10 left-4 w-32 h-24 rotate-3",
              "bottom-8 -right-8 w-28 h-28 -rotate-6",
              "top-1/3 left-1/2 w-24 h-32 -translate-x-1/2 -rotate-1"
            ];
            
            return (
              <div
                key={index}
                className={`absolute ${positions[index]} opacity-30 border border-white bg-white p-1.5 shadow-md overflow-hidden rounded transform hover:opacity-80 transition-all duration-300 z-0`}
              >
                <img
                  src={imgUrl}
                  alt="Background memory"
                  className="w-full h-full object-cover filter grayscale"
                  loading="lazy"
                />
              </div>
            );
          })}

          {/* Central main portrait frame */}
          <div className="relative w-[280px] sm:w-[350px] aspect-[3/4] bg-white border-8 border-white shadow-2xl rounded overflow-hidden z-10 group">
            <img
              src={mainImage}
              alt={name}
              className="w-full h-full object-cover photo-bw transform group-hover:scale-105 duration-500"
              loading="lazy"
            />
            {/* Double exposure multiply color layer */}
            <div className="absolute inset-0 bg-saffron/10 double-exposure-blend pointer-events-none transition-opacity duration-300 group-hover:opacity-0"></div>
            
            {/* Elegant thin saffron inner border */}
            <div className="absolute inset-3 border border-saffron/30 pointer-events-none group-hover:border-saffron transition-all duration-300"></div>
          </div>

          {/* Saffron accent shapes */}
          <div className="absolute -bottom-4 -left-4 w-36 h-36 border-b-4 border-l-4 border-saffron/30 z-0 pointer-events-none"></div>
          <div className="absolute -top-4 -right-4 w-36 h-36 border-t-4 border-r-4 border-saffron/30 z-0 pointer-events-none"></div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
