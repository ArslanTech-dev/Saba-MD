// ===============================================
//  💚 SABA MD — HELPER FUNCTIONS
//  👨‍💻 Made by Arslan Tech's
// ===============================================

const config = require('../config');

const helper = {

    // ─── Random pick from array ───
    pickRandom: (arr) => arr[Math.floor(Math.random() * arr.length)],

    // ─── Random number between min-max ───
    randomInt: (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    // ─── Format bytes to KB/MB/GB ───
    formatBytes: (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
    },

    // ─── Format seconds to human readable ───
    formatUptime: (seconds) => {
        const d = Math.floor(seconds / 86400);
        const h = Math.floor((seconds % 86400) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = Math.floor(seconds % 60);
        const parts = [];
        if (d) parts.push(`${d}d`);
        if (h) parts.push(`${h}h`);
        if (m) parts.push(`${m}m`);
        if (s) parts.push(`${s}s`);
        return parts.join(' ') || '0s';
    },

    // ─── Clean JID (remove device suffix) ───
    cleanJid: (jid) => String(jid).split(':')[0].split('@')[0],

    // ─── Convert number to JID ───
    toJid: (number) => {
        const clean = String(number).replace(/\D/g, '');
        return `${clean}@s.whatsapp.net`;
    },

    // ─── Get sender number from msg ───
    getSender: (msg) => {
        const jid = msg.key.participant || msg.key.remoteJid;
        return helper.cleanJid(jid);
    },

    // ─── Check if sender is owner ───
    isOwner: (sender) => {
        const num = helper.cleanJid(sender);
        return config.OWNER.some(jid => helper.cleanJid(jid) === num);
    },

    // ─── Check if group ───
    isGroup: (jid) => String(jid).endsWith('@g.us'),

    // ─── Get text from message ───
    getText: (msg) => {
        const m = msg.message;
        if (!m) return '';
        return m.conversation
            || m.extendedTextMessage?.text
            || m.imageMessage?.caption
            || m.videoMessage?.caption
            || m.buttonsResponseMessage?.selectedButtonId
            || m.listResponseMessage?.singleSelectReply?.selectedRowId
            || '';
    },

    // ─── Get mentioned JIDs ───
    getMentions: (msg) => {
        return msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    },

    // ─── Is reply? ───
    getQuoted: (msg) => {
        return msg.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
    },

    // ─── Sleep ───
    sleep: (ms) => new Promise(r => setTimeout(r, ms)),

    // ─── Capitalize ───
    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),

    // ─── Saba styled text ───
    sabaText: (title, body) => {
        return `╭─⬡ *${title}* ⬡─╮\n│\n${body.split('\n').map(l => `│ ${l}`).join('\n')}\n│\n╰──────────────╯\n> 💚 *Saba MD*`;
    },
};

module.exports = helper;