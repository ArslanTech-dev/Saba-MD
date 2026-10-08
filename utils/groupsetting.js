// ===============================================
//  💚 SABA MD — GROUP SETTINGS (Shared)
//  👨‍💻 Made by Arslan Tech's
// ===============================================

const settings = new Map();

// ─── Default settings per group ───
const DEFAULTS = {
    antilink:    false,   // delete links
    antilink_action: 'warn', // 'warn' | 'kick'
    welcome:     false,   // welcome new members
    goodbye:     false,   // goodbye on leave
    mute:        false,   // mute group
    antifake:    false,   // (future)
    antispam:    false,   // (future)
    antibot:     false,   // (future)
};

function getSettings(jid) {
    if (!settings.has(jid)) {
        settings.set(jid, { ...DEFAULTS });
    }
    return settings.get(jid);
}

function saveSettings() {
    // Future: Save to DB (utils/database.js)
    // For now, in-memory only
}

function resetSettings(jid) {
    settings.set(jid, { ...DEFAULTS });
}

function getAllSettings() {
    return settings;
}

module.exports = {
    getSettings,
    saveSettings,
    resetSettings,
    getAllSettings,
    DEFAULTS,
};