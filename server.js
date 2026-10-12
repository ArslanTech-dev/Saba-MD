// ===============================================
//  💚 SABA MD — Express Server + Pairing API
//  👨‍💻 Made by Arslan Tech's for Saba
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
//  🌐 HOME
// ===============================================
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===============================================
//  🔑 POST /api/pair
// ===============================================
app.post('/api/pair', async (req, res) => {
    const { number } = req.body || {};

    if (!number) {
        return res.status(400).json({ success: false, error: 'Phone number is required.' });
    }

    const cleanNumber = String(number).replace(/\D/g, '');

    if (cleanNumber.length < 10 || cleanNumber.length > 15) {
        return res.status(400).json({ success: false, error: 'Invalid number.' });
    }

    try {
        const { createPairingCode, getBotStatus } = require('./index');
        const status = getBotStatus();

        if (status.connected) {
            return res.status(400).json({ success: false, error: 'Bot already connected.' });
        }
        if (!status.pairingAvailable) {
            return res.status(503).json({ success: false, error: 'Pairing not available yet.' });
        }

        fancyLog('PAIRING', `Code requested for ${cleanNumber}`);
        const code = await createPairingCode(cleanNumber);

        return res.json({
            success: true,
            code,
            number: cleanNumber,
            expiresIn: 45,
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
//  📊 GET /api/status
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
            uptimeSeconds: status.uptimeSeconds,
            uptime: status.uptimeSeconds,
            memory: status.memory,
            nodeVersion: status.nodeVersion,
        });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

// ===============================================
//  ❤️ GET /health
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
//  🚫 404
// ===============================================
app.use((req, res) => {
    if (req.path.startsWith('/api/')) {
        return res.status(404).json({ success: false, error: 'Not found' });
    }
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ===============================================
//  🛡️ GLOBAL ERROR
// ===============================================
app.use((err, req, res, next) => {
    fancyLog('ERROR', `Server: ${err.message}`);
    res.status(500).json({ success: false, error: 'Internal server error' });
});

// ===============================================
//  ▶️ START SERVER — Bonto/Render compatible
// ===============================================
function startServer() {
    const port = process.env.PORT || 3000;

    const server = app.listen(port, '0.0.0.0', () => {
        fancyLog('SUCCESS', `🌐 Pairing website running on port ${port}`);
        fancyLog('INFO',    `🔗 Pair API:  /api/pair`);
        fancyLog('INFO',    `📊 Status:    /api/status`);
        fancyLog('INFO',    `❤️  Health:    /health`);
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

module.exports = { app, startServer };