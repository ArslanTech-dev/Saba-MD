// ===============================================
//  💚 SABA MD — TOOLS & UTILITIES
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Royal Style · React Enabled
//  🌍 Works in Groups & DMs
//  📦 Self-contained — no API keys needed
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');
const axios = require('axios');

// ═══════════════════════════════════════════════
//  🌐 FREE API ENDPOINTS (no keys needed)
// ═══════════════════════════════════════════════
const API = {
    weather:      'https://wttr.in',
    qr:           'https://api.qrserver.com/v1/create-qr-code/',
    shorturl:     'https://tinyurl.com/api-create.php',
    ip:           'https://ipapi.co',
    translate:    'https://api.mymemory.translated.net/get',
    dictionary:   'https://api.dictionaryapi.dev/api/v2/entries/en',
    country:      'https://restcountries.com/v3.1/name',
    crypto:       'https://api.coingecko.com/api/v3/simple/price',
    github:       'https://api.github.com/users',
    npm:          'https://registry.npmjs.org',
    joke:         'https://official-joke-api.appspot.com/random_joke',
    chucknorris:  'https://api.chucknorris.io/jokes/random',
    catfact:      'https://catfact.ninja/fact',
    dogfact:      'https://dogapi.dog/api/v2/facts',
    uselessfact:  'https://uselessfacts.jsph.pl/api/v2/facts/random',
    quote:        'https://api.quotable.io/random',
};

// ═══════════════════════════════════════════════
//  🎨 STYLE
// ═══════════════════════════════════════════════
const TOP  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';
const MID  = '━━━━━━━━━━━━━━━━━━';
const THIN = '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄';
const BOT  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';

// ═══════════════════════════════════════════════
//  🛠️ INTERNAL HELPERS
// ═══════════════════════════════════════════════
function shortText(t, max = 60) {
    if (!t) return '';
    return t.length > max ? t.slice(0, max - 3) + '...' : t;
}

async function getJson(url, params = {}, timeout = 15000) {
    const res = await axios.get(url, { params, timeout });
    return res.data;
}

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    // ═══════════════════════════════════════════
    //  🌤️ WEATHER
    // ═══════════════════════════════════════════
    {
        name: 'weather',
        aliases: ['wthr', 'mausam'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🌤️');

            const city = args.join(' ').trim() || 'Karachi';
            await react('⏳');

            try {
                const data = await getJson(`${API.weather}/${encodeURIComponent(city)}?format=j1`);

                if (!data?.current_condition?.[0]) throw new Error('City not found');

                const c = data.current_condition[0];
                const area = data.nearest_area?.[0];

                const caption =
`${TOP}
   🌤️ *WEATHER*
${MID}
   📍 *City*    : ${area?.areaName?.[0]?.value || city}
   🌍 *Country* : ${area?.country?.[0]?.value || '—'}
${THIN}
   🌡️ *Temp*     : ${c.temp_C}°C (${c.temp_F}°F)
   ☁️ *Condition*: ${c.weatherDesc?.[0]?.value || '—'}
   💧 *Humidity* : ${c.humidity}%
   💨 *Wind*     : ${c.windspeedKmph} km/h
   👁️ *Visibility*: ${c.visibility} km
   🌡️ *Feels like*: ${c.FeelsLikeC}°C
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
    //  🧮 CALCULATOR
    // ═══════════════════════════════════════════
    {
        name: 'calc',
        aliases: ['calculate', 'math'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🧮');

            const expr = args.join(' ').trim();
            if (!expr) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO EXPRESSION*\n${MID}\n   Usage: *.calc 2+2*3*\n${BOT}`, msg);
            }

            // Safe evaluation
            try {
                const sanitized = expr.replace(/[^0-9+\-*/().%^ ]/g, '');
                if (!sanitized) throw new Error('Invalid');

                // eslint-disable-next-line no-new-func
                const result = Function(`"use strict"; return (${sanitized.replace(/\^/g, '**')})`)();

                if (result === undefined || isNaN(result)) throw new Error('Invalid expression');

                await h.sendWithLogo(sock, from,
`${TOP}
   🧮 *CALCULATOR*
${MID}
   📥 *Input*  : ${expr}
${THIN}
   📤 *Result* : *${result}*
${MID}
   💖 *Saba MD*
${BOT}`, msg);

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *INVALID*\n${MID}\n   ${err.message.slice(0, 100)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📱 QR CODE
    // ═══════════════════════════════════════════
    {
        name: 'qr',
        aliases: ['qrcode', 'qrimg'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📱');

            const text = args.join(' ').trim();
            if (!text) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: *.qr Your text or URL*\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const url = `${API.qr}?size=500x500&data=${encodeURIComponent(text)}`;

                await sock.sendMessage(from, {
                    image: { url },
                    caption:
`${TOP}
   📱 *QR CODE*
${MID}
   📝 *Content* : ${shortText(text, 50)}
   📐 *Size*    : 500×500
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`,
                }, { quoted: msg });

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 100)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🔗 SHORT URL
    // ═══════════════════════════════════════════
    {
        name: 'shorturl',
        aliases: ['short', 'tinyurl'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔗');

            const url = args[0];
            if (!url || !/^https?:\/\//i.test(url)) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *INVALID URL*\n${MID}\n   Usage: *.shorturl https://example.com/very/long* \n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const res = await axios.get(`${API.shorturl}?url=${encodeURIComponent(url)}`, { timeout: 15000 });
                const shortUrl = typeof res.data === 'string' ? res.data.trim() : null;

                if (!shortUrl) throw new Error('Failed to shorten');

                await h.sendWithLogo(sock, from,
`${TOP}
   🔗 *URL SHORTENED*
${MID}
   📥 *Original*:
   ${shortText(url, 60)}
${THIN}
   📤 *Short*:
   ${shortUrl}
${MID}
   💖 *Saba MD*
${BOT}`, msg);

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 100)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🌐 IP LOOKUP
    // ═══════════════════════════════════════════
    {
        name: 'ip',
        aliases: ['iplookup', 'myip', 'ipinfo'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🌐');

            const ip = args[0];
            await react('⏳');

            try {
                const url = ip ? `${API.ip}/${ip}/json/` : `${API.ip}/json/`;
                const data = await getJson(url);

                if (data.error) throw new Error(data.reason || 'IP not found');

                const caption =
`${TOP}
   🌐 *IP INFO*
${MID}
   📍 *IP*       : ${data.ip}
   🏙️ *City*     : ${data.city || '—'}
   🌍 *Region*   : ${data.region || '—'}
   🗺️ *Country*  : ${data.country_name || '—'} ${data.country_code ? `(${data.country_code})` : ''}
   📮 *Postal*   : ${data.postal || '—'}
   🌐 *ISP*      : ${data.org || '—'}
   🕒 *Timezone* : ${data.timezone || '—'}
   📌 *Location* : ${data.latitude || '—'}, ${data.longitude || '—'}
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
    //  🌍 TRANSLATE (Google alternative)
    // ═══════════════════════════════════════════
    {
        name: 'translatestr',
        aliases: ['gtrans', 'gtx'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🌍');

            const input = args.join(' ').trim();
            if (!input) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: *.gtx <lang> <text>*\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                // Split first word (lang) from rest
                const parts = input.split(' ');
                const lang = parts.length > 1 ? parts[0] : 'en';
                const text = parts.length > 1 ? parts.slice(1).join(' ') : input;

                const data = await getJson(API.translate, {
                    q: text,
                    langpair: `auto|${lang}`,
                });

                const translated = data?.responseData?.translatedText;
                if (!translated) throw new Error('Translation failed');

                await h.sendWithLogo(sock, from,
`${TOP}
   🌍 *TRANSLATION*
${MID}
   📥 *Input*  : ${shortText(text, 80)}
   🌐 *Target* : ${lang}
${THIN}
   📤 *Output* : ${translated}
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
    //  📖 DICTIONARY
    // ═══════════════════════════════════════════
    {
        name: 'dict',
        aliases: ['dictionary', 'meaning', 'define'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📖');

            const word = args[0];
            if (!word) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO WORD*\n${MID}\n   Usage: *.dict hello*\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const data = await getJson(`${API.dictionary}/${encodeURIComponent(word)}`);
                const entry = data?.[0];

                if (!entry) throw new Error('Word not found');

                const meaning = entry.meanings?.[0];
                const def = meaning?.definitions?.[0];

                const caption =
`${TOP}
   📖 *DICTIONARY*
${MID}
   🔤 *Word* : ${entry.word}
   📝 *Type* : ${meaning?.partOfSpeech || '—'}
${THIN}
   💬 *Definition:*
   ${def?.definition || '—'}
${def?.example ? `${THIN}\n   📌 *Example:*\n   _${def.example}_\n` : ''}${MID}
   💖 *Saba MD*
${BOT}`;

                await h.sendWithLogo(sock, from, caption, msg);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *NOT FOUND*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🌍 COUNTRY INFO
    // ═══════════════════════════════════════════
    {
        name: 'country',
        aliases: ['countryinfo'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🌍');

            const name = args.join(' ').trim();
            if (!name) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO COUNTRY*\n${MID}\n   Usage: *.country Pakistan*\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const data = await getJson(`${API.country}/${encodeURIComponent(name)}?fullText=false`);
                const c = Array.isArray(data) ? data[0] : null;

                if (!c) throw new Error('Country not found');

                const currencies = Object.values(c.currencies || {}).map(x => `${x.name} (${x.symbol})`).join(', ');
                const languages = Object.values(c.languages || {}).join(', ');

                const caption =
`${TOP}
   🌍 *COUNTRY INFO*
${MID}
   🏳️ *Name*     : ${c.name?.common} (${c.name?.official})
   📛 *Code*     : ${c.cca2} / ${c.cca3}
   🏙️ *Capital*  : ${c.capital?.[0] || '—'}
   🌏 *Region*   : ${c.region} — ${c.subregion || ''}
${THIN}
   👥 *Population* : ${(c.population || 0).toLocaleString()}
   🗺️ *Area*       : ${(c.area || 0).toLocaleString()} km²
   🌐 *Currency*   : ${currencies || '—'}
   🗣️ *Languages*  : ${languages || '—'}
   ⏰ *Timezones*  : ${c.timezones?.[0] || '—'}
${MID}
   💖 *Saba MD*
${BOT}`;

                await sock.sendMessage(from, {
                    image: { url: c.flags?.png },
                    caption,
                }, { quoted: msg });

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *NOT FOUND*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  💰 CRYPTO PRICE
    // ═══════════════════════════════════════════
    {
        name: 'crypto',
        aliases: ['cryptoprice', 'coin'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('💰');

            const coin = (args[0] || 'bitcoin').toLowerCase();
            await react('⏳');

            try {
                const data = await getJson(API.crypto, {
                    ids: coin,
                    vs_currencies: 'usd,pkr,inr,eur',
                });

                const c = data[coin];
                if (!c) throw new Error('Coin not found');

                const caption =
`${TOP}
   💰 *CRYPTO PRICE*
${MID}
   🪙 *Coin* : ${coin.toUpperCase()}
${THIN}
   💵 *USD* : $${c.usd?.toLocaleString() || '—'}
   💶 *EUR* : €${c.eur?.toLocaleString() || '—'}
   🇵🇰 *PKR* : ₨${c.pkr?.toLocaleString() || '—'}
   🇮🇳 *INR* : ₹${c.inr?.toLocaleString() || '—'}
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
   💡 Try: bitcoin, ethereum, dogecoin
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🐙 GITHUB USER INFO
    // ═══════════════════════════════════════════
    {
        name: 'github',
        aliases: ['ghuser', 'gh'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🐙');

            const user = args[0];
            if (!user) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO USERNAME*\n${MID}\n   Usage: *.github username*\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const data = await getJson(`${API.github}/${user}`);

                if (data.message === 'Not Found') throw new Error('User not found');

                const caption =
`${TOP}
   🐙 *GITHUB USER*
${MID}
   👤 *Name*     : ${data.name || user}
   📛 *Username* : @${data.login}
   🆔 *ID*       : ${data.id}
${THIN}
   📝 *Bio*      : ${data.bio || '—'}
   🏢 *Company*  : ${data.company || '—'}
   📍 *Location* : ${data.location || '—'}
   🔗 *Blog*     : ${data.blog || '—'}
${THIN}
   📦 *Repos*    : ${data.public_repos}
   👥 *Followers*: ${data.followers}
   👣 *Following*: ${data.following}
   📅 *Joined*   : ${new Date(data.created_at).toLocaleDateString()}
${MID}
   💖 *Saba MD*
${BOT}`;

                await sock.sendMessage(from, {
                    image: { url: data.avatar_url },
                    caption,
                }, { quoted: msg });

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *NOT FOUND*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📦 NPM PACKAGE INFO
    // ═══════════════════════════════════════════
    {
        name: 'npm',
        aliases: ['npmpkg'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📦');

            const pkg = args[0];
            if (!pkg) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO PACKAGE*\n${MID}\n   Usage: *.npm baileys*\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const data = await getJson(`${API.npm}/${encodeURIComponent(pkg)}`);
                const latest = data['dist-tags']?.latest;
                const info = data.versions?.[latest];

                if (!info) throw new Error('Package not found');

                const caption =
`${TOP}
   📦 *NPM PACKAGE*
${MID}
   📛 *Name*     : ${data.name}
   📌 *Version*  : ${latest}
   📝 *License*  : ${info.license || '—'}
   👤 *Author*   : ${typeof data.author === 'string' ? data.author : data.author?.name || '—'}
${THIN}
   📄 *Description:*
   ${shortText(data.description, 150)}
${THIN}
   🔗 *Homepage* : ${data.homepage || '—'}
   📅 *Modified* : ${new Date(data.time?.modified).toLocaleDateString()}
   📊 *Versions* : ${Object.keys(data.versions || {}).length}
${MID}
   💖 *Saba MD*
${BOT}`;

                await h.sendWithLogo(sock, from, caption, msg);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *NOT FOUND*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  😂 JOKE (API)
    // ═══════════════════════════════════════════
    {
        name: 'apijoke',
        aliases: ['randomjoke'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('😂');

            try {
                const data = await getJson(API.joke);
                await h.sendWithLogo(sock, from,
`${TOP}
   😂 *RANDOM JOKE*
${MID}
   ❓ ${data.setup}
${THIN}
   😄 ${data.punchline}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🥋 CHUCK NORRIS
    // ═══════════════════════════════════════════
    {
        name: 'chuck',
        aliases: ['chucknorris'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🥋');

            try {
                const data = await getJson(API.chucknorris);
                await h.sendWithLogo(sock, from,
`${TOP}
   🥋 *CHUCK NORRIS*
${MID}
   ${data.value}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🐱 CAT FACT
    // ═══════════════════════════════════════════
    {
        name: 'catfact',
        aliases: ['catfacts'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🐱');

            try {
                const data = await getJson(API.catfact);
                await h.sendWithLogo(sock, from,
`${TOP}
   🐱 *CAT FACT*
${MID}
   ${data.fact}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🐶 DOG FACT
    // ═══════════════════════════════════════════
    {
        name: 'dogfact',
        aliases: ['dogfacts'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🐶');

            try {
                const data = await getJson(API.dogfact);
                const fact = data?.data?.[0]?.attributes?.body || 'No fact available';
                await h.sendWithLogo(sock, from,
`${TOP}
   🐶 *DOG FACT*
${MID}
   ${fact}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🎲 USELESS FACT
    // ═══════════════════════════════════════════
    {
        name: 'useless',
        aliases: ['uselessfact'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🎲');

            try {
                const data = await getJson(API.uselessfact);
                await h.sendWithLogo(sock, from,
`${TOP}
   🎲 *USELESS FACT*
${MID}
   ${data.text}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📜 QUOTE (API)
    // ═══════════════════════════════════════════
    {
        name: 'apiquote',
        aliases: ['randomquote'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('📜');

            try {
                const data = await getJson(API.quote);
                await h.sendWithLogo(sock, from,
`${TOP}
   📜 *QUOTE*
${MID}
   "${data.content}"
${THIN}
   — *${data.author}*
${MID}
   💖 *Saba MD*
${BOT}`, msg);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🎨 COLOR INFO
    // ═══════════════════════════════════════════
    {
        name: 'color',
        aliases: ['colorinfo', 'hex'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎨');

            let hex = args[0]?.replace('#', '') || '25D366';

            if (!/^[0-9A-Fa-f]{6}$/.test(hex)) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *INVALID HEX*\n${MID}\n   Usage: *.color 25D366*\n${BOT}`, msg);
            }

            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);

            const previewUrl = `https://singlecolorimage.com/get/${hex}/300x300`;

            await sock.sendMessage(from, {
                image: { url: previewUrl },
                caption:
`${TOP}
   🎨 *COLOR INFO*
${MID}
   🎯 *HEX* : #${hex.toUpperCase()}
   🔴 *RGB* : rgb(${r}, ${g}, ${b})
   🎭 *HSL* : hsl(${Math.round(r/255*360)}, 100%, 50%)
${MID}
   💖 *Saba MD*
${BOT}`,
            }, { quoted: msg });

            await react('✅');
        }
    },

    // ═══════════════════════════════════════════
    //  ⏰ UNIX TIMESTAMP
    // ═══════════════════════════════════════════
    {
        name: 'timestamp',
        aliases: ['unix', 'unixtime'],
        cooldown: 3000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('⏰');

            const now = Date.now();
            const unix = Math.floor(now / 1000);

            await h.sendWithLogo(sock, from,
`${TOP}
   ⏰ *TIMESTAMP*
${MID}
   🔢 *Unix*     : ${unix}
   🕒 *Local*    : ${new Date().toLocaleString(config.TIMEZONE)}
   🌐 *UTC*      : ${new Date().toUTCString()}
   📅 *ISO*      : ${new Date().toISOString()}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            await react('✅');
        }
    },

    // ═══════════════════════════════════════════
    //  🔤 TEXT CASE
    // ═══════════════════════════════════════════
    {
        name: 'case',
        aliases: ['textcase'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔤');

            const text = args.join(' ');
            if (!text) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: *.case hello world*\n${BOT}`, msg);
            }

            const upper = text.toUpperCase();
            const lower = text.toLowerCase();
            const title = text.replace(/\w\S*/g, w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());
            const camel = text.toLowerCase().replace(/ (.)/g, (m, c) => c.toUpperCase());

            await h.sendWithLogo(sock, from,
`${TOP}
   🔤 *TEXT CASES*
${MID}
   📥 *Original* : ${text}
${THIN}
   ⬆️ *UPPER*   : ${upper}
   ⬇️ *lower*   : ${lower}
   🔡 *Title*   : ${title}
   🐪 *camel*   : ${camel}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🔢 BASE64
    // ═══════════════════════════════════════════
    {
        name: 'base64',
        aliases: ['b64'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔢');

            const input = args.join(' ');
            if (!input) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: *.base64 encode hello*\n   Or: *.base64 decode aGVsbG8=*\n${BOT}`, msg);
            }

            const mode = args[0]?.toLowerCase();
            const text = args.slice(1).join(' ');

            let result;
            let action;

            try {
                if (mode === 'encode' || mode === 'enc') {
                    result = Buffer.from(text, 'utf-8').toString('base64');
                    action = 'Encoded';
                } else if (mode === 'decode' || mode === 'dec') {
                    result = Buffer.from(text, 'base64').toString('utf-8');
                    action = 'Decoded';
                } else {
                    // Auto-encode if no mode
                    result = Buffer.from(input, 'utf-8').toString('base64');
                    action = 'Encoded';
                }

                await h.sendWithLogo(sock, from,
`${TOP}
   🔢 *BASE64*
${MID}
   📊 *Action* : ${action}
   📥 *Input*  : ${shortText(input, 60)}
${THIN}
   📤 *Output* : ${result}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *INVALID*\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🔐 HASH
    // ═══════════════════════════════════════════
    {
        name: 'hash',
        aliases: ['md5', 'sha256'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔐');

            const text = args.join(' ');
            if (!text) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: *.hash hello*\n${BOT}`, msg);
            }

            const crypto = require('crypto');
            const md5 = crypto.createHash('md5').update(text).digest('hex');
            const sha1 = crypto.createHash('sha1').update(text).digest('hex');
            const sha256 = crypto.createHash('sha256').update(text).digest('hex');

            await h.sendWithLogo(sock, from,
`${TOP}
   🔐 *HASH GENERATOR*
${MID}
   📥 *Input* : ${shortText(text, 50)}
${THIN}
   🔸 *MD5*:
   ${md5}
${THIN}
   🔹 *SHA1*:
   ${sha1}
${THIN}
   🔒 *SHA256*:
   ${sha256}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🎂 AGE CALCULATOR
    // ═══════════════════════════════════════════
    {
        name: 'age',
        aliases: ['agecalc'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎂');

            const dateStr = args[0];
            if (!dateStr) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO DATE*\n${MID}\n   Usage: *.age 2000-01-15*\n${BOT}`, msg);
            }

            try {
                const birthDate = new Date(dateStr);
                if (isNaN(birthDate.getTime())) throw new Error('Invalid date');

                const now = new Date();
                const diffMs = now - birthDate;
                const years = Math.floor(diffMs / (365.25 * 24 * 60 * 60 * 1000));
                const totalDays = Math.floor(diffMs / (24 * 60 * 60 * 1000));
                const totalHours = Math.floor(diffMs / (60 * 60 * 1000));

                const nextBday = new Date(now.getFullYear(), birthDate.getMonth(), birthDate.getDate());
                if (nextBday < now) nextBday.setFullYear(nextBday.getFullYear() + 1);
                const daysToBday = Math.ceil((nextBday - now) / (24 * 60 * 60 * 1000));

                await h.sendWithLogo(sock, from,
`${TOP}
   🎂 *AGE CALCULATOR*
${MID}
   📅 *Birth*    : ${birthDate.toLocaleDateString()}
   🎉 *Years*    : ${years} years
   📆 *Days*     : ${totalDays.toLocaleString()} days
   ⏰ *Hours*    : ${totalHours.toLocaleString()} hours
${THIN}
   🎁 *Next BDay in* : ${daysToBday} days
   📅 *Day*          : ${birthDate.toLocaleDateString('en-US', { weekday: 'long' })}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *INVALID DATE*\n${MID}\n   Format: YYYY-MM-DD\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🔢 RANDOM NUMBER
    // ═══════════════════════════════════════════
    {
        name: 'random',
        aliases: ['randnum'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔢');

            const min = parseInt(args[0]) || 1;
            const max = parseInt(args[1]) || 100;

            if (min >= max) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *INVALID RANGE*\n${MID}\n   Usage: *.random 1 100*\n${BOT}`, msg);
            }

            const result = Math.floor(Math.random() * (max - min + 1)) + min;

            await h.sendWithLogo(sock, from,
`${TOP}
   🔢 *RANDOM NUMBER*
${MID}
   📊 *Range* : ${min} — ${max}
${THIN}
   🎯 *Result* : *${result}*
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            await react('✅');
        }
    },

    // ═══════════════════════════════════════════
    //  📊 TOOLS INFO
    // ═══════════════════════════════════════════
    {
        name: 'toolsinfo',
        aliases: ['toolshelp'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('📊');

            await h.sendWithLogo(sock, from,
`${TOP}
   📊 *TOOLS MENU*
${MID}
   🌤️ *.weather*   — Weather info
   🧮 *.calc*      — Calculator
   📱 *.qr*        — QR code
   🔗 *.shorturl*  — Short URL
   🌐 *.ip*        — IP lookup
   🌍 *.gtx*       — Translate
   📖 *.dict*      — Dictionary
   🌍 *.country*   — Country info
   💰 *.crypto*    — Crypto price
   🐙 *.github*    — GitHub user
   📦 *.npm*       — NPM package
${THIN}
   😂 *.apijoke*   — Random joke
   🥋 *.chuck*     — Chuck Norris
   🐱 *.catfact*   — Cat fact
   🐶 *.dogfact*   — Dog fact
   🎲 *.useless*   — Useless fact
   📜 *.apiquote*  — Random quote
${THIN}
   🎨 *.color*     — Color info
   ⏰ *.timestamp* — Unix time
   🔤 *.case*      — Text cases
   🔢 *.base64*    — Encode/decode
   🔐 *.hash*      — MD5/SHA hashes
   🎂 *.age*       — Age calculator
   🔢 *.random*    — Random number
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

];