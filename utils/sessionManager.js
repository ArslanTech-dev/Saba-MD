// ===============================================
//  💚 SABA MD — SESSION MANAGER
//  👨‍💻 Made by Arslan Tech's for Saba
// ===============================================

const fs   = require('fs-extra');
const path = require('path');
const { fancyLog } = require('./logger');

// ═══════════════════════════════════════════════
//  📁 CLOUD COMPATIBLE DIRECTORY (Uses /tmp)
// ═══════════════════════════════════════════════
const DATA_ROOT = process.env.DATA_DIR || '/tmp';
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

function deleteAllSessions() {
    try {
        const users = listUsers();
        users.forEach(user => deleteSession(user));
        fancyLog('SUCCESS', `All sessions deleted (${users.length})`);
        return users.length;
    } catch (err) {
        fancyLog('ERROR', `Delete all sessions failed: ${err.message}`);
        return 0;
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

function getFormattedStats() {
    const stats = getStats();
    return {
        ...stats,
        usage: `${stats.totalUsers}/${stats.maxUsers}`,
        usagePercent: Math.round((stats.totalUsers / stats.maxUsers) * 100),
    };
}

function isValidNumber(number) {
    const clean = cleanNumber(number);
    return clean.length >= 10 && clean.length <= 15;
}

function getNextSlot() {
    return userCount() + 1;
}

function isWritable() {
    try {
        const testFile = path.join(SESSIONS_DIR, '.test');
        fs.writeFileSync(testFile, 'test');
        fs.removeSync(testFile);
        return true;
    } catch {
        return false;
    }
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
    deleteAllSessions,
    getUserInfo,
    getStats,
    getFormattedStats,
    cleanNumber,
    isValidNumber,
    getNextSlot,
    isWritable,
};