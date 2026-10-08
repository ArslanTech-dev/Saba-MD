// ===============================================
//  💚 SABA MD — DOWNLOADERS
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Royal Style · React Enabled
//  📦 Self-contained — no other file changes needed
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');
const axios = require('axios');

// ═══════════════════════════════════════════════
//  🎨 STYLE
// ═══════════════════════════════════════════════
const TOP  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';
const MID  = '━━━━━━━━━━━━━━━━━━';
const THIN = '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄';
const BOT  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';

// ═══════════════════════════════════════════════
//  🔧 PLUGIN-INTERNAL HELPERS
// ═══════════════════════════════════════════════

// ─── Detect URL type ───
function detectUrl(text) {
    const t = (text || '').trim();
    if (/youtu\.be\/|youtube\.com\//i.test(t))      return { type: 'youtube',   url: t };
    if (/instagram\.com\//i.test(t))                 return { type: 'instagram', url: t };
    if (/tiktok\.com\/|vt\.tiktok\.com\//i.test(t))  return { type: 'tiktok',    url: t };
    if (/facebook\.com\/|fb\.watch\//i.test(t))      return { type: 'facebook',  url: t };
    if (/twitter\.com\/|x\.com\//i.test(t))          return { type: 'twitter',   url: t };
    if (/pinterest\.com\/|pin\.it\//i.test(t))       return { type: 'pinterest', url: t };
    if (/spotify\.com\//i.test(t))                   return { type: 'spotify',   url: t };
    if (/github\.com\//i.test(t))                    return { type: 'github',    url: t };
    if (/soundcloud\.com\//i.test(t))                return { type: 'soundcloud',url: t };
    if (/threads\.net\//i.test(t))                   return { type: 'threads',   url: t };
    return null;
}

// ─── Extract URL from args or quoted text ───
function extractUrl(msg, args) {
    // From args
    if (args && args.length > 0) {
        const url = args.find(a => /^https?:\/\//i.test(a));
        if (url) return url;
    }

    // From quoted message
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quoted) {
        const qText = quoted.conversation
            || quoted.extendedTextMessage?.text
            || quoted.imageMessage?.caption
            || quoted.videoMessage?.caption
            || '';
        const match = qText.match(/https?:\/\/[^\s]+/);
        if (match) return match[0];
    }

    return null;
}

// ─── Shorten title ───
function shortTitle(t, max = 50) {
    if (!t) return 'Unknown';
    return t.length > max ? t.slice(0, max - 3) + '...' : t;
}

// ─── Axios GET wrapper ───
async function fetchJson(url, timeout = 30000) {
    const res = await axios.get(url, { timeout });
    return res.data;
}

async function fetchBuffer(url, timeout = 60000) {
    const res = await axios.get(url, { responseType: 'arraybuffer', timeout });
    return Buffer.from(res.data);
}

// ═══════════════════════════════════════════════
//  🌐 API ENDPOINTS (swap here if one breaks)
// ═══════════════════════════════════════════════
const API = {
    // YouTube
    yt_search:  'https://api.zenkey.my.id/search/youtube?q=',
    yt_mp3:     'https://api.zenkey.my.id/download/ytmp3?url=',
    yt_mp4:     'https://api.zenkey.my.id/download/ytmp4?url=',

    // TikTok
    tiktok:     'https://api.zenkey.my.id/download/tiktok?url=',

    // Instagram
    instagram:  'https://api.zenkey.my.id/download/instagram?url=',

    // Facebook
    facebook:   'https://api.zenkey.my.id/download/facebook?url=',

    // Twitter / X
    twitter:    'https://api.zenkey.my.id/download/twitter?url=',

    // Pinterest
    pinterest:  'https://api.zenkey.my.id/download/pinterest?url=',
};

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    // ═══════════════════════════════════════════
    //  🎵 SONG / PLAY — YouTube MP3
    // ═══════════════════════════════════════════
    {
        name: 'song',
        aliases: ['play', 'music', 'mp3', 'ytmp3'],
        cooldown: 15000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎵');

            // ─── Get query or URL ───
            const query = args.join(' ').trim();
            if (!query) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO QUERY*
${MID}
   Usage: .song <name or link>
   Example: .song Tum Hi Ho
${BOT}`, msg);
            }

            try {
                // ─── Search if query (not URL) ───
                let videoUrl = query;
                let info = null;

                if (!/^https?:\/\//i.test(query)) {
                    await h.sendWithLogo(sock, from,
`${TOP}
   🔍 *SEARCHING...*
${MID}
   🎵 Query: ${query}
${BOT}`, msg);

                    const search = await fetchJson(API.yt_search + encodeURIComponent(query));
                    const first = search?.result?.[0] || search?.data?.[0] || search?.[0];
                    if (!first) throw new Error('No results found');
                    videoUrl = first.url || first.link || `https://youtu.be/${first.videoId}`;
                    info = first;
                }

                // ─── Fetch MP3 ───
                await react('⏳');
                const dl = await fetchJson(API.yt_mp3 + encodeURIComponent(videoUrl));
                const data = dl?.result || dl?.data || dl;

                const title    = shortTitle(data?.title || info?.title || 'Unknown');
                const duration = data?.duration || info?.duration || '—';
                const thumb    = data?.thumbnail || info?.thumbnail || config.BOT_LOGO;
                const audioUrl = data?.download?.url || data?.url || data?.audio || data?.link;

                if (!audioUrl) throw new Error('No download URL');

                // ─── Send info card ───
                await sock.sendMessage(from, {
                    image: { url: thumb },
                    caption:
`${TOP}
   🎵 *YOUTUBE AUDIO*
${MID}
   📌 *Title*    : ${title}
   ⏱️ *Duration* : ${duration}
   🎧 *Format*   : MP3
${MID}
   ⬇️ *Sending audio...*
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });

                // ─── Send audio ───
                await sock.sendMessage(from, {
                    audio: { url: audioUrl },
                    mimetype: 'audio/mpeg',
                    fileName: `${title}.mp3`,
                    ptt: false
                }, { quoted: msg });

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}
   ❌ *DOWNLOAD FAILED*
${MID}
   ${err.message.slice(0, 150)}
${MID}
   💡 Try another song or check link
${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🎬 VIDEO — YouTube MP4
    // ═══════════════════════════════════════════
    {
        name: 'video',
        aliases: ['ytv', 'ytmp4', 'mp4'],
        cooldown: 15000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎬');

            const query = args.join(' ').trim();
            if (!query) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO QUERY*\n${MID}\n   Usage: .video <name or link>\n${BOT}`, msg);
            }

            try {
                let videoUrl = query;
                let info = null;

                if (!/^https?:\/\//i.test(query)) {
                    const search = await fetchJson(API.yt_search + encodeURIComponent(query));
                    const first = search?.result?.[0] || search?.data?.[0] || search?.[0];
                    if (!first) throw new Error('No results found');
                    videoUrl = first.url || first.link || `https://youtu.be/${first.videoId}`;
                    info = first;
                }

                await react('⏳');
                const dl = await fetchJson(API.yt_mp4 + encodeURIComponent(videoUrl));
                const data = dl?.result || dl?.data || dl;

                const title    = shortTitle(data?.title || info?.title || 'Unknown');
                const duration = data?.duration || info?.duration || '—';
                const thumb    = data?.thumbnail || info?.thumbnail || config.BOT_LOGO;
                const videoDl  = data?.download?.url || data?.url || data?.video || data?.link;

                if (!videoDl) throw new Error('No download URL');

                await sock.sendMessage(from, {
                    image: { url: thumb },
                    caption:
`${TOP}
   🎬 *YOUTUBE VIDEO*
${MID}
   📌 *Title*    : ${title}
   ⏱️ *Duration* : ${duration}
   🎞️ *Format*   : MP4
${MID}
   ⬇️ *Sending video...*
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                }, { quoted: msg });

                await sock.sendMessage(from, {
                    video: { url: videoDl },
                    mimetype: 'video/mp4',
                    fileName: `${title}.mp4`,
                    caption: `🎬 ${title}`
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
    //  📱 TIKTOK
    // ═══════════════════════════════════════════
    {
        name: 'tiktok',
        aliases: ['tt', 'ttdl'],
        cooldown: 15000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📱');

            const url = extractUrl(msg, args);
            if (!url) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO URL*\n${MID}\n   Usage: .tiktok <url>\n   Or reply to a TikTok link\n${BOT}`, msg);
            }

            try {
                await react('⏳');
                const dl = await fetchJson(API.tiktok + encodeURIComponent(url));
                const data = dl?.result || dl?.data || dl;

                const title  = shortTitle(data?.title || data?.desc || 'TikTok Video');
                const video  = data?.video || data?.nowm || data?.download?.url || data?.url;
                const music  = data?.music || data?.audio;
                const author = data?.author?.nickname || data?.author?.unique_id || 'Unknown';

                if (!video) throw new Error('No video URL');

                await sock.sendMessage(from, {
                    video: { url: video },
                    mimetype: 'video/mp4',
                    caption:
`${TOP}
   📱 *TIKTOK*
${MID}
   📌 *Title*  : ${title}
   👤 *Author* : ${author}
   🎬 *Format* : MP4 (No Watermark)
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
    //  📷 INSTAGRAM
    // ═══════════════════════════════════════════
    {
        name: 'instagram',
        aliases: ['ig', 'igdl', 'insta'],
        cooldown: 15000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📷');

            const url = extractUrl(msg, args);
            if (!url) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO URL*\n${MID}\n   Usage: .ig <url>\n   Or reply to an IG link\n${BOT}`, msg);
            }

            try {
                await react('⏳');
                const dl = await fetchJson(API.instagram + encodeURIComponent(url));
                const data = dl?.result || dl?.data || dl;

                const media = data?.media || data?.urls || data?.download || [];
                const list = Array.isArray(media) ? media : [media];

                if (list.length === 0) throw new Error('No media found');

                // Send info
                await h.sendWithLogo(sock, from,
`${TOP}
   📷 *INSTAGRAM*
${MID}
   📊 *Found* : ${list.length} media
   ⬇️ *Sending...*
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);

                // Send each media (max 5)
                for (const item of list.slice(0, 5)) {
                    const mediaUrl = typeof item === 'string' ? item : item.url || item.link;
                    const isVideo = /\.mp4|video/i.test(mediaUrl);

                    if (isVideo) {
                        await sock.sendMessage(from, {
                            video: { url: mediaUrl },
                            mimetype: 'video/mp4'
                        }, { quoted: msg });
                    } else {
                        await sock.sendMessage(from, {
                            image: { url: mediaUrl }
                        }, { quoted: msg });
                    }
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
    //  📘 FACEBOOK
    // ═══════════════════════════════════════════
    {
        name: 'facebook',
        aliases: ['fb', 'fbdl'],
        cooldown: 15000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📘');

            const url = extractUrl(msg, args);
            if (!url) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO URL*\n${MID}\n   Usage: .fb <url>\n${BOT}`, msg);
            }

            try {
                await react('⏳');
                const dl = await fetchJson(API.facebook + encodeURIComponent(url));
                const data = dl?.result || dl?.data || dl;

                const video = data?.video_hd || data?.hd || data?.video || data?.sd || data?.url;
                if (!video) throw new Error('No video found');

                await sock.sendMessage(from, {
                    video: { url: video },
                    mimetype: 'video/mp4',
                    caption:
`${TOP}
   📘 *FACEBOOK*
${MID}
   📌 *Format* : MP4 HD
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
    //  🐦 TWITTER / X
    // ═══════════════════════════════════════════
    {
        name: 'twitter',
        aliases: ['x', 'twdl'],
        cooldown: 15000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🐦');

            const url = extractUrl(msg, args);
            if (!url) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO URL*\n${MID}\n   Usage: .twitter <url>\n${BOT}`, msg);
            }

            try {
                await react('⏳');
                const dl = await fetchJson(API.twitter + encodeURIComponent(url));
                const data = dl?.result || dl?.data || dl;

                const media = data?.media || data?.videos || data?.images || [];
                const list = Array.isArray(media) ? media : [media];

                if (list.length === 0) throw new Error('No media found');

                for (const item of list.slice(0, 4)) {
                    const mediaUrl = typeof item === 'string' ? item : item.url || item.link;
                    const isVideo = /\.mp4|video/i.test(mediaUrl);

                    if (isVideo) {
                        await sock.sendMessage(from, { video: { url: mediaUrl } }, { quoted: msg });
                    } else {
                        await sock.sendMessage(from, { image: { url: mediaUrl } }, { quoted: msg });
                    }
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
    //  📌 PINTEREST
    // ═══════════════════════════════════════════
    {
        name: 'pinterest',
        aliases: ['pin', 'pindl'],
        cooldown: 15000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📌');

            const url = extractUrl(msg, args);
            if (!url) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO URL*\n${MID}\n   Usage: .pin <url>\n${BOT}`, msg);
            }

            try {
                await react('⏳');
                const dl = await fetchJson(API.pinterest + encodeURIComponent(url));
                const data = dl?.result || dl?.data || dl;
                const media = data?.url || data?.image || data?.video;

                if (!media) throw new Error('No media');

                const isVideo = /\.mp4|video/i.test(media);
                if (isVideo) {
                    await sock.sendMessage(from, { video: { url: media } }, { quoted: msg });
                } else {
                    await sock.sendMessage(from, {
                        image: { url: media },
                        caption:
`${TOP}
   📌 *PINTEREST*
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
                    }, { quoted: msg });
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
    //  🔗 SMART DOWNLOADER — Auto-detect URL
    // ═══════════════════════════════════════════
    {
        name: 'dl',
        aliases: ['download', 'save'],
        cooldown: 15000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔗');

            const url = extractUrl(msg, args);
            if (!url) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO URL*
${MID}
   Send any social media link:
   • YouTube
   • Instagram
   • TikTok
   • Facebook
   • Twitter / X
   • Pinterest
${MID}
   💡 Usage: .dl <url>
${BOT}`, msg);
            }

            const det = detectUrl(url);
            if (!det) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *UNSUPPORTED*\n${MID}\n   Platform not supported\n${BOT}`, msg);
            }

            await react('⏳');

            // Route to appropriate plugin
            const routeMap = {
                youtube:   'song',
                instagram: 'instagram',
                tiktok:    'tiktok',
                facebook:  'facebook',
                twitter:   'twitter',
                pinterest: 'pinterest',
            };

            const targetCmd = routeMap[det.type];
            const { plugins } = require('../handlers/message');

            const plugin = [...plugins.values()].find(p => p.name === targetCmd);
            if (!plugin) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *NOT AVAILABLE*\n${MID}\n   ${det.type} downloader missing\n${BOT}`, msg);
            }

            try {
                await plugin.run({ sock, from, msg, sender: '', args: [url], react, helper: h, config });
            } catch (err) {
                await react('❌');
            }
        }
    },

];