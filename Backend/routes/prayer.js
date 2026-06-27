// ================================================================
// PRAYER ROUTES
// ================================================================

const express = require('express');
const axios = require('axios');
const PrayerLog = require('../models/PrayerLog');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { prayerLogValidation } = require('../middleware/validation');
const { prayerLimiter } = require('../middleware/rateLimiter');
const { PRAYER_API_URL } = require('../config/constants');

const router = express.Router();

// ============================================================
// @route   GET /api/prayer/times
// @desc    Get prayer times for a city
// @access  Public
// ============================================================
router.get('/times', prayerLimiter, async (req, res) => {
    try {
        const { city, country = 'SA', method = 4 } = req.query;
        
        if (!city) {
            return res.status(400).json({
                success: false,
                error: 'City is required'
            });
        }

        const response = await axios.get(
            `${PRAYER_API_URL}/timingsByCity?city=${encodeURIComponent(city)}&country=${country}&method=${method}`
        );
        
        res.json({
            success: true,
            data: response.data.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.data?.message || error.message
        });
    }
});

// ============================================================
// @route   GET /api/prayer/times/coordinates
// @desc    Get prayer times by coordinates
// @access  Public
// ============================================================
router.get('/times/coordinates', prayerLimiter, async (req, res) => {
    try {
        const { lat, lng, method = 4 } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                error: 'Latitude and longitude are required'
            });
        }

        const response = await axios.get(
            `${PRAYER_API_URL}/timings?latitude=${lat}&longitude=${lng}&method=${method}`
        );
        
        res.json({
            success: true,
            data: response.data.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.data?.message || error.message
        });
    }
});

// ============================================================
// @route   POST /api/prayer/log
// @desc    Log prayer for today
// @access  Private
// ============================================================
router.post('/log', auth, prayerLogValidation, async (req, res) => {
    try {
        const { date, prayers, missed, qada, notes } = req.body;
        
        let log = await PrayerLog.findOne({ userId: req.userId, date });
        
        if (log) {
            // Update existing log
            log.prayers = prayers || log.prayers;
            log.missed = missed || log.missed;
            log.qada = qada || log.qada;
            if (notes) log.notes = notes;
        } else {
            // Create new log
            log = new PrayerLog({
                userId: req.userId,
                date,
                prayers: prayers || [],
                missed: missed || [],
                qada: qada || [],
                notes: notes || ''
            });
        }
        
        await log.save();
        
        // Update user streak
        await updatePrayerStreak(req.userId);
        
        res.json({
            success: true,
            data: log
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   GET /api/prayer/logs
// @desc    Get prayer logs
// @access  Private
// ============================================================
router.get('/logs', auth, async (req, res) => {
    try {
        const { startDate, endDate, limit = 30 } = req.query;
        const query = { userId: req.userId };
        
        if (startDate) query.date = { $gte: startDate };
        if (endDate) query.date = { ...query.date, $lte: endDate };
        
        const logs = await PrayerLog.find(query)
            .sort({ date: -1 })
            .limit(parseInt(limit));
        
        res.json({
            success: true,
            data: logs
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   GET /api/prayer/stats
// @desc    Get prayer statistics
// @access  Private
// ============================================================
router.get('/stats', auth, async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(days));
        
        const dateStr = startDate.toISOString().split('T')[0];
        
        const logs = await PrayerLog.find({
            userId: req.userId,
            date: { $gte: dateStr }
        });
        
        const totalDays = logs.length;
        const completeDays = logs.filter(l => l.prayers.length === 5).length;
        const totalPrayers = logs.reduce((sum, l) => sum + l.prayers.length, 0);
        
        // Get monthly breakdown
        const monthlyBreakdown = {};
        logs.forEach(log => {
            const month = log.date.substring(0, 7);
            if (!monthlyBreakdown[month]) {
                monthlyBreakdown[month] = { total: 0, complete: 0 };
            }
            monthlyBreakdown[month].total += 1;
            if (log.prayers.length === 5) {
                monthlyBreakdown[month].complete += 1;
            }
        });
        
        // Get prayer breakdown
        const prayerBreakdown = { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0 };
        logs.forEach(log => {
            log.prayers.forEach(p => {
                if (prayerBreakdown[p] !== undefined) {
                    prayerBreakdown[p] += 1;
                }
            });
        });
        
        res.json({
            success: true,
            data: {
                totalDays,
                completeDays,
                completionRate: totalDays > 0 ? (completeDays / totalDays) * 100 : 0,
                totalPrayers,
                prayerBreakdown,
                monthlyBreakdown,
                streak: await getPrayerStreak(req.userId)
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// Helper Functions
// ============================================================

async function updatePrayerStreak(userId) {
    const today = new Date().toISOString().split('T')[0];
    let streak = 0;
    let date = new Date();
    
    while (true) {
        const dateStr = date.toISOString().split('T')[0];
        const log = await PrayerLog.findOne({ userId, date: dateStr });
        
        if (!log || log.prayers.length < 5) {
            break;
        }
        
        streak++;
        date.setDate(date.getDate() - 1);
    }
    
    await User.findByIdAndUpdate(userId, {
        'stats.prayerStreak': streak
    });
    
    return streak;
}

async function getPrayerStreak(userId) {
    const user = await User.findById(userId);
    return user?.stats?.prayerStreak || 0;
}

module.exports = router;
