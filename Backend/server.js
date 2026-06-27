// ============================================================
// DEENMAX BACKEND - Complete API Server
// Deploy to Render
// ============================================================

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const axios = require('axios');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ============================================================
// MIDDLEWARE
// ============================================================
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || '*',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rate limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests
    message: 'Too many requests, please try again later.'
});
app.use('/api/', limiter);

// ============================================================
// DATABASE CONNECTION
// ============================================================
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/deenmax', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// ============================================================
// MODELS
// ============================================================

// User Model
const UserSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, default: 'user' },
    hifzProgress: { type: Number, default: 0 },
    prayerStreak: { type: Number, default: 0 },
    bookmarks: [{ type: String }],
    settings: { type: Object, default: { theme: 'dark', language: 'en' } },
    createdAt: { type: Date, default: Date.now }
});

// Prayer Log Model
const PrayerLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    prayers: [{ type: String }],
    createdAt: { type: Date, default: Date.now }
});

// Hifz Progress Model
const HifzProgressSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    surah: { type: String, required: true },
    status: { type: String, enum: ['done', 'progress', 'pending'], default: 'pending' },
    progress: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

// Fasting Log Model
const FastingLogSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    date: { type: String, required: true },
    type: { type: String, enum: ['sunna', 'qada', 'nafl', 'ramadan'], required: true },
    createdAt: { type: Date, default: Date.now }
});

// Note Model
const NoteSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    surahId: { type: Number, required: true },
    ayahNum: { type: Number, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);
const PrayerLog = mongoose.model('PrayerLog', PrayerLogSchema);
const HifzProgress = mongoose.model('HifzProgress', HifzProgressSchema);
const FastingLog = mongoose.model('FastingLog', FastingLogSchema);
const Note = mongoose.model('Note', NoteSchema);

// ============================================================
// AUTH MIDDLEWARE
// ============================================================
const authMiddleware = async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ error: 'No token provided' });
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
        req.userId = decoded.userId;
        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token' });
    }
};

// ============================================================
// ROUTES - AUTH
// ============================================================

// Register
app.post('/api/auth/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        
        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email already registered' });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = new User({
            name,
            email,
            password: hashedPassword
        });
        await user.save();

        // Generate token
        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '7d' }
        );

        res.status(201).json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'secret123',
            { expiresIn: '7d' }
        );

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get current user
app.get('/api/auth/me', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// ROUTES - QURAN (External API)
// ============================================================

// Get Surah list
app.get('/api/quran/surahs', async (req, res) => {
    try {
        const response = await axios.get('https://api.alquran.cloud/v1/surah');
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Ayah
app.get('/api/quran/ayah/:surahId/:ayahNum', async (req, res) => {
    try {
        const { surahId, ayahNum } = req.params;
        const response = await axios.get(
            `https://api.alquran.cloud/v1/ayah/${surahId}:${ayahNum}/en.asad`
        );
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Surah with translations
app.get('/api/quran/surah/:surahId', async (req, res) => {
    try {
        const { surahId } = req.params;
        const edition = req.query.edition || 'en.asad';
        const response = await axios.get(
            `https://api.alquran.cloud/v1/surah/${surahId}/${edition}`
        );
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// ROUTES - PRAYER TIMES
// ============================================================

app.get('/api/prayer/times', async (req, res) => {
    try {
        const { city, country = 'SA' } = req.query;
        if (!city) {
            return res.status(400).json({ error: 'City is required' });
        }
        const response = await axios.get(
            `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=${country}&method=4`
        );
        res.json(response.data.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// ROUTES - PRAYER LOG (User)
// ============================================================

// Log prayer
app.post('/api/prayer/log', authMiddleware, async (req, res) => {
    try {
        const { date, prayers } = req.body;
        let log = await PrayerLog.findOne({ userId: req.userId, date });
        if (log) {
            log.prayers = prayers;
        } else {
            log = new PrayerLog({ userId: req.userId, date, prayers });
        }
        await log.save();
        res.json(log);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get prayer logs
app.get('/api/prayer/logs', authMiddleware, async (req, res) => {
    try {
        const { startDate, endDate } = req.query;
        const query = { userId: req.userId };
        if (startDate) query.date = { $gte: startDate };
        if (endDate) query.date = { ...query.date, $lte: endDate };
        const logs = await PrayerLog.find(query).sort({ date: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// ROUTES - HIFZ PROGRESS
// ============================================================

// Add Hifz progress
app.post('/api/hifz', authMiddleware, async (req, res) => {
    try {
        const { surah, status, progress } = req.body;
        const hifz = new HifzProgress({
            userId: req.userId,
            surah,
            status,
            progress
        });
        await hifz.save();
        res.status(201).json(hifz);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Get Hifz progress
app.get('/api/hifz', authMiddleware, async (req, res) => {
    try {
        const progress = await HifzProgress.find({ userId: req.userId });
        res.json(progress);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update Hifz progress
app.put('/api/hifz/:id', authMiddleware, async (req, res) => {
    try {
        const { status, progress } = req.body;
        const hifz = await HifzProgress.findOneAndUpdate(
            { _id: req.params.id, userId: req.userId },
            { status, progress },
            { new: true }
        );
        if (!hifz) {
            return res.status(404).json({ error: 'Not found' });
        }
        res.json(hifz);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// ROUTES - FASTING LOG
// ============================================================

app.post('/api/fasting/log', authMiddleware, async (req, res) => {
    try {
        const { date, type } = req.body;
        const log = new FastingLog({ userId: req.userId, date, type });
        await log.save();
        res.status(201).json(log);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/fasting/logs', authMiddleware, async (req, res) => {
    try {
        const logs = await FastingLog.find({ userId: req.userId }).sort({ date: -1 });
        res.json(logs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// ROUTES - NOTES
// ============================================================

app.post('/api/notes', authMiddleware, async (req, res) => {
    try {
        const { surahId, ayahNum, content } = req.body;
        let note = await Note.findOne({ userId: req.userId, surahId, ayahNum });
        if (note) {
            note.content = content;
        } else {
            note = new Note({ userId: req.userId, surahId, ayahNum, content });
        }
        await note.save();
        res.json(note);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/notes', authMiddleware, async (req, res) => {
    try {
        const notes = await Note.find({ userId: req.userId });
        res.json(notes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// ROUTES - BOOKMARKS
// ============================================================

app.post('/api/bookmarks', authMiddleware, async (req, res) => {
    try {
        const { bookmark } = req.body;
        const user = await User.findById(req.userId);
        if (!user.bookmarks.includes(bookmark)) {
            user.bookmarks.push(bookmark);
            await user.save();
        }
        res.json(user.bookmarks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/bookmarks', authMiddleware, async (req, res) => {
    try {
        const { bookmark } = req.body;
        const user = await User.findById(req.userId);
        user.bookmarks = user.bookmarks.filter(b => b !== bookmark);
        await user.save();
        res.json(user.bookmarks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// ROUTES - AI ASSISTANT (Simulated)
// ============================================================

app.post('/api/ai/ask', authMiddleware, async (req, res) => {
    try {
        const { question } = req.body;
        
        // In production, integrate with OpenAI or other AI API
        // For now, use keyword-based responses
        const response = generateAIResponse(question);
        
        res.json({
            question,
            answer: response,
            sources: ['Quran', 'Sahih Bukhari', 'Sahih Muslim']
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

function generateAIResponse(question) {
    const q = question.toLowerCase();
    if (q.includes('charity') || q.includes('zakat')) {
        return '📖 Quran: "The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes..." (2:261). 📜 Hadith: "Charity does not decrease wealth." (Sahih Muslim)';
    } else if (q.includes('fatihah')) {
        return '📖 Surah Al-Fatihah is the first chapter of the Quran with 7 verses. It is a dialogue between Allah and His servant. The Prophet (PBUH) said it is the greatest Surah in the Quran.';
    } else if (q.includes('dua') || q.includes('protection')) {
        return '🤲 Best Duas for Protection: "Bismillahi alladhi la yadurru..." (Morning/Evening) and "A\'udhu bikalimatillahit-tammati..." (Before Sleep). 📚 Sources: Sahih Bukhari, Tirmidhi.';
    } else if (q.includes('prophet') || q.includes('muhammad')) {
        return '📜 Prophet Muhammad (PBUH) was born in 570 CE in Makkah. He received the first revelation at age 40 in Cave Hira. He migrated to Madinah in 622 CE and passed away in 632 CE at age 63.';
    } else if (q.includes('riba') || q.includes('interest')) {
        return '📖 Quran: "Allah has permitted trade and forbidden riba." (2:275). 📜 Hadith: The Prophet (PBUH) cursed the one who consumes riba. All major schools agree Riba is strictly prohibited (Haram).';
    } else {
        return '🤖 I can answer questions about Quran, Hadith, Fiqh, Seerah, Duas, and Islamic history. Try asking: "What does the Quran say about charity?" or "Explain Surah Al-Fatihah" or "Best dua for protection?"';
    }
}

// ============================================================
// ROUTES - COMMUNITY (Simple endpoints)
// ============================================================

// Get nearby mosques (simulated)
app.get('/api/mosques/nearby', async (req, res) => {
    const { lat, lng } = req.query;
    res.json([
        { name: 'Masjid Al-Haram', distance: '2.3 km', address: 'Makkah, Saudi Arabia' },
        { name: 'Al-Masjid An-Nabawi', distance: '5.1 km', address: 'Madinah, Saudi Arabia' },
        { name: 'Masjid Quba', distance: '8.7 km', address: 'Madinah, Saudi Arabia' }
    ]);
});

// Get Islamic events
app.get('/api/events/upcoming', async (req, res) => {
    res.json([
        { name: 'Day of Arafah', date: 'July 8, 2026', type: 'important' },
        { name: 'Eid al-Adha', date: 'July 9, 2026', type: 'holiday' },
        { name: 'Islamic New Year', date: 'July 26, 2026', type: 'important' },
        { name: 'Day of Ashura', date: 'August 4, 2026', type: 'important' }
    ]);
});

// ============================================================
// ROUTES - USER SETTINGS
// ============================================================

app.put('/api/settings', authMiddleware, async (req, res) => {
    try {
        const { settings } = req.body;
        const user = await User.findByIdAndUpdate(
            req.userId,
            { settings },
            { new: true }
        ).select('-password');
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ============================================================
// HEALTH CHECK
// ============================================================

app.get('/api/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// ============================================================
// START SERVER
// ============================================================

app.listen(PORT, () => {
    console.log(`🚀 DeenMax Backend running on port ${PORT}`);
    console.log(`📍 API URL: http://localhost:${PORT}/api`);
});
