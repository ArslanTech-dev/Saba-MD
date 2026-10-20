// ===============================================
//  💚 SABA MD — CONFIGURATION (Backend)
//  👨‍💻 Made by Arslan Tech's for Saba
// ===============================================

// Overriding is necessary for Termux/Cloud to prevent system env conflicts
require('dotenv').config({ override: true });

module.exports = {

    // ─── 1. BOT IDENTITY ──────────────────────────
    BOT_NAME:   process.env.BOT_NAME   || 'Saba MD',
    BOT_LOGO:   './assets/logo.png',        // Main logo
    BOT_BANNER: './assets/banner.png',      // Wide banner
    BOT_SABA:   './assets/saba.png',        // Saba special
    VERSION:    process.env.VERSION    || '2.0.0',
    PREFIX:     process.env.PREFIX     || '.',

    // ─── 2. OWNER INFO ────────────────────────────
    OWNER_NAME: process.env.OWNER_NAME || 'Saba',
    OWNER: (process.env.OWNER_NUMBER || '923037314690')
        .split(',')
        .map(n => n.trim())
        .filter(Boolean)
        .map(n => n.includes('@') ? n : `${n}@s.whatsapp.net`),

    // ─── 3. SESSION ──────────────────────────────
    sessionName: process.env.SESSION_NAME || 'session',

    // ─── 4. PAIRING MODE ─────────────────────────
    PUBLIC_PAIRING: process.env.PUBLIC_PAIRING === 'true' || true,
    PAIRING_NUMBER: process.env.PAIRING_NUMBER || '',

    // ─── 5. ANTI-CALL ────────────────────────────
    ANTI_CALL:       process.env.ANTI_CALL === 'true'       || false,
    AUTO_BLOCK_CALL: process.env.AUTO_BLOCK_CALL === 'true' || false,

    // ─── 6. WEBSITE SETTINGS ─────────────────────
    PORT: process.env.PORT || 3000,
    TIMEZONE: process.env.TZ || 'Asia/Karachi',
    
    WEBSITE: {
        title:   'Saba MD — Advanced Platform',
        tagline: 'Connect your WhatsApp in seconds. No QR scan needed.',
        theme:   'dark-cloud',
        github:  'https://github.com/ArslanTech-dev/Saba-MD',
        accent:  '#35d4ff',
    },

    // ─── 7. BEHAVIOUR ────────────────────────────
    autoRead:    true,
    autoTyping:  true,
    cmdCooldown: 3000,
    ANTIDELETE_DM: process.env.ANTIDELETE_DM === 'true' || false,
};