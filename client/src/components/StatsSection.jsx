import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import * as LucideIcons from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// Custom CountUp implementation to avoid React 19 external library issues
const CustomCountUp = ({ end, duration = 2000 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const endVal = parseFloat(end);
    if (isNaN(endVal)) {
      setCount(0);
      return;
    }

    let startTime = null;
    let animationFrameId;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      const currentValue = progress * endVal;
      
      // Check if we need decimals
      if (endVal % 1 !== 0) {
        setCount(parseFloat(currentValue.toFixed(1)));
      } else {
        setCount(Math.floor(currentValue));
      }

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(animate);
      } else {
        setCount(endVal);
      }
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [end, duration]);

  return <>{count}</>;
};

const parseStatNumber = (numStr) => {
  if (numStr === undefined || numStr === null) return { val: 0, suffix: '' };
  
  // Force conversion to string
  const str = String(numStr).trim();
  if (!str) return { val: 0, suffix: '' };

  // Matches leading numbers/decimals, e.g. "4", "30.5", "100" and captures the rest
  const match = str.match(/^([\d.,]+)(.*)$/);
  if (match) {
    const val = parseFloat(match[1].replace(/,/g, ''));
    return {
      val: isNaN(val) ? 0 : val,
      suffix: match[2]
    };
  }
  return { val: 0, suffix: str };
};

// Safely resolve Lucide icon components case-insensitively
const getIconComponent = (iconName) => {
  const fallback = LucideIcons.CheckCircle || LucideIcons.Check || (() => null);
  if (!iconName) return fallback;

  // Convert kebab-case or lowercase to PascalCase (e.g. check-circle -> CheckCircle, home -> Home)
  const pascalName = iconName
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join('');

  return LucideIcons[pascalName] || fallback;
};

const StatCard = ({ iconName, number, label }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const IconComponent = getIconComponent(iconName);
  const { val, suffix } = parseStatNumber(number);

  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center p-6 bg-white/5 border border-white/10 rounded shadow-lg backdrop-blur-sm z-10 transition-all duration-300 hover:border-saffron/40 hover:-translate-y-1"
    >
      <div className="p-3 bg-saffron/10 text-saffron rounded-full mb-4">
        {/* Render icon safely */}
        <IconComponent size={32} />
      </div>
      
      <span className="text-4xl md:text-5xl font-extrabold text-saffron font-serif flex items-center justify-center font-devanagari">
        {inView ? (
          <CustomCountUp end={val} />
        ) : (
          0
        )}
        <span>{suffix}</span>
      </span>
      
      <p className="mt-3 text-sm md:text-base font-semibold text-white tracking-wide font-devanagari">
        {label}
      </p>
    </div>
  );
};

const StatsSection = ({ stats }) => {
  const { t } = useLanguage();
  const safeStats = Array.isArray(stats) ? stats : [];

  return (
    <section id="achievements" className="relative py-20 bg-charcoal text-white overflow-hidden print:py-8 print:bg-white print:text-black">
      
      {/* Saffron India Map Watermark Background */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none select-none opacity-[0.03] print:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 800 900"
          className="w-full max-w-[650px] fill-current text-saffron"
        >
          <path d="M400,50 L420,80 L440,90 L430,120 L450,150 L460,180 L480,200 L510,180 L530,220 L520,250 L560,280 L590,320 L580,360 L540,380 L500,420 L520,460 L530,490 L510,520 L480,560 L490,620 L460,670 L470,720 L450,780 L410,820 L390,850 L370,800 L380,750 L390,700 L370,650 L350,600 L360,560 L380,520 L350,480 L320,440 L280,410 L250,380 L200,360 L180,320 L150,300 L180,270 L210,260 L230,210 L260,200 L290,170 L300,120 L340,90 L370,80 Z" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        {/* Section Title */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-white tracking-wide">
            {t('stats.heading')}
          </h2>
          <span className="w-16 h-1 bg-saffron inline-block mt-3"></span>
        </div>

        {/* 4-column Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {safeStats.map((stat, index) => (
            <StatCard
              key={stat._id || index}
              iconName={stat.icon}
              number={stat.number}
              label={stat.label}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
