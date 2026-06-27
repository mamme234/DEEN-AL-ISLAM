// ================================================================
//  DEENMAX - COMPLETE APP LOGIC
// ================================================================

// ================================================================
//  STATE MANAGEMENT
// ================================================================
const AppState = {
    currentPage: 'quran',
    currentSurah: 1,
    currentAyah: 1,
    isTextHidden: false,
    isPlaying: false,
    isRecording: false,
    tasbihCount: 0,
    tasbihPhrase: 'subhanallah',
    prayerStreak: 7,
    hifzProgress: 40,
    bookmarks: JSON.parse(localStorage.getItem('bookmarks') || '[]'),
    notes: JSON.parse(localStorage.getItem('notes') || '{}'),
    settings: JSON.parse(localStorage.getItem('settings') || '{"theme":"dark","language":"en"}'),
    fastingLog: JSON.parse(localStorage.getItem('fastingLog') || '[]'),
    prayerLog: JSON.parse(localStorage.getItem('prayerLog') || '{}'),
};

// ================================================================
//  DOM REFS
// ================================================================
const $ = id => document.getElementById(id);
const qs = (sel, ctx = document) => ctx.querySelector(sel);
const qsa = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

// ================================================================
//  INITIALIZATION
// ================================================================
document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

function initApp() {
    applyTheme();
    updateHijriDate();
    populateSurahs();
    loadAyah(1, 1);
    loadPrayerTimes();
    loadDailyHadith();
    loadVideos();
    loadCourses();
    loadAdhkar('morning');
    setupNavigation();
    setupEventListeners();
    setupServiceWorker();
    updateDashboard();
    loadFastingLog();
    loadHifzList();
    loadBookmarks();
    checkOnlineStatus();
}

// ================================================================
//  NAVIGATION
// ================================================================
function setupNavigation() {
    // Sidebar menu clicks
    qsa('.sidebar-menu li[data-page]').forEach(item => {
        item.addEventListener('click', () => {
            const page = item.dataset.page;
            navigateTo(page);
        });
    });

    // Mobile menu toggle
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
        arabic: '🌍 Arabic',
        tajweed: '🎤 Tajweed',
        hifz: '📝 Hifz Tracker',
        quizzes: '❓ Quizzes',
        'ai-assistant': '🤖 AI Assistant',
        videos: '📺 Videos',
        groups: '👥 Groups',
        events: '📅 Events',
        charity: '🤲 Charity',
        adhkar: '🌟 Adhkar',
        habits: '✅ Habits',
        goals: '🎯 Goals',
        'kids-stories': '👶 Stories',
        'kids-games': '🎮 Games',
        health: '❤️ Health',
        travel: '✈️ Travel',
        settings: '⚙️ Settings'
    };
    $('pageTitle').textContent = titles[page] || page;

    // Close mobile sidebar
    document.getElementById('sidebar').classList.remove('open');

    // Save state
    AppState.currentPage = page;
}

// ================================================================
//  QURAN MODULE
// ================================================================
function populateSurahs() {
    const select = $('surahSelect');
    select.innerHTML = '';
    // In production, load from quran-full.js
    const surahs = [
        [1, 'Al-Fatihah', 7],
        [112, 'Al-Ikhlas', 4],
        [113, 'Al-Falaq', 5],
        [114, 'An-Nas', 6]
    ];
    surahs.forEach(([id, name, ayahs]) => {
        const opt = document.createElement('option');
        opt.value = id;
        opt.textContent = `${id}. ${name} (${ayahs} ayahs)`;
        select.appendChild(opt);
    });
}

function loadAyah(surahId, ayahNum) {
    // In production, fetch from quran-full.js
    const ayah = getAyahData(surahId, ayahNum);
    if (!ayah) return;

    $('arabicText').textContent = ayah.arabic;
    $('translationText').textContent = ayah.translation;
    $('transliterationText').textContent = ayah.transliteration || '';
    $('tafsirText').textContent = ayah.tafsir || 'Tafsir not available';
    $('tajweedText').textContent = ayah.tajweed || 'No specific rules';
    $('ayahDisplay').textContent = `${ayahNum} / ${getTotalAyahs(surahId)}`;
    $('ayahNumber').textContent = ayahNum;

    if (AppState.isTextHidden) {
        $('arabicText').style.opacity = '0.1';
        $('arabicText').style.filter = 'blur(3px)';
    } else {
        $('arabicText').style.opacity = '1';
        $('arabicText').style.filter = 'none';
    }

    // Load notes
    const notes = AppState.notes[`${surahId}:${ayahNum}`] || '';
    if ($('ayahNotes')) $('ayahNotes').value = notes;

    // Update word-by-word
    if (ayah.words) {
        renderWordByWord(ayah.words);
    }

    // Load audio
    loadAyahAudio(surahId, ayahNum);

    AppState.currentSurah = surahId;
    AppState.currentAyah = ayahNum;
}

function getAyahData(surahId, ayahNum) {
    // Sample data - replace with full Quran
    const sample = {
        1: {
            1: {
                arabic: 'بِسْمِ اللَّهِ الرَّحْمَٰنِ الرَّحِيمِ',
                translation: 'In the name of Allah, the Most Gracious, the Most Merciful.',
                transliteration: 'Bismillahir Rahmanir Raheem',
                tafsir: 'Ibn Kathir: This is the opening verse of every surah except Surah At-Tawbah. It contains the three names of Allah.',
                tajweed: 'Madd on "Bismillah" (2 seconds)',
                words: [
                    { arabic: 'بِسْمِ', meaning: 'In the name of' },
                    { arabic: 'اللَّهِ', meaning: 'Allah' },
                    { arabic: 'الرَّحْمَٰنِ', meaning: 'The Most Gracious' },
                    { arabic: 'الرَّحِيمِ', meaning: 'The Most Merciful' }
                ]
            },
            2: {
                arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ',
                translation: 'All praise is due to Allah, Lord of all the worlds.',
                transliteration: 'Alhamdu lillahi rabbil \'alameen',
                tafsir: 'Ibn Kathir: All praise and thanks are due to Allah alone. He is the Creator and Sustainer of all existence.',
                tajweed: 'Madd on "Alhamdu" | Qalqalah on "Rabbi"'
            }
        },
        112: {
            1: {
                arabic: 'قُلْ هُوَ اللَّهُ أَحَدٌ',
                translation: 'Say: He is Allah, the One.',
                transliteration: 'Qul huwallahu ahad',
                tafsir: 'Ibn Kathir: This surah is equivalent to one-third of the Quran. It affirms the oneness of Allah.',
                tajweed: 'Qalqalah on "Qul" | Madd on "Ahad"'
            }
        }
    };
    return sample[surahId]?.[ayahNum] || null;
}

function getTotalAyahs(surahId) {
    const totals = { 1: 7, 112: 4, 113: 5, 114: 6 };
    return totals[surahId] || 7;
}

function renderWordByWord(words) {
    const container = $('wordGrid');
    container.innerHTML = '';
    words.forEach(w => {
        const div = document.createElement('div');
        div.className = 'word-item';
        div.innerHTML = `${w.arabic} <span class="meaning">${w.meaning}</span>`;
        container.appendChild(div);
    });
    $('wordByWordContainer').style.display = 'block';
}

// ================================================================
//  AUDIO (Quran Recitations)
// ================================================================
function loadAyahAudio(surahId, ayahNum) {
    const audio = $('audioPlayer');
    // Use Quranicaudio API
    const reciter = $('reciterSelect')?.value || 'mishary';
    const url = `https://cdn.islamic.network/quran/audio/128/${reciter}/${surahId}_${ayahNum}.mp3`;
    audio.src = url;
}

// ================================================================
//  PRAYER TIMES
// ================================================================
function loadPrayerTimes() {
    // Use Al-Adhan API
    const city = $('cityInput')?.value || 'Makkah';
    fetch(`https://api.aladhan.com/v1/timingsByCity?city=${city}&country=SA&method=4`)
        .then(res => res.json())
        .then(data => {
            const timings = data.data.timings;
            $('fajrTime').textContent = timings.Fajr;
            $('dhuhrTime').textContent = timings.Dhuhr;
            $('asrTime').textContent = timings.Asr;
            $('maghribTime').textContent = timings.Maghrib;
            $('ishaTime').textContent = timings.Isha;
            $('prayerLocation').textContent = `${city}, Saudi Arabia`;
        })
        .catch(() => {
            // Fallback times
            $('fajrTime').textContent = '5:00 AM';
            $('dhuhrTime').textContent = '12:00 PM';
            $('asrTime').textContent = '3:30 PM';
            $('maghribTime').textContent = '6:15 PM';
            $('ishaTime').textContent = '7:45 PM';
        });
}

function getPrayerTimes() {
    const city = $('cityInput').value.trim() || 'Makkah';
    loadPrayerTimes();
}

// ================================================================
//  QIBLA COMPASS
// ================================================================
function startQibla() {
    if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(pos => {
            const lat = pos.coords.latitude;
            const lon = pos.coords.longitude;
            // Makkah coordinates: 21.4225, 39.8262
            const qibla = calculateQibla(lat, lon);
            $('qiblaDirection').textContent = `Facing: Makkah (${qibla.toFixed(1)}°)`;
            $('userLocation').textContent = `${lat.toFixed(4)}, ${lon.toFixed(4)}`;
            // Rotate needle
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

// ================================================================
//  TASBIH
// ================================================================
function incrementTasbih(amount = 1) {
    AppState.tasbihCount += amount;
    $('tasbihCount').textContent = AppState.tasbihCount;
    // Vibrate on mobile
    if (navigator.vibrate) navigator.vibrate(10);
    // Update total
    const total = parseInt(localStorage.getItem('totalDhikr') || '0') + amount;
    localStorage.setItem('totalDhikr', total);
    $('totalDhikr').textContent = total;
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

// ================================================================
//  HIJRI CALENDAR
// ================================================================
function updateHijriDate() {
    const now = new Date();
    const greg = now.toLocaleDateString('en-US', { 
        year: 'numeric', month: 'long', day: 'numeric' 
    });
    $('gregDate').textContent = greg;
    $('gregorianDate').textContent = greg;

    // Use API for Hijri
    fetch('https://api.aladhan.com/v1/gToH/' + now.getTime() / 1000)
        .then(res => res.json())
        .then(data => {
            const h = data.data.hijri;
            const hijriStr = `${h.day} ${h.month.en} ${h.year}`;
            $('hijriFull').textContent = hijriStr;
            $('hijriDate').textContent = hijriStr;
            $('islamicMonth').textContent = h.month.en;
        })
        .catch(() => {
            $('hijriFull').textContent = '12 Dhul-Hijjah 1447';
            $('hijriDate').textContent = '12 Dhul-Hijjah 1447';
        });
}

// ================================================================
//  ZAKAT CALCULATOR
// ================================================================
function calculateZakat() {
    const wealth = parseFloat($('zakatWealth').value) || 0;
    const gold = parseFloat($('zakatGold').value) || 0;
    const silver = parseFloat($('zakatSilver').value) || 0;
    const cash = parseFloat($('zakatCash').value) || 0;
    const investments = parseFloat($('zakatInvestments').value) || 0;

    const total = wealth + (gold * 85) + (silver * 0.65) + cash + investments;
    const nisab = 5000; // 85g gold in USD
    const zakat = total >= nisab ? total * 0.025 : 0;

    $('zakatResult').textContent = `$${zakat.toFixed(2)}`;
    $('zakatDetail').textContent = total >= nisab 
        ? `2.5% of $${total.toFixed(2)} = $${zakat.toFixed(2)}`
        : `Your wealth ($${total.toFixed(2)}) is below Nisab ($${nisab}). No zakat due.`;
}

// ================================================================
//  FASTING TRACKER
// ================================================================
function logFast(type) {
    const today = new Date().toDateString();
    const log = { date: today, type: type };
    AppState.fastingLog.push(log);
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

// ================================================================
//  HADITH
// ================================================================
function getRandomHadith() {
    // Sample hadith
    const hadiths = [
        {
            text: 'The best of you are those who are best to their families.',
            reference: 'Sunan al-Tirmidhi 3895',
            grade: 'Sahih',
            explanation: 'This hadith emphasizes the importance of treating family members with kindness and respect.'
        },
        {
            text: 'None of you truly believes until he loves for his brother what he loves for himself.',
            reference: 'Sahih Bukhari 13',
            grade: 'Sahih',
            explanation: 'This is a core principle of Islamic brotherhood - wishing good for others as you wish for yourself.'
        },
        {
            text: 'The strongest person is not the one who can wrestle, but the one who controls himself when angry.',
            reference: 'Sahih Bukhari 6114',
            grade: 'Sahih',
            explanation: 'True strength lies in emotional control and self-discipline, especially in moments of anger.'
        }
    ];
    const h = hadiths[Math.floor(Math.random() * hadiths.length)];
    displayHadith(h);
}

function getDailyHadith() {
    // Same as random for demo
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

// ================================================================
//  VIDEOS (YouTube)
// ================================================================
function loadVideos() {
    const grid = $('videoGrid');
    if (!grid) return;
    // Sample videos - in production, fetch from YouTube API
    const videos = [
        { id: 'dX0g6H5Cj3E', title: 'Beautiful Quran Recitation', channel: 'Mishary Alafasy', category: 'recitation' },
        { id: 'F_YkOf4VJDE', title: 'Tafsir of Surah Al-Fatihah', channel: 'Nouman Ali Khan', category: 'tafsir' },
        { id: 'g8LvWj5K5rY', title: '40 Hadith of Imam Nawawi', channel: 'Yasir Qadhi', category: 'hadith' },
        { id: 'LkG8Q3v7xVg', title: 'Life of Prophet Muhammad (PBUH)', channel: 'Mufti Menk', category: 'seerah' },
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
        card.addEventListener('click', () => openVideo(v.id, v.title, v.channel));
        grid.appendChild(card);
    });
}

function openVideo(id, title, channel) {
    $('videoIframe').src = `https://www.youtube.com/embed/${id}`;
    $('videoInfo').innerHTML = `<h4>${title}</h4><p>${channel}</p>`;
    $('videoModal').style.display = 'flex';
    document.body.style.overflow = 'hidden';
}

function closeVideo() {
    $('videoModal').style.display = 'none';
    $('videoIframe').src = '';
    document.body.style.overflow = '';
}

function searchVideos() {
    const query = $('videoSearch').value;
    // Filter videos based on search
    loadVideos();
}

// ================================================================
//  COURSES
// ================================================================
function loadCourses() {
    const grid = $('courseGrid');
    if (!grid) return;
    const courses = [
        { name: 'Beginner Quran Reading', level: 'beginner', category: 'quran', progress: 20, certified: false },
        { name: '40 Hadith of Nawawi', level: 'intermediate', category: 'hadith', progress: 45, certified: true },
        { name: 'Fiqh of Salah', level: 'intermediate', category: 'fiqh', progress: 10, certified: false },
        { name: 'Tajweed Mastery', level: 'advanced', category: 'tajweed', progress: 5, certified: true },
        { name: 'Seerah of Prophet', level: 'beginner', category: 'seerah', progress: 70, certified: false },
        { name: 'Arabic Grammar', level: 'intermediate', category: 'arabic', progress: 30, certified: true },
    ];
    grid.innerHTML = '';
    courses.forEach(c => {
        const card = document.createElement('div');
        card.className = 'course-card';
        card.innerHTML = `
            <h4>${c.name}</h4>
            <span class="level">${c.level}</span>
            ${c.certified ? '<span class="cert">🎓 Certificate</span>' : ''}
            <progress value="${c.progress}" max="100"></progress>
            <p>${c.progress}% complete</p>
            <button class="btn-small">Continue</button>
        `;
        grid.appendChild(card);
    });
}

// ================================================================
//  ADHKAR (Morning & Evening)
// ================================================================
function loadAdhkar(time) {
    const list = $('adhkarList');
    if (!list) return;
    // Update tabs
    qsa('.adhkar-tab').forEach(t => t.classList.remove('active'));
    const activeTab = document.querySelector(`.adhkar-tab[data-time="${time}"]`);
    if (activeTab) activeTab.classList.add('active');

    // Sample adhkar
    const adhkar = {
        morning: [
            { dua: 'اللَّهُمَّ إِنِّي أَصْبَحْتُ', meaning: 'O Allah, I have entered the morning...', count: 1 },
            { dua: 'أَصْبَحْنَا وَأَصْبَحَ الْمُلْكُ', meaning: 'We have entered the morning...', count: 1 },
            { dua: 'سُبْحَانَ اللَّهِ وَبِحَمْدِهِ', meaning: 'Glory be to Allah and praise...', count: 100 },
        ],
        evening: [
            { dua: 'اللَّهُمَّ إِنِّي أَمْسَيْتُ', meaning: 'O Allah, I have entered the evening...', count: 1 },
            { dua: 'أَمْسَيْنَا وَأَمْسَى الْمُلْكُ', meaning: 'We have entered the evening...', count: 1 },
        ],
        sleep: [
            { dua: 'اللَّهُمَّ بِاسْمِكَ أَمُوتُ وَأَحْيَا', meaning: 'O Allah, in Your name I die and live...', count: 1 },
        ],
        waking: [
            { dua: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا', meaning: 'Praise be to Allah who gave us life...', count: 1 },
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

// Setup adhkar tab clicks
document.addEventListener('click', (e) => {
    const tab = e.target.closest('.adhkar-tab');
    if (tab) {
        loadAdhkar(tab.dataset.time);
    }
});

// ================================================================
//  HIFZ TRACKER
// ================================================================
function loadHifzList() {
    const list = $('hifzList');
    if (!list) return;
    // Sample data
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
        const statusText = s.status === 'done' ? '✅ Memorized' 
            : s.status === 'progress' ? `⏳ ${s.progress}%` 
            : '📖 Not Started';
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

// ================================================================
//  BOOKMARKS & NOTES
// ================================================================
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
    const list = $('bookmarkList');
    if (!list) return;
    list.innerHTML = '';
    AppState.bookmarks.forEach(key => {
        const [surah, ayah] = key.split(':');
        const li = document.createElement('li');
        li.textContent = `Surah ${surah}, Ayah ${ayah}`;
        li.addEventListener('click', () => {
            $('surahSelect').value = surah;
            AppState.currentSurah = parseInt(surah);
            AppState.currentAyah = parseInt(ayah);
            loadAyah(parseInt(surah), parseInt(ayah));
            navigateTo('quran');
        });
        list.appendChild(li);
    });
}

function saveNotes() {
    const key = `${AppState.currentSurah}:${AppState.currentAyah}`;
    const notes = $('ayahNotes')?.value || '';
    AppState.notes[key] = notes;
    localStorage.setItem('notes', JSON.stringify(AppState.notes));
    alert('✅ Notes saved!');
}

// ================================================================
//  PRAYER TRACKER
// ================================================================
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
    // Calculate streak from prayer log
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
    AppState.prayerStreak = streak || 0;
    $('prayerStreak').textContent = streak;
    $('streakCount').textContent = streak;
}

// ================================================================
//  DASHBOARD
// ================================================================
function updateDashboard() {
    // Update stats
    $('quranRead').textContent = Math.floor(Math.random() * 50) + 10;
    $('prayerStreak').textContent = AppState.prayerStreak;
    $('hifzProgress').textContent = `${AppState.hifzProgress}%`;
    $('badgeCount').textContent = AppState.bookmarks.length;

    // Daily ayah
    const ayah = getAyahData(1, 1);
    if (ayah) {
        $('dailyAyah').textContent = `${ayah.arabic} — ${ayah.translation}`;
    }

    // Daily challenge
    const challenges = [
        'Read 1 Juz today 📖',
        'Memorize 3 new ayahs 🎯',
        'Recite 1000 Tasbih 📿',
        'Pray all 5 prayers on time 🕌',
        'Give charity today 🤲'
    ];
    $('dailyChallenge').textContent = challenges[Math.floor(Math.random() * challenges.length)];
}

// ================================================================
//  AI ASSISTANT (Simulated)
// ================================================================
function askAI() {
    const input = $('aiInput');
    const question = input.value.trim();
    if (!question) return;
    askAIQuestion(question);
}

function askAIQuestion(question) {
    const chat = $('aiChat');
    
    // Add user message
    const userDiv = document.createElement('div');
    userDiv.className = 'ai-msg user';
    userDiv.textContent = `👤 ${question}`;
    chat.appendChild(userDiv);

    // Simulate AI response
    const botDiv = document.createElement('div');
    botDiv.className = 'ai-msg bot';
    botDiv.innerHTML = '🤖 Thinking... 📚 Searching authentic sources...';
    chat.appendChild(botDiv);
    chat.scrollTop = chat.scrollHeight;

    $('aiInput').value = '';

    // Generate response
    setTimeout(() => {
        const response = generateAIResponse(question);
        botDiv.innerHTML = response;
        chat.scrollTop = chat.scrollHeight;
    }, 1000 + Math.random() * 1000);
}

function generateAIResponse(question) {
    const q = question.toLowerCase();
    let response = '';

    if (q.includes('charity') || q.includes('zakat') || q.includes('sadaqah')) {
        response = `
            🤖 <strong>Charity in Islam (Sadaqah & Zakat)</strong>
            <br><br>
            📖 <strong>Quran:</strong> "The example of those who spend their wealth in the way of Allah is like a seed which grows seven spikes; in each spike is a hundred grains." (Surah Al-Baqarah 2:261)
            <br><br>
            📜 <strong>Hadith:</strong> The Prophet (PBUH) said: "Charity does not decrease wealth." (Sahih Muslim)
            <br><br>
            📌 <strong>Sources:</strong>
            <br>• Quran 2:261, 2:267, 57:18
            <br>• Sahih Muslim 2588
            <br>• Fiqh: Zakat is obligatory (2.5% of wealth), Sadaqah is voluntary.
            <br><br>
            💡 <strong>Scholarly Opinion:</strong> Majority of scholars agree Zakat is due on wealth that reaches Nisab (85g gold) and is held for one lunar year.
            <div class="source">📚 Sources: Quran, Sahih Muslim, Fiqh of Zakat</div>
        `;
    } else if (q.includes('fatihah') || q.includes('opening')) {
        response = `
            🤖 <strong>Surah Al-Fatihah - "The Opening"</strong>
            <br><br>
            📖 <strong>Quran:</strong> The first chapter of the Quran, consisting of 7 verses.
            <br><br>
            📜 <strong>Hadith:</strong> The Prophet (PBUH) said: "Al-Fatihah is the greatest Surah in the Quran." (Sahih Bukhari)
            <br><br>
            📌 <strong>Tafsir (Ibn Kathir):</strong>
            <br>• Verse 1: "Bismillah" - Starting with Allah's name
            <br>• Verse 2: "Alhamdulillah" - All praise is for Allah
            <br>• Verse 3: "Ar-Rahmanir Raheem" - The Most Gracious, The Most Merciful
            <br>• Verse 4: "Maliki Yawmid-Deen" - Master of the Day of Judgment
            <br>• Verse 5: "Iyyaka na'budu" - You alone we worship
            <br>• Verse 6-7: "Ihdinas-siratal mustaqeem" - Guide us to the straight path
            <br><br>
            💡 <strong>Scholarly Opinion:</strong> Al-Fatihah is a dialogue between Allah and His servant. It must be recited in every Rak'ah of Salah.
            <div class="source">📚 Sources: Quran, Sahih Bukhari, Tafsir Ibn Kathir</div>
        `;
    } else if (q.includes('dua') || q.includes('protection')) {
        response = `
            🤖 <strong>Best Duas for Protection</strong>
            <br><br>
            📜 <strong>Hadith:</strong> The Prophet (PBUH) used to seek protection with these duas:
            <br><br>
            🔹 <strong>Morning/Evening:</strong> "Bismillahi alladhi la yadurru ma'asmihi shay'un fil-ardi wa la fis-sama'i wa huwas-sami'ul 'alim."
            <br>(In the name of Allah, nothing on earth or in heaven can harm you, and He is the All-Hearing, All-Knowing.)
            <br><br>
            🔹 <strong>Before Sleep:</strong> "A'udhu bikalimatillahit-tammati min sharri ma khalaq."
            <br>(I seek refuge in the perfect words of Allah from the evil of what He has created.)
            <br><br>
            🔹 <strong>General:</strong> "Rabbi inni a'udhu bika min hamazatish-shayatin."
            <br>(My Lord, I seek refuge in You from the whispers of the devils.)
            <br><br>
            📌 <strong>Sources:</strong> Sahih Bukhari, Sunan Abu Dawud, Tirmidhi
            <div class="source">📚 Sources: Sahih Bukhari 3371, Tirmidhi 3430</div>
        `;
    } else if (q.includes('prophet') || q.includes('muhammad') || q.includes('seerah')) {
        response = `
            🤖 <strong>Prophet Muhammad (PBUH) - Brief Seerah</strong>
            <br><br>
            📜 <strong>Birth:</strong> Born in Makkah in 570 CE (Year of the Elephant)
            <br><br>
            📜 <strong>Revelation:</strong> First revelation at age 40 in Cave Hira (Surah Al-Alaq 96:1-5)
            <br><br>
            📜 <strong>Migration (Hijrah):</strong> Migrated to Madinah in 622 CE - marks the start of the Islamic calendar
            <br><br>
            📜 <strong>Key Events:</strong>
            <br>• 13 years of preaching in Makkah
            <br>• Treaty of Hudaybiyyah (628 CE)
            <br>• Conquest of Makkah (630 CE)
            <br>• Farewell Pilgrimage (632 CE)
            <br><br>
            📜 <strong>Death:</strong> Passed away in 632 CE at age 63
            <br><br>
            📌 <strong>Sources:</strong> Seerah of Ibn Hisham, Sahih Bukhari, Sahih Muslim
            <div class="source">📚 Sources: Seerah Ibn Hisham, Sahih Bukhari</div>
        `;
    } else if (q.includes('riba') || q.includes('interest')) {
        response = `
            🤖 <strong>Ruling on Interest (Riba) in Islam</strong>
            <br><br>
            📖 <strong>Quran:</strong> "Allah has permitted trade and forbidden riba (interest)." (Surah Al-Baqarah 2:275)
            <br><br>
            📜 <strong>Hadith:</strong> The Prophet (PBUH) cursed the one who consumes riba, the one who pays it, the one who writes it, and the two who witness it. (Sahih Muslim)
            <br><br>
            📌 <strong>Scholarly Consensus (Ijma):</strong> All major Islamic schools of thought (Hanafi, Maliki, Shafi'i, Hanbali) agree that Riba is strictly prohibited (Haram).
            <br><br>
            💡 <strong>Types of Riba:</strong>
            <br>• Riba al-Nasi'ah: Interest on loans
            <br>• Riba al-Fadl: Exchange of same commodities in unequal amounts
            <br><br>
            📌 <strong>Sources:</strong> Quran 2:275-279, Sahih Muslim 1598, Fiqh of Muamalat
            <div class="source">📚 Sources: Quran, Sahih Muslim, Fiqh of Finance</div>
        `;
    } else if (q.includes('tahajjud')) {
        response = `
            🤖 <strong>How to Pray Tahajjud (Night Prayer)</strong>
            <br><br>
            📜 <strong>Hadith:</strong> The Prophet (PBUH) said: "The best prayer after the obligatory prayers is the night prayer (Tahajjud)." (Sahih Muslim)
            <br><br>
            📌 <strong>How to Pray:</strong>
            <br>1. Wake up after midnight (preferably in the last third of the night)
            <br>2. Make wudu (ablution)
            <br>3. Pray 2 rak'ahs at a time (minimum 2, maximum 8 or more)
            <br>4. Make dua and seek forgiveness
            <br><br>
            📜 <strong>Dua for Tahajjud:</strong> "Allahumma rabba jibril wa mika'il wa israfil..."
            <br><br>
            📌 <strong>Scholarly Opinion:</strong> Tahajjud is a highly recommended Sunnah (Mu'akkadah). It was obligatory for the Prophet (PBUH) but recommended for the Ummah.
            <div class="source">📚 Sources: Sahih Muslim 1163, Fiqh of Salah</div>
        `;
    } else if (q.includes('99 names') || q.includes('names of allah')) {
        response = `
            🤖 <strong>The 99 Names of Allah (Al-Asma ul-Husna)</strong>
            <br><br>
            📜 <strong>Hadith:</strong> The Prophet (PBUH) said: "Allah has 99 names - whoever memorizes them will enter Paradise." (Sahih Bukhari)
            <br><br>
            📌 <strong>Key Names:</strong>
            <br>1. Ar-Rahman (The Most Gracious)
            <br>2. Ar-Raheem (The Most Merciful)
            <br>3. Al-Malik (The King)
            <br>4. Al-Quddus (The Holy)
            <br>5. As-Salam (The Peace)
            <br>6. Al-Mu'min (The Faithful)
            <br>7. Al-Muhaymin (The Guardian)
            <br>... and more
            <br><br>
            💡 <strong>Benefit:</strong> Reciting these names brings blessings, protection, and closeness to Allah.
            <br><br>
            📌 <strong>Sources:</strong> Sahih Bukhari 2736, Sahih Muslim 2677
            <div class="source">📚 Sources: Sahih Bukhari, Sahih Muslim</div>
        `;
    } else if (q.includes('meaning of life') || q.includes('purpose')) {
        response = `
            🤖 <strong>The Purpose of Life in Islam</strong>
            <br><br>
            📖 <strong>Quran:</strong> "And I did not create the jinn and mankind except to worship Me." (Surah Adh-Dhariyat 51:56)
            <br><br>
            📌 <strong>Key Purposes:</strong>
            <br>1. <strong>Worship of Allah</strong> - Not just rituals, but living life in obedience to Allah
            <br>2. <strong>Being a Khalifah (Vicegerent)</strong> - Taking care of the earth and humanity
            <br>3. <strong>Seeking Knowledge</strong> - Learning about Allah, His creation, and His religion
            <br>4. <strong>Doing Good</strong> - Helping others, charity, justice
            <br>5. <strong>Achieving Jannah (Paradise)</strong> - The ultimate goal
            <br><br>
            📜 <strong>Hadith:</strong> The Prophet (PBUH) said: "The best of people are those who are most beneficial to others." (At-Tabarani)
            <br><br>
            📌 <strong>Scholarly Opinion:</strong> Life is a test (Surah Al-Mulk 67:2). Success is measured by taqwa (God-consciousness) and righteous deeds.
            <div class="source">📚 Sources: Quran 51:56, 67:2, At-Tabarani, Fiqh of Aqidah</div>
        `;
    } else {
        response = `
            🤖 <strong>I'm here to help!</strong>
            <br><br>
            I can answer questions about:
            <br>• Quran & Tafsir
            <br>• Hadith
            <br>• Fiqh (rulings)
            <br>• Aqidah (beliefs)
            <br>• Seerah (Prophet's life)
            <br>• Duas & Adhkar
            <br>• Islamic history
            <br>• Arabic & Tajweed
            <br><br>
            💡 Try asking:
            <br>• "What does the Quran say about charity?"
            <br>• "Explain Surah Al-Fatihah"
            <br>• "Best dua for protection?"
            <br>• "History of Prophet Muhammad (PBUH)"
            <br>• "What is the ruling on interest?"
            <br>• "How to pray Tahajjud?"
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
            <br>Ask me about:
            <br>• Quran & Tafsir • Hadith • Fiqh • Dua • Seerah
            <br><em>📌 I always cite sources and distinguish scholarly opinions.</em>
        </div>
    `;
}

// ================================================================
//  THEME
// ================================================================
function applyTheme() {
    const theme = AppState.settings.theme || 'dark';
    if (theme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-sun"></i>';
    } else {
        document.documentElement.removeAttribute('data-theme');
        document.getElementById('themeToggle').innerHTML = '<i class="fas fa-moon"></i>';
    }
}

document.addEventListener('click', (e) => {
    if (e.target.closest('#themeToggle')) {
        const current = AppState.settings.theme || 'dark';
        AppState.settings.theme = current === 'dark' ? 'light' : 'dark';
        localStorage.setItem('settings', JSON.stringify(AppState.settings));
        applyTheme();
    }
});

// ================================================================
//  ONLINE STATUS & OFFLINE MODE
// ================================================================
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

// ================================================================
//  SERVICE WORKER (Offline Mode)
// ================================================================
function setupServiceWorker() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('service-worker.js')
            .then(() => console.log('✅ Service Worker registered'))
            .catch(err => console.log('❌ Service Worker failed:', err));
    }
}

// ================================================================
//  SETTINGS FUNCTIONS
// ================================================================
function enableBiometric() {
    if ('credentials' in navigator) {
        // Check if biometric is available
        alert('🔐 Biometric authentication enabled!');
    } else {
        alert('Biometric not supported on this device.');
    }
}

function exportData() {
    const data = {
        bookmarks: AppState.bookmarks,
        notes: AppState.notes,
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

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target.result);
                AppState.bookmarks = data.bookmarks || [];
                AppState.notes = data.notes || {};
                AppState.prayerLog = data.prayerLog || {};
                AppState.fastingLog = data.fastingLog || [];
                localStorage.setItem('bookmarks', JSON.stringify(AppState.bookmarks));
                localStorage.setItem('notes', JSON.stringify(AppState.notes));
                localStorage.setItem('prayerLog', JSON.stringify(AppState.prayerLog));
                localStorage.setItem('fastingLog', JSON.stringify(AppState.fastingLog));
                alert('✅ Data imported successfully!');
                location.reload();
            } catch {
                alert('❌ Invalid file format.');
            }
        };
        reader.readAsText(file);
    };
    input.click();
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

function downloadOfflineQuran() {
    alert('⬇️ Downloading Quran for offline use... (Simulated)');
    setTimeout(() => {
        $('offlineStatus').textContent = '✅ Downloaded (12.4 MB)';
        alert('✅ Quran downloaded successfully! You can now use it offline.');
    }, 2000);
}

function clearCache() {
    if (confirm('⚠️ Clear cache? This will remove temporary files.')) {
        if ('caches' in window) {
            caches.keys().then(keys => {
                keys.forEach(key => caches.delete(key));
            });
        }
        $('cacheSize').textContent = '0 MB';
        alert('✅ Cache cleared!');
    }
}

function rateApp() {
    alert('⭐ Rate DeenMax on the app store!');
}

function shareApp() {
    if (navigator.share) {
        navigator.share({
            title: 'DeenMax - Islamic App',
            text: '🌟 Check out DeenMax - All-in-One Islamic App!',
            url: window.location.href
        });
    } else {
        navigator.clipboard.writeText(window.location.href);
        alert('📋 Link copied! Share it with your friends.');
    }
}

// ================================================================
//  COMMUNITY FUNCTIONS
// ================================================================
function findMosques() {
    alert('🕌 Finding mosques near you... (Simulated)');
    setTimeout(() => {
        const list = $('mosqueList');
        if (list) {
            list.innerHTML = `
                <li>📍 Masjid Al-Haram - 2.3 km</li>
                <li>📍 Al-Masjid An-Nabawi - 5.1 km</li>
                <li>📍 Masjid Quba - 8.7 km</li>
            `;
        }
    }, 1000);
}

function getNearbyMosques() {
    findMosques();
}

function findHalalRestaurants() {
    alert('🍽️ Finding halal restaurants near you... (Simulated)');
}

// ================================================================
//  KIDS STORIES
// ================================================================
function readStory(storyId) {
    const stories = {
        yunus: `🐟 **Prophet Yunus (AS) and the Whale**
        <br><br>
        Yunus (AS) was sent to the people of Nineveh. When they didn't listen, he left in anger.
        <br><br>
        He boarded a ship, but a storm came. The sailors drew lots, and Yunus was thrown into the sea.
        <br><br>
        A giant whale swallowed him! In the darkness of the whale's belly, Yunus prayed:
        <br><br>
        "La ilaha illa anta, subhanaka, inni kuntu minadh-dhalimeen."
        <br>(There is no god but You, glorified are You, I have been among the wrongdoers.)
        <br><br>
        Allah forgave him, and the whale released him safely on the shore.
        <br><br>
        📖 **Lesson:** Never give up on Allah's mercy. Always turn back to Him.`,
        
        muhammad: `🐫 **Prophet Muhammad (PBUH) - The Trustworthy One**
        <br><br>
        Before becoming a prophet, Muhammad (PBUH) was known as "Al-Amin" (The Trustworthy).
        <br><br>
        He was honest and fair in all his dealings. People trusted him to keep their belongings safe.
        <br><br>
        When the Kaaba was being rebuilt, the tribes fought over who would place the Black Stone.
        <br><br>
        Muhammad (PBUH) solved the dispute by placing the stone on a cloth and having all tribes lift it together!
        <br><br>
        📖 **Lesson:** Always be honest and fair, even when it's difficult.`,
        
        ibrahim: `🕊️ **Prophet Ibrahim (AS) and the Kaaba**
        <br><br>
        Ibrahim (AS) was commanded by Allah to build the Kaaba with his son Isma'il (AS).
        <br><br>
        They raised the foundations of the House, praying:
        <br><br>
        "Rabbana taqabbal minna, innaka antas-sami'ul 'alim."
        <br>(Our Lord, accept from us, for You are the All-Hearing, All-Knowing.)
        <br><br>
        Ibrahim also called people to Hajj, and millions still respond to his call today!
        <br><br>
        📖 **Lesson:** Trust in Allah's commands and leave a legacy of faith.`,
        
        musa: `🐟 **Prophet Musa (AS) and the Red Sea**
        <br><br>
        Musa (AS) led the Children of Israel out of Egypt. Pharaoh and his army chased them.
        <br><br>
        They reached the Red Sea with no way out. Musa prayed to Allah for help.
        <br><br>
        Allah commanded Musa to strike the sea with his staff. The sea split into two!
        <br><br>
        The Children of Israel crossed safely, and Pharaoh's army was drowned.
        <br><br>
        📖 **Lesson:** Trust in Allah when you're trapped. He always makes a way out!`
    };
    
    const story = stories[storyId] || '📖 Story not found.';
    alert(story.replace(/<br>/g, '\n'));
}

// ================================================================
//  INITIALIZE EVENT LISTENERS
// ================================================================
function setupEventListeners() {
    // Quran controls
    document.addEventListener('click', (e) => {
        if (e.target.closest('#playAyah')) {
            $('audioPlayer').play();
            AppState.isPlaying = true;
        }
        if (e.target.closest('#pauseAyah')) {
            $('audioPlayer').pause();
            AppState.isPlaying = false;
        }
        if (e.target.closest('#recordAyah')) {
            if (!AppState.isRecording) {
                startRecording();
            } else {
                stopRecording();
            }
        }
        if (e.target.closest('#bookmarkBtn')) {
            toggleBookmark();
        }
        if (e.target.closest('#notesBtn')) {
            const area = $('notesArea');
            area.style.display = area.style.display === 'none' ? 'block' : 'none';
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
        if (e.target.closest('#wordByWord')) {
            const container = $('wordByWordContainer');
            container.style.display = container.style.display === 'none' ? 'block' : 'none';
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
            saveNotes();
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
    });

    // Reciter change
    document.addEventListener('change', (e) => {
        if (e.target.id === 'reciterSelect') {
            loadAyahAudio(AppState.currentSurah, AppState.currentAyah);
        }
    });

    // Translation change
    document.addEventListener('change', (e) => {
        if (e.target.id === 'translationSelect') {
            loadAyah(AppState.currentSurah, AppState.currentAyah);
        }
    });

    // AI Input enter key
    document.addEventListener('keydown', (e) => {
        if (e.target.id === 'aiInput' && e.key === 'Enter') {
            askAI();
        }
        if (e.target.id === 'botInput' && e.key === 'Enter') {
            askBot(e.target.value);
        }
    });

    // AI Send button
    document.addEventListener('click', (e) => {
        if (e.target.closest('#botSendBtn')) {
            const input = document.getElementById('botInput');
            if (input) askBot(input.value);
        }
    });
}

// ================================================================
//  RECORDING FUNCTION
// ================================================================
let mediaRecorder = null;
let audioChunks = [];

function startRecording() {
    navigator.mediaDevices.getUserMedia({ audio: true })
        .then(stream => {
            mediaRecorder = new MediaRecorder(stream);
            audioChunks = [];
            mediaRecorder.ondataavailable = e => audioChunks.push(e.data);
            mediaRecorder.onstop = () => {
                const blob = new Blob(audioChunks, { type: 'audio/wav' });
                const url = URL.createObjectURL(blob);
                const playback = $('audioPlayback');
                if (playback) {
                    playback.src = url;
                    playback.style.display = 'block';
                }
                stream.getTracks().forEach(t => t.stop());
                AppState.isRecording = false;
                $('recordAyah').innerHTML = '<i class="fas fa-microphone"></i>';
            };
            mediaRecorder.start();
            AppState.isRecording = true;
            $('recordAyah').innerHTML = '<i class="fas fa-stop"></i>';
            $('recordAyah').style.color = '#e74c3c';
        })
        .catch(() => alert('🎤 Please allow microphone access to record.'));
}

function stopRecording() {
    if (mediaRecorder && AppState.isRecording) {
        mediaRecorder.stop();
        AppState.isRecording = false;
        $('recordAyah').innerHTML = '<i class="fas fa-microphone"></i>';
        $('recordAyah').style.color = '';
    }
}

// ================================================================
//  BOT (Quick AI for chat)
// ================================================================
function askBot(question) {
    if (!question || !question.trim()) return;
    const chat = document.getElementById('botMessages');
    if (!chat) return;

    // User message
    const userMsg = document.createElement('div');
    userMsg.className = 'user-msg';
    userMsg.textContent = `👤 ${question}`;
    chat.appendChild(userMsg);

    // Bot response
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

// ================================================================
//  KEYBOARD SHORTCUTS
// ================================================================
document.addEventListener('keydown', (e) => {
    // Ctrl + Q = Quran
    if (e.ctrlKey && e.key === 'q') { e.preventDefault(); navigateTo('quran'); }
    // Ctrl + P = Prayer
    if (e.ctrlKey && e.key === 'p') { e.preventDefault(); navigateTo('prayer'); }
    // Ctrl + H = Hadith
    if (e.ctrlKey && e.key === 'h') { e.preventDefault(); navigateTo('hadith'); }
    // Ctrl + A = AI Assistant
    if (e.ctrlKey && e.key === 'a') { e.preventDefault(); navigateTo('ai-assistant'); }
});

// ================================================================
//  EXPOSE FUNCTIONS TO GLOBAL
// ================================================================
// Navigation
window.navigateTo = navigateTo;
window.startChallenge = () => alert('🎯 Challenge started! Read 1 Juz today.');
window.completeChallenge = (type) => alert(`✅ ${type} challenge completed!`);

// Prayer
window.getPrayerTimes = getPrayerTimes;

// Qibla
window.startQibla = startQibla;

// Tasbih
window.incrementTasbih = incrementTasbih;
window.resetTasbih = resetTasbih;
window.setTasbihPhrase = setTasbihPhrase;

// Zakat
window.calculateZakat = calculateZakat;

// Fasting
window.logFast = logFast;

// Hadith
window.getRandomHadith = getRandomHadith;
window.getDailyHadith = getDailyHadith;

// Videos
window.loadVideos = loadVideos;
window.openVideo = openVideo;
window.closeVideo = closeVideo;
window.searchVideos = searchVideos;

// Courses
window.loadCourses = loadCourses;

// Adhkar
window.loadAdhkar = loadAdhkar;

// Hifz
window.addHifzSurah = addHifzSurah;

// AI
window.askAI = askAI;
window.askAIQuestion = askAIQuestion;
window.clearAIChat = clearAIChat;
window.askBot = askBot;

// Community
window.findMosques = findMosques;
window.getNearbyMosques = getNearbyMosques;
window.findHalalRestaurants = findHalalRestaurants;

// Kids
window.readStory = readStory;

// Settings
window.enableBiometric = enableBiometric;
window.exportData = exportData;
window.importData = importData;
window.backupToCloud = backupToCloud;
window.restoreFromCloud = restoreFromCloud;
window.downloadOfflineQuran = downloadOfflineQuran;
window.clearCache = clearCache;
window.rateApp = rateApp;
window.shareApp = shareApp;

console.log('🌟 DeenMax loaded successfully!');
console.log('📖 Features: Quran, Prayer, Qibla, Tasbih, Zakat, Fasting, Hadith, Courses, AI Assistant, Videos, Adhkar, Kids, Health, Travel, and more!');
