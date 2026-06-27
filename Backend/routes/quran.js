// ================================================================
// QURAN ROUTES
// ================================================================

const express = require('express');
const axios = require('axios');
const { QURAN_API_URL, QURAN_AUDIO_URL } = require('../config/constants');
const { auth, optionalAuth } = require('../middleware/auth');
const { apiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// ============================================================
// @route   GET /api/quran/surahs
// @desc    Get all surahs
// @access  Public
// ============================================================
router.get('/surahs', apiLimiter, async (req, res) => {
    try {
        const response = await axios.get(`${QURAN_API_URL}/surah`);
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
// @route   GET /api/quran/surah/:id
// @desc    Get surah by ID with translation
// @access  Public
// ============================================================
router.get('/surah/:id', apiLimiter, async (req, res) => {
    try {
        const { id } = req.params;
        const edition = req.query.edition || 'en.asad';
        
        const response = await axios.get(
            `${QURAN_API_URL}/surah/${id}/${edition}`
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
// @route   GET /api/quran/ayah/:surahId/:ayahNum
// @desc    Get specific ayah with translation
// @access  Public
// ============================================================
router.get('/ayah/:surahId/:ayahNum', apiLimiter, async (req, res) => {
    try {
        const { surahId, ayahNum } = req.params;
        const edition = req.query.edition || 'en.asad';
        
        const response = await axios.get(
            `${QURAN_API_URL}/ayah/${surahId}:${ayahNum}/${edition}`
        );
        
        // Get tafsir if requested
        let tafsir = null;
        if (req.query.tafsir === 'true') {
            try {
                const tafsirRes = await axios.get(
                    `https://api.quran-tafsir.com/tafsir/${surahId}/${ayahNum}`
                );
                tafsir = tafsirRes.data;
            } catch {}
        }
        
        res.json({
            success: true,
            data: {
                ayah: response.data.data,
                tafsir
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.data?.message || error.message
        });
    }
});

// ============================================================
// @route   GET /api/quran/audio/:reciter/:surahId/:ayahNum
// @desc    Get audio URL for ayah
// @access  Public
// ============================================================
router.get('/audio/:reciter/:surahId/:ayahNum', async (req, res) => {
    try {
        const { reciter, surahId, ayahNum } = req.params;
        const audioUrl = `${QURAN_AUDIO_URL}/${reciter}/${surahId}_${ayahNum}.mp3`;
        
        res.json({
            success: true,
            audioUrl
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   GET /api/quran/search
// @desc    Search Quran
// @access  Public
// ============================================================
router.get('/search', apiLimiter, async (req, res) => {
    try {
        const { query, language = 'en' } = req.query;
        
        if (!query) {
            return res.status(400).json({
                success: false,
                error: 'Search query is required'
            });
        }

        const response = await axios.get(
            `https://api.quran.com/api/v4/search?q=${encodeURIComponent(query)}&language=${language}`
        );
        
        res.json({
            success: true,
            data: response.data
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.response?.data?.message || error.message
        });
    }
});

// ============================================================
// @route   GET /api/quran/juz/:juzNum
// @desc    Get surahs by juz
// @access  Public
// ============================================================
router.get('/juz/:juzNum', apiLimiter, async (req, res) => {
    try {
        const { juzNum } = req.params;
        const edition = req.query.edition || 'en.asad';
        
        const response = await axios.get(
            `${QURAN_API_URL}/juz/${juzNum}/${edition}`
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
// @route   GET /api/quran/page/:pageNum
// @desc    Get surahs by page
// @access  Public
// ============================================================
router.get('/page/:pageNum', apiLimiter, async (req, res) => {
    try {
        const { pageNum } = req.params;
        const edition = req.query.edition || 'en.asad';
        
        const response = await axios.get(
            `${QURAN_API_URL}/page/${pageNum}/${edition}`
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
// @route   GET /api/quran/reciters
// @desc    Get list of reciters
// @access  Public
// ============================================================
router.get('/reciters', async (req, res) => {
    try {
        const reciters = [
            { id: 'mishary', name: 'Mishary Alafasy' },
            { id: 'sudais', name: 'Abdur-Rahman As-Sudais' },
            { id: 'shuraim', name: 'Saud Ash-Shuraim' },
            { id: 'ghamdi', name: 'Saad Al-Ghamdi' },
            { id: 'ayyub', name: 'Maher Al-Muaiqly' },
            { id: 'husary', name: 'Mahmoud Khalil Al-Husary' },
            { id: 'minshawi', name: 'Mohammed Siddiq Al-Minshawi' }
        ];
        
        res.json({
            success: true,
            data: reciters
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
