// ================================================================
// COMPLETE DUAS AND ADHKAR
// Morning, Evening, and Special Duas
// ================================================================

const DUA_DATA = {
    // ============================================================
    // MORNING ADHKAR
    // ============================================================
    morning: {
        name: "Morning Adhkar",
        description: "Recommended supplications for the morning",
        duas: [
            {
                id: 1,
                arabic: "اللَّهُمَّ إِنِّي أَصْبَحْتُ أُشْهِدُكَ وَأُشْهِدُ حَمَلَةَ عَرْشِكَ وَمَلَائِكَتَكَ وَجَمِيعَ خَلْقِكَ أَنَّكَ أَنْتَ اللَّهُ لَا إِلَٰهَ إِلَّا أَنْتَ وَأَنَّ مُحَمَّدًا عَبْدُكَ وَرَسُولُكَ",
                transliteration: "Allahumma inni asbahtu ushhiduka wa ushhidu hamalata 'arshika wa mala'ikataka wa jami'a khalqika annaka antallahu la ilaha illa anta wa anna muhammadan 'abduka wa rasuluka",
                translation: "O Allah, I have entered the morning and I bear witness, and I bear witness with the bearers of Your Throne, Your angels, and all of Your creation, that You are Allah, none has the right to be worshipped except You, and that Muhammad is Your slave and Messenger.",
                reference: "Abu Dawud",
                count: 1,
                category: "protection"
            },
            {
                id: 2,
                arabic: "اللَّهُمَّ بِكَ أَصْبَحْنَا وَبِكَ أَمْسَيْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ النُّشُورُ",
                transliteration: "Allahumma bika asbahna wa bika amsayna wa bika nahya wa bika namutu wa ilayka an-nushur",
                translation: "O Allah, by You we have entered the morning, and by You we have entered the evening, and by You we live, and by You we die, and to You is the resurrection.",
                reference: "Sunan Abu Dawud",
                count: 1,
                category: "general"
            },
            {
                id: 3,
                arabic: "أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ لِلَّهِ رَبِّ الْعَالَمِينَ",
                transliteration: "Asbahna wa asbahal-mulku lillahi rabbil-'alamin",
                translation: "We have entered the morning and the entire kingdom has entered the morning belonging to Allah, Lord of all the worlds.",
                reference: "Sahih Muslim",
                count: 1,
                category: "general"
            },
            {
                id: 4,
                arabic: "سُبْحَانَ اللَّهِ وَبِحَمْدِهِ",
                transliteration: "Subhanallahi wa bihamdihi",
                translation: "Glory be to Allah and praise be to Him.",
                reference: "Sahih Muslim",
                count: 100,
                category: "tasbih"
            },
            {
                id: 5,
                arabic: "لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ لَا شَرِيكَ لَهُ لَهُ الْمُلْكُ وَلَهُ الْحَمْدُ وَهُوَ عَلَى كُلِّ شَيْءٍ قَدِيرٌ",
                transliteration: "La ilaha illallahu wahdahu la sharika lahu, lahul-mulku wa lahul-hamdu wa huwa 'ala kulli shay'in qadir",
                translation: "None has the right to be worshipped except Allah alone, without partner. To Him belongs all sovereignty and praise, and He is over all things omnipotent.",
                reference: "Sahih Bukhari",
                count: 1,
                category: "tawheed"
            },
            {
                id: 6,
                arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا وَرِزْقًا طَيِّبًا وَعَمَلًا مُتَقَبَّلًا",
                transliteration: "Allahumma inni as'aluka 'ilman nafi'an wa rizqan tayyiban wa 'amalan mutaqabbala",
                translation: "O Allah, I ask You for beneficial knowledge, good provision, and accepted deeds.",
                reference: "Sunan Ibn Majah",
                count: 1,
                category: "knowledge"
            },
            {
                id: 7,
                arabic: "اللَّهُمَّ عَافِنِي فِي بَدَنِي اللَّهُمَّ عَافِنِي فِي سَمْعِي اللَّهُمَّ عَافِنِي فِي بَصَرِي",
                transliteration: "Allahumma 'afini fi badani, allahumma 'afini fi sam'i, allahumma 'afini fi basari",
                translation: "O Allah, grant my body health. O Allah, grant my hearing health. O Allah, grant my sight health.",
                reference: "Sunan Abu Dawud",
                count: 3,
                category: "health"
            }
        ]
    },

    // ============================================================
    // EVENING ADHKAR
    // ============================================================
    evening: {
        name: "Evening Adhkar",
        description: "Recommended supplications for the evening",
        duas: [
            {
                id: 1,
                arabic: "اللَّهُمَّ بِكَ أَمْسَيْنَا وَبِكَ أَصْبَحْنَا وَبِكَ نَحْيَا وَبِكَ نَمُوتُ وَإِلَيْكَ الْمَصِيرُ",
                transliteration: "Allahumma bika amsayna wa bika asbahna wa bika nahya wa bika namutu wa ilayka al-masir",
                translation: "O Allah, by You we have entered the evening, and by You we have entered the morning, and by You we live, and by You we die, and to You is the final return.",
                reference: "Sunan Abu Dawud",
                count: 1,
                category: "general"
            },
            {
                id: 2,
                arabic: "أَمْسَيْنَا وَأَمْسَى الْمُلْكُ لِلَّهِ وَالْحَمْدُ لِلَّهِ",
                transliteration: "Amsayna wa amsal-mulku lillahi wal-hamdu lillahi",
                translation: "We have entered the evening and the entire kingdom has entered the evening belonging to Allah, and all praise is for Allah.",
                reference: "Sahih Muslim",
                count: 1,
                category: "general"
            },
            {
                id: 3,
                arabic: "اللَّهُمَّ إِنِّي أَمْسَيْتُ أُشْهِدُكَ...",
                transliteration: "Allahumma inni amsaytu ushhiduka...",
                translation: "O Allah, I have entered the evening and I bear witness...",
                reference: "Abu Dawud",
                count: 1,
                category: "protection"
            },
            {
                id: 4,
                arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ هَذِهِ اللَّيْلَةِ",
                transliteration: "Allahumma inni as'aluka khayra hadhihil-laylati",
                translation: "O Allah, I ask You for the good of this night.",
                reference: "Sunan Ibn Majah",
                count: 1,
                category: "protection"
            }
        ]
    },

    // ============================================================
    // BEFORE SLEEP
    // ============================================================
    sleep: {
        name: "Before Sleep",
        description: "Duas to recite before sleeping",
        duas: [
            {
                id: 1,
                arabic: "اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا",
                transliteration: "Allahumma bismika amutu wa ahya",
                translation: "O Allah, in Your name I die and I live.",
                reference: "Sahih Bukhari",
                count: 1,
                category: "sleep"
            },
            {
                id: 2,
                arabic: "اللَّهُمَّ إِنِّي أَسْلَمْتُ نَفْسِي إِلَيْكَ...",
                transliteration: "Allahumma inni aslamtu nafsi ilayka...",
                translation: "O Allah, I have submitted myself to You...",
                reference: "Sahih Bukhari",
                count: 1,
                category: "sleep"
            },
            {
                id: 3,
                arabic: "بِاسْمِكَ اللَّهُمَّ أَضَعُ جَنْبِي...",
                transliteration: "Bismika allahumma adau janbi...",
                translation: "In Your name, O Allah, I place my side...",
                reference: "Sahih Bukhari",
                count: 1,
                category: "sleep"
            },
            {
                id: 4,
                arabic: "الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا...",
                transliteration: "Alhamdu lillahil-ladhi at'amana wa saqana...",
                translation: "Praise be to Allah who fed us and gave us drink...",
                reference: "Sahih Muslim",
                count: 1,
                category: "sleep"
            },
            {
                id: 5,
                arabic: "أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ مِنْ شَرِّ مَا خَلَقَ",
                transliteration: "A'udhu bikalimatillahit-tammati min sharri ma khalaq",
                translation: "I seek refuge in the perfect words of Allah from the evil of what He has created.",
                reference: "Sahih Muslim",
                count: 3,
                category: "protection"
            }
        ]
    },

    // ============================================================
    // SPECIAL DUAS
    // ============================================================
    special: {
        name: "Special Duas",
        description: "Duas for various occasions",
        duas: [
            {
                id: 1,
                title: "Dua for Travel",
                arabic: "سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَٰذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنقَلِبُونَ",
                transliteration: "Subhanal-ladhi sakhkhara lana hadha wa ma kunna lahu muqrinin wa inna ila rabbina lamunqalibun",
                translation: "Glory be to Him who has subjected this to us, and we could never have done it. And indeed, to our Lord we will return.",
                reference: "Sahih Muslim",
                category: "travel"
            },
            {
                id: 2,
                title: "Dua for Entering the Mosque",
                arabic: "اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ",
                transliteration: "Allahummaftah li abwaba rahmatika",
                translation: "O Allah, open for me the doors of Your mercy.",
                reference: "Sahih Muslim",
                category: "mosque"
            },
            {
                id: 3,
                title: "Dua for Leaving the Mosque",
                arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ",
                transliteration: "Allahumma inni as'aluka min fadlika",
                translation: "O Allah, I ask You from Your bounty.",
                reference: "Sahih Muslim",
                category: "mosque"
            },
            {
                id: 4,
                title: "Dua for Iftar (Breaking Fast)",
                arabic: "اللَّهُمَّ لَكَ صُمْتُ وَبِكَ آمَنْتُ وَعَلَى رِزْقِكَ أَفْطَرْتُ",
                transliteration: "Allahumma laka sumtu wa bika amantu wa 'ala rizqika aftartu",
                translation: "O Allah, for You I have fasted, and in You I have believed, and upon Your provision I have broken my fast.",
                reference: "Sunan Abu Dawud",
                category: "fasting"
            },
            {
                id: 5,
                title: "Dua for Seeking Knowledge",
                arabic: "اللَّهُمَّ إِنِّي أَسْأَلُكَ عِلْمًا نَافِعًا",
                transliteration: "Allahumma inni as'aluka 'ilman nafi'an",
                translation: "O Allah, I ask You for beneficial knowledge.",
                reference: "Sunan Ibn Majah",
                category: "knowledge"
            },
            {
                id: 6,
                title: "Dua for Forgiveness",
                arabic: "اللَّهُمَّ إِنَّكَ عَفُوٌ تُحِبُّ الْعَفْوَ فَاعْفُ عَنِّي",
                transliteration: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
                translation: "O Allah, You are Forgiving and love forgiveness, so forgive me.",
                reference: "Sunan Ibn Majah",
                category: "forgiveness"
            },
            {
                id: 7,
                title: "Dua for Anxiety and Stress",
                arabic: "اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ...",
                transliteration: "Allahumma inni a'udhu bika minal-hammi wal-hazan...",
                translation: "O Allah, I seek refuge in You from anxiety and grief...",
                reference: "Sahih Bukhari",
                category: "anxiety"
            },
            {
                id: 8,
                title: "Dua for Parents",
                arabic: "رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا",
                transliteration: "Rabbir-hamhuma kama rabbayani saghira",
                translation: "My Lord, have mercy upon them as they raised me when I was small.",
                reference: "Quran 17:24",
                category: "parents"
            }
        ]
    },

    // ============================================================
    // QURANIC DUAS
    // ============================================================
    quranic: {
        name: "Quranic Duas",
        description: "Duas from the Quran",
        duas: [
            {
                id: 1,
                reference: "Surah Al-Fatihah 1:6-7",
                arabic: "اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ",
                transliteration: "Ihdinas-siratal mustaqeem",
                translation: "Guide us to the straight path.",
                category: "guidance"
            },
            {
                id: 2,
                reference: "Surah Al-Baqarah 2:201",
                arabic: "رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ",
                transliteration: "Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina 'adhaban-nar",
                translation: "Our Lord, give us in this world good and in the Hereafter good and protect us from the punishment of the Fire.",
                category: "general"
            },
            {
                id: 3,
                reference: "Surah Al-Imran 3:8",
                arabic: "رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا",
                transliteration: "Rabbana la tuzigh qulubana ba'da idh hadaytana",
                translation: "Our Lord, do not let our hearts deviate after You have guided us.",
                category: "guidance"
            },
            {
                id: 4,
                reference: "Surah Ibrahim 14:40",
                arabic: "رَبِّ اجْعَلْنِي مُقِيمَ الصَّلَاةِ وَمِن ذُرِّيَّتِي",
                transliteration: "Rabbij-'alni muqimas-salati wa min dhurriyyati",
                translation: "My Lord, make me an establisher of prayer, and from my descendants.",
                category: "prayer"
            },
            {
                id: 5,
                reference: "Surah Al-Isra 17:80",
                arabic: "رَبِّ أَدْخِلْنِي مُدْخَلَ صِدْقٍ وَأَخْرِجْنِي مُخْرَجَ صِدْقٍ",
                transliteration: "Rabbi adkhilni mudkhala sidqin wa akhrijni mukh raja sidqin",
                translation: "My Lord, cause me to enter a truthful entrance and exit a truthful exit.",
                category: "general"
            }
        ]
    }
};

// Helper functions
function getAdhkar(time) {
    return DUA_DATA[time] || null;
}

function getSpecialDuas(category) {
    if (!category) return DUA_DATA.special.duas;
    return DUA_DATA.special.duas.filter(d => d.category === category);
}

function getQuranicDuas() {
    return DUA_DATA.quranic.duas;
}

function getRandomDua() {
    const allDuas = [];
    for (const [key, section] of Object.entries(DUA_DATA)) {
        if (section.duas) {
            allDuas.push(...section.duas);
        }
    }
    return allDuas[Math.floor(Math.random() * allDuas.length)];
}

function searchDuas(query) {
    const results = [];
    const searchTerm = query.toLowerCase();
    
    for (const [key, section] of Object.entries(DUA_DATA)) {
        if (!section.duas) continue;
        for (const dua of section.duas) {
            const text = dua.translation.toLowerCase();
            const arabic = dua.arabic.toLowerCase();
            const title = dua.title ? dua.title.toLowerCase() : '';
            
            if (text.includes(searchTerm) || arabic.includes(searchTerm) || title.includes(searchTerm)) {
                results.push({
                    section: key,
                    ...dua
                });
            }
        }
    }
    return results;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        DUA_DATA,
        getAdhkar,
        getSpecialDuas,
        getQuranicDuas,
        getRandomDua,
        searchDuas
    };
          }
