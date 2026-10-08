// ===============================================
//  💚 SABA MD — MESSAGE HANDLER + PLUGIN LOADER
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Royal Style · React · Antilink · Welcome
// ===============================================

const fs   = require('fs-extra');
const path = require('path');
const config = require('../config');
const { fancyLog } = require('../utils/logger');
const helper = require('../utils/helper');
const { isOnCooldown } = require('../utils/antiSpam');
const { getSettings, saveSettings } = require('../utils/groupSettings');

// ===============================================
//  📦 PLUGIN REGISTRY
// ===============================================
const plugins = new Map();
const aliases = new Map();

// ===============================================
//  🎨 STYLE (shared with plugins)
// ===============================================
const TOP  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';
const MID  = '━━━━━━━━━━━━━━━━━━';
const BOT  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';

// ===============================================
//  🔄 LOAD ALL PLUGINS
// ===============================================
function loadPlugins() {
    const pluginDir = path.join(__dirname, '..', 'plugins');

    if (!fs.existsSync(pluginDir)) {
        fancyLog('WARN', 'plugins/ folder not found — creating empty one');
        fs.ensureDirSync(pluginDir);
        return;
    }

    const files = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'));

    if (files.length === 0) {
        fancyLog('WARN', 'No plugins found in plugins/');
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
                if (!p.name || typeof p.run !== 'function') {
                    fancyLog('WARN', `Skipping invalid plugin: ${file}`);
                    continue;
                }

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
    LINK_REGEX.lastIndex = 0;   // reset regex state
    return LINK_REGEX.test(text);
}

function isGroupLink(text) {
    return /chat\.whatsapp\.com\//i.test(text || '');
}

// ===============================================
//  📸 MEDIA TYPE DETECTION
// ===============================================
function getMediaType(msg) {
    const m = msg.message;
    if (!m) return null;

    if (m.imageMessage)      return { type: 'image',    data: m.imageMessage,    mimetype: m.imageMessage.mimetype };
    if (m.videoMessage)      return { type: 'video',    data: m.videoMessage,    mimetype: m.videoMessage.mimetype };
    if (m.audioMessage)      return { type: 'audio',    data: m.audioMessage,    mimetype: m.audioMessage.mimetype };
    if (m.stickerMessage)    return { type: 'sticker',  data: m.stickerMessage,  mimetype: m.stickerMessage.mimetype };
    if (m.documentMessage)   return { type: 'document', data: m.documentMessage, mimetype: m.documentMessage.mimetype };
    if (m.contactMessage)    return { type: 'contact',  data: m.contactMessage };
    if (m.locationMessage)   return { type: 'location', data: m.locationMessage };
    if (m.viewOnceMessage)   return { type: 'viewonce', data: m.viewOnceMessage };
    if (m.viewOnceMessageV2) return { type: 'viewonce', data: m.viewOnceMessageV2 };
    if (m.buttonsResponseMessage) return { type: 'button',  data: m.buttonsResponseMessage };
    if (m.listResponseMessage)    return { type: 'list',    data: m.listResponseMessage };
    if (m.reactionMessage)        return { type: 'reaction',data: m.reactionMessage };

    return null;
}

// ===============================================
//  📥 DOWNLOAD QUOTED MEDIA (helper for plugins)
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
async function handleAntilink(sock, msg, from, sender, text) {
    try {
        const settings = getSettings(from);
        if (!settings.antilink) return false;
        if (!containsLink(text)) return false;

        // Owner and admins are exempt
        if (helper.isOwner(sender)) return false;

        // Get group metadata to check admin
        const meta = await sock.groupMetadata(from);
        const isSenderAdmin = meta.participants.some(p =>
            helper.cleanJid(p.id) === helper.cleanJid(sender) &&
            (p.admin === 'admin' || p.admin === 'superadmin')
        );
        if (isSenderAdmin) return false;

        // Bot must be admin to delete
        const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';
        const isBotAdmin = meta.participants.some(p =>
            helper.cleanJid(p.id) === helper.cleanJid(botJid) &&
            (p.admin === 'admin' || p.admin === 'superadmin')
        );
        if (!isBotAdmin) return false;

        // Delete the message
        await sock.sendMessage(from, {
            delete: msg.key
        });

        // Warn the user
        const action = settings.antilink_action || 'warn';
        const caption =
`${TOP}
   🔗 *ANTILINK DETECTED*
${MID}
   ⚠️ *@${helper.cleanJid(sender)}*
   Links are not allowed here!
${MID}
   ├ 👑 *Action* : ${action === 'kick' ? 'Kicked' : 'Warning'}
   ├ 🕒 *Time*   : ${new Date().toLocaleTimeString(config.TIMEZONE)}
   └ 💡 *Note*   : Repeated = Kick
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

        await sock.sendMessage(from, {
            text: caption,
            mentions: [msg.key.participant || msg.key.remoteJid]
        });

        // If action is kick, kick them
        if (action === 'kick') {
            await sock.groupParticipantsUpdate(from, [sender], 'remove');
        }

        fancyLog('BLOCK', `Antilink triggered in ${from} by ${sender}`);
        return true;
    } catch (err) {
        fancyLog('ERROR', `Antilink: ${err.message}`);
        return false;
    }
}

// ===============================================
//  👋 WELCOME / GOODBYE HANDLER
// ===============================================
async function handleGroupParticipants(sock, update) {
    try {
        const { id, participants, action } = update;
        if (!id || !participants || !action) return;

        const settings = getSettings(id);

        // ─── Welcome ───
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
   ├ 🕒 *Time*    : ${new Date().toLocaleTimeString(config.TIMEZONE)}
   ├ 📅 *Date*    : ${new Date().toLocaleDateString(config.TIMEZONE)}
   └ 🌸 *Enjoy your stay!*
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

                    await helper.sendWithLogo(sock, id, caption, null, [jid]);
                }
            } catch (err) {
                fancyLog('ERROR', `Welcome: ${err.message}`);
            }
        }

        // ─── Goodbye ───
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
   ├ 🕒 *Time*      : ${new Date().toLocaleTimeString(config.TIMEZONE)}
   └ 💚 *We'll miss you!*
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

                    await helper.sendWithLogo(sock, id, caption, null, [jid]);
                }
            } catch (err) {
                fancyLog('ERROR', `Goodbye: ${err.message}`);
            }
        }
    } catch (err) {
        fancyLog('ERROR', `GroupUpdate: ${err.message}`);
    }
}

// ===============================================
//  🎭 REACTION HANDLER
// ===============================================
async function handleReaction(sock, reactions) {
    try {
        for (const r of reactions) {
            const reaction = r.reaction?.text;
            if (!reaction) continue;
            fancyLog('MESSAGE', `Reaction: ${reaction} on ${r.key.id}`);
            // Future: react to reactions, log to DB, etc.
        }
    } catch (err) {
        fancyLog('ERROR', `Reaction: ${err.message}`);
    }
}

// ===============================================
//  🗑️ MESSAGE UPDATE HANDLER (edit/delete)
// ===============================================
async function handleMessageUpdate(sock, updates) {
    try {
        for (const u of updates) {
            // Future: detect deleted messages, edited messages
            // For now, just log
            if (u.update?.message === null) {
                // Message was deleted
                // fancyLog('DEBUG', `Message deleted: ${u.key.id}`);
            }
        }
    } catch (err) {
        fancyLog('ERROR', `MessageUpdate: ${err.message}`);
    }
}

// ===============================================
//  📩 MAIN MESSAGE HANDLER
// ===============================================
async function handleMessage(sock, msg) {
    try {
        if (!msg.message) return;
        if (msg.key.fromMe) return;

        const from    = msg.key.remoteJid;
        const isGroup = helper.isGroup(from);
        const sender  = helper.getSender(msg);
        const text    = helper.getText(msg);
        const isOwner = helper.isOwner(sender);

        // ─── Ignore status broadcast ───
        if (from === 'status@broadcast') return;

        // ─── ANTILINK CHECK (before anything else) ───
        if (isGroup && text && !isOwner) {
            const blocked = await handleAntilink(sock, msg, from, sender, text);
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
                text: `${TOP}\n   ❌ *ACCESS DENIED*\n${MID}\n   👑 Owner only command\n${BOT}`
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
                        text: `${TOP}\n   ❌ *ADMIN ONLY*\n${MID}\n   🛡️ Group admins only\n${BOT}`
                    }, { quoted: msg });
                }
            } catch {}
        }

        // ─── Cooldown ───
        const cooldownMs = plugin.cooldown ?? config.cmdCooldown ?? 3000;
        if (cooldownMs > 0 && !isOwner) {
            const wait = isOnCooldown(sender, plugin.name, cooldownMs);
            if (wait > 0) {
                return sock.sendMessage(from, {
                    text: `${TOP}\n   ⏳ *SLOW DOWN*\n${MID}\n   Wait *${wait}s* before .${plugin.name}\n${BOT}`
                }, { quoted: msg });
            }
        }

        // ─── Log ───
        fancyLog('COMMAND', `.${plugin.name} ${args.join(' ')} — ${sender}`);

        // ─── Auto read ───
        if (config.autoRead) {
            try { await sock.readMessages([msg.key]); } catch {}
        }

        // ─── Auto typing (DM only) ───
        if (config.autoTyping && !isGroup) {
            try { await sock.sendPresenceUpdate('composing', from); } catch {}
        }

        // ─── Build context ───
        const ctx = {
            // Core
            sock, msg, from, sender, isGroup, isOwner,
            args, text, command: plugin.name, prefix,

            // Config & helpers
            config, helper, plugins,

            // Media info
            media: getMediaType(msg),
            hasMedia: Boolean(getMediaType(msg)),

            // Shortcuts
            reply: (t, opts = {}) => sock.sendMessage(from, { text: t, ...opts }, { quoted: msg }),
            react: (emoji) => sock.sendMessage(from, { react: { text: emoji, key: msg.key } }).catch(() => {}),
            send: (content, opts = {}) => sock.sendMessage(from, content, { quoted: msg, ...opts }),

            // Media helpers
            downloadQuotedMedia: (type) => downloadQuotedMedia(msg, type),

            // Group helpers
            getSettings: () => getSettings(from),
            saveSettings,
        };

        // ─── Run plugin ───
        try {
            await plugin.run(ctx);
        } catch (err) {
            fancyLog('ERROR', `[${plugin.name}] ${err.message}`);
            await sock.sendMessage(from, {
                text: `${TOP}\n   ❌ *COMMAND ERROR*\n${MID}\n   ${err.message.slice(0, 200)}\n${BOT}`
            }, { quoted: msg });
        }

    } catch (err) {
        fancyLog('ERROR', `handleMessage: ${err.message}`);
    }
}

// ===============================================
//  ⚙️ EVENT SETUP — Called from index.js
// ===============================================
function setupEvents(sock) {
    // Welcome/Goodbye
    sock.ev.on('group-participants.update', (update) => {
        handleGroupParticipants(sock, update);
    });

    // Reactions
    sock.ev.on('messages.reaction', (reactions) => {
        handleReaction(sock, reactions);
    });

    // Message updates (edit/delete detection)
    sock.ev.on('messages.update', (updates) => {
        handleMessageUpdate(sock, updates);
    });

    fancyLog('INFO', '✅ Group events registered (welcome/goodbye/reactions)');
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
    // Helpers for external use
    containsLink,
    isGroupLink,
    getMediaType,
    downloadQuotedMedia,
    handleGroupParticipants,
    handleReaction,
    handleMessageUpdate,
};