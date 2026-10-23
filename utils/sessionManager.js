// ===============================================
//  💚 SABA MD — SESSION MANAGER
//  👨‍💻 Made by Arslan Tech's for Saba
// ===============================================

const fs   = require('fs-extra');
const path = require('path');
const os   = require('os');
const { fancyLog } = require('./logger');

// ═══════════════════════════════════════════════
//  📁 UNIVERSAL PATH (Termux + Cloud Compatible)
// ═══════════════════════════════════════════════
// os.tmpdir() Termux pe /data/data/.../tmp deta hai
// aur Pxxl/Render pe /tmp deta hai. Dono writable hain.
const DATA_ROOT = process.env.DATA_DIR || path.join(os.tmpdir(), 'saba-md');
const SESSIONS_DIR = path.join(DATA_ROOT, 'sessions');
const MAX_USERS = 10;

// Ensure sessions directory exists
if (!fs.existsSync(SESSIONS_DIR)) {
    fs.mkdirSync(SESSIONS_DIR, { recursive: true });
}

// ═══════════════════════════════════════════════
//  🔧 HELPER FUNCTIONS
// ═══════════════════════════════════════════════

function cleanNumber(number) {
    return String(number || '').replace(/\D/g, '');
}

function getSessionPath(number) {
    const clean = cleanNumber(number);
    if (!clean) throw new Error('Invalid number');
    return path.join(SESSIONS_DIR, clean);
}

function userExists(number) {
    try {
        const sessionPath = getSessionPath(number);
        return fs.existsSync(sessionPath);
    } catch {
        return false;
    }
}

function listUsers() {
    if (!fs.existsSync(SESSIONS_DIR)) return [];
    return fs.readdirSync(SESSIONS_DIR).filter(name => {
        const fullPath = path.join(SESSIONS_DIR, name);
        if (!fs.statSync(fullPath).isDirectory()) return false;
        return /^\d{10,15}$/.test(name);
    }).sort();
}

function userCount() {
    return listUsers().length;
}

function canAddUser() {
    return userCount() < MAX_USERS;
}

function isFull() {
    return userCount() >= MAX_USERS;
}

function createSession(number) {
    const sessionPath = getSessionPath(number);
    if (fs.existsSync(sessionPath)) {
        fs.emptyDirSync(sessionPath);
        fancyLog('PAIRING', `Session cleared for ${cleanNumber(number)}`);
    } else {
        fs.ensureDirSync(sessionPath);
        fancyLog('PAIRING', `New session created for ${cleanNumber(number)}`);
    }
    return sessionPath;
}

function deleteSession(number) {
    try {
        const sessionPath = getSessionPath(number);
        if (fs.existsSync(sessionPath)) {
            fs.removeSync(sessionPath);
            fancyLog('SUCCESS', `Session deleted for ${cleanNumber(number)}`);
            return true;
        }
        return false;
    } catch (err) {
        fancyLog('ERROR', `Delete session failed: ${err.message}`);
        return false;
    }
}

function getUserInfo(number) {
    try {
        const sessionPath = getSessionPath(number);
        if (!fs.existsSync(sessionPath)) return null;

        const files = fs.readdirSync(sessionPath);
        let totalSize = 0;
        let lastModified = 0;

        files.forEach(file => {
            const filePath = path.join(sessionPath, file);
            const stat = fs.statSync(filePath);
            totalSize += stat.size;
            if (stat.mtimeMs > lastModified) lastModified = stat.mtimeMs;
        });

        return {
            number: cleanNumber(number),
            exists: true,
            fileCount: files.length,
            sizeBytes: totalSize,
            sizeMB: (totalSize / 1024 / 1024).toFixed(2),
            lastModified: new Date(lastModified).toISOString(),
        };
    } catch {
        return null;
    }
}

function getStats() {
    const users = listUsers();
    let totalSize = 0;
    users.forEach(user => {
        const info = getUserInfo(user);
        if (info) totalSize += info.sizeBytes;
    });

    return {
        totalUsers: users.length,
        maxUsers: MAX_USERS,
        availableSlots: MAX_USERS - users.length,
        isFull: users.length >= MAX_USERS,
        users: users,
        totalSizeBytes: totalSize,
        totalSizeMB: (totalSize / 1024 / 1024).toFixed(2),
        sessionsDir: SESSIONS_DIR,
    };
}

function isValidNumber(number) {
    const clean = cleanNumber(number);
    return clean.length >= 10 && clean.length <= 15;
}

module.exports = {
    SESSIONS_DIR,
    MAX_USERS,
    getSessionPath,
    userExists,
    listUsers,
    userCount,
    canAddUser,
    isFull,
    createSession,
    deleteSession,
    getUserInfo,
    getStats,
    cleanNumber,
    isValidNumber,
};