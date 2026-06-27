// ================================================================
// SETTINGS ROUTES
// ================================================================

const express = require('express');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { settingsValidation } = require('../middleware/validation');

const router = express.Router();

// ============================================================
// @route   GET /api/settings
// @desc    Get user settings
// @access  Private
// ============================================================
router.get('/', auth, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('settings');
        
        res.json({
            success: true,
            data: user.settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   PUT /api/settings
// @desc    Update user settings
// @access  Private
// ============================================================
router.put('/', auth, settingsValidation, async (req, res) => {
    try {
        const { settings } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: { settings } },
            { new: true, runValidators: true }
        ).select('settings');
        
        res.json({
            success: true,
            data: user.settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   PUT /api/settings/theme
// @desc    Update theme preference
// @access  Private
// ============================================================
router.put('/theme', auth, async (req, res) => {
    try {
        const { theme } = req.body;
        
        if (!['dark', 'light'].includes(theme)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid theme. Use "dark" or "light"'
            });
        }
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: { 'settings.theme': theme } },
            { new: true }
        ).select('settings');
        
        res.json({
            success: true,
            data: user.settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   PUT /api/settings/language
// @desc    Update language preference
// @access  Private
// ============================================================
router.put('/language', auth, async (req, res) => {
    try {
        const { language } = req.body;
        const supported = ['en', 'ar', 'om', 'am', 'so', 'fr', 'ur', 'tr', 'id'];
        
        if (!supported.includes(language)) {
            return res.status(400).json({
                success: false,
                error: 'Unsupported language'
            });
        }
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: { 'settings.language': language } },
            { new: true }
        ).select('settings');
        
        res.json({
            success: true,
            data: user.settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   PUT /api/settings/notifications
// @desc    Update notification preferences
// @access  Private
// ============================================================
router.put('/notifications', auth, async (req, res) => {
    try {
        const { notifications } = req.body;
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: { 'settings.notifications': notifications } },
            { new: true }
        ).select('settings');
        
        res.json({
            success: true,
            data: user.settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   PUT /api/settings/reciter
// @desc    Update preferred reciter
// @access  Private
// ============================================================
router.put('/reciter', auth, async (req, res) => {
    try {
        const { reciter } = req.body;
        const reciters = ['mishary', 'sudais', 'shuraim', 'ghamdi', 'ayyub', 'husary', 'minshawi'];
        
        if (!reciters.includes(reciter)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid reciter'
            });
        }
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: { 'settings.reciter': reciter } },
            { new: true }
        ).select('settings');
        
        res.json({
            success: true,
            data: user.settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   PUT /api/settings/translation
// @desc    Update preferred translation
// @access  Private
// ============================================================
router.put('/translation', auth, async (req, res) => {
    try {
        const { translation } = req.body;
        const translations = ['en', 'ar', 'om', 'am', 'so', 'fr', 'ur', 'tr', 'id'];
        
        if (!translations.includes(translation)) {
            return res.status(400).json({
                success: false,
                error: 'Invalid translation'
            });
        }
        
        const user = await User.findByIdAndUpdate(
            req.userId,
            { $set: { 'settings.translation': translation } },
            { new: true }
        ).select('settings');
        
        res.json({
            success: true,
            data: user.settings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
