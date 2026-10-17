// ===============================================
//  💚 SABA MD — Express Server (Multi-User)
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎯 Multi-session API endpoints & Web Server
// ===============================================

const express = require('express');
const path    = require('path');
const cors    = require('cors');
const config  = require('./config');
const { fancyLog } = require('./utils/logger');
const sessionManager = require('./utils/sessionManager');

const app = express();

// ─── Middleware ───
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// ─── Request logger ───
app.use((req, res, next) => {
    if (req.path.startsWith('/api/') || req.path === '/health') {
        fancyLog('INFO', `${req.method} ${req.path}`);
    }
    next();
});

// ===============================================
//  🌐 HOME — Pairing Website
// ===============================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===============================================
//  🔑 POST /api/pair — Generate Pairing Code
// ===============================================
app.post('/api/pair', async (req, res) => {
    const { number } = req.body || {};

    if (!number) {
        return res.status(400).json({ success: false, error: 'Phone number is required.' });
    }

    const cleanNumber = String(number).replace(/\D/g, '');

    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
        return res.status(400).json({ success: false, error: 'Invalid number. Include country code (e.g. 923001234567).' });
    }

    try {
        const { createPairingCode, activeSessions } = require('./index');

        const isNewUser = !sessionManager.userExists(cleanNumber);
        if (isNewUser && !sessionManager.canAddUser()) {
            return res.status(429).json({ success: false, error: `Server is full (max ${sessionManager.MAX_USERS} users).` });
        }

        const existing = activeSessions.get(cleanNumber);
        if (existing && existing.state === 'connected') {
            return res.status(400).json({ success: false, error: 'This number is already connected.' });
        }

        fancyLog('PAIRING', `Code requested for ${cleanNumber}`);
        const code = await createPairingCode(cleanNumber);

        return res.json({
            success: true,
            code,
            number: cleanNumber,
            expiresIn: 45,
            message: 'Enter this code in WhatsApp → Linked Devices.'
        });

    } catch (err) {
        fancyLog('ERROR', `Pair API: ${err.message}`);
        if (err.code === 'PAIRING_BUSY') {
            return res.status(429).json({ success: false, error: err.message, retryAfter: 45 });
        }
        return res.status(500).json({ success: false, error: err.message || 'Pairing failed.' });
    }
});

// ===============================================
//  📊 GET /api/status — Overall Bot Status
// ===============================================
app.get('/api/status', (req, res) => {
    try {
        const { getBotStatus } = require('./index');
        const status = getBotStatus();

        res.json({
            success: true,
            bot: status.name,
            version: status.version,
            totalSessions: status.totalSessions,
            maxSessions: status.maxSessions,
            availableSlots: status.availableSlots,
            sessions: status.sessions,
            uptimeSeconds: status.uptimeSeconds,
            uptime: status.uptimeSeconds,
            memory: status.memory,
            nodeVersion: status.nodeVersion,
            publicPairing: config.PUBLIC_PAIRING,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ===============================================
//  📋 GET /api/sessions — List All Sessions
// ===============================================
app.get('/api/sessions', (req, res) => {
    try {
        const { activeSessions } = require('./index');
        const sessions = [];
        for (const [number, data] of activeSessions.entries()) {
            sessions.push({
                number,
                state: data.state,
                connected: data.state === 'connected',
                uptime: Math.floor((Date.now() - data.startedAt) / 1000),
            });
        }

        res.json({
            success: true,
            total: sessions.length,
            max: sessionManager.MAX_USERS,
            available: sessionManager.MAX_USERS - sessions.length,
            sessions,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ===============================================
//  🗑️ POST /api/unpair — Disconnect a Session
// ===============================================
app.post('/api/unpair', async (req, res) => {
    const { number } = req.body || {};
    if (!number) return res.status(400).json({ success: false, error: 'Number required' });

    const cleanNumber = String(number).replace(/\D/g, '');

    try {
        const { activeSessions } = require('./index');
        const session = activeSessions.get(cleanNumber);
        if (session && session.sock) {
            try { await session.sock.logout(); } catch {}
            try { await session.sock.end(); } catch {}
        }

        activeSessions.delete(cleanNumber);
        sessionManager.deleteSession(cleanNumber);

        const { clearSessionCache } = require('./handlers/message');
        if (clearSessionCache) clearSessionCache(cleanNumber);

        fancyLog('SUCCESS', `Unpaired ${cleanNumber}`);
        res.json({ success: true, message: `Session ${cleanNumber} removed.` });
    } catch (err) {
        fancyLog('ERROR', `Unpair: ${err.message}`);
        res.status(500).json({ success: false, error: err.message });
    }
});

// ===============================================
//  ❤️ GET /health — Uptime Monitoring
// ===============================================
app.get('/health', (req, res) => {
    try {
        const { getBotStatus } = require('./index');
        const s = getBotStatus();
        res.json({
            status: 'ok',
            bot: s.name,
            version: s.version,
            totalSessions: s.totalSessions,
            maxSessions: s.maxSessions,
            uptime: s.uptimeSeconds,
            memory: s.memory,
        });
    } catch {
        res.json({ status: 'ok', bot: config.BOT_NAME });
    }
});

// ===============================================
//  🎨 GET /api/config — Frontend Config
// ===============================================
app.get('/api/config', (req, res) => {
    res.json({
        botName: config.BOT_NAME,
        botLogo: config.BOT_LOGO,
        version: config.VERSION,
        tagline: config.WEBSITE?.tagline || 'Connect your WhatsApp in seconds.',
        github: config.WEBSITE?.github || '',
        accent: config.WEBSITE?.accent || '#e8a87c',
        publicPairing: config.PUBLIC_PAIRING,
        maxUsers: sessionManager.MAX_USERS,
    });
});

// ===============================================
//  📊 GET /api/stats — Storage Stats
// ===============================================
app.get('/api/stats', (req, res) => {
    try {
        const stats = sessionManager.getFormattedStats();
        res.json({ success: true, ...stats });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ===============================================
//  🚫 404 — Unknown routes
// ===============================================
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ success: false, error: 'Not found' });
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===============================================
//  🛡️ GLOBAL ERROR HANDLER
// ===============================================
app.use((err, req, res, next) => {
    fancyLog('ERROR', `Server: ${err.message}`);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// ===============================================
//  ▶️ START SERVER — Pxxl compatible (Use process.env.PORT)
// ===============================================
function startServer() {
    // Pxxl dynamically assigns a port via process.env.PORT
    const port = process.env.PORT || 3000;

    const server = app.listen(port, '0.0.0.0', () => {
        fancyLog('SUCCESS', `🌐 Pairing website running on port ${port}`);
        fancyLog('INFO',    `🔗 Pair API:  /api/pair`);
        fancyLog('INFO',    `📊 Status:    /api/status`);
        fancyLog('INFO',    `📋 Sessions:  /api/sessions`);
        fancyLog('INFO',    `❤️  Health:    /health`);
        fancyLog('INFO',    `👥 Max Users: ${sessionManager.MAX_USERS}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            fancyLog('ERROR', `Port ${port} is already in use.`);
        } else {
            fancyLog('ERROR', `Server error: ${err.message}`);
        }
    });

    return server;
}

// ===============================================
//  📤 EXPORTS
// ===============================================
module.exports = { app, startServer };