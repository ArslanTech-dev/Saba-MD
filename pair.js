// ===============================================
//  💚 SABA MD — PAIRING CODE REQUEST
//  👨‍💻 Made by Arslan Tech's
// ===============================================

const config = require('./config');
const { fancyLog } = require('./utils/logger');

// ===============================================
//  🔑 REQUEST PAIRING CODE
//  Baileys se 8-digit code mangwata hai
// ===============================================
async function requestPairingCode(sock, phoneNumber) {
    // ─── Validate sock ───
    if (!sock) {
        throw new Error('WhatsApp socket not initialized.');
    }

    // ─── Validate phone number ───
    const cleanNumber = String(phoneNumber || '').replace(/\D/g, '');

    if (!cleanNumber) {
        throw new Error('Phone number is required.');
    }

    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
        throw new Error('Invalid phone number. Include country code (e.g. 923001234567).');
    }

    // ─── Check if already connected ───
    if (sock.user) {
        throw new Error('Bot is already connected to WhatsApp.');
    }

    // ─── Request pairing code from Baileys ───
    try {
        fancyLog('PAIRING', `Requesting code for ${cleanNumber}...`);

        const code = await sock.requestPairingCode(cleanNumber);

        if (!code) {
            throw new Error('WhatsApp did not return a pairing code.');
        }

        // ─── Format as XXXX-XXXX ───
        const formatted = String(code).match(/.{1,4}/g)?.join('-') || code;

        fancyLog('SUCCESS', `Pairing code generated: ${formatted}`);

        return formatted;

    } catch (err) {
        fancyLog('ERROR', `Pairing request failed: ${err.message}`);
        throw new Error(`Pairing failed: ${err.message}`);
    }
}

// ===============================================
//  🧹 FORMAT CODE (helper — external use ke liye)
// ===============================================
function formatCode(code) {
    if (!code) return '';
    return String(code).replace(/-/g, '').match(/.{1,4}/g)?.join('-') || code;
}

// ===============================================
//  ✅ VALIDATE CODE
// ===============================================
function isValidCode(code) {
    if (!code) return false;
    const clean = String(code).replace(/\D/g, '');
    return clean.length === 8;
}

// ===============================================
//  📤 EXPORTS
// ===============================================
module.exports = {
    requestPairingCode,
    formatCode,
    isValidCode,
};