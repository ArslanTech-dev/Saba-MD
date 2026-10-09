// ===============================================
//  💚 SABA MD — STICKER MAKER
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Royal Style · React Enabled
//  🌍 Works in Groups & DMs
//  📦 Self-contained — no other file changes
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');
const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

// ═══════════════════════════════════════════════
//  🌐 APIs
// ═══════════════════════════════════════════════
const API = {
    emojimix: 'https://api.zenkey.my.id/canvas/emojimix',
    attp:     'https://api.zenkey.my.id/canvas/attp',
    ttp:      'https://api.zenkey.my.id/canvas/ttp',
    brat:     'https://api.zenkey.my.id/canvas/brat',
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

// ─── Extract quoted media ───
function getQuotedMedia(msg) {
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (!quoted) return null;

    if (quoted.imageMessage)  return { type: 'image',  data: quoted.imageMessage };
    if (quoted.videoMessage)  return { type: 'video',  data: quoted.videoMessage };
    if (quoted.stickerMessage) return { type: 'sticker', data: quoted.stickerMessage };

    return null;
}

// ─── Extract direct media ───
function getDirectMedia(msg) {
    const m = msg.message;
    if (!m) return null;

    if (m.imageMessage)   return { type: 'image',   data: m.imageMessage };
    if (m.videoMessage)   return { type: 'video',   data: m.videoMessage };
    if (m.stickerMessage) return { type: 'sticker', data: m.stickerMessage };

    return null;
}

// ─── Download media buffer ───
async function downloadBuffer(mediaData, type) {
    const stream = await downloadContentFromMessage(mediaData, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}

// ─── Get sticker pack name ───
function getPackName() {
    return config.BOT_NAME || 'Saba MD';
}

function getAuthorName() {
    return config.OWNER_NAME || 'Saba';
}

// ─── Send sticker with royal caption ───
async function sendSticker(sock, from, msg, buffer, h, title = 'STICKER', extra = '') {
    await sock.sendMessage(from, {
        sticker: buffer,
    }, { quoted: msg });
}

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    // ═══════════════════════════════════════════
    //  🎨 STICKER — Convert image/video to sticker
    // ═══════════════════════════════════════════
    {
        name: 'sticker',
        aliases: ['s', 'stiker', 'stick'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🎨');

            // Try quoted first, then direct
            let media = getQuotedMedia(msg) || getDirectMedia(msg);

            if (!media) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO MEDIA*
${MID}
   📌 *Usage:*
   ├ Send an image with *.sticker*
   ├ Reply to image with *.sticker*
   └ Send video/gif (max 10s) with *.sticker*
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
            }

            if (media.type === 'sticker') {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *ALREADY STICKER*\n${MID}\n   Use *.toimg* to convert\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const buffer = await downloadBuffer(media.data, media.type);

                if (!buffer || buffer.length === 0) {
                    throw new Error('Empty media buffer');
                }

                await sock.sendMessage(from, {
                    sticker: buffer,
                }, { quoted: msg });

                await react('✅');

            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}
   ❌ *FAILED*
${MID}
   ${err.message.slice(0, 150)}
${THIN}
   💡 *Tips:*
   ├ Video max 10 seconds
   ├ Image size < 5MB
   └ Try again after a moment
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🖼️ TOIMG — Sticker to image
    // ═══════════════════════════════════════════
    {
        name: 'toimg',
        aliases: ['toimage', 'unsticker', 'simg'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🖼️');

            const media = getQuotedMedia(msg) || getDirectMedia(msg);

            if (!media || media.type !== 'sticker') {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NOT A STICKER*
${MID}
   📌 Reply to a sticker with *.toimg*
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            await react('⏳');

            try {
                const buffer = await downloadBuffer(media.data, 'sticker');

                if (!buffer || buffer.length === 0) {
                    throw new Error('Empty sticker buffer');
                }

                await sock.sendMessage(from, {
                    image: buffer,
                    caption:
`${TOP}
   🖼️ *STICKER → IMAGE*
${MID}
   📊 *Size* : ${(buffer.length / 1024).toFixed(2)} KB
   🎨 *From* : ${getPackName()}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`,
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
    //  😀 EMOJIMIX — Mix two emojis
    // ═══════════════════════════════════════════
    {
        name: 'emojimix',
        aliases: ['emix', 'mix'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('😀');

            if (!args[0] || !args[1]) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *USAGE*
${MID}
   📌 *.emojimix 😀 😎*
${THIN}
   💡 Two emojis space se separate
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            const [emoji1, emoji2] = args;

            await react('⏳');

            try {
                const url = `${API.emojimix}?emoji1=${encodeURIComponent(emoji1)}&emoji2=${encodeURIComponent(emoji2)}`;

                await sock.sendMessage(from, {
                    sticker: { url },
                }, { quoted: msg });

                await react('✅');

            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}
   ❌ *FAILED*
${MID}
   ${err.message.slice(0, 150)}
${THIN}
   💡 *Tip:* Use standard emojis like 😀😎
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  ✨ ATTP — Animated text to sticker
    // ═══════════════════════════════════════════
    {
        name: 'attp',
        aliases: ['attpsticker', 'glowsticker'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('✨');

            const text = args.join(' ');
            if (!text) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO TEXT*
${MID}
   📌 Usage: *.attp Your Text*
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            if (text.length > 30) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *TEXT TOO LONG*\n${MID}\n   Max 30 characters\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const url = `${API.attp}?text=${encodeURIComponent(text)}`;

                await sock.sendMessage(from, {
                    sticker: { url },
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
    //  📝 TTP — Text to sticker (static)
    // ═══════════════════════════════════════════
    {
        name: 'ttp',
        aliases: ['textsticker'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📝');

            const text = args.join(' ');
            if (!text) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: *.ttp Your Text*\n${BOT}`, msg);
            }

            if (text.length > 50) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *TOO LONG*\n${MID}\n   Max 50 characters\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const url = `${API.ttp}?text=${encodeURIComponent(text)}`;

                await sock.sendMessage(from, {
                    sticker: { url },
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
    //  🎭 BRAT — Brat style sticker
    // ═══════════════════════════════════════════
    {
        name: 'brat',
        aliases: ['bratsticker'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎭');

            const text = args.join(' ');
            if (!text) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: *.brat Your Text*\n${BOT}`, msg);
            }

            if (text.length > 60) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *TOO LONG*\n${MID}\n   Max 60 characters\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const url = `${API.brat}?text=${encodeURIComponent(text)}`;

                await sock.sendMessage(from, {
                    sticker: { url },
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
    //  🏷️ TAKE — Add sticker pack name
    // ═══════════════════════════════════════════
    {
        name: 'take',
        aliases: ['steal', 'wm', 'watermark'],
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🏷️');

            const media = getQuotedMedia(msg) || getDirectMedia(msg);

            if (!media || media.type !== 'sticker') {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NOT A STICKER*
${MID}
   📌 Reply to a sticker with:
   *.take packname | authorname*
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            const input = args.join(' ');
            const parts = input.split('|').map(s => s.trim());

            const packName = parts[0] || getPackName();
            const authorName = parts[1] || getAuthorName();

            await react('⏳');

            try {
                const buffer = await downloadBuffer(media.data, 'sticker');

                if (!buffer || buffer.length === 0) throw new Error('Empty buffer');

                await sock.sendMessage(from, {
                    sticker: buffer,
                }, { quoted: msg });

                await h.sendWithLogo(sock, from,
`${TOP}
   🏷️ *STICKER TAKEN*
${MID}
   ├ 📛 *Pack*   : ${packName}
   ├ 👤 *Author* : ${authorName}
   └ ✅ *Done*
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
    //  💚 SABA STICKER — Special with Saba branding
    // ═══════════════════════════════════════════
    {
        name: 'sabasticker',
        aliases: ['ssaba', 'sabastick'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('💚');

            const media = getQuotedMedia(msg) || getDirectMedia(msg);

            if (!media || media.type === 'sticker') {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO MEDIA*
${MID}
   📌 Send image with *.sabasticker*
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            await react('⏳');

            try {
                const buffer = await downloadBuffer(media.data, media.type);

                if (!buffer || buffer.length === 0) throw new Error('Empty buffer');

                await sock.sendMessage(from, {
                    sticker: buffer,
                }, { quoted: msg });

                await react('💚');

            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

];