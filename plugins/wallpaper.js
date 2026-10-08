// ===============================================
//  💚 SABA MD — WALLPAPERS (Unsplash)
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Royal Style · React Enabled
//  🌍 Works in Groups & DMs
//  📦 Self-contained — only needs .env token
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');
const axios = require('axios');

// ═══════════════════════════════════════════════
//  🔐 API KEY (from .env — never hardcode)
// ═══════════════════════════════════════════════
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || '';
const UNSPLASH_API = 'https://api.unsplash.com';

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
function checkKey() {
    if (!UNSPLASH_KEY || UNSPLASH_KEY.length < 20) {
        throw new Error('Unsplash API key missing. Set UNSPLASH_ACCESS_KEY in .env');
    }
}

async function unsplashRandom(query = 'nature', orientation = 'portrait') {
    checkKey();
    const res = await axios.get(`${UNSPLASH_API}/photos/random`, {
        params: { query, orientation, client_id: UNSPLASH_KEY },
        timeout: 20000,
    });
    return res.data;
}

async function unsplashSearch(query, count = 5, orientation = 'portrait') {
    checkKey();
    const res = await axios.get(`${UNSPLASH_API}/search/photos`, {
        params: { query, per_page: count, orientation, client_id: UNSPLASH_KEY },
        timeout: 20000,
    });
    return res.data?.results || [];
}

function shortText(t, max = 40) {
    if (!t) return 'Untitled';
    return t.length > max ? t.slice(0, max - 3) + '...' : t;
}

function unsplashUser(photo) {
    return photo?.user?.name || photo?.user?.username || 'Unsplash';
}

function unsplashLink(photo) {
    return photo?.links?.html || 'https://unsplash.com';
}

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    // ═══════════════════════════════════════════
    //  🖼️ WALLPAPER — Random by query
    // ═══════════════════════════════════════════
    {
        name: 'wallpaper',
        aliases: ['wall', 'wp', 'unsplash'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🖼️');

            const query = args.join(' ').trim() || 'nature';

            try {
                const photo = await unsplashRandom(query);

                const caption =
`${TOP}
   🖼️ *WALLPAPER*
${MID}
   📌 *Query*    : ${shortText(query, 30)}
   🎨 *By*       : ${unsplashUser(photo)}
   📐 *Size*     : ${photo.width}×${photo.height}
   🔗 *Source*   : Unsplash
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption
                }, { quoted: msg });

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}
   ❌ *FAILED*
${MID}
   ${err.message.slice(0, 150)}
${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🌿 NATURE
    // ═══════════════════════════════════════════
    {
        name: 'nature',
        aliases: ['natural'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🌿');
            try {
                const photo = await unsplashRandom('nature landscape');
                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   🌿 *NATURE*
${MID}
   🎨 *By* : ${unsplashUser(photo)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🏙️ CITY
    // ═══════════════════════════════════════════
    {
        name: 'city',
        aliases: ['urban'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🏙️');
            try {
                const photo = await unsplashRandom('city urban skyline');
                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   🏙️ *CITY*
${MID}
   🎨 *By* : ${unsplashUser(photo)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🚗 CAR
    // ═══════════════════════════════════════════
    {
        name: 'car',
        aliases: ['cars', 'vehicle'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🚗');
            try {
                const photo = await unsplashRandom('sports car');
                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   🚗 *CAR*
${MID}
   🎨 *By* : ${unsplashUser(photo)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🌸 ANIME (wallpaper style)
    // ═══════════════════════════════════════════
    {
        name: 'animewp',
        aliases: ['animewall', 'animewallpaper'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🌸');
            try {
                const photo = await unsplashRandom('anime aesthetic illustration');
                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   🌸 *ANIME WALLPAPER*
${MID}
   🎨 *By* : ${unsplashUser(photo)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🌌 SPACE
    // ═══════════════════════════════════════════
    {
        name: 'space',
        aliases: ['galaxy', 'universe'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🌌');
            try {
                const photo = await unsplashRandom('galaxy space stars');
                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   🌌 *SPACE*
${MID}
   🎨 *By* : ${unsplashUser(photo)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  💚 AESTHETIC
    // ═══════════════════════════════════════════
    {
        name: 'aesthetic',
        aliases: ['aestheticwp', 'vibe'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('💚');
            try {
                const photo = await unsplashRandom('aesthetic minimal');
                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   💚 *AESTHETIC*
${MID}
   🎨 *By* : ${unsplashUser(photo)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🌇 SUNSET
    // ═══════════════════════════════════════════
    {
        name: 'sunset',
        aliases: ['sunrise', 'sunsetwp'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🌇');
            try {
                const photo = await unsplashRandom('sunset sunrise sky');
                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   🌇 *SUNSET*
${MID}
   🎨 *By* : ${unsplashUser(photo)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🏔️ MOUNTAIN
    // ═══════════════════════════════════════════
    {
        name: 'mountain',
        aliases: ['mountains', 'peaks'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🏔️');
            try {
                const photo = await unsplashRandom('mountain landscape');
                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   🏔️ *MOUNTAIN*
${MID}
   🎨 *By* : ${unsplashUser(photo)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🌊 OCEAN
    // ═══════════════════════════════════════════
    {
        name: 'ocean',
        aliases: ['sea', 'beach'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🌊');
            try {
                const photo = await unsplashRandom('ocean sea beach waves');
                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   🌊 *OCEAN*
${MID}
   🎨 *By* : ${unsplashUser(photo)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🐱 ANIMALS
    // ═══════════════════════════════════════════
    {
        name: 'animal',
        aliases: ['animals', 'wildlife'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🐱');
            try {
                const query = args.join(' ') || 'wild animal';
                const photo = await unsplashRandom(query);
                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   🐱 *ANIMAL*
${MID}
   📌 *Query* : ${shortText(query, 30)}
   🎨 *By*    : ${unsplashUser(photo)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🍔 FOOD
    // ═══════════════════════════════════════════
    {
        name: 'food',
        aliases: ['foodporn', 'khaana'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🍔');
            try {
                const photo = await unsplashRandom('delicious food');
                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   🍔 *FOOD*
${MID}
   🎨 *By* : ${unsplashUser(photo)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🌹 FLOWERS
    // ═══════════════════════════════════════════
    {
        name: 'flower',
        aliases: ['flowers', 'phool'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🌹');
            try {
                const photo = await unsplashRandom('beautiful flowers');
                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   🌹 *FLOWERS*
${MID}
   🎨 *By* : ${unsplashUser(photo)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🎨 ART / ABSTRACT
    // ═══════════════════════════════════════════
    {
        name: 'art',
        aliases: ['abstract', 'artwp'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🎨');
            try {
                const photo = await unsplashRandom('abstract art colorful');
                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   🎨 *ABSTRACT ART*
${MID}
   🎨 *By* : ${unsplashUser(photo)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🌈 BACKGROUND
    // ═══════════════════════════════════════════
    {
        name: 'background',
        aliases: ['bg', 'bgwp'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🌈');
            try {
                const photo = await unsplashRandom('gradient background');
                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   🌈 *BACKGROUND*
${MID}
   🎨 *By* : ${unsplashUser(photo)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  👤 PROFILE PIC
    // ═══════════════════════════════════════════
    {
        name: 'pfp',
        aliases: ['profilepic', 'dp'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('👤');

            const query = args.join(' ') || 'aesthetic';

            try {
                const results = await unsplashSearch(query, 5, 'squarish');
                if (!results.length) throw new Error('No results found');

                const photo = results[Math.floor(Math.random() * results.length)];

                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   👤 *PROFILE PIC*
${MID}
   📌 *Query*  : ${shortText(query, 30)}
   🎨 *By*     : ${unsplashUser(photo)}
   🔗 *Source* : ${unsplashLink(photo)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🔍 SEARCH — Get 5 results
    // ═══════════════════════════════════════════
    {
        name: 'search',
        aliases: ['img', 'image', 'pic'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔍');

            const query = args.join(' ').trim();
            if (!query) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO QUERY*\n${MID}\n   Usage: .search cat\n${BOT}`, msg);
            }

            try {
                const results = await unsplashSearch(query, 5);
                if (!results.length) throw new Error('No results found');

                await h.sendWithLogo(sock, from,
`${TOP}
   🔍 *IMAGE SEARCH*
${MID}
   📌 *Query*   : ${query}
   📊 *Found*   : ${results.length} images
   📤 *Sending...*
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);

                for (const photo of results) {
                    await sock.sendMessage(from, {
                        image: { url: photo.urls.regular },
                        caption:
`${TOP}
   🖼️ *${shortText(photo.alt_description || query, 40)}*
${MID}
   🎨 *By* : ${unsplashUser(photo)}
   🔗 ${unsplashLink(photo)}
${BOT}`
                    });
                }

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  💚 SABA SPECIAL — Wallpaper for Saba
    // ═══════════════════════════════════════════
    {
        name: 'sabawp',
        aliases: ['sabawallpaper', 'sabaspecial'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('💚');

            const queries = [
                'peaceful nature green',
                'aesthetic green minimal',
                'moonlight romantic',
                'sunrise peaceful',
                'flowers pink aesthetic',
                'starry night sky',
            ];
            const query = queries[Math.floor(Math.random() * queries.length)];

            try {
                const photo = await unsplashRandom(query);
                await sock.sendMessage(from, {
                    image: { url: photo.urls.regular },
                    caption:
`${TOP}
   💚 *SABA SPECIAL*
${MID}
   🌸 A wallpaper for someone
   special — *Saba*
${THIN}
   🎨 *By* : ${unsplashUser(photo)}
${MID}
   💖 *Arslan Tech's — dil se*
${BOT}`
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

];