// ================================================================
// DEENMAX BACKEND - MAIN SERVER
// Complete API Server with all features
// ================================================================

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Import routes
const authRoutes = require('./routes/auth');
const quranRoutes = require('./routes/quran');
const prayerRoutes = require('./routes/prayer');
const hifzRoutes = require('./routes/hifz');
const fastingRoutes = require('./routes/fasting');
const notesRoutes = require('./routes/notes');
const bookmarksRoutes = require('./routes/bookmarks');
const aiRoutes = require('./routes/ai');
const videosRoutes = require('./routes/videos');
const communityRoutes = require('./routes/community');
const settingsRoutes = require('./routes/settings');

// Import middleware
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { apiLimiter } = require('./middleware/rateLimiter');

// Import database connection
const connectDB = require('./config/database');

// Import data for health check
const { QURAN_METADATA } = require('./data/quran-full.js');
const { HADITH_DATA } = require('./data/hadith-full.js');
const { DUA_DATA } = require('./data/duas.js');
const { VIDEO_DATA } = require('./data/videos-data.js');

// Create Express app
const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE
// ============================================================

// Security - Helmet
app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:", "http:"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            styleSrc: ["'self'", "'unsafe-inline'"],
            connectSrc: ["'self'", "https://api.aladhan.com", "https://api.alquran.cloud", "https://cdn.islamic.network"]
        }
    }
}));

// CORS - Allow frontend access
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true,
    optionsSuccessStatus: 200
}));

// Compression - Gzip responses
app.use(compression());

// JSON & URL Encoding
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate Limiting - Prevent abuse
app.use('/api', apiLimiter);

// ============================================================
// ROUTES
// ============================================================

// Health Check
app.get('/api/health', (req, res) => {
    res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        version: '3.0.0',
        uptime: process.uptime(),
        dataStats: {
            surahs: Object.keys(QURAN_METADATA).length,
            hadithCollections: Object.keys(HADITH_DATA).length,
            duas: Object.keys(DUA_DATA).length,
            videos: VIDEO_DATA.videos?.length || 0
        }
    });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/quran', quranRoutes);
app.use('/api/prayer', prayerRoutes);
app.use('/api/hifz', hifzRoutes);
app.use('/api/fasting', fastingRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/bookmarks', bookmarksRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/videos', videosRoutes);
app.use('/api/community', communityRoutes);
app.use('/api/settings', settingsRoutes);

// ============================================================
// ERROR HANDLING
// ============================================================

// 404 - Not Found
app.use(notFound);

// Global Error Handler
app.use(errorHandler);

// ============================================================
// START SERVER
// ============================================================

const startServer = async () => {
    try {
        // Connect to MongoDB
        await connectDB();
        
        // Start the server
        app.listen(PORT, () => {
            console.log('='.repeat(60));
            console.log('🚀 DeenMax Backend Server Started');
            console.log('='.repeat(60));
            console.log(`📍 API URL: http://localhost:${PORT}/api`);
            console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
            console.log(`📊 Data Loaded:`);
            console.log(`   • Surahs: ${Object.keys(QURAN_METADATA).length}`);
            console.log(`   • Hadith Collections: ${Object.keys(HADITH_DATA).length}`);
            console.log(`   • Duas: ${Object.keys(DUA_DATA).length}`);
            console.log(`   • Videos: ${VIDEO_DATA.videos?.length || 0}`);
            console.log('='.repeat(60));
        });
    } catch (error) {
        console.error('❌ Failed to start server:', error);
        process.exit(1);
    }
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('❌ Unhandled Rejection:', err);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('❌ Uncaught Exception:', err);
    process.exit(1);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    mongoose.connection.close(() => {
        console.log('✅ MongoDB connection closed');
        process.exit(0);
    });
});

// Start the server
startServer();

module.exports = app;
