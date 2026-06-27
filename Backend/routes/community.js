// ================================================================
// COMMUNITY ROUTES
// ================================================================

const express = require('express');
const axios = require('axios');
const { auth } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// ============================================================
// @route   GET /api/community/mosques/nearby
// @desc    Get nearby mosques
// @access  Public
// ============================================================
router.get('/mosques/nearby', apiLimiter, async (req, res) => {
    try {
        const { lat, lng, radius = 5000 } = req.query;
        
        if (!lat || !lng) {
            return res.status(400).json({
                success: false,
                error: 'Latitude and longitude are required'
            });
        }
        
        // In production, use Google Places API or similar
        // For demo, return sample data
        const mosques = [
            {
                id: 1,
                name: 'Masjid Al-Haram',
                address: 'Makkah, Saudi Arabia',
                distance: '2.3 km',
                lat: 21.4225,
                lng: 39.8262,
                prayers: {
                    fajr: '5:00 AM',
                    dhuhr: '12:00 PM',
                    asr: '3:30 PM',
                    maghrib: '6:15 PM',
                    isha: '7:45 PM'
                }
            },
            {
                id: 2,
                name: 'Al-Masjid An-Nabawi',
                address: 'Madinah, Saudi Arabia',
                distance: '5.1 km',
                lat: 24.4672,
                lng: 39.6112,
                prayers: {
                    fajr: '4:45 AM',
                    dhuhr: '11:45 AM',
                    asr: '3:15 PM',
                    maghrib: '6:00 PM',
                    isha: '7:30 PM'
                }
            },
            {
                id: 3,
                name: 'Masjid Quba',
                address: 'Madinah, Saudi Arabia',
                distance: '8.7 km',
                lat: 24.4381,
                lng: 39.6161,
                prayers: {
                    fajr: '4:48 AM',
                    dhuhr: '11:48 AM',
                    asr: '3:18 PM',
                    maghrib: '6:03 PM',
                    isha: '7:33 PM'
                }
            }
        ];
        
        res.json({
            success: true,
            data: mosques
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   GET /api/community/events/upcoming
// @desc    Get upcoming Islamic events
// @access  Public
// ============================================================
router.get('/events/upcoming', async (req, res) => {
    try {
        const events = [
            {
                id: 1,
                name: 'Day of Arafah',
                date: 'July 8, 2026',
                hijriDate: '9 Dhul-Hijjah 1447',
                type: 'important',
                description: 'The day of Arafah is one of the most important days for Muslims. Fasting on this day expiates the sins of two years.',
                actions: ['Fasting (recommended)', 'Make dua', 'Dhikr']
            },
            {
                id: 2,
                name: 'Eid al-Adha',
                date: 'July 9, 2026',
                hijriDate: '10 Dhul-Hijjah 1447',
                type: 'holiday',
                description: 'Eid al-Adha is the Festival of Sacrifice, commemorating the willingness of Ibrahim (AS) to sacrifice his son.',
                actions: ['Prayer', 'Sacrifice (Qurbani)', 'Feast', 'Give charity']
            },
            {
                id: 3,
                name: 'Islamic New Year',
                date: 'July 26, 2026',
                hijriDate: '1 Muharram 1448',
                type: 'important',
                description: 'The Islamic New Year marks the beginning of the Hijri calendar.',
                actions: ['Reflect on the year', 'Make dua', 'Plan for the new year']
            },
            {
                id: 4,
                name: 'Day of Ashura',
                date: 'August 4, 2026',
                hijriDate: '10 Muharram 1448',
                type: 'important',
                description: 'Ashura is a day of fasting and reflection. Fasting on this day expiates the sins of the past year.',
                actions: ['Fasting (recommended)', 'Extra prayers', 'Charity']
            },
            {
                id: 5,
                name: 'Mawlid al-Nabi',
                date: 'September 20, 2026',
                hijriDate: '12 Rabi al-Awwal 1448',
                type: 'commemorative',
                description: 'The birth of Prophet Muhammad (PBUH), celebrated by many Muslims worldwide.',
                actions: ['Sending blessings', 'Learning about Seerah', 'Gathering']
            }
        ];
        
        res.json({
            success: true,
            data: events
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   GET /api/community/charity/campaigns
// @desc    Get active charity campaigns
// @access  Public
// ============================================================
router.get('/charity/campaigns', async (req, res) => {
    try {
        const campaigns = [
            {
                id: 1,
                name: 'Ramadan Food Drive',
                organization: 'Islamic Relief',
                description: 'Provide iftar meals to those in need during Ramadan.',
                goal: 50000,
                raised: 32450,
                currency: 'USD',
                progress: 64.9,
                deadline: 'April 30, 2026'
            },
            {
                id: 2,
                name: 'Mosque Construction Fund',
                organization: 'Local Masjid',
                description: 'Help build a new mosque in the community.',
                goal: 100000,
                raised: 67800,
                currency: 'USD',
                progress: 67.8,
                deadline: 'December 31, 2026'
            },
            {
                id: 3,
                name: 'Education for Children',
                organization: 'Islamic Education Fund',
                description: 'Provide education for underprivileged Muslim children.',
                goal: 25000,
                raised: 12350,
                currency: 'USD',
                progress: 49.4,
                deadline: 'September 30, 2026'
            }
        ];
        
        res.json({
            success: true,
            data: campaigns
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   GET /api/community/halal/restaurants
// @desc    Get nearby halal restaurants
// @access  Public
// ============================================================
router.get('/halal/restaurants', apiLimiter, async (req, res) => {
    try {
        const { lat, lng } = req.query;
        
        // In production, use Google Places API
        const restaurants = [
            {
                id: 1,
                name: 'Halal Bites',
                cuisine: 'Middle Eastern',
                distance: '1.2 km',
                rating: 4.5,
                address: '123 Main St'
            },
            {
                id: 2,
                name: 'Arabic Flavors',
                cuisine: 'Lebanese',
                distance: '2.8 km',
                rating: 4.3,
                address: '456 Oak Ave'
            },
            {
                id: 3,
                name: 'Spice of Istanbul',
                cuisine: 'Turkish',
                distance: '3.5 km',
                rating: 4.7,
                address: '789 Pine Rd'
            }
        ];
        
        res.json({
            success: true,
            data: restaurants
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   GET /api/community/groups
// @desc    Get community groups
// @access  Private
// ============================================================
router.get('/groups', auth, async (req, res) => {
    try {
        const groups = [
            {
                id: 1,
                name: 'Daily Quran Circle',
                type: 'study',
                members: 25,
                nextMeeting: 'Today, 6:00 PM',
                description: 'Daily Quran reading and reflection'
            },
            {
                id: 2,
                name: 'Hadith Study Group',
                type: 'study',
                members: 15,
                nextMeeting: 'Wednesday, 7:00 PM',
                description: 'Study of Sahih Bukhari'
            },
            {
                id: 3,
                name: 'Sisters\' Hifz Group',
                type: 'hifz',
                members: 12,
                nextMeeting: 'Friday, 5:00 PM',
                description: 'Quran memorization for sisters'
            },
            {
                id: 4,
                name: 'Youth Islamic Circle',
                type: 'social',
                members: 40,
                nextMeeting: 'Saturday, 3:00 PM',
                description: 'Islamic discussions and activities for youth'
            }
        ];
        
        res.json({
            success: true,
            data: groups
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
