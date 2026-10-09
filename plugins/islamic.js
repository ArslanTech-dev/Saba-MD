// ===============================================
//  💚 SABA MD — ISLAMIC COMMANDS
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Royal Style · React Enabled
//  🌍 Works in Groups & DMs
//  📦 Self-contained — no API keys needed
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');
const axios = require('axios');

// ═══════════════════════════════════════════════
//  🌐 FREE APIs (no keys needed)
// ═══════════════════════════════════════════════
const API = {
    quran:        'https://api.alquran.cloud/v1',
    prayer:       'https://api.aladhan.com/v1',
    hadith:       'https://api.hadith.gading.dev',
    // Random ayah/hadith fallbacks
    quranRandom:  'https://api.alquran.cloud/v1/ayah/random',
};

// ═══════════════════════════════════════════════
//  🎨 STYLE
// ═══════════════════════════════════════════════
const TOP  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';
const MID  = '━━━━━━━━━━━━━━━━━━';
const THIN = '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄';
const BOT  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';

// ═══════════════════════════════════════════════
//  📚 99 NAMES OF ALLAH
// ═══════════════════════════════════════════════
const ALLAH_NAMES = [
    { n: 'Ar-Rahman', m: 'The Most Merciful' },
    { n: 'Ar-Raheem', m: 'The Most Compassionate' },
    { n: 'Al-Malik', m: 'The King' },
    { n: 'Al-Quddus', m: 'The Most Holy' },
    { n: 'As-Salam', m: 'The Source of Peace' },
    { n: 'Al-Mumin', m: 'The Guarantor of Faith' },
    { n: 'Al-Muhaymin', m: 'The Protector' },
    { n: 'Al-Aziz', m: 'The Almighty' },
    { n: 'Al-Jabbar', m: 'The Compeller' },
    { n: 'Al-Mutakabbir', m: 'The Supreme' },
    { n: 'Al-Khaliq', m: 'The Creator' },
    { n: 'Al-Bari', m: 'The Evolver' },
    { n: 'Al-Musawwir', m: 'The Fashioner' },
    { n: 'Al-Ghaffar', m: 'The Ever-Forgiving' },
    { n: 'Al-Qahhar', m: 'The Subduer' },
    { n: 'Al-Wahhab', m: 'The Bestower' },
    { n: 'Ar-Razzaq', m: 'The Provider' },
    { n: 'Al-Fattah', m: 'The Opener' },
    { n: 'Al-Alim', m: 'The All-Knowing' },
    { n: 'Al-Qabid', m: 'The Withholder' },
    { n: 'Al-Basit', m: 'The Extender' },
    { n: 'Al-Khafid', m: 'The Reducer' },
    { n: 'Ar-Rafi', m: 'The Exalter' },
    { n: 'Al-Muizz', m: 'The Honourer' },
    { n: 'Al-Mudhill', m: 'The Dishonourer' },
    { n: 'As-Sami', m: 'The All-Hearing' },
    { n: 'Al-Basir', m: 'The All-Seeing' },
    { n: 'Al-Hakam', m: 'The Judge' },
    { n: 'Al-Adl', m: 'The Utterly Just' },
    { n: 'Al-Latif', m: 'The Subtle One' },
    { n: 'Al-Khabir', m: 'The All-Aware' },
    { n: 'Al-Halim', m: 'The Forbearing' },
    { n: 'Al-Azim', m: 'The Magnificent' },
    { n: 'Al-Ghafur', m: 'The Great Forgiver' },
    { n: 'Ash-Shakur', m: 'The Most Appreciative' },
    { n: 'Al-Ali', m: 'The Most High' },
    { n: 'Al-Kabir', m: 'The Most Great' },
    { n: 'Al-Hafiz', m: 'The Preserver' },
    { n: 'Al-Muqit', m: 'The Sustainer' },
    { n: 'Al-Hasib', m: 'The Reckoner' },
    { n: 'Al-Jalil', m: 'The Majestic' },
    { n: 'Al-Karim', m: 'The Most Generous' },
    { n: 'Ar-Raqib', m: 'The Watchful' },
    { n: 'Al-Mujib', m: 'The Responsive' },
    { n: 'Al-Wasi', m: 'The All-Encompassing' },
    { n: 'Al-Hakim', m: 'The All-Wise' },
    { n: 'Al-Wadud', m: 'The Most Loving' },
    { n: 'Al-Majid', m: 'The Glorious' },
    { n: 'Al-Baith', m: 'The Resurrector' },
    { n: 'Ash-Shahid', m: 'The All-Witnessing' },
    { n: 'Al-Haqq', m: 'The Absolute Truth' },
    { n: 'Al-Wakil', m: 'The Trustee' },
    { n: 'Al-Qawi', m: 'The Most Strong' },
    { n: 'Al-Matin', m: 'The Firm One' },
    { n: 'Al-Wali', m: 'The Protecting Friend' },
    { n: 'Al-Hamid', m: 'The Praiseworthy' },
    { n: 'Al-Muhsi', m: 'The Accounter' },
    { n: 'Al-Mubdi', m: 'The Originator' },
    { n: 'Al-Muid', m: 'The Restorer' },
    { n: 'Al-Muhyi', m: 'The Giver of Life' },
    { n: 'Al-Mumit', m: 'The Bringer of Death' },
    { n: 'Al-Hayy', m: 'The Ever-Living' },
    { n: 'Al-Qayyum', m: 'The Self-Subsisting' },
    { n: 'Al-Wajid', m: 'The Perceiver' },
    { n: 'Al-Majid', m: 'The Illustrious' },
    { n: 'Al-Wahid', m: 'The One' },
    { n: 'Al-Ahad', m: 'The Unique' },
    { n: 'As-Samad', m: 'The Eternal' },
    { n: 'Al-Qadir', m: 'The Capable' },
    { n: 'Al-Muqtadir', m: 'The Omnipotent' },
    { n: 'Al-Muqaddim', m: 'The Expediter' },
    { n: 'Al-Muakhkhir', m: 'The Delayer' },
    { n: 'Al-Awwal', m: 'The First' },
    { n: 'Al-Akhir', m: 'The Last' },
    { n: 'Az-Zahir', m: 'The Manifest' },
    { n: 'Al-Batin', m: 'The Hidden' },
    { n: 'Al-Wali', m: 'The Governor' },
    { n: 'Al-Mutaali', m: 'The Most Exalted' },
    { n: 'Al-Barr', m: 'The Source of Goodness' },
    { n: 'At-Tawwab', m: 'The Ever-Pardoning' },
    { n: 'Al-Muntaqim', m: 'The Avenger' },
    { n: 'Al-Afuww', m: 'The Pardoner' },
    { n: 'Ar-Rauf', m: 'The Most Kind' },
    { n: 'Malik-ul-Mulk', m: 'Master of the Kingdom' },
    { n: 'Dhul-Jalali-wal-Ikram', m: 'Lord of Majesty' },
    { n: 'Al-Muqsit', m: 'The Equitable' },
    { n: 'Al-Jami', m: 'The Gatherer' },
    { n: 'Al-Ghani', m: 'The Self-Sufficient' },
    { n: 'Al-Mughni', m: 'The Enricher' },
    { n: 'Al-Mani', m: 'The Withholder' },
    { n: 'Ad-Darr', m: 'The Distresser' },
    { n: 'An-Nafi', m: 'The Benefactor' },
    { n: 'An-Nur', m: 'The Light' },
    { n: 'Al-Hadi', m: 'The Guide' },
    { n: 'Al-Badi', m: 'The Incomparable' },
    { n: 'Al-Baqi', m: 'The Everlasting' },
    { n: 'Al-Warith', m: 'The Inheritor' },
    { n: 'Ar-Rashid', m: 'The Guide to Right Path' },
    { n: 'As-Sabur', m: 'The Most Patient' },
];

// ═══════════════════════════════════════════════
//  📿 DUAS (from Quran & Sunnah)
// ═══════════════════════════════════════════════
const DUAS = [
    { title: 'Morning Dua', arabic: 'اللَّهُمَّ بِكَ أَصْبَحْنَا', english: 'O Allah, by You we enter the morning', ref: 'Tirmidhi' },
    { title: 'Evening Dua', arabic: 'اللَّهُمَّ بِكَ أَمْسَيْنَا', english: 'O Allah, by You we enter the evening', ref: 'Tirmidhi' },
    { title: 'Before Eating', arabic: 'بِسْمِ اللَّهِ', english: 'In the name of Allah', ref: 'Abu Dawud' },
    { title: 'After Eating', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا', english: 'Praise be to Allah who fed us', ref: 'Tirmidhi' },
    { title: 'Before Sleeping', arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا', english: 'In Your name, O Allah, I die and live', ref: 'Bukhari' },
    { title: 'Upon Waking', arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا', english: 'Praise be to Allah who gave us life', ref: 'Bukhari' },
    { title: 'When Traveling', arabic: 'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا', english: 'Glory to Him who has subjected this to us', ref: 'Muslim' },
    { title: 'For Forgiveness', arabic: 'رَبِّ اغْفِرْ لِي وَتُبْ عَلَيَّ', english: 'My Lord, forgive me and accept my repentance', ref: 'Tirmidhi' },
    { title: 'For Parents', arabic: 'رَبِّ ارْحَمْهُمَا كَمَا رَبَّيَانِي صَغِيرًا', english: 'My Lord, have mercy on them as they raised me', ref: 'Quran 17:24' },
    { title: 'For Anxiety', arabic: 'حَسْبُنَا اللَّهُ وَنِعْمَ الْوَكِيلُ', english: 'Allah is sufficient for us, the best Disposer of affairs', ref: 'Quran 3:173' },
];

// ═══════════════════════════════════════════════
//  📖 HADITH COLLECTION (topics)
// ═══════════════════════════════════════════════
const HADITH_TOPICS = [
    'Patience (Sabr)', 'Gratitude (Shukr)', 'Prayer (Salah)',
    'Charity (Sadaqah)', 'Family', 'Neighbors', 'Knowledge',
    'Kindness', 'Truthfulness', 'Honesty', 'Forgiveness',
];

// ═══════════════════════════════════════════════
//  🛠️ INTERNAL HELPERS
// ═══════════════════════════════════════════════
function shortText(t, max = 60) {
    if (!t) return '';
    return t.length > max ? t.slice(0, max - 3) + '...' : t;
}

async function getJson(url, params = {}, timeout = 20000) {
    const res = await axios.get(url, { params, timeout });
    return res.data;
}

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    // ═══════════════════════════════════════════
    //  📖 QURAN — Get surah/ayah
    // ═══════════════════════════════════════════
    {
        name: 'quran',
        aliases: ['quransurah', 'surah'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📖');

            const input = args.join(' ').trim();
            if (!input) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *USAGE*
${MID}
   📌 *.quran <surah:ayah>*
${THIN}
   💡 Examples:
   ├ .quran 1:1     (Al-Fatihah)
   ├ .quran 2:255   (Ayat-ul-Kursi)
   ├ .quran 18:10
   └ .quran 36:1
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            await react('⏳');

            try {
                // Parse "surah:ayah"
                const parts = input.split(':');
                const surah = parseInt(parts[0]) || 1;
                const ayah = parseInt(parts[1]) || 1;

                const data = await getJson(`${API.quran}/ayah/${surah}:${ayah}/editions/quran-uthmani,en.sahih,ur.jalandhry`);

                if (!data.data) throw new Error('Ayah not found');

                const arabic = data.data[0]?.text || '';
                const english = data.data[1]?.text || '';
                const urdu = data.data[2]?.text || '';
                const surahName = data.data[0]?.surah?.englishName || '';
                const surahArabic = data.data[0]?.surah?.name || '';
                const surahNum = data.data[0]?.surah?.number || surah;

                const caption =
`${TOP}
   📖 *QURAN*
${MID}
   🕌 *Surah* : ${surahName} (${surahArabic})
   🔢 *Ayah*  : ${surah}:${ayah}
${THIN}
   🌙 *Arabic:*
${arabic}
${THIN}
   🇬🇧 *English:*
${english}
${THIN}
   🇵🇰 *Urdu:*
${urdu}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

                await h.sendWithLogo(sock, from, caption, msg);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}
   ❌ *FAILED*
${MID}
   ${err.message.slice(0, 150)}
${THIN}
   💡 Check surah:ayah format
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📿 AYAH OF THE DAY — Random ayah
    // ═══════════════════════════════════════════
    {
        name: 'ayah',
        aliases: ['randayah', 'quranrandom'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('📿');

            try {
                const data = await getJson(`${API.quranRandom}/editions/quran-uthmani,en.sahih,ur.jalandhry`);

                if (!data.data) throw new Error('Failed to fetch');

                const arabic = data.data[0]?.text || '';
                const english = data.data[1]?.text || '';
                const urdu = data.data[2]?.text || '';
                const surahName = data.data[0]?.surah?.englishName || '';
                const surahNum = data.data[0]?.surah?.number || '';
                const ayahNum = data.data[0]?.numberInSurah || '';

                const caption =
`${TOP}
   📿 *AYAH OF THE DAY*
${MID}
   🕌 *Surah* : ${surahName}
   🔢 *Ayah*  : ${surahNum}:${ayahNum}
${THIN}
   🌙 *Arabic:*
${arabic}
${THIN}
   🇬🇧 *English:*
${english}
${THIN}
   🇵🇰 *Urdu:*
${urdu}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

                await h.sendWithLogo(sock, from, caption, msg);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🕌 PRAYER TIMES — Namaz times
    // ═══════════════════════════════════════════
    {
        name: 'prayer',
        aliases: ['namaz', 'salah', 'prayertimes'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🕌');

            const city = args.join(' ').trim() || 'Karachi';
            await react('⏳');

            try {
                // Get prayer times
                const today = new Date();
                const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

                const data = await getJson(`${API.prayer}/timingsByCity/${dateStr}`, {
                    city,
                    country: '',
                    method: 2,  // ISNA
                });

                if (!data.data?.timings) throw new Error('City not found');

                const t = data.data.timings;
                const date = data.data.date;

                const caption =
`${TOP}
   🕌 *PRAYER TIMES*
${MID}
   📍 *City* : ${city}
   📅 *Date* : ${date.readable}
   🌙 *Hijri* : ${date.hijri.date} (${date.hijri.month.en})
${THIN}
   🌅 *Fajr*     : ${t.Fajr}
   🌄 *Sunrise*  : ${t.Sunrise}
   ☀️ *Dhuhr*    : ${t.Dhuhr}
   🌤️ *Asr*      : ${t.Asr}
   🌇 *Maghrib*  : ${t.Maghrib}
   🌙 *Isha*     : ${t.Isha}
${THIN}
   ⚠️ *Note* : Times may vary
   by 1-2 mins
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

                await h.sendWithLogo(sock, from, caption, msg);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}
   ❌ *FAILED*
${MID}
   ${err.message.slice(0, 150)}
${THIN}
   💡 Try: .prayer Karachi
   Or: .prayer London
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📿 ALLAH NAMES — Random name
    // ═══════════════════════════════════════════
    {
        name: 'allahname',
        aliases: ['99names', 'asma', 'asmaulhusna'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📿');

            let idx;
            if (args[0]) {
                idx = parseInt(args[0]) - 1;
                if (idx < 0 || idx > 98) idx = Math.floor(Math.random() * 99);
            } else {
                idx = Math.floor(Math.random() * 99);
            }

            const name = ALLAH_NAMES[idx];

            await h.sendWithLogo(sock, from,
`${TOP}
   📿 *99 NAMES OF ALLAH*
${MID}
   🔢 *Number* : ${idx + 1} / 99
${THIN}
   🌙 *Arabic Name:*
${name.n}
${THIN}
   🇬🇧 *Meaning:*
${name.m}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);

            await react('✅');
        }
    },

    // ═══════════════════════════════════════════
    //  🤲 DUA — Random dua
    // ═══════════════════════════════════════════
    {
        name: 'dua',
        aliases: ['duas', 'duain'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🤲');

            const dua = DUAS[Math.floor(Math.random() * DUAS.length)];

            await h.sendWithLogo(sock, from,
`${TOP}
   🤲 *DUA*
${MID}
   📌 *Title* : ${dua.title}
${THIN}
   🌙 *Arabic:*
${dua.arabic}
${THIN}
   🇬🇧 *English:*
${dua.english}
${THIN}
   📚 *Reference* : ${dua.ref}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);

            await react('✅');
        }
    },

    // ═══════════════════════════════════════════
    //  📚 HADITH — Random hadith
    // ═══════════════════════════════════════════
    {
        name: 'hadith',
        aliases: ['hadees', 'randomhadith'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📚');

            await react('⏳');

            try {
                // Random book + number
                const books = ['bukhari', 'muslim', 'abu-daud', 'tirmidhi', 'nasai'];
                const book = books[Math.floor(Math.random() * books.length)];
                const num = Math.floor(Math.random() * 1000) + 1;

                const data = await getJson(`${API.hadith}/books/${book}?range=1-${num}`, {}, 20000);

                let hadith;
                const hadiths = data?.data?.hadiths || [];
                if (hadiths.length === 0) throw new Error('No hadith found');
                hadith = hadiths[hadiths.length - 1];

                const caption =
`${TOP}
   📚 *HADITH*
${MID}
   📖 *Book* : ${data.data.name}
   🔢 *No.*   : ${hadith.number}
${THIN}
   🌙 *Arabic:*
${shortText(hadith.arab, 300)}
${THIN}
   🇬🇧 *English:*
${shortText(hadith.id || hadith.english, 400)}
${THIN}
   📊 *Narrator* : ${data.data.name}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

                await h.sendWithLogo(sock, from, caption, msg);
                await react('✅');
            } catch (err) {
                // Fallback: static hadith
                const staticHadiths = [
                    { text: 'The best among you are those who have the best manners and character.', ref: 'Sahih Bukhari' },
                    { text: 'None of you truly believes until he loves for his brother what he loves for himself.', ref: 'Sahih Bukhari' },
                    { text: 'The strong is not the one who overcomes the people by his strength, but the one who controls himself while in anger.', ref: 'Sahih Bukhari' },
                    { text: 'Make things easy and do not make them difficult, cheer up and do not cause aversion.', ref: 'Sahih Bukhari' },
                    { text: 'Allah is beautiful and loves beauty.', ref: 'Sahih Muslim' },
                ];
                const h2 = staticHadiths[Math.floor(Math.random() * staticHadiths.length)];

                await h.sendWithLogo(sock, from,
`${TOP}
   📚 *HADITH*
${MID}
   💬 ${h2.text}
${THIN}
   📚 *Source* : ${h2.ref}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);

                await react('✅');
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🕌 HIJRI DATE — Islamic calendar
    // ═══════════════════════════════════════════
    {
        name: 'hijri',
        aliases: ['hijridate', 'islamicdate'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🕌');

            try {
                const today = new Date();
                const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

                const data = await getJson(`${API.prayer}/gToH/${dateStr}`);

                const h2 = data.data.hijri;

                await h.sendWithLogo(sock, from,
`${TOP}
   🕌 *HIJRI DATE*
${MID}
   🌙 *Hijri*  : ${h2.day} ${h2.month.en} ${h2.year} AH
   📅 *Greg.*  : ${data.data.gregorian.date}
   📆 *Weekday*: ${h2.weekday.en}
${THIN}
   ✨ *Month*  : ${h2.month.en} (${h2.month.ar})
   🌟 *Day*    : ${h2.day}
   🔢 *Year*   : ${h2.year} AH
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📖 QURAN SURAH — Full surah
    // ═══════════════════════════════════════════
    {
        name: 'surah',
        aliases: ['fullsurah', 'quransurah'],
        cooldown: 10000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📖');

            const surahNum = parseInt(args[0]);
            if (!surahNum || surahNum < 1 || surahNum > 114) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *INVALID SURAH*
${MID}
   📌 Usage: *.surah <1-114>*
${THIN}
   💡 Examples:
   ├ .surah 1    (Al-Fatihah)
   ├ .surah 112  (Al-Ikhlas)
   ├ .surah 36   (Yaseen)
   └ .surah 18   (Al-Kahf)
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            await react('⏳');

            try {
                const data = await getJson(`${API.quran}/surah/${surahNum}/editions/quran-uthmani,en.sahih`);

                if (!data.data) throw new Error('Surah not found');

                const surahData = data.data[0];
                const ayahs = surahData.ayahs;
                const englishAyahs = data.data[1].ayahs;

                let text = '';
                text += `${TOP}\n`;
                text += `   📖 *SURAH ${surahData.englishName.toUpperCase()}*\n`;
                text += `${MID}\n`;
                text += `   🕌 *Name*    : ${surahData.name}\n`;
                text += `   🌍 *English* : ${surahData.englishNameTranslation}\n`;
                text += `   🔢 *Ayahs*   : ${ayahs.length}\n`;
                text += `   📍 *Type*    : ${surahData.revelationType}\n`;
                text += `${MID}\n`;

                // Send first 5 ayahs
                const limit = Math.min(5, ayahs.length);
                for (let i = 0; i < limit; i++) {
                    text += `   *${surahNum}:${i + 1}*\n`;
                    text += `   ${ayahs[i].text}\n`;
                    text += `   _${englishAyahs[i].text}_\n`;
                    text += `${THIN}\n`;
                }

                if (ayahs.length > 5) {
                    text += `   ... (${ayahs.length - 5} more ayahs)\n`;
                }

                text += `\n${MID}\n`;
                text += `   💖 *Saba MD*\n`;
                text += `${BOT}`;

                await h.sendWithLogo(sock, from, text, msg);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🕌 NAMAZ TIMES — Prayer times (same as prayer)
    // ═══════════════════════════════════════════
    {
        name: 'namaztime',
        aliases: ['namaztime', 'salahtime'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🕌');

            const city = args.join(' ').trim() || 'Karachi';
            await react('⏳');

            try {
                const today = new Date();
                const dateStr = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;

                const data = await getJson(`${API.prayer}/timingsByCity/${dateStr}`, {
                    city,
                    country: '',
                    method: 2,
                });

                const t = data.data.timings;

                await h.sendWithLogo(sock, from,
`${TOP}
   🕌 *NAMAZ TIMES*
${MID}
   📍 *City* : ${city}
${THIN}
   🌅 Fajr    → ${t.Fajr}
   ☀️ Dhuhr   → ${t.Dhuhr}
   🌤️ Asr     → ${t.Asr}
   🌇 Maghrib → ${t.Maghrib}
   🌙 Isha    → ${t.Isha}
${MID}
   💖 *Saba MD*
${BOT}`, msg);

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📊 ISLAMIC HELP — Menu
    // ═══════════════════════════════════════════
    {
        name: 'islamic',
        aliases: ['islamicmenu', 'islamhelp'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('📊');

            await h.sendWithLogo(sock, from,
`${TOP}
   📊 *ISLAMIC MENU*
${MID}
   📖 *QURAN*
${THIN}
   ├ .quran 2:255  — Specific ayah
   ├ .ayah         — Random ayah
   ├ .surah 36     — Full surah
   └ .hijri        — Hijri date
${THIN}
   🕌 *SALAH & PRAYER*
${THIN}
   ├ .prayer <city>  — Full prayer times
   └ .namaztime      — Quick times
${THIN}
   📿 *DHIKR & DUA*
${THIN}
   ├ .dua         — Random dua
   ├ .allahname   — 99 names
   └ .hadith      — Random hadith
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

];