// ===============================================
//  💚 SABA MD — SESSION MANAGER
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎯 Multi-user session management (10 users)
//  💾 Local storage based
// ===============================================

const fs   = require('fs-extra');
const path = require('path');
const { fancyLog } = require('./logger');

// ═══════════════════════════════════════════════
//  📁 CONFIGURATION
// ═══════════════════════════════════════════════
const SESSIONS_DIR = path.join(process.cwd(), 'sessions');
const MAX_USERS = 10;

// Ensure sessions directory exists
fs.ensureDirSync(SESSIONS_DIR);

// ═══════════════════════════════════════════════
//  🔧 HELPER FUNCTIONS
// ═══════════════════════════════════════════════

// ─── Clean number (remove non-digits) ───
function cleanNumber(number) {
    return String(number || '').replace(/\D/g, '');
}

// ─── Get session path for a user ───
function getSessionPath(number) {
    const clean = cleanNumber(number);
    if (!clean) throw new Error('Invalid number');
    return path.join(SESSIONS_DIR, clean);
}

// ─── Check if user session exists ───
function userExists(number) {
    try {
        const sessionPath = getSessionPath(number);
        return fs.existsSync(sessionPath);
    } catch {
        return false;
    }
}

// ─── List all users ───
function listUsers() {
    if (!fs.existsSync(SESSIONS_DIR)) return [];

    return fs.readdirSync(SESSIONS_DIR).filter(name => {
        const fullPath = path.join(SESSIONS_DIR, name);
        // Only directories, ignore files
        if (!fs.statSync(fullPath).isDirectory()) return false;
        // Only numeric names (WhatsApp numbers)
        return /^\d{10,15}$/.test(name);
    }).sort();
}

// ─── Count total users ───
function userCount() {
    return listUsers().length;
}

// ─── Check if can add new user ───
function canAddUser() {
    return userCount() < MAX_USERS;
}

// ─── Check if slots are full ───
function isFull() {
    return userCount() >= MAX_USERS;
}

// ═══════════════════════════════════════════════
//  🎯 SESSION OPERATIONS
// ═══════════════════════════════════════════════

// ─── Create session folder for user ───
function createSession(number) {
    const sessionPath = getSessionPath(number);

    // If exists, clear it for fresh start
    if (fs.existsSync(sessionPath)) {
        fs.emptyDirSync(sessionPath);
        fancyLog('PAIRING', `Session cleared for ${cleanNumber(number)}`);
    } else {
        fs.ensureDirSync(sessionPath);
        fancyLog('PAIRING', `New session created for ${cleanNumber(number)}`);
    }

    return sessionPath;
}

// ─── Delete session for user ───
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

// ─── Delete all sessions ───
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

// ─── Get user metadata (size, files count, last modified) ───
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

// ═══════════════════════════════════════════════
//  📊 STATISTICS
// ═══════════════════════════════════════════════

// ─── Get overall storage stats ───
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

// ─── Get formatted stats for display ───
function getFormattedStats() {
    const stats = getStats();

    return {
        ...stats,
        usage: `${stats.totalUsers}/${stats.maxUsers}`,
        usagePercent: Math.round((stats.totalUsers / stats.maxUsers) * 100),
    };
}

// ═══════════════════════════════════════════════
//  🛠️ UTILITIES
// ═══════════════════════════════════════════════

// ─── Validate number format ───
function isValidNumber(number) {
    const clean = cleanNumber(number);
    return clean.length >= 10 && clean.length <= 15;
}

// ─── Get next available slot number ───
function getNextSlot() {
    return userCount() + 1;
}

// ─── Check if sessions directory is writable ───
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

// ═══════════════════════════════════════════════
//  📤 EXPORTS
// ═══════════════════════════════════════════════
module.exports = {
    // Config
    SESSIONS_DIR,
    MAX_USERS,

    // Core operations
    getSessionPath,
    userExists,
    listUsers,
    userCount,
    canAddUser,
    isFull,

    // Session management
    createSession,
    deleteSession,
    deleteAllSessions,
    getUserInfo,

    // Statistics
    getStats,
    getFormattedStats,

    // Utilities
    cleanNumber,
    isValidNumber,
    getNextSlot,
    isWritable,
};