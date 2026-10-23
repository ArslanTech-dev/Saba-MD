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
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.post('/api/pair', async (req, res) => {
    const { number } = req.body || {};
    if (!number) return res.status(400).json({ success: false, error: 'Phone number required.' });
    const cleanNumber = String(number).replace(/\D/g, '');

    try {
        const { createPairingCode, activeSessions } = require('./index');
        const isNewUser = !sessionManager.userExists(cleanNumber);
        if (isNewUser && !sessionManager.canAddUser()) {
            return res.status(429).json({ success: false, error: `Server full (max ${sessionManager.MAX_USERS} users).` });
        }
        const existing = activeSessions.get(cleanNumber);
        if (existing && existing.state === 'connected') {
            return res.status(400).json({ success: false, error: 'Number already connected.' });
        }

        fancyLog('PAIRING', `Code requested for ${cleanNumber}`);
        const code = await createPairingCode(cleanNumber);
        return res.json({ success: true, code, number: cleanNumber, expiresIn: 45 });
    } catch (err) {
        fancyLog('ERROR', `Pair API: ${err.message}`);
        return res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/api/status', (req, res) => {
    try {
        const { getBotStatus } = require('./index');
        res.json({ success: true, ...getBotStatus() });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

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
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ success: false, error: err.message });
    }
});

app.get('/health', (req, res) => res.json({ status: 'ok', bot: config.BOT_NAME }));

app.use((req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

function startServer() {
    const port = process.env.PORT || 3000;
    app.listen(port, '0.0.0.0', () => {
        fancyLog('SUCCESS', `🌐 Website & API running on port ${port}`);
    });
}

module.exports = { app, startServer };