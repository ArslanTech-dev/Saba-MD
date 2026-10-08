// ===============================================
//  💚 SABA MD — GROUP MANAGEMENT
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Royal Style · React Enabled
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');

// ═══════════════════════════════════════════════
//  🎨 STYLE
// ═══════════════════════════════════════════════
const TOP  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';
const MID  = '━━━━━━━━━━━━━━━━━━';
const THIN = '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄';
const BOT  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';

// ─── In-memory group settings (later upgrade to DB) ───
const groupSettings = new Map();

function getSettings(groupJid) {
    if (!groupSettings.has(groupJid)) {
        groupSettings.set(groupJid, {
            antilink:   false,
            welcome:    false,
            goodbye:    false,
            mute:       false,
        });
    }
    return groupSettings.get(groupJid);
}

function saveSettings() {
    // Placeholder for DB save later
}

// ─── Check if user is admin ───
async function isAdmin(sock, groupJid, userJid) {
    try {
        const meta = await sock.groupMetadata(groupJid);
        const num = helper.cleanJid(userJid);
        return meta.participants.some(p =>
            helper.cleanJid(p.id) === num &&
            (p.admin === 'admin' || p.admin === 'superadmin')
        );
    } catch { return false; }
}

// ─── Check if bot is admin ───
async function isBotAdmin(sock, groupJid) {
    try {
        const meta = await sock.groupMetadata(groupJid);
        const botJid = sock.user?.id?.split(':')[0] + '@s.whatsapp.net';
        const botNum = helper.cleanJid(botJid);
        return meta.participants.some(p =>
            helper.cleanJid(p.id) === botNum &&
            (p.admin === 'admin' || p.admin === 'superadmin')
        );
    } catch { return false; }
}

// ─── Extract target JID from message ───
function extractTarget(msg, args) {
    const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentions.length > 0) return mentions[0];

    const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (quoted) return quoted;

    if (args[0]) {
        const num = String(args[0]).replace(/\D/g, '');
        if (num.length >= 10) return `${num}@s.whatsapp.net`;
    }
    return null;
}

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    // ═══════════════════════════════════════════
    //  👢 KICK — Remove member
    // ═══════════════════════════════════════════
    {
        name: 'kick',
        aliases: ['remove', 'boot'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('👢');

            if (!await isBotAdmin(sock, from)) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ❌ *CANNOT KICK*
${MID}
   ├ Reason : Bot is *not admin*
   └ Fix    : Make bot admin first
${BOT}`, msg);
            }

            const target = extractTarget(msg, args);
            if (!target) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO TARGET*
${MID}
   • Mention a user, or
   • Reply to their message, or
   • Type: .kick 923001234567
${BOT}`, msg);
            }

            const targetNum = h.cleanJid(target);
            if (h.isOwner(targetNum) || targetNum === h.cleanJid(sender)) {
                await react('🚫');
                return h.sendWithLogo(sock, from,
`${TOP}
   🚫 *PROTECTED*
${MID}
   Cannot kick:
   ├ Owner
   └ Yourself
${BOT}`, msg);
            }

            try {
                await sock.groupParticipantsUpdate(from, [target], 'remove');
                await react('✅');

                await h.sendWithLogo(sock, from,
`${TOP}
   👢 *MEMBER KICKED*
${MID}
   ├ 👤 *User*   : @${targetNum}
   ├ 👑 *By*     : @${sender}
   ├ 🕒 *Time*   : ${new Date().toLocaleTimeString(config.TIMEZONE)}
   └ 🎀 *Group*  : ${(await sock.groupMetadata(from)).subject}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg, [target, msg.key.participant || msg.key.remoteJid]);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}
   ❌ *KICK FAILED*
${MID}
   ${err.message}
${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  ➕ ADD — Add member
    // ═══════════════════════════════════════════
    {
        name: 'add',
        aliases: ['invite'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('➕');

            if (!args[0]) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO NUMBER*
${MID}
   Usage: .add 923001234567
${BOT}`, msg);
            }

            const num = String(args[0]).replace(/\D/g, '');
            if (num.length < 10) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ❌ *INVALID NUMBER*
${MID}
   Include country code
   Example: 923001234567
${BOT}`, msg);
            }

            const target = `${num}@s.whatsapp.net`;

            try {
                const res = await sock.groupParticipantsUpdate(from, [target], 'add');
                const status = res?.[0]?.status;

                if (status === '200') {
                    await react('✅');
                    return h.sendWithLogo(sock, from,
`${TOP}
   ✅ *MEMBER ADDED*
${MID}
   ├ 👤 *User*   : @${num}
   ├ 👑 *By*     : @${sender}
   ├ 🕒 *Time*   : ${new Date().toLocaleTimeString(config.TIMEZONE)}
   └ 📊 *Status* : Success
${MID}
   💖 *Welcome to the group!*
${BOT}`, msg, [target]);
                } else if (status === '403') {
                    await react('⚠️');
                    return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *INVITE SENT*
${MID}
   ├ 👤 *User*   : @${num}
   ├ 📊 *Status* : Privacy — invite sent
   └ 💡 *Note*   : User must accept
${BOT}`, msg, [target]);
                } else {
                    await react('⚠️');
                    return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *ADD STATUS*
${MID}
   ├ 👤 *User*   : @${num}
   └ 📊 *Status* : ${status}
${BOT}`, msg, [target]);
                }
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}
   ❌ *ADD FAILED*
${MID}
   ${err.message}
${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  ⬆️ PROMOTE — Make admin
    // ═══════════════════════════════════════════
    {
        name: 'promote',
        aliases: ['admin', 'makeadmin'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('⬆️');

            if (!await isBotAdmin(sock, from)) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ❌ *BOT NOT ADMIN*
${MID}
   Cannot promote anyone
${BOT}`, msg);
            }

            const target = extractTarget(msg, args);
            if (!target) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO TARGET*
${MID}
   Mention or reply to a user
${BOT}`, msg);
            }

            try {
                await sock.groupParticipantsUpdate(from, [target], 'promote');
                await react('👑');

                await h.sendWithLogo(sock, from,
`${TOP}
   👑 *PROMOTED TO ADMIN*
${MID}
   ├ 👤 *User*   : @${h.cleanJid(target)}
   ├ 👑 *By*     : @${sender}
   ├ 🏆 *Role*   : Administrator
   ├ 🕒 *Time*   : ${new Date().toLocaleTimeString(config.TIMEZONE)}
   └ 🎀 *Group*  : ${(await sock.groupMetadata(from)).subject}
${MID}
   💖 *Welcome to the admin team!*
${BOT}`, msg, [target, msg.key.participant || msg.key.remoteJid]);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *PROMOTE FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  ⬇️ DEMOTE — Remove admin
    // ═══════════════════════════════════════════
    {
        name: 'demote',
        aliases: ['unadmin', 'removeadmin'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('⬇️');

            if (!await isBotAdmin(sock, from)) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *BOT NOT ADMIN*\n${MID}\n   Cannot demote anyone\n${BOT}`, msg);
            }

            const target = extractTarget(msg, args);
            if (!target) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TARGET*\n${MID}\n   Mention or reply to a user\n${BOT}`, msg);
            }

            try {
                await sock.groupParticipantsUpdate(from, [target], 'demote');
                await react('✅');

                await h.sendWithLogo(sock, from,
`${TOP}
   📉 *ADMIN DEMOTED*
${MID}
   ├ 👤 *User*   : @${h.cleanJid(target)}
   ├ 👑 *By*     : @${sender}
   ├ 🏆 *Role*   : Member
   ├ 🕒 *Time*   : ${new Date().toLocaleTimeString(config.TIMEZONE)}
   └ 🎀 *Group*  : ${(await sock.groupMetadata(from)).subject}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg, [target, msg.key.participant || msg.key.remoteJid]);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *DEMOTE FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📢 TAGALL — Tag everyone
    // ═══════════════════════════════════════════
    {
        name: 'tagall',
        aliases: ['everyone', 'all'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, args, sender, react, helper: h }) => {
            await react('📢');

            const meta = await sock.groupMetadata(from);
            const participants = meta.participants.map(p => p.id);
            const reason = args.join(' ') || 'Attention everyone!';

            let text = '';
            text += `${TOP}\n`;
            text += `   📢 *TAG ALL*\n`;
            text += `${MID}\n`;
            text += `   💬 *Message* : ${reason}\n`;
            text += `   👑 *By*      : @${sender}\n`;
            text += `   👥 *Total*   : ${participants.length} members\n`;
            text += `${MID}\n`;

            for (const jid of participants) {
                text += `   ├ @${h.cleanJid(jid)}\n`;
            }

            text += `${MID}\n`;
            text += `   💖 *Saba MD — Arslan Tech's*\n`;
            text += `${BOT}`;

            await sock.sendMessage(from, {
                text,
                mentions: participants
            }, { quoted: msg });

            await react('✅');
        }
    },

    // ═══════════════════════════════════════════
    //  🎯 HIDETAG — Hidden tag
    // ═══════════════════════════════════════════
    {
        name: 'hidetag',
        aliases: ['ht', 'hidetagall'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎯');

            const meta = await sock.groupMetadata(from);
            const participants = meta.participants.map(p => p.id);
            const message = args.join(' ') || '';

            if (!message) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO MESSAGE*\n${MID}\n   Usage: .hidetag Your message\n${BOT}`, msg);
            }

            await sock.sendMessage(from, {
                text: message,
                mentions: participants
            }, { quoted: msg });

            await react('✅');
        }
    },

    // ═══════════════════════════════════════════
    //  🔇 MUTE — Mute group
    // ═══════════════════════════════════════════
    {
        name: 'mute',
        aliases: ['close', 'lock'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🔇');

            if (!await isBotAdmin(sock, from)) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *BOT NOT ADMIN*\n${BOT}`, msg);
            }

            try {
                await sock.groupSettingUpdate(from, 'announcement');
                const s = getSettings(from);
                s.mute = true;
                saveSettings();

                await react('✅');

                await h.sendWithLogo(sock, from,
`${TOP}
   🔇 *GROUP MUTED*
${MID}
   ├ 📊 *Status* : Only admins can message
   ├ 🕒 *Time*   : ${new Date().toLocaleTimeString(config.TIMEZONE)}
   └ 💡 *Note*   : Use .unmute to open
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🔊 UNMUTE — Unmute group
    // ═══════════════════════════════════════════
    {
        name: 'unmute',
        aliases: ['open', 'unlock'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🔊');

            if (!await isBotAdmin(sock, from)) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *BOT NOT ADMIN*\n${BOT}`, msg);
            }

            try {
                await sock.groupSettingUpdate(from, 'not_announcement');
                const s = getSettings(from);
                s.mute = false;
                saveSettings();

                await react('✅');

                await h.sendWithLogo(sock, from,
`${TOP}
   🔊 *GROUP UNMUTED*
${MID}
   ├ 📊 *Status* : Everyone can message
   ├ 🕒 *Time*   : ${new Date().toLocaleTimeString(config.TIMEZONE)}
   └ 💚 *Chat freely!*
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🔗 ANTILINK — Toggle antilink
    // ═══════════════════════════════════════════
    {
        name: 'antilink',
        aliases: ['al'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔗');

            const s = getSettings(from);
            const mode = (args[0] || '').toLowerCase();

            if (mode === 'on' || mode === 'true') {
                s.antilink = true;
            } else if (mode === 'off' || mode === 'false') {
                s.antilink = false;
            } else {
                s.antilink = !s.antilink;
            }
            saveSettings();

            await react(s.antilink ? '✅' : '🚫');

            await h.sendWithLogo(sock, from,
`${TOP}
   🔗 *ANTILINK*
${MID}
   ├ 📊 *Status*  : ${s.antilink ? '🟢 ENABLED' : '🔴 DISABLED'}
   ├ 👑 *By*      : @${h.getSender(msg)}
   ├ 🕒 *Time*    : ${new Date().toLocaleTimeString(config.TIMEZONE)}
   └ 💡 *Usage*   : .antilink on / off
${MID}
   ${s.antilink ? '⚠️ Links will be deleted' : '💚 Links allowed now'}
${BOT}`, msg, [msg.key.participant || msg.key.remoteJid]);
        }
    },

    // ═══════════════════════════════════════════
    //  👋 WELCOME — Toggle welcome message
    // ═══════════════════════════════════════════
    {
        name: 'welcome',
        aliases: ['welcomemsg'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('👋');

            const s = getSettings(from);
            const mode = (args[0] || '').toLowerCase();

            if (mode === 'on' || mode === 'true') s.welcome = true;
            else if (mode === 'off' || mode === 'false') s.welcome = false;
            else s.welcome = !s.welcome;
            saveSettings();

            await react(s.welcome ? '✅' : '🚫');

            await h.sendWithLogo(sock, from,
`${TOP}
   👋 *WELCOME MESSAGE*
${MID}
   ├ 📊 *Status* : ${s.welcome ? '🟢 ENABLED' : '🔴 DISABLED'}
   ├ 👑 *By*     : @${h.getSender(msg)}
   ├ 🕒 *Time*   : ${new Date().toLocaleTimeString(config.TIMEZONE)}
   └ 💡 *Usage*  : .welcome on / off
${MID}
   ${s.welcome ? '💚 New members will be greeted' : '🔇 Welcome disabled'}
${BOT}`, msg, [msg.key.participant || msg.key.remoteJid]);
        }
    },

    // ═══════════════════════════════════════════
    //  👋 GOODBYE — Toggle goodbye message
    // ═══════════════════════════════════════════
    {
        name: 'goodbye',
        aliases: ['byemsg'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('👋');

            const s = getSettings(from);
            const mode = (args[0] || '').toLowerCase();

            if (mode === 'on' || mode === 'true') s.goodbye = true;
            else if (mode === 'off' || mode === 'false') s.goodbye = false;
            else s.goodbye = !s.goodbye;
            saveSettings();

            await react(s.goodbye ? '✅' : '🚫');

            await h.sendWithLogo(sock, from,
`${TOP}
   👋 *GOODBYE MESSAGE*
${MID}
   ├ 📊 *Status* : ${s.goodbye ? '🟢 ENABLED' : '🔴 DISABLED'}
   ├ 👑 *By*     : @${h.getSender(msg)}
   └ 💡 *Usage*  : .goodbye on / off
${BOT}`, msg, [msg.key.participant || msg.key.remoteJid]);
        }
    },

    // ═══════════════════════════════════════════
    //  📊 GROUPINFO — Group details
    // ═══════════════════════════════════════════
    {
        name: 'groupinfo',
        aliases: ['ginfo', 'groupdetail'],
        groupOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('📊');

            try {
                const meta = await sock.groupMetadata(from);
                const admins = meta.participants.filter(p => p.admin);
                const createdDate = new Date(meta.creation * 1000).toLocaleDateString();

                const caption =
`${TOP}
   📊 *GROUP INFO*
${MID}
   📛 *Name*        : ${meta.subject}
${THIN}
   📝 *Description*
${THIN}
   ${meta.desc || '_No description_'}
${THIN}
   🔢 *Basic Info*
${THIN}
   ├ 🆔 *ID*       : ${meta.id.split('@')[0]}
   ├ 👥 *Members*  : ${meta.participants.length}
   ├ 👑 *Admins*   : ${admins.length}
   ├ 📅 *Created*  : ${createdDate}
   └ 👤 *Creator*  : @${h.cleanJid(meta.owner || 'Unknown')}
${THIN}
   🛡️ *Admin List*
${THIN}
${admins.slice(0, 5).map(a => `   ├ 👑 @${h.cleanJid(a.id)}`).join('\n')}
${admins.length > 5 ? `   └ ... +${admins.length - 5} more` : ''}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

                const adminJids = admins.map(a => a.id);

                await h.sendWithLogo(sock, from, caption, msg, adminJids);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🔗 GROUPLINK — Get invite link
    // ═══════════════════════════════════════════
    {
        name: 'grouplink',
        aliases: ['linkgc', 'invitelink'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🔗');

            try {
                const code = await sock.groupInviteCode(from);
                const link = `https://chat.whatsapp.com/${code}`;

                await react('✅');

                await h.sendWithLogo(sock, from,
`${TOP}
   🔗 *GROUP INVITE LINK*
${MID}
   ${link}
${MID}
   ├ 🕒 *Time*   : ${new Date().toLocaleTimeString(config.TIMEZONE)}
   ├ 📊 *Status* : Active
   └ ⚠️ *Note*   : Do not share publicly
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🔄 RESETLINK — Reset invite link
    // ═══════════════════════════════════════════
    {
        name: 'resetlink',
        aliases: ['revoke', 'newlink'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🔄');

            try {
                await sock.groupRevokeInvite(from);
                const code = await sock.groupInviteCode(from);
                const link = `https://chat.whatsapp.com/${code}`;

                await react('✅');

                await h.sendWithLogo(sock, from,
`${TOP}
   🔄 *LINK RESET*
${MID}
   🆕 *New Link:*
   ${link}
${MID}
   ├ 🕒 *Time*   : ${new Date().toLocaleTimeString(config.TIMEZONE)}
   ├ 🛡️ *Old*   : Revoked
   └ ✅ *New*   : Active
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📝 SETNAME — Change group name
    // ═══════════════════════════════════════════
    {
        name: 'setname',
        aliases: ['gcname', 'groupname'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📝');

            if (!args.length) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO NAME*\n${MID}\n   Usage: .setname New Group Name\n${BOT}`, msg);
            }

            const newName = args.join(' ');

            try {
                await sock.groupUpdateSubject(from, newName);
                await react('✅');

                await h.sendWithLogo(sock, from,
`${TOP}
   📝 *GROUP NAME UPDATED*
${MID}
   ├ 🆕 *New* : ${newName}
   ├ 👑 *By*  : @${h.getSender(msg)}
   ├ 🕒 *Time*: ${new Date().toLocaleTimeString(config.TIMEZONE)}
   └ ✅ *Done*
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg, [msg.key.participant || msg.key.remoteJid]);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📄 SETDESC — Change group description
    // ═══════════════════════════════════════════
    {
        name: 'setdesc',
        aliases: ['gcdesc', 'groupdesc'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📄');

            if (!args.length) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: .setdesc New description\n${BOT}`, msg);
            }

            const newDesc = args.join(' ');

            try {
                await sock.groupUpdateDescription(from, newDesc);
                await react('✅');

                await h.sendWithLogo(sock, from,
`${TOP}
   📄 *DESCRIPTION UPDATED*
${MID}
   ├ 🆕 *New Desc* : ${newDesc}
   ├ 👑 *By*       : @${h.getSender(msg)}
   └ ✅ *Done*
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg, [msg.key.participant || msg.key.remoteJid]);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🚪 LEAVE — Bot leaves group
    // ═══════════════════════════════════════════
    {
        name: 'leave',
        aliases: ['exit', 'bye'],
        groupOnly: true,
        ownerOnly: true,
        run: async ({ sock, from, msg, react }) => {
            await react('👋');

            await sock.sendMessage(from, {
                text:
`─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍
   👋 *GOODBYE*
━━━━━━━━━━━━━━━━━━
   Leaving this group now...
   💚 It was nice being here!
━━━━━━━━━━━━━━━━━━
   💖 *Saba MD — Arslan Tech's*
─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍`
            });

            await react('✅');
            await new Promise(r => setTimeout(r, 1500));
            await sock.groupLeave(from);
        }
    },

    // ═══════════════════════════════════════════
    //  📋 ADMINSLIST — List all admins
    // ═══════════════════════════════════════════
    {
        name: 'admins',
        aliases: ['adminlist', 'listadmins'],
        groupOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('👑');

            const meta = await sock.groupMetadata(from);
            const admins = meta.participants.filter(p => p.admin);

            let text = '';
            text += `${TOP}\n`;
            text += `   👑 *GROUP ADMINS*\n`;
            text += `${MID}\n`;
            text += `   📊 *Total* : ${admins.length}\n`;
            text += `${THIN}\n`;

            admins.forEach((a, i) => {
                const num = h.cleanJid(a.id);
                const role = a.admin === 'superadmin' ? '👑 Creator' : '🛡️ Admin';
                text += `   ${i === admins.length - 1 ? '└' : '├'} @${num} — ${role}\n`;
            });

            text += `${MID}\n`;
            text += `   💖 *Saba MD — Arslan Tech's*\n`;
            text += `${BOT}`;

            await sock.sendMessage(from, {
                text,
                mentions: admins.map(a => a.id)
            }, { quoted: msg });

            await react('✅');
        }
    },

    // ═══════════════════════════════════════════
    //  📊 POLL — Create a poll
    // ═══════════════════════════════════════════
    {
        name: 'poll',
        aliases: ['vote'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📊');

            const input = args.join(' ');
            const parts = input.split('|').map(s => s.trim());

            if (parts.length < 3) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *POLL FORMAT*
${MID}
   Usage:
   .poll Question | Option1 | Option2
${MID}
   Example:
   .poll Best color? | Red | Blue | Green
${BOT}`, msg);
            }

            const question = parts[0];
            const options = parts.slice(1);

            try {
                await sock.sendMessage(from, {
                    poll: {
                        name: question,
                        values: options,
                        selectableCount: 1
                    }
                }, { quoted: msg });

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *POLL FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🔒 LOCK — Lock group settings
    // ═══════════════════════════════════════════
    {
        name: 'lock',
        aliases: ['lockgroup'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🔒');

            try {
                await sock.groupSettingUpdate(from, 'locked');
                await react('✅');

                await h.sendWithLogo(sock, from,
`${TOP}
   🔒 *GROUP LOCKED*
${MID}
   ├ 📊 *Status* : Locked
   ├ 🛡️ *Effect* : Only admins can edit
   └ 🕒 *Time*   : ${new Date().toLocaleTimeString(config.TIMEZONE)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🔓 UNLOCK — Unlock group settings
    // ═══════════════════════════════════════════
    {
        name: 'unlock',
        aliases: ['unlockgroup'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🔓');

            try {
                await sock.groupSettingUpdate(from, 'unlocked');
                await react('✅');

                await h.sendWithLogo(sock, from,
`${TOP}
   🔓 *GROUP UNLOCKED*
${MID}
   ├ 📊 *Status* : Unlocked
   ├ 🛡️ *Effect* : Everyone can edit
   └ 🕒 *Time*   : ${new Date().toLocaleTimeString(config.TIMEZONE)}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🆔 GCID — Group ID
    // ═══════════════════════════════════════════
    {
        name: 'gcid',
        aliases: ['groupid', 'idgc'],
        groupOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🆔');

            await h.sendWithLogo(sock, from,
`${TOP}
   🆔 *GROUP ID*
${MID}
   📛 *ID:*
   \`\`\`
   ${from}
   \`\`\`
${MID}
   ├ 🕒 *Time* : ${new Date().toLocaleTimeString(config.TIMEZONE)}
   └ 💡 *Note* : Use this for bot config
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);

            await react('✅');
        }
    },

    // ═══════════════════════════════════════════
    //  👥 MEMBERS — List all members
    // ═══════════════════════════════════════════
    {
        name: 'members',
        aliases: ['listmembers', 'memberlist'],
        groupOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('👥');

            const meta = await sock.groupMetadata(from);
            const members = meta.participants;

            let text = '';
            text += `${TOP}\n`;
            text += `   👥 *GROUP MEMBERS*\n`;
            text += `${MID}\n`;
            text += `   📊 *Total* : ${members.length}\n`;
            text += `${THIN}\n`;

            members.slice(0, 30).forEach((m, i) => {
                const num = h.cleanJid(m.id);
                const badge = m.admin === 'superadmin' ? '👑' : m.admin === 'admin' ? '🛡️' : '👤';
                text += `   ${badge} @${num}\n`;
            });

            if (members.length > 30) {
                text += `   ... +${members.length - 30} more\n`;
            }

            text += `${MID}\n`;
            text += `   💖 *Saba MD — Arslan Tech's*\n`;
            text += `${BOT}`;

            await sock.sendMessage(from, {
                text,
                mentions: members.slice(0, 30).map(m => m.id)
            }, { quoted: msg });

            await react('✅');
        }
    },

];