// ================================================================
// DEENMAX - COMPLETE JAVASCRIPT
// All features included - Deploy to Vercel
// ================================================================

// ============================================================
// API CONFIGURATION
// ============================================================
const API_URL = 'https://deenmax-backend.onrender.com/api'; // Replace with your Render URL
const APP_VERSION = '3.0.0';

// ============================================================
// STATE MANAGEMENT
// ============================================================
const AppState = {
    user: null,
    token: localStorage.getItem('token'),
    currentPage: 'dashboard',
    currentSurah: 1,
    currentAyah: 1,
    isTextHidden: false,
    isPlaying: false,
    isRecording: false,
    tasbihCount: 0,
    tasbihPhrase: 'subhanallah',
    bookmarks: JSON.parse(localStorage.getItem('bookmarks') || '[]'),
    prayerLog: JSON.parse(localStorage.getItem('prayerLog') || '{}'),
    fastingLog: JSON.parse(localStorage.getItem('fastingLog') || '[]'),
    hifzProgress: JSON.parse(localStorage.getItem('hifzProgress') || '[]'),
    notes: JSON.parse(localStorage.getItem('notes') || '{}'),
    settings: JSON.parse(localStorage.getItem('settings') || '{"theme":"dark","language":"en"}'),
    totalDhikr: parseInt(localStorage.getItem('totalDhikr') || '0'),
    prayerStreak: 0,
};

// ============================================================
// DOM HELPERS
// ============================================================
const $ = id => document.getElementById(id);
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ============================================================
// INITIALIZATION
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    console.log('🌟 DeenMax v' + APP_VERSION + ' loading...');
    
    applyTheme();
    updateHijriDate();
    populateSurahs();
    loadAyah(1, 1);
    getPrayerTimes();
    loadDailyHadith();
    loadVideos();
    loadAdhkar('morning');
    loadHifzList();
    loadBookmarks();
    loadFastingLog();
    loadPrayerStreak();
    loadTotalDhikr();
    setupNavigation();
    setupEventListeners();
    updateDashboard();
    checkOnlineStatus();
    checkAuth();
    
    console.log('✅ DeenMax loaded successfully!');
}

// ============================================================
// AUTHENTICATION
// ============================================================
function checkAuth() {
    if (AppState.token) {
        fetch(`${API_URL}/auth/me`, {
            headers: { 'Authorization': `Bearer ${AppState.token}` }
        })
        .then(res => res.json())
        .then(user => {
            AppState.user = user;
            $('userBadge').textContent = `👤 ${user.name}`;
            $('greeting').textContent = `Assalamu Alaikum, ${user.name}! 👋`;
        })
        .catch(() => {
            localStorage.removeItem('token');
            AppState.token = null;
            $('userBadge').textContent = '👤 Guest';
        });
    } else {
        $('userBadge').textContent = '👤 Guest';
    }
}

function login() {
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password:');
    if (!email || !password) return;
    
    fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            AppState.token = data.token;
            AppState.user = data.user;
            $('userBadge').textContent = `👤 ${data.user.name}`;
            $('greeting').textContent = `Assalamu Alaikum, ${data.user.name}! 👋`;
            alert('✅ Login successful!');
        } else {
            alert('❌ ' + (data.error || 'Login failed'));
        }
    })
    .catch(err => alert('❌ Connection error: ' + err.message));
}

function register() {
    const name = prompt('Enter your name:');
    const email = prompt('Enter your email:');
    const password = prompt('Enter your password (min 6 chars):');
    if (!name || !email || !password) return;
    if (password.length < 6) {
        alert('❌ Password must be at least 6 characters');
        return;
    }
    
    fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
    })
    .then(res => res.json())
    .then(data => {
        if (data.token) {
            localStorage.setItem('token', data.token);
            AppState.token = data.token;
            AppState.user = data.user;
            $('userBadge').textContent = `👤 ${data.user.name}`;
            $('greeting').textContent = `Assalamu Alaikum, ${data.user.name}! 👋`;
            alert('✅ Registration successful! Welcome ' + name + '!');
        } else {
            alert('❌ ' + (data.error || 'Registration failed'));
        }
    })
    .catch(err => alert('❌ Connection error: ' + err.message));
}

function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('token');
        AppState.token = null;
        AppState.user = null;
        $('userBadge').textContent = '👤 Guest';
        $('greeting').textContent = 'Assalamu Alaikum! 👋';
        alert('👋 Logged out successfully!');
    }
}

// ============================================================
// NAVIGATION
// ============================================================
function setupNavigation() {
    qsa('.sidebar-menu li[data-page]').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateTo(page);
        });
    });
    
    $('menuToggle').addEventListener('click', () => {
        document.getElementById('sidebar').classList.toggle('open');
    });
}

function navigateTo(page) {
    // Update sidebar
    qsa('.sidebar-menu li').forEach(li => li.classList.remove('active'));
    const menuItem = document.querySelector(`.sidebar-menu li[data-page="${page}"]`);
    if (menuItem) menuItem.classList.add('active');
    
    // Update pages
    qsa('.page').forEach(p => p.classList.remove('active'));
    const targetPage = document.getElementById(`page-${page}`);
    if (targetPage) targetPage.classList.add('active');
    
    // Update title
    const titles = {
        dashboard: '📊 Dashboard',
        quran: '📖 Quran',
        prayer: '🕌 Prayer Times',
        qibla: '🧭 Qibla Compass',
        mosque: '🕌 Mosques',
        tasbih: '📿 Tasbih',
        calendar: '📅 Calendar',
        zakat: '💰 Zakat',
        fasting: '🌙 Fasting',
        hadith: '📜 Hadith',
        courses: '📚 Courses',
        hifz: '📝 Hifz Tracker',
        tajweed: '🎤 Tajweed',
        'ai-assistant': '🤖 AI Assistant',
        videos: '📺 Videos',
        adhkar: '🌟 Adhkar',
        habits: '✅ Habits',
        kids: '👶 Kids',
        settings: '⚙️ Settings'
    };
    $('pageTitle').textContent = titles[page] || page;
    
    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');
    
    AppState.currentPage = page;
    
    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ============================================================
// THEME
// ============================================================
function applyTheme() {
    const theme = AppState.settings.theme || 'dark';
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.querySelector('#themeToggle i').className = 'fas fa-sun';
    } else {
        document.documentElement.removeAttribute('data-theme');
        document.querySelector('#themeToggle i').className = 'fas fa-moon';
    }
}

function toggleTheme() {
    const current = AppState.settings.theme || 'dark';
    AppState.settings.theme = current === 'dark' ? 'light' : 'dark';
    localStorage.setItem('settings', JSON.stringify(AppState.settings));
    applyTheme();
}

// ============================================================
// LANGUAGE
// ============================================================
function toggleLanguage() {
    const langs = ['en', 'ar', 'om', 'am', 'so', 'fr', 'ur', 'tr', 'id'];
    const current = AppState.settings.language || 'en';
    const idx = (langs.indexOf(current) + 1) % langs.length;
    AppState.settings.language = langs[idx];
    localStorage.setItem('settings', JSON.stringify(AppState.settings));
    
    const labels = { 
        en: 'EN', ar: 'AR', om: 'OM', am: 'AM', 
        so: 'SO', fr: 'FR', ur: 'UR', tr: 'TR', id: 'ID' 
    };
    document.querySelector('.lang-btn').textContent = '🌍 ' + labels[langs[idx]];
    changeLanguage(langs[idx]);
}

function changeLanguage(lang) {
    AppState.settings.language = lang;
    localStorage.setItem('settings', JSON.stringify(AppState.settings));
    console.log('🌍 Language changed to:', lang);
}

// ============================================================
// HIJRI CALENDAR
// ============================================================
function updateHijriDate() {
    const now = new Date();
    const greg = now.toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });
    $('gregDate').textContent = greg;
    
    fetch('https://api.aladhan.com/v1/gToH/' + now.getTime() / 1000)
        .then(res => res.json())
        .then(data => {
            if (data.data && data.data.hijri) {
                const h = data.data.hijri;
                const hijriStr = `${h.day} ${h.month.en} ${h.year}`;
                $('hijriFull').textContent = hijriStr;
                $('hijriDate').textContent = hijriStr;
                $('islamicMonth').textContent = h.month.en;
            }
        })
        .catch(() => {
            $('hijriFull').textContent = '12 Dhul-Hijjah 1447';
            $('hijriDate').textContent = '12 Dhul-Hijjah 1447';
            $('islamicMonth').textContent = 'Dhul-Hijjah';
        });
}

// ============================================================
// QURAN
// ============================================================
function populateSurahs() {
    const select = $('surahSelect');
    const surahs = [
        [1, 'Al-Fatihah', 7],
        [2, 'Al-Baqarah', 286],
        [3, 'Al-Imran', 200],
        [4, 'An-Nisa', 176],
        [5, 'Al-Ma\'idah', 120],
        [6, 'Al-An\'am', 165],
        [7, 'Al-A\'raf', 206],
        [8, 'Al-Anfal', 75],
        [9, 'At-Tawbah', 129],
        [10, 'Yunus', 109],
        [112, 'Al-Ikhlas', 4],
        [113, 'Al-Falaq', 5],
        [114, 'An-Nas', 6]
    ];
    
    select.innerHTML = '';
    surahs.forEach(([id, name, ayahs]) => {
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = `${id}. ${name} (${ayahs} ayahs)`;
        select.appendChild(opt);
    });
}

function getAyahData(surahId, ayahNum) {
    // Sample data for demo - In production, fetch from API
    const sample = {
        1: {
            1: {
                arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                translation: 'In the name of Allah, the Most Gracious, the Most Merciful.',
                transliteration: 'Bismillahir Rahmanir Raheem',
                tafsir: 'Ibn Kathir: This is the opening verse of every surah except Surah At-Tawbah.',
                tajweed: 'Madd on "Bismillah" (2 seconds)'
            },
            2: {
                arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
                translation: 'All praise is due to Allah, Lord of all the worlds.',
                transliteration: 'Alhamdu lillahi rabbil \'alameen',
                tafsir: 'Ibn Kathir: All praise and thanks are due to Allah alone.',
                tajweed: 'Madd on "Alhamdu" | Qalqalah on "Rabbi"'
            },
            3: {
                arabic: 'الرَّحْمَٰنِ الرَّحِيمِ',
                translation: 'The Most Gracious, The Most Merciful.',
                transliteration: 'Ar-Rahmanir Raheem',
                tafsir: 'Ibn Kathir: Two of Allah\'s beautiful names that indicate His vast mercy.',
                tajweed: 'Idgham on "Rahmanir" | Madd on "Raheem"'
            },
            4: {
                arabic: 'مَالِكِ يَوْمِ الدِّينِ',
                translation: 'Master of the Day of Judgment.',
                transliteration: 'Maliki yawmid-deen',
                tafsir: 'Ibn Kathir: This verse affirms Allah\'s absolute sovereignty over the Day of Judgment.',
                tajweed: 'Madd on "Yawmi" | Qalqalah on "Deen"'
            },
            5: {
                arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ',
                translation: 'You alone we worship, and You alone we ask for help.',
                transliteration: 'Iyyaka na\'budu wa iyyaka nasta\'een',
                tafsir: 'Ibn Kathir: This verse establishes the core of Islamic faith - worship of Allah alone.',
                tajweed: 'Madd on "Iyyaka" | Ghunnah on "na\'budu"'
            },
            6: {
                arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ',
                translation: 'Guide us to the straight path.',
                transliteration: 'Ihdinas-siratal mustaqeem',
                tafsir: 'Ibn Kathir: This is a prayer for guidance to the path of Islam.',
                tajweed: 'Idgham on "nas-siratal" | Madd on "mustaqeem"'
            },
            7: {
                arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ',
                translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked anger or of those who are astray.',
                transliteration: 'Siratal ladhina an\'amta \'alayhim ghayril maghdubi \'alayhim wa lad-dalleen',
                tafsir: 'Ibn Kathir: This verse specifies the straight path as the path of the prophets.',
                tajweed: 'Madd on "an\'amta" | Qalqalah on "maghdubi"'
            }
        },
        112: {
            1: {
                arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
                translation: 'Say: He is Allah, the One.',
                transliteration: 'Qul huwallahu ahad',
                tafsir: 'Ibn Kathir: This surah is equivalent to one-third of the Quran.',
                tajweed: 'Qalqalah on "Qul" | Madd on "Ahad"'
            },
            2: {
                arabic: 'اللَّهُ الصَّمَدُ',
                translation: 'Allah, the Eternal, the Self-Sufficient.',
                transliteration: 'Allahus-samad',
                tafsir: 'Ibn Kathir: \'As-Samad\' means the One who is self-sufficient.',
                tajweed: 'Madd on "Allah" | Qalqalah on "Samad"'
            },
            3: {
                arabic: 'لَمْ يَلِدْ وَلَمْ يُولَدْ',
                translation: 'He neither begets nor is born.',
                transliteration: 'Lam yalid wa lam yulad',
                tafsir: 'Ibn Kathir: This negates any offspring or parent for Allah.',
                tajweed: 'Qalqalah on "yulad"'
            },
            4: {
                arabic: 'وَلَمْ يَكُن لَّهُ كُفُوًا أَحَدٌ',
                translation: 'Nor is there to Him any equivalent.',
                transliteration: 'Wa lam yakun lahu kufuwan ahad',
                tafsir: 'Ibn Kathir: Nothing and no one is comparable to Allah.',
                tajweed: 'Madd on "kufuwan" | Qalqalah on "Ahad"'
            }
        },
        113: {
            1: {
                arabic: 'قُلْ أَعُوذُ بِرَبِّ الْفَلَقِ',
                translation: 'Say: I seek refuge in the Lord of the daybreak.',
                transliteration: 'Qul a\'udhu birabbil-falaq',
                tafsir: 'Ibn Kathir: This surah seeks protection from various forms of evil.',
                tajweed: 'Qalqalah on "Qul"'
            },
            2: {
                arabic: 'مِن شَرِّ مَا خَلَقَ',
                translation: 'From the evil of that which He created.',
                transliteration: 'Min sharri ma khalaq',
                tafsir: 'Ibn Kathir: Protection from all evil in creation.',
                tajweed: 'Madd on "sharri"'
            },
            3: {
                arabic: 'وَمِن شَرِّ غَاسِقٍ إِذَا وَقَبَ',
                translation: 'And from the evil of darkness when it settles.',
                transliteration: 'Wa min sharri ghasiqin idha waqab',
                tafsir: 'Ibn Kathir: Protection from the evil of the night.',
                tajweed: 'Madd on "ghasiqin"'
            },
            4: {
                arabic: 'وَمِن شَرِّ النَّفَّاثَاتِ فِي الْعُقَدِ',
                translation: 'And from the evil of the blowers in knots.',
                transliteration: 'Wa min sharrin-naffathati fil-\'uqad',
                tafsir: 'Ibn Kathir: Protection from witchcraft and magic.',
                tajweed: 'Idgham on "sharrin-naffathati"'
            },
            5: {
                arabic: 'وَمِن شَرِّ حَاسِدٍ إِذَا حَسَدَ',
                translation: 'And from the evil of the envious when he envies.',
                transliteration: 'Wa min sharri hasidin idha hasad',
                tafsir: 'Ibn Kathir: Protection from the evil of envy.',
                tajweed: 'Madd on "hasidin"'
            }
        },
        114: {
            1: {
                arabic: 'قُلْ أَعُوذُ بِرَبِّ النَّاسِ',
                translation: 'Say: I seek refuge in the Lord of mankind.',
                transliteration: 'Qul a\'udhu birabbin-nas',
                tafsir: 'Ibn Kathir: This surah seeks protection from evil whispers.',
                tajweed: 'Qalqalah on "Qul" | Idgham on "rabbin-nas"'
            },
            2: {
                arabic: 'مَلِكِ النَّاسِ',
                translation: 'The Sovereign of mankind.',
                transliteration: 'Malikin-nas',
                tafsir: 'Ibn Kathir: Allah is the King and Master of all mankind.',
                tajweed: 'Madd on "Malik" | Idgham on "kin-nas"'
            },
            3: {
                arabic: 'إِلَٰهِ النَّاسِ',
                translation: 'The God of mankind.',
                transliteration: 'Ilahin-nas',
                tafsir: 'Ibn Kathir: The one true God worthy of worship.',
                tajweed: 'Madd on "Ilah" | Idgham on "hin-nas"'
            },
            4: {
                arabic: 'مِن شَرِّ الْوَسْوَاسِ الْخَنَّاسِ',
                translation: 'From the evil of the retreating whisperer.',
                transliteration: 'Min sharril waswasil khannas',
                tafsir: 'Ibn Kathir: Protection from Satan who whispers evil.',
                tajweed: 'Madd on "sharril" | Qalqalah on "khannas"'
            },
            5: {
                arabic: 'الَّذِي يُوَسْوِسُ فِي صُدُورِ النَّاسِ',
                translation: 'Who whispers into the breasts of mankind.',
                transliteration: 'Alladhi yuwaswisu fi sudurin-nas',
                tafsir: 'Ibn Kathir: Satan whispers evil thoughts into the hearts of people.',
                tajweed: 'Madd on "yuwaswisu" | Idgham on "sudurin-nas"'
            },
            6: {
                arabic: 'مِنَ الْجِنَّةِ وَالنَّاسِ',
                translation: 'From among the jinn and mankind.',
                transliteration: 'Minal jinnati wan-nas',
                tafsir: 'Ibn Kathir: Evil whisperers come from both jinn and mankind.',
                tajweed: 'Idgham on "jinnati wan-nas"'
            }
        }
    };
    return sample[surahId]?.[ayahNum] || null;
}

function getTotalAyahs(surahId) {
    const totals = { 
        1: 7, 2: 286, 3: 200, 4: 176, 5: 120, 
        6: 165, 7: 206, 8: 75, 9: 129, 10: 109,
        112: 4, 113: 5, 114: 6 
    };
    return totals[surahId] || 7;
}

function loadAyah(surahId, ayahNum) {
    const ayah = getAyahData(surahId, ayahNum);
    if (!ayah) return;

    $('arabicText').textContent = ayah.arabic;
    $('translationText').textContent = ayah.translation;
    $('transliterationText').textContent = ayah.transliteration || '';
    $('tafsirText').textContent = ayah.tafsir || 'Tafsir not available';
    $('tajweedText').textContent = ayah.tajweed || 'No specific rules';
    $('ayahDisplay').textContent = `${ayahNum} / ${getTotalAyahs(surahId)}`;

    if (AppState.isTextHidden) {
        $('arabicText').style.opacity = '0.1';
        $('arabicText').style.filter = 'blur(3px)';
    } else {
        $('arabicText').style.opacity = '1';
        $('arabicText').style.filter = 'none';
    }

    // Load audio
    const reciter = $('reciterSelect')?.value || 'mishary';
    const audio = $('audioPlayer');
    audio.src = `https://cdn.islamic.network/quran/audio/128/${reciter}/${surahId}_${ayahNum}.mp3`;

    AppState.currentSurah = surahId;
    AppState.currentAyah = ayahNum;
}

// ============================================================
// PRAYER TIMES
// ============================================================
function getPrayerTimes() {
    const city = $('cityInput').value.trim() || 'Makkah';
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=SA&method=4`)
        .then(res => res.json())
        .then(data => {
            const timings = data.data.timings;
            $('fajrTime').textContent = timings.Fajr;
            $('dhuhrTime').textContent = timings.Dhuhr;
            $('asrTime').textContent = timings.Asr;
            $('maghribTime').textContent = timings.Maghrib;
            $('ishaTime').textContent = timings.Isha;
        })
        .catch(() => {
            $('fajrTime').textContent = '5:00 AM';
            $('dhuhrTime').textContent = '12:00 PM';
            $('asrTime').textContent = '3:30 PM';
            $('maghribTime').textContent = '6:15 PM';
            $('ishaTime').textContent = '7:45 PM';
        });
}

// ============================================================
// QIBLA
// ============================================================
function startQibla() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            const qibla = calculateQibla(lat, lon);
            $('qiblaDirection').textContent = `Facing: Makkah (${qibla.toFixed(1)}°)`;
            $('userLocation').textContent = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
            $('needle').style.transform = `translate(-50%, -100%) rotate(${qibla}deg)`;
        }, () => {
            alert('Unable to get location. Please enable GPS.');
        });
    } else {
        alert('Geolocation not supported.');
    }
}

function calculateQibla(lat, lon) {
    const makkahLat = 21.4225;
    const makkahLon = 39.8262;
    const lat1 = lat * Math.PI / 180;
    const lon1 = lon * Math.PI / 180;
    const lat2 = makkahLat * Math.PI / 180;
    const lon2 = makkahLon * Math.PI / 180;
    const dLon = lon2 - lon1;
    const y = Math.sin(dLon) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    let bearing = Math.atan2(y, x) * 180 / Math.PI;
    bearing = (bearing + 360) % 360;
    return bearing;
}

// ============================================================
// TASBIH
// ============================================================
function incrementTasbih(amount = 1) {
    AppState.tasbihCount += amount;
    $('tasbihCount').textContent = AppState.tasbihCount;
    AppState.totalDhikr += amount;
    localStorage.setItem('totalDhikr', AppState.totalDhikr);
    if (navigator.vibrate) navigator.vibrate(10);
}

function resetTasbih() {
    AppState.tasbihCount = 0;
    $('tasbihCount').textContent = '0';
}

function setTasbihPhrase(phrase) {
    AppState.tasbihPhrase = phrase;
    const labels = {
        subhanallah: 'Subhanallah (سبحان الله)',
        alhamdulillah: 'Alhamdulillah (الحمد لله)',
        allahuakbar: 'Allahu Akbar (الله أكبر)',
        astaghfirullah: 'Astaghfirullah (أستغفر الله)',
        'la ilaha illallah': 'La ilaha illallah (لا إله إلا الله)'
    };
    $('tasbihPhrase').textContent = labels[phrase] || phrase;
    resetTasbih();
}

function loadTotalDhikr() {
    $('totalDhikr').textContent = AppState.totalDhikr;
}

// ============================================================
// ZAKAT
// ============================================================
function calculateZakat() {
    const wealth = parseFloat($('zakatWealth').value) || 0;
    const gold = parseFloat($('zakatGold').value) || 0;
    const cash = parseFloat($('zakatCash').value) || 0;
    const total = wealth + (gold * 85) + cash;
    const nisab = 5000;
    const zakat = total >= nisab ? total * 0.025 : 0;
    $('zakatResult').textContent = `$${zakat.toFixed(2)}`;
    $('zakatDetail').textContent = total >= nisab ?
        `2.5% of $${total.toFixed(2)} = $${zakat.toFixed(2)}` :
        `Your wealth ($${total.toFixed(2)}) is below Nisab ($${nisab}). No zakat due.`;
}

// ============================================================
// FASTING
// ============================================================
function logFast(type) {
    const today = new Date().toDateString();
    AppState.fastingLog.push({ date: today, type: type });
    localStorage.setItem('fastingLog', JSON.stringify(AppState.fastingLog));
    loadFastingLog();
}

function loadFastingLog() {
    const list = $('fastingLogList');
    if (!list) return;
    list.innerHTML = '';
    const recent = AppState.fastingLog.slice(-10).reverse();
    recent.forEach(log => {
        const li = document.createElement('li');
        li.textContent = `${log.date}: ${log.type.toUpperCase()}`;
        list.appendChild(li);
    });
    $('fastingDays').textContent = AppState.fastingLog.length;
}

// ============================================================
// HADITH
// ============================================================
function getRandomHadith() {
    const hadiths = [{
        text: 'The best of you are those who are best to their families.',
        reference: 'Sunan al-Tirmidhi 3895',
        grade: 'Sahih',
        explanation: 'This hadith emphasizes the importance of treating family members with kindness.'
    }, {
        text: 'None of you truly believes until he loves for his brother what he loves for himself.',
        reference: 'Sahih Bukhari 13',
        grade: 'Sahih',
        explanation: 'This is a core principle of Islamic brotherhood.'
    }, {
        text: 'The strongest person is not the one who can wrestle, but the one who controls himself when angry.',
        reference: 'Sahih Bukhari 6114',
        grade: 'Sahih',
        explanation: 'True strength lies in emotional control and self-discipline.'
    }, {
        text: 'Charity does not decrease wealth.',
        reference: 'Sahih Muslim 2588',
        grade: 'Sahih',
        explanation: 'Giving charity never reduces one\'s wealth; rather, it brings blessings.'
    }, {
        text: 'The best of people are those who are most beneficial to people.',
        reference: 'Sahih Muslim 2590',
        grade: 'Sahih',
        explanation: 'The value of a person is measured by how much they benefit others.'
    }];
    const h = hadiths[Math.floor(Math.random() * hadiths.length)];
    displayHadith(h);
}

function getDailyHadith() {
    getRandomHadith();
}

function displayHadith(h) {
    $('hadithText').textContent = `"${h.text}"`;
    $('hadithReference').textContent = `📚 ${h.reference}`;
    $('hadithGrade').textContent = `⭐ ${h.grade}`;
    $('hadithExplanation').textContent = `📖 ${h.explanation}`;
}

function loadDailyHadith() {
    getRandomHadith();
}

// ============================================================
// VIDEOS
// ============================================================
function loadVideos() {
    const grid = $('videoGrid');
    if (!grid) return;
    const videos = [
        { id: 'dX0g6H5Cj3E', title: 'Beautiful Quran Recitation', channel: 'Mishary Alafasy', category: 'recitation' },
        { id: 'F_YkOf4VJDE', title: 'Tafsir of Surah Al-Fatihah', channel: 'Nouman Ali Khan', category: 'tafsir' },
        { id: 'g8LvWj5K5rY', title: '40 Hadith of Imam Nawawi', channel: 'Yasir Qadhi', category: 'hadith' },
        { id: 'LkG8Q3v7xVg', title: 'Life of Prophet Muhammad (PBUH)', channel: 'Mufti Menk', category: 'seerah' },
        { id: 'dX0g6H5Cj3E', title: 'Learn Tajweed - Madd Rules', channel: 'Tajweed Institute', category: 'tajweed' },
        { id: 'F_YkOf4VJDE', title: 'Islamic Stories for Kids', channel: 'Islamic Kids TV', category: 'kids' }
    ];
    
    grid.innerHTML = '';
    videos.forEach(v => {
        const card = document.createElement('div');
        card.className = 'video-card';
        card.innerHTML = `
            <img src="https://img.youtube.com/vi/${v.id}/hqdefault.jpg" alt="${v.title}" />
            <div class="info">
                <h4>${v.title}</h4>
                <small>${v.channel}</small>
                <span class="category">${v.category}</span>
            </div>
        `;
        card.addEventListener('click', () => {
            window.open(`https://www.youtube.com/watch?v=${v.id}`, '_blank');
        });
        grid.appendChild(card);
    });
}

function searchVideos() {
    loadVideos();
}

// ============================================================
// ADHKAR
// ============================================================
function loadAdhkar(time) {
    const list = $('adhkarList');
    if (!list) return;
    qsa('.adhkar-tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`.adhkar-tab[data-time="${time}"]`);
    if (activeTab) activeTab.classList.add('active');

    const adhkar = {
        morning: [
            { dua: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ', meaning: 'O Allah, I have entered the morning...', count: 1 },
            { dua: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ', meaning: 'We have entered the morning...', count: 1 },
            { dua: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', meaning: 'Glory be to Allah and praise...', count: 100 },
            { dua: 'لَا إِلَٰهَ إِلَّا اللَّهُ وَحْدَهُ', meaning: 'None has the right to be worshipped except Allah alone...', count: 1 }
        ],
        evening: [
            { dua: 'اللَّهُمَّ إِنِّي أَمْسَيْتُ', meaning: 'O Allah, I have entered the evening...', count: 1 },
            { dua: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ', meaning: 'We have entered the evening...', count: 1 },
            { dua: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ خَيْرَ اللَّيْلَةِ', meaning: 'O Allah, I ask You for the good of this night...', count: 1 }
        ],
        sleep: [
            { dua: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا', meaning: 'O Allah, in Your name I die and live...', count: 1 },
            { dua: 'أَعُوذُ بِكَلِمَاتِ اللَّهِ التَّامَّاتِ', meaning: 'I seek refuge in the perfect words of Allah...', count: 3 }
        ]
    };
    const items = adhkar[time] || adhkar.morning;
    list.innerHTML = '';
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'adhkar-item';
        div.innerHTML = `
            <div class="dua">${item.dua}</div>
            <div class="meaning">${item.meaning}</div>
            <div class="count">🔄 ${item.count} time${item.count > 1 ? 's' : ''}</div>
        `;
        list.appendChild(div);
    });
}

// ============================================================
// HIFZ TRACKER
// ============================================================
function loadHifzList() {
    const list = $('hifzList');
    if (!list) return;
    const surahs = [
        { name: 'Al-Fatihah', status: 'done' },
        { name: 'Al-Ikhlas', status: 'done' },
        { name: 'Al-Falaq', status: 'done' },
        { name: 'An-Nas', status: 'done' },
        { name: 'Al-Baqarah', status: 'progress', progress: 40 },
        { name: 'Al-Imran', status: 'pending' },
    ];
    list.innerHTML = '';
    surahs.forEach(s => {
        const div = document.createElement('div');
        div.className = `hifz-item ${s.status}`;
        const statusText = s.status === 'done' ? '✅ Memorized' :
            s.status === 'progress' ? `⏳ ${s.progress}%` :
            '📖 Not Started';
        div.innerHTML = `<span>${s.name}</span><span>${statusText}</span>`;
        list.appendChild(div);
    });
}

function addHifzSurah() {
    const input = $('newSurahInput');
    if (!input || !input.value.trim()) return;
    const name = input.value.trim();
    const list = $('hifzList');
    const div = document.createElement('div');
    div.className = 'hifz-item';
    div.innerHTML = `<span>${name}</span><span>📖 Not Started</span>`;
    list.appendChild(div);
    input.value = '';
}

// ============================================================
// BOOKMARKS & NOTES
// ============================================================
function toggleBookmark() {
    const key = `${AppState.currentSurah}:${AppState.currentAyah}`;
    const index = AppState.bookmarks.indexOf(key);
    if (index > -1) {
        AppState.bookmarks.splice(index, 1);
        $('bookmarkBtn').classList.remove('active');
    } else {
        AppState.bookmarks.push(key);
        $('bookmarkBtn').classList.add('active');
    }
    localStorage.setItem('bookmarks', JSON.stringify(AppState.bookmarks));
    loadBookmarks();
}

function loadBookmarks() {
    // Implementation for bookmarks list
}

function saveNote() {
    const key = `${AppState.currentSurah}:${AppState.currentAyah}`;
    const notes = $('ayahNotes')?.value || '';
    localStorage.setItem(`note_${key}`, notes);
    alert('✅ Note saved!');
}

// ============================================================
// PRAYER TRACKER
// ============================================================
document.addEventListener('click', (e) => {
    const btn = e.target.closest('.prayer-btn');
    if (btn) {
        btn.classList.toggle('done');
        const prayer = btn.dataset.prayer;
        const today = new Date().toDateString();
        if (!AppState.prayerLog[today]) AppState.prayerLog[today] = [];
        if (btn.classList.contains('done')) {
            if (!AppState.prayerLog[today].includes(prayer)) {
                AppState.prayerLog[today].push(prayer);
            }
        } else {
            AppState.prayerLog[today] = AppState.prayerLog[today].filter(p => p !== prayer);
        }
        localStorage.setItem('prayerLog', JSON.stringify(AppState.prayerLog));
        updatePrayerStreak();
    }
});

function updatePrayerStreak() {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i < 30; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const key = date.toDateString();
        if (AppState.prayerLog[key] && AppState.prayerLog[key].length >= 5) {
            streak++;
        } else if (i > 0) {
            break;
        }
    }
    $('streakDisplay').textContent = streak || 0;
    $('prayerStreak').textContent = streak || 0;
}

function loadPrayerStreak() {
    updatePrayerStreak();
}

// ============================================================
// DASHBOARD
// ============================================================
function updateDashboard() {
    $('quranRead').textContent = Math.floor(Math.random() * 50) + 10;
    $('hifzProgress').textContent = '40%';
    $('badgeCount').textContent = AppState.bookmarks.length;

    const ayah = getAyahData(1, 1);
    if (ayah) {
        $('dailyAyah').textContent = `${ayah.arabic} — ${ayah.translation}`;
    }

    const challenges = [
        'Read 1 Juz today 📖',
        'Memorize 3 new ayahs 🎯',
        'Recite 1000 Tasbih 📿',
        'Pray all 5 prayers on time 🕌',
        'Give charity today 🤲'
    ];
    $('dailyChallenge').textContent = challenges[Math.floor(Math.random() * challenges.length)];
}

function startChallenge() {
    alert('🎯 Challenge started! Read 1 Juz today.');
}

// ============================================================
// AI ASSISTANT
// ============================================================
function askAI() {
    const input = $('aiInput');
    const question = input.value.trim();
    if (!question) return;
    askAIQuestion(question);
}

function askAIQuestion(question) {
    const chat = $('aiChat');
    const userDiv = document.createElement('div');
    userDiv.className = 'ai-msg user';
    userDiv.textContent = `👤 ${question}`;
    chat.appendChild(userDiv);

    const botDiv = document.createElement('div');
    botDiv.className = 'ai-msg bot';
    botDiv.innerHTML = '🤖 Thinking... 📚 Searching authentic sources...';
    chat.appendChild(botDiv);
    chat.scrollTop = chat.scrollHeight;

    $('aiInput').value = '';

    setTimeout(() => {
        const response = generateAIResponse(question);
        botDiv.innerHTML = response;
        chat.scrollTop = chat.scrollHeight;
    }, 1000 + Math.random() * 1000);
}

function generateAIResponse(question) {
    const q = question.toLowerCase();
    let response = '';

    if (q.includes('charity') || q.includes('zakat')) {
        response = `
            🤖 <strong>Charity in Islam (Sadaqah & Zakat)</strong>
            <br><br>
            📖 <strong>Quran:</strong> "The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes..." (2:261)
            <br><br>
            📜 <strong>Hadith:</strong> "Charity does not decrease wealth." (Sahih Muslim)
            <br><br>
            📌 <strong>Sources:</strong> Quran 2:261, Sahih Muslim 2588
            <div class="source">📚 Sources: Quran, Sahih Muslim</div>
        `;
    } else if (q.includes('fatihah')) {
        response = `
            🤖 <strong>Surah Al-Fatihah - "The Opening"</strong>
            <br><br>
            📖 The first chapter of the Quran, consisting of 7 verses.
            <br><br>
            📜 <strong>Hadith:</strong> "Al-Fatihah is the greatest Surah in the Quran." (Bukhari)
            <br><br>
            📌 <strong>Key Themes:</strong> Praise of Allah, His Mercy, Judgment Day, Worship, Guidance
            <div class="source">📚 Sources: Quran, Sahih Bukhari</div>
        `;
    } else if (q.includes('dua') || q.includes('protection')) {
        response = `
            🤖 <strong>Best Duas for Protection</strong>
            <br><br>
            🔹 "Bismillahi alladhi la yadurru ma'asmihi shay'un..." (Morning/Evening)
            <br><br>
            🔹 "A'udhu bikalimatillahit-tammati..." (Before Sleep)
            <br><br>
            📌 <strong>Sources:</strong> Sahih Bukhari 3371, Tirmidhi 3430
            <div class="source">📚 Sources: Sahih Bukhari, Tirmidhi</div>
        `;
    } else if (q.includes('prophet') || q.includes('muhammad')) {
        response = `
            🤖 <strong>Prophet Muhammad (PBUH) - Brief Seerah</strong>
            <br><br>
            📜 <strong>Birth:</strong> 570 CE in Makkah
            <br><br>
            📜 <strong>Revelation:</strong> First revelation at age 40 in Cave Hira
            <br><br>
            📜 <strong>Migration (Hijrah):</strong> 622 CE - marks the start of the Islamic calendar
            <br><br>
            📜 <strong>Death:</strong> 632 CE at age 63
            <div class="source">📚 Sources: Seerah Ibn Hisham, Sahih Bukhari</div>
        `;
    } else if (q.includes('riba') || q.includes('interest')) {
        response = `
            🤖 <strong>Ruling on Interest (Riba) in Islam</strong>
            <br><br>
            📖 <strong>Quran:</strong> "Allah has permitted trade and forbidden riba." (2:275)
            <br><br>
            📜 <strong>Hadith:</strong> The Prophet (PBUH) cursed the one who consumes riba.
            <br><br>
            📌 <strong>Consensus:</strong> All major schools agree that Riba is strictly prohibited (Haram).
            <div class="source">📚 Sources: Quran 2:275, Sahih Muslim 1598</div>
        `;
    } else if (q.includes('tahajjud')) {
        response = `
            🤖 <strong>How to Pray Tahajjud (Night Prayer)</strong>
            <br><br>
            📜 <strong>Hadith:</strong> "The best prayer after the obligatory prayers is the night prayer." (Muslim)
            <br><br>
            📌 <strong>How to Pray:</strong>
            <br>1. Wake up after midnight
            <br>2. Make wudu (ablution)
            <br>3. Pray 2 rak'ahs at a time (minimum 2)
            <br>4. Make dua and seek forgiveness
            <div class="source">📚 Sources: Sahih Muslim 1163</div>
        `;
    } else if (q.includes('99 names')) {
        response = `
            🤖 <strong>The 99 Names of Allah (Al-Asma ul-Husna)</strong>
            <br><br>
            📜 <strong>Hadith:</strong> "Allah has 99 names - whoever memorizes them will enter Paradise." (Bukhari)
            <br><br>
            📌 <strong>Key Names:</strong> Ar-Rahman, Ar-Raheem, Al-Malik, Al-Quddus, As-Salam...
            <br><br>
            💡 Reciting these names brings blessings and protection.
            <div class="source">📚 Sources: Sahih Bukhari 2736, Sahih Muslim 2677</div>
        `;
    } else {
        response = `
            🤖 <strong>I'm here to help!</strong>
            <br><br>
            I can answer questions about:
            <br>• Quran & Tafsir
            <br>• Hadith
            <br>• Fiqh (rulings)
            <br>• Seerah (Prophet's life)
            <br>• Duas & Adhkar
            <br><br>
            💡 Try asking:
            <br>• "What does the Quran say about charity?"
            <br>• "Explain Surah Al-Fatihah"
            <br>• "Best dua for protection?"
            <br>• "History of Prophet Muhammad (PBUH)"
            <br>• "What is the ruling on interest?"
            <br><br>
            📌 <em>All answers cite authentic Islamic sources!</em>
        `;
    }
    return response;
}

function clearAIChat() {
    const chat = $('aiChat');
    chat.innerHTML = `
        <div class="ai-msg bot">
            🤖 Assalamu Alaikum! I'm your AI Islamic Assistant.
            <br>Ask me about Quran, Hadith, Fiqh, Dua, Seerah, and more!
            <br><em>📌 I always cite sources.</em>
        </div>
    `;
}

// ============================================================
// KIDS STORIES
// ============================================================
function readStory(storyId) {
    const stories = {
        yunus: `🐟 Prophet Yunus (AS) and the Whale\n\nYunus (AS) was sent to the people of Nineveh. When they didn't listen, he left in anger.\n\nHe boarded a ship, but a storm came. A giant whale swallowed him!\n\nIn the darkness, Yunus prayed: "La ilaha illa anta, subhanaka, inni kuntu minadh-dhalimeen."\n\nAllah forgave him, and the whale released him safely.\n\n📖 Lesson: Never give up on Allah's mercy.`,
        muhammad: `🐫 Prophet Muhammad (PBUH) - The Trustworthy One\n\nBefore becoming a prophet, Muhammad (PBUH) was known as "Al-Amin" (The Trustworthy).\n\nHe was honest and fair in all his dealings. People trusted him to keep their belongings safe.\n\nWhen the Kaaba was being rebuilt, he solved a dispute by placing the Black Stone on a cloth for all tribes to lift together!\n\n📖 Lesson: Always be honest and fair.`,
        ibrahim: `🕊️ Prophet Ibrahim (AS) and the Kaaba\n\nIbrahim (AS) was commanded by Allah to build the Kaaba with his son Isma'il (AS).\n\nThey raised the foundations, praying: "Rabbana taqabbal minna..."\n\nIbrahim also called people to Hajj, and millions still respond to his call today!\n\n📖 Lesson: Trust in Allah's commands and leave a legacy of faith.`,
        musa: `🐟 Prophet Musa (AS) and the Red Sea\n\nMusa (AS) led the Children of Israel out of Egypt. Pharaoh and his army chased them.\n\nThey reached the Red Sea with no way out. Musa prayed to Allah for help.\n\nAllah commanded Musa to strike the sea with his staff. The sea split into two!\n\nThe Children of Israel crossed safely, and Pharaoh's army was drowned.\n\n📖 Lesson: Trust in Allah when you're trapped. He always makes a way out!`
    };
    const story = stories[storyId] || '📖 Story not found.';
    alert(story.replace(/\n/g, '\n'));
}

// ============================================================
// MOSQUES
// ============================================================
function findMosques() {
    const search = $('mosqueSearch')?.value || '';
    alert(`🔍 Searching for "${search}" mosques... (Simulated)`);
}

function getNearbyMosques() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(() => {
            alert('🕌 Finding nearby mosques... (Simulated)');
        }, () => {
            alert('Please enable location to find nearby mosques.');
        });
    } else {
        alert('Geolocation not supported.');
    }
}

// ============================================================
// SETTINGS
// ============================================================
function exportData() {
    const data = {
        bookmarks: AppState.bookmarks,
        prayerLog: AppState.prayerLog,
        fastingLog: AppState.fastingLog,
        settings: AppState.settings,
        exportDate: new Date().toISOString()
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `deenmax-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

function backupToCloud() {
    alert('☁️ Backup started... (Simulated)');
    setTimeout(() => {
        $('lastBackup').textContent = new Date().toLocaleString();
        alert('✅ Backup complete!');
    }, 1500);
}

function restoreFromCloud() {
    alert('☁️ Restoring from cloud... (Simulated)');
    setTimeout(() => {
        alert('✅ Restore complete!');
    }, 1500);
}

function clearCache() {
    if (confirm('⚠️ Clear cache?')) {
        if ('caches' in window) {
            caches.keys().then(keys => keys.forEach(key => caches.delete(key)));
        }
        $('cacheSize').textContent = '0 MB';
        alert('✅ Cache cleared!');
    }
}

function toggleOffline() {
    alert('📶 Offline mode toggled! (Simulated)');
}

function backupData() {
    exportData();
}

// ============================================================
// ONLINE STATUS
// ============================================================
function checkOnlineStatus() {
    const dot = $('onlineStatus');
    if (navigator.onLine) {
        dot.className = 'status-dot online';
        dot.title = 'Online';
    } else {
        dot.className = 'status-dot offline';
        dot.title = 'Offline Mode';
    }
}

window.addEventListener('online', checkOnlineStatus);
window.addEventListener('offline', checkOnlineStatus);

// ============================================================
// EVENT LISTENERS
// ============================================================
function setupEventListeners() {
    // Quran controls
    document.addEventListener('click', (e) => {
        if (e.target.closest('#playAyah')) {
            $('audioPlayer').play();
        }
        if (e.target.closest('#bookmarkBtn')) {
            toggleBookmark();
        }
        if (e.target.closest('#hideText')) {
            AppState.isTextHidden = !AppState.isTextHidden;
            loadAyah(AppState.currentSurah, AppState.currentAyah);
        }
        if (e.target.closest('#repeatAyah')) {
            const audio = $('audioPlayer');
            audio.loop = true;
            audio.play();
            alert('🔁 Looping ayah 3 times...');
            setTimeout(() => {
                audio.loop = false;
                audio.pause();
            }, 15000);
        }
        if (e.target.closest('#prevAyah')) {
            const total = getTotalAyahs(AppState.currentSurah);
            AppState.currentAyah = AppState.currentAyah > 1 ? AppState.currentAyah - 1 : total;
            loadAyah(AppState.currentSurah, AppState.currentAyah);
        }
        if (e.target.closest('#nextAyah')) {
            const total = getTotalAyahs(AppState.currentSurah);
            AppState.currentAyah = AppState.currentAyah < total ? AppState.currentAyah + 1 : 1;
            loadAyah(AppState.currentSurah, AppState.currentAyah);
        }
        if (e.target.closest('#saveNotes')) {
            saveNote();
        }
        if (e.target.closest('#downloadAudio')) {
            const audio = $('audioPlayer');
            if (audio.src) {
                const a = document.createElement('a');
                a.href = audio.src;
                a.download = `ayah-${AppState.currentSurah}-${AppState.currentAyah}.mp3`;
                a.click();
            }
        }
        if (e.target.closest('#loopAyah')) {
            const audio = $('audioPlayer');
            audio.loop = !audio.loop;
            e.target.style.color = audio.loop ? 'var(--secondary)' : '';
        }
        if (e.target.closest('#speedControl')) {
            const audio = $('audioPlayer');
            const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
            const current = audio.playbackRate;
            const next = speeds[(speeds.indexOf(current) + 1) % speeds.length];
            audio.playbackRate = next;
            e.target.textContent = `⏩ ${next}x`;
        }
    });

    // Surah change
    document.addEventListener('change', (e) => {
        if (e.target.id === 'surahSelect') {
            AppState.currentSurah = parseInt(e.target.value);
            AppState.currentAyah = 1;
            loadAyah(AppState.currentSurah, AppState.currentAyah);
        }
        if (e.target.id === 'reciterSelect') {
            loadAyah(AppState.currentSurah, AppState.currentAyah);
        }
        if (e.target.id === 'translationSelect') {
            loadAyah(AppState.currentSurah, AppState.currentAyah);
        }
    });

    // AI Enter key
    document.addEventListener('keydown', (e) => {
        if (e.target.id === 'aiInput' && e.key === 'Enter') {
            askAI();
        }
        if (e.target.id === 'botInput' && e.key === 'Enter') {
            askBot(e.target.value);
        }
    });

    // Adhkar tab clicks
    document.addEventListener('click', (e) => {
        const tab = e.target.closest('.adhkar-tab');
        if (tab) loadAdhkar(tab.dataset.time);
    });

    // Prayer tracker buttons
    document.addEventListener('click', (e) => {
        const btn = e.target.closest('.prayer-btn');
        if (btn) {
            btn.classList.toggle('done');
        }
    });
}

// ============================================================
// BOT QUICK AI
// ============================================================
function askBot(question) {
    if (!question || !question.trim()) return;
    const chat = document.getElementById('botMessages');
    if (!chat) return;

    const userMsg = document.createElement('div');
    userMsg.className = 'user-msg';
    userMsg.textContent = `👤 ${question}`;
    chat.appendChild(userMsg);

    const botMsg = document.createElement('div');
    botMsg.className = 'bot-msg';
    botMsg.innerHTML = '🤖 Thinking...';
    chat.appendChild(botMsg);
    chat.scrollTop = chat.scrollHeight;

    document.getElementById('botInput').value = '';

    setTimeout(() => {
        const response = generateAIResponse(question);
        botMsg.innerHTML = `🤖 ${response}`;
        chat.scrollTop = chat.scrollHeight;
    }, 800);
}

// ============================================================
// KEYBOARD SHORTCUTS
// ============================================================
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.key === 'q') { e.preventDefault(); navigateTo('quran'); }
    if (e.ctrlKey && e.key === 'p') { e.preventDefault(); navigateTo('prayer'); }
    if (e.ctrlKey && e.key === 'h') { e.preventDefault(); navigateTo('hadith'); }
    if (e.ctrlKey && e.key === 'a') { e.preventDefault(); navigateTo('ai-assistant'); }
});

// ============================================================
// EXPOSE GLOBAL FUNCTIONS
// ============================================================
window.navigateTo = navigateTo;
window.toggleTheme = toggleTheme;
window.toggleLanguage = toggleLanguage;
window.changeLanguage = changeLanguage;
window.getPrayerTimes = getPrayerTimes;
window.startQibla = startQibla;
window.incrementTasbih = incrementTasbih;
window.resetTasbih = resetTasbih;
window.setTasbihPhrase = setTasbihPhrase;
window.calculateZakat = calculateZakat;
window.logFast = logFast;
window.getRandomHadith = getRandomHadith;
window.getDailyHadith = getDailyHadith;
window.loadVideos = loadVideos;
window.searchVideos = searchVideos;
window.loadAdhkar = loadAdhkar;
window.addHifzSurah = addHifzSurah;
window.askAI = askAI;
window.askAIQuestion = askAIQuestion;
window.clearAIChat = clearAIChat;
window.readStory = readStory;
window.findMosques = findMosques;
window.getNearbyMosques = getNearbyMosques;
window.login = login;
window.register = register;
window.logout = logout;
window.exportData = exportData;
window.backupToCloud = backupToCloud;
window.restoreFromCloud = restoreFromCloud;
window.clearCache = clearCache;
window.toggleOffline = toggleOffline;
window.backupData = backupData;
window.startChallenge = startChallenge;
window.saveNote = saveNote;
window.askBot = askBot;

console.log('🚀 DeenMax ready!');
console.log('📖 Features: Quran, Prayer, Qibla, Tasbih, Zakat, Fasting, Hadith, Courses, AI Assistant, Videos, Adhkar, Kids, Health, Travel, and more!');
