// ===============================================
//  💚 SABA MD — MESSAGE HANDLER (Multi-Session)
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎯 Per-session routing + caching
//  🔒 FINAL multi-user version
// ===============================================

const fs   = require('fs-extra');
const path = require('path');
const config = require('../config');
const { fancyLog } = require('../utils/logger');
const helper = require('../utils/helper');
const { isOnCooldown } = require('../utils/antiSpam');
const { getSettings, saveSettings } = require('../utils/groupSettings');

// ===============================================
//  📦 PLUGIN REGISTRY (Shared across all sessions)
// ===============================================
const plugins = new Map();
const aliases = new Map();

// ===============================================
//  🎨 STYLE
// ===============================================
const TOP  = '─❍══ ⃟ ⃟ ⃟ ⃟ ══⊷❍';
const MID  = '━━━━━━━━━━━━━━━━━━';
const BOT  = '─❍══ ⃟ ⃟ ╟ ══⊷❍';

// ===============================================
//  💾 MESSAGE CACHE — PER SESSION
// ===============================================
const SESSION_CACHE = new Map();
const CACHE_TTL = 60 * 60 * 1000;   // 1 hour
const CACHE_MAX = 1000;              // per session

function getCacheForSession(sessionNumber) {
    if (!SESSION_CACHE.has(sessionNumber)) {
        SESSION_CACHE.set(sessionNumber, new Map());
    }
    return SESSION_CACHE.get(sessionNumber);
}

function cacheMessage(sessionNumber, msg) {
    try {
        const id = msg.key.id;
        if (!id) return;

        const cache = getCacheForSession(sessionNumber);
        cache.set(id, {
            msg,
            from: msg.key.remoteJid,
            sender: msg.key.participant || msg.key.remoteJid,
            timestamp: Date.now(),
        });

        if (cache.size > CACHE_MAX) {
            const now = Date.now();
            for (const [k, v] of cache) {
                if (now - v.timestamp > CACHE_TTL) cache.delete(k);
            }
        }
    } catch {}
}

function getCachedMessage(sessionNumber, id) {
    const cache = SESSION_CACHE.get(sessionNumber);
    if (!cache) return null;

    const entry = cache.get(id);
    if (!entry) return null;

    if (Date.now() - entry.timestamp > CACHE_TTL) {
        cache.delete(id);
        return null;
    }
    return entry;
}

function clearSessionCache(sessionNumber) {
    SESSION_CACHE.delete(sessionNumber);
}

// ===============================================
//  🔄 LOAD ALL PLUGINS
// ===============================================
function loadPlugins() {
    const pluginDir = path.join(__dirname, '..', 'plugins');

    if (!fs.existsSync(pluginDir)) {
        fancyLog('WARN', 'plugins/ folder not found');
        fs.ensureDirSync(pluginDir);
        return;
    }

    const files = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'));

    if (files.length === 0) {
        fancyLog('WARN', 'No plugins found');
        return;
    }

    let loaded = 0;
    let failed = 0;

    for (const file of files) {
        try {
            const pluginPath = path.join(pluginDir, file);
            delete require.cache[require.resolve(pluginPath)];
            const mod = require(pluginPath);
            const list = Array.isArray(mod) ? mod : [mod];

            for (const p of list) {
                if (!p.name || typeof p.run !== 'function') continue;

                plugins.set(p.name.toLowerCase(), p);

                if (Array.isArray(p.aliases)) {
                    for (const a of p.aliases) {
                        aliases.set(a.toLowerCase(), p.name.toLowerCase());
                    }
                }
                loaded++;
            }
        } catch (err) {
            failed++;
            fancyLog('ERROR', `Failed to load ${file}: ${err.message}`);
        }
    }

    fancyLog('SUCCESS', `Loaded ${loaded} commands from ${files.length} files (${failed} failed)`);
}

// ===============================================
//  🔗 LINK DETECTION
// ===============================================
const LINK_REGEX = /(https?:\/\/[^\s]+|www\.[^\s]+|chat\.whatsapp\.com\/[^\s]+|wa\.me\/[^\s]+|t\.me\/[^\s]+|bit\.ly\/[^\s]+|tinyurl\.com\/[^\s]+|youtu\.be\/[^\s]+|youtube\.com\/[^\s]+)/gi;

function containsLink(text) {
    if (!text) return false;
    LINK_REGEX.lastIndex = 0;
    return LINK_REGEX.test(text);
}

// ===============================================
//  📸 MEDIA TYPE DETECTION
// ===============================================
function getMediaType(msg) {
    const m = msg.message;
    if (!m) return null;

    if (m.imageMessage)           return { type: 'image',    data: m.imageMessage };
    if (m.videoMessage)           return { type: 'video',    data: m.videoMessage };
    if (m.audioMessage)           return { type: 'audio',    data: m.audioMessage };
    if (m.stickerMessage)         return { type: 'sticker',  data: m.stickerMessage };
    if (m.documentMessage)        return { type: 'document', data: m.documentMessage };
    if (m.viewOnceMessage)        return { type: 'viewonce', data: m.viewOnceMessage };
    if (m.viewOnceMessageV2)      return { type: 'viewonce', data: m.viewOnceMessageV2 };

    return null;
}

// ===============================================
//  📥 DOWNLOAD QUOTED MEDIA
// ===============================================
async function downloadQuotedMedia(msg, type = 'image') {
    try {
        const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
        const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
        if (!quoted) return null;

        const mediaMsg = quoted[`${type}Message`];
        if (!mediaMsg) return null;

        const stream = await downloadContentFromMessage(mediaMsg, type);
        let buffer = Buffer.from([]);
        for await (const chunk of stream) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        return buffer;
    } catch {
        return null;
    }
}

// ===============================================
//  🔗 ANTILINK HANDLER
// ===============================================
async function handleAntilink(sock, msg, from, sender, text, sessionNumber) {
    try {
        const settings = getSettings(from);
        if (!settings.antilink) return false;
        if (!containsLink(text)) return false;
        if (helper.isOwner(sender)) return false;

        const meta = await sock.groupMetadata(from);

        const isSenderAdmin = meta.participants.some(p =>
            helper.cleanJid(p.id) === helper.cleanJid(sender) &&
            (p.admin === 'admin' || p.admin === 'superadmin')
        );
        if (isSenderAdmin) return false;

        const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmin = meta.participants.some(p =>
            helper.cleanJid(p.id) === helper.cleanJid(botJid) &&
            (p.admin === 'admin' || p.admin === 'superadmin')
        );
        if (!isBotAdmin) return false;

        await sock.sendMessage(from, { delete: msg.key });

        const action = settings.antilink_action || 'warn';
        const caption =
`${TOP}
   🔗 *ANTILINK DETECTED*
${MID}
   ⚠️ *@${helper.cleanJid(sender)}*
   Links are not allowed here!
${MID}
   ├ 👑 *Action* : ${action === 'kick' ? 'Kicked' : 'Warning'}
   ├ 🕒 *Time*   : ${helper.nowTime()}
   └ 💡 *Note*   : Repeated = Kick
${MID}
   💖 *Saba MD*
${BOT}`;

        await sock.sendMessage(from, {
            text: caption,
            mentions: [msg.key.participant || msg.key.remoteJid]
        });

        if (action === 'kick') {
            await sock.groupParticipantsUpdate(from, [sender], 'remove');
        }

        fancyLog('BLOCK', `[${sessionNumber}] Antilink triggered in ${from}`);
        return true;
    } catch (err) {
        fancyLog('ERROR', `[${sessionNumber}] Antilink: ${err.message}`);
        return false;
    }
}

// ===============================================
//  🗑️ ANTIDELETE HANDLER
// ===============================================
async function handleAntidelete(sock, updates, sessionNumber) {
    try {
        for (const u of updates) {
            const isDeleted =
                u.update?.message === null ||
                u.update?.messageStubType === 1 ||
                u.update?.messageStubParameters?.[0] === 'Message deleted';

            if (!isDeleted) continue;

            const msgId = u.key?.id;
            if (!msgId) continue;

            const cached = getCachedMessage(sessionNumber, msgId);
            if (!cached) continue;

            const { msg: originalMsg, from, sender } = cached;
            const isGroup = helper.isGroup(from);

            let antideleteOn = false;
            if (isGroup) {
                const settings = getSettings(from);
                antideleteOn = settings.antidelete === true;
            } else {
                antideleteOn = config.ANTIDELETE_DM === true;
            }

            if (!antideleteOn) continue;
            if (helper.isOwner(sender)) continue;
            if (originalMsg.key.fromMe) continue;

            const media = getMediaType(originalMsg);
            const text = helper.getText(originalMsg);

            const header =
`${TOP}
   🗑️ *ANTI-DELETE*
${MID}
   👤 *Sender* : @${helper.cleanJid(sender)}
   📍 *Chat*   : ${isGroup ? 'Group' : 'DM'}
   🕒 *Time*   : ${helper.nowTime()}
${MID}
   📝 *Deleted Message:*`;

            const mentions = [sender];

            try {
                if (text) {
                    await sock.sendMessage(from, {
                        text: `${header}\n   ${text}\n${MID}\n   💖 *Saba MD*\n${BOT}`,
                        mentions,
                    });
                }

                if (media && media.type) {
                    const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

                    if (['image', 'video', 'audio', 'sticker', 'document'].includes(media.type)) {
                        try {
                            const stream = await downloadContentFromMessage(media.data, media.type);
                            let buffer = Buffer.from([]);
                            for await (const chunk of stream) {
                                buffer = Buffer.concat([buffer, chunk]);
                            }

                            if (buffer.length > 0) {
                                const caption = `${header}\n   [${media.type.toUpperCase()}]\n${MID}\n   💖 *Saba MD*\n${BOT}`;
                                const payload = { caption, mentions };

                                if (media.type === 'image')    payload.image = buffer;
                                if (media.type === 'video')    payload.video = buffer;
                                if (media.type === 'audio')    { payload.audio = buffer; payload.mimetype = 'audio/mp4'; }
                                if (media.type === 'sticker')  payload.sticker = buffer;

                                await sock.sendMessage(from, payload);
                            }
                        } catch (err) {
                            fancyLog('ERROR', `[${sessionNumber}] Antidelete media: ${err.message}`);
                        }
                    }
                }

                fancyLog('SUCCESS', `[${sessionNumber}] Antidelete — ${msgId}`);
            } catch (err) {
                fancyLog('ERROR', `[${sessionNumber}] Antidelete send: ${err.message}`);
            }

            const cache = SESSION_CACHE.get(sessionNumber);
            if (cache) cache.delete(msgId);
        }
    } catch (err) {
        fancyLog('ERROR', `[${sessionNumber}] handleAntidelete: ${err.message}`);
    }
}

// ===============================================
//  👋 WELCOME / GOODBYE HANDLER
// ===============================================
async function handleGroupParticipants(sock, update, sessionNumber) {
    try {
        const { id, participants, action } = update;
        if (!id || !participants || !action) return;

        const settings = getSettings(id);

        if (action === 'add' && settings.welcome) {
            try {
                const meta = await sock.groupMetadata(id);
                for (const jid of participants) {
                    const num = helper.cleanJid(jid);
                    const caption =
`${TOP}
   👋 *WELCOME*
${MID}
   💚 *Hey @${num}!*
   🎀 Welcome to *${meta.subject}*
${MID}
   ├ 👥 *Members* : ${meta.participants.length}
   ├ 🕒 *Time*    : ${helper.nowTime()}
   └ 🌸 *Enjoy your stay!*
${MID}
   💖 *Saba MD*
${BOT}`;
                    await helper.sendWithLogo(sock, id, caption, null, [jid]);
                }
            } catch (err) {
                fancyLog('ERROR', `[${sessionNumber}] Welcome: ${err.message}`);
            }
        }

        if (action === 'remove' && settings.goodbye) {
            try {
                const meta = await sock.groupMetadata(id);
                for (const jid of participants) {
                    const num = helper.cleanJid(jid);
                    const caption =
`${TOP}
   💔 *GOODBYE*
${MID}
   🌸 *@${num}* has left the group
${MID}
   ├ 👥 *Remaining* : ${meta.participants.length}
   ├ 🕒 *Time*      : ${helper.nowTime()}
   └ 💚 *We'll miss you!*
${MID}
   💖 *Saba MD*
${BOT}`;
                    await helper.sendWithLogo(sock, id, caption, null, [jid]);
                }
            } catch (err) {
                fancyLog('ERROR', `[${sessionNumber}] Goodbye: ${err.message}`);
            }
        }
    } catch (err) {
        fancyLog('ERROR', `[${sessionNumber}] GroupUpdate: ${err.message}`);
    }
}

// ===============================================
//  🎭 REACTION HANDLER
// ===============================================
async function handleReaction(sock, reactions, sessionNumber) {
    try {
        for (const r of reactions) {
            const reaction = r.reaction?.text;
            if (!reaction) continue;
            fancyLog('MESSAGE', `[${sessionNumber}] Reaction: ${reaction}`);
        }
    } catch (err) {
        fancyLog('ERROR', `[${sessionNumber}] Reaction: ${err.message}`);
    }
}

// ===============================================
//  📩 MAIN MESSAGE HANDLER (Multi-Session)
// ===============================================
async function handleMessage(sock, msg, sessionNumber = 'unknown') {
    try {
        if (!msg.message) return;

        const from    = msg.key.remoteJid;
        const isGroup = helper.isGroup(from);
        const sender  = helper.getSender(msg);
        const text    = helper.getText(msg);
        const isOwner = helper.isOwner(sender);

        // ─── CACHE (for antidelete) ───
        cacheMessage(sessionNumber, msg);

        // ✅ FIX: Bot apne hi messages ko ignore kare, LEKIN agar wo command ho toh process kare
        if (msg.key.fromMe) {
            // Agar text nahi hai ya prefix se shuru nahi hota, toh return kar do (taaki bot apne hi replies ko reply na kare)
            if (!text || !text.startsWith(config.PREFIX)) return;
        }

        if (from === 'status@broadcast') return;

        // ─── ANTILINK ───
        if (isGroup && text && !isOwner) {
            const blocked = await handleAntilink(sock, msg, from, sender, text, sessionNumber);
            if (blocked) return;
        }

        if (!text) return;

        // ─── Prefix check ───
        const prefix = config.PREFIX;
        if (!text.startsWith(prefix)) return;

        const trimmed = text.slice(prefix.length).trim();
        if (!trimmed) return;

        const parts = trimmed.split(/\s+/);
        const cmdRaw = parts[0].toLowerCase();
        const args = parts.slice(1);

        // ─── Find plugin ───
        let plugin = plugins.get(cmdRaw);
        if (!plugin && aliases.has(cmdRaw)) {
            plugin = plugins.get(aliases.get(cmdRaw));
        }
        if (!plugin) return;

        // ─── Owner check ───
        if (plugin.ownerOnly && !isOwner) {
            return sock.sendMessage(from, {
                text: `${TOP}\n   ❌ *ACCESS DENIED*\n${MID}\n   👑 Owner only\n${BOT}`
            }, { quoted: msg });
        }

        // ─── Group-only check ───
        if (plugin.groupOnly && !isGroup) {
            return sock.sendMessage(from, {
                text: `${TOP}\n   ❌ *GROUP ONLY*\n${MID}\n   👥 Use in a group\n${BOT}`
            }, { quoted: msg });
        }

        // ─── Private-only check ───
        if (plugin.privateOnly && isGroup) {
            return sock.sendMessage(from, {
                text: `${TOP}\n   ❌ *PRIVATE ONLY*\n${MID}\n   💬 Use in DM\n${BOT}`
            }, { quoted: msg });
        }

        // ─── Admin check ───
        if (plugin.adminOnly && isGroup && !isOwner) {
            try {
                const meta = await sock.groupMetadata(from);
                const isAdmin = meta.participants.some(p =>
                    helper.cleanJid(p.id) === helper.cleanJid(sender) &&
                    (p.admin === 'admin' || p.admin === 'superadmin')
                );
                if (!isAdmin) {
                    return sock.sendMessage(from, {
                        text: `${TOP}\n   ❌ *ADMIN ONLY*\n${MID}\n   🛡️ Admins only\n${BOT}`
                    }, { quoted: msg });
                }
            } catch {}
        }

        // ─── Cooldown ───
        const cooldownMs = plugin.cooldown ?? config.cmdCooldown ?? 3000;
        if (cooldownMs > 0 && !isOwner) {
            const wait = isOnCooldown(`${sessionNumber}:${sender}`, plugin.name, cooldownMs);
            if (wait > 0) {
                return sock.sendMessage(from, {
                    text: `${TOP}\n   ⏳ *SLOW DOWN*\n${MID}\n   Wait *${wait}s*\n${BOT}`
                }, { quoted: msg });
            }
        }

        // ─── Log ───
        fancyLog('COMMAND', `[${sessionNumber}] .${plugin.name} — ${sender}`);

        // ─── Auto read ───
        if (config.autoRead) {
            try { await sock.readMessages([msg.key]); } catch {}
        }

        // ─── Auto typing ───
        if (config.autoTyping && !isGroup) {
            try { await sock.sendPresenceUpdate('composing', from); } catch {}
        }

        // ─── Context ───
        const ctx = {
            sock, msg, from, sender, isGroup, isOwner,
            args, text, command: plugin.name, prefix,
            config, helper, plugins,

            sessionNumber,
            botNumber: sock.user?.id?.split(':')[0],

            media: getMediaType(msg),
            hasMedia: Boolean(getMediaType(msg)),

            reply: (t, opts = {}) => sock.sendMessage(from, { text: t, ...opts }, { quoted: msg }),
            react: (emoji) => sock.sendMessage(from, { react: { text: emoji, key: msg.key } }).catch(() => {}),
            send: (content, opts = {}) => sock.sendMessage(from, content, { quoted: msg, ...opts }),

            downloadQuotedMedia: (type) => downloadQuotedMedia(msg, type),

            getSettings: () => getSettings(from),
            saveSettings,
        };

        // ─── Run plugin ───
        try {
            await plugin.run(ctx);
        } catch (err) {
            fancyLog('ERROR', `[${sessionNumber}] [${plugin.name}] ${err.message}`);
            await sock.sendMessage(from, {
                text: `${TOP}\n   ❌ *COMMAND ERROR*\n${MID}\n   ${err.message.slice(0, 200)}\n${BOT}`
            }, { quoted: msg });
        }

    } catch (err) {
        fancyLog('ERROR', `[${sessionNumber}] handleMessage: ${err.message}`);
    }
}

// ===============================================
//  ⚙️ EVENT SETUP (Per Session)
// ===============================================
function setupEvents(sock, sessionNumber = 'unknown') {
    sock.ev.on('group-participants.update', (update) => {
        handleGroupParticipants(sock, update, sessionNumber);
    });

    sock.ev.on('messages.reaction', (reactions) => {
        handleReaction(sock, reactions, sessionNumber);
    });

    sock.ev.on('messages.update', (updates) => {
        handleAntidelete(sock, updates, sessionNumber);
    });

    fancyLog('INFO', `[${sessionNumber}] ✅ Events registered`);
}

// ===============================================
//  📤 EXPORTS
// ===============================================
module.exports = {
    handleMessage,
    loadPlugins,
    setupEvents,
    plugins,
    aliases,
    containsLink,
    getMediaType,
    downloadQuotedMedia,
    handleAntidelete,
    handleGroupParticipants,
    handleReaction,
    cacheMessage,
    getCachedMessage,
    clearSessionCache,
    SESSION_CACHE,
};