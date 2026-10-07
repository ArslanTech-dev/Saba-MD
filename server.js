// ===============================================
//  💚 SABA MD — EXPRESS SERVER + PAIRING API
//  👨‍💻 Made by Arslan Tech's
// ===============================================

const express = require('express');
const path    = require('path');
const cors    = require('cors');
const config  = require('./config');
const { fancyLog } = require('./utils/logger');

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

    // ─── Validation ───
    if (!number) {
        return res.status(400).json({
            success: false,
            error: 'Phone number is required.',
        });
    }

    const cleanNumber = String(number).replace(/\D/g, '');

    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
        return res.status(400).json({
            success: false,
            error: 'Invalid number. Include country code (e.g. 923001234567).',
        });
    }

    try {
        // ─── Lazy require (circular dep avoid) ───
        const { createPairingCode, getBotStatus } = require('./index');

        // ─── Check if already connected ───
        const status = getBotStatus();
        if (status.connected) {
            return res.status(400).json({
                success: false,
                error: 'Bot is already connected to WhatsApp.',
            });
        }

        if (!status.pairingAvailable) {
            return res.status(503).json({
                success: false,
                error: 'Pairing is not available yet. Try again in a few seconds.',
            });
        }

        // ─── Generate code ───
        fancyLog('PAIRING', `Code requested for ${cleanNumber}`);
        const code = await createPairingCode(cleanNumber);

        return res.json({
            success: true,
            code,
            number: cleanNumber,
            expiresIn: 45,
            message: 'Code generated. Enter it in WhatsApp → Linked Devices.',
        });

    } catch (err) {
        fancyLog('ERROR', `Pair API: ${err.message}`);

        // Busy case
        if (err.code === 'PAIRING_BUSY') {
            return res.status(429).json({
                success: false,
                error: err.message,
                retryAfter: 45,
            });
        }

        return res.status(500).json({
            success: false,
            error: err.message || 'Pairing failed. Try again.',
        });
    }
});

// ===============================================
//  📊 GET /api/status — Bot Status
// ===============================================
app.get('/api/status', (req, res) => {
    try {
        const { getBotStatus } = require('./index');
        const status = getBotStatus();

        res.json({
            success: true,
            bot: status.name,
            version: status.version,
            state: status.state,
            connected: status.connected,
            pairingAvailable: status.pairingAvailable,
            publicPairing: status.publicPairing,
            uptime: status.uptimeSeconds,
            memory: status.memory,
            node: status.nodeVersion,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ===============================================
//  ❤️ GET /health — Uptime Robot / Render
// ===============================================
app.get('/health', (req, res) => {
    try {
        const { getBotStatus } = require('./index');
        const s = getBotStatus();
        res.json({
            status: 'ok',
            bot: s.name,
            connected: s.connected,
            state: s.state,
            uptime: s.uptimeSeconds,
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
        botName:    config.BOT_NAME,
        botLogo:    config.BOT_LOGO,
        version:    config.VERSION,
        tagline:    config.WEBSITE?.tagline || 'Connect your WhatsApp in seconds.',
        github:     config.WEBSITE?.github || '',
        accent:     config.WEBSITE?.accent || '#25D366',
        publicPairing: config.PUBLIC_PAIRING,
    });
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
//  ▶️ START SERVER
// ===============================================
function startServer() {
    const port = config.PORT || 3000;

    const server = app.listen(port, () => {
        fancyLog('SUCCESS', `🌐 Pairing website: http://localhost:${port}`);
        fancyLog('INFO',    `🔗 Pair API:        http://localhost:${port}/api/pair`);
        fancyLog('INFO',    `📊 Status:          http://localhost:${port}/api/status`);
        fancyLog('INFO',    `❤️  Health:          http://localhost:${port}/health`);
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