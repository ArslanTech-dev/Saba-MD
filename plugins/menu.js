// ===============================================
//  💚 SABA MD — ULTRA MENU (Compact Width)
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Fit for WhatsApp Mobile
//  📦 Self-contained — no other file changes
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');

// ═══════════════════════════════════════════════
//  🎨 FANCY FONTS
// ═══════════════════════════════════════════════
function toBold(text) {
    return text.split('').map(c => {
        const code = c.charCodeAt(0);
        if (code >= 65 && code <= 90) return String.fromCodePoint(0x1D400 + (code - 65));
        if (code >= 97 && code <= 122) return String.fromCodePoint(0x1D41A + (code - 97));
        if (code >= 48 && code <= 57) return String.fromCodePoint(0x1D7CE + (code - 48));
        return c;
    }).join('');
}

const SMALLCAPS = {
    a: 'ᴀ', b: 'ʙ', c: 'ᴄ', d: 'ᴅ', e: 'ᴇ', f: 'ꜰ', g: 'ɢ', h: 'ʜ',
    i: 'ɪ', j: 'ᴊ', k: 'ᴋ', l: 'ʟ', m: 'ᴍ', n: 'ɴ', o: 'ᴏ', p: 'ᴘ',
    q: 'ǫ', r: 'ʀ', s: 's', t: 'ᴛ', u: 'ᴜ', v: 'ᴠ', w: 'ᴡ', x: 'x',
    y: 'ʏ', z: 'ᴢ',
};

function toSmallCaps(text) {
    return text.toLowerCase().split('').map(c => SMALLCAPS[c] || c).join('');
}

function boldMD(text) {
    if (!text) return '';
    return toBold(text[0]) + toSmallCaps(text.slice(1));
}

// ═══════════════════════════════════════════════
//  🎨 COMPACT DESIGN
// ═══════════════════════════════════════════════
const HL_LEFT  = '▌';
const HL_RIGHT = '▐';
const HL_PAD   = 9;   // ← chhota padding

// ─── Top bar ───
function topBar(title) {
    return `╭─❍══ ${title} ══⊷❍`;
}

const HEAD_LINE  = '┃';
const HEAD_CLOSE = '╰═══════════════⍟';

// ═══════════════════════════════════════════════
//  📚 CATEGORIES
// ═══════════════════════════════════════════════
const CATEGORIES = [
    { id: 'general',    emoji: '📖', title: 'GENERAL' },
    { id: 'group',      emoji: '👥', title: 'GROUP' },
    { id: 'download',   emoji: '📥', title: 'DOWNLOAD' },
    { id: 'fun',        emoji: '🎭', title: 'FUN' },
    { id: 'wallpaper',  emoji: '🖼️', title: 'WALLPAPER' },
    { id: 'logo',       emoji: '✨', title: 'LOGO' },
    { id: 'sticker',    emoji: '🎨', title: 'STICKER' },
    { id: 'ai',         emoji: '🤖', title: 'AI' },
    { id: 'tools',      emoji: '🔧', title: 'TOOLS' },
    { id: 'reactions',  emoji: '💕', title: 'REACTIONS' },
    { id: 'islamic',    emoji: '🕌', title: 'ISLAMIC' },
    { id: 'misc',       emoji: '📦', title: 'MISC' },
    { id: 'viewonce',   emoji: '👁️', title: 'VIEW ONCE' },
    { id: 'owner',      emoji: '👑', title: 'OWNER' },
];

// ═══════════════════════════════════════════════
//  🔗 COMMAND → CATEGORY MAP
// ═══════════════════════════════════════════════
const CATEGORY_MAP = {
    ping: 'general', ping2: 'general', alive: 'general', owner: 'general',
    saba: 'general', uptime: 'general', arslan: 'general', hello: 'general',

    kick: 'group', add: 'group', promote: 'group', demote: 'group',
    tagall: 'group', hidetag: 'group', mute: 'group', unmute: 'group',
    antilink: 'group', welcome: 'group', goodbye: 'group', groupinfo: 'group',
    grouplink: 'group', resetlink: 'group', setdesc: 'group', leave: 'group',
    admins: 'group', poll: 'group', lock: 'group', unlock: 'group',
    gcid: 'group', members: 'group', setname: 'group',

    song: 'download', video: 'download', tiktok: 'download', instagram: 'download',
    facebook: 'download', twitter: 'download', pinterest: 'download', dl: 'download',

    joke: 'fun', roast: 'fun', compliment: 'fun', truth: 'fun', dare: 'fun',
    pickup: 'fun', funfact: 'fun', quote: 'fun', would: 'fun', '8ball': 'fun',
    flip: 'fun', dice: 'fun', ship: 'fun', shipname: 'fun', gayrate: 'fun',
    simprate: 'fun', iq: 'fun', rate: 'fun', reverse: 'fun', mock: 'fun',
    scramble: 'fun', emojify: 'fun', hack: 'fun', crush: 'fun', lazy: 'fun',
    luck: 'fun', personality: 'fun', sabaquote: 'fun',

    wallpaper: 'wallpaper', nature: 'wallpaper', city: 'wallpaper', car: 'wallpaper',
    animewp: 'wallpaper', space: 'wallpaper', aesthetic: 'wallpaper', sunset: 'wallpaper',
    mountain: 'wallpaper', ocean: 'wallpaper', animal: 'wallpaper', food: 'wallpaper',
    flower: 'wallpaper', art: 'wallpaper', background: 'wallpaper', pfp: 'wallpaper',
    search: 'wallpaper', sabawp: 'wallpaper',

    logo: 'logo', logolist: 'logo', neon: 'logo', fire: 'logo', ice: 'logo',
    gold: 'logo', silver: 'logo', water: 'logo', sand: 'logo', glass: 'logo',
    metallic: 'logo', rainbow: 'logo', stone: 'logo', wood: 'logo', paper: 'logo',
    chrome: 'logo', hologram: 'logo', gradient: 'logo', comic: 'logo', cartoon: 'logo',
    sketch: 'logo', elegant: 'logo', royal: 'logo', king: 'logo', queen: 'logo',
    dragon: 'logo', galaxy: 'logo', smoke: 'logo', shadow: 'logo', pixel: 'logo',
    '3d': 'logo', sabago: 'logo',

    sticker: 'sticker', toimg: 'sticker', emojimix: 'sticker', attp: 'sticker',
    ttp: 'sticker', brat: 'sticker', take: 'sticker', sabasticker: 'sticker',

    ai: 'ai', imagine: 'ai', sabaai: 'ai', write: 'ai', code: 'ai',
    translate: 'ai', summarize: 'ai', clearchat: 'ai', roleplay: 'ai',
    ideas: 'ai', aiinfo: 'ai',

    weather: 'tools', calc: 'tools', qr: 'tools', shorturl: 'tools', ip: 'tools',
    translatestr: 'tools', dict: 'tools', country: 'tools', crypto: 'tools',
    github: 'tools', npm: 'tools', apijoke: 'tools', chuck: 'tools',
    catfact: 'tools', dogfact: 'tools', useless: 'tools', apiquote: 'tools',
    color: 'tools', timestamp: 'tools', case: 'tools', base64: 'tools',
    hash: 'tools', age: 'tools', random: 'tools', toolsinfo: 'tools',

    hug: 'reactions', kiss: 'reactions', pat: 'reactions', cuddle: 'reactions',
    handhold: 'reactions', slap: 'reactions', punch: 'reactions', kick: 'reactions',
    bite: 'reactions', poke: 'reactions', bonk: 'reactions', highfive: 'reactions',
    wave: 'reactions', wink: 'reactions', smile: 'reactions', happy: 'reactions',
    thumbsup: 'reactions', blush: 'reactions', baka: 'reactions', feed: 'reactions',
    nom: 'reactions', yeet: 'reactions', tableflip: 'reactions', cry: 'reactions',
    laugh: 'reactions', dance: 'reactions', reactions: 'reactions',

    quran: 'islamic', ayah: 'islamic', prayer: 'islamic', allahname: 'islamic',
    dua: 'islamic', hadith: 'islamic', hijri: 'islamic', surah: 'islamic',
    namaztime: 'islamic', islamic: 'islamic',

    fancy: 'misc', fliptext: 'misc', morse: 'misc', binary: 'misc',
    hexcode: 'misc', password: 'misc', uuid: 'misc', lorem: 'misc',
    roman: 'misc', prime: 'misc', fib: 'misc', factorial: 'misc',
    sqrt: 'misc', power: 'misc', table: 'misc', zodiac: 'misc',
    bmi: 'misc', countdown: 'misc', dadjoke: 'misc', pun: 'misc',
    advice: 'misc', shayari: 'misc', yesno: 'misc', choose: 'misc',
    line: 'misc', cowsay: 'misc', timezone: 'misc', slang: 'misc',
    randomcolor: 'misc', numwords: 'misc', randname: 'misc', misc: 'misc',

    vv: 'viewonce', vv2: 'viewonce', getdp: 'viewonce', getdp2: 'viewonce',
    getbio: 'viewonce', getbiz: 'viewonce', getdpall: 'viewonce',

    broadcast: 'owner', restart: 'owner', shutdown: 'owner', stats: 'owner',
    groups: 'owner', leaveall: 'owner', ban: 'owner', unban: 'owner',
    banned: 'owner', setpp: 'owner', setstatus: 'owner', savesession: 'owner',
    clearsession: 'owner', plugins: 'owner', self: 'owner', mode: 'owner',
    sendmsg: 'owner', ownerhelp: 'owner',
};

// ═══════════════════════════════════════════════
//  🛠️ BUILDERS
// ═══════════════════════════════════════════════

// ─── Header ───
function buildHeader(isOwner, plugins, h, config) {
    const uptime = h.formatUptime(process.uptime());
    const ownerNum = config.OWNER[0].split('@')[0];
    const mode = config.PUBLIC_PAIRING ? 'public' : 'private';
    const total = [...new Set([...plugins.values()].map(p => p.name))].length;

    const botName = `${config.BOT_NAME.split(' ')[0]} ${boldMD('MD')}`;

    let text = '';
    text += topBar(botName) + '\n';
    text += `${HEAD_LINE}\n`;
    text += `${HEAD_LINE} ◆ ${toBold('Owner')}   : ${ownerNum}\n`;
    text += `${HEAD_LINE} ◆ ${toBold('Mode')}    : ${mode}\n`;
    text += `${HEAD_LINE} ◆ ${toBold('Prefix')}  : ${config.PREFIX}\n`;
    text += `${HEAD_LINE} ◆ ${toBold('Version')} : ${config.VERSION}\n`;
    text += `${HEAD_LINE} ◆ ${toBold('Runtime')} : ${uptime}\n`;
    text += `${HEAD_LINE} ◆ ${toBold('Cmds')}    : ${total}\n`;
    text += `${HEAD_LINE}\n`;
    text += HEAD_CLOSE;

    return text;
}

// ─── Category block ───
function buildCategory(cat, commands, prefix) {
    const title = `${cat.emoji} ${cat.title}`;
    let text = '';
    text += topBar(title) + '\n';
    text += `${HEAD_LINE}\n`;

    commands.forEach(cmd => {
        const cmdText = `${prefix}${cmd}`;
        const padded = cmdText.padEnd(HL_PAD, ' ');
        text += `${HEAD_LINE} ⚡${HL_LEFT} ${padded}${HL_RIGHT}\n`;
    });

    text += `${HEAD_LINE}\n`;
    text += HEAD_CLOSE;

    return text;
}

// ─── Get commands ───
function getCategoryCommands(catId, plugins) {
    const result = [];
    for (const [name] of plugins) {
        if (CATEGORY_MAP[name] === catId) result.push(name);
    }
    return [...new Set(result)].sort();
}

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    {
        name: 'menu',
        aliases: ['help', 'cmd', 'commands', 'allmenu'],
        cooldown: 5000,
        run: async ({ sock, from, msg, isOwner, react, helper: h, plugins, config }) => {
            await react('📖');

            let fullMenu = '';

            // Header
            fullMenu += buildHeader(isOwner, plugins, h, config) + '\n\n';

            // Categories
            for (const cat of CATEGORIES) {
                const commands = getCategoryCommands(cat.id, plugins);
                if (commands.length === 0) continue;

                fullMenu += buildCategory(cat, commands, config.PREFIX) + '\n\n';
            }

            // Footer
            fullMenu +=
`╭─❍══ 💚 INFO ══⊷❍
┃
┃ ◆ ${toBold('Total')}  : ${[...new Set([...plugins.values()].map(p => p.name))].length} cmds
┃ ◆ ${toBold('By')}     : Arslan Tech's
┃ ◆ ${toBold('For')}    : Saba 💚
┃
╰═══════════════⍟`;

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