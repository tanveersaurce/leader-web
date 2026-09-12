import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const WhatsAppButton = () => {
  const { t } = useLanguage();
  const shareText = encodeURIComponent(`"${t('quote.text')}" - ${t('quote.leader')} | ${window.location.origin}`);
  const whatsappUrl = `https://api.whatsapp.com/send?text=${shareText}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 left-6 z-40 p-3 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-xl hover:scale-110 active:scale-95 transition-all duration-300 no-print flex items-center justify-center"
      aria-label="WhatsApp पर साझा करें"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.73-1.45L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.965C16.638 1.977 14.168 1.05 11.54 1.05 6.104 1.05 1.68 5.42 1.677 10.85c-.001 1.702.443 3.363 1.29 4.843l-.973 3.553 3.653-.942zm11.75-6.848c-.282-.141-1.67-.82-1.928-.916-.258-.094-.446-.141-.634.141-.188.281-.727.916-.89 1.101-.163.186-.326.208-.608.067-.282-.141-1.19-.439-2.268-1.402-.84-.75-1.407-1.675-1.572-1.956-.165-.281-.018-.433.123-.574.127-.127.282-.328.423-.492.141-.164.188-.281.282-.47.094-.187.047-.351-.023-.492-.07-.141-.634-1.523-.867-2.086-.228-.547-.46-.473-.634-.482-.164-.008-.352-.01-.54-.01s-.492.07-.75.351c-.258.281-.984.961-.984 2.344 0 1.383 1.008 2.719 1.15 2.906.14.187 1.984 3.029 4.81 4.25.672.291 1.2.464 1.61.595.675.214 1.287.184 1.772.112.54-.08 1.67-.68 1.906-1.336.236-.656.236-1.22.165-1.336-.07-.117-.258-.203-.54-.344z" />
      </svg>
    </a>
  );
};

export default WhatsAppButton;
