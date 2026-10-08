// ===============================================
//  💚 SABA MD — GROUP SETTINGS (Shared)
//  👨‍💻 Made by Arslan Tech's for Saba
// ===============================================

const settings = new Map();

const DEFAULTS = {
    antilink:        false,
    antilink_action: 'warn',
    welcome:         false,
    goodbye:         false,
    mute:            false,
    antidelete:      true,       // ← default ON in groups
    antifake:        false,
    antispam:        false,
    antibot:         false,
};

function getSettings(jid) {
    if (!settings.has(jid)) {
        settings.set(jid, { ...DEFAULTS });
    }
    return settings.get(jid);
}

function saveSettings() {}

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