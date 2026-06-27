// ================================================================
// FASTING LOG MODEL
// ================================================================

const mongoose = require('mongoose');

const FastingLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    date: {
        type: String,
        required: true // Format: YYYY-MM-DD
    },
    type: {
        type: String,
        enum: ['fard', 'sunna', 'qada', 'nafl', 'ramadan', 'ashura', 'arafah'],
        required: true
    },
    suhoor: {
        type: Boolean,
        default: false
    },
    iftar: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String,
        maxlength: 200,
        default: ''
    },
    duration: {
        type: Number, // in hours
        default: 0
    },
    completed: {
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Index
FastingLogSchema.index({ userId: 1, date: -1 });
FastingLogSchema.index({ userId: 1, type: 1 });

// Get fasting count by type
FastingLogSchema.statics.getCountByType = async function(userId, type) {
    return await this.countDocuments({ userId, type, completed: true });
};

// Get total fasting days
FastingLogSchema.statics.getTotalDays = async function(userId) {
    return await this.countDocuments({ userId, completed: true });
};

module.exports = mongoose.model('FastingLog', FastingLogSchema);
