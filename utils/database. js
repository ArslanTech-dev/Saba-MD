// ===============================================
//  💚 SABA MD — SIMPLE JSON DATABASE
// ===============================================

const fs = require('fs-extra');
const path = require('path');

const DB_DIR = path.join(process.cwd(), 'database');
fs.ensureDirSync(DB_DIR);

const CACHE = {};

function getFile(name) {
    return path.join(DB_DIR, `${name}.json`);
}

function load(name) {
    if (CACHE[name]) return CACHE[name];
    const file = getFile(name);
    if (!fs.existsSync(file)) {
        fs.writeJsonSync(file, {});
        CACHE[name] = {};
    } else {
        try { CACHE[name] = fs.readJsonSync(file); }
        catch { CACHE[name] = {}; }
    }
    return CACHE[name];
}

function save(name) {
    fs.writeJsonSync(getFile(name), CACHE[name] || {}, { spaces: 2 });
}

const db = {
    get:    (name, key, fallback = null) => load(name)[key] ?? fallback,
    set:    (name, key, value) => { load(name)[key] = value; save(name); return value; },
    delete: (name, key) => { delete load(name)[key]; save(name); },
    all:    (name) => load(name),
    clear:  (name) => { CACHE[name] = {}; save(name); },
};

module.exports = db;