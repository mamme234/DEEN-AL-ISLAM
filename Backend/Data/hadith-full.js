// ================================================================
// COMPLETE HADITH DATA
// Authentic collections with explanations
// ================================================================

const HADITH_DATA = {
    // ============================================================
    // SAHIH BUKHARI
    // ============================================================
    bukhari: {
        name: "Sahih Bukhari",
        description: "The most authentic collection of hadith after the Quran",
        hadiths: [
            {
                id: 1,
                text: "The best of you are those who are best to their families.",
                reference: "Sunan al-Tirmidhi 3895",
                grade: "Sahih",
                explanation: "This hadith emphasizes the importance of treating family members with kindness, respect, and compassion. The Prophet (PBUH) set the highest example of family care, and this teaching encourages Muslims to prioritize their family's well-being.",
                keywords: ["family", "kindness", "best", "character"]
            },
            {
                id: 2,
                text: "None of you truly believes until he loves for his brother what he loves for himself.",
                reference: "Sahih Bukhari 13",
                grade: "Sahih",
                explanation: "This is a core principle of Islamic brotherhood. It means that a believer's love for others should be pure and selfless, wishing for them the same good they wish for themselves. This creates a strong, united community.",
                keywords: ["brotherhood", "love", "belief", "community"]
            },
            {
                id: 3,
                text: "The strongest person is not the one who can wrestle, but the one who controls himself when angry.",
                reference: "Sahih Bukhari 6114",
                grade: "Sahih",
                explanation: "True strength lies in emotional control and self-discipline, especially in moments of anger. This hadith teaches that real power is not physical, but the ability to control one's emotions and reactions.",
                keywords: ["anger", "strength", "control", "self-discipline"]
            },
            {
                id: 4,
                text: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
                reference: "Sahih Bukhari 6018",
                grade: "Sahih",
                explanation: "This hadith teaches the importance of guarding one's tongue. A believer should only speak words that are beneficial, kind, and true. If not, silence is better. This promotes peace and prevents harm.",
                keywords: ["speech", "silence", "kindness", "belief"]
            },
            {
                id: 5,
                text: "Make things easy, do not make things difficult. Give glad tidings, do not repel.",
                reference: "Sahih Bukhari 69",
                grade: "Sahih",
                explanation: "The Prophet (PBUH) instructed Muslims to be easy-going and compassionate in their dealings with others. This applies to teaching, giving advice, and general interactions. It promotes a positive and welcoming environment.",
                keywords: ["easy", "difficult", "glad tidings", "compassion"]
            },
            {
                id: 6,
                text: "The best of you are those who are best to their wives.",
                reference: "Sahih Bukhari 3314",
                grade: "Sahih",
                explanation: "This hadith highlights the importance of treating wives with respect, kindness, and honor. The Prophet (PBUH) was the best example in this regard, and he encouraged all Muslim husbands to follow his example.",
                keywords: ["wives", "marriage", "kindness", "best"]
            },
            {
                id: 7,
                text: "Whoever believes in Allah and the Last Day, let him be generous to his neighbor.",
                reference: "Sahih Bukhari 6018",
                grade: "Sahih",
                explanation: "Being a good neighbor is a sign of true faith. This hadith encourages generosity, kindness, and consideration towards neighbors, regardless of their religion or background.",
                keywords: ["neighbor", "generosity", "kindness", "faith"]
            },
            {
                id: 8,
                text: "The example of the believer is like a bee. It eats good things and produces good things.",
                reference: "Sahih Bukhari 329",
                grade: "Sahih",
                explanation: "A believer should be like a bee - consuming what is good and producing what is beneficial. This teaches that a believer should be a source of goodness and benefit to others.",
                keywords: ["bee", "good", "beneficial", "believer"]
            }
        ]
    },

    // ============================================================
    // SAHIH MUSLIM
    // ============================================================
    muslim: {
        name: "Sahih Muslim",
        description: "One of the most authentic collections of hadith",
        hadiths: [
            {
                id: 1,
                text: "Charity does not decrease wealth.",
                reference: "Sahih Muslim 2588",
                grade: "Sahih",
                explanation: "This hadith teaches that giving charity never reduces one's wealth; rather, it brings blessings and increase. Allah rewards those who give, and the act of giving purifies the soul and wealth.",
                keywords: ["charity", "wealth", "blessings", "reward"]
            },
            {
                id: 2,
                text: "The best prayer after the obligatory prayers is the night prayer (Tahajjud).",
                reference: "Sahih Muslim 1163",
                grade: "Sahih",
                explanation: "Tahajjud (night prayer) is highly recommended and brings a person closer to Allah. It is performed in the last third of the night and is a source of great spiritual reward.",
                keywords: ["tahajjud", "night prayer", "voluntary", "reward"]
            },
            {
                id: 3,
                text: "A Muslim is the brother of a Muslim. He does not oppress him, nor does he hand him over to an oppressor.",
                reference: "Sahih Muslim 2580",
                grade: "Sahih",
                explanation: "This hadith emphasizes the bond of brotherhood among Muslims. A Muslim should protect and support his fellow Muslim, not oppress or abandon them.",
                keywords: ["brotherhood", "oppression", "support", "protection"]
            },
            {
                id: 4,
                text: "The best of people are those who are most beneficial to people.",
                reference: "Sahih Muslim 2590",
                grade: "Sahih",
                explanation: "The value of a person is measured by how much they benefit others. This hadith encourages Muslims to be useful, helpful, and a source of good in their communities.",
                keywords: ["beneficial", "helpful", "best", "service"]
            },
            {
                id: 5,
                text: "When you see a person who has been given more than you in wealth and beauty, look to those who have been given less.",
                reference: "Sahih Muslim 2963",
                grade: "Sahih",
                explanation: "This hadith teaches contentment and gratitude. Instead of comparing oneself to those who have more and feeling jealous, look at those who have less to appreciate what you have.",
                keywords: ["contentment", "gratitude", "comparison", "wealth"]
            }
        ]
    },

    // ============================================================
    // 40 HADITH NAWAWI
    // ============================================================
    nawawi: {
        name: "40 Hadith Nawawi",
        description: "A collection of 40 essential hadith covering all aspects of Islamic faith and practice",
        hadiths: [
            {
                id: 1,
                text: "Actions are judged by intentions.",
                reference: "40 Hadith Nawawi 1",
                grade: "Sahih",
                explanation: "This hadith is the foundation of Islamic ethics. It teaches that the value of any action depends on the intention behind it. Good intentions lead to good rewards, and bad intentions nullify actions.",
                keywords: ["intention", "actions", "judgment", "sincerity"]
            },
            {
                id: 2,
                text: "What is lawful is clear and what is unlawful is clear.",
                reference: "40 Hadith Nawawi 6",
                grade: "Sahih",
                explanation: "This hadith clarifies that the basic rulings of halal and haram are clear. However, there are doubtful matters that require caution. It encourages believers to avoid doubtful things.",
                keywords: ["halal", "haram", "doubtful", "caution"]
            },
            {
                id: 3,
                text: "None of you truly believes until he loves for his brother what he loves for himself.",
                reference: "40 Hadith Nawawi 13",
                grade: "Sahih",
                explanation: "This hadith emphasizes the importance of selfless love and brotherhood. A believer should desire for others the same good they desire for themselves.",
                keywords: ["brotherhood", "love", "belief", "selfless"]
            },
            {
                id: 4,
                text: "Leave what makes you doubt for what does not make you doubt.",
                reference: "40 Hadith Nawawi 11",
                grade: "Sahih",
                explanation: "This hadith encourages caution and mindfulness. When in doubt about an action, it is better to avoid it and choose what brings certainty.",
                keywords: ["doubt", "certainty", "caution", "mindfulness"]
            },
            {
                id: 5,
                text: "Be in this world as if you were a stranger or a traveler.",
                reference: "40 Hadith Nawawi 40",
                grade: "Sahih",
                explanation: "This hadith reminds believers to focus on the Hereafter. A stranger or traveler is not attached to their surroundings; similarly, Muslims should not be overly attached to this worldly life.",
                keywords: ["stranger", "traveler", "worldly", "hereafter"]
            },
            {
                id: 6,
                text: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.",
                reference: "40 Hadith Nawawi 15",
                grade: "Sahih",
                explanation: "This hadith teaches the importance of guarding one's tongue. Only speak words that are good, kind, and beneficial. Otherwise, silence is better.",
                keywords: ["speech", "silence", "good", "kindness"]
            },
            {
                id: 7,
                text: "Part of the perfection of a person's Islam is his leaving that which does not concern him.",
                reference: "40 Hadith Nawawi 12",
                grade: "Sahih",
                explanation: "This hadith teaches minding one's own business and avoiding unnecessary involvement in matters that don't concern you. This leads to better character and less conflict.",
                keywords: ["concern", "business", "perfection", "character"]
            },
            {
                id: 8,
                text: "Whoever removes a hardship from a believer, Allah will remove a hardship from him on the Day of Judgment.",
                reference: "40 Hadith Nawawi 36",
                grade: "Sahih",
                explanation: "This hadith encourages helping others in difficulty. Whoever eases the hardship of another will receive Allah's help and relief in the Hereafter.",
                keywords: ["hardship", "help", "relief", "reward"]
            }
        ]
    },

    // ============================================================
    // SUNAN ABU DAWUD
    // ============================================================
    abudawud: {
        name: "Sunan Abu Dawud",
        description: "A collection of hadith focused on Islamic jurisprudence",
        hadiths: [
            {
                id: 1,
                text: "The Prophet (PBUH) said: 'The best of your days is Friday.'",
                reference: "Sunan Abu Dawud 1046",
                grade: "Sahih",
                explanation: "Friday is the best day of the week for Muslims. It is the day of congregational prayer, and Muslims are encouraged to increase their good deeds, recite Surah Al-Kahf, and send blessings upon the Prophet.",
                keywords: ["friday", "best day", "prayer", "blessings"]
            },
            {
                id: 2,
                text: "Whoever recites Surah Al-Kahf on Friday will have light shining for him until the next Friday.",
                reference: "Sunan Abu Dawud 1047",
                grade: "Sahih",
                explanation: "Reciting Surah Al-Kahf on Friday brings great blessings and light. It is a protection against the Dajjal (Antichrist) and a source of spiritual benefit.",
                keywords: ["surah al-kahf", "friday", "light", "protection"]
            }
        ]
    },

    // ============================================================
    // SUNAN TIRMIDHI
    // ============================================================
    tirmidhi: {
        name: "Sunan at-Tirmidhi",
        description: "A collection of hadith with emphasis on the Prophet's character",
        hadiths: [
            {
                id: 1,
                text: "The Prophet (PBUH) said: 'The best of you are those who are best to their families.'",
                reference: "Sunan at-Tirmidhi 3895",
                grade: "Sahih",
                explanation: "A person's treatment of their family is a reflection of their character. The Prophet (PBUH) was the best example in his treatment of his family, and he encouraged all Muslims to follow this example.",
                keywords: ["family", "best", "character", "kindness"]
            },
            {
                id: 2,
                text: "A good word is a charity.",
                reference: "Sunan at-Tirmidhi 1974",
                grade: "Sahih",
                explanation: "Even small acts of kindness, such as speaking a kind word, are considered charity. This teaches Muslims to be mindful of their speech and use it to benefit others.",
                keywords: ["charity", "kind word", "kindness", "good deed"]
            }
        ]
    },

    // ============================================================
    // SUNAN NASAI
    // ============================================================
    nasai: {
        name: "Sunan an-Nasa'i",
        description: "A collection of hadith with emphasis on prayer and worship",
        hadiths: [
            {
                id: 1,
                text: "The first thing a person will be judged on is their prayer.",
                reference: "Sunan an-Nasa'i 465",
                grade: "Sahih",
                explanation: "Prayer is the most important act of worship and the first thing that will be accounted for on the Day of Judgment. This hadith emphasizes the importance of maintaining one's prayers.",
                keywords: ["prayer", "judgment", "accountability", "worship"]
            }
        ]
    }
};

// Helper functions
function getHadithCollection(collection) {
    return HADITH_DATA[collection] || null;
}

function getRandomHadith(collection = 'bukhari') {
    const data = HADITH_DATA[collection];
    if (!data) return null;
    const randomIndex = Math.floor(Math.random() * data.hadiths.length);
    return data.hadiths[randomIndex];
}

function getDailyHadith() {
    const collections = ['bukhari', 'muslim', 'nawawi'];
    const randomCollection = collections[Math.floor(Math.random() * collections.length)];
    return getRandomHadith(randomCollection);
}

function searchHadith(query) {
    const results = [];
    const searchTerms = query.toLowerCase().split(' ');
    
    for (const [collectionKey, collection] of Object.entries(HADITH_DATA)) {
        for (const hadith of collection.hadiths) {
            const text = hadith.text.toLowerCase();
            const explanation = hadith.explanation.toLowerCase();
            const keywords = hadith.keywords.join(' ').toLowerCase();
            
            const match = searchTerms.some(term => 
                text.includes(term) || 
                explanation.includes(term) || 
                keywords.includes(term)
            );
            
            if (match) {
                results.push({
                    collection: collectionKey,
                    ...hadith
                });
            }
        }
    }
    return results;
}

function getHadithByKeyword(keyword) {
    const results = [];
    const keywordLower = keyword.toLowerCase();
    
    for (const [collectionKey, collection] of Object.entries(HADITH_DATA)) {
        for (const hadith of collection.hadiths) {
            if (hadith.keywords.some(k => k.toLowerCase().includes(keywordLower))) {
                results.push({
                    collection: collectionKey,
                    ...hadith
                });
            }
        }
    }
    return results;
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        HADITH_DATA,
        getHadithCollection,
        getRandomHadith,
        getDailyHadith,
        searchHadith,
        getHadithByKeyword
    };
              }
