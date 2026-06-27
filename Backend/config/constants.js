// ================================================================
// CONSTANTS & CONFIGURATION
// ================================================================

module.exports = {
    // Prayer Times API
    PRAYER_API_URL: 'https://api.aladhan.com/v1',
    
    // Quran API
    QURAN_API_URL: 'https://api.alquran.cloud/v1',
    QURAN_AUDIO_URL: 'https://cdn.islamic.network/quran/audio/128',
    
    // Nisab Values (in USD)
    NISAB_GOLD: 5000, // 85g gold ~ $5000
    NISAB_SILVER: 350, // 595g silver ~ $350
    
    // Zakat Rate
    ZAKAT_RATE: 0.025, // 2.5%
    
    // JWT
    JWT_EXPIRY: '7d',
    
    // Rate Limiting
    RATE_LIMIT_WINDOW: 15 * 60 * 1000, // 15 minutes
    RATE_LIMIT_MAX: 100,
    
    // Supported Languages
    LANGUAGES: [
        'en', 'ar', 'om', 'am', 'so', 
        'fr', 'ur', 'tr', 'id', 'es', 
        'de', 'ru', 'zh', 'hi'
    ],
    
    // Reciters
    RECITERS: [
        'mishary',
        'sudais',
        'shuraim',
        'ghamdi',
        'ayyub',
        'husary',
        'minshawi'
    ],
    
    // Hadith Collections
    HADITH_COLLECTIONS: [
        'bukhari',
        'muslim',
        'tirmidhi',
        'abudawud',
        'nasai',
        'ibnmajah',
        'malik',
        'nawawi'
    ],
    
    // Course Categories
    COURSE_CATEGORIES: [
        'quran',
        'hadith',
        'fiqh',
        'aqidah',
        'seerah',
        'arabic',
        'tajweed',
        'dua'
    ],
    
    // Video Categories
    VIDEO_CATEGORIES: [
        'recitation',
        'tafsir',
        'hadith',
        'aqidah',
        'fiqh',
        'seerah',
        'arabic',
        'tajweed',
        'kids',
        'ramadan',
        'hajj',
        'newmuslim'
    ]
};
