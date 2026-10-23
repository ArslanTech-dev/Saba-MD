const fs   = require('fs-extra');
const path = require('path');
const config = require('../config');
const { fancyLog } = require('../utils/logger');
const helper = require('../utils/helper');
const { isOnCooldown } = require('../utils/antiSpam');
const { getSettings, saveSettings } = require('../utils/groupSettings');

const plugins = new Map();
const aliases = new Map();

const SESSION_CACHE = new Map();
const CACHE_TTL = 60 * 60 * 1000;
const CACHE_MAX = 1000;

function getCacheForSession(sessionNumber) {
    if (!SESSION_CACHE.has(sessionNumber)) SESSION_CACHE.set(sessionNumber, new Map());
    return SESSION_CACHE.get(sessionNumber);
}

function cacheMessage(sessionNumber, msg) {
    try {
        const id = msg.key.id; if (!id) return;
        const cache = getCacheForSession(sessionNumber);
        cache.set(id, { msg, from: msg.key.remoteJid, sender: msg.key.participant || msg.key.remoteJid, timestamp: Date.now() });
        if (cache.size > CACHE_MAX) {
            const now = Date.now();
            for (const [k, v] of cache) if (now - v.timestamp > CACHE_TTL) cache.delete(k);
        }
    } catch {}
}

function getCachedMessage(sessionNumber, id) {
    const cache = SESSION_CACHE.get(sessionNumber); if (!cache) return null;
    const entry = cache.get(id); if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) { cache.delete(id); return null; }
    return entry;
}

function loadPlugins() {
    const pluginDir = path.join(__dirname, '..', 'plugins');
    if (!fs.existsSync(pluginDir)) { fs.ensureDirSync(pluginDir); return; }
    const files = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'));
    let loaded = 0;
    for (const file of files) {
        try {
            delete require.cache[require.resolve(path.join(pluginDir, file))];
            const mod = require(path.join(pluginDir, file));
            const list = Array.isArray(mod) ? mod : [mod];
            for (const p of list) {
                if (!p.name || typeof p.run !== 'function') continue;
                plugins.set(p.name.toLowerCase(), p);
                if (Array.isArray(p.aliases)) for (const a of p.aliases) aliases.set(a.toLowerCase(), p.name.toLowerCase());
                loaded++;
            }
        } catch (err) { fancyLog('ERROR', `Load ${file}: ${err.message}`); }
    }
    fancyLog('SUCCESS', `Loaded ${loaded} commands from ${files.length} files`);
}

async function handleMessage(sock, msg, sessionNumber = 'unknown') {
    try {
        if (!msg.message) return;
        const from = msg.key.remoteJid, isGroup = helper.isGroup(from);
        const sender = helper.getSender(msg), text = helper.getText(msg);
        const isOwner = helper.isOwner(sender);

        cacheMessage(sessionNumber, msg);

        if (msg.key.fromMe) {
            if (!text || !text.startsWith(config.PREFIX)) return;
        }
        if (from === 'status@broadcast') return;
        if (!text) return;

        const prefix = config.PREFIX;
        if (!text.startsWith(prefix)) return;

        const trimmed = text.slice(prefix.length).trim();
        if (!trimmed) return;

        const parts = trimmed.split(/\s+/);
        const cmdRaw = parts[0].toLowerCase();
        const args = parts.slice(1);

        let plugin = plugins.get(cmdRaw) || (aliases.has(cmdRaw) ? plugins.get(aliases.get(cmdRaw)) : null);
        if (!plugin) return;

        if (plugin.ownerOnly && !isOwner) return sock.sendMessage(from, { text: '❌ Owner only' }, { quoted: msg });
        if (plugin.groupOnly && !isGroup) return sock.sendMessage(from, { text: '❌ Group only' }, { quoted: msg });

        const cooldownMs = plugin.cooldown ?? config.cmdCooldown ?? 3000;
        if (cooldownMs > 0 && !isOwner) {
            const wait = isOnCooldown(`${sessionNumber}:${sender}`, plugin.name, cooldownMs);
            if (wait > 0) return sock.sendMessage(from, { text: `⏳ Wait ${wait}s` }, { quoted: msg });
        }

        fancyLog('COMMAND', `[${sessionNumber}] .${plugin.name} — ${sender}`);

        const ctx = {
            sock, msg, from, sender, isGroup, isOwner, args, text,
            command: plugin.name, prefix, config, helper, plugins, sessionNumber,
            reply: (t, opts = {}) => sock.sendMessage(from, { text: t, ...opts }, { quoted: msg }),
            react: (emoji) => sock.sendMessage(from, { react: { text: emoji, key: msg.key } }).catch(() => {}),
        };

        try { await plugin.run(ctx); }
        catch (err) { fancyLog('ERROR', `[${plugin.name}] ${err.message}`); }

    } catch (err) { fancyLog('ERROR', `handleMessage: ${err.message}`); }
}

function setupEvents(sock, sessionNumber) {
    sock.ev.on('group-participants.update', () => {});
    sock.ev.on('messages.reaction', () => {});
    sock.ev.on('messages.update', () => {});
    fancyLog('INFO', `[${sessionNumber}] ✅ Events registered`);
}

module.exports = { handleMessage, loadPlugins, setupEvents, plugins, aliases };