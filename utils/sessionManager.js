// ===============================================
//  💚 SABA MD — SESSION MANAGER
//  👨‍💻 Made by Arslan Tech's for Saba
// ===============================================

const fs   = require('fs-extra');
const path = require('path');
const { fancyLog } = require('./logger');

const DATA_ROOT = process.env.DATA_DIR || '/tmp';
const SESSIONS_DIR = path.join(DATA_ROOT, 'sessions');
const MAX_USERS = 10;

if (!fs.existsSync(SESSIONS_DIR)) fs.mkdirSync(SESSIONS_DIR, { recursive: true });

function cleanNumber(number) { return String(number || '').replace(/\D/g, ''); }
function getSessionPath(number) { return path.join(SESSIONS_DIR, cleanNumber(number)); }
function userExists(number) { return fs.existsSync(getSessionPath(number)); }
function listUsers() {
    if (!fs.existsSync(SESSIONS_DIR)) return [];
    return fs.readdirSync(SESSIONS_DIR).filter(name => {
        const fullPath = path.join(SESSIONS_DIR, name);
        return fs.statSync(fullPath).isDirectory() && /^\d{10,15}$/.test(name);
    }).sort();
}
function userCount() { return listUsers().length; }
function canAddUser() { return userCount() < MAX_USERS; }
function isFull() { return userCount() >= MAX_USERS; }
function createSession(number) {
    const sessionPath = getSessionPath(number);
    if (fs.existsSync(sessionPath)) fs.emptyDirSync(sessionPath);
    else fs.ensureDirSync(sessionPath);
    return sessionPath;
}
function deleteSession(number) {
    try {
        const p = getSessionPath(number);
        if (fs.existsSync(p)) { fs.removeSync(p); return true; }
        return false;
    } catch { return false; }
}
function isValidNumber(number) { const clean = cleanNumber(number); return clean.length >= 10 && clean.length <= 15; }

module.exports = {
    SESSIONS_DIR, MAX_USERS, getSessionPath, userExists, listUsers, userCount,
    canAddUser, isFull, createSession, deleteSession, cleanNumber, isValidNumber,
};