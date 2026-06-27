// ================================================================
// BOOKMARK MODEL
// ================================================================

const mongoose = require('mongoose');

const BookmarkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    surahId: {
        type: Number,
        required: true
    },
    ayahNum: {
        type: Number,
        required: true
    },
    ayahText: {
        type: String,
        default: ''
    },
    translation: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        maxlength: 50,
        default: ''
    },
    color: {
        type: String,
        default: '#d4af37'
    },
    notes: {
        type: String,
        maxlength: 200,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index
BookmarkSchema.index({ userId: 1, surahId: 1, ayahNum: 1 }, { unique: true });
BookmarkSchema.index({ userId: 1, createdAt: -1 });

// Get bookmarks by surah
BookmarkSchema.statics.getBySurah = async function(userId, surahId) {
    return await this.find({ userId, surahId }).sort({ ayahNum: 1 });
};

// Get recent bookmarks
BookmarkSchema.statics.getRecent = async function(userId, limit = 10) {
    return await this.find({ userId })
        .sort({ createdAt: -1 })
        .limit(limit);
};

module.exports = mongoose.model('Bookmark', BookmarkSchema);
