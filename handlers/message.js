// ===============================================
//  💚 SABA MD — MESSAGE HANDLER + PLUGIN LOADER
//  👨‍💻 Made by Arslan Tech's
// ===============================================

const fs   = require('fs-extra');
const path = require('path');
const config = require('../config');
const { fancyLog } = require('../utils/logger');
const helper = require('../utils/helper');
const { isOnCooldown } = require('../utils/antiSpam');

// ===============================================
//  📦 PLUGIN REGISTRY
// ===============================================
const plugins = new Map();   // name → plugin object
const aliases = new Map();   // alias → plugin name

// ===============================================
//  🔄 LOAD ALL PLUGINS
// ===============================================
function loadPlugins() {
    const pluginDir = path.join(__dirname, '..', 'plugins');

    if (!fs.existsSync(pluginDir)) {
        fancyLog('WARN', 'plugins/ folder not found — creating empty one');
        fs.ensureDirSync(pluginDir);
        return;
    }

    const files = fs.readdirSync(pluginDir).filter(f => f.endsWith('.js'));

    if (files.length === 0) {
        fancyLog('WARN', 'No plugins found in plugins/');
        return;
    }

    let loaded = 0;
    let failed = 0;

    for (const file of files) {
        try {
            const pluginPath = path.join(pluginDir, file);
            delete require.cache[require.resolve(pluginPath)];  // hot reload
            const mod = require(pluginPath);

            // Support array OR single object
            const list = Array.isArray(mod) ? mod : [mod];

            for (const p of list) {
                if (!p.name || typeof p.run !== 'function') {
                    fancyLog('WARN', `Skipping invalid plugin: ${file}`);
                    continue;
                }

                plugins.set(p.name.toLowerCase(), p);

                // Register aliases
                if (Array.isArray(p.aliases)) {
                    for (const a of p.aliases) {
                        aliases.set(a.toLowerCase(), p.name.toLowerCase());
                    }
                }

                loaded++;
            }
        } catch (err) {
            failed++;
            fancyLog('ERROR', `Failed to load ${file}: ${err.message}`);
        }
    }

    fancyLog('SUCCESS', `Loaded ${loaded} commands from ${files.length} files (${failed} failed)`);
}

// ===============================================
//  📩 MAIN MESSAGE HANDLER
// ===============================================
async function handleMessage(sock, msg) {
    try {
        // ─── Basic guards ───
        if (!msg.message) return;
        if (msg.key.fromMe) return;

        const from      = msg.key.remoteJid;
        const isGroup   = helper.isGroup(from);
        const sender    = helper.getSender(msg);
        const text      = helper.getText(msg);

        if (!text) return;

        // ─── Ignore status broadcast ───
        if (from === 'status@broadcast') return;

        // ─── Prefix check ───
        const prefix = config.PREFIX;
        if (!text.startsWith(prefix)) return;

        // ─── Extract command + args ───
        const trimmed = text.slice(prefix.length).trim();
        if (!trimmed) return;

        const parts = trimmed.split(/\s+/);
        const cmdRaw = parts[0].toLowerCase();
        const args = parts.slice(1);

        // ─── Find plugin ───
        let plugin = plugins.get(cmdRaw);
        if (!plugin && aliases.has(cmdRaw)) {
            plugin = plugins.get(aliases.get(cmdRaw));
        }

        if (!plugin) return;   // unknown command → silent ignore

        // ─── Owner check ───
        const isOwner = helper.isOwner(sender);

        if (plugin.ownerOnly && !isOwner) {
            return sock.sendMessage(from, {
                text: helper.sabaText('Access Denied', '👑 This command is for *owner* only.')
            }, { quoted: msg });
        }

        // ─── Group-only check ───
        if (plugin.groupOnly && !isGroup) {
            return sock.sendMessage(from, {
                text: helper.sabaText('Group Only', '👥 This command works only in *groups*.')
            }, { quoted: msg });
        }

        // ─── Private-only check ───
        if (plugin.privateOnly && isGroup) {
            return sock.sendMessage(from, {
                text: helper.sabaText('Private Only', '💬 This command works only in *DM*.')
            }, { quoted: msg });
        }

        // ─── Admin check (for group commands) ───
        if (plugin.adminOnly && isGroup) {
            const groupMeta = await sock.groupMetadata(from);
            const isAdmin = groupMeta.participants.some(p =>
                p.id.includes(sender) && (p.admin === 'admin' || p.admin === 'superadmin')
            );
            if (!isAdmin && !isOwner) {
                return sock.sendMessage(from, {
                    text: helper.sabaText('Admin Only', '🛡️ This command is for *group admins*.')
                }, { quoted: msg });
            }
        }

        // ─── Cooldown check ───
        const cooldownMs = plugin.cooldown ?? config.cmdCooldown ?? 3000;
        if (cooldownMs > 0 && !isOwner) {
            const wait = isOnCooldown(sender, plugin.name, cooldownMs);
            if (wait > 0) {
                return sock.sendMessage(from, {
                    text: helper.sabaText('Slow Down', `⏳ Please wait *${wait}s* before using .${plugin.name} again.`)
                }, { quoted: msg });
            }
        }

        // ─── Log command ───
        fancyLog('COMMAND', `.${plugin.name} ${args.join(' ')} — from ${sender}`);

        // ─── Auto read (blue tick) ───
        if (config.autoRead) {
            try { await sock.readMessages([msg.key]); } catch {}
        }

        // ─── Auto typing ───
        if (config.autoTyping && !isGroup) {
            try { await sock.sendPresenceUpdate('composing', from); } catch {}
        }

        // ─── Run plugin ───
        const ctx = {
            sock,
            msg,
            from,
            sender,
            isGroup,
            isOwner,
            args,
            text,
            command: plugin.name,
            prefix,
            config,
            helper,
            plugins,
            // shortcuts
            reply: (t, opts = {}) => sock.sendMessage(from, { text: t, ...opts }, { quoted: msg }),
            react: (emoji) => sock.sendMessage(from, { react: { text: emoji, key: msg.key } }),
        };

        try {
            await plugin.run(ctx);
        } catch (err) {
            fancyLog('ERROR', `[${plugin.name}] ${err.message}`);
            await sock.sendMessage(from, {
                text: helper.sabaText('Error', `❌ Something went wrong.\n\n_${err.message.slice(0, 200)}_`)
            }, { quoted: msg });
        }

    } catch (err) {
        fancyLog('ERROR', `handleMessage: ${err.message}`);
    }
}

// ===============================================
//  📤 EXPORTS
// ===============================================
module.exports = {
    handleMessage,
    loadPlugins,
    plugins,
    aliases,
};