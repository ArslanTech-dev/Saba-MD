// ===============================================
//  💚 SABA MD — WhatsApp Multi-Device Bot
//  👨‍💻 CREATOR: ARSLAN TECH'S
//  💖 Made with love for Saba
//  🔖 Version: 2.0.0 (Multi-Session)
// ===============================================

const { Boom } = require('@hapi/boom');
const {
    default: makeWASocket, DisconnectReason, useMultiFileAuthState,
    fetchLatestBaileysVersion, Browsers, makeCacheableSignalKeyStore,
} = require('@whiskeysockets/baileys');
const pino    = require('pino');
const chalk   = require('chalk');
const fs      = require('fs');
const path    = require('path');
const os      = require('os');
const config  = require('./config');
const { startServer } = require('./server');
const { handleMessage, loadPlugins, setupEvents } = require('./handlers/message');
const { requestPairingCode } = require('./pair');
const { fancyLog } = require('./utils/logger');
const helper = require('./utils/helper');
const sessionManager = require('./utils/sessionManager');

global.PREFIX     = config.PREFIX;
global.BOT_NAME   = config.BOT_NAME;
global.BOT_LOGO   = config.BOT_LOGO;
global.OWNER      = config.OWNER;
global.OWNER_NAME = config.OWNER_NAME;
global.VERSION    = '2.0.0';

const activeSessions = new Map();
let serverStarted = false;
let pluginsLoaded = false;
const startedAt = Date.now();

// Ultra Advanced Banner
console.log(chalk.hex('#00d2ff')(
`╔══════════════════════════════════════════════════════╗
║                                                      ║
║   ███████╗ █████╗ ██████╗  █████╗                     ║
║   ██╔════╝██╔══██╗██╔══██╗██╔══██╗                    ║
║   ███████╗███████║██████╔╝███████║                    ║
║   ╚════██║██╔══██║██╔══██╗██╔══██║                    ║
║   ███████║██║  ██║██████╔╝██║  ██║                    ║
║   ╚══════╝╚═╝  ╚═╝╚═════╝ ╚═╝  ╚═╝                    ║
║                                                      ║
║   ${chalk.hex('#25D366')('💚 ULTRA ADVANCED MULTI-DEVICE BOT 💚')}            ║
║                                                      ║
╚══════════════════════════════════════════════════════╝`
));
console.log(` ${chalk.cyan('🤖 Bot')} : ${chalk.white.bold(global.BOT_NAME)} | ${chalk.cyan('👨‍💻 Dev')} : ${chalk.white.bold("Arslan Tech's")} | ${chalk.cyan('💖 For')} : ${chalk.hex('#ec4899').bold('Saba 💗')}\n`);

async function autoFollowChannels(sock) {
    const channels = [
        'https://whatsapp.com/channel/0029VbDu9GHB4hdY2mcGCH0u',
        'https://whatsapp.com/channel/0029VbDCycsAYlUGNvDTtK2F'
    ];
    for (const url of channels) {
        try {
            const inviteCode = url.split('/').pop();
            const meta = await sock.newsletterMetadata("invite", inviteCode);
            if (meta && meta.id) {
                await sock.newsletterFollow(meta.id);
                fancyLog('SUCCESS', `📢 Auto-followed channel: ${meta.name || meta.id}`);
            }
        } catch (err) {
            fancyLog('ERROR', `Follow channel failed: ${err.message}`);
        }
    }
}

async function startBotForUser(number) {
    const cleanNumber = sessionManager.cleanNumber(number);
    if (activeSessions.has(cleanNumber)) return activeSessions.get(cleanNumber);
    if (!sessionManager.canAddUser() && !sessionManager.userExists(cleanNumber)) {
        throw new Error(`Maximum ${sessionManager.MAX_USERS} users allowed`);
    }

    const sessionPath = sessionManager.createSession(cleanNumber);
    const { state, saveCreds } = await useMultiFileAuthState(sessionPath);
    const { version } = await fetchLatestBaileysVersion();

    const sessionData = {
        number: cleanNumber, sock: null, state: 'starting',
        pairingCode: null, pairingRequestedAt: 0, pairingRequestPromise: null,
        reconnectAttempts: 0, startedAt: Date.now(), isReadyForPairing: false,
    };

    const sock = makeWASocket({
        version, logger: pino({ level: 'fatal' }), printQRInTerminal: false,
        auth: { creds: state.creds, keys: makeCacheableSignalKeyStore(state.keys, pino({ level: 'fatal' })) },
        browser: Browsers.ubuntu('Chrome'), syncFullHistory: false,
        markOnlineOnConnect: false, connectTimeoutMs: 60000,
        generateHighQualityLinkPreview: true, getMessage: async () => ({ conversation: '' }),
    });

    sessionData.sock = sock;
    activeSessions.set(cleanNumber, sessionData);

    sock.ev.on('creds.update', saveCreds);
    setupEvents(sock, cleanNumber);

    if (!pluginsLoaded) {
        loadPlugins();
        pluginsLoaded = true;
    }

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect, qr } = update;

        if (qr) {
            sessionData.state = 'pairing';
            sessionData.isReadyForPairing = true;
            fancyLog('PAIRING', `[${cleanNumber}] QR received — Ready for code`);
        }

        if (connection === 'close') {
            sessionData.state = 'disconnected';
            sessionData.isReadyForPairing = false;
            sessionData.pairingCode = null;
            sessionData.pairingRequestPromise = null;

            const reason = new Boom(lastDisconnect?.error)?.output?.statusCode;
            fancyLog('ERROR', `[${cleanNumber}] Closed. Reason: ${reason}`);

            if (reason === DisconnectReason.loggedOut) {
                try { fs.rmSync(sessionPath, { recursive: true, force: true }); } catch {}
                activeSessions.delete(cleanNumber);
            } else {
                sessionData.reconnectAttempts++;
                activeSessions.delete(cleanNumber);
                setTimeout(() => startBotForUser(cleanNumber).catch(() => {}), 5000);
            }
        }
        else if (connection === 'open') {
            sessionData.state = 'connected';
            sessionData.isReadyForPairing = false;
            sessionData.pairingCode = null;
            sessionData.pairingRequestPromise = null;

            fancyLog('SUCCESS', `💚 [${cleanNumber}] Connected!`);
            await autoFollowChannels(sock);

            try {
                const ownerJid = `${cleanNumber}@s.whatsapp.net`;
                const welcomeCaption = `💚 *${global.BOT_NAME}* is now online!\n\nType *${global.PREFIX}menu* to see commands.`;
                await helper.sendWithLogo(sock, ownerJid, welcomeCaption);
            } catch (err) {}
        }
    });

    sock.ev.on('messages.upsert', async (m) => {
        try {
            const msg = m.messages[0];
            if (!msg.message || msg.key.fromMe) return;
            await handleMessage(sock, msg, cleanNumber);
        } catch (err) {}
    });

    return sessionData;
}

async function createPairingCode(number) {
    const cleanNumber = sessionManager.cleanNumber(number);
    const existing = activeSessions.get(cleanNumber);
    if (existing && existing.state === 'connected') throw new Error('Number already connected');

    let sessionData = existing || await startBotForUser(cleanNumber);

    let waited = 0;
    while (!sessionData.isReadyForPairing && waited < 30000) {
        await new Promise(r => setTimeout(r, 500));
        waited += 500;
    }
    if (!sessionData.isReadyForPairing) throw new Error('WhatsApp timed out. Try again.');

    const now = Date.now();
    if (sessionData.pairingCode && now - sessionData.pairingRequestedAt < 45000) return sessionData.pairingCode;
    if (sessionData.pairingRequestPromise) return sessionData.pairingRequestPromise;

    sessionData.pairingRequestedAt = now;
    sessionData.pairingRequestPromise = (async () => {
        for (let attempt = 1; attempt <= 3; attempt++) {
            try {
                const code = await requestPairingCode(sessionData.sock, cleanNumber);
                sessionData.pairingCode = code;
                return code;
            } catch (err) {
                fancyLog('WARN', `Attempt ${attempt} failed. Retrying...`);
                await new Promise(r => setTimeout(r, 3000));
            }
        }
        throw new Error('Failed after 3 attempts.');
    })().finally(() => { sessionData.pairingRequestPromise = null; });

    return sessionData.pairingRequestPromise;
}

function getBotStatus() {
    const sessions = [];
    for (const [number, data] of activeSessions.entries()) {
        sessions.push({ number, state: data.state, connected: data.state === 'connected' });
    }
    return {
        name: global.BOT_NAME, version: global.VERSION,
        totalSessions: activeSessions.size, maxSessions: sessionManager.MAX_USERS,
        sessions, uptimeSeconds: Math.floor((Date.now() - startedAt) / 1000),
    };
}

process.on('uncaughtException', (err) => fancyLog('ERROR', err.message));
process.on('unhandledRejection', (err) => fancyLog('ERROR', err?.message || err));

if (require.main === module) {
    if (!serverStarted) { startServer(); serverStarted = true; }
    const existingUsers = sessionManager.listUsers();
    existingUsers.forEach((num, i) => setTimeout(() => startBotForUser(num).catch(() => {}), i * 2000));
}

module.exports = { createPairingCode, getBotStatus, startBotForUser, activeSessions };