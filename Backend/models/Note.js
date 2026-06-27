// ================================================================
// NOTE MODEL
// ================================================================

const mongoose = require('mongoose');

const NoteSchema = new mongoose.Schema({
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
    content: {
        type: String,
        required: [true, 'Please provide note content'],
        maxlength: [1000, 'Note cannot exceed 1000 characters']
    },
    tags: [{
        type: String,
        maxlength: 20
    }],
    isPrivate: {
        type: Boolean,
        default: true
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

// Index
NoteSchema.index({ userId: 1, surahId: 1, ayahNum: 1 }, { unique: true });
NoteSchema.index({ userId: 1, tags: 1 });

// Get notes by surah
NoteSchema.statics.getBySurah = async function(userId, surahId) {
    return await this.find({ userId, surahId }).sort({ ayahNum: 1 });
};

// Get note by ayah
NoteSchema.statics.getByAyah = async function(userId, surahId, ayahNum) {
    return await this.findOne({ userId, surahId, ayahNum });
};

module.exports = mongoose.model('Note', NoteSchema);
