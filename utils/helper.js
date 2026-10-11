// ===============================================
//  💚 SABA MD — HELPER FUNCTIONS
//  👨‍💻 Made by Arslan Tech's for Saba
// ===============================================

const fs   = require('fs');
const path = require('path');
const config = require('../config');

const helper = {

    // ═══════════════════════════════════════════
    //  🕒 SAFE TIME HELPERS (Termux compatible)
    // ═══════════════════════════════════════════
    now: () => {
        try {
            return new Date().toLocaleString('en-US', { timeZone: config.TIMEZONE });
        } catch {
            return new Date().toLocaleString();
        }
    },

    nowTime: () => {
        try {
            return new Date().toLocaleTimeString('en-US', { timeZone: config.TIMEZONE });
        } catch {
            return new Date().toLocaleTimeString();
        }
    },

    nowDate: () => {
        try {
            return new Date().toLocaleDateString('en-US', { timeZone: config.TIMEZONE });
        } catch {
            return new Date().toLocaleDateString();
        }
    },

    // ═══════════════════════════════════════════
    //  🎲 RANDOM / GENERAL
    // ═══════════════════════════════════════════
    pickRandom: (arr) => arr[Math.floor(Math.random() * arr.length)],
    randomInt:  (min, max) => Math.floor(Math.random() * (max - min + 1)) + min,

    // ═══════════════════════════════════════════
    //  📏 FORMATTERS
    // ═══════════════════════════════════════════
    formatBytes: (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
    },

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

    // ═══════════════════════════════════════════
    //  📱 JID HELPERS
    // ═══════════════════════════════════════════
    cleanJid: (jid) => String(jid).split(':')[0].split('@')[0],

    toJid: (number) => {
        const clean = String(number).replace(/\D/g, '');
        return `${clean}@s.whatsapp.net`;
    },

    getSender: (msg) => {
        const jid = msg.key.participant || msg.key.remoteJid;
        return helper.cleanJid(jid);
    },

    isOwner: (sender) => {
        const num = helper.cleanJid(sender);
        return config.OWNER.some(jid => helper.cleanJid(jid) === num);
    },

    isGroup: (jid) => String(jid).endsWith('@g.us'),

    // ═══════════════════════════════════════════
    //  📩 MESSAGE HELPERS
    // ═══════════════════════════════════════════
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

    getMentions: (msg) => {
        return msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    },

    getQuoted: (msg) => {
        return msg.message?.extendedTextMessage?.contextInfo?.quotedMessage || null;
    },

    sleep: (ms) => new Promise(r => setTimeout(r, ms)),

    capitalize: (str) => str.charAt(0).toUpperCase() + str.slice(1).toLowerCase(),

    // ═══════════════════════════════════════════
    //  🎨 SABA STYLED TEXT
    // ═══════════════════════════════════════════
    sabaText: (title, body) => {
        return `╭─⬡ *${title}* ⬡─╮\n│\n${body.split('\n').map(l => `│ ${l}`).join('\n')}\n│\n╰──────────────╯\n> 💚 *Saba MD*`;
    },

    // ═══════════════════════════════════════════
    //  🖼️ IMAGE / ASSETS HELPERS
    // ═══════════════════════════════════════════
    resolvePath: (filePath) => {
        if (!filePath) return null;
        if (path.isAbsolute(filePath)) return filePath;
        return path.join(process.cwd(), filePath);
    },

    getImageBuffer: (imgPath) => {
        try {
            const abs = helper.resolvePath(imgPath);
            if (!abs || !fs.existsSync(abs)) return null;
            return fs.readFileSync(abs);
        } catch {
            return null;
        }
    },

    getLogoBuffer:   () => helper.getImageBuffer(config.BOT_LOGO),
    getBannerBuffer: () => helper.getImageBuffer(config.BOT_BANNER),
    getSabaBuffer:   () => helper.getImageBuffer(config.BOT_SABA),

    sendImage: async (sock, from, imgPath, caption, quotedMsg = null, mentions = []) => {
        const buffer = helper.getImageBuffer(imgPath);
        const opts = {};
        if (quotedMsg) opts.quoted = quotedMsg;
        if (mentions.length) opts.mentions = mentions;

        if (buffer) {
            try {
                return await sock.sendMessage(from, {
                    image: buffer,
                    caption,
                    ...opts
                });
            } catch {}
        }
        return await sock.sendMessage(from, { text: caption, ...opts });
    },

    sendWithLogo:   (sock, from, cap, q, m = []) => helper.sendImage(sock, from, config.BOT_LOGO,   cap, q, m),
    sendWithBanner: (sock, from, cap, q, m = []) => helper.sendImage(sock, from, config.BOT_BANNER, cap, q, m),
    sendWithSaba:   (sock, from, cap, q, m = []) => helper.sendImage(sock, from, config.BOT_SABA,   cap, q, m),

    imageExists: (imgPath) => {
        const abs = helper.resolvePath(imgPath);
        return Boolean(abs && fs.existsSync(abs));
    },

    listAssets: () => ({
        logo:   { path: config.BOT_LOGO,   exists: helper.imageExists(config.BOT_LOGO) },
        banner: { path: config.BOT_BANNER, exists: helper.imageExists(config.BOT_BANNER) },
        saba:   { path: config.BOT_SABA,   exists: helper.imageExists(config.BOT_SABA) },
    }),
};

module.exports = helper;