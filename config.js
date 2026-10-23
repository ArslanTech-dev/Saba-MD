require('dotenv').config({ override: true });

module.exports = {
    BOT_NAME:   process.env.BOT_NAME   || 'Saba MD',
    BOT_LOGO:   './assets/logo.png',
    BOT_BANNER: './assets/banner.png',
    BOT_SABA:   './assets/saba.png',
    VERSION:    process.env.VERSION    || '2.0.0',
    PREFIX:     process.env.PREFIX     || '.',

    OWNER_NAME: process.env.OWNER_NAME || 'Saba',
    OWNER: (process.env.OWNER_NUMBER || '923037314690')
        .split(',')
        .map(n => n.trim())
        .filter(Boolean)
        .map(n => n.includes('@') ? n : `${n}@s.whatsapp.net`),

    sessionName: process.env.SESSION_NAME || 'session',
    PUBLIC_PAIRING: process.env.PUBLIC_PAIRING === 'true' || true,
    PAIRING_NUMBER: process.env.PAIRING_NUMBER || '',

    ANTI_CALL:       process.env.ANTI_CALL === 'true'       || false,
    AUTO_BLOCK_CALL: process.env.AUTO_BLOCK_CALL === 'true' || false,

    PORT: process.env.PORT || 3000,
    TIMEZONE: process.env.TZ || 'Asia/Karachi',
    
    WEBSITE: {
        title:   'Saba MD — Advanced Platform',
        tagline: 'Connect your WhatsApp in seconds. No QR scan needed.',
        theme:   'dark-cloud',
        github:  'https://github.com/ArslanTech-dev/Saba-MD',
        accent:  '#35d4ff',
    },

    autoRead:    true,
    autoTyping:  true,
    cmdCooldown: 3000,
    ANTIDELETE_DM: process.env.ANTIDELETE_DM === 'true' || false,
};