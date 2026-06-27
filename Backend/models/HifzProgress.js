// ================================================================
// HIFZ PROGRESS MODEL
// ================================================================

const mongoose = require('mongoose');

const HifzProgressSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    surahId: {
        type: Number,
        required: true
    },
    surahName: {
        type: String,
        required: true
    },
    ayahsMemorized: {
        type: [Number],
        default: []
    },
    totalAyahs: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['not_started', 'in_progress', 'memorized', 'reviewing'],
        default: 'not_started'
    },
    percentage: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    lastReview: {
        type: Date,
        default: Date.now
    },
    nextReview: {
        type: Date,
        default: null
    },
    notes: {
        type: String,
        maxlength: 500,
        default: ''
    },
    difficulty: {
        type: String,
        enum: ['easy', 'medium', 'hard'],
        default: 'medium'
    },
    attempts: {
        type: Number,
        default: 0
    },
    mastered: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Index
HifzProgressSchema.index({ userId: 1, surahId: 1 }, { unique: true });
HifzProgressSchema.index({ userId: 1, status: 1 });

// Update percentage
HifzProgressSchema.methods.updatePercentage = function() {
    if (this.totalAyahs > 0) {
        this.percentage = (this.ayahsMemorized.length / this.totalAyahs) * 100;
        if (this.percentage === 100) {
            this.status = 'memorized';
        } else if (this.percentage > 0) {
            this.status = 'in_progress';
        }
    }
    return this.percentage;
};

// Add ayah to memorized
HifzProgressSchema.methods.addAyah = function(ayahNum) {
    if (!this.ayahsMemorized.includes(ayahNum)) {
        this.ayahsMemorized.push(ayahNum);
        this.attempts += 1;
        this.updatePercentage();
    }
    return this;
};

// Remove ayah from memorized
HifzProgressSchema.methods.removeAyah = function(ayahNum) {
    this.ayahsMemorized = this.ayahsMemorized.filter(a => a !== ayahNum);
    this.updatePercentage();
    return this;
};

// Check if ayah is memorized
HifzProgressSchema.methods.isAyahMemorized = function(ayahNum) {
    return this.ayahsMemorized.includes(ayahNum);
};

module.exports = mongoose.model('HifzProgress', HifzProgressSchema);
