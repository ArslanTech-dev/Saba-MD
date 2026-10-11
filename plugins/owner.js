// ===============================================
//  💚 SABA MD — OWNER COMMANDS
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Royal Style · React Enabled
//  🔒 Owner-Only Commands
//  📦 Self-contained — no other file changes
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');
const fs = require('fs-extra');
const path = require('path');
const os = require('os');

// ═══════════════════════════════════════════════
//  🎨 STYLE
// ═══════════════════════════════════════════════
const TOP  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';
const MID  = '━━━━━━━━━━━━━━━━━━';
const THIN = '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄';
const BOT  = '─❍══ ⃟ ⃟ ⃟ ⃟ ══⊷❍';

// ═══════════════════════════════════════════════
//  🛠️ INTERNAL HELPERS
// ═══════════════════════════════════════════════

// ─── Extract target ───
function extractTarget(msg, args) {
    const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentions.length > 0) return mentions[0];

    const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (quoted) return quoted;

    if (args && args[0]) {
        const num = String(args[0]).replace(/\D/g, '');
        if (num.length >= 10) return `${num}@s.whatsapp.net`;
    }

    return null;
}

// ─── Format bytes ───
function formatBytes(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// ─── Progress bar ───
function bar(percent, length = 12) {
    const filled = Math.round((percent / 100) * length);
    return '█'.repeat(filled) + '░'.repeat(length - filled);
}

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    // ═══════════════════════════════════════════
    //  📢 BROADCAST — Send message to all chats
    // ═══════════════════════════════════════════
    {
        name: 'broadcast',
        aliases: ['bc', 'bcast'],
        ownerOnly: true,
        cooldown: 30000,
        run: async ({ sock, from, msg, args, react, helper: h, plugins }) => {
            await react('📢');

            let message = args.join(' ').trim();

            // If no args, check quoted
            if (!message) {
                const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (quoted) {
                    message = quoted.conversation
                        || quoted.extendedTextMessage?.text
                        || quoted.imageMessage?.caption
                        || quoted.videoMessage?.caption
                        || '';
                }
            }

            if (!message) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO MESSAGE*
${MID}
   📌 Usage: *.broadcast Your message*
   Or reply to a message with *.bc*
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            await react('⏳');

            try {
                // Get all groups
                const groups = await sock.groupFetchAllParticipating();
                const groupIds = Object.keys(groups);

                let sent = 0;
                let failed = 0;

                const broadcastMsg =
`${TOP}
   📢 *BROADCAST*
${MID}
   💬 ${message}
${THIN}
   📅 ${new Date().toLocaleString(config.TIMEZONE)}
   💚 *Saba MD — Arslan Tech's*
${BOT}`;

                for (const jid of groupIds) {
                    try {
                        await sock.sendMessage(jid, { text: broadcastMsg });
                        sent++;
                    } catch {
                        failed++;
                    }
                }

                await react('✅');

                await h.sendWithLogo(sock, from,
`${TOP}
   ✅ *BROADCAST DONE*
${MID}
   📊 *Sent*   : ${sent}
   ❌ *Failed* : ${failed}
   📋 *Total*  : ${groupIds.length}
${MID}
   💖 *Saba MD*
${BOT}`, msg);

            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🔄 RESTART — Restart bot
    // ═══════════════════════════════════════════
    {
        name: 'restart',
        aliases: ['reboot', 'rs'],
        ownerOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🔄');

            await h.sendWithLogo(sock, from,
`${TOP}
   🔄 *RESTARTING*
${MID}
   ⏳ Bot is restarting...
   🕒 ${new Date().toLocaleTimeString(config.TIMEZONE)}
${THIN}
   ✅ Will be back in 5 seconds
${MID}
   💖 *Saba MD*
${BOT}`, msg);

            await react('✅');

            setTimeout(() => {
                process.exit(0);   // PM2/nodemon auto-restart karega
            }, 2000);
        }
    },

    // ═══════════════════════════════════════════
    //  🛑 SHUTDOWN — Stop bot
    // ═══════════════════════════════════════════
    {
        name: 'shutdown',
        aliases: ['stop', 'exitbot'],
        ownerOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🛑');

            await h.sendWithLogo(sock, from,
`${TOP}
   🛑 *SHUTTING DOWN*
${MID}
   ⚠️ Bot is stopping...
   🕒 ${new Date().toLocaleTimeString(config.TIMEZONE)}
${THIN}
   💡 Restart manually or via host
${MID}
   💖 *Saba MD*
${BOT}`, msg);

            await react('💤');

            setTimeout(() => {
                process.exit(1);
            }, 2000);
        }
    },

    // ═══════════════════════════════════════════
    //  📊 STATS — Full bot stats
    // ═══════════════════════════════════════════
    {
        name: 'stats',
        aliases: ['botstats', 'sysinfo'],
        ownerOnly: true,
        run: async ({ sock, from, msg, react, helper: h, plugins }) => {
            await react('📊');

            const mem = process.memoryUsage();
            const memUsed = (mem.rss / 1024 / 1024).toFixed(2);
            const totalMem = (os.totalmem() / 1024 / 1024).toFixed(2);
            const freeMem = (os.freemem() / 1024 / 1024).toFixed(2);
            const memPercent = ((mem.rss / os.totalmem()) * 100).toFixed(1);

            const uptime = process.uptime();
            const cpus = os.cpus();

            const caption =
`${TOP}
   📊 *BOT STATISTICS*
${MID}
   🤖 *System*
${THIN}
   ├ 📛 *Bot*      : ${config.BOT_NAME}
   ├ 🧠 *Version*  : ${config.VERSION}
   ├ ⏱️ *Uptime*   : ${h.formatUptime(uptime)}
   ├ 🖥️ *Platform* : ${os.platform()} (${os.arch()})
   ├ ⚙️ *CPU*      : ${cpus[0]?.model?.slice(0, 30) || 'Unknown'}
   ├ 🎛️ *Cores*    : ${cpus.length}
   ├ 🔷 *Node*     : ${process.version}
   └ 💾 *Disk*     : ${os.hostname()}
${THIN}
   💾 *Memory*
${THIN}
   ├ 📊 *Used*     : ${memUsed} MB
   ├ 🆓 *Free*     : ${freeMem} MB
   ├ 💿 *Total*    : ${totalMem} MB
   └ ${bar(memPercent)} ${memPercent}%
${THIN}
   📦 *Plugins*
${THIN}
   └ 🔌 *Loaded*   : ${plugins.size} commands
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

            await h.sendWithLogo(sock, from, caption, msg);
            await react('✅');
        }
    },

    // ═══════════════════════════════════════════
    //  👥 GROUPS — List all groups
    // ═══════════════════════════════════════════
    {
        name: 'groups',
        aliases: ['listgroups', 'gc-list'],
        ownerOnly: true,
        cooldown: 10000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('👥');

            try {
                const groups = await sock.groupFetchAllParticipating();
                const list = Object.entries(groups);

                let text = '';
                text += `${TOP}\n`;
                text += `   👥 *GROUPS LIST*\n`;
                text += `${MID}\n`;
                text += `   📊 *Total* : ${list.length}\n`;
                text += `${THIN}\n`;

                list.slice(0, 20).forEach(([jid, g], i) => {
                    text += `   ${i + 1}. *${g.subject.slice(0, 30)}*\n`;
                    text += `      └ ${g.participants.length} members\n`;
                });

                if (list.length > 20) {
                    text += `   ... +${list.length - 20} more\n`;
                }

                text += `${MID}\n`;
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
    //  🚪 LEAVEALL — Leave all groups
    // ═══════════════════════════════════════════
    {
        name: 'leaveall',
        aliases: ['exitall'],
        ownerOnly: true,
        cooldown: 30000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🚪');

            if (args[0] !== 'confirm') {
                await react('⚠️');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *DANGER ZONE*
${MID}
   This will make bot *LEAVE ALL GROUPS*
${THIN}
   ✅ To confirm type:
   *.leaveall confirm*
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            await react('⏳');

            try {
                const groups = await sock.groupFetchAllParticipating();
                const list = Object.keys(groups);

                let left = 0;
                for (const jid of list) {
                    try {
                        await sock.groupLeave(jid);
                        left++;
                        await new Promise(r => setTimeout(r, 800));
                    } catch {}
                }

                await react('✅');
                await h.sendWithLogo(sock, from,
`${TOP}
   🚪 *LEFT ALL GROUPS*
${MID}
   📊 *Total Left* : ${left}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🚫 BAN — Ban user from bot
    // ═══════════════════════════════════════════
    {
        name: 'ban',
        aliases: ['blockuser'],
        ownerOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🚫');

            const target = extractTarget(msg, args);
            if (!target) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TARGET*\n${MID}\n   Reply, mention, or give number\n${BOT}`, msg);
            }

            const targetNum = h.cleanJid(target);

            // Add to config.BANNED (in-memory)
            if (!global.BANNED) global.BANNED = new Set();
            global.BANNED.add(targetNum);

            await react('🚫');
            await h.sendWithLogo(sock, from,
`${TOP}
   🚫 *USER BANNED*
${MID}
   👤 *User* : @${targetNum}
   👑 *By*   : Owner
   🕒 *Time* : ${new Date().toLocaleTimeString(config.TIMEZONE)}
${MID}
   💖 *Saba MD*
${BOT}`, msg, [target]);
        }
    },

    // ═══════════════════════════════════════════
    //  ✅ UNBAN — Unban user
    // ═══════════════════════════════════════════
    {
        name: 'unban',
        aliases: ['unblockuser'],
        ownerOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('✅');

            const target = extractTarget(msg, args);
            if (!target) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TARGET*\n${BOT}`, msg);
            }

            const targetNum = h.cleanJid(target);
            if (global.BANNED) global.BANNED.delete(targetNum);

            await react('✅');
            await h.sendWithLogo(sock, from,
`${TOP}
   ✅ *USER UNBANNED*
${MID}
   👤 *User* : @${targetNum}
   🕒 *Time* : ${new Date().toLocaleTimeString(config.TIMEZONE)}
${MID}
   💖 *Saba MD*
${BOT}`, msg, [target]);
        }
    },

    // ═══════════════════════════════════════════
    //  📋 BANNED — List banned users
    // ═══════════════════════════════════════════
    {
        name: 'banned',
        aliases: ['banlist', 'bannedusers'],
        ownerOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('📋');

            const banned = global.BANNED ? [...global.BANNED] : [];

            let text = '';
            text += `${TOP}\n`;
            text += `   📋 *BANNED USERS*\n`;
            text += `${MID}\n`;
            text += `   📊 *Total* : ${banned.length}\n`;
            text += `${THIN}\n`;

            if (banned.length === 0) {
                text += `   ✅ No users banned\n`;
            } else {
                banned.forEach((num, i) => {
                    text += `   ${i + 1}. ${num}\n`;
                });
            }

            text += `${MID}\n`;
            text += `   💖 *Saba MD*\n`;
            text += `${BOT}`;

            await h.sendWithLogo(sock, from, text, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🖼️ SETPP — Set bot profile picture
    // ═══════════════════════════════════════════
    {
        name: 'setpp',
        aliases: ['setprofilepic', 'setbotpp'],
        ownerOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🖼️');

            const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            if (!quoted?.imageMessage) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO IMAGE*
${MID}
   📌 Reply to an image with *.setpp*
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            await react('⏳');

            try {
                const { downloadContentFromMessage } = require('@whiskeysockets/baileys');
                const stream = await downloadContentFromMessage(quoted.imageMessage, 'image');
                let buffer = Buffer.from([]);
                for await (const chunk of stream) {
                    buffer = Buffer.concat([buffer, chunk]);
                }

                const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';
                await sock.updateProfilePicture(botJid, buffer);

                await react('✅');
                await h.sendWithLogo(sock, from,
`${TOP}
   🖼️ *PROFILE PICTURE UPDATED*
${MID}
   ✅ Bot DP changed successfully
   🕒 ${new Date().toLocaleTimeString(config.TIMEZONE)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📝 SETNAME — Set bot profile name
    // ═══════════════════════════════════════════
    {
        name: 'setname',
        aliases: ['setbotname'],
        ownerOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📝');

            const newName = args.join(' ').trim();
            if (!newName) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO NAME*\n${MID}\n   Usage: *.setname New Name*\n${BOT}`, msg);
            }

            try {
                await sock.updateProfileName(newName);
                await react('✅');
                await h.sendWithLogo(sock, from,
`${TOP}
   📝 *NAME UPDATED*
${MID}
   🆕 *New* : ${newName}
   🕒 *Time*: ${new Date().toLocaleTimeString(config.TIMEZONE)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  💬 SETSTATUS — Set bot status/bio
    // ═══════════════════════════════════════════
    {
        name: 'setstatus',
        aliases: ['setbio', 'setabout'],
        ownerOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('💬');

            const newStatus = args.join(' ').trim();
            if (!newStatus) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO STATUS*\n${MID}\n   Usage: *.setstatus Your bio*\n${BOT}`, msg);
            }

            try {
                await sock.updateProfileStatus(newStatus);
                await react('✅');
                await h.sendWithLogo(sock, from,
`${TOP}
   💬 *STATUS UPDATED*
${MID}
   🆕 *New* : ${newStatus}
   🕒 *Time*: ${new Date().toLocaleTimeString(config.TIMEZONE)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  💾 SAVESESSION — Send session file
    // ═══════════════════════════════════════════
    {
        name: 'savesession',
        aliases: ['getsession', 'session'],
        ownerOnly: true,
        cooldown: 60000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('💾');

            try {
                const sessionPath = path.join(process.cwd(), config.sessionName || 'session');

                if (!fs.existsSync(sessionPath)) {
                    throw new Error('Session folder not found');
                }

                // ZIP the session folder
                const archiver = require('archiver');
                const zipPath = path.join(process.cwd(), `session-${Date.now()}.zip`);
                const output = fs.createWriteStream(zipPath);
                const archive = archiver('zip', { zlib: { level: 9 } });

                await new Promise((resolve, reject) => {
                    output.on('close', resolve);
                    archive.on('error', reject);
                    archive.pipe(output);
                    archive.directory(sessionPath, false);
                    archive.finalize();
                });

                const buffer = fs.readFileSync(zipPath);

                await sock.sendMessage(from, {
                    document: buffer,
                    mimetype: 'application/zip',
                    fileName: `SabaMD-Session-${Date.now()}.zip`,
                    caption:
`${TOP}
   💾 *SESSION EXPORT*
${MID}
   📦 *Size* : ${formatBytes(buffer.length)}
   ⚠️ *Keep this safe!*
${THIN}
   💡 Use to restore bot elsewhere
${MID}
   💖 *Saba MD*
${BOT}`,
                }, { quoted: msg });

                fs.unlinkSync(zipPath);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}
   ❌ *FAILED*
${MID}
   ${err.message.slice(0, 150)}
${THIN}
   💡 Install archiver: npm i archiver
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🗑️ CLEARSESSION — Delete session
    // ═══════════════════════════════════════════
    {
        name: 'clearsession',
        aliases: ['resetsession', 'delsession'],
        ownerOnly: true,
        cooldown: 30000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🗑️');

            if (args[0] !== 'confirm') {
                await react('⚠️');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *DANGER ZONE*
${MID}
   This will *DELETE* the session
   Bot will *LOGOUT* and need re-pairing
${THIN}
   ✅ To confirm type:
   *.clearsession confirm*
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            await react('⏳');

            try {
                const sessionPath = path.join(process.cwd(), config.sessionName || 'session');
                if (fs.existsSync(sessionPath)) {
                    fs.rmSync(sessionPath, { recursive: true, force: true });
                }

                await h.sendWithLogo(sock, from,
`${TOP}
   🗑️ *SESSION CLEARED*
${MID}
   ✅ Session deleted
   🔄 Bot will restart in 5 seconds
   📱 Re-pair required
${MID}
   💖 *Saba MD*
${BOT}`, msg);

                await react('✅');

                setTimeout(() => process.exit(0), 5000);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📦 PLUGINS — List all plugins
    // ═══════════════════════════════════════════
    {
        name: 'plugins',
        aliases: ['pluginlist', 'cmdlist'],
        ownerOnly: true,
        run: async ({ sock, from, msg, react, helper: h, plugins }) => {
            await react('📦');

            // Group by plugin file... actually just list all command names
            const all = [...new Set([...plugins.values()].map(p => p.name))].sort();

            let text = '';
            text += `${TOP}\n`;
            text += `   📦 *ALL COMMANDS*\n`;
            text += `${MID}\n`;
            text += `   📊 *Total* : ${all.length}\n`;
            text += `${THIN}\n`;

            // Group by first letter
            const grouped = {};
            for (const name of all) {
                const k = name[0].toUpperCase();
                if (!grouped[k]) grouped[k] = [];
                grouped[k].push(name);
            }

            for (const letter of Object.keys(grouped).sort()) {
                text += `   【 ${letter} 】\n`;
                grouped[letter].forEach((n, i) => {
                    text += `   ${i === grouped[letter].length - 1 ? '└' : '├'} ${config.PREFIX}${n}\n`;
                });
            }

            text += `${MID}\n`;
            text += `   💖 *Saba MD — Arslan Tech's*\n`;
            text += `${BOT}`;

            await h.sendWithLogo(sock, from, text, msg);
            await react('✅');
        }
    },

    // ═══════════════════════════════════════════
    //  👑 SELF — Owner info
    // ═══════════════════════════════════════════
    {
        name: 'self',
        aliases: ['ownerinfo', 'me'],
        ownerOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('👑');

            const ownerNum = config.OWNER[0].split('@')[0];

            await h.sendWithLogo(sock, from,
`${TOP}
   👑 *OWNER INFO*
${MID}
   👤 *Name*     : ${config.OWNER_NAME}
   📱 *Number*   : +${ownerNum}
   🤖 *Bot*      : ${config.BOT_NAME}
   🧠 *Version*  : ${config.VERSION}
   🔑 *Role*     : Super Admin
${THIN}
   ⚡ *Permissions:*
   ✅ All commands
   ✅ Broadcast
   ✅ Ban/Unban
   ✅ System controls
   ✅ Session export
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🎭 MODE — Set bot public/private mode
    // ═══════════════════════════════════════════
    {
        name: 'mode',
        aliases: ['botmode', 'publicprivate'],
        ownerOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎭');

            const mode = (args[0] || '').toLowerCase();

            if (!['public', 'private', 'self'].includes(mode)) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *INVALID MODE*
${MID}
   📌 Usage: *.mode public* or *.mode private*
${THIN}
   • *public*  : Everyone can use
   • *private* : Only owner can use
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            global.BOT_MODE = mode;
            config.PUBLIC_MODE = mode === 'public';

            await react('✅');
            await h.sendWithLogo(sock, from,
`${TOP}
   🎭 *MODE CHANGED*
${MID}
   📊 *New Mode* : ${mode.toUpperCase()}
   🕒 *Time*     : ${new Date().toLocaleTimeString(config.TIMEZONE)}
${THIN}
   ${mode === 'public' ? '💚 Everyone can use bot' : '🔒 Only owner can use bot'}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  💬 SENDMSG — Send message to specific number/group
    // ═══════════════════════════════════════════
    {
        name: 'sendmsg',
        aliases: ['send', 'dm'],
        ownerOnly: true,
        cooldown: 5000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('💬');

            if (args.length < 2) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *USAGE*
${MID}
   📌 *.sendmsg <number|jid> <message>*
${THIN}
   💡 Example:
   .sendmsg 923001234567 Hello!
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            const target = args[0];
            const message = args.slice(1).join(' ');

            let jid;
            if (target.includes('@')) {
                jid = target;
            } else {
                const num = target.replace(/\D/g, '');
                jid = `${num}@s.whatsapp.net`;
            }

            try {
                await sock.sendMessage(jid, { text: message });
                await react('✅');
                await h.sendWithLogo(sock, from,
`${TOP}
   💬 *MESSAGE SENT*
${MID}
   🎯 *To*   : ${jid}
   💌 *Msg*  : ${message.slice(0, 50)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🔧 OWNER INFO — Full menu
    // ═══════════════════════════════════════════
    {
        name: 'ownerhelp',
        aliases: ['omenu', 'ownercmds'],
        ownerOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🔧');

            const caption =
`${TOP}
   🔧 *OWNER COMMANDS*
${MID}
   📢 *System*
${THIN}
   ├ .broadcast  — Send to all groups
   ├ .restart    — Restart bot
   ├ .shutdown   — Stop bot
   ├ .stats      — Full stats
   └ .mode       — Public/private
${THIN}
   👥 *Groups*
${THIN}
   ├ .groups     — List all groups
   └ .leaveall   — Leave all (danger)
${THIN}
   👤 *Users*
${THIN}
   ├ .ban        — Ban user
   ├ .unban      — Unban user
   ├ .banned     — List banned
   └ .sendmsg    — Send DM
${THIN}
   🤖 *Bot Profile*
${THIN}
   ├ .setpp      — Set bot DP
   ├ .setname    — Set bot name
   └ .setstatus  — Set bot bio
${THIN}
   💾 *Session*
${THIN}
   ├ .savesession   — Export session
   └ .clearsession  — Delete session
${THIN}
   📦 *Other*
${THIN}
   ├ .plugins    — All commands
   └ .self       — Your info
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

            await h.sendWithLogo(sock, from, caption, msg);
        }
    },

];