// ===============================================
//  💚 SABA MD — WhatsApp Multi-Device Bot
//  👨‍💻 CREATOR: ARSLAN TECH'S
//  💖 Made with love for Saba
//  🔖 Version: 2.0.0 (Multi-Session)
// ===============================================

const { Boom } = require('@hapi/boom');
const {
    default: makeWASocket,
    DisconnectReason,
    useMultiFileAuthState,
    fetchLatestBaileysVersion,
    Browsers,
    makeCacheableSignalKeyStore,
} = require('@whiskeysockets/baileys');
const pino    = require('pino');
const chalk   = require('chalk');
const fs      = require('fs');
const path    = require('path');
const config  = require('./config');
const { startServer } = require('./server');
const { handleMessage, loadPlugins, setupEvents } = require('./handlers/message');
const { requestPairingCode } = require('./pair');
const { fancyLog } = require('./utils/logger');
const helper = require('./utils/helper');
const sessionManager = require('./utils/sessionManager');

// ===== GLOBALS =====
global.PREFIX     = config.PREFIX;
global.BOT_NAME   = config.BOT_NAME;
global.BOT_LOGO   = config.BOT_LOGO;
global.OWNER      = config.OWNER;
global.OWNER_NAME = config.OWNER_NAME;
global.VERSION    = '2.0.0';

// ===== ACTIVE SESSIONS MAP =====
const activeSessions = new Map();

// ===== SHARED STATE =====
let serverStarted = false;
let pluginsLoaded = false;
const startedAt = Date.now();

// ===============================================
//  🎨 BANNER
// ===============================================
console.log(chalk.hex('#25D366').bold(`
╔══════════════════════════════════════════════╗
║                                              ║
║          💚  S A B A   M D  💚               ║
║                                              ║
║     WhatsApp Multi-Device Bot (v2.0)         ║
║     Made by Arslan Tech's                    ║
║     For Saba 💖                              ║
║                                              ║
║     Multi-Session: Up to 10 users            ║
║                                              ║
╚══════════════════════════════════════════════╝
`));

// ===============================================
//  🚀 START BOT FOR A USER (Multi-Session)
// ===============================================
async function startBotForUser(number) {
    const cleanNumber = sessionManager.cleanNumber(number);

    if (!sessionManager.isValidNumber(cleanNumber)) throw new Error('Invalid phone number');

    if (activeSessions.has(cleanNumber)) {
        fancyLog('INFO', `Session already active for ${cleanNumber}`);
        return activeSessions.get(cleanNumber);
    }

    if (!sessionManager.canAddUser() && !sessionManager.userExists(cleanNumber)) {
        throw new Error(`Maximum ${sessionManager.MAX_USERS} users allowed`);
    }

    // Clear any previous session files to ensure fresh pairing
    const sessionPath = sessionManager.createSession(cleanNumber);
    
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    const sessionData = {
        number: cleanNumber,
        sock: null,
        state: 'starting',
        pairingCode: null,
        pairingRequestedAt: 0,
        pairingRequestPromise: null,
        reconnectAttempts: 0,
        startedAt: Date.now(),
        isReadyForPairing: false, // ✅ NEW: Flag for pairing readiness
    };

    const sock = makeWASocket({
        version,
        logger: pino({ level: 'fatal' }),
        printQRInTerminal: false,
        auth: {
            creds: state.creds,
            keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })),
        },
        browser: Browsers.ubuntu('Chrome'),
        syncFullHistory: false,
        markOnlineOnConnect: false,
        connectTimeoutMs: 60000,
        generateHighQualityLinkPreview: true,
        getMessage: async () => ({ conversation: '' }),
    });

    sessionData.sock = sock;
    activeSessions.set(cleanNumber, sessionData);

    sock.ev.on('creds.update', saveCreds);
    setupEvents(sock, cleanNumber);

    if (!pluginsLoaded) {
        loadPlugins();
        pluginsLoaded = true;
    }

    // ===============================================
    //  🔌 CONNECTION UPDATE
    // ===============================================
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            sessionData.state = 'pairing';
            sessionData.isReadyForPairing = true; // ✅ Set ready flag
            fancyLog('PAIRING', `[${cleanNumber}] QR received — ready for pairing code`);
        }

        if (connection === 'close') {
            sessionData.state = 'disconnected';
            sessionData.isReadyForPairing = false;
            sessionData.pairingCode = null;
            sessionData.pairingRequestPromise = null;

            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            fancyLog('ERROR', `[${cleanNumber}] Connection closed. Reason: ${reason}`);

            if (reason === DisconnectReason.loggedOut) {
                try {
                    fs.rmSync(sessionPath, { recursive: true, force: true });
                    fancyLog('WARN', `[${cleanNumber}] Session cleared (logged out)`);
                } catch (err) {
                    fancyLog('ERROR', `[${cleanNumber}] Session reset failed: ${err.message}`);
                }
                activeSessions.delete(cleanNumber);
            } else {
                sessionData.reconnectAttempts++;
                fancyLog('INFO', `[${cleanNumber}] Reconnecting in 5s...`);
                activeSessions.delete(cleanNumber);
                setTimeout(() => {
                    startBotForUser(cleanNumber).catch(err => {
                        fancyLog('ERROR', `[${cleanNumber}] Reconnect failed: ${err.message}`);
                    });
                }, 5000);
            }
        }

        else if (connection === 'open') {
            sessionData.state = 'connected';
            sessionData.isReadyForPairing = false;
            sessionData.pairingCode = null;
            sessionData.pairingRequestPromise = null;

            fancyLog('SUCCESS', `💚 [${cleanNumber}] Connected!`);

            try {
                const ownerJid = `${cleanNumber}@s.whatsapp.net`;
                const welcomeCaption = `💚 *${global.BOT_NAME}* is now online!`;
                await helper.sendWithLogo(sock, ownerJid, welcomeCaption);
            } catch (err) {
                fancyLog('WARN', `[${cleanNumber}] Welcome msg failed: ${err.message}`);
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
            await handleMessage(sock, msg, cleanNumber);
        } catch (err) {
            fancyLog('ERROR', `[${cleanNumber}] Message handler: ${err.message}`);
        }
    });

    return sessionData;
}

// ===============================================
//  🔑 CREATE PAIRING CODE (Wait for QR)
// ===============================================
async function createPairingCode(number) {
    const cleanNumber = sessionManager.cleanNumber(number);

    if (!sessionManager.isValidNumber(cleanNumber)) throw new Error('Invalid phone number');

    const existing = activeSessions.get(cleanNumber);
    if (existing && existing.state === 'connected') {
        throw new Error('This number is already connected');
    }

    let sessionData = existing;
    if (!sessionData) {
        sessionData = await startBotForUser(cleanNumber);
    }

    // ✅ FIX: Wait until the socket is ready for pairing (QR event received)
    // Agar ready nahi hai, toh 10 second tak wait karo
    let waited = 0;
    while (!sessionData.isReadyForPairing && waited < 10000) {
        await new Promise(r => setTimeout(r, 500));
        waited += 500;
    }

    if (!sessionData.isReadyForPairing) {
        throw new Error('WhatsApp connection timed out. Please try again.');
    }

    const now = Date.now();
    if (sessionData.pairingCode && now - sessionData.pairingRequestedAt < 45000) {
        return sessionData.pairingCode;
    }

    if (sessionData.pairingRequestPromise) {
        return sessionData.pairingRequestPromise;
    }

    sessionData.pairingRequestedAt = now;
    sessionData.pairingRequestPromise = (async () => {
        const code = await requestPairingCode(sessionData.sock, cleanNumber);
        if (!code) throw new Error('WhatsApp did not return a pairing code.');
        sessionData.pairingCode = code;
        return code;
    })().finally(() => {
        sessionData.pairingRequestPromise = null;
    });

    return sessionData.pairingRequestPromise;
}

// ===============================================
//  📊 BOT STATUS
// ===============================================
function getBotStatus() {
    const sessions = [];
    for (const [number, data] of activeSessions.entries()) {
        sessions.push({
            number,
            state: data.state,
            connected: data.state === 'connected',
        });
    }
    return {
        name: global.BOT_NAME,
        version: global.VERSION,
        totalSessions: activeSessions.size,
        maxSessions: sessionManager.MAX_USERS,
        sessions,
        uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
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

// ===============================================
//  ▶️ BOOT — Server + Auto-Restore Sessions
// ===============================================
if (require.main === module) {
    if (!serverStarted) {
        startServer();
        serverStarted = true;
    }

    const existingUsers = sessionManager.listUsers();
    if (existingUsers.length > 0) {
        fancyLog('INFO', `Restoring ${existingUsers.length} session(s)...`);
        existingUsers.forEach((num, i) => {
            setTimeout(() => {
                startBotForUser(num).catch(err => {
                    fancyLog('ERROR', `[${num}] Restore failed: ${err.message}`);
                });
            }, i * 2000);
        });
    } else {
        fancyLog('INFO', 'No existing sessions. Waiting for pairing...');
    }
}

// ===============================================
//  📤 EXPORTS
// ===============================================
module.exports = {
    createPairingCode,
    getBotStatus,
    startBotForUser,
    activeSessions,
};