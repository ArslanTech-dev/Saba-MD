// ===============================================
//  💚 SABA MD — ANIME REACTIONS
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Premium Reaction Design · React Enabled
//  🌍 Works in Groups & DMs
//  📦 Self-contained — no API keys needed
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');
const axios = require('axios');

// ═══════════════════════════════════════════════
//  🌐 API ENDPOINT (nekos.best — free, no key)
// ═══════════════════════════════════════════════
const API = 'https://nekos.best/api/v2';

// ═══════════════════════════════════════════════
//  🎨 DESIGN — Reaction Style
// ═══════════════════════════════════════════════
const R_TOP    = '╭━━━━━━❰ 💚 SABA MD ❱━━━━━━╮';
const R_TITLE  = '╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯';
const R_FLOUR  = '🌸 ─── ⊱ ♡ ⊰ ─── 🌸';
const R_BOT    = '╰❰ 💖 Saba MD — Arslan Tech\'s ❱╯';

// ─── Title decorator ───
function decorTitle(text) {
    const spaced = text.toUpperCase().split('').join(' ');
    return `┃   💕  ${spaced}  💕   ┃`;
}

// ═══════════════════════════════════════════════
//  🛠️ INTERNAL HELPERS
// ═══════════════════════════════════════════════

// ─── Extract target from msg ───
function getTarget(msg, args, sender) {
    const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentions.length > 0) return mentions[0];

    const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (quoted) return quoted;

    if (args && args[0]) {
        const num = String(args[0]).replace(/\D/g, '');
        if (num.length >= 10) return `${num}@s.whatsapp.net`;
    }

    return null;
}

// ─── Fetch reaction GIF ───
async function fetchReaction(type) {
    try {
        const res = await axios.get(`${API}/${type}`, { timeout: 15000 });
        const result = res.data?.results?.[0];

        if (!result?.url) throw new Error('No GIF found');

        return {
            url: result.url,
            anime: result.anime_name || 'Unknown',
        };
    } catch (err) {
        throw new Error(`Failed to fetch ${type}: ${err.message}`);
    }
}

// ─── Build caption ───
function buildCaption(action, sender, target, anime) {
    const sNum = helper.cleanJid(sender);
    const tNum = helper.cleanJid(target);

    const lines = [
        R_TOP,
        decorTitle(action.verb),
        R_TITLE,
        '',
        R_FLOUR,
        '',
        `      @${sNum} ${action.prep} @${tNum}`,
        '',
        `      💌 *From*  : @${sNum}`,
        `      🎯 *To*    : @${tNum}`,
        `      🎬 *Anime* : ${anime}`,
        `      🕒 *Time*  : ${new Date().toLocaleTimeString(config.TIMEZONE)}`,
        '',
        `      ${action.emoji} ${action.message}`,
        '',
        R_FLOUR,
        '',
        R_BOT,
    ];

    return lines.join('\n');
}

// ─── Universal reaction handler ───
function makeReaction(name, aliases, apiType, verb, prep, emoji, message, emojiReact) {
    return {
        name,
        aliases,
        cooldown: 4000,
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react(emojiReact);

            const target = getTarget(msg, args, sender);

            if (!target) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${R_TOP}
┃                            ┃
┃   ⚠️  N O   T A R G E T    ┃
┃                            ┃
${R_TITLE}

      📌 *How to use:*
      ├ *.${name} @user*
      ├ Reply + *.${name}*
      └ *.${name} 923001234567*
${R_BOT}`, msg);
            }

            const targetNum = h.cleanJid(target);

            if (targetNum === h.cleanJid(sender)) {
                await react('😅');
                return h.sendWithLogo(sock, from,
`${R_TOP}
┃                            ┃
┃   😅  S E L F   ?           ┃
┃                            ┃
${R_TITLE}

      Khud se ${verb.toLowerCase()}? 😅
      Kisi aur ko try karo 💚
${R_BOT}`, msg);
            }

            await react('⏳');

            try {
                const { url, anime } = await fetchReaction(apiType);

                const caption = buildCaption(
                    { verb, prep, emoji, message },
                    sender,
                    target,
                    anime
                );

                await sock.sendMessage(from, {
                    video: { url },
                    gifPlayback: true,
                    caption,
                    mentions: [sender, target],
                }, { quoted: msg });

                await react(emojiReact);

            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${R_TOP}
┃                            ┃
┃   ❌  F A I L E D           ┃
┃                            ┃
${R_TITLE}

      ${err.message.slice(0, 150)}

      💡 Try again in a moment
${R_BOT}`, msg);
            }
        }
    };
}

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    // ═══════════════════════════════════════════
    //  💕 LOVE & AFFECTION
    // ═══════════════════════════════════════════

    makeReaction(
        'hug', ['cuddle', 'jhappi'],
        'hug', 'Hug', 'hugged',
        '🤗', 'Warm hug coming your way!', '🤗'
    ),

    makeReaction(
        'kiss', ['smooch', 'pyar'],
        'kiss', 'Kiss', 'kissed',
        '💋', 'Sending you a sweet kiss!', '💋'
    ),

    makeReaction(
        'pat', ['headpat', 'pappi'],
        'pat', 'Pat', 'patted',
        '🤚', 'Head pat for you!', '🫶'
    ),

    makeReaction(
        'cuddle', ['snuggle'],
        'cuddle', 'Cuddle', 'cuddled',
        '🥰', 'Cuddling time!', '🥰'
    ),

    makeReaction(
        'handhold', ['holdhands', 'haath'],
        'handhold', 'Hand Hold', 'is holding hands with',
        '🤝', 'Holding your hand!', '💚'
    ),

    // ═══════════════════════════════════════════
    //  ⚔️ ACTION & FIGHT
    // ═══════════════════════════════════════════

    makeReaction(
        'slap', ['thappad', 'hit'],
        'slap', 'Slap', 'slapped',
        '🖐️', 'Take that! Ouch!', '👋'
    ),

    makeReaction(
        'punch', ['punch', 'ghusa'],
        'punch', 'Punch', 'punched',
        '👊', 'Boom! Direct hit!', '👊'
    ),

    makeReaction(
        'kick', ['laat', 'boot'],
        'kick', 'Kick', 'kicked',
        '🦵', 'Flying kick delivered!', '🦵'
    ),

    makeReaction(
        'bite', ['chunk', 'kataar'],
        'bite', 'Bite', 'bit',
        '🦷', 'Chomp! Got you!', '😈'
    ),

    makeReaction(
        'poke', ['touch', 'chhoo'],
        'poke', 'Poke', 'poked',
        '👉', 'Poke poke! Pay attention!', '👆'
    ),

    makeReaction(
        'bonk', ['thonk', 'headbonk'],
        'bonk', 'Bonk', 'bonked',
        '🔨', 'BONK! Straight to horny jail!', '🔨'
    ),

    // ═══════════════════════════════════════════
    //  🎉 FUN & FRIENDLY
    // ═══════════════════════════════════════════

    makeReaction(
        'highfive', ['hf', 'tali'],
        'highfive', 'High Five', 'high-fived',
        '🙌', 'Virtual high five! ✋', '🙌'
    ),

    makeReaction(
        'wave', ['hello', 'hii'],
        'wave', 'Wave', 'waved at',
        '👋', 'Waving hello!', '👋'
    ),

    makeReaction(
        'wink', ['winks'],
        'wink', 'Wink', 'winked at',
        '😉', 'Wink wink! 😉', '😉'
    ),

    makeReaction(
        'smile', ['smileat'],
        'smile', 'Smile', 'smiled at',
        '😊', 'A warm smile for you!', '😊'
    ),

    makeReaction(
        'happy', ['joy', 'khush'],
        'happy', 'Happy', 'is happy with',
        '😄', 'So happy!', '😄'
    ),

    makeReaction(
        'thumbsup', ['like', 'thumbs'],
        'thumbsup', 'Thumbs Up', 'gave thumbs up to',
        '👍', 'Thumbs up!', '👍'
    ),

    // ═══════════════════════════════════════════
    //  😜 FUNNY & PLAYFUL
    // ═══════════════════════════════════════════

    makeReaction(
        'blush', ['shy', 'sharmana'],
        'blush', 'Blush', 'is blushing at',
        '😊', 'You made them blush!', '😳'
    ),

    makeReaction(
        'baka', ['idiot', 'fool'],
        'baka', 'Baka', 'called baka to',
        '😤', 'Baka! Baka! Baka!', '💢'
    ),

    makeReaction(
        'feed', ['khilao', 'food'],
        'feed', 'Feed', 'fed',
        '🍜', 'Yummy food incoming!', '🍱'
    ),

    makeReaction(
        'nom', ['eat', 'chomp'],
        'nom', 'Nom', 'is nomming with',
        '🍪', 'Nom nom nom!', '🍪'
    ),

    makeReaction(
        'yeet', ['throw'],
        'yeet', 'Yeet', 'yeeted',
        '🚀', 'YEET! Into the void!', '🚀'
    ),

    makeReaction(
        'tableflip', ['flip', 'rage'],
        'tableflip', 'Table Flip', 'flipped table at',
        '🪑', '(╯°□°）╯︵ ┻━┻', '😤'
    ),

    // ═══════════════════════════════════════════
    //  😢 SAD & EMOTIONAL
    // ═══════════════════════════════════════════

    makeReaction(
        'cry', ['rona', 'sad'],
        'cry', 'Cry', 'is crying with',
        '😭', 'Let it all out... 😢', '😭'
    ),

    makeReaction(
        'laugh', ['haha', 'lol'],
        'laugh', 'Laugh', 'is laughing with',
        '😂', 'Hahaha! 😂', '🤣'
    ),

    makeReaction(
        'dance', ['dance', 'naach'],
        'dance', 'Dance', 'is dancing with',
        '💃', 'Let\'s dance! 💃🕺', '🕺'
    ),

    // ═══════════════════════════════════════════
    //  📊 REACTIONS LIST
    // ═══════════════════════════════════════════
    {
        name: 'reactions',
        aliases: ['reactionlist', 'react-list', 'rlist'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('📊');

            const caption =
`${R_TOP}
┃                            ┃
┃   📊  R E A C T I O N S    ┃
┃                            ┃
${R_TITLE}

      💕 *LOVE*
      ├ .hug      ├ .kiss
      ├ .pat      ├ .cuddle
      └ .handhold

      ⚔️ *ACTION*
      ├ .slap     ├ .punch
      ├ .kick     ├ .bite
      ├ .poke     └ .bonk

      🎉 *FRIENDLY*
      ├ .highfive ├ .wave
      ├ .wink     ├ .smile
      ├ .happy    └ .thumbsup

      😜 *FUNNY*
      ├ .blush    ├ .baka
      ├ .feed     ├ .nom
      ├ .yeet     └ .tableflip

      😢 *EMOTIONAL*
      ├ .cry      ├ .laugh
      └ .dance

${R_FLOUR}

      💡 *Usage:*
      Reply to someone + .hug
      Or: .hug @user

${R_BOT}`;

            await h.sendWithLogo(sock, from, caption, msg);
        }
    },

];