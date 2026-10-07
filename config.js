// ===============================================
//  💚 SABA MD — CONFIGURATION
//  👨‍💻 Made by Arslan Tech's
// ===============================================

require('dotenv').config();

module.exports = {

    // ─── 1. BOT IDENTITY ──────────────────────────
    BOT_NAME:   process.env.BOT_NAME   || 'Saba MD',
    BOT_LOGO:   process.env.BOT_LOGO   || 'https://i.ibb.co/saba-md-logo.png',
    VERSION:    process.env.VERSION    || '1.0.0',
    PREFIX:     process.env.PREFIX     || '.',

    // ─── 2. OWNER INFO ────────────────────────────
    OWNER_NAME: process.env.OWNER_NAME || 'Saba',
    // Multiple owners? Comma se separate karo: "923001234567,923009999999"
    OWNER: (process.env.OWNER_NUMBER || '923001234567')
        .split(',')
        .map(n => n.trim())
        .filter(Boolean)
        .map(n => n.includes('@') ? n : `${n}@s.whatsapp.net`),

    // ─── 3. SESSION ──────────────────────────────
    sessionName: process.env.SESSION_NAME || 'session',

    // ─── 4. PAIRING MODE ─────────────────────────
    // PUBLIC_PAIRING = true  → koi bhi website se pairing karega
    // PUBLIC_PAIRING = false → sirf PAIRING_NUMBER hi pair hoga
    PUBLIC_PAIRING: process.env.PUBLIC_PAIRING === 'true' || true,

    // Fixed pairing number (jab PUBLIC_PAIRING = false)
    PAIRING_NUMBER: process.env.PAIRING_NUMBER || '',

    // ─── 5. ANTI-CALL ────────────────────────────
    ANTI_CALL:       process.env.ANTI_CALL === 'true'       || false,
    AUTO_BLOCK_CALL: process.env.AUTO_BLOCK_CALL === 'true' || false,

    // ─── 6. WEBSITE ──────────────────────────────
    PORT: process.env.PORT || 3000,
    WEBSITE: {
        title:    'Saba MD — WhatsApp Pairing',
        tagline:  'Connect your WhatsApp in seconds. No QR scan needed.',
        theme:    'green-gradient',
        github:   'https://github.com/ArslanTech-dev/Saba-MD',
        accent:   '#25D366',
    },

    // ─── 7. TIMEZONE ─────────────────────────────
    TIMEZONE: process.env.TZ || 'Asia/Karachi',

    // ─── 8. BEHAVIOUR ────────────────────────────
    autoRead:   true,
    autoTyping: true,
    cmdCooldown: 3000,  // 3 seconds — same user same command bar bar na bheje
};