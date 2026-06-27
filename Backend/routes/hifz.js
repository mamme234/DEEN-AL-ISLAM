// ================================================================
// HIFZ ROUTES
// ================================================================

const express = require('express');
const HifzProgress = require('../models/HifzProgress');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { hifzValidation } = require('../middleware/validation');

const router = express.Router();

// ============================================================
// @route   POST /api/hifz
// @desc    Add or update hifz progress
// @access  Private
// ============================================================
router.post('/', auth, hifzValidation, async (req, res) => {
    try {
        const { surahId, surahName, ayahsMemorized, totalAyahs } = req.body;
        
        let progress = await HifzProgress.findOne({
            userId: req.userId,
            surahId
        });
        
        if (progress) {
            progress.ayahsMemorized = ayahsMemorized || progress.ayahsMemorized;
            progress.updatePercentage();
            await progress.save();
        } else {
            progress = new HifzProgress({
                userId: req.userId,
                surahId,
                surahName,
                ayahsMemorized: ayahsMemorized || [],
                totalAyahs
            });
            progress.updatePercentage();
            await progress.save();
        }
        
        // Update user's hifz progress
        await updateUserHifzStats(req.userId);
        
        res.json({
            success: true,
            data: progress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   GET /api/hifz
// @desc    Get user's hifz progress
// @access  Private
// ============================================================
router.get('/', auth, async (req, res) => {
    try {
        const progress = await HifzProgress.find({ userId: req.userId })
            .sort({ surahId: 1 });
        
        const totalMemorized = progress.reduce((sum, p) => sum + p.ayahsMemorized.length, 0);
        
        res.json({
            success: true,
            data: {
                progress,
                total: {
                    surahs: progress.length,
                    ayahs: totalMemorized,
                    completed: progress.filter(p => p.status === 'memorized').length
                }
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
// @route   GET /api/hifz/surah/:surahId
// @desc    Get progress for specific surah
// @access  Private
// ============================================================
router.get('/surah/:surahId', auth, async (req, res) => {
    try {
        const { surahId } = req.params;
        
        const progress = await HifzProgress.findOne({
            userId: req.userId,
            surahId: parseInt(surahId)
        });
        
        res.json({
            success: true,
            data: progress || null
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   PUT /api/hifz/:id
// @desc    Update hifz progress by ID
// @access  Private
// ============================================================
router.put('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        const { ayahsMemorized, notes, difficulty, status } = req.body;
        
        const progress = await HifzProgress.findOne({
            _id: id,
            userId: req.userId
        });
        
        if (!progress) {
            return res.status(404).json({
                success: false,
                error: 'Progress not found'
            });
        }
        
        if (ayahsMemorized) progress.ayahsMemorized = ayahsMemorized;
        if (notes !== undefined) progress.notes = notes;
        if (difficulty) progress.difficulty = difficulty;
        if (status) progress.status = status;
        
        progress.updatePercentage();
        await progress.save();
        
        await updateUserHifzStats(req.userId);
        
        res.json({
            success: true,
            data: progress
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   DELETE /api/hifz/:id
// @desc    Delete hifz progress
// @access  Private
// ============================================================
router.delete('/:id', auth, async (req, res) => {
    try {
        const { id } = req.params;
        
        const progress = await HifzProgress.findOneAndDelete({
            _id: id,
            userId: req.userId
        });
        
        if (!progress) {
            return res.status(404).json({
                success: false,
                error: 'Progress not found'
            });
        }
        
        await updateUserHifzStats(req.userId);
        
        res.json({
            success: true,
            message: 'Progress deleted successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   POST /api/hifz/ayah/:surahId
// @desc    Add/remove ayah from memorized
// @access  Private
// ============================================================
router.post('/ayah/:surahId', auth, async (req, res) => {
    try {
        const { surahId } = req.params;
        const { ayahNum, action } = req.body; // action: 'add' or 'remove'
        
        if (!ayahNum || !action) {
            return res.status(400).json({
                success: false,
                error: 'Ayah number and action are required'
            });
        }
        
        let progress = await HifzProgress.findOne({
            userId: req.userId,
            surahId: parseInt(surahId)
        });
        
        if (!progress) {
            return res.status(404).json({
                success: false,
                error: 'Surah not found in your hifz list'
            });
        }
        
        if (action === 'add') {
            progress.addAyah(ayahNum);
        } else if (action === 'remove') {
            progress.removeAyah(ayahNum);
        } else {
            return res.status(400).json({
                success: false,
                error: 'Invalid action. Use "add" or "remove"'
            });
        }
        
        await progress.save();
        await updateUserHifzStats(req.userId);
        
        res.json({
            success: true,
            data: progress
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

async function updateUserHifzStats(userId) {
    const progress = await HifzProgress.find({ userId });
    
    const totalSurahs = progress.length;
    const totalAyahs = progress.reduce((sum, p) => sum + p.ayahsMemorized.length, 0);
    const totalPossibleAyahs = progress.reduce((sum, p) => sum + p.totalAyahs, 0);
    const percentage = totalPossibleAyahs > 0 
        ? (totalAyahs / totalPossibleAyahs) * 100 
        : 0;
    
    await User.findByIdAndUpdate(userId, {
        'hifzProgress.totalJuz': Math.floor(totalAyahs / 20),
        'hifzProgress.totalSurahs': totalSurahs,
        'hifzProgress.totalAyahs': totalAyahs,
        'hifzProgress.percentage': Math.round(percentage)
    });
}

module.exports = router;
