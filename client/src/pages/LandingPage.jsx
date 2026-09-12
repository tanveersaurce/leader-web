import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLanguage } from '../context/LanguageContext';
import { AnimatePresence } from 'framer-motion';

import LoadingScreen from '../components/LoadingScreen';
import ReactHelmet from '../components/ReactHelmet';
import ScrollProgress from '../components/ScrollProgress';
import BackToTop from '../components/BackToTop';
import PrivacyNotice from '../components/PrivacyNotice';
import WhatsAppButton from '../components/WhatsAppButton';

import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import IntroSection from '../components/IntroSection';
import TimelineSection from '../components/TimelineSection';
import StatsSection from '../components/StatsSection';
import VisionSection from '../components/VisionSection';
import DocumentarySection from '../components/DocumentarySection';
import GallerySection from '../components/GallerySection';
import QuoteSection from '../components/QuoteSection';
import TestimonialsSection from '../components/TestimonialsSection';
import ContactSection from '../components/ContactSection';
import Footer from '../components/Footer';

const LandingPage = () => {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [leader, setLeader] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [stats, setStats] = useState([]);
  const [visions, setVisions] = useState([]);
  const [videos, setVideos] = useState([]);
  const [gallery, setGallery] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();
      const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';

      try {
        const [
          leaderRes,
          timelineRes,
          statsRes,
          visionsRes,
          videosRes,
          galleryRes
        ] = await Promise.all([
          axios.get(`${apiUrl}/api/leader`).catch(() => ({ data: null })),
          axios.get(`${apiUrl}/api/timeline`).catch(() => ({ data: [] })),
          axios.get(`${apiUrl}/api/stats`).catch(() => ({ data: [] })),
          axios.get(`${apiUrl}/api/vision`).catch(() => ({ data: [] })),
          axios.get(`${apiUrl}/api/videos`).catch(() => ({ data: [] })),
          axios.get(`${apiUrl}/api/gallery`).catch(() => ({ data: [] }))
        ]);

        setLeader(leaderRes.data);
        setTimeline(timelineRes.data);
        setStats(statsRes.data);
        setVisions(visionsRes.data);
        setVideos(videosRes.data);
        setGallery(galleryRes.data);
      } catch (error) {
        console.error('Error loading API resources:', error);
      } finally {
        const timeElapsed = Date.now() - startTime;
        const minimumLoadingTime = 1500; // 1.5 seconds minimum loader
        const remainingTime = Math.max(0, minimumLoadingTime - timeElapsed);

        setTimeout(() => {
          setLoading(false);
        }, remainingTime);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <ReactHelmet />
      
      <AnimatePresence mode="wait">
        {loading && <LoadingScreen key="loader" />}
      </AnimatePresence>

      {!loading && (
        <div className="relative min-h-screen flex flex-col">
          <ScrollProgress />
          <Navbar />
          
          <main className="flex-grow">
            <HeroSection leader={leader} />
            <IntroSection leader={leader} />
            <TimelineSection timelineItems={timeline} />
            <StatsSection stats={stats} />
            <VisionSection visions={visions} />
            <DocumentarySection videos={videos} />
            <GallerySection gallery={gallery} />
            <QuoteSection />
            <TestimonialsSection />
            <ContactSection />
          </main>

          <Footer leader={leader} />
          
          {/* Helper overlay buttons */}
          <BackToTop />
          <WhatsAppButton />
          <PrivacyNotice />
        </div>
      )}
    </>
  );
};

export default LandingPage;
