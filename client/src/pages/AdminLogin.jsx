import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { KeyRound, Mail, Lock, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AdminLogin = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/admin/dashboard');
    }
  }, [navigate]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('सत्यापन किया जा रहा है...');

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/login`;
      const response = await axios.post(apiUrl, formData);
      
      const { token, username, isFirstLogin } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('username', username);
      localStorage.setItem('isFirstLogin', isFirstLogin ? 'true' : 'false');

      toast.success('प्रवेश स्वीकृत!', { id: toastId });
      
      // Navigate to dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error(error);
      const msg = error.response?.data?.message || 'लॉगिन विफल रहा। कृपया पुनः प्रयास करें।';
      toast.error(msg, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F5F0EB] via-white to-[#E8E8E8] flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative">
      {/* Back to Home action */}
      <button
        onClick={() => navigate('/')}
        className="absolute top-6 left-6 flex items-center gap-2 text-charcoal hover:text-saffron transition-colors font-semibold text-sm font-devanagari focus-visible:outline focus-visible:outline-3 focus-visible:outline-saffron focus-visible:outline-offset-2"
      >
        <ArrowLeft size={16} />
        मुख्य पेज पर जाएं
      </button>

      <div className="sm:mx-auto sm:w-full sm:max-w-md space-y-3">
        {/* Lotus Emblem */}
        <div className="flex justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 100 100"
            className="w-16 h-16 fill-current text-saffron drop-shadow-md animate-pulse"
          >
            <path d="M50 15 C46 26 35 34 22 39 C36 43 45 43 50 56 C55 43 64 43 78 39 C65 34 54 26 50 15 Z" />
            <path d="M50 37 C42 47 28 52 10 52 C28 56 40 56 50 71 C60 56 72 56 90 52 C72 52 58 47 50 37 Z" />
            <path d="M50 80 C46 85 38 88 30 91 L70 91 C62 88 54 85 50 80 Z" />
          </svg>
        </div>
        <h2 className="text-center text-3xl font-extrabold font-serif text-charcoal font-devanagari">
          {t('admin.loginTitle')}
        </h2>
        <span className="w-12 h-1 bg-saffron inline-block mx-auto rounded"></span>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow-xl rounded-lg border border-gray-100 sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            
            {/* Username/Email Input */}
            <div className="flex flex-col items-start space-y-1">
              <label htmlFor="username" className="text-sm font-semibold text-charcoal font-devanagari">
                {t('admin.usernameLabel')}
              </label>
              <div className="relative w-full rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  name="username"
                  id="username"
                  required
                  placeholder="admin@narendramodi.in"
                  value={formData.username}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-saffron focus:border-saffron text-sm bg-gray-50/50"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="flex flex-col items-start space-y-1">
              <label htmlFor="password" className="text-sm font-semibold text-charcoal font-devanagari">
                {t('admin.passwordLabel')}
              </label>
              <div className="relative w-full rounded-md shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                  <Lock size={16} />
                </div>
                <input
                  type="password"
                  name="password"
                  id="password"
                  required
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-saffron focus:border-saffron text-sm bg-gray-50/50"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-2.5 px-4 border-2 border-transparent rounded shadow-md text-sm font-bold text-white bg-saffron hover:bg-saffron-dark focus:outline-none transition-colors duration-200 gap-2 items-center font-devanagari"
              >
                <KeyRound size={16} />
                {t('admin.loginBtn')}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
