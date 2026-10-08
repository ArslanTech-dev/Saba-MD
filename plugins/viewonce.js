// ===============================================
//  💚 SABA MD — VIEW ONCE DOWNLOADER
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Royal Style · React Enabled
//  🌍 Works in Groups & DMs
//  📦 Self-contained — no other file changes
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');
const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

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

// ─── Unwrap viewOnce message ───
function unwrapViewOnce(msg) {
    const m = msg.message;
    if (!m) return null;

    // Direct view-once (V1)
    if (m.viewOnceMessage?.message) {
        return m.viewOnceMessage.message;
    }

    // View-once V2 (newer)
    if (m.viewOnceMessageV2?.message) {
        return m.viewOnceMessageV2.message;
    }

    // View-once V2 extension (with caption)
    if (m.viewOnceMessageV2Extension?.message) {
        return m.viewOnceMessageV2Extension.message;
    }

    return null;
}

// ─── Get viewonce from current msg OR quoted msg ───
function getViewOnceSource(msg) {
    // Check current message first
    const selfVO = unwrapViewOnce(msg);
    if (selfVO) {
        return {
            source: 'self',
            wrapped: selfVO,
            key: msg.key,
            sender: msg.key.participant || msg.key.remoteJid,
        };
    }

    // Check quoted message
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quoted) {
        const quotedVO = unwrapViewOnce({ message: quoted });
        if (quotedVO) {
            return {
                source: 'quoted',
                wrapped: quotedVO,
                key: {
                    remoteJid: msg.key.remoteJid,
                    id: msg.message.extendedTextMessage.contextInfo.stanzaId,
                    participant: msg.message.extendedTextMessage.contextInfo.participant,
                },
                sender: msg.message.extendedTextMessage.contextInfo.participant,
            };
        }
    }

    return null;
}

// ─── Download media buffer ───
async function downloadMedia(mediaMessage, type) {
    const stream = await downloadContentFromMessage(mediaMessage, type);
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}

// ─── Detect media type inside viewonce ───
function detectMediaType(wrapped) {
    if (wrapped.imageMessage) return { type: 'image', data: wrapped.imageMessage };
    if (wrapped.videoMessage) return { type: 'video', data: wrapped.videoMessage };
    if (wrapped.audioMessage) return { type: 'audio', data: wrapped.audioMessage };
    return null;
}

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    // ═══════════════════════════════════════════
    //  👁️ VV — View Once Downloader
    // ═══════════════════════════════════════════
    {
        name: 'vv',
        aliases: ['viewonce', 'vo', 'reveal', 'open'],
        cooldown: 5000,
        run: async ({ sock, from, msg, sender, react, helper: h, isGroup }) => {
            await react('👁️');

            // ─── Find viewonce source ───
            const source = getViewOnceSource(msg);

            if (!source) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO VIEW-ONCE FOUND*
${MID}
   📌 *How to use:*
   ├ Send a view-once photo/video
   └ Then reply with *.vv*
${THIN}
   💡 *OR*
   ├ Send view-once directly to bot
   └ Then reply *.vv* on it
${THIN}
   💡 Bot must be able to see
   the view-once message.
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
            }

            const { wrapped } = source;
            const media = detectMediaType(wrapped);

            if (!media) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ❌ *UNSUPPORTED*
${MID}
   Only image/video supported
${BOT}`, msg);
            }

            // ─── Downloading ───
            await react('⏳');

            try {
                const buffer = await downloadMedia(media.data, media.type);

                if (!buffer || buffer.length === 0) {
                    throw new Error('Empty buffer');
                }

                const sizeMB = (buffer.length / 1024 / 1024).toFixed(2);
                const caption = media.data.caption || wrapped.caption || '';

                // ─── Build info caption ───
                const infoCaption =
`${TOP}
   👁️ *VIEW ONCE REVEALED*
${MID}
   📊 *Type* : ${media.type.toUpperCase()}
   📦 *Size* : ${sizeMB} MB
   👤 *From* : @${h.cleanJid(source.sender || sender)}
${caption ? `${THIN}\n   📝 *Caption:*\n   ${caption}\n` : ''}${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

                const mentions = [source.sender || msg.key.remoteJid];

                // ─── Send as image ───
                if (media.type === 'image') {
                    await sock.sendMessage(from, {
                        image: buffer,
                        caption: infoCaption,
                        mentions,
                    }, { quoted: msg });
                }

                // ─── Send as video ───
                else if (media.type === 'video') {
                    await sock.sendMessage(from, {
                        video: buffer,
                        caption: infoCaption,
                        mimetype: 'video/mp4',
                        mentions,
                    }, { quoted: msg });
                }

                // ─── Send as audio ───
                else if (media.type === 'audio') {
                    await sock.sendMessage(from, {
                        audio: buffer,
                        mimetype: 'audio/mp4',
                        ptt: media.data.ptt || false,
                    }, { quoted: msg });

                    await sock.sendMessage(from, {
                        text: infoCaption,
                        mentions,
                    }, { quoted: msg });
                }

                await react('✅');

            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}
   ❌ *DOWNLOAD FAILED*
${MID}
   ${err.message.slice(0, 150)}
${THIN}
   💡 *Possible reasons:*
   ├ Media expired on server
   ├ Network issue
   └ Bot missing permissions
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  👁️ VV2 — Alias for same thing (extra)
    // ═══════════════════════════════════════════
    {
        name: 'vv2',
        aliases: ['vo2', 'readvo'],
        cooldown: 5000,
        run: async ({ sock, from, msg, sender, react, helper: h }) => {
            await react('👁️');

            const source = getViewOnceSource(msg);

            if (!source) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO VIEW-ONCE*\n${MID}\n   Reply to a view-once message\n${BOT}`, msg);
            }

            const { wrapped } = source;
            const media = detectMediaType(wrapped);

            if (!media) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *UNSUPPORTED*\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const buffer = await downloadMedia(media.data, media.type);

                // Send without info caption (raw forward style)
                if (media.type === 'image') {
                    await sock.sendMessage(from, { image: buffer }, { quoted: msg });
                } else if (media.type === 'video') {
                    await sock.sendMessage(from, { video: buffer, mimetype: 'video/mp4' }, { quoted: msg });
                } else if (media.type === 'audio') {
                    await sock.sendMessage(from, { audio: buffer, mimetype: 'audio/mp4' }, { quoted: msg });
                }

                await react('✅');

            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

];