import React from 'react';
import { motion } from 'framer-motion';
import { useLanguage } from '../context/LanguageContext';

const TestimonialsSection = () => {
  const { t } = useLanguage();

  const testimonials = [
    {
      name: "राजेश कुमार",
      role: "किसान, वाराणसी, उत्तर प्रदेश",
      text: "सिंचाई और सम्मान निधि योजनाओं से सीधे बैंक खाते में मदद मिली है। मोदी जी की योजनाओं से देश के छोटे किसान सशक्त हुए हैं।"
    },
    {
      name: "प्रिया शर्मा",
      role: "उद्यमी, बेंगलुरु, कर्नाटक",
      text: "मुद्रा ऋण योजना से मुझे अपना व्यवसाय शुरू करने में मदद मिली। आज मैं स्वयं चार महिलाओं को रोज़गार प्रदान कर रही हूँ।"
    },
    {
      name: "अमित देशपांडे",
      role: "युवा छात्र, पुणे, महाराष्ट्र",
      text: "डिजिटल इंडिया ने पढ़ाई और छात्रवृत्ति की प्रक्रिया को पूरी तरह पारदर्शी बना दिया है। आज हर सरकारी सेवा मुट्ठी में है।"
    }
  ];

  // Grayscale media outlet text brands for the scrolling marquee
  const mediaOutlets = [
    "दूरदर्शन समाचार",
    "THE TIMES OF INDIA",
    "दैनिक जागरण",
    "THE HINDU",
    "नवभारत टाइम्स",
    "HINDUSTAN TIMES",
    "दूरदर्शन समाचार",
    "THE TIMES OF INDIA",
    "दैनिक जागरण",
    "THE HINDU",
    "नवभारत टाइम्स",
    "HINDUSTAN TIMES",
  ];

  return (
    <section id="testimonials" className="py-24 bg-cream/30 border-b border-gray-100 print:py-8 print:bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold font-serif text-charcoal tracking-wide">
            {t('testimonials.heading')}
          </h2>
          <span className="w-16 h-1 bg-saffron inline-block mt-3"></span>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {testimonials.map((test, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-charcoal text-white p-8 rounded shadow-xl relative border border-white/5 flex flex-col justify-between items-start text-left print:bg-white print:text-black print:border-gray-200 print:shadow-none"
            >
              {/* Saffron Quotation Mark */}
              <span className="text-5xl text-saffron/40 font-serif absolute top-4 right-6 pointer-events-none select-none">
                “
              </span>

              <p className="text-gray-300 font-sans text-sm leading-relaxed mb-6 font-devanagari relative z-10 print:text-gray-700">
                "{test.text}"
              </p>

              <div className="space-y-1">
                <h4 className="text-base font-bold font-serif text-saffron font-devanagari">
                  {test.name}
                </h4>
                <p className="text-xs text-gray-400 font-sans font-devanagari print:text-gray-500">
                  {test.role}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Press Logos Horizontal Infinite Auto-Scroll Marquee */}
        <div className="relative border-t border-b border-gray-200 py-8 overflow-hidden no-print">
          <div className="flex w-[200%] items-center animate-marquee whitespace-nowrap">
            {mediaOutlets.map((media, idx) => (
              <div
                key={idx}
                className="w-1/6 text-center text-gray-400 hover:text-charcoal duration-300 font-bold tracking-widest text-base sm:text-lg font-serif select-none"
              >
                {media}
              </div>
            ))}
          </div>
          
          {/* Gradients on edges */}
          <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-cream/80 to-transparent pointer-events-none"></div>
          <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-cream/80 to-transparent pointer-events-none"></div>
        </div>

      </div>
    </section>
  );
};

export default TestimonialsSection;
