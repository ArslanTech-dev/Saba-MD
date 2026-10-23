// ===============================================
//  💚 SABA MD — PAIRING CODE REQUEST
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎯 Multi-Session Ready
//  💾 Per-user pairing (no global cache)
// ===============================================

const config = require('./config');
const { fancyLog } = require('./utils/logger');

async function requestPairingCode(sock, phoneNumber) {
    if (!sock) throw new Error('WhatsApp socket not initialized.');
    const cleanNumber = String(phoneNumber || '').replace(/\D/g, '');
    if (cleanNumber.length < 10 || cleanNumber.length > 15) throw new Error('Invalid number.');

    try {
        fancyLog('PAIRING', `Requesting code for ${cleanNumber}...`);
        await new Promise(r => setTimeout(r, 2000));
        const code = await sock.requestPairingCode(cleanNumber);
        if (!code) throw new Error('WhatsApp did not return a pairing code.');

        const formatted = formatCode(code);
        fancyLog('SUCCESS', `✅ Pairing code generated: ${formatted}`);
        return formatted;
    } catch (err) {
        fancyLog('ERROR', `[${cleanNumber}] Pairing failed: ${err.message}`);
        throw new Error(`Pairing failed: ${err.message}`);
    }
}

function formatCode(code) {
    if (!code) return '';
    const clean = String(code).replace(/-/g, '');
    const match = clean.match(/.{1,4}/g);
    return match ? match.join('-') : code;
}

module.exports = { requestPairingCode, formatCode };