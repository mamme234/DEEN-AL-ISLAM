// ================================================================
// PRAYER LOG MODEL
// ================================================================

const mongoose = require('mongoose');

const PrayerLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true // Format: YYYY-MM-DD
    },
    prayers: [{
        type: String,
        enum: ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']
    }],
    missed: [{
        type: String,
        enum: ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']
    }],
    qada: [{
        type: String,
        enum: ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']
    }],
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

// Index for efficient querying
PrayerLogSchema.index({ userId: 1, date: -1 });
PrayerLogSchema.index({ userId: 1, date: 1 });

// Get prayer count for date
PrayerLogSchema.methods.getPrayerCount = function() {
    return this.prayers.length;
};

// Check if all prayers are done
PrayerLogSchema.methods.isComplete = function() {
    return this.prayers.length === 5;
};

// Get completion percentage
PrayerLogSchema.methods.getCompletion = function() {
    return (this.prayers.length / 5) * 100;
};

module.exports = mongoose.model('PrayerLog', PrayerLogSchema);
