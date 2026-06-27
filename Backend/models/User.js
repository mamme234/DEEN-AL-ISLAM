// ================================================================
// USER MODEL
// ================================================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'],
        trim: true,
        maxlength: [50, 'Name cannot exceed 50 characters']
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please provide a valid email'
        ]
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Password must be at least 6 characters'],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin', 'teacher'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        maxlength: [200, 'Bio cannot exceed 200 characters'],
        default: ''
    },
    location: {
        city: { type: String, default: 'Makkah' },
        country: { type: String, default: 'SA' },
        coordinates: {
            lat: { type: Number, default: 21.4225 },
            lng: { type: Number, default: 39.8262 }
        }
    },
    settings: {
        theme: {
            type: String,
            enum: ['dark', 'light'],
            default: 'dark'
        },
        language: {
            type: String,
            enum: ['en', 'ar', 'om', 'am', 'so', 'fr', 'ur', 'tr', 'id'],
            default: 'en'
        },
        notifications: {
            prayer: { type: Boolean, default: true },
            adhan: { type: Boolean, default: true },
            dailyAyah: { type: Boolean, default: true },
            dailyHadith: { type: Boolean, default: true },
            reminders: { type: Boolean, default: true }
        },
        reciter: {
            type: String,
            default: 'mishary'
        },
        translation: {
            type: String,
            default: 'en'
        },
        quranFontSize: {
            type: Number,
            default: 24
        }
    },
    stats: {
        versesRead: { type: Number, default: 0 },
        tasbihCount: { type: Number, default: 0 },
        prayerStreak: { type: Number, default: 0 },
        bestStreak: { type: Number, default: 0 },
        badges: [{ type: String }],
        level: { type: Number, default: 1 },
        xp: { type: Number, default: 0 }
    },
    hifzProgress: {
        totalJuz: { type: Number, default: 0 },
        totalSurahs: { type: Number, default: 0 },
        totalAyahs: { type: Number, default: 0 },
        percentage: { type: Number, default: 0 }
    },
    bookmarks: [{
        surahId: Number,
        ayahNum: Number,
        date: { type: Date, default: Date.now }
    }],
    lastActive: {
        type: Date,
        default: Date.now
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare password method
UserSchema.methods.comparePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

// Update stats method
UserSchema.methods.updateStats = async function(stats) {
    this.stats = { ...this.stats, ...stats };
    await this.save();
};

// Update hifz progress method
UserSchema.methods.updateHifzProgress = async function(progress) {
    this.hifzProgress = { ...this.hifzProgress, ...progress };
    await this.save();
};

module.exports = mongoose.model('User', UserSchema);
