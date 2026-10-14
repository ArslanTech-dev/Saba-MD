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
// Format: Map<number, { sock, state, pairingCode, ... }>
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

    // ─── Validate ───
    if (!sessionManager.isValidNumber(cleanNumber)) {
        throw new Error('Invalid phone number');
    }

    // ─── Already running? ───
    if (activeSessions.has(cleanNumber)) {
        fancyLog('INFO', `Session already active for ${cleanNumber}`);
        return activeSessions.get(cleanNumber);
    }

    // ─── Check limit ───
    if (!sessionManager.canAddUser() && !sessionManager.userExists(cleanNumber)) {
        throw new Error(`Maximum ${sessionManager.MAX_USERS} users allowed`);
    }

    // ─── Get session path ───
    const sessionPath = sessionManager.createSession(cleanNumber);

    // ─── Load auth state ───
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);

    // ─── Get Baileys version ───
    const { version, isLatest } = await fetchLatestBaileysVersion();

    // ─── Session state object ───
    const sessionData = {
        number: cleanNumber,
        sock: null,
        state: 'starting',
        pairingCode: null,
        pairingRequestedAt: 0,
        pairingRequestPromise: null,
        reconnectAttempts: 0,
        startedAt: Date.now(),
    };

    // ─── Create socket ───
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

    // ─── Save creds ───
    sock.ev.on('creds.update', saveCreds);

    // ─── Setup events for this session ───
    setupEvents(sock, cleanNumber);

    // ─── Load plugins (only once) ───
    if (!pluginsLoaded) {
        loadPlugins();
        pluginsLoaded = true;
    }

    // ===============================================
    //  🔌 CONNECTION UPDATE
    // ===============================================
    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        // ─── QR / Pairing ready ───
        if (qr) {
            sessionData.state = 'pairing';
            fancyLog('PAIRING', `[${cleanNumber}] QR received — pairing ready`);
        }

        // ─── Connection CLOSE ───
        if (connection === 'close') {
            sessionData.state = 'disconnected';
            sessionData.pairingCode = null;
            sessionData.pairingRequestPromise = null;

            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            fancyLog('ERROR', `[${cleanNumber}] Connection closed. Reason: ${reason}`);

            if (reason === DisconnectReason.loggedOut) {
                // Clear session on logout
                try {
                    fs.rmSync(sessionPath, { recursive: true, force: true });
                    fancyLog('WARN', `[${cleanNumber}] Session cleared (logged out)`);
                } catch (err) {
                    fancyLog('ERROR', `[${cleanNumber}] Session reset failed: ${err.message}`);
                }

                activeSessions.delete(cleanNumber);
                sessionData.reconnectAttempts = 0;
            } else {
                // Reconnect
                sessionData.reconnectAttempts++;
                fancyLog('INFO', `[${cleanNumber}] Reconnecting in 5s... (attempt ${sessionData.reconnectAttempts})`);
                activeSessions.delete(cleanNumber);
                setTimeout(() => {
                    startBotForUser(cleanNumber).catch(err => {
                        fancyLog('ERROR', `[${cleanNumber}] Reconnect failed: ${err.message}`);
                    });
                }, 5000);
            }
        }

        // ─── Connection OPEN ───
        else if (connection === 'open') {
            sessionData.state = 'connected';
            sessionData.reconnectAttempts = 0;
            sessionData.pairingCode = null;
            sessionData.pairingRequestPromise = null;

            fancyLog('SUCCESS', `💚 [${cleanNumber}] Connected!`);

            // ─── Welcome Message ───
            try {
                const ownerJid = `${cleanNumber}@s.whatsapp.net`;
                const uptimeSec = Math.floor((Date.now() - startedAt) / 1000);

                const welcomeCaption =
`💚 *${global.BOT_NAME}* is now online!

━━━━━━━━━━━━━━━━━━

👋 *Welcome back!*

Your WhatsApp bot is successfully connected and ready to serve. All systems are running smoothly.

━━━━━━━━━━━━━━━━━━

📋 *Bot Information*

• 🤖 *Bot Name* : ${global.BOT_NAME}
• 🧠 *Version*  : ${global.VERSION}
• 📱 *Number*   : +${cleanNumber}
• 🌐 *Prefix*   : ${global.PREFIX}
• ⏱️ *Uptime*   : ${uptimeSec}s

━━━━━━━━━━━━━━━━━━

⚡ *Quick Start*

• Type *${global.PREFIX}menu* to see all commands
• Type *${global.PREFIX}ping* to test the bot

━━━━━━━━━━━━━━━━━━

> 💚 *Powered by Arslan Tech's*
> 🎀 *Made with love for Saba*`;

                await helper.sendWithLogo(sock, ownerJid, welcomeCaption);
                fancyLog('SUCCESS', `[${cleanNumber}] Welcome message sent.`);
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

    // ===============================================
    //  ☎️ ANTI-CALL
    // ===============================================
    if (config.ANTI_CALL) {
        sock.ev.on('CB:call', async (json) => {
            try {
                const callId   = json.content[0].attrs['call-id'];
                const callerId = json.content[0].attrs['from'];

                await sock.rejectCall(callId, callerId);
                fancyLog('ANTICALL', `[${cleanNumber}] Rejected call from ${callerId}`);

                await sock.sendMessage(callerId, {
                    text: `📵 *${global.BOT_NAME}*\n\nSorry, calls are disabled.\nPlease send a message instead. 💚`
                });

                if (config.AUTO_BLOCK_CALL) {
                    await sock.updateBlockStatus(callerId, 'block');
                    fancyLog('BLOCK', `[${cleanNumber}] Blocked caller ${callerId}`);
                }
            } catch (err) {
                fancyLog('ERROR', `[${cleanNumber}] Anti-call: ${err.message}`);
            }
        });
    }

    return sessionData;
}

// ===============================================
//  🔑 CREATE PAIRING CODE (for specific user)
// ===============================================
async function createPairingCode(number) {
    const cleanNumber = sessionManager.cleanNumber(number);

    if (!sessionManager.isValidNumber(cleanNumber)) {
        throw new Error('Invalid phone number');
    }

    // ─── Check if already connected ───
    const existing = activeSessions.get(cleanNumber);
    if (existing && existing.state === 'connected') {
        throw new Error('This number is already connected');
    }

    // ─── Start bot for user (if not active) ───
    let sessionData = existing;
    if (!sessionData) {
        sessionData = await startBotForUser(cleanNumber);
    }

    // ─── Check pairing cache ───
    const now = Date.now();
    if (sessionData.pairingCode && now - sessionData.pairingRequestedAt < 45000) {
        return sessionData.pairingCode;
    }

    // ─── In-flight request? ───
    if (sessionData.pairingRequestPromise) {
        return sessionData.pairingRequestPromise;
    }

    // ─── Request new code ───
    sessionData.pairingRequestedAt = now;
    sessionData.pairingRequestPromise = (async () => {
        const code = await requestPairingCode(sessionData.sock, cleanNumber);
        if (!code) throw new Error('WhatsApp did not return a pairing code.');

        sessionData.pairingCode = code;

        setTimeout(() => {
            if (Date.now() - sessionData.pairingRequestedAt >= 45000) {
                sessionData.pairingCode = null;
            }
        }, 45000);

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
            uptime: Math.floor((Date.now() - data.startedAt) / 1000),
        });
    }

    return {
        name: global.BOT_NAME,
        version: global.VERSION,
        totalSessions: activeSessions.size,
        maxSessions: sessionManager.MAX_USERS,
        availableSlots: sessionManager.MAX_USERS - activeSessions.size,
        sessions,
        uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
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
//  ▶️ BOOT — Server + Auto-Restore Sessions
// ===============================================
if (require.main === module) {
    // 1. Start web server
    if (!serverStarted) {
        startServer();
        serverStarted = true;
    }

    // 2. Auto-restore existing sessions
    const existingUsers = sessionManager.listUsers();
    if (existingUsers.length > 0) {
        fancyLog('INFO', `Restoring ${existingUsers.length} session(s)...`);
        existingUsers.forEach((num, i) => {
            setTimeout(() => {
                startBotForUser(num).catch(err => {
                    fancyLog('ERROR', `[${num}] Restore failed: ${err.message}`);
                });
            }, i * 2000);  // 2 second delay between each
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