// ===============================================
//  💚 SABA MD — TEXT LOGO MAKER
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Royal Style · React Enabled
//  🌍 Works in Groups & DMs
//  📦 Self-contained — no other file changes
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');
const axios = require('axios');

// ═══════════════════════════════════════════════
//  🌐 API ENDPOINTS (swap here if breaks)
// ═══════════════════════════════════════════════
const API = {
    textpro: 'https://api.zenkey.my.id/textpro',
    // Fallback APIs (agar pehla fail ho)
    textpro2: 'https://api.siputzx.my.id/api/tools/textpro',
};

// ═══════════════════════════════════════════════
//  🎨 STYLE
// ═══════════════════════════════════════════════
const TOP  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';
const MID  = '━━━━━━━━━━━━━━━━━━';
const THIN = '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄';
const BOT  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';

// ═══════════════════════════════════════════════
//  🛠️ INTERNAL HELPERS
// ═══════════════════════════════════════════════

// ─── Fetch textpro effect ───
async function textpro(effect, text) {
    const encoded = encodeURIComponent(text);

    // Try primary API
    try {
        const res = await axios.get(`${API.textpro}/${effect}?text=${encoded}`, {
            timeout: 30000,
        });
        const url = res.data?.result || res.data?.data || res.data?.url;
        if (url && typeof url === 'string' && url.startsWith('http')) return url;
    } catch {}

    // Try fallback API
    try {
        const res = await axios.get(`${API.textpro2}?effect=${effect}&text=${encoded}`, {
            timeout: 30000,
        });
        const url = res.data?.result || res.data?.data || res.data?.url;
        if (url && typeof url === 'string' && url.startsWith('http')) return url;
    } catch {}

    throw new Error(`Effect "${effect}" failed on all APIs`);
}

// ─── Extract text from args ───
function getText(args, msg) {
    // From args
    if (args.length > 0) return args.join(' ');

    // From quoted message
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
    if (quoted) {
        const qText = quoted.conversation
            || quoted.extendedTextMessage?.text
            || quoted.imageMessage?.caption
            || quoted.videoMessage?.caption
            || '';
        if (qText) return qText;
    }

    return null;
}

// ─── Send logo with standard caption ───
async function sendLogo(sock, from, msg, h, effectName, text, effectEmoji) {
    try {
        const url = await textpro(effectName, text);

        await sock.sendMessage(from, {
            image: { url },
            caption:
`${TOP}
   ${effectEmoji} *${effectName.toUpperCase()}*
${MID}
   📝 *Text*   : ${text}
   🎨 *Effect* : ${effectName}
   📐 *Size*   : HD
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`
        }, { quoted: msg });

        return true;
    } catch (err) {
        await h.sendWithLogo(sock, from,
`${TOP}
   ❌ *FAILED*
${MID}
   ${err.message.slice(0, 150)}
${THIN}
   💡 Try another effect or short text
${BOT}`, msg);
        return false;
    }
}

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    // ═══════════════════════════════════════════
    //  ✨ MAIN LOGO COMMAND
    // ═══════════════════════════════════════════
    {
        name: 'logo',
        aliases: ['textlogo', 'textpro'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('✨');

            if (args.length < 2) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *USAGE*
${MID}
   📝 *.logo <effect> <text>*
${THIN}
   💡 *Example:*
   .logo neon Saba MD
   .logo fire Hello
${THIN}
   📖 *All Effects:* *.logolist*
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
            }

            const effect = args[0].toLowerCase();
            const text = args.slice(1).join(' ');

            if (text.length > 30) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *TEXT TOO LONG*\n${MID}\n   Max 30 characters\n${BOT}`, msg);
            }

            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, effect, text, '✨');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  📖 LOGO LIST — Show all effects
    // ═══════════════════════════════════════════
    {
        name: 'logolist',
        aliases: ['logoeffects', 'logohelp'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('📖');

            const effects = [
                'neon', 'glow', 'fire', 'ice', 'gold',
                'silver', 'water', 'sand', 'glass', 'metallic',
                'rainbow', 'stone', 'wood', 'paper', 'chrome',
                'hologram', 'gradient', 'comic', 'cartoon', 'sketch',
                'elegant', 'royal', 'king', 'queen', 'dragon',
                'galaxy', 'smoke', 'shadow', 'pixel', '3d',
            ];

            let text = '';
            text += `${TOP}\n`;
            text += `   ✨ *LOGO EFFECTS*\n`;
            text += `${MID}\n`;
            text += `   📊 *Total* : ${effects.length}\n`;
            text += `${THIN}\n`;

            effects.forEach((e, i) => {
                text += `   ${i === effects.length - 1 ? '└' : '├'} .logo ${e}\n`;
            });

            text += `${MID}\n`;
            text += `   💡 *Usage:* .logo <effect> <text>\n`;
            text += `${THIN}\n`;
            text += `   💖 *Saba MD — Arslan Tech's*\n`;
            text += `${BOT}`;

            await h.sendWithLogo(sock, from, text, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  ✨ NEON
    // ═══════════════════════════════════════════
    {
        name: 'neon',
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('✨');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: .neon Your Text\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'neon', text, '✨');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🔥 FIRE
    // ═══════════════════════════════════════════
    {
        name: 'fire',
        aliases: ['firelogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔥');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: .fire Your Text\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'fire', text, '🔥');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  ❄️ ICE
    // ═══════════════════════════════════════════
    {
        name: 'ice',
        aliases: ['icelogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('❄️');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'ice', text, '❄️');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🏆 GOLD
    // ═══════════════════════════════════════════
    {
        name: 'gold',
        aliases: ['goldlogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🏆');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'gold', text, '🏆');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🥈 SILVER
    // ═══════════════════════════════════════════
    {
        name: 'silver',
        aliases: ['silverlogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🥈');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'silver', text, '🥈');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  💧 WATER
    // ═══════════════════════════════════════════
    {
        name: 'water',
        aliases: ['waterlogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('💧');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'water', text, '💧');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🏖️ SAND
    // ═══════════════════════════════════════════
    {
        name: 'sand',
        aliases: ['sandlogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🏖️');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'sand', text, '🏖️');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🪟 GLASS
    // ═══════════════════════════════════════════
    {
        name: 'glass',
        aliases: ['glasslogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🪟');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'glass', text, '🪟');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  ⚙️ METALLIC
    // ═══════════════════════════════════════════
    {
        name: 'metallic',
        aliases: ['metal'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('⚙️');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'metallic', text, '⚙️');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🌈 RAINBOW
    // ═══════════════════════════════════════════
    {
        name: 'rainbow',
        aliases: ['rainbowlogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🌈');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'rainbow', text, '🌈');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🪨 STONE
    // ═══════════════════════════════════════════
    {
        name: 'stone',
        aliases: ['stonelogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🪨');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'stone', text, '🪨');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🪵 WOOD
    // ═══════════════════════════════════════════
    {
        name: 'wood',
        aliases: ['woodlogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🪵');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'wood', text, '🪵');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  📄 PAPER
    // ═══════════════════════════════════════════
    {
        name: 'paper',
        aliases: ['paperlogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📄');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'paper', text, '📄');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🎭 CHROME
    // ═══════════════════════════════════════════
    {
        name: 'chrome',
        aliases: ['chromelogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎭');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'chrome', text, '🎭');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🌈 HOLOGRAM
    // ═══════════════════════════════════════════
    {
        name: 'hologram',
        aliases: ['holo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🌈');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'hologram', text, '🌈');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🎨 GRADIENT
    // ═══════════════════════════════════════════
    {
        name: 'gradient',
        aliases: ['gradientlogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎨');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'gradient', text, '🎨');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  💥 COMIC
    // ═══════════════════════════════════════════
    {
        name: 'comic',
        aliases: ['comiclogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('💥');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'comic', text, '💥');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🎪 CARTOON
    // ═══════════════════════════════════════════
    {
        name: 'cartoon',
        aliases: ['cartoonlogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎪');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'cartoon', text, '🎪');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  ✏️ SKETCH
    // ═══════════════════════════════════════════
    {
        name: 'sketch',
        aliases: ['sketchlogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('✏️');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'sketch', text, '✏️');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  ✨ ELEGANT
    // ═══════════════════════════════════════════
    {
        name: 'elegant',
        aliases: ['elegantlogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('✨');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'elegant', text, '✨');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  👑 ROYAL
    // ═══════════════════════════════════════════
    {
        name: 'royal',
        aliases: ['royallogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('👑');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'royal', text, '👑');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  👑 KING
    // ═══════════════════════════════════════════
    {
        name: 'king',
        aliases: ['kinglogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('👑');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'king', text, '👑');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  👸 QUEEN
    // ═══════════════════════════════════════════
    {
        name: 'queen',
        aliases: ['queenlogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('👸');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'queen', text, '👸');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🐉 DRAGON
    // ═══════════════════════════════════════════
    {
        name: 'dragon',
        aliases: ['dragonlogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🐉');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'dragon', text, '🐉');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🌌 GALAXY
    // ═══════════════════════════════════════════
    {
        name: 'galaxy',
        aliases: ['galaxylogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🌌');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'galaxy', text, '🌌');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  💨 SMOKE
    // ═══════════════════════════════════════════
    {
        name: 'smoke',
        aliases: ['smokelogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('💨');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'smoke', text, '💨');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🎭 SHADOW
    // ═══════════════════════════════════════════
    {
        name: 'shadow',
        aliases: ['shadowlogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎭');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'shadow', text, '🎭');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  👾 PIXEL
    // ═══════════════════════════════════════════
    {
        name: 'pixel',
        aliases: ['pixellogo'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('👾');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, 'pixel', text, '👾');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  🔮 3D
    // ═══════════════════════════════════════════
    {
        name: '3d',
        aliases: ['3dlogo', 'threed'],
        cooldown: 8000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔮');
            const text = getText(args, msg);
            if (!text) { await react('❌'); return h.sendWithLogo(sock, from, `${TOP}\n   ⚠️ *NO TEXT*\n${BOT}`, msg); }
            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, '3d', text, '🔮');
            await react(ok ? '✅' : '❌');
        }
    },

    // ═══════════════════════════════════════════
    //  💚 SABA — Special logo
    // ═══════════════════════════════════════════
    {
        name: 'sabogo',
        aliases: ['sabatext', 'sabastyle'],
        cooldown: 10000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('💚');

            const text = getText(args, msg) || 'SABA MD';
            const effects = ['neon', 'glow', 'elegant', 'royal', 'gradient'];
            const effect = effects[Math.floor(Math.random() * effects.length)];

            await react('⏳');
            const ok = await sendLogo(sock, from, msg, h, effect, text, '💚');
            await react(ok ? '✅' : '❌');
        }
    },

];