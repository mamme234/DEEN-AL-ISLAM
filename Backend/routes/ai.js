// ================================================================
// AI ASSISTANT ROUTES
// ================================================================

const express = require('express');
const { auth } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/rateLimiter');

const router = express.Router();

// ============================================================
// @route   POST /api/ai/ask
// @desc    Ask AI assistant a question
// @access  Private
// ============================================================
router.post('/ask', auth, aiLimiter, async (req, res) => {
    try {
        const { question, language = 'en' } = req.body;
        
        if (!question || question.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Please provide a question'
            });
        }
        
        // In production, integrate with OpenAI or other AI API
        const response = await generateAIResponse(question, language);
        
        res.json({
            success: true,
            data: {
                question,
                answer: response.answer,
                sources: response.sources,
                language
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
// @route   POST /api/ai/tafsir
// @desc    Get AI tafsir for specific ayah
// @access  Private
// ============================================================
router.post('/tafsir', auth, aiLimiter, async (req, res) => {
    try {
        const { surahId, ayahNum, language = 'en' } = req.body;
        
        if (!surahId || !ayahNum) {
            return res.status(400).json({
                success: false,
                error: 'Surah ID and Ayah number are required'
            });
        }
        
        const response = await generateTafsir(surahId, ayahNum, language);
        
        res.json({
            success: true,
            data: response
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// @route   POST /api/ai/study-plan
// @desc    Generate personalized study plan
// @access  Private
// ============================================================
router.post('/study-plan', auth, aiLimiter, async (req, res) => {
    try {
        const { goals, level, timeAvailable } = req.body;
        
        const plan = generateStudyPlan(goals, level, timeAvailable);
        
        res.json({
            success: true,
            data: plan
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ============================================================
// AI Response Generator (Simulated)
// ============================================================

async function generateAIResponse(question, language) {
    const q = question.toLowerCase();
    let answer = '';
    let sources = [];
    
    // In production, this would use OpenAI API or similar
    // For now, use keyword-based responses
    
    if (q.includes('charity') || q.includes('zakat') || q.includes('sadaqah')) {
        answer = `📖 **Charity in Islam (Sadaqah & Zakat)**

**Quran:** "The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes; in each spike is a hundred grains." (Surah Al-Baqarah 2:261)

**Hadith:** "Charity does not decrease wealth." (Sahih Muslim)

**Key Points:**
• Zakat is obligatory (2.5% of wealth)
• Sadaqah is voluntary charity
• Charity purifies wealth and soul
• Best charity is given in secret

**Conditions for Zakat:**
1. Wealth reaches Nisab (85g gold)
2. Wealth held for one lunar year
3. On specific assets: gold, silver, cash, livestock, trade goods

**Sources:** Quran 2:261, 2:267, 57:18 | Sahih Muslim 2588`;
        sources = ['Quran', 'Sahih Muslim', 'Fiqh of Zakat'];
        
    } else if (q.includes('fatihah') || q.includes('al-fatihah')) {
        answer = `📖 **Surah Al-Fatihah - "The Opening"**

**Overview:**
• 7 verses (Ayahs)
• Called "Umm al-Kitab" (Mother of the Book)
• Must be recited in every Rak'ah of Salah

**Key Themes:**
1. Verse 1: "Bismillah" - Starting with Allah's name
2. Verse 2: "Alhamdulillah" - All praise is for Allah
3. Verse 3: "Ar-Rahmanir Raheem" - Most Gracious, Most Merciful
4. Verse 4: "Maliki Yawmid-Deen" - Master of Judgment Day
5. Verse 5: "Iyyaka na'budu" - You alone we worship
6. Verses 6-7: "Ihdinas-siratal mustaqeem" - Guide us to the straight path

**Importance:**
• Prophet (PBUH) said it's the greatest Surah in the Quran
• It's a dialogue between Allah and His servant
• Contains all core Islamic beliefs

**Sources:** Quran 1:1-7 | Sahih Bukhari | Tafsir Ibn Kathir`;
        sources = ['Quran', 'Sahih Bukhari', 'Tafsir Ibn Kathir'];
        
    } else if (q.includes('dua') || q.includes('protection') || q.includes('supplication')) {
        answer = `🤲 **Best Duas for Protection**

**Morning/Evening Protection:**
"Bismillahi alladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-sami'ul 'alim."
*(In the name of Allah, nothing on earth or in heaven can harm you, and He is the All-Hearing, All-Knowing)*

**Before Sleep:**
"A'udhu bikalimatillahit-tammati min sharri ma khalaq."
*(I seek refuge in the perfect words of Allah from the evil of what He has created.)*

**General Protection:**
"Rabbi inni a'udhu bika min hamazatish-shayatin."
*(My Lord, I seek refuge in You from the whispers of the devils.)*

**Ayat al-Kursi (2:255):**
Recite after every prayer for protection

**Sources:** Sahih Bukhari 3371 | Tirmidhi 3430 | Quran 2:255`;
        sources = ['Sahih Bukhari', 'Tirmidhi', 'Quran'];
        
    } else if (q.includes('prophet') || q.includes('muhammad') || q.includes('seerah')) {
        answer = `📜 **Prophet Muhammad (PBUH) - Brief Seerah**

**Birth:** Born in Makkah in 570 CE (Year of the Elephant)

**Revelation:** First revelation at age 40 in Cave Hira (Surah Al-Alaq 96:1-5)

**Migration (Hijrah):** Migrated to Madinah in 622 CE - marks the start of the Islamic calendar

**Key Events:**
• 13 years of preaching in Makkah
• Treaty of Hudaybiyyah (628 CE)
• Conquest of Makkah (630 CE)
• Farewell Pilgrimage (632 CE)

**Death:** Passed away in 632 CE at age 63

**His Character:**
• Known as "Al-Amin" (The Trustworthy)
• Honest, kind, humble, just
• Mercy to all mankind

**Sources:** Seerah of Ibn Hisham | Sahih Bukhari | Sahih Muslim`;
        sources = ['Seerah Ibn Hisham', 'Sahih Bukhari', 'Sahih Muslim'];
        
    } else if (q.includes('riba') || q.includes('interest') || q.includes('usury')) {
        answer = `💰 **Ruling on Interest (Riba) in Islam**

**Quran:** "Allah has permitted trade and forbidden riba (interest)." (Surah Al-Baqarah 2:275)

**Hadith:** The Prophet (PBUH) cursed:
1. The one who consumes riba
2. The one who pays it
3. The one who writes it
4. The two who witness it

**Types of Riba:**
1. **Riba al-Nasi'ah:** Interest on loans (delayed payment)
2. **Riba al-Fadl:** Exchange of same commodities in unequal amounts

**Scholarly Consensus:**
All major Islamic schools (Hanafi, Maliki, Shafi'i, Hanbali) agree that Riba is strictly prohibited (Haram).

**Permissible Alternatives:**
• Islamic banking (Murabaha, Mudarabah, Musharakah)
• Profit-sharing investments
• Joint ventures

**Sources:** Quran 2:275-279 | Sahih Muslim 1598 | Fiqh of Muamalat`;
        sources = ['Quran', 'Sahih Muslim', 'Fiqh of Finance'];
        
    } else if (q.includes('tahajjud') || q.includes('night prayer')) {
        answer = `🌙 **How to Pray Tahajjud (Night Prayer)**

**Hadith:** "The best prayer after the obligatory prayers is the night prayer (Tahajjud)." (Sahih Muslim)

**How to Pray:**
1. Wake up after midnight (preferably in the last third of the night)
2. Make wudu (ablution)
3. Pray 2 rak'ahs at a time (minimum 2, maximum 8 or more)
4. Make dua and seek forgiveness

**Best Time:** The last third of the night (approximately 1-2 hours before Fajr)

**Dua for Tahajjud:**
"Allahumma rabba jibril wa mika'il wa israfil..."

**Benefits:**
• Accepted duas
• Increased taqwa
• Forgiveness of sins
• Peace and tranquility

**Sources:** Sahih Muslim 1163 | Fiqh of Salah`;
        sources = ['Sahih Muslim', 'Fiqh of Salah'];
        
    } else if (q.includes('99 names') || q.includes('names of allah') || q.includes('asma ul husna')) {
        answer = `✨ **The 99 Names of Allah (Al-Asma ul-Husna)**

**Hadith:** "Allah has 99 names - whoever memorizes them will enter Paradise." (Sahih Bukhari)

**Key Names:**
1. Ar-Rahman (The Most Gracious)
2. Ar-Raheem (The Most Merciful)
3. Al-Malik (The King)
4. Al-Quddus (The Holy)
5. As-Salam (The Peace)
6. Al-Mu'min (The Faithful)
7. Al-Muhaymin (The Guardian)
8. Al-Aziz (The Almighty)
9. Al-Jabbar (The Compeller)
10. Al-Mutakabbir (The Supreme)

**Benefits of Reciting:**
• Brings blessings and protection
• Increases faith and closeness to Allah
• Accepted duas
• Peace of mind

**Sources:** Sahih Bukhari 2736 | Sahih Muslim 2677`;
        sources = ['Sahih Bukhari', 'Sahih Muslim'];
        
    } else if (q.includes('meaning of life') || q.includes('purpose')) {
        answer = `🌍 **The Purpose of Life in Islam**

**Quran:** "And I did not create the jinn and mankind except to worship Me." (Surah Adh-Dhariyat 51:56)

**Key Purposes:**
1. **Worship of Allah** - Not just rituals, but living life in obedience
2. **Being a Khalifah (Vicegerent)** - Taking care of the earth and humanity
3. **Seeking Knowledge** - Learning about Allah, His creation, and His religion
4. **Doing Good** - Helping others, charity, justice
5. **Achieving Jannah (Paradise)** - The ultimate goal

**Hadith:** "The best of people are those who are most beneficial to others." (At-Tabarani)

**Life as a Test:**
• Life is a test (Surah Al-Mulk 67:2)
• Success is measured by taqwa and righteous deeds
• Every action is recorded

**Sources:** Quran 51:56, 67:2 | At-Tabarani | Fiqh of Aqidah`;
        sources = ['Quran', 'At-Tabarani', 'Fiqh of Aqidah'];
        
    } else {
        answer = `🤖 **I'm here to help!**

I can answer questions about:
• Quran & Tafsir
• Hadith
• Fiqh (rulings)
• Aqidah (beliefs)
• Seerah (Prophet's life)
• Duas & Adhkar
• Islamic history
• Arabic & Tajweed

💡 **Try asking:**
• "What does the Quran say about charity?"
• "Explain Surah Al-Fatihah"
• "Best dua for protection?"
• "History of Prophet Muhammad (PBUH)"
• "What is the ruling on interest?"
• "How to pray Tahajjud?"
• "Explain the 99 names of Allah"
• "What is the meaning of life in Islam?"

📌 *All answers cite authentic Islamic sources!*`;
        sources = ['Islamic Knowledge Base'];
    }
    
    return { answer, sources };
}

async function generateTafsir(surahId, ayahNum, language) {
    // In production, fetch from tafsir API or generate with AI
    return {
        surahId,
        ayahNum,
        tafsir: `📖 Tafsir for Surah ${surahId}, Ayah ${ayahNum}

This is a brief explanation of the ayah. In production, this would be generated using AI or fetched from a tafsir API.

Key points:
• Context of revelation
• Linguistic analysis
• Scholarly interpretations
• Practical applications

📌 *This is a simulated response. Connect to OpenAI or a tafsir API for real responses.*`,
        sources: ['Tafsir Ibn Kathir', 'Tafsir Al-Jalalayn']
    };
}

function generateStudyPlan(goals, level, timeAvailable) {
    return {
        title: 'Personalized Islamic Study Plan',
        duration: '30 days',
        level: level || 'intermediate',
        dailyCommitment: timeAvailable || '30 minutes',
        objectives: goals || ['Read Quran daily', 'Learn basic Islamic knowledge'],
        weeklySchedule: [
            { day: 'Monday', topic: 'Quran Recitation', duration: '20 min' },
            { day: 'Tuesday', topic: 'Hadith Study', duration: '20 min' },
            { day: 'Wednesday', topic: 'Fiqh Basics', duration: '20 min' },
            { day: 'Thursday', topic: 'Quran Tafsir', duration: '20 min' },
            { day: 'Friday', topic: 'Seerah (Prophet\'s Life)', duration: '20 min' },
            { day: 'Saturday', topic: 'Review & Reflection', duration: '30 min' },
            { day: 'Sunday', topic: 'Duas & Adhkar', duration: '15 min' }
        ],
        resources: [
            'Quran with Translation',
            'Sahih Bukhari',
            'Fiqh of Salah',
            'Seerah Ibn Hisham'
        ],
        milestones: [
            'Complete 1 Juz of Quran',
            'Memorize 5 new duas',
            'Learn 10 hadith'
        ]
    };
}

module.exports = router;
