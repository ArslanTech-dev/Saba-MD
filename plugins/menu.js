// ===============================================
//  💚 SABA MD — MENU (Arslan MD Style)
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Small Caps + Royal Layout
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');

// ═══════════════════════════════════════════════
//  🔤 SMALL CAPS CONVERTER
// ═══════════════════════════════════════════════
const SMALL_CAPS = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ',
    i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ',
    q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x',
    y: 'ʏ', z: 'ᴢ',
};

function sc(text) {
    return String(text).toLowerCase().split('').map(c => SMALL_CAPS[c] || c).join('');
}

// ═══════════════════════════════════════════════
//  📚 CATEGORIES WITH COMMANDS
// ═══════════════════════════════════════════════
const CATEGORIES = [
    {
        id: 'general',
        emoji: '📖',
        title: 'ɢᴇɴᴇʀᴀʟ',
        aliases: ['general', 'gen', 'main'],
        commands: ['alive', 'arslan', 'hello', 'owner', 'ping', 'ping2', 'saba', 'uptime'],
    },
    {
        id: 'group',
        emoji: '👥',
        title: 'ɢʀᴏᴜᴘ',
        aliases: ['group', 'gc'],
        commands: ['add', 'admins', 'antilink', 'demote', 'gcid', 'goodbye', 'groupinfo',
                   'grouplink', 'hidetag', 'kick', 'leave', 'lock', 'members', 'mute',
                   'poll', 'promote', 'resetlink', 'setdesc', 'setname', 'tagall',
                   'unlock', 'unmute', 'welcome'],
    },
    {
        id: 'download',
        emoji: '📥',
        title: 'ᴅᴏᴡɴʟᴏᴀᴅ',
        aliases: ['download', 'dl'],
        commands: ['dl', 'facebook', 'instagram', 'pinterest', 'song', 'tiktok', 'twitter', 'video'],
    },
    {
        id: 'fun',
        emoji: '🎭',
        title: 'ꜰᴜɴ',
        aliases: ['fun'],
        commands: ['8ball', 'compliment', 'crush', 'dare', 'dice', 'emojify', 'flip',
                   'funfact', 'gayrate', 'hack', 'iq', 'joke', 'lazy', 'luck', 'mock',
                   'personality', 'pickup', 'quote', 'rate', 'reverse', 'roast',
                   'sabaquote', 'scramble', 'ship', 'shipname', 'simprate', 'truth', 'would'],
    },
    {
        id: 'wallpaper',
        emoji: '🖼️',
        title: 'ᴡᴀʟʟᴘᴀᴘᴇʀ',
        aliases: ['wallpaper', 'wall', 'wp'],
        commands: ['aesthetic', 'animal', 'animewp', 'art', 'background', 'car', 'city',
                   'flower', 'food', 'mountain', 'nature', 'ocean', 'pfp', 'sabawp',
                   'search', 'space', 'sunset', 'wallpaper'],
    },
    {
        id: 'logo',
        emoji: '✨',
        title: 'ʟᴏɢᴏ',
        aliases: ['logo', 'text', 'textpro'],
        commands: ['3d', 'cartoon', 'chrome', 'comic', 'dragon', 'elegant', 'fire',
                   'galaxy', 'glass', 'gold', 'gradient', 'hologram', 'ice', 'king',
                   'logo', 'logolist', 'metallic', 'neon', 'paper', 'pixel', 'queen',
                   'rainbow', 'royal', 'sabago', 'sand', 'shadow', 'silver', 'sketch',
                   'smoke', 'stone', 'water', 'wood'],
    },
    {
        id: 'sticker',
        emoji: '🎨',
        title: 'sᴛɪᴄᴋᴇʀ',
        aliases: ['sticker', 'stiker'],
        commands: ['attp', 'brat', 'emojimix', 'sabasticker', 'sticker', 'take', 'toimg', 'ttp'],
    },
    {
        id: 'ai',
        emoji: '🤖',
        title: 'ᴀɪ',
        aliases: ['ai', 'gpt'],
        commands: ['ai', 'aiinfo', 'clearchat', 'code', 'ideas', 'imagine', 'roleplay',
                   'sabaai', 'summarize', 'translate', 'write'],
    },
    {
        id: 'tools',
        emoji: '🔧',
        title: 'ᴛᴏᴏʟs',
        aliases: ['tools', 'utility'],
        commands: ['age', 'apijoke', 'apiquote', 'base64', 'calc', 'case', 'catfact',
                   'chuck', 'color', 'country', 'crypto', 'dict', 'dogfact', 'github',
                   'hash', 'ip', 'npm', 'qr', 'random', 'shorturl', 'timestamp',
                   'toolsinfo', 'translatestr', 'useless', 'weather'],
    },
    {
        id: 'reactions',
        emoji: '💕',
        title: 'ʀᴇᴀᴄᴛɪᴏɴs',
        aliases: ['reactions', 'react'],
        commands: ['baka', 'bite', 'blush', 'bonk', 'cry', 'cuddle', 'dance', 'feed',
                   'handhold', 'happy', 'highfive', 'hug', 'kiss', 'laugh', 'nom',
                   'pat', 'poke', 'punch', 'reactions', 'slap', 'smile', 'tableflip',
                   'thumbsup', 'wave', 'wink', 'yeet'],
    },
    {
        id: 'islamic',
        emoji: '🕌',
        title: 'ɪsʟᴀᴍɪᴄ',
        aliases: ['islamic', 'islam'],
        commands: ['allahname', 'ayah', 'dua', 'hadith', 'hijri', 'islamic',
                   'namaztime', 'prayer', 'quran', 'surah'],
    },
    {
        id: 'misc',
        emoji: '📦',
        title: 'ᴍɪsᴄ',
        aliases: ['misc', 'extras'],
        commands: ['advice', 'binary', 'bmi', 'choose', 'countdown', 'cowsay', 'dadjoke',
                   'factorial', 'fancy', 'fib', 'fliptext', 'hexcode', 'line', 'lorem',
                   'misc', 'morse', 'numwords', 'password', 'power', 'prime', 'pun',
                   'randname', 'randomcolor', 'roman', 'shayari', 'slang', 'sqrt',
                   'table', 'timezone', 'uuid', 'yesno', 'zodiac'],
    },
    {
        id: 'viewonce',
        emoji: '👁️',
        title: 'ᴠɪᴇᴡ ᴏɴᴄᴇ',
        aliases: ['viewonce', 'vv', 'dp'],
        commands: ['getbio', 'getbiz', 'getdp', 'getdp2', 'getdpall', 'vv', 'vv2'],
    },
    {
        id: 'owner',
        emoji: '👑',
        title: 'ᴏᴡɴᴇʀ',
        aliases: ['owner', 'admin'],
        commands: ['ban', 'banned', 'broadcast', 'clearsession', 'groups', 'leaveall',
                   'mode', 'ownerhelp', 'plugins', 'restart', 'savesession', 'self',
                   'sendmsg', 'setpp', 'setstatus', 'shutdown', 'stats', 'unban'],
    },
];

// ═══════════════════════════════════════════════
//  🎨 BUILDERS
// ═══════════════════════════════════════════════

// ─── Header ───
function buildHeader(plugins, h, config) {
    const uptime = h.formatUptime(process.uptime());
    const ownerNum = config.OWNER[0].split('@')[0];
    const mode = config.PUBLIC_PAIRING ? 'public' : 'private';
    const total = [...new Set([...plugins.values()].map(p => p.name))].length;

    let text = '';
    text += `✨ *${sc(config.BOT_NAME)} ᴍᴜʟᴛɪ-ᴅᴇᴠɪᴄᴇ* ✨\n\n`;
    text += `┌━━━〔 *${sc('INFO BOX')}* 〕━━━┈⊷\n`;
    text += `┃ 👑 *${sc('OWNER')}:* ${ownerNum}\n`;
    text += `┃ 📊 *${sc('COMMANDS')}:* ${total}\n`;
    text += `┃ ⏳ *${sc('RUNTIME')}:* ${uptime}\n`;
    text += `┃ 📡 *${sc('PREFIX')}:* [ ${config.PREFIX} ]\n`;
    text += `┃ ⚙️ *${sc('MODE')}:* ${mode}\n`;
    text += `┃ 🏷️ *${sc('VERSION')}:* ${config.VERSION}\n`;
    text += `╰━━━━━━━━━━━━━━━━━━━┈⊷`;

    return text;
}

// ─── Category block ───
function buildCategory(cat, prefix) {
    let text = '';
    text += `╭━━━〔 *${cat.title}* 〕━━━┈⊷\n`;

    cat.commands.forEach(cmd => {
        text += `┃ ⚡ \`${prefix}${cmd}\`\n`;
    });

    text += `╰━━━━━━━━━━━━━━━━━━━┈⊷`;
    return text;
}

// ─── Get commands from plugins (dynamic) ───
function getCommandsForCategory(cat, plugins) {
    const pluginNames = [...new Set([...plugins.values()].map(p => p.name))];
    return cat.commands.filter(cmd => pluginNames.includes(cmd));
}

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    {
        name: 'menu',
        aliases: ['help', 'cmd', 'commands', 'allmenu'],
        cooldown: 5000,
        run: async ({ sock, from, msg, react, helper: h, plugins, config }) => {
            await react('📖');

            let fullMenu = '';

            // Header
            fullMenu += buildHeader(plugins, h, config) + '\n\n';

            // Categories
            for (const cat of CATEGORIES) {
                const validCommands = getCommandsForCategory(cat, plugins);
                if (validCommands.length === 0) continue;

                // Update commands list with valid ones only
                const filteredCat = { ...cat, commands: validCommands };
                fullMenu += buildCategory(filteredCat, config.PREFIX) + '\n\n';
            }

            // Footer
            fullMenu += `> 💡 _*© ᴘᴏᴡᴇʀᴇᴅ ʙʏ ${sc('Arslan Tech\'s')} · ꜰᴏʀ sᴀʙᴀ 💚*_`;

            // Send with logo
            const logoBuffer = h.getLogoBuffer();

            if (logoBuffer) {
                try {
                    await sock.sendMessage(from, {
                        image: logoBuffer,
                        caption: fullMenu
                    }, { quoted: msg });
                    await react('💚');
                    return;
                } catch {}
            }

            // Fallback: split
            const MAX_CHUNK = 4000;
            if (fullMenu.length <= MAX_CHUNK) {
                await sock.sendMessage(from, { text: fullMenu }, { quoted: msg });
            } else {
                const chunks = [];
                let current = '';
                for (const line of fullMenu.split('\n')) {
                    if ((current + line + '\n').length > MAX_CHUNK) {
                        chunks.push(current);
                        current = '';
                    }
                    current += line + '\n';
                }
                if (current) chunks.push(current);

                for (let i = 0; i < chunks.length; i++) {
                    await sock.sendMessage(from, { text: chunks[i] });
                    if (i < chunks.length - 1) await new Promise(r => setTimeout(r, 500));
                }
            }

            await react('💚');
        }
    },

];