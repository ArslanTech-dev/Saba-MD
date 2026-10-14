// ===============================================
//  💚 SABA MD — PAIRING CODE REQUEST
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎯 Multi-Session Ready
//  💾 Per-user pairing (no global cache)
// ===============================================

const config = require('./config');
const { fancyLog } = require('./utils/logger');

// ═══════════════════════════════════════════════
//  🔑 REQUEST PAIRING CODE
//  Baileys se 8-digit code mangwata hai
//  Specific socket + number ke liye
// ═══════════════════════════════════════════════
async function requestPairingCode(sock, phoneNumber) {
    // ─── Validate sock ───
    if (!sock) {
        throw new Error('WhatsApp socket not initialized.');
    }

    // ─── Validate number ───
    const cleanNumber = String(phoneNumber || '').replace(/\D/g, '');

    if (!cleanNumber) {
        throw new Error('Phone number is required.');
    }

    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
        throw new Error('Invalid phone number. Include country code (e.g. 923001234567).');
    }

    // ─── Check if already connected ───
    if (sock.user) {
        throw new Error('This session is already connected.');
    }

    // ─── Request pairing code from Baileys ───
    try {
        fancyLog('PAIRING', `Requesting code for ${cleanNumber}...`);

        const code = await sock.requestPairingCode(cleanNumber);

        if (!code) {
            throw new Error('WhatsApp did not return a pairing code.');
        }

        // ─── Format as XXXX-XXXX ───
        const formatted = formatCode(code);

        fancyLog('SUCCESS', `✅ Pairing code generated: ${formatted} (for ${cleanNumber})`);

        return formatted;

    } catch (err) {
        fancyLog('ERROR', `[${cleanNumber}] Pairing request failed: ${err.message}`);
        throw new Error(`Pairing failed: ${err.message}`);
    }
}

// ═══════════════════════════════════════════════
//  🧹 FORMAT CODE — XXXX-XXXX
// ═══════════════════════════════════════════════
function formatCode(code) {
    if (!code) return '';
    const clean = String(code).replace(/-/g, '');
    const match = clean.match(/.{1,4}/g);
    return match ? match.join('-') : code;
}

// ═══════════════════════════════════════════════
//  ✅ VALIDATE CODE — 8 digits check
// ═══════════════════════════════════════════════
function isValidCode(code) {
    if (!code) return false;
    const clean = String(code).replace(/\D/g, '');
    return clean.length === 8;
}

// ═══════════════════════════════════════════════
//  🧹 CLEAN CODE — remove dashes
// ═══════════════════════════════════════════════
function cleanCode(code) {
    if (!code) return '';
    return String(code).replace(/\D/g, '');
}

// ═══════════════════════════════════════════════
//  🛡️ SAFE REQUEST — with timeout protection
// ═══════════════════════════════════════════════
async function requestPairingCodeSafe(sock, phoneNumber, timeoutMs = 30000) {
    const timeout = new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Pairing request timeout')), timeoutMs);
    });

    return Promise.race([
        requestPairingCode(sock, phoneNumber),
        timeout,
    ]);
}

// ═══════════════════════════════════════════════
//  📤 EXPORTS
// ═══════════════════════════════════════════════
module.exports = {
    requestPairingCode,
    requestPairingCodeSafe,
    formatCode,
    isValidCode,
    cleanCode,
};