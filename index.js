// ===============================================
//  💚 SABA MD — WhatsApp Multi-Device Bot
//  👨‍💻 CREATOR: ARSLAN TECH'S
//  💖 Made with love for Saba
//  🔖 Version: 1.0.0
// ===============================================

const { Boom } = require('@hapi/boom');
const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    Browsers,
} = require('@whiskeysockets/baileys');
const pino    = require('pino');
const chalk   = require('chalk');
const fs      = require('fs');
const config  = require('./config');
const { handleMessage, loadPlugins, setupEvents } = require('./handlers/message');
const { requestPairingCode } = require('./pair');
const { fancyLog } = require('./utils/logger');
const helper = require('./utils/helper');

// ===== GLOBALS =====
global.PREFIX     = config.PREFIX;
global.BOT_NAME   = config.BOT_NAME;
global.BOT_LOGO   = config.BOT_LOGO;
global.OWNER      = config.OWNER;
global.OWNER_NAME = config.OWNER_NAME;
global.VERSION    = config.VERSION;

// ===== BANNER =====
console.log(chalk.hex('#25D366').bold(`
╔══════════════════════════════════════════════╗
║                                              ║
║          💚  S A B A   M D  💚               ║
║                                              ║
║     WhatsApp Multi-Device Bot                ║
║     Made by Arslan Tech's                    ║
║     For Saba 💖                              ║
║                                              ║
╚══════════════════════════════════════════════╝
`));

// ===== STATE =====
let sock;
let reconnecting       = false;
let connectionState    = 'starting';
let pairingCode        = null;
let pairingRequestedAt = 0;
let pairingPhoneNumber = null;
let pairingRequestPromise = null;
let reconnectAttempts  = 0;
const startedAt        = Date.now();

// ===============================================
//  🚀 START BOT
// ===============================================
async function startBot() {
    if (reconnecting && reconnectAttempts > 0) {
        fancyLog('INFO', `Reconnect attempt #${reconnectAttempts}...`);
    }
    reconnecting = true;
    connectionState = 'starting';

    fancyLog('INFO', `Starting ${global.BOT_NAME}...`);

    if (!fs.existsSync('session')) fs.mkdirSync('session', { recursive: true });

    const { state, saveCreds } = await useMultiFileAuthState('session');

    const { version, isLatest } = await fetchLatestBaileysVersion();
    fancyLog('INFO', `Baileys v${version.join('.')} ${isLatest ? '(latest)' : ''}`);

    sock = makeWASocket({
        version,
        logger: pino({ level: 'silent' }),
        printQRInTerminal: false,
        auth: state,
        browser: Browsers.ubuntu('Chrome'),
        syncFullHistory: false,
        markOnlineOnConnect: false,
        connectTimeoutMs: 60000,
        generateHighQualityLinkPreview: true,
        getMessage: async () => ({ conversation: '' }),
    });

    sock.ev.on('creds.update', saveCreds);

    // ─── Load plugins & setup events ───
    loadPlugins();
    setupEvents(sock);

    // ===============================================
    //  🔌 CONNECTION UPDATE
    // ===============================================
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            connectionState = 'pairing';
            if (config.PAIRING_NUMBER && !config.PUBLIC_PAIRING) {
                try {
                    await createPairingCode(config.PAIRING_NUMBER);
                    fancyLog('SUCCESS', `Pairing code generated for ${config.PAIRING_NUMBER}`);
                } catch (err) {
                    fancyLog('ERROR', `Pairing failed: ${err.message}`);
                }
            } else if (config.PUBLIC_PAIRING) {
                fancyLog('INFO', '🌐 Public pairing ready — visit the pairing website.');
            }
        }

        // ─── CLOSE ───
        if (connection === 'close') {
            reconnecting = false;
            connectionState = 'disconnected';
            pairingCode = null;
            pairingPhoneNumber = null;
            pairingRequestPromise = null;

            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            fancyLog('ERROR', `Connection closed. Reason: ${reason}`);

            if (reason === DisconnectReason.loggedOut) {
                try {
                    fs.rmSync('session', { recursive: true, force: true });
                    fs.mkdirSync('session', { recursive: true });
                    fancyLog('WARN', '🧹 Session cleared. Fresh pairing will start...');
                } catch (err) {
                    fancyLog('ERROR', `Session reset failed: ${err.message}`);
                }
                reconnectAttempts = 0;
                setTimeout(startBot, 5000);
            } else {
                reconnectAttempts++;
                fancyLog('INFO', `🔄 Reconnecting in 5s... (attempt ${reconnectAttempts})`);
                setTimeout(startBot, 5000);
            }
        }

        // ─── OPEN ───
        else if (connection === 'open') {
            reconnecting = false;
            connectionState = 'connected';
            reconnectAttempts = 0;
            pairingCode = null;
            pairingPhoneNumber = null;
            pairingRequestPromise = null;

            if (config.PUBLIC_PAIRING && sock.user?.id) {
                const connectedId = String(sock.user.id).split(':')[0];
                config.OWNER = [connectedId.includes('@') ? connectedId : `${connectedId}@s.whatsapp.net`];
                global.OWNER = config.OWNER;
                fancyLog('INFO', `Owner set to ${config.OWNER[0]}`);
            }

            fancyLog('SUCCESS', `💚 ${global.BOT_NAME} is online!`);

            // ─── WELCOME MESSAGE (with SABA.png) ───
            const ownerJid = config.OWNER[0];
            if (ownerJid) {
                try {
                    const uptimeSec = Math.floor((Date.now() - startedAt) / 1000);

                    const welcomeCaption =
`╭━━━❰ *${global.BOT_NAME}* ❱━━━╮
┃
┃   💚 *Welcome back, ${global.OWNER_NAME}!*
┃
┣━━━━━━━━━━━━━━━━━━━━━━
┃
┃  ⚡ *Status*    : Online ✅
┃  🧠 *Version*   : ${global.VERSION}
┃  👑 *Owner*     : ${global.OWNER_NAME}
┃  🌐 *Prefix*    : ${global.PREFIX}
┃  🕒 *Time*      : ${new Date().toLocaleString(config.TIMEZONE)}
┃  ⏱️ *Uptime*    : ${uptimeSec}s
┃  📦 *Session*   : Active
┃
┣━━━━━━━━━━━━━━━━━━━━━━
┃
┃  🔗 Send *${global.PREFIX}menu* to see all commands
┃
╰━━━━━━━━━━━━━━━━━━━━━━╯

> 💖 *Made with love by Arslan Tech's*
> 🎀 *For Saba*`;

                    await helper.sendWithSaba(sock, ownerJid, welcomeCaption);
                    fancyLog('SUCCESS', '💚 Welcome message (with Saba image) sent.');
                } catch (err) {
                    fancyLog('WARN', `Could not send welcome message: ${err.message}`);
                }
            }
        }
    });

    // ===============================================
    //  📩 MESSAGE HANDLER
    // ===============================================
    sock.ev.on('messages.upsert', async (m) => {
        try {
            const msg = m.messages[0];
            if (!msg.message || msg.key.fromMe) return;
            await handleMessage(sock, msg);
        } catch (err) {
            fancyLog('ERROR', `Message handler error: ${err.message}`);
        }
    });

    // ===============================================
    //  ☎️ ANTI-CALL
    // ===============================================
    if (config.ANTI_CALL) {
        sock.ev.on('CB:call', async (json) => {
            try {
                const callId   = json.content[0].attrs['call-id'];
                const callerId = json.content[0].attrs['from'];

                await sock.rejectCall(callId, callerId);
                fancyLog('ANTICALL', `Rejected call from ${callerId}`);

                await sock.sendMessage(callerId, {
                    text: `📵 *${global.BOT_NAME}*\n\nSorry, calls are disabled.\nPlease send a message instead. 💚`
                });

                if (config.AUTO_BLOCK_CALL) {
                    await sock.updateBlockStatus(callerId, 'block');
                    fancyLog('BLOCK', `Blocked caller ${callerId}`);
                }
            } catch (err) {
                fancyLog('ERROR', `Anti-call error: ${err.message}`);
            }
        });
    }

    return sock;
}

// ===============================================
//  🔑 CREATE PAIRING CODE
// ===============================================
async function createPairingCode(phoneNumber = config.PAIRING_NUMBER) {
    if (!sock) {
        throw new Error('WhatsApp connection is still starting. Try again in a few seconds.');
    }
    if (connectionState === 'connected') {
        throw new Error('This bot is already connected to WhatsApp.');
    }

    const now = Date.now();
    const requestedNumber = String(phoneNumber || '').replace(/\D/g, '');

    if (pairingCode && now - pairingRequestedAt < 45000) {
        if (requestedNumber === pairingPhoneNumber) return pairingCode;
        const busyError = new Error('Another pairing code is active. Please wait up to 45 seconds.');
        busyError.code = 'PAIRING_BUSY';
        throw busyError;
    }

    if (pairingRequestPromise) {
        if (requestedNumber === pairingPhoneNumber) return pairingRequestPromise;
        const busyError = new Error('Another pairing request is in progress. Try again shortly.');
        busyError.code = 'PAIRING_BUSY';
        throw busyError;
    }

    pairingPhoneNumber = requestedNumber;
    pairingRequestedAt = now;
    pairingRequestPromise = (async () => {
        const code = await requestPairingCode(sock, phoneNumber);
        if (!code) throw new Error('WhatsApp did not return a pairing code.');
        pairingCode = code;
        setTimeout(() => {
            if (Date.now() - pairingRequestedAt >= 45000) {
                pairingCode = null;
                pairingPhoneNumber = null;
            }
        }, 45000);
        return pairingCode;
    })().finally(() => {
        pairingRequestPromise = null;
    });

    return pairingRequestPromise;
}

// ===============================================
//  📊 BOT STATUS
// ===============================================
function getBotStatus() {
    const uptimeSeconds = Math.floor((Date.now() - startedAt) / 1000);
    return {
        name: global.BOT_NAME,
        version: global.VERSION,
        state: connectionState,
        connected: connectionState === 'connected' && Boolean(sock?.user),
        pairingAvailable: connectionState !== 'disconnected' && Boolean(sock && !sock.user),
        publicPairing: config.PUBLIC_PAIRING,
        uptimeSeconds,
        nodeVersion: process.versions.node,
        memory: Math.round(process.memoryUsage().rss / 1024 / 1024) + ' MB',
    };
}

// ===============================================
//  🛡️ GLOBAL ERROR HANDLERS
// ===============================================
process.on('uncaughtException', (err) => {
    fancyLog('ERROR', `[uncaughtException] ${err.message}`);
});
process.on('unhandledRejection', (err) => {
    fancyLog('ERROR', `[unhandledRejection] ${err?.message || err}`);
});
process.on('SIGINT', () => {
    fancyLog('WARN', '🛑 Shutting down Saba MD...');
    process.exit(0);
});

// ===============================================
//  ▶️ BOOT
// ===============================================
if (require.main === module) {
    startBot().catch((err) => {
        fancyLog('ERROR', `Start failed: ${err.message}`);
    });
}

module.exports = { createPairingCode, getBotStatus, startBot };