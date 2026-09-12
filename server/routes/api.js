const express = require('express');
const multer = require('multer');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const apiController = require('../controllers/apiController');

const router = express.Router();

// Multer memory storage configuration
const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, JPG, PNG and WebP are allowed.'), false);
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter
});

// -------------------------------------------------------------
// PUBLIC & HEALTH ROUTES
// -------------------------------------------------------------
router.get('/health', apiController.healthCheck);
router.get('/leader', apiController.getLeader);
router.get('/leader/meta', apiController.getLeaderMeta);

router.get('/timeline', apiController.getTimeline);
router.get('/stats', apiController.getStats);
router.get('/vision', apiController.getVisions);

router.get('/videos', apiController.getVideos);
router.get('/videos/featured', apiController.getFeaturedVideo);

router.get('/gallery', apiController.getGallery);

// Submit contact message (validated)
router.post(
  '/contact',
  [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').trim().isEmail().withMessage('Valid email is required'),
    body('city').trim().notEmpty().withMessage('City is required'),
    body('message').trim().notEmpty().withMessage('Message is required')
  ],
  apiController.submitContactForm
);

// -------------------------------------------------------------
// AUTH ROUTES
// -------------------------------------------------------------
router.post('/auth/login', apiController.login);
router.post('/auth/logout', apiController.logout);
router.post('/auth/change-password', auth, apiController.changePassword);

// -------------------------------------------------------------
// ADMIN PROTECTED ROUTES (CRUD & REORDERING)
// -------------------------------------------------------------

// Update Leader Profile (Hero and Collage images upload support)
router.put(
  '/leader',
  auth,
  upload.fields([
    { name: 'heroImage', maxCount: 1 },
    { name: 'collageImages', maxCount: 8 }
  ]),
  apiController.updateLeader
);

// Timeline items
router.post('/timeline', auth, upload.single('image'), apiController.addTimelineItem);
router.put('/timeline/reorder', auth, apiController.reorderTimeline);
router.put('/timeline/:id', auth, upload.single('image'), apiController.updateTimelineItem);
router.delete('/timeline/:id', auth, apiController.deleteTimelineItem);

// Stats items
router.post('/stats', auth, apiController.addStat);
router.put('/stats/reorder', auth, apiController.reorderStats);
router.put('/stats/:id', auth, apiController.updateStat);
router.delete('/stats/:id', auth, apiController.deleteStat);

// Vision items
router.post('/vision', auth, upload.single('backgroundImage'), apiController.addVision);
router.put('/vision/reorder', auth, apiController.reorderVisions);
router.put('/vision/:id', auth, upload.single('backgroundImage'), apiController.updateVision);
router.delete('/vision/:id', auth, apiController.deleteVision);

// Video items
router.post('/videos', auth, apiController.addVideo);
router.put('/videos/:id', auth, apiController.updateVideo);
router.delete('/videos/:id', auth, apiController.deleteVideo);

// Gallery items
router.post('/gallery/upload', auth, upload.single('image'), apiController.uploadGalleryImage);
router.put('/gallery/:id', auth, apiController.updateGalleryImage);
router.delete('/gallery/:id', auth, apiController.deleteGalleryImage);

// Messages inbox management
router.get('/messages', auth, apiController.getMessages);
router.put('/messages/:id/read', auth, apiController.markMessageAsRead);
router.delete('/messages/:id', auth, apiController.deleteMessage);

module.exports = router;
