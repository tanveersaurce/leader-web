const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');
const cloudinary = require('cloudinary').v2;

const {
  Leader,
  Timeline,
  Stat,
  Vision,
  Video,
  Gallery,
  Message,
  Admin
} = require('../models/Schemas');

// Configure Cloudinary if credentials exist
let useCloudinary = false;
if (
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
  });
  useCloudinary = true;
  console.log('Cloudinary storage is configured and enabled.');
} else {
  console.log('Cloudinary not configured. Defaulting to local WebP storage.');
}

// Ensure local uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Upload & convert image to WebP (Cloudinary or local Sharp WebP)
const handleImageUpload = async (file) => {
  if (!file) return null;

  if (useCloudinary) {
    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: 'leader_portfolio',
          format: 'webp',
          transformation: [{ width: 1200, crop: 'limit' }]
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result.secure_url);
        }
      );
      uploadStream.end(file.buffer);
    });
  } else {
    // Local storage with Sharp WebP conversion
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e9)}.webp`;
    const destPath = path.join(uploadsDir, filename);
    
    await sharp(file.buffer)
      .webp({ quality: 80 })
      .toFile(destPath);
      
    return `/uploads/${filename}`;
  }
};

// -------------------------------------------------------------
// HEALTH CHECK
// -------------------------------------------------------------
const healthCheck = (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Server is healthy' });
};

// -------------------------------------------------------------
// AUTH CONTROLLERS
// -------------------------------------------------------------
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const admin = await Admin.findOne({ username });
    if (!admin) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET || 'supersecretjwtkey12345!',
      { expiresIn: '24h' }
    );

    res.json({
      token,
      username: admin.username,
      isFirstLogin: admin.isFirstLogin
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};

const changePassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Encrypt password using 12 rounds of bcrypt
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    req.admin.password = hashedPassword;
    req.admin.isFirstLogin = false;
    await req.admin.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// -------------------------------------------------------------
// LEADER PROFILE CONTROLLERS
// -------------------------------------------------------------
const getLeader = async (req, res) => {
  try {
    let leader = await Leader.findOne();
    if (!leader) {
      return res.status(404).json({ message: 'Leader profile not found' });
    }
    res.json(leader);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getLeaderMeta = async (req, res) => {
  try {
    const leader = await Leader.findOne().select('name title tagline');
    if (!leader) {
      return res.json({ name: 'नरेन्द्र मोदी', title: 'प्रधानमंत्री, भारत', tagline: 'जन सेवा ही ईश्वर सेवा' });
    }
    res.json(leader);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateLeader = async (req, res) => {
  try {
    const { name, title, tagline, bio } = req.body;
    let leader = await Leader.findOne();
    
    let updatedData = { name, title, tagline, bio };

    // File uploads if present
    if (req.files) {
      if (req.files.heroImage) {
        updatedData.heroImage = await handleImageUpload(req.files.heroImage[0]);
      }
      if (req.files.collageImages) {
        const collageUrls = [];
        for (const file of req.files.collageImages) {
          const url = await handleImageUpload(file);
          collageUrls.push(url);
        }
        if (collageUrls.length > 0) {
          updatedData.collageImages = collageUrls;
        }
      }
    }

    if (!leader) {
      leader = new Leader(updatedData);
    } else {
      Object.assign(leader, updatedData);
    }

    await leader.save();
    res.json(leader);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating leader' });
  }
};

// -------------------------------------------------------------
// TIMELINE CONTROLLERS
// -------------------------------------------------------------
const getTimeline = async (req, res) => {
  try {
    const timeline = await Timeline.find().sort({ order: 1 });
    res.json(timeline);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addTimelineItem = async (req, res) => {
  try {
    const { year, title, description, order } = req.body;
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: 'Image is required' });
    }
    const imageUrl = await handleImageUpload(file);
    const newItem = new Timeline({
      year,
      title,
      description,
      image: imageUrl,
      order: order || 0
    });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateTimelineItem = async (req, res) => {
  try {
    const { year, title, description, order } = req.body;
    const file = req.file;
    const item = await Timeline.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    item.year = year || item.year;
    item.title = title || item.title;
    item.description = description || item.description;
    item.order = order !== undefined ? order : item.order;

    if (file) {
      item.image = await handleImageUpload(file);
    }

    await item.save();
    res.json(item);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteTimelineItem = async (req, res) => {
  try {
    const item = await Timeline.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });
    res.json({ message: 'Item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const reorderTimeline = async (req, res) => {
  try {
    const { orderArray } = req.body; // Array of { id, order }
    for (const item of orderArray) {
      await Timeline.findByIdAndUpdate(item.id, { order: item.order });
    }
    res.json({ message: 'Timeline reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error reordering timeline' });
  }
};

// -------------------------------------------------------------
// STATS CONTROLLERS
// -------------------------------------------------------------
const getStats = async (req, res) => {
  try {
    const stats = await Stat.find().sort({ order: 1 });
    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addStat = async (req, res) => {
  try {
    const { icon, number, label, order } = req.body;
    const newStat = new Stat({ icon, number, label, order: order || 0 });
    await newStat.save();
    res.status(201).json(newStat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateStat = async (req, res) => {
  try {
    const { icon, number, label, order } = req.body;
    const stat = await Stat.findById(req.params.id);
    if (!stat) return res.status(404).json({ message: 'Stat not found' });

    stat.icon = icon || stat.icon;
    stat.number = number || stat.number;
    stat.label = label || stat.label;
    stat.order = order !== undefined ? order : stat.order;

    await stat.save();
    res.json(stat);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteStat = async (req, res) => {
  try {
    const stat = await Stat.findByIdAndDelete(req.params.id);
    if (!stat) return res.status(404).json({ message: 'Stat not found' });
    res.json({ message: 'Stat deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const reorderStats = async (req, res) => {
  try {
    const { orderArray } = req.body;
    for (const item of orderArray) {
      await Stat.findByIdAndUpdate(item.id, { order: item.order });
    }
    res.json({ message: 'Stats reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error reordering stats' });
  }
};

// -------------------------------------------------------------
// VISION CONTROLLERS
// -------------------------------------------------------------
const getVisions = async (req, res) => {
  try {
    const visions = await Vision.find().sort({ order: 1 });
    res.json(visions);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addVision = async (req, res) => {
  try {
    const { title, description, order } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'Background image required' });
    const imageUrl = await handleImageUpload(file);
    const newVision = new Vision({
      title,
      description,
      backgroundImage: imageUrl,
      order: order || 0
    });
    await newVision.save();
    res.status(201).json(newVision);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateVision = async (req, res) => {
  try {
    const { title, description, order } = req.body;
    const file = req.file;
    const vision = await Vision.findById(req.params.id);
    if (!vision) return res.status(404).json({ message: 'Vision item not found' });

    vision.title = title || vision.title;
    vision.description = description || vision.description;
    vision.order = order !== undefined ? order : vision.order;

    if (file) {
      vision.backgroundImage = await handleImageUpload(file);
    }

    await vision.save();
    res.json(vision);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteVision = async (req, res) => {
  try {
    const vision = await Vision.findByIdAndDelete(req.params.id);
    if (!vision) return res.status(404).json({ message: 'Vision item not found' });
    res.json({ message: 'Vision item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const reorderVisions = async (req, res) => {
  try {
    const { orderArray } = req.body;
    for (const item of orderArray) {
      await Vision.findByIdAndUpdate(item.id, { order: item.order });
    }
    res.json({ message: 'Visions reordered successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error reordering visions' });
  }
};

// -------------------------------------------------------------
// VIDEOS CONTROLLERS
// -------------------------------------------------------------
const getVideos = async (req, res) => {
  try {
    const videos = await Video.find().sort({ date: -1 });
    res.json(videos);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getFeaturedVideo = async (req, res) => {
  try {
    const video = await Video.findOne({ isFeatured: true });
    if (!video) {
      const latestVideo = await Video.findOne().sort({ date: -1 });
      return res.json(latestVideo);
    }
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const addVideo = async (req, res) => {
  try {
    const { youtubeId, title, isFeatured, description } = req.body;

    if (isFeatured === 'true' || isFeatured === true) {
      // Unset previous featured video
      await Video.updateMany({}, { isFeatured: false });
    }

    const newVideo = new Video({
      youtubeId,
      title,
      isFeatured: isFeatured === 'true' || isFeatured === true,
      description
    });
    await newVideo.save();
    res.status(201).json(newVideo);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateVideo = async (req, res) => {
  try {
    const { youtubeId, title, isFeatured, description } = req.body;
    const video = await Video.findById(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });

    if (isFeatured === 'true' || isFeatured === true) {
      await Video.updateMany({}, { isFeatured: false });
    }

    video.youtubeId = youtubeId || video.youtubeId;
    video.title = title || video.title;
    video.isFeatured = isFeatured !== undefined ? (isFeatured === 'true' || isFeatured === true) : video.isFeatured;
    video.description = description !== undefined ? description : video.description;

    await video.save();
    res.json(video);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteVideo = async (req, res) => {
  try {
    const video = await Video.findByIdAndDelete(req.params.id);
    if (!video) return res.status(404).json({ message: 'Video not found' });
    res.json({ message: 'Video deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// -------------------------------------------------------------
// GALLERY CONTROLLERS
// -------------------------------------------------------------
const getGallery = async (req, res) => {
  try {
    const gallery = await Gallery.find();
    res.json(gallery);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const uploadGalleryImage = async (req, res) => {
  try {
    const { caption, location, year } = req.body;
    const file = req.file;
    if (!file) return res.status(400).json({ message: 'Image file required' });

    const imageUrl = await handleImageUpload(file);
    const newImage = new Gallery({
      imageUrl,
      caption,
      location,
      year
    });
    await newImage.save();
    res.status(201).json(newImage);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const updateGalleryImage = async (req, res) => {
  try {
    const { caption, location, year } = req.body;
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Gallery item not found' });

    image.caption = caption || image.caption;
    image.location = location || image.location;
    image.year = year || image.year;

    await image.save();
    res.json(image);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteGalleryImage = async (req, res) => {
  try {
    const image = await Gallery.findByIdAndDelete(req.params.id);
    if (!image) return res.status(404).json({ message: 'Gallery item not found' });
    res.json({ message: 'Gallery item deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// -------------------------------------------------------------
// MESSAGES (CONTACT FORM) CONTROLLERS
// -------------------------------------------------------------
const submitContactForm = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { name, email, city, message } = req.body;

    const newMessage = new Message({ name, email, city, message });
    await newMessage.save();

    // Nodemailer email sending setup
    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"Leader Portfolio Website" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // Send to self
      subject: `New Contact Form Message from ${name} (${city})`,
      text: `Name: ${name}\nEmail: ${email}\nCity: ${city}\nMessage: ${message}`
    };

    // Attempt sending, print locally if configured credentials are placeholder
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Nodemailer SMTP failed (likely placeholder credentials). Logging message details below:');
        console.log(`[CONTACT SUBMISSION] Name: ${name}, Email: ${email}, City: ${city}, Msg: ${message}`);
      } else {
        console.log('Notification email dispatched successfully: %s', info.messageId);
      }
    });

    res.status(201).json({ message: 'Message sent successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getMessages = async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const markMessageAsRead = async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });

    message.isRead = !message.isRead;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteMessage = async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) return res.status(404).json({ message: 'Message not found' });
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  healthCheck,
  login,
  logout,
  changePassword,
  getLeader,
  getLeaderMeta,
  updateLeader,
  getTimeline,
  addTimelineItem,
  updateTimelineItem,
  deleteTimelineItem,
  reorderTimeline,
  getStats,
  addStat,
  updateStat,
  deleteStat,
  reorderStats,
  getVisions,
  addVision,
  updateVision,
  deleteVision,
  reorderVisions,
  getVideos,
  getFeaturedVideo,
  addVideo,
  updateVideo,
  deleteVideo,
  getGallery,
  uploadGalleryImage,
  updateGalleryImage,
  deleteGalleryImage,
  submitContactForm,
  getMessages,
  markMessageAsRead,
  deleteMessage
};
