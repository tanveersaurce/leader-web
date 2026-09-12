import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center text-white px-4">
      {/* India Gate B&W Background */}
      <div className="absolute inset-0 z-0 bg-charcoal pointer-events-none select-none">
        <img
          src="https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=1600"
          alt="India Gate"
          className="w-full h-full object-cover filter grayscale opacity-25"
          loading="lazy"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 text-center space-y-6 max-w-md w-full">
        <h1 className="text-8xl font-serif font-extrabold text-saffron tracking-wider select-none animate-pulse">
          404
        </h1>
        
        <div className="space-y-2">
          <h2 className="text-3xl font-bold font-serif font-devanagari text-white">
            पृष्ठ नहीं मिला
          </h2>
          <p className="text-gray-400 font-sans text-sm tracking-wide">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>

        <button
          onClick={() => navigate('/')}
          className="inline-flex items-center gap-2 px-8 py-3 bg-saffron hover:bg-saffron-dark text-white font-bold rounded shadow-lg hover:shadow-xl transition-all duration-200 font-devanagari focus-visible:outline focus-visible:outline-3 focus-visible:outline-saffron focus-visible:outline-offset-2"
        >
          <ArrowLeft size={16} />
          होम पेज पर जाएं
        </button>
      </div>
    </div>
  );
};

export default NotFound;
