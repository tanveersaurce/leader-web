import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  User,
  Calendar,
  BarChart3,
  Compass,
  Video,
  Image as ImageIcon,
  Mail,
  LogOut,
  Plus,
  Trash2,
  Check,
  Download,
  AlertTriangle,
  Move,
  Eye,
  Lock
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

// -------------------------------------------------------------
// SORTABLE ITEM WRAPPER COMPONENT
// -------------------------------------------------------------
const SortableItem = ({ id, children }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  };

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-gray-100 hover:bg-gray-50/50">
      <td className="p-4 text-center w-12 print:hidden">
        <button
          type="button"
          {...attributes}
          {...listeners}
          className="p-1 text-gray-400 hover:text-saffron cursor-grab active:cursor-grabbing"
          title="Drag to reorder"
        >
          <Move size={16} />
        </button>
      </td>
      {children}
    </tr>
  );
};

const AdminDashboard = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  // Active Sidebar Tab State
  const [activeTab, setActiveTab] = useState('profile');

  // API Data States
  const [leader, setLeader] = useState({ name: '', title: '', tagline: '', bio: '', heroImage: '', collageImages: [] });
  const [timeline, setTimeline] = useState([]);
  const [stats, setStats] = useState([]);
  const [visions, setVisions] = useState([]);
  const [videos, setVideos] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [messages, setMessages] = useState([]);

  // CMS Loading State
  const [loading, setLoading] = useState(true);

  // Password Modification Modal States (Forced password update)
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');

  // Auto Logout / Inactivity State
  const [warningModalOpen, setWarningModalOpen] = useState(false);
  const activityTimer = useRef(null);
  const warningTimer = useRef(null);

  // File Upload Previews
  const [heroPreview, setHeroPreview] = useState(null);
  const [timelineFile, setTimelineFile] = useState(null);
  const [timelinePreview, setTimelinePreview] = useState(null);
  const [visionFile, setVisionFile] = useState(null);
  const [visionPreview, setVisionPreview] = useState(null);
  const [galleryFile, setGalleryFile] = useState(null);
  const [galleryPreview, setGalleryPreview] = useState(null);

  // Creation Modals or Forms Toggle
  const [newTimeline, setNewTimeline] = useState({ year: '', title: '', description: '' });
  const [newStat, setNewStat] = useState({ icon: 'CheckCircle', number: '', label: '' });
  const [newVision, setNewVision] = useState({ title: '', description: '' });
  const [newVideo, setNewVideo] = useState({ youtubeId: '', title: '', description: '', isFeatured: false });
  const [newGallery, setNewGallery] = useState({ caption: '', location: '', year: '' });

  // -------------------------------------------------------------
  // INACTIVITY SESSION TIMEOUT (30 mins inactivity, 25 mins warning)
  // -------------------------------------------------------------
  const resetInactivityTimers = () => {
    if (activityTimer.current) clearTimeout(activityTimer.current);
    if (warningTimer.current) clearTimeout(warningTimer.current);

    // Set 25 min Warning Timer (1500000 ms)
    warningTimer.current = setTimeout(() => {
      setWarningModalOpen(true);
    }, 25 * 60 * 1000);

    // Set 30 min Logout Timer (1800000 ms)
    activityTimer.current = setTimeout(() => {
      handleLogout();
      toast.error('Session expired due to inactivity.');
    }, 30 * 60 * 1000);
  };

  useEffect(() => {
    if (!token) {
      navigate('/admin');
      return;
    }

    // Register active user listeners
    const events = ['mousemove', 'mousedown', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, resetInactivityTimers));

    resetInactivityTimers();

    return () => {
      events.forEach(event => window.removeEventListener(event, resetInactivityTimers));
      if (activityTimer.current) clearTimeout(activityTimer.current);
      if (warningTimer.current) clearTimeout(warningTimer.current);
    };
  }, [token]);

  // -------------------------------------------------------------
  // API LOAD INGESTION
  // -------------------------------------------------------------
  const axiosConfig = {
    headers: { Authorization: `Bearer ${token}` }
  };

  const loadAllData = async () => {
    const isFirstLogin = localStorage.getItem('isFirstLogin') === 'true';
    if (isFirstLogin) {
      setShowPasswordModal(true);
      setLoading(false);
      return;
    }

    setLoading(true);
    const apiUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    try {
      const [
        leaderRes,
        timelineRes,
        statsRes,
        visionsRes,
        videosRes,
        galleryRes,
        messagesRes
      ] = await Promise.all([
        axios.get(`${apiUrl}/api/leader`),
        axios.get(`${apiUrl}/api/timeline`),
        axios.get(`${apiUrl}/api/stats`),
        axios.get(`${apiUrl}/api/vision`),
        axios.get(`${apiUrl}/api/videos`),
        axios.get(`${apiUrl}/api/gallery`),
        axios.get(`${apiUrl}/api/messages`, axiosConfig)
      ]);

      setLeader(leaderRes.data);
      setTimeline(timelineRes.data);
      setStats(statsRes.data);
      setVisions(visionsRes.data);
      setVideos(videosRes.data);
      setGallery(galleryRes.data);
      setMessages(messagesRes.data);

      // Trigger password modal if first login
      const isFirstLogin = localStorage.getItem('isFirstLogin') === 'true';
      if (isFirstLogin) {
        setShowPasswordModal(true);
      }
    } catch (error) {
      console.error(error);
      if (error.response?.status === 401) {
        handleLogout();
      } else {
        toast.error('Failed to load portfolio items.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      loadAllData();
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('isFirstLogin');
    navigate('/admin');
  };

  // -------------------------------------------------------------
  // PASSWORD UPDATE FOR FIRST-LOGIN FLOW
  // -------------------------------------------------------------
  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/auth/change-password`;
      await axios.post(apiUrl, { newPassword }, axiosConfig);
      toast.success('Password changed successfully.');
      localStorage.setItem('isFirstLogin', 'false');
      setShowPasswordModal(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password update failed.');
    }
  };

  // -------------------------------------------------------------
  // DND REORDER BINDINGS (Timeline, Stats, Visions)
  // -------------------------------------------------------------
  const sensors = useSensors(useSensor(PointerSensor));

  const handleDragEnd = async (event, type) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    let itemsList = [];
    let setListFunc = null;
    let endpoint = '';

    if (type === 'timeline') {
      itemsList = [...timeline];
      setListFunc = setTimeline;
      endpoint = 'timeline';
    } else if (type === 'stats') {
      itemsList = [...stats];
      setListFunc = setStats;
      endpoint = 'stats';
    } else if (type === 'vision') {
      itemsList = [...visions];
      setListFunc = setVisions;
      endpoint = 'vision';
    }

    const oldIndex = itemsList.findIndex((item) => item._id === active.id);
    const newIndex = itemsList.findIndex((item) => item._id === over.id);

    const reordered = arrayMove(itemsList, oldIndex, newIndex);
    // Recalculate orders
    const orderArray = reordered.map((item, idx) => ({
      id: item._id,
      order: idx + 1
    }));

    // Optimistically set list
    setListFunc(reordered);

    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/${endpoint}/reorder`;
      await axios.put(apiUrl, { orderArray }, axiosConfig);
      toast.success('Sorting order updated.');
    } catch (error) {
      toast.error('Failed to save sorted order. Reloading...');
      loadAllData();
    }
  };

  // -------------------------------------------------------------
  // PROFILE SUBMISSION HANDLER
  // -------------------------------------------------------------
  const [heroFile, setHeroFile] = useState(null);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', leader.name);
    formData.append('title', leader.title);
    formData.append('tagline', leader.tagline);
    formData.append('bio', leader.bio);
    if (heroFile) {
      formData.append('heroImage', heroFile);
    }

    const loadToast = toast.loading('Saving profile changes...');
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/leader`;
      const response = await axios.put(apiUrl, formData, {
        headers: {
          ...axiosConfig.headers,
          'Content-Type': 'multipart/form-data'
        }
      });
      setLeader(response.data);
      toast.success('Profile updated successfully!', { id: loadToast });
    } catch (error) {
      toast.error('Failed to update leader profile.', { id: loadToast });
    }
  };

  // File selectors with size validator (5MB) & preview
  const handleFileChange = (e, setFile, setPreview) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File size exceeds 5MB limit.');
      return;
    }

    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Only JPEG, PNG, or WebP images are allowed.');
      return;
    }

    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  // -------------------------------------------------------------
  // TIMELINE ADD HANDLER
  // -------------------------------------------------------------
  const handleAddTimeline = async (e) => {
    e.preventDefault();
    if (!timelineFile) {
      toast.error('Event thumbnail image is required.');
      return;
    }

    const formData = new FormData();
    formData.append('year', newTimeline.year);
    formData.append('title', newTimeline.title);
    formData.append('description', newTimeline.description);
    formData.append('image', timelineFile);
    formData.append('order', timeline.length + 1);

    const loadToast = toast.loading('Adding event...');
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/timeline`;
      await axios.post(apiUrl, formData, {
        headers: { ...axiosConfig.headers, 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Event added successfully!', { id: loadToast });
      setNewTimeline({ year: '', title: '', description: '' });
      setTimelineFile(null);
      setTimelinePreview(null);
      loadAllData();
    } catch (error) {
      toast.error('Failed to add timeline event.', { id: loadToast });
    }
  };

  const handleDeleteTimeline = async (id) => {
    if (!window.confirm('Delete this event?')) return;
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/timeline/${id}`;
      await axios.delete(apiUrl, axiosConfig);
      toast.success('Event deleted.');
      loadAllData();
    } catch (error) {
      toast.error('Deletion failed.');
    }
  };

  // -------------------------------------------------------------
  // STATS ADD HANDLER
  // -------------------------------------------------------------
  const handleAddStat = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stats`;
      await axios.post(apiUrl, { ...newStat, order: stats.length + 1 }, axiosConfig);
      toast.success('Stat card created.');
      setNewStat({ icon: 'CheckCircle', number: '', label: '' });
      loadAllData();
    } catch (error) {
      toast.error('Creation failed.');
    }
  };

  const handleDeleteStat = async (id) => {
    if (!window.confirm('Delete this stat card?')) return;
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/stats/${id}`;
      await axios.delete(apiUrl, axiosConfig);
      toast.success('Stat deleted.');
      loadAllData();
    } catch (error) {
      toast.error('Deletion failed.');
    }
  };

  // -------------------------------------------------------------
  // VISION ADD HANDLER
  // -------------------------------------------------------------
  const handleAddVision = async (e) => {
    e.preventDefault();
    if (!visionFile) {
      toast.error('Background image is required.');
      return;
    }
    const formData = new FormData();
    formData.append('title', newVision.title);
    formData.append('description', newVision.description);
    formData.append('backgroundImage', visionFile);
    formData.append('order', visions.length + 1);

    const loadToast = toast.loading('Creating vision card...');
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vision`;
      await axios.post(apiUrl, formData, {
        headers: { ...axiosConfig.headers, 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Vision card added!', { id: loadToast });
      setNewVision({ title: '', description: '' });
      setVisionFile(null);
      setVisionPreview(null);
      loadAllData();
    } catch (error) {
      toast.error('Failed to create vision card.', { id: loadToast });
    }
  };

  const handleDeleteVision = async (id) => {
    if (!window.confirm('Delete this vision item?')) return;
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/vision/${id}`;
      await axios.delete(apiUrl, axiosConfig);
      toast.success('Vision card deleted.');
      loadAllData();
    } catch (error) {
      toast.error('Deletion failed.');
    }
  };

  // -------------------------------------------------------------
  // VIDEOS ADD HANDLER
  // -------------------------------------------------------------
  const handleAddVideo = async (e) => {
    e.preventDefault();
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos`;
      await axios.post(apiUrl, newVideo, axiosConfig);
      toast.success('Video link added.');
      setNewVideo({ youtubeId: '', title: '', description: '', isFeatured: false });
      loadAllData();
    } catch (error) {
      toast.error('Failed to add video link.');
    }
  };

  const handleDeleteVideo = async (id) => {
    if (!window.confirm('Remove this video?')) return;
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/videos/${id}`;
      await axios.delete(apiUrl, axiosConfig);
      toast.success('Video removed.');
      loadAllData();
    } catch (error) {
      toast.error('Deletion failed.');
    }
  };

  // -------------------------------------------------------------
  // GALLERY ADD HANDLER
  // -------------------------------------------------------------
  const handleAddGallery = async (e) => {
    e.preventDefault();
    if (!galleryFile) {
      toast.error('Gallery image is required.');
      return;
    }
    const formData = new FormData();
    formData.append('caption', newGallery.caption);
    formData.append('location', newGallery.location);
    formData.append('year', newGallery.year);
    formData.append('image', galleryFile);

    const loadToast = toast.loading('Uploading gallery photo...');
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gallery/upload`;
      await axios.post(apiUrl, formData, {
        headers: { ...axiosConfig.headers, 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Photo added successfully!', { id: loadToast });
      setNewGallery({ caption: '', location: '', year: '' });
      setGalleryFile(null);
      setGalleryPreview(null);
      loadAllData();
    } catch (error) {
      toast.error('Upload failed.', { id: loadToast });
    }
  };

  const handleDeleteGallery = async (id) => {
    if (!window.confirm('Delete this gallery photo?')) return;
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/gallery/${id}`;
      await axios.delete(apiUrl, axiosConfig);
      toast.success('Photo deleted.');
      loadAllData();
    } catch (error) {
      toast.error('Deletion failed.');
    }
  };

  // -------------------------------------------------------------
  // INBOX ACTIONS & CSV EXPORT
  // -------------------------------------------------------------
  const handleMarkMessageRead = async (id) => {
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/messages/${id}/read`;
      await axios.put(apiUrl, {}, axiosConfig);
      loadAllData();
    } catch (error) {
      toast.error('Failed to change message status.');
    }
  };

  const handleDeleteMessage = async (id) => {
    if (!window.confirm('Delete this message permanently?')) return;
    try {
      const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/api/messages/${id}`;
      await axios.delete(apiUrl, axiosConfig);
      toast.success('Message deleted.');
      loadAllData();
    } catch (error) {
      toast.error('Deletion failed.');
    }
  };

  const exportToCSV = () => {
    const headers = ['Name', 'Email', 'City', 'Message', 'Date'];
    const rows = messages.map(msg => [
      `"${msg.name.replace(/"/g, '""')}"`,
      `"${msg.email.replace(/"/g, '""')}"`,
      `"${msg.city.replace(/"/g, '""')}"`,
      `"${msg.message.replace(/"/g, '""')}"`,
      new Date(msg.createdAt).toLocaleString()
    ]);
    const csvContent = "data:text/csv;charset=utf-8,"
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `submissions_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getFullUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    return `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}${url}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center font-devanagari">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-saffron border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-500 font-medium">डेटा लोड हो रहा है...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex text-left font-sans">
      
      {/* Sidebar Panel */}
      <aside className="w-64 bg-charcoal text-white shrink-0 flex flex-col justify-between hidden md:flex border-r border-gray-800">
        <div>
          <div className="p-6 border-b border-gray-800 flex items-center gap-3">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 100 100"
              className="w-7 h-7 fill-current text-saffron shrink-0"
            >
              <path d="M50 15 C46 26 35 34 22 39 C36 43 45 43 50 56 C55 43 64 43 78 39 C65 34 54 26 50 15 Z" />
              <path d="M50 37 C42 47 28 52 10 52 C28 56 40 56 50 71 C60 56 72 56 90 52 C72 52 58 47 50 37 Z" />
              <path d="M50 80 C46 85 38 88 30 91 L70 91 C62 88 54 85 50 80 Z" />
            </svg>
            <span className="font-serif font-bold text-lg">एडमिन पैनल</span>
          </div>

          <nav className="p-4 space-y-1">
            {[
              { id: 'profile', label: 'प्रोफ़ाइल', icon: <User size={18} /> },
              { id: 'timeline', label: 'जीवन यात्रा', icon: <Calendar size={18} /> },
              { id: 'stats', label: 'योजनाएं / आंकड़े', icon: <BarChart3 size={18} /> },
              { id: 'vision', label: 'दृष्टिकोण संकल्प', icon: <Compass size={18} /> },
              { id: 'videos', label: 'डॉक्युमेंट्री', icon: <Video size={18} /> },
              { id: 'gallery', label: 'गैलरी', icon: <ImageIcon size={18} /> },
              {
                id: 'messages',
                label: 'संदेश',
                icon: <Mail size={18} />,
                badge: messages.filter(m => !m.isRead).length
              }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded text-sm font-medium transition-colors font-devanagari ${
                  activeTab === tab.id
                    ? 'bg-saffron text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  {tab.icon}
                  <span>{tab.label}</span>
                </div>
                {tab.badge > 0 && (
                  <span className="px-2 py-0.5 text-xs font-bold bg-red-500 text-white rounded-full">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-white hover:bg-red-900/20 rounded transition-colors font-devanagari"
          >
            <LogOut size={18} />
            <span>लॉगआउट</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow flex flex-col min-w-0">
        
        {/* Header bar */}
        <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-8">
          <h1 className="text-xl font-bold text-charcoal font-devanagari">
            {t('admin.dashboardTitle')}
          </h1>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium text-gray-500">
              admin@narendramodi.in
            </span>
            <button
              onClick={handleLogout}
              className="md:hidden p-2 text-gray-400 hover:text-red-500"
              title="Logout"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {/* Dashboard Tabs Body */}
        <div className="flex-grow p-8 overflow-y-auto max-w-7xl w-full mx-auto">
          
          {/* TAB 1: LEADER PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 space-y-6">
              <h2 className="text-lg font-bold text-charcoal border-b border-gray-100 pb-3 font-devanagari">
                नेता प्रोफ़ाइल जानकारी संपादित करें
              </h2>
              
              <form onSubmit={handleProfileSubmit} className="space-y-6 max-w-3xl">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="flex flex-col items-start space-y-2">
                    <label className="text-sm font-semibold text-gray-700 font-devanagari">नाम</label>
                    <input
                      type="text"
                      required
                      value={leader.name}
                      onChange={(e) => setLeader({ ...leader, name: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-saffron"
                    />
                  </div>
                  <div className="flex flex-col items-start space-y-2">
                    <label className="text-sm font-semibold text-gray-700 font-devanagari">पद</label>
                    <input
                      type="text"
                      required
                      value={leader.title}
                      onChange={(e) => setLeader({ ...leader, title: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-saffron"
                    />
                  </div>
                </div>

                <div className="flex flex-col items-start space-y-2">
                  <label className="text-sm font-semibold text-gray-700 font-devanagari">टैगलाइन</label>
                  <input
                    type="text"
                    required
                    value={leader.tagline}
                    onChange={(e) => setLeader({ ...leader, tagline: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-saffron"
                  />
                </div>

                <div className="flex flex-col items-start space-y-2">
                  <label className="text-sm font-semibold text-gray-700 font-devanagari">जीवनी (Bio)</label>
                  <textarea
                    required
                    rows="6"
                    value={leader.bio}
                    onChange={(e) => setLeader({ ...leader, bio: e.target.value })}
                    className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-saffron resize-none font-devanagari"
                  ></textarea>
                </div>

                {/* Hero Image Upload Selector */}
                <div className="flex flex-col items-start space-y-2">
                  <label className="text-sm font-semibold text-gray-700 font-devanagari">मुख्य पोर्ट्रेट फोटो</label>
                  <div className="flex items-center gap-6">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, setHeroFile, setHeroPreview)}
                      className="text-sm"
                    />
                    {(heroPreview || leader.heroImage) && (
                      <div className="w-16 h-20 border rounded overflow-hidden shadow-inner bg-gray-50 shrink-0">
                        <img
                          src={heroPreview || getFullUrl(leader.heroImage)}
                          alt="Preview"
                          className="w-full h-full object-cover filter grayscale"
                        />
                      </div>
                    )}
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2 bg-saffron hover:bg-saffron-dark text-white rounded font-bold text-sm transition-colors font-devanagari"
                >
                  परिवर्तन सहेजें
                </button>
              </form>
            </div>
          )}

          {/* TAB 2: TIMELINE */}
          {activeTab === 'timeline' && (
            <div className="space-y-8">
              {/* Event Creation Form */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-charcoal border-b border-gray-100 pb-3 font-devanagari mb-6">
                  नया जीवन यात्रा कार्यक्रम जोड़ें
                </h2>

                <form onSubmit={handleAddTimeline} className="space-y-6 max-w-3xl">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col items-start space-y-2">
                      <label className="text-sm font-semibold text-gray-700 font-devanagari">वर्ष (Year)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 2014"
                        value={newTimeline.year}
                        onChange={(e) => setNewTimeline({ ...newTimeline, year: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col items-start space-y-2 sm:col-span-2">
                      <label className="text-sm font-semibold text-gray-700 font-devanagari">शीर्षक (Title)</label>
                      <input
                        type="text"
                        required
                        value={newTimeline.title}
                        onChange={(e) => setNewTimeline({ ...newTimeline, title: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <label className="text-sm font-semibold text-gray-700 font-devanagari">विवरण (Description)</label>
                    <textarea
                      required
                      rows="3"
                      value={newTimeline.description}
                      onChange={(e) => setNewTimeline({ ...newTimeline, description: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none resize-none font-devanagari"
                    ></textarea>
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <label className="text-sm font-semibold text-gray-700 font-devanagari">इवेंट फ़ोटो</label>
                    <div className="flex items-center gap-6">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setTimelineFile, setTimelinePreview)}
                        className="text-sm"
                      />
                      {timelinePreview && (
                        <div className="w-16 h-12 border rounded overflow-hidden shadow bg-gray-50 shrink-0">
                          <img src={timelinePreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-saffron hover:bg-saffron-dark text-white rounded font-bold text-sm font-devanagari flex items-center gap-2"
                  >
                    <Plus size={16} />
                    इवेंट जोड़ें
                  </button>
                </form>
              </div>

              {/* Dynamic Sortable List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="font-bold text-charcoal font-devanagari">
                    घटनाक्रम सूची (ड्रैग करके व्यवस्थित करें)
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs font-bold border-b border-gray-200 uppercase tracking-wider font-devanagari">
                        <th className="p-4 text-center w-12">क्रम</th>
                        <th className="p-4 w-20">फ़ोटो</th>
                        <th className="p-4 w-24">वर्ष</th>
                        <th className="p-4">शीर्षक</th>
                        <th className="p-4 w-24 text-center">क्रियाएं</th>
                      </tr>
                    </thead>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'timeline')}>
                      <SortableContext items={timeline.map(t => t._id)} strategy={verticalListSortingStrategy}>
                        <tbody>
                          {timeline.map((item) => (
                            <SortableItem key={item._id} id={item._id}>
                              <td className="p-4">
                                <div className="w-12 h-10 border rounded overflow-hidden bg-gray-50">
                                  <img src={getFullUrl(item.image)} alt="" className="w-full h-full object-cover filter grayscale" />
                                </div>
                              </td>
                              <td className="p-4 text-lg font-bold text-saffron">{item.year}</td>
                              <td className="p-4 font-bold text-charcoal font-devanagari">{item.title}</td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleDeleteTimeline(item._id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                  title="Delete event"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </SortableItem>
                          ))}
                        </tbody>
                      </SortableContext>
                    </DndContext>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: STATS */}
          {activeTab === 'stats' && (
            <div className="space-y-8">
              {/* Stats Creation Form */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-charcoal border-b border-gray-100 pb-3 font-devanagari mb-6">
                  नया आंकड़ा कार्ड जोड़ें
                </h2>

                <form onSubmit={handleAddStat} className="space-y-6 max-w-3xl">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="flex flex-col items-start space-y-2">
                      <label className="text-sm font-semibold text-gray-700 font-devanagari">Lucide आइकन नाम</label>
                      <select
                        value={newStat.icon}
                        onChange={(e) => setNewStat({ ...newStat, icon: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                      >
                        <option value="Home">Home (गृह योजना)</option>
                        <option value="Shield">Shield (सुरक्षा)</option>
                        <option value="Heart">Heart (कल्याण)</option>
                        <option value="CheckCircle">CheckCircle (स्वच्छता)</option>
                        <option value="Briefcase">Briefcase (मुद्रा)</option>
                        <option value="Cpu">Cpu (डिजिटल)</option>
                      </select>
                    </div>
                    <div className="flex flex-col items-start space-y-2">
                      <label className="text-sm font-semibold text-gray-700 font-devanagari">संख्या (Number)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. 4 करोड़+"
                        value={newStat.number}
                        onChange={(e) => setNewStat({ ...newStat, number: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none font-devanagari"
                      />
                    </div>
                    <div className="flex flex-col items-start space-y-2">
                      <label className="text-sm font-semibold text-gray-700 font-devanagari">लेबल (Label)</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. PM Awas Yojana"
                        value={newStat.label}
                        onChange={(e) => setNewStat({ ...newStat, label: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-saffron hover:bg-saffron-dark text-white rounded font-bold text-sm font-devanagari flex items-center gap-2"
                  >
                    <Plus size={16} />
                    आंकड़ा जोड़ें
                  </button>
                </form>
              </div>

              {/* Stats Sorting List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-charcoal font-devanagari">
                    आंकड़े सूची (ड्रैग करके व्यवस्थित करें)
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs font-bold border-b border-gray-200 uppercase tracking-wider font-devanagari">
                        <th className="p-4 text-center w-12">क्रम</th>
                        <th className="p-4 w-28">आइकन</th>
                        <th className="p-4 w-36">संख्या</th>
                        <th className="p-4">योजना / लेबल</th>
                        <th className="p-4 w-24 text-center">क्रियाएं</th>
                      </tr>
                    </thead>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'stats')}>
                      <SortableContext items={stats.map(s => s._id)} strategy={verticalListSortingStrategy}>
                        <tbody>
                          {stats.map((item) => (
                            <SortableItem key={item._id} id={item._id}>
                              <td className="p-4 text-saffron font-bold text-xs uppercase">{item.icon}</td>
                              <td className="p-4 text-lg font-bold text-saffron font-devanagari">{item.number}</td>
                              <td className="p-4 font-bold text-charcoal font-devanagari">{item.label}</td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleDeleteStat(item._id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                  title="Delete stat"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </SortableItem>
                          ))}
                        </tbody>
                      </SortableContext>
                    </DndContext>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VISION */}
          {activeTab === 'vision' && (
            <div className="space-y-8">
              {/* Vision Creation Form */}
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-charcoal border-b border-gray-100 pb-3 font-devanagari mb-6">
                  नया दृष्टिकोण कार्ड जोड़ें
                </h2>

                <form onSubmit={handleAddVision} className="space-y-6 max-w-3xl">
                  <div className="flex flex-col items-start space-y-2">
                    <label className="text-sm font-semibold text-gray-700 font-devanagari">शीर्षक (Title)</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. आत्मनिर्भर भारत"
                      value={newVision.title}
                      onChange={(e) => setNewVision({ ...newVision, title: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none font-devanagari"
                    />
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <label className="text-sm font-semibold text-gray-700 font-devanagari">विवरण (Description)</label>
                    <textarea
                      required
                      rows="3"
                      value={newVision.description}
                      onChange={(e) => setNewVision({ ...newVision, description: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none resize-none font-devanagari"
                    ></textarea>
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <label className="text-sm font-semibold text-gray-700 font-devanagari">पृष्ठभूमि फोटो</label>
                    <div className="flex items-center gap-6">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setVisionFile, setVisionPreview)}
                        className="text-sm"
                      />
                      {visionPreview && (
                        <div className="w-16 h-12 border rounded overflow-hidden shadow bg-gray-50 shrink-0">
                          <img src={visionPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-saffron hover:bg-saffron-dark text-white rounded font-bold text-sm font-devanagari flex items-center gap-2"
                  >
                    <Plus size={16} />
                    दृष्टिकोण सहेजें
                  </button>
                </form>
              </div>

              {/* Visions Sorting List */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <h3 className="font-bold text-charcoal font-devanagari">
                    दृष्टिकोण संकल्प सूची (ड्रैग करके व्यवस्थित करें)
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs font-bold border-b border-gray-200 uppercase tracking-wider font-devanagari">
                        <th className="p-4 text-center w-12">क्रम</th>
                        <th className="p-4 w-20">फोटो</th>
                        <th className="p-4">शीर्षक</th>
                        <th className="p-4 w-24 text-center">क्रियाएं</th>
                      </tr>
                    </thead>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={(e) => handleDragEnd(e, 'vision')}>
                      <SortableContext items={visions.map(v => v._id)} strategy={verticalListSortingStrategy}>
                        <tbody>
                          {visions.map((item) => (
                            <SortableItem key={item._id} id={item._id}>
                              <td className="p-4">
                                <div className="w-12 h-10 border rounded overflow-hidden bg-gray-50">
                                  <img src={getFullUrl(item.backgroundImage)} alt="" className="w-full h-full object-cover filter grayscale" />
                                </div>
                              </td>
                              <td className="p-4 font-bold text-charcoal font-devanagari">{item.title}</td>
                              <td className="p-4 text-center">
                                <button
                                  onClick={() => handleDeleteVision(item._id)}
                                  className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                                  title="Delete item"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </td>
                            </SortableItem>
                          ))}
                        </tbody>
                      </SortableContext>
                    </DndContext>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: VIDEOS */}
          {activeTab === 'videos' && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-charcoal border-b border-gray-100 pb-3 font-devanagari mb-6">
                  नया YouTube वीडियो लिंक जोड़ें
                </h2>

                <form onSubmit={handleAddVideo} className="space-y-6 max-w-3xl">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col items-start space-y-2">
                      <label className="text-sm font-semibold text-gray-700">YouTube Video ID</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. b3n08Qp-QyA"
                        value={newVideo.youtubeId}
                        onChange={(e) => setNewVideo({ ...newVideo, youtubeId: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                    <div className="flex flex-col items-start space-y-2">
                      <label className="text-sm font-semibold text-gray-700 font-devanagari">वीडियो शीर्षक (Title)</label>
                      <input
                        type="text"
                        required
                        value={newVideo.title}
                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <label className="text-sm font-semibold text-gray-700 font-devanagari">वीडियो विवरण (Description)</label>
                    <textarea
                      rows="3"
                      value={newVideo.description}
                      onChange={(e) => setNewVideo({ ...newVideo, description: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none resize-none font-devanagari"
                    ></textarea>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={newVideo.isFeatured}
                      onChange={(e) => setNewVideo({ ...newVideo, isFeatured: e.target.checked })}
                      className="h-4 w-4 text-saffron focus:ring-saffron border-gray-300 rounded"
                    />
                    <label htmlFor="isFeatured" className="text-sm text-gray-700 font-semibold font-devanagari">
                      फीचर्ड वीडियो के रूप में सेट करें (Featured Video)
                    </label>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-saffron hover:bg-saffron-dark text-white rounded font-bold text-sm font-devanagari flex items-center gap-2"
                  >
                    <Plus size={16} />
                    वीडियो सहेजें
                  </button>
                </form>
              </div>

              {/* Videos Table */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-gray-500 text-xs font-bold border-b border-gray-200 uppercase tracking-wider font-devanagari">
                        <th className="p-4 w-28">थंबनेल</th>
                        <th className="p-4 w-32">YouTube ID</th>
                        <th className="p-4">शीर्षक</th>
                        <th className="p-4 w-24 text-center">फीचर्ड</th>
                        <th className="p-4 w-24 text-center">हटाएं</th>
                      </tr>
                    </thead>
                    <tbody>
                      {videos.map((item) => (
                        <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50/50">
                          <td className="p-4">
                            <div className="w-16 h-10 border rounded overflow-hidden bg-gray-50">
                              <img src={`https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`} alt="" className="w-full h-full object-cover" />
                            </div>
                          </td>
                          <td className="p-4 font-mono text-sm">{item.youtubeId}</td>
                          <td className="p-4 font-bold text-charcoal font-devanagari">{item.title}</td>
                          <td className="p-4 text-center">
                            {item.isFeatured && (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-saffron/10 text-saffron">
                                Yes
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-center">
                            <button
                              onClick={() => handleDeleteVideo(item._id)}
                              className="p-1.5 text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: GALLERY */}
          {activeTab === 'gallery' && (
            <div className="space-y-8">
              <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-charcoal border-b border-gray-100 pb-3 font-devanagari mb-6">
                  नया गैलरी चित्र अपलोड करें
                </h2>

                <form onSubmit={handleAddGallery} className="space-y-6 max-w-3xl">
                  <div className="flex flex-col items-start space-y-2">
                    <label className="text-sm font-semibold text-gray-700 font-devanagari">चित्र शीर्षक (Caption)</label>
                    <input
                      type="text"
                      required
                      value={newGallery.caption}
                      onChange={(e) => setNewGallery({ ...newGallery, caption: e.target.value })}
                      className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none font-devanagari"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="flex flex-col items-start space-y-2">
                      <label className="text-sm font-semibold text-gray-700 font-devanagari">स्थान (Location)</label>
                      <input
                        type="text"
                        placeholder="e.g. वाराणसी, उत्तर प्रदेश"
                        value={newGallery.location}
                        onChange={(e) => setNewGallery({ ...newGallery, location: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none font-devanagari"
                      />
                    </div>
                    <div className="flex flex-col items-start space-y-2">
                      <label className="text-sm font-semibold text-gray-700 font-devanagari">वर्ष (Year)</label>
                      <input
                        type="text"
                        placeholder="e.g. 2023"
                        value={newGallery.year}
                        onChange={(e) => setNewGallery({ ...newGallery, year: e.target.value })}
                        className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col items-start space-y-2">
                    <label className="text-sm font-semibold text-gray-700 font-devanagari">चित्र फ़ाइल (Max 5MB)</label>
                    <div className="flex items-center gap-6">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange(e, setGalleryFile, setGalleryPreview)}
                        className="text-sm"
                      />
                      {galleryPreview && (
                        <div className="w-16 h-16 border rounded overflow-hidden shadow bg-gray-50 shrink-0">
                          <img src={galleryPreview} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-6 py-2 bg-saffron hover:bg-saffron-dark text-white rounded font-bold text-sm font-devanagari flex items-center gap-2"
                  >
                    <Plus size={16} />
                    अपलोड करें
                  </button>
                </form>
              </div>

              {/* Gallery List */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6">
                {gallery.map((item) => (
                  <div key={item._id} className="relative group bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
                    <div className="aspect-square w-full overflow-hidden bg-gray-50">
                      <img src={getFullUrl(item.imageUrl)} alt="" className="w-full h-full object-cover filter grayscale" />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-bold text-charcoal truncate font-devanagari">{item.caption}</p>
                      <span className="text-[10px] text-gray-500 font-devanagari">{item.location || 'N/A'} ({item.year || 'N/A'})</span>
                    </div>
                    
                    {/* Delete hover icon */}
                    <button
                      onClick={() => handleDeleteGallery(item._id)}
                      className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 text-white rounded-full transition-colors opacity-0 group-hover:opacity-100 duration-200"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: MESSAGES INBOX */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center border-b border-gray-200 pb-4">
                <h2 className="text-lg font-bold text-charcoal font-devanagari">
                  {t('admin.messagesTitle')} ({messages.length})
                </h2>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-2 px-4 py-2 bg-saffron hover:bg-saffron-dark text-white text-sm font-semibold rounded shadow transition-colors font-devanagari"
                >
                  <Download size={14} />
                  CSV में डाउनलोड करें
                </button>
              </div>

              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`bg-white p-6 rounded-lg shadow-sm border transition-all duration-300 ${
                      msg.isRead ? 'border-gray-200 opacity-75' : 'border-l-4 border-l-saffron border-gray-200 font-semibold'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-base text-charcoal font-devanagari">{msg.name}</span>
                          <span className="text-xs text-gray-500 font-mono">({msg.email})</span>
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-600 font-devanagari">
                            {msg.city}
                          </span>
                        </div>
                        <span className="text-[11px] text-gray-400 font-sans block">
                          {new Date(msg.createdAt).toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleMarkMessageRead(msg._id)}
                          className={`p-1.5 rounded transition-colors ${
                            msg.isRead ? 'text-gray-400 hover:bg-gray-100 hover:text-charcoal' : 'text-saffron bg-saffron/10 hover:bg-saffron/20'
                          }`}
                          title={msg.isRead ? 'Mark as unread' : 'Mark as read'}
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMessage(msg._id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-gray-100 rounded transition-colors"
                          title="Delete message"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="mt-4 text-sm text-gray-700 leading-relaxed font-sans font-devanagari text-justify whitespace-pre-wrap">
                      {msg.message}
                    </p>
                  </div>
                ))}

                {messages.length === 0 && (
                  <div className="text-center py-12 text-gray-400 font-devanagari">
                    कोई संदेश उपलब्ध नहीं हैं।
                  </div>
                )}
              </div>
            </div>
          )}

        </div>
      </main>

      {/* 1. FORCED PASSWORD CHANGE ON FIRST LOGIN MODAL */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-devanagari">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md w-full border border-gray-100 space-y-6">
            <div className="flex items-center gap-3 text-red-500">
              <AlertTriangle size={28} className="animate-bounce" />
              <h3 className="text-xl font-bold font-serif">{t('admin.firstLoginWarning')}</h3>
            </div>
            
            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              <div className="flex flex-col items-start space-y-1">
                <label className="text-sm font-semibold text-gray-700">{t('admin.newPasswordLabel')}</label>
                <div className="relative w-full shadow-sm">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                    <Lock size={16} />
                  </div>
                  <input
                    type="password"
                    required
                    minLength="6"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-2.5 bg-saffron hover:bg-saffron-dark text-white rounded font-bold transition-colors"
              >
                {t('admin.changePassBtn')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* 2. SESSION TIMEOUT WARNING MODAL (At 25 mins inactivity) */}
      {warningModalOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 font-devanagari">
          <div className="bg-white p-8 rounded-lg shadow-2xl max-w-sm w-full border border-gray-100 text-center space-y-6">
            <AlertTriangle size={48} className="text-saffron mx-auto animate-pulse" />
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-charcoal">निष्क्रियता चेतावनी / Session Timeout Warning</h3>
              <p className="text-sm text-gray-500">
                You have been inactive for 25 minutes. You will be logged out in 5 minutes.
              </p>
            </div>
            <button
              onClick={() => {
                setWarningModalOpen(false);
                resetInactivityTimers();
                toast.success('Session extended successfully.');
              }}
              className="px-6 py-2 bg-saffron hover:bg-saffron-dark text-white rounded text-sm font-bold w-full"
            >
              सत्र जारी रखें / Extend Session
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AdminDashboard;
