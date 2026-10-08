// ===============================================
//  💚 SABA MD — GENERAL COMMANDS
//  👨‍💻 Made by Arslan Tech's
//  💖 For Saba — Pakiza Muhabbat
//  🎨 Royal + Slim Style · React Enabled
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');

// ═══════════════════════════════════════════════
//  🎨 STYLE CONSTANTS
// ═══════════════════════════════════════════════
const TOP   = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';
const MID   = '━━━━━━━━━━━━━━━━━━';
const THIN  = '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄';
const BOT   = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';

const timeNow = () => new Date().toLocaleTimeString(config.TIMEZONE, { hour12: true });
const dateNow = () => new Date().toLocaleDateString(config.TIMEZONE);
const dayNow  = () => new Date().toLocaleDateString('en-US', { weekday: 'long' });

// ─── Progress bar maker ───
function progressBar(percent, length = 10) {
    const filled = Math.round((percent / 100) * length);
    const empty = length - filled;
    return '█'.repeat(filled) + '░'.repeat(empty);
}

// ─── Speed quality ───
function speedQuality(ms) {
    if (ms < 100) return { label: '⚡ ULTRA FAST', bar: 100, emoji: '🚀' };
    if (ms < 300) return { label: '🚀 FAST',       bar: 85,  emoji: '⚡' };
    if (ms < 800) return { label: '✅ NORMAL',     bar: 60,  emoji: '👍' };
    return           { label: '🐢 SLOW',       bar: 30,  emoji: '⏳' };
}

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    // ═══════════════════════════════════════════
    //  1. PING — Simple speed test
    // ═══════════════════════════════════════════
    {
        name: 'ping',
        aliases: ['p'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            // ─── React: loading ───
            await react('🏓');

            const start = Date.now();
            const latency = Date.now() - start;

            // ─── React: result quality ───
            const q = speedQuality(latency);
            await react(q.emoji);

            const caption =
`${TOP}
   🏓 *P O N G*
${MID}
   ⚡ *Latency*  : *${latency}ms*
   📊 *Quality*  : ${q.label}
   ${progressBar(q.bar)}
   💚 *Status*   : Online
   🕒 *Time*     : ${timeNow()}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

            await h.sendWithLogo(sock, from, caption, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  2. PING 2 — Detailed speed test
    // ═══════════════════════════════════════════
    {
        name: 'ping2',
        aliases: ['p2', 'pingx'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('📡');

            const start = Date.now();
            const latency = Date.now() - start;
            const q = speedQuality(latency);

            // Server metrics
            const mem = Math.round(process.memoryUsage().rss / 1024 / 1024);
            const uptime = h.formatUptime(process.uptime());
            const cpu = process.cpuUsage();
            const cpuMs = Math.round((cpu.user + cpu.system) / 1000);

            await react(q.emoji);

            const caption =
`${TOP}
   📡 *P I N G   P R O*
${MID}
   ⚡ *Latency*    : *${latency}ms*
   📊 *Quality*    : ${q.label}
   ${progressBar(q.bar)}
${THIN}
   🖥️ *Server Info*
${THIN}
   💾 *Memory*     : ${mem} MB
   🕐 *Uptime*     : ${uptime}
   🎛️ *CPU*        : ${cpuMs} ms
   🟢 *Platform*   : ${process.platform}
   🔷 *Node*       : ${process.version}
${THIN}
   🕒 *Time*       : ${timeNow()}
   📅 *Date*       : ${dateNow()}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

            await h.sendWithLogo(sock, from, caption, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  3. ALIVE — Full bot status with LOGO
    // ═══════════════════════════════════════════
    {
        name: 'alive',
        aliases: ['status', 'online'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('💚');

            const uptime = process.uptime();
            const mem = Math.round(process.memoryUsage().rss / 1024 / 1024);
            const totalMem = Math.round(require('os').totalmem() / 1024 / 1024);
            const memPercent = Math.round((mem / totalMem) * 100);
            const cpus = require('os').cpus().length;
            const platform = process.platform;
            const nodeV = process.version;

            // Alive caption — premium look
            const caption =
`${TOP}
   💚 *S A B A   M D*
      ⚜ *IS ALIVE* ⚜
${MID}
   🤖 *Bot Identity*
${THIN}
   ├ 📛 *Name*      : ${config.BOT_NAME}
   ├ 🧠 *Version*   : ${config.VERSION}
   ├ 👑 *Owner*     : ${config.OWNER_NAME}
   └ 🎀 *Made for*  : Saba 💖
${THIN}
   ⚙️ *Runtime*
${THIN}
   ├ ⏱️ *Uptime*    : ${h.formatUptime(uptime)}
   ├ 💾 *Memory*    : ${mem} MB / ${totalMem} MB
   ├ 📊 *Usage*     : ${progressBar(memPercent)} ${memPercent}%
   ├ 🎛️ *CPU Cores* : ${cpus}
   ├ 🟢 *Platform*  : ${platform}
   └ 🔷 *Node.js*   : ${nodeV}
${THIN}
   🟢 *Status*      : Online & Healthy
   🕒 *Time*        : ${timeNow()}
   📅 *Date*        : ${dateNow()}
${MID}
   💖 *Made with love by Arslan Tech's*
   🎀 *For Saba — meri jaan*
${BOT}`;

            // Send with LOGO
            await h.sendWithLogo(sock, from, caption, msg);

            await react('✅');
        }
    },

    // ═══════════════════════════════════════════
    //  4. OWNER — Contact card
    // ═══════════════════════════════════════════
    {
        name: 'owner',
        aliases: ['contact'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('👑');

            const ownerNumber = config.OWNER[0].split('@')[0];

            // Contact card
            await sock.sendMessage(from, {
                contacts: {
                    displayName: config.OWNER_NAME,
                    contacts: [{
                        vcard:
`BEGIN:VCARD
VERSION:3.0
FN:${config.OWNER_NAME}
ORG:Saba MD
TEL;type=CELL;type=VOICE;waid=${ownerNumber}:+${ownerNumber}
END:VCARD`
                    }]
                }
            }, { quoted: msg });

            const caption =
`${TOP}
   👑 *O W N E R*
${MID}
   👤 *Personal Info*
${THIN}
   ├ 📛 *Name*     : ${config.OWNER_NAME}
   ├ 📱 *Number*   : +${ownerNumber}
   ├ 🌐 *WhatsApp* : wa.me/${ownerNumber}
   └ 🎭 *Role*     : Bot Owner
${THIN}
   🤖 *Bot Info*
${THIN}
   ├ 💚 *Bot*      : ${config.BOT_NAME}
   ├ 🧠 *Version*  : ${config.VERSION}
   └ 🎀 *Made for* : Saba
${THIN}
   💡 *Reach out for any queries,*
   *support, or bot-related help!*
${MID}
   💖 *Arslan Tech's — Saba MD*
${BOT}`;

            await h.sendWithLogo(sock, from, caption, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  5. SABA — Special 💚
    // ═══════════════════════════════════════════
    {
        name: 'saba',
        aliases: ['jaan', 'love', 'saba-md'],
        run: async ({ sock, from, msg, isOwner, react, helper: h }) => {
            await react('💚');
            await new Promise(r => setTimeout(r, 300));
            await react('💖');

            const caption = isOwner
                ? `${TOP}
   💚 *S A B A*
      ⚜ *Meri Jaan* ⚜
${MID}
   🌸 *Personal Info*
${THIN}
   ├ 💖 *Name*       : Saba
   ├ 👑 *Status*     : Meri Jaan
   ├ 🎀 *Meaning*    : Sukoon, Muhabbat
   ├ ⚡ *Crafted by* : Arslan Tech's
   └ ♾️ *Since*      : Forever & Always
${THIN}
   💬 *Ek baat dil se:*
   │
   │ _Tum meri zindagi ki sabse_
   │ _haseen khata ho — jise main_
   │ _kabhi theek nahi karna chahta_ 💚
   │
${THIN}
   🤲 *Dua:*
   │
   │ _Allah tumhein hamesha khush_
   │ _rakhe, aur tumhari har dua_
   │ _qubool kare_ 💫
   │
${MID}
   💖 *Tumhare liye, sirf tumhare liye*
${BOT}`
                : `${TOP}
   💚 *S A B A   M D*
      ⚜ *Special Bot* ⚜
${MID}
   🤖 *Details*
${THIN}
   ├ 👨‍💻 *Made by* : Arslan Tech's
   ├ 🎀 *Made for* : Saba
   ├ ⚡ *Type*     : Special Bot
   └ 🧠 *Version*  : ${config.VERSION}
${THIN}
   💬 _A bot crafted with pure_
   _love and devotion_ 💚
${MID}
   💖 *Saba MD — dil se bana*
${BOT}`;

            const mentions = [msg.key.participant || msg.key.remoteJid];
            await h.sendWithSaba(sock, from, caption, msg, mentions);
        }
    },

    // ═══════════════════════════════════════════
    //  6. UPTIME — Bot running time
    // ═══════════════════════════════════════════
    {
        name: 'uptime',
        aliases: ['up', 'runtime'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('⏱️');

            const uptime = process.uptime();
            const days    = Math.floor(uptime / 86400);
            const hours   = Math.floor((uptime % 86400) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);

            // Uptime health
            const uptimeHours = uptime / 3600;
            const health = uptimeHours > 24 ? '💚 Excellent' :
                          uptimeHours > 6  ? '✅ Good' :
                          uptimeHours > 1  ? '👍 Stable' : '🚀 Fresh Start';

            await react('✅');

            const caption =
`${TOP}
   ⏱️ *U P T I M E*
${MID}
   🕐 *Breakdown*
${THIN}
   ├ 📆 *Days*    : ${String(days).padStart(2, '0')}
   ├ 🕐 *Hours*   : ${String(hours).padStart(2, '0')}
   ├ 🕓 *Minutes* : ${String(minutes).padStart(2, '0')}
   └ 🕔 *Seconds* : ${String(seconds).padStart(2, '0')}
${THIN}
   ⏳ *Total*    : *${h.formatUptime(uptime)}*
   💚 *Health*   : ${health}
${THIN}
   📊 *Bot Status*
${THIN}
   ├ 🟢 *State*  : Online
   ├ 💾 *Memory* : ${Math.round(process.memoryUsage().rss / 1024 / 1024)} MB
   └ 🎀 *Made*   : for Saba 💖
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

            await h.sendWithLogo(sock, from, caption, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  7. ARSLAN — Creator info
    // ═══════════════════════════════════════════
    {
        name: 'arslan',
        aliases: ['creator', 'arslan-tech'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('👨‍💻');
            await new Promise(r => setTimeout(r, 300));
            await react('💚');

            const caption =
`${TOP}
   👨‍💻 *A R S L A N*
      ⚜ *Tech's* ⚜
${MID}
   🌟 *Profile*
${THIN}
   ├ 🎭 *Role*      : Developer
   ├ 💚 *Bot*       : ${config.BOT_NAME}
   ├ 🎀 *Made for*  : Saba 💖
   ├ ⚡ *Skills*    : WhatsApp Bots
   ├ 🔧 *Stack*     : Node.js, Baileys
   └ 📅 *Since*     : 2024
${THIN}
   💬 *Dil ki baat:*
   │
   │ _Code likhta hoon roz,_
   │ _magar yeh bot likha hai_
   │ _dil se — sirf Saba ke liye_ 💚
   │
${THIN}
   🔗 *Connect*
${THIN}
   ├ 🌐 *GitHub*    : ArslanTech-dev
   ├ 💬 *WhatsApp*  : via .owner
   └ 📧 *Contact*   : via .owner
${MID}
   💖 *Arslan Tech's — Since 2024*
${BOT}`;

            await h.sendWithLogo(sock, from, caption, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  8. HELLO — Greeting
    // ═══════════════════════════════════════════
    {
        name: 'hello',
        aliases: ['hi', 'hey', 'salam'],
        run: async ({ sock, from, msg, sender, react, helper: h }) => {
            await react('👋');
            await new Promise(r => setTimeout(r, 250));
            await react('💚');

            const greeting = h.pickRandom([
                'Salam', 'Assalam-o-Alaikum', 'Khush Aamdeed', 'Ahlan Wasahlan'
            ]);

            const timeGreet =
                new Date().getHours() < 12 ? '🌅 Good Morning' :
                new Date().getHours() < 17 ? '☀️ Good Afternoon' :
                new Date().getHours() < 21 ? '🌆 Good Evening' : '🌙 Good Night';

            const caption =
`${TOP}
   👋 *${greeting.toUpperCase()}!*
${MID}
   💚 *Hey @${sender}!*
${THIN}
   ✨ Welcome to *${config.BOT_NAME}*
   🎀 A bot crafted with love
   💖 For someone special — *Saba*
${THIN}
   🌤️ *Greeting* : ${timeGreet}
   🕒 *Time*     : ${timeNow()}
   📅 *Date*     : ${dateNow()}
${THIN}
   ⚡ *Get Started*
${THIN}
   ├ 📖 Type *${config.PREFIX}menu* for commands
   ├ 💡 Type *${config.PREFIX}help* for assistance
   └ 💚 Type *${config.PREFIX}saba* to know more
${MID}
   💖 *Arslan Tech's — for Saba*
${BOT}`;

            await h.sendWithBanner(
                sock, from, caption, msg,
                [msg.key.participant || msg.key.remoteJid]
            );
        }
    },

];