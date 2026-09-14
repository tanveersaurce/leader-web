require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const path = require('path');
const connectDB = require('./config/db');
const apiRoutes = require('./routes/api');
const { SitemapStream, streamToPromise } = require('sitemap');
const { Readable } = require('stream');

const app = express();

// Connect to MongoDB
connectDB();

// -------------------------------------------------------------
// SECURITY MIDDLEWARE
// -------------------------------------------------------------
app.use(helmet({
  crossOriginResourcePolicy: false, // Allows cross-origin serving of local uploads
}));

// CORS Configuration
const allowedOrigin = process.env.CLIENT_URL || 'http://localhost:5173';
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || origin === allowedOrigin || origin.endsWith('.vercel.app') || origin.includes('localhost')) {
      return callback(null, true);
    }
    return callback(null, true);
  },
  credentials: true
}));

// Request parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Login Rate Limiter (max 5 login requests per 15 minutes)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: 'Too many login attempts. Please try again after 15 minutes.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api/auth/login', loginLimiter);

// -------------------------------------------------------------
// STATIC FILES & API ROUTES
// -------------------------------------------------------------
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api', apiRoutes);

// -------------------------------------------------------------
// SITEMAP AUTO-GENERATION ROUTE
// -------------------------------------------------------------
app.get('/sitemap.xml', async (req, res) => {
  try {
    const smStream = new SitemapStream({ hostname: allowedOrigin });
    const links = [
      { url: '/', changefreq: 'daily', priority: 1.0 },
      { url: '/#intro', changefreq: 'monthly', priority: 0.8 },
      { url: '/#timeline', changefreq: 'weekly', priority: 0.8 },
      { url: '/#stats', changefreq: 'monthly', priority: 0.7 },
      { url: '/#vision', changefreq: 'monthly', priority: 0.7 },
      { url: '/#documentary', changefreq: 'weekly', priority: 0.7 },
      { url: '/#gallery', changefreq: 'weekly', priority: 0.8 },
      { url: '/#testimonials', changefreq: 'monthly', priority: 0.6 },
      { url: '/#contact', changefreq: 'monthly', priority: 0.5 }
    ];

    res.header('Content-Type', 'application/xml');
    const xml = await streamToPromise(Readable.from(links).pipe(smStream)).then((data) => data.toString());
    res.send(xml);
  } catch (error) {
    console.error('Sitemap generation error:', error);
    res.status(500).end();
  }
});

// Serve frontend if in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client', 'dist', 'index.html'));
  });
}

// -------------------------------------------------------------
// START SERVER
// -------------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Sitemap available at http://localhost:${PORT}/sitemap.xml`);
});
