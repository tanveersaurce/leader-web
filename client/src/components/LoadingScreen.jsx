import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen = () => {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.5 } }}
      className="fixed inset-0 z-[9999] flex flex-col justify-center items-center bg-white"
    >
      <div className="relative">
        {/* Animated Lotus SVG */}
        <motion.svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 120 120"
          className="w-32 h-32 fill-current text-saffron"
          animate={{
            scale: [1, 1.08, 1],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          {/* Detailed Lotus Petals Silhouette */}
          <path d="M60,10 C57,25 45,35 30,40 C45,45 55,45 60,65 C65,45 75,45 90,40 C75,35 63,25 60,10 Z" />
          <path d="M60,35 C52,48 35,53 15,53 C35,58 50,58 60,78 C70,58 85,58 105,53 C85,53 68,48 60,35 Z" />
          <path d="M60,55 C55,68 40,73 20,74 C38,78 52,78 60,95 C68,78 82,78 100,74 C80,73 65,68 60,55 Z" />
          {/* Base / Stem */}
          <path d="M60,88 C55,95 45,98 35,102 L85,102 C75,98 65,95 60,88 Z" fillRule="evenodd" />
        </motion.svg>
        
        {/* Radial Pulse Effect */}
        <div className="absolute inset-0 w-32 h-32 border-4 border-saffron/20 rounded-full animate-ping opacity-75"></div>
      </div>
      
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mt-6 text-sm font-semibold text-charcoal tracking-[0.2em] font-serif uppercase"
      >
        जन सेवा ही ईश्वर सेवा
      </motion.p>
    </motion.div>
  );
};

export default LoadingScreen;
