const mongoose = require('mongoose');

// Leader Profile Schema
const LeaderSchema = new mongoose.Schema({
  name: { type: String, required: true, default: 'नरेन्द्र मोदी' },
  title: { type: String, required: true, default: 'प्रधानमंत्री, भारत' },
  tagline: { type: String, required: true, default: 'जन सेवा ही ईश्वर सेवा' },
  bio: { type: String, required: true },
  heroImage: { type: String, required: true },
  collageImages: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

// Timeline Schema
const TimelineSchema = new mongoose.Schema({
  year: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  order: { type: Number, default: 0 }
});

// Stats Schema
const StatSchema = new mongoose.Schema({
  icon: { type: String, required: true }, // SVG or icon name identifier
  number: { type: String, required: true }, // e.g. "4 करोड़+"
  label: { type: String, required: true }, // e.g. "PM Awas Yojana"
  order: { type: Number, default: 0 }
});

// Vision Schema
const VisionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  backgroundImage: { type: String, required: true },
  order: { type: Number, default: 0 }
});

// Videos Schema
const VideoSchema = new mongoose.Schema({
  youtubeId: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: Date, default: Date.now },
  isFeatured: { type: Boolean, default: false },
  description: { type: String }
});

// Gallery Schema
const GallerySchema = new mongoose.Schema({
  imageUrl: { type: String, required: true },
  caption: { type: String, required: true },
  location: { type: String },
  year: { type: String }
});

// Message Schema (Contact)
const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  city: { type: String, required: true },
  message: { type: String, required: true },
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

// Admin Schema
const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  isFirstLogin: { type: Boolean, default: true }
});

const Leader = mongoose.model('Leader', LeaderSchema);
const Timeline = mongoose.model('Timeline', TimelineSchema);
const Stat = mongoose.model('Stat', StatSchema);
const Vision = mongoose.model('Vision', VisionSchema);
const Video = mongoose.model('Video', VideoSchema);
const Gallery = mongoose.model('Gallery', GallerySchema);
const Message = mongoose.model('Message', MessageSchema);
const Admin = mongoose.model('Admin', AdminSchema);

module.exports = {
  Leader,
  Timeline,
  Stat,
  Vision,
  Video,
  Gallery,
  Message,
  Admin
};
