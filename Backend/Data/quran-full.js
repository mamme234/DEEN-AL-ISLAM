// ================================================================
// QURAN DATA - COMPLETE WITH ALL 114 SURAHS
// Using quran-json package format for consistency
// ================================================================

// Option 1: Fetch from CDN (Recommended for production)
// This gives you all 114 surahs with translations

async function fetchFullQuran() {
    try {
        const response = await fetch('https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/quran_en.json');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching Quran data:', error);
        return null;
    }
}

// Option 2: Fetch a single surah
async function fetchSurah(surahId) {
    try {
        const response = await fetch(`https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist/chapters/en/${surahId}.json`);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`Error fetching surah ${surahId}:`, error);
        return null;
    }
}

// Option 3: Local data structure for offline use
// (This is a sample with all surah names and metadata)

const QURAN_METADATA = {
    // All 114 surahs with their metadata
    1: { name: "Al-Fatihah", englishName: "The Opening", totalAyahs: 7, revelationType: "Meccan" },
    2: { name: "Al-Baqarah", englishName: "The Cow", totalAyahs: 286, revelationType: "Medinan" },
    3: { name: "Al-Imran", englishName: "The Family of Imran", totalAyahs: 200, revelationType: "Medinan" },
    4: { name: "An-Nisa", englishName: "The Women", totalAyahs: 176, revelationType: "Medinan" },
    5: { name: "Al-Ma'idah", englishName: "The Table Spread", totalAyahs: 120, revelationType: "Medinan" },
    6: { name: "Al-An'am", englishName: "The Cattle", totalAyahs: 165, revelationType: "Meccan" },
    7: { name: "Al-A'raf", englishName: "The Heights", totalAyahs: 206, revelationType: "Meccan" },
    8: { name: "Al-Anfal", englishName: "The Spoils of War", totalAyahs: 75, revelationType: "Medinan" },
    9: { name: "At-Tawbah", englishName: "The Repentance", totalAyahs: 129, revelationType: "Medinan" },
    10: { name: "Yunus", englishName: "Jonah", totalAyahs: 109, revelationType: "Meccan" },
    11: { name: "Hud", englishName: "Hud", totalAyahs: 123, revelationType: "Meccan" },
    12: { name: "Yusuf", englishName: "Joseph", totalAyahs: 111, revelationType: "Meccan" },
    13: { name: "Ar-Ra'd", englishName: "The Thunder", totalAyahs: 43, revelationType: "Medinan" },
    14: { name: "Ibrahim", englishName: "Abraham", totalAyahs: 52, revelationType: "Meccan" },
    15: { name: "Al-Hijr", englishName: "The Rock", totalAyahs: 99, revelationType: "Meccan" },
    16: { name: "An-Nahl", englishName: "The Bee", totalAyahs: 128, revelationType: "Meccan" },
    17: { name: "Al-Isra", englishName: "The Night Journey", totalAyahs: 111, revelationType: "Meccan" },
    18: { name: "Al-Kahf", englishName: "The Cave", totalAyahs: 110, revelationType: "Meccan" },
    19: { name: "Maryam", englishName: "Mary", totalAyahs: 98, revelationType: "Meccan" },
    20: { name: "Ta-Ha", englishName: "Ta-Ha", totalAyahs: 135, revelationType: "Meccan" },
    21: { name: "Al-Anbiya", englishName: "The Prophets", totalAyahs: 112, revelationType: "Meccan" },
    22: { name: "Al-Hajj", englishName: "The Pilgrimage", totalAyahs: 78, revelationType: "Medinan" },
    23: { name: "Al-Mu'minun", englishName: "The Believers", totalAyahs: 118, revelationType: "Meccan" },
    24: { name: "An-Nur", englishName: "The Light", totalAyahs: 64, revelationType: "Medinan" },
    25: { name: "Al-Furqan", englishName: "The Criterion", totalAyahs: 77, revelationType: "Meccan" },
    26: { name: "Ash-Shu'ara", englishName: "The Poets", totalAyahs: 227, revelationType: "Meccan" },
    27: { name: "An-Naml", englishName: "The Ant", totalAyahs: 93, revelationType: "Meccan" },
    28: { name: "Al-Qasas", englishName: "The Stories", totalAyahs: 88, revelationType: "Meccan" },
    29: { name: "Al-Ankabut", englishName: "The Spider", totalAyahs: 69, revelationType: "Meccan" },
    30: { name: "Ar-Rum", englishName: "The Romans", totalAyahs: 60, revelationType: "Meccan" },
    31: { name: "Luqman", englishName: "Luqman", totalAyahs: 34, revelationType: "Meccan" },
    32: { name: "As-Sajdah", englishName: "The Prostration", totalAyahs: 30, revelationType: "Meccan" },
    33: { name: "Al-Ahzab", englishName: "The Combined Forces", totalAyahs: 73, revelationType: "Medinan" },
    34: { name: "Saba", englishName: "Sheba", totalAyahs: 54, revelationType: "Meccan" },
    35: { name: "Fatir", englishName: "The Originator", totalAyahs: 45, revelationType: "Meccan" },
    36: { name: "Ya-Sin", englishName: "Ya-Sin", totalAyahs: 83, revelationType: "Meccan" },
    37: { name: "As-Saffat", englishName: "Those Ranged in Ranks", totalAyahs: 182, revelationType: "Meccan" },
    38: { name: "Sad", englishName: "Sad", totalAyahs: 88, revelationType: "Meccan" },
    39: { name: "Az-Zumar", englishName: "The Groups", totalAyahs: 75, revelationType: "Meccan" },
    40: { name: "Ghafir", englishName: "The Forgiver", totalAyahs: 85, revelationType: "Meccan" },
    41: { name: "Fussilat", englishName: "Explained in Detail", totalAyahs: 54, revelationType: "Meccan" },
    42: { name: "Ash-Shura", englishName: "The Consultation", totalAyahs: 53, revelationType: "Meccan" },
    43: { name: "Az-Zukhruf", englishName: "The Gold Adornments", totalAyahs: 89, revelationType: "Meccan" },
    44: { name: "Ad-Dukhan", englishName: "The Smoke", totalAyahs: 59, revelationType: "Meccan" },
    45: { name: "Al-Jathiyah", englishName: "The Crouching", totalAyahs: 37, revelationType: "Meccan" },
    46: { name: "Al-Ahqaf", englishName: "The Wind-Curved Sandhills", totalAyahs: 35, revelationType: "Meccan" },
    47: { name: "Muhammad", englishName: "Muhammad", totalAyahs: 38, revelationType: "Medinan" },
    48: { name: "Al-Fath", englishName: "The Victory", totalAyahs: 29, revelationType: "Medinan" },
    49: { name: "Al-Hujurat", englishName: "The Rooms", totalAyahs: 18, revelationType: "Medinan" },
    50: { name: "Qaf", englishName: "Qaf", totalAyahs: 45, revelationType: "Meccan" },
    51: { name: "Adh-Dhariyat", englishName: "The Winnowing Winds", totalAyahs: 60, revelationType: "Meccan" },
    52: { name: "At-Tur", englishName: "The Mount", totalAyahs: 49, revelationType: "Meccan" },
    53: { name: "An-Najm", englishName: "The Star", totalAyahs: 62, revelationType: "Meccan" },
    54: { name: "Al-Qamar", englishName: "The Moon", totalAyahs: 55, revelationType: "Meccan" },
    55: { name: "Ar-Rahman", englishName: "The Most Gracious", totalAyahs: 78, revelationType: "Medinan" },
    56: { name: "Al-Waqi'ah", englishName: "The Inevitable", totalAyahs: 96, revelationType: "Meccan" },
    57: { name: "Al-Hadid", englishName: "The Iron", totalAyahs: 29, revelationType: "Medinan" },
    58: { name: "Al-Mujadilah", englishName: "The Dispute", totalAyahs: 22, revelationType: "Medinan" },
    59: { name: "Al-Hashr", englishName: "The Exile", totalAyahs: 24, revelationType: "Medinan" },
    60: { name: "Al-Mumtahanah", englishName: "The Tested", totalAyahs: 13, revelationType: "Medinan" },
    61: { name: "As-Saff", englishName: "The Ranks", totalAyahs: 14, revelationType: "Medinan" },
    62: { name: "Al-Jumu'ah", englishName: "The Friday", totalAyahs: 11, revelationType: "Medinan" },
    63: { name: "Al-Munafiqun", englishName: "The Hypocrites", totalAyahs: 11, revelationType: "Medinan" },
    64: { name: "At-Taghabun", englishName: "The Mutual Disillusion", totalAyahs: 18, revelationType: "Medinan" },
    65: { name: "At-Talaq", englishName: "The Divorce", totalAyahs: 12, revelationType: "Medinan" },
    66: { name: "At-Tahrim", englishName: "The Prohibition", totalAyahs: 12, revelationType: "Medinan" },
    67: { name: "Al-Mulk", englishName: "The Sovereignty", totalAyahs: 30, revelationType: "Meccan" },
    68: { name: "Al-Qalam", englishName: "The Pen", totalAyahs: 52, revelationType: "Meccan" },
    69: { name: "Al-Haqqah", englishName: "The Reality", totalAyahs: 52, revelationType: "Meccan" },
    70: { name: "Al-Ma'arij", englishName: "The Ascending Stairways", totalAyahs: 44, revelationType: "Meccan" },
    71: { name: "Nuh", englishName: "Noah", totalAyahs: 28, revelationType: "Meccan" },
    72: { name: "Al-Jinn", englishName: "The Jinn", totalAyahs: 28, revelationType: "Meccan" },
    73: { name: "Al-Muzzammil", englishName: "The Enshrouded One", totalAyahs: 20, revelationType: "Meccan" },
    74: { name: "Al-Muddaththir", englishName: "The Cloaked One", totalAyahs: 56, revelationType: "Meccan" },
    75: { name: "Al-Qiyamah", englishName: "The Resurrection", totalAyahs: 40, revelationType: "Meccan" },
    76: { name: "Al-Insan", englishName: "The Man", totalAyahs: 31, revelationType: "Medinan" },
    77: { name: "Al-Mursalat", englishName: "The Emissaries", totalAyahs: 50, revelationType: "Meccan" },
    78: { name: "An-Naba", englishName: "The Great News", totalAyahs: 40, revelationType: "Meccan" },
    79: { name: "An-Nazi'at", englishName: "Those Who Tear Out", totalAyahs: 46, revelationType: "Meccan" },
    80: { name: "Abasa", englishName: "He Frowned", totalAyahs: 42, revelationType: "Meccan" },
    81: { name: "At-Takwir", englishName: "The Overthrowing", totalAyahs: 29, revelationType: "Meccan" },
    82: { name: "Al-Infitar", englishName: "The Cleaving", totalAyahs: 19, revelationType: "Meccan" },
    83: { name: "Al-Mutaffifin", englishName: "The Defrauding", totalAyahs: 36, revelationType: "Meccan" },
    84: { name: "Al-Inshiqaq", englishName: "The Sundering", totalAyahs: 25, revelationType: "Meccan" },
    85: { name: "Al-Buruj", englishName: "The Mansions of the Stars", totalAyahs: 22, revelationType: "Meccan" },
    86: { name: "At-Tariq", englishName: "The Nightcomer", totalAyahs: 17, revelationType: "Meccan" },
    87: { name: "Al-A'la", englishName: "The Most High", totalAyahs: 19, revelationType: "Meccan" },
    88: { name: "Al-Ghashiyah", englishName: "The Overwhelming", totalAyahs: 26, revelationType: "Meccan" },
    89: { name: "Al-Fajr", englishName: "The Dawn", totalAyahs: 30, revelationType: "Meccan" },
    90: { name: "Al-Balad", englishName: "The City", totalAyahs: 20, revelationType: "Meccan" },
    91: { name: "Ash-Shams", englishName: "The Sun", totalAyahs: 15, revelationType: "Meccan" },
    92: { name: "Al-Layl", englishName: "The Night", totalAyahs: 21, revelationType: "Meccan" },
    93: { name: "Ad-Duha", englishName: "The Morning Brightness", totalAyahs: 11, revelationType: "Meccan" },
    94: { name: "Ash-Sharh", englishName: "The Relief", totalAyahs: 8, revelationType: "Meccan" },
    95: { name: "At-Tin", englishName: "The Fig", totalAyahs: 8, revelationType: "Meccan" },
    96: { name: "Al-Alaq", englishName: "The Clot", totalAyahs: 19, revelationType: "Meccan" },
    97: { name: "Al-Qadr", englishName: "The Power", totalAyahs: 5, revelationType: "Meccan" },
    98: { name: "Al-Bayyinah", englishName: "The Clear Proof", totalAyahs: 8, revelationType: "Medinan" },
    99: { name: "Az-Zalzalah", englishName: "The Earthquake", totalAyahs: 8, revelationType: "Medinan" },
    100: { name: "Al-Adiyat", englishName: "The Courser", totalAyahs: 11, revelationType: "Meccan" },
    101: { name: "Al-Qari'ah", englishName: "The Calamity", totalAyahs: 11, revelationType: "Meccan" },
    102: { name: "At-Takathur", englishName: "The Rivalry in World Increase", totalAyahs: 8, revelationType: "Meccan" },
    103: { name: "Al-Asr", englishName: "The Time", totalAyahs: 3, revelationType: "Meccan" },
    104: { name: "Al-Humazah", englishName: "The Slanderer", totalAyahs: 9, revelationType: "Meccan" },
    105: { name: "Al-Fil", englishName: "The Elephant", totalAyahs: 5, revelationType: "Meccan" },
    106: { name: "Quraish", englishName: "Quraish", totalAyahs: 4, revelationType: "Meccan" },
    107: { name: "Al-Ma'un", englishName: "The Small Kindnesses", totalAyahs: 7, revelationType: "Meccan" },
    108: { name: "Al-Kawthar", englishName: "The Abundance", totalAyahs: 3, revelationType: "Meccan" },
    109: { name: "Al-Kafirun", englishName: "The Disbelievers", totalAyahs: 6, revelationType: "Meccan" },
    110: { name: "An-Nasr", englishName: "The Divine Support", totalAyahs: 3, revelationType: "Medinan" },
    111: { name: "Al-Masad", englishName: "The Palm Fiber", totalAyahs: 5, revelationType: "Meccan" },
    112: { name: "Al-Ikhlas", englishName: "The Sincerity", totalAyahs: 4, revelationType: "Meccan" },
    113: { name: "Al-Falaq", englishName: "The Daybreak", totalAyahs: 5, revelationType: "Meccan" },
    114: { name: "An-Nas", englishName: "The Mankind", totalAyahs: 6, revelationType: "Meccan" }
};

// Sample ayah data for offline demo
// (Full data would be fetched from CDN in production)
const SAMPLE_AYAH_DATA = {
    1: {
        1: {
            arabic: "بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ",
            translation: "In the name of Allah, the Most Gracious, the Most Merciful.",
            transliteration: "Bismillahir Rahmanir Raheem",
            tafsir: "Ibn Kathir: This is the opening verse of every surah except Surah At-Tawbah. It contains three of Allah's names.",
            tajweed: "Madd on 'Bismillah' (2 seconds) | Ghunnah on 'Ar-Rahman'"
        },
        2: {
            arabic: "الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ",
            translation: "All praise is due to Allah, Lord of all the worlds.",
            transliteration: "Alhamdu lillahi rabbil 'alameen",
            tafsir: "Ibn Kathir: All praise and thanks are due to Allah alone. He is the Creator and Sustainer of all existence.",
            tajweed: "Madd on 'Alhamdu' | Qalqalah on 'Rabbi'"
        },
        3: {
            arabic: "الرَّحْمَٰنِ الرَّحِيمِ",
            translation: "The Most Gracious, The Most Merciful.",
            transliteration: "Ar-Rahmanir Raheem",
            tafsir: "Ibn Kathir: Two of Allah's beautiful names that indicate His vast mercy.",
            tajweed: "Idgham on 'Rahmanir' | Madd on 'Raheem'"
        },
        4: {
            arabic: "مَالِكِ يَوْمِ الدِّينِ",
            translation: "Master of the Day of Judgment.",
            transliteration: "Maliki yawmid-deen",
            tafsir: "Ibn Kathir: This verse affirms Allah's absolute sovereignty over the Day of Judgment.",
            tajweed: "Madd on 'Yawmi' | Qalqalah on 'Deen'"
        },
        5: {
            arabic: "إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ",
            translation: "You alone we worship, and You alone we ask for help.",
            transliteration: "Iyyaka na'budu wa iyyaka nasta'een",
            tafsir: "Ibn Kathir: This verse establishes the core of Islamic faith - worship of Allah alone.",
            tajweed: "Madd on 'Iyyaka' | Ghunnah on 'na'budu'"
        },
        6: {
            arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
            translation: "Guide us to the straight path.",
            transliteration: "Ihdinas-siratal mustaqeem",
            tafsir: "Ibn Kathir: This is a prayer for guidance to the path of Islam.",
            tajweed: "Idgham on 'nas-siratal' | Madd on 'mustaqeem'"
        },
        7: {
            arabic: "صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ",
            translation: "The path of those upon whom You have bestowed favor, not of those who have evoked anger or of those who are astray.",
            transliteration: "Siratal ladhina an'amta 'alayhim ghayril maghdubi 'alayhim wa lad-dalleen",
            tafsir: "Ibn Kathir: This verse specifies the 'straight path' as the path of the prophets, righteous, and those who have received Allah's mercy.",
            tajweed: "Madd on 'an'amta' | Qalqalah on 'maghdubi' | Idgham on 'wa lad-dalleen'"
        }
    },
    112: {
        1: {
            arabic: "قُلْ هُوَ اللَّهُ أَحَدٌ",
            translation: "Say: He is Allah, the One.",
            transliteration: "Qul huwallahu ahad",
            tafsir: "Ibn Kathir: This surah is equivalent to one-third of the Quran. It affirms the oneness of Allah.",
            tajweed: "Qalqalah on 'Qul' | Madd on 'Ahad'"
        },
        2: {
            arabic: "اللَّهُ الصَّمَدُ",
            translation: "Allah, the Eternal, the Self-Sufficient.",
            transliteration: "Allahus-samad",
            tafsir: "Ibn Kathir: 'As-Samad' means the One who is self-sufficient, upon whom all depend, and who depends on none.",
            tajweed: "Madd on 'Allah' | Qalqalah on 'Samad'"
        },
        3: {
            arabic: "لَمْ يَلِدْ وَلَمْ يُولَدْ",
            translation: "He neither begets nor is born.",
            transliteration: "Lam yalid wa lam yulad",
            tafsir: "Ibn Kathir: This negates any offspring or parent for Allah, affirming His absolute uniqueness.",
            tajweed: "Qalqalah on 'yulad'"
        },
        4: {
            arabic: "وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ",
            translation: "Nor is there to Him any equivalent.",
            transliteration: "Wa lam yakun lahu kufuwan ahad",
            tafsir: "Ibn Kathir: Nothing and no one is comparable to Allah in any way.",
            tajweed: "Madd on 'kufuwan' | Qalqalah on 'Ahad'"
        }
    },
    113: {
        1: {
            arabic: "قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ",
            translation: "Say: I seek refuge in the Lord of the daybreak.",
            transliteration: "Qul a'udhu birabbil-falaq",
            tafsir: "Ibn Kathir: This surah seeks protection from various forms of evil.",
            tajweed: "Qalqalah on 'Qul'"
        },
        2: {
            arabic: "مِن شَرِّ مَا خَلَقَ",
            translation: "From the evil of that which He created.",
            transliteration: "Min sharri ma khalaq",
            tafsir: "Ibn Kathir: Protection from all evil in creation.",
            tajweed: "Madd on 'sharri'"
        },
        3: {
            arabic: "وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ",
            translation: "And from the evil of darkness when it settles.",
            transliteration: "Wa min sharri ghasiqin idha waqab",
            tafsir: "Ibn Kathir: Protection from the evil of the night and darkness.",
            tajweed: "Madd on 'ghasiqin'"
        },
        4: {
            arabic: "وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ",
            translation: "And from the evil of the blowers in knots.",
            transliteration: "Wa min sharrin-naffathati fil-'uqad",
            tafsir: "Ibn Kathir: Protection from witchcraft and magic.",
            tajweed: "Idgham on 'sharrin-naffathati'"
        },
        5: {
            arabic: "وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ",
            translation: "And from the evil of the envious when he envies.",
            transliteration: "Wa min sharri hasidin idha hasad",
            tafsir: "Ibn Kathir: Protection from the evil of envy and jealousy.",
            tajweed: "Madd on 'hasidin'"
        }
    },
    114: {
        1: {
            arabic: "قُلْ أَعُوذُ بِرَبِّ النَّاسِ",
            translation: "Say: I seek refuge in the Lord of mankind.",
            transliteration: "Qul a'udhu birabbin-nas",
            tafsir: "Ibn Kathir: This surah seeks protection from evil whispers.",
            tajweed: "Qalqalah on 'Qul' | Idgham on 'rabbin-nas'"
        },
        2: {
            arabic: "مَلِكِ النَّاسِ",
            translation: "The Sovereign of mankind.",
            transliteration: "Malikin-nas",
            tafsir: "Ibn Kathir: Allah is the King and Master of all mankind.",
            tajweed: "Madd on 'Malik' | Idgham on 'kin-nas'"
        },
        3: {
            arabic: "إِلَٰهِ النَّاسِ",
            translation: "The God of mankind.",
            transliteration: "Ilahin-nas",
            tafsir: "Ibn Kathir: The one true God worthy of worship.",
            tajweed: "Madd on 'Ilah' | Idgham on 'hin-nas'"
        },
        4: {
            arabic: "مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ",
            translation: "From the evil of the retreating whisperer.",
            transliteration: "Min sharril waswasil khannas",
            tafsir: "Ibn Kathir: Protection from Satan who whispers evil and then retreats.",
            tajweed: "Madd on 'sharril' | Qalqalah on 'khannas'"
        },
        5: {
            arabic: "الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ",
            translation: "Who whispers into the breasts of mankind.",
            transliteration: "Alladhi yuwaswisu fi sudurin-nas",
            tafsir: "Ibn Kathir: Satan whispers evil thoughts into the hearts of people.",
            tajweed: "Madd on 'yuwaswisu' | Idgham on 'sudurin-nas'"
        },
        6: {
            arabic: "مِنَ الْجِنَّةِ وَالنَّاسِ",
            translation: "From among the jinn and mankind.",
            transliteration: "Minal jinnati wan-nas",
            tafsir: "Ibn Kathir: Evil whisperers come from both jinn and mankind.",
            tajweed: "Idgham on 'jinnati wan-nas'"
        }
    }
};

// Helper function to get ayah data
function getAyahData(surahId, ayahNum) {
    // Try to get from sample data first (for demo)
    if (SAMPLE_AYAH_DATA[surahId] && SAMPLE_AYAH_DATA[surahId][ayahNum]) {
        return SAMPLE_AYAH_DATA[surahId][ayahNum];
    }
    // In production, this would fetch from CDN or local storage
    return null;
}

function getSurahMetadata(surahId) {
    return QURAN_METADATA[surahId] || null;
}

function getTotalAyahs(surahId) {
    return QURAN_METADATA[surahId]?.totalAyahs || 0;
}

function getSurahName(surahId) {
    return QURAN_METADATA[surahId]?.name || "Unknown";
}

function getSurahEnglishName(surahId) {
    return QURAN_METADATA[surahId]?.englishName || "Unknown";
}

function getAllSurahIds() {
    return Object.keys(QURAN_METADATA).map(Number);
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        QURAN_METADATA,
        SAMPLE_AYAH_DATA,
        getAyahData,
        getSurahMetadata,
        getTotalAyahs,
        getSurahName,
        getSurahEnglishName,
        getAllSurahIds,
        fetchFullQuran,
        fetchSurah
    };
}
