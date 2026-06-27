// ================================================================
// VALIDATION MIDDLEWARE
// ================================================================

const { body, param, query, validationResult } = require('express-validator');

// Validation error handler
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array().map(e => ({
                field: e.param,
                message: e.msg
            }))
        });
    }
    next();
};

// User registration validation
const registerValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 50 }).withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required')
        .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    validate
];

// Login validation
const loginValidation = [
    body('email')
        .trim()
        .notEmpty().withMessage('Email is required')
        .isEmail().withMessage('Please provide a valid email'),
    body('password')
        .notEmpty().withMessage('Password is required'),
    validate
];

// Prayer log validation
const prayerLogValidation = [
    body('date')
        .notEmpty().withMessage('Date is required')
        .isISO8601().withMessage('Invalid date format'),
    body('prayers')
        .isArray().withMessage('Prayers must be an array'),
    body('prayers.*')
        .isIn(['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'])
        .withMessage('Invalid prayer name'),
    validate
];

// Hifz progress validation
const hifzValidation = [
    body('surahId')
        .notEmpty().withMessage('Surah ID is required')
        .isInt({ min: 1, max: 114 }).withMessage('Invalid surah ID'),
    body('surahName')
        .trim()
        .notEmpty().withMessage('Surah name is required'),
    body('ayahsMemorized')
        .isArray().withMessage('Ayahs must be an array'),
    body('ayahsMemorized.*')
        .isInt({ min: 1 }).withMessage('Invalid ayah number'),
    validate
];

// Note validation
const noteValidation = [
    body('surahId')
        .notEmpty().withMessage('Surah ID is required')
        .isInt({ min: 1, max: 114 }).withMessage('Invalid surah ID'),
    body('ayahNum')
        .notEmpty().withMessage('Ayah number is required')
        .isInt({ min: 1 }).withMessage('Invalid ayah number'),
    body('content')
        .trim()
        .notEmpty().withMessage('Note content is required')
        .isLength({ max: 1000 }).withMessage('Note cannot exceed 1000 characters'),
    validate
];

// Bookmark validation
const bookmarkValidation = [
    body('surahId')
        .notEmpty().withMessage('Surah ID is required')
        .isInt({ min: 1, max: 114 }).withMessage('Invalid surah ID'),
    body('ayahNum')
        .notEmpty().withMessage('Ayah number is required')
        .isInt({ min: 1 }).withMessage('Invalid ayah number'),
    validate
];

// Settings validation
const settingsValidation = [
    body('settings.theme')
        .optional()
        .isIn(['dark', 'light']).withMessage('Invalid theme'),
    body('settings.language')
        .optional()
        .isIn(['en', 'ar', 'om', 'am', 'so', 'fr', 'ur', 'tr', 'id'])
        .withMessage('Invalid language'),
    body('settings.reciter')
        .optional()
        .isString().withMessage('Invalid reciter'),
    body('settings.translation')
        .optional()
        .isString().withMessage('Invalid translation'),
    validate
];

// ID param validation
const idValidation = [
    param('id')
        .notEmpty().withMessage('ID is required')
        .isMongoId().withMessage('Invalid ID format'),
    validate
];

module.exports = {
    validate,
    registerValidation,
    loginValidation,
    prayerLogValidation,
    hifzValidation,
    noteValidation,
    bookmarkValidation,
    settingsValidation,
    idValidation
};
