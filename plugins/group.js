// ===============================================
//  💚 SABA MD — GROUP MANAGEMENT
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Royal Style · React Enabled
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');
const { getSettings, saveSettings } = require('../utils/groupSettings');

// ═══════════════════════════════════════════════
//  🎨 STYLE
// ═══════════════════════════════════════════════
const TOP  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';
const MID  = '━━━━━━━━━━━━━━━━━━';
const THIN = '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄';
const BOT  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';

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

// ─── Extract target JID ───
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

    // ─── KICK ───
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
`${TOP}\n   ❌ *CANNOT KICK*\n${MID}\n   ├ Reason : Bot is *not admin*\n   └ Fix    : Make bot admin first\n${BOT}`, msg);
            }

            const target = extractTarget(msg, args);
            if (!target) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TARGET*\n${MID}\n   Mention a user or reply\n${BOT}`, msg);
            }

            const targetNum = h.cleanJid(target);
            if (h.isOwner(targetNum) || targetNum === h.cleanJid(sender)) {
                await react('🚫');
                return h.sendWithLogo(sock, from,
`${TOP}\n   🚫 *PROTECTED*\n${MID}\n   Cannot kick owner/self\n${BOT}`, msg);
            }

            try {
                await sock.groupParticipantsUpdate(from, [target], 'remove');
                await react('✅');
                await h.sendWithLogo(sock, from,
`${TOP}\n   👢 *MEMBER KICKED*\n${MID}\n   ├ 👤 *User* : @${targetNum}\n   ├ 👑 *By*   : @${sender}\n   └ 🕒 *Time* : ${new Date().toLocaleTimeString(config.TIMEZONE)}\n${MID}\n   💖 *Saba MD*\n${BOT}`, msg, [target, msg.key.participant || msg.key.remoteJid]);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ─── ADD ───
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
`${TOP}\n   ⚠️ *NO NUMBER*\n${MID}\n   Usage: .add 923001234567\n${BOT}`, msg);
            }

            const num = String(args[0]).replace(/\D/g, '');
            if (num.length < 10) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *INVALID*\n${MID}\n   Include country code\n${BOT}`, msg);
            }

            const target = `${num}@s.whatsapp.net`;
            try {
                const res = await sock.groupParticipantsUpdate(from, [target], 'add');
                const status = res?.[0]?.status;

                await react(status === '200' ? '✅' : '⚠️');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ${status === '200' ? '✅ *MEMBER ADDED*' : '⚠️ *STATUS*'}\n${MID}\n   ├ 👤 *User* : @${num}\n   ├ 👑 *By*   : @${sender}\n   └ 📊 *Status* : ${status}\n${MID}\n   💖 *Saba MD*\n${BOT}`, msg, [target]);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ─── PROMOTE ───
    {
        name: 'promote',
        aliases: ['admin', 'makeadmin'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('⬆️');

            if (!await isBotAdmin(sock, from)) {
                await react('❌');
                return h.sendWithLogo(sock, from, `${TOP}\n   ❌ *BOT NOT ADMIN*\n${BOT}`, msg);
            }

            const target = extractTarget(msg, args);
            if (!target) {
                await react('❌');
                return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TARGET*\n${BOT}`, msg);
            }

            try {
                await sock.groupParticipantsUpdate(from, [target], 'promote');
                await react('👑');
                await h.sendWithLogo(sock, from,
`${TOP}\n   👑 *PROMOTED*\n${MID}\n   ├ 👤 *User* : @${h.cleanJid(target)}\n   ├ 👑 *By*   : @${sender}\n   └ 🏆 *Role* : Admin\n${MID}\n   💖 *Welcome to admin team!*\n${BOT}`, msg, [target, msg.key.participant || msg.key.remoteJid]);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ─── DEMOTE ───
    {
        name: 'demote',
        aliases: ['unadmin', 'removeadmin'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('⬇️');

            if (!await isBotAdmin(sock, from)) {
                await react('❌');
                return h.sendWithLogo(sock, from, `${TOP}\n   ❌ *BOT NOT ADMIN*\n${BOT}`, msg);
            }

            const target = extractTarget(msg, args);
            if (!target) {
                await react('❌');
                return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TARGET*\n${BOT}`, msg);
            }

            try {
                await sock.groupParticipantsUpdate(from, [target], 'demote');
                await react('✅');
                await h.sendWithLogo(sock, from,
`${TOP}\n   📉 *DEMOTED*\n${MID}\n   ├ 👤 *User* : @${h.cleanJid(target)}\n   ├ 👑 *By*   : @${sender}\n   └ 🏆 *Role* : Member\n${MID}\n   💖 *Saba MD*\n${BOT}`, msg, [target, msg.key.participant || msg.key.remoteJid]);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ─── TAGALL ───
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
            text += `   👥 *Total*   : ${participants.length}\n`;
            text += `${THIN}\n`;

            for (const jid of participants) {
                text += `   ├ @${h.cleanJid(jid)}\n`;
            }

            text += `${MID}\n`;
            text += `   💖 *Saba MD — Arslan Tech's*\n`;
            text += `${BOT}`;

            await sock.sendMessage(from, { text, mentions: participants }, { quoted: msg });
            await react('✅');
        }
    },

    // ─── HIDETAG ───
    {
        name: 'hidetag',
        aliases: ['ht', 'hidetagall'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎯');

            const meta = await sock.groupMetadata(from);
            const participants = meta.participants.map(p => p.id);
            const message = args.join(' ');

            if (!message) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO MESSAGE*\n${MID}\n   Usage: .hidetag Your message\n${BOT}`, msg);
            }

            await sock.sendMessage(from, { text: message, mentions: participants }, { quoted: msg });
            await react('✅');
        }
    },

    // ─── MUTE ───
    {
        name: 'mute',
        aliases: ['close'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🔇');

            if (!await isBotAdmin(sock, from)) {
                await react('❌');
                return h.sendWithLogo(sock, from, `${TOP}\n   ❌ *BOT NOT ADMIN*\n${BOT}`, msg);
            }

            try {
                await sock.groupSettingUpdate(from, 'announcement');
                const s = getSettings(from);
                s.mute = true;
                saveSettings();
                await react('✅');
                await h.sendWithLogo(sock, from,
`${TOP}\n   🔇 *GROUP MUTED*\n${MID}\n   ├ 📊 *Status* : Only admins can message\n   └ 💡 *Note*   : Use .unmute to open\n${MID}\n   💖 *Saba MD*\n${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ─── UNMUTE ───
    {
        name: 'unmute',
        aliases: ['open'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🔊');

            if (!await isBotAdmin(sock, from)) {
                await react('❌');
                return h.sendWithLogo(sock, from, `${TOP}\n   ❌ *BOT NOT ADMIN*\n${BOT}`, msg);
            }

            try {
                await sock.groupSettingUpdate(from, 'not_announcement');
                const s = getSettings(from);
                s.mute = false;
                saveSettings();
                await react('✅');
                await h.sendWithLogo(sock, from,
`${TOP}\n   🔊 *GROUP UNMUTED*\n${MID}\n   ├ 📊 *Status* : Everyone can message\n   └ 💚 *Chat freely!*\n${MID}\n   💖 *Saba MD*\n${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ─── ANTILINK ───
    {
        name: 'antilink',
        aliases: ['al'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔗');

            const s = getSettings(from);
            const mode = (args[0] || '').toLowerCase();

            if (mode === 'on') s.antilink = true;
            else if (mode === 'off') s.antilink = false;
            else if (mode === 'kick') { s.antilink = true; s.antilink_action = 'kick'; }
            else if (mode === 'warn') { s.antilink = true; s.antilink_action = 'warn'; }
            else s.antilink = !s.antilink;
            saveSettings();

            await react(s.antilink ? '✅' : '🚫');

            await h.sendWithLogo(sock, from,
`${TOP}\n   🔗 *ANTILINK*\n${MID}\n   ├ 📊 *Status* : ${s.antilink ? '🟢 ENABLED' : '🔴 DISABLED'}\n   ├ 👑 *Action* : ${s.antilink_action || 'warn'}\n   ├ 👤 *By*     : @${h.getSender(msg)}\n   └ 💡 *Usage*  : .antilink on/off/kick/warn\n${MID}\n   ${s.antilink ? '⚠️ Links will be deleted' : '💚 Links allowed'}\n${BOT}`, msg, [msg.key.participant || msg.key.remoteJid]);
        }
    },

    // ─── WELCOME ───
    {
        name: 'welcome',
        aliases: ['welcomemsg'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('👋');

            const s = getSettings(from);
            const mode = (args[0] || '').toLowerCase();

            if (mode === 'on') s.welcome = true;
            else if (mode === 'off') s.welcome = false;
            else s.welcome = !s.welcome;
            saveSettings();

            await react(s.welcome ? '✅' : '🚫');

            await h.sendWithLogo(sock, from,
`${TOP}\n   👋 *WELCOME MESSAGE*\n${MID}\n   ├ 📊 *Status* : ${s.welcome ? '🟢 ENABLED' : '🔴 DISABLED'}\n   ├ 👤 *By*     : @${h.getSender(msg)}\n   └ 💡 *Usage*  : .welcome on / off\n${MID}\n   ${s.welcome ? '💚 New members will be greeted' : '🔇 Welcome disabled'}\n${BOT}`, msg, [msg.key.participant || msg.key.remoteJid]);
        }
    },

    // ─── GOODBYE ───
    {
        name: 'goodbye',
        aliases: ['byemsg'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('👋');

            const s = getSettings(from);
            const mode = (args[0] || '').toLowerCase();

            if (mode === 'on') s.goodbye = true;
            else if (mode === 'off') s.goodbye = false;
            else s.goodbye = !s.goodbye;
            saveSettings();

            await react(s.goodbye ? '✅' : '🚫');

            await h.sendWithLogo(sock, from,
`${TOP}\n   👋 *GOODBYE MESSAGE*\n${MID}\n   ├ 📊 *Status* : ${s.goodbye ? '🟢 ENABLED' : '🔴 DISABLED'}\n   ├ 👤 *By*     : @${h.getSender(msg)}\n   └ 💡 *Usage*  : .goodbye on / off\n${BOT}`, msg, [msg.key.participant || msg.key.remoteJid]);
        }
    },

    // ─── GROUPINFO ───
    {
        name: 'groupinfo',
        aliases: ['ginfo'],
        groupOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('📊');

            try {
                const meta = await sock.groupMetadata(from);
                const admins = meta.participants.filter(p => p.admin);
                const createdDate = new Date(meta.creation * 1000).toLocaleDateString();

                const caption =
`${TOP}\n   📊 *GROUP INFO*\n${MID}\n   📛 *Name* : ${meta.subject}\n${THIN}\n   📝 *Description*\n${THIN}\n   ${meta.desc || '_No description_'}\n${THIN}\n   🔢 *Info*\n${THIN}\n   ├ 🆔 *ID*      : ${meta.id.split('@')[0]}\n   ├ 👥 *Members* : ${meta.participants.length}\n   ├ 👑 *Admins*  : ${admins.length}\n   ├ 📅 *Created* : ${createdDate}\n   └ 👤 *Creator* : @${h.cleanJid(meta.owner || 'Unknown')}\n${THIN}\n   🛡️ *Admins*\n${THIN}\n${admins.slice(0, 5).map(a => `   ├ 👑 @${h.cleanJid(a.id)}`).join('\n')}\n${admins.length > 5 ? `   └ ... +${admins.length - 5} more` : ''}\n${MID}\n   💖 *Saba MD*\n${BOT}`;

                await h.sendWithLogo(sock, from, caption, msg, admins.map(a => a.id));
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ─── GROUPLINK ───
    {
        name: 'grouplink',
        aliases: ['linkgc'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🔗');

            try {
                const code = await sock.groupInviteCode(from);
                const link = `https://chat.whatsapp.com/${code}`;
                await react('✅');
                await h.sendWithLogo(sock, from,
`${TOP}\n   🔗 *GROUP INVITE LINK*\n${MID}\n   ${link}\n${MID}\n   ├ 🕒 *Time* : ${new Date().toLocaleTimeString(config.TIMEZONE)}\n   └ ⚠️ *Note* : Do not share publicly\n${MID}\n   💖 *Saba MD*\n${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ─── RESETLINK ───
    {
        name: 'resetlink',
        aliases: ['revoke'],
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
`${TOP}\n   🔄 *LINK RESET*\n${MID}\n   🆕 *New Link:*\n   ${link}\n${MID}\n   ├ 🕒 *Time* : ${new Date().toLocaleTimeString(config.TIMEZONE)}\n   └ ✅ *Status* : Old revoked, new active\n${MID}\n   💖 *Saba MD*\n${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ─── SETNAME ───
    {
        name: 'setname',
        aliases: ['gcname'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📝');

            if (!args.length) {
                await react('❌');
                return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO NAME*\n${MID}\n   Usage: .setname New Name\n${BOT}`, msg);
            }

            const newName = args.join(' ');
            try {
                await sock.groupUpdateSubject(from, newName);
                await react('✅');
                await h.sendWithLogo(sock, from,
`${TOP}\n   📝 *NAME UPDATED*\n${MID}\n   ├ 🆕 *New* : ${newName}\n   ├ 👑 *By*  : @${h.getSender(msg)}\n   └ ✅ *Done*\n${MID}\n   💖 *Saba MD*\n${BOT}`, msg, [msg.key.participant || msg.key.remoteJid]);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ─── SETDESC ───
    {
        name: 'setdesc',
        aliases: ['gcdesc'],
        groupOnly: true,
        adminOnly: true,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📄');

            if (!args.length) {
                await react('❌');
                return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: .setdesc New description\n${BOT}`, msg);
            }

            const newDesc = args.join(' ');
            try {
                await sock.groupUpdateDescription(from, newDesc);
                await react('✅');
                await h.sendWithLogo(sock, from,
`${TOP}\n   📄 *DESCRIPTION UPDATED*\n${MID}\n   ├ 🆕 *New* : ${newDesc}\n   ├ 👑 *By*  : @${h.getSender(msg)}\n   └ ✅ *Done*\n${MID}\n   💖 *Saba MD*\n${BOT}`, msg, [msg.key.participant || msg.key.remoteJid]);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ─── LEAVE ───
    {
        name: 'leave',
        aliases: ['exit'],
        groupOnly: true,
        ownerOnly: true,
        run: async ({ sock, from, msg, react }) => {
            await react('👋');
            await sock.sendMessage(from, {
                text: `${TOP}\n   👋 *GOODBYE*\n${MID}\n   Leaving this group now...\n   💚 It was nice being here!\n${MID}\n   💖 *Saba MD*\n${BOT}`
            });
            await react('✅');
            await new Promise(r => setTimeout(r, 1500));
            await sock.groupLeave(from);
        }
    },

    // ─── ADMINS ───
    {
        name: 'admins',
        aliases: ['adminlist'],
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

            text += `${MID}\n   💖 *Saba MD*\n${BOT}`;

            await sock.sendMessage(from, { text, mentions: admins.map(a => a.id) }, { quoted: msg });
            await react('✅');
        }
    },

    // ─── POLL ───
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
`${TOP}\n   ⚠️ *POLL FORMAT*\n${MID}\n   Usage:\n   .poll Question | Option1 | Option2\n${MID}\n   Example:\n   .poll Best color? | Red | Blue\n${BOT}`, msg);
            }

            const question = parts[0];
            const options = parts.slice(1);

            try {
                await sock.sendMessage(from, {
                    poll: { name: question, values: options, selectableCount: 1 }
                }, { quoted: msg });
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ─── LOCK ───
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
`${TOP}\n   🔒 *GROUP LOCKED*\n${MID}\n   ├ 📊 *Status* : Locked\n   └ 🛡️ *Effect* : Only admins can edit\n${MID}\n   💖 *Saba MD*\n${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ─── UNLOCK ───
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
`${TOP}\n   🔓 *GROUP UNLOCKED*\n${MID}\n   ├ 📊 *Status* : Unlocked\n   └ 🛡️ *Effect* : Everyone can edit\n${MID}\n   💖 *Saba MD*\n${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message}\n${BOT}`, msg);
            }
        }
    },

    // ─── GCID ───
    {
        name: 'gcid',
        aliases: ['groupid'],
        groupOnly: true,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🆔');
            await h.sendWithLogo(sock, from,
`${TOP}\n   🆔 *GROUP ID*\n${MID}\n   \`\`\`\n   ${from}\n   \`\`\`\n${MID}\n   💖 *Saba MD*\n${BOT}`, msg);
            await react('✅');
        }
    },

    // ─── MEMBERS ───
    {
        name: 'members',
        aliases: ['memberlist'],
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

            members.slice(0, 30).forEach(m => {
                const num = h.cleanJid(m.id);
                const badge = m.admin === 'superadmin' ? '👑' : m.admin === 'admin' ? '🛡️' : '👤';
                text += `   ${badge} @${num}\n`;
            });

            if (members.length > 30) text += `   ... +${members.length - 30} more\n`;

            text += `${MID}\n   💖 *Saba MD*\n${BOT}`;

            await sock.sendMessage(from, {
                text,
                mentions: members.slice(0, 30).map(m => m.id)
            }, { quoted: msg });

            await react('✅');
        }
    },

];