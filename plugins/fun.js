// ===============================================
//  💚 SABA MD — FUN & GAMES
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Royal Style · React Enabled
//  🌍 Works in Groups & DMs
//  📦 Self-contained — no other file changes
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');

// ═══════════════════════════════════════════════
//  🎨 STYLE
// ═══════════════════════════════════════════════
const TOP  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';
const MID  = '━━━━━━━━━━━━━━━━━━';
const THIN = '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄';
const BOT  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';

// ═══════════════════════════════════════════════
//  🎲 INTERNAL HELPERS
// ═══════════════════════════════════════════════
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

// ─── Extract target from mentions/reply/args ───
function getTarget(msg, args, sender) {
    const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentions.length > 0) return mentions[0];

    const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (quoted) return quoted;

    if (args[0]) {
        const num = String(args[0]).replace(/\D/g, '');
        if (num.length >= 10) return `${num}@s.whatsapp.net`;
    }

    return sender ? `${helper.cleanJid(sender)}@s.whatsapp.net` : null;
}

// ─── Progress bar ───
function bar(percent, length = 12) {
    const filled = Math.round((percent / 100) * length);
    return '█'.repeat(filled) + '░'.repeat(length - filled);
}

// ═══════════════════════════════════════════════
//  📚 CONTENT POOLS
// ═══════════════════════════════════════════════
const JOKES = [
    "Teacher: Tumhein kya banna hai?\nStudent: Doctor!\nTeacher: Kyun?\nStudent: Kyunki doctor har patient ko *'agli baar se dhyan rakhna'* bol kar chutti kar deta hai 😂",
    "Biwi: Suno ji, main tumse 20 saal choti hoon!\nShohar: Toh kya hua?\nBiwi: Tumhare pension ke paise se main shaadi karungi 😂",
    "Pappu: Mujhe WhatsApp pe 1000 messages aaye!\nFriend: Kya likha hai?\nPappu: 'Aapka data khatam ho gaya hai' 😭",
    "Naukri interview:\nHR: Aap ki strength kya hai?\nCoder: Main WhatsApp pe 5 ghante baith sakta hoon!\nHR: Aur weakness?\nCoder: WiFi chala jata hai 😂",
    "Papa: Beta, 10 rupay do.\nBeta: Kya karoge?\nPapa: Tere hath se 1 ice cream khareed ke khaunga 😋",
    "Ek banda doctor ke paas gaya:\nDoctor: Kya takleef hai?\nBanda: Jab main aankhein band karta hoon to andhera dikhta hai!\nDoctor: Bhai, sab ke saath hota hai 😑",
    "Sardar ji ne car bech di kyunki petrol mehnga tha.\nAb paidal chalta hai, kyunki chappal bhi mehngi hai 😂",
    "Mummy: Beta, padhai ki?\nBeta: Haan mummy!\nMummy: Kya padha?\nBeta: WhatsApp ke messages 😂",
];

const ROASTS = [
    "{user} ki shakal dekh ke mirror bhi plastic surgery recommend karta hai 😂",
    "{user} ki English itni weak hai ke Google Translate bhi resign kar gaya!",
    "{user} ke paas talent hai — sirf usse dhoondhne wala banda nahi mila 😂",
    "{user} aur intelligence ka rishta sirf naam ka hai — kabhi mile hi nahi!",
    "{user} ka dimagh WiFi jaisa hai — connect ho jaye to maza aa jaye, warna pagal kar de 😂",
    "{user} ko dekhe bina bhi pata chal jata hai — beta, tu Google ka top result 'kaise genius banein' hai 😂",
    "{user} ki photo dekh ke camera ne bhi khudkhushi kar li!",
    "{user} ke jokes sirf woh hasnte hain jinko humour ka pata nahi 😑",
];

const COMPLIMENTS = [
    "{user} ki smile din bana deti hai 🌸",
    "{user} bahut special hai — jaise chai mein extra chini 😋💚",
    "{user} ka dil sone ka hai — bilkul meri tarah 💛",
    "{user} se mil kar lagta hai — duniya mein accha log bhi bache hain 🌸",
    "{user} ki personality sirf 5 star nahi — poori galaxy hai 🌟",
    "{user} ka sense of humour = 🏆💚",
    "{user} — ek hi banda kaafi hai jannat banane ke liye ✨",
    "{user} se baat karke mood theek ho jata hai 🌈",
];

const TRUTHS = [
    "Tumne last time kab jhoot bola tha aur kyun? 🤔",
    "Tumhari life ka sabse embarrassing moment kya hai? 😳",
    "Tumne kisi ko secretly stalk kiya hai? 👀",
    "Tumhara crush kaun hai — naam batao! 💕",
    "Tumne kabhi kisi ko block kiya hai? Kyun? 😬",
    "Tumhari sabse badi weakness kya hai? 🎯",
    "Tumne kabhi cheating ki hai (exam ya life mein)? 😅",
    "Tumhare phone mein kitni photos hain? 😂",
];

const DARES = [
    "Apni crush ko 'I love you' message bhejo aur screenshot do! 💌",
    "Apni 3 saal purani photo WhatsApp status pe lagao! 📸",
    "Group ke 5 members ko gaali do (pyar se)! 😂",
    "Ek selfie lo, aankhein band karke, aur group mein bhejo! 🤳",
    "Apni mummy ko bol do 'Mujhe 500 rupe chahiye'! 💸",
    "Apne sabse bade dost ka ek secret batao! 🤫",
    "10 baar bolo 'Main pagal hoon' voice note mein! 🎤",
    "Apni WhatsApp DP 24 ghante ke liye cartoon rakho! 🎨",
];

const PICKUP = [
    "Tumhari smile dekh kar mujhe laga — WhatsApp ka dp change karna padega 💚",
    "Kya tum WiFi ho? Kyunki tumse connection ban gaya hai 📶💚",
    "Tumhari aankhon mein itna sukoon hai — jaise Saba MD ka logo dekh liya ho 😌",
    "Kya tum magician ho? Kyunki tum aake dil se gayab kar gaye 🎩",
    "Tumse mil kar laga — mere jaisa banda ho! 🤝",
    "Tumhari baaton mein woh nasha hai jo chai mein bhi nahi! ☕",
    "Kya tum time traveller ho? Kyunki tumne mera future chura liya ⏳",
    "Tum ho toh life mein WhatsApp pe 'Online' dikhne ka maza aa gaya 🟢",
];

const FACTS = [
    "Honey kabhi kharab nahi hoti — 3000 saal purani Egyptian honey bhi khayi ja sakti hai 🍯",
    "Octopus ke 3 dil hote hain ❤️❤️❤️",
    "Cheetah 3 second mein 0 se 100 km/h tak pahunch sakta hai 🐆",
    "Meri jaan Saba duniya ki sabse pyari hai — yeh science ka sabse bada fact hai 💚",
    "Butterflies apni taste buds pairon mein hoti hain 🦋",
    "Ek chammach neuron ki energy se 10,000 neurons fire ho sakte hain 🧠",
    "Antarctica mein pighla hua ice duniya ka 70% fresh water hai 🧊",
    "iPhone ka camera NASA ke supercomputer se 1000 guna zyada powerful hai (kabhi kabhi lagta hai) 📱",
];

const QUOTES = [
    "“Zindagi mein sab kuch nahi milta, aur jo milta hai usse khush rehna seekho.” 🌸",
    "“Waqt sabse bada ustad hai — sabr rakho, sab theek hoga.” ⏳",
    "“Muhabbat mein har cheez maaf ho sakti hai — sirf bewafai nahi.” 💚",
    "“Jo tumhara hai, woh tumhe kabhi chhodega nahi.” 💫",
    "“Mehnat karo, dua karo, aur samar Allah pe chhod do.” 🤲",
    "“Tumhari muskurahat kisi ki duniya ho sakti hai — muskurate raho.” 😊",
    "“Har mushkil ke baad asaani hai — yeh Allah ka wada hai.” 🌈",
];

const WOULD_YOU = [
    "🤔 Would you rather:\n\nA) Forever WiFi ho lekin slow\nB) Forever 5G ho lekin data khatam 💀",
    "🤔 Would you rather:\n\nA) 1 crore mile lekin phone na ho\nB) Phone ho lekin 1 rupaya bhi na ho 😭",
    "🤔 Would you rather:\n\nA) Saba jaisa friend mile\nB) 100 nakli friends mile 💚",
    "🤔 Would you rather:\n\nA) Har roz biryani\nB) Har roz pizza 🍕🍛",
    "🤔 Would you rather:\n\nA) Excel in life\nB) Sleep 24/7 😴",
];

const EIGHT_BALL = [
    "✅ Bilkul haan!", "❌ Bilkul nahi!", "🤔 Shayad...", "💚 Haan, magar sabr se",
    "🌟 Pakka ho jayega!", "😬 Mushkil hai", "🎯 Zaroor!", "🚫 Kabhi nahi",
    "⏳ Waqt batayega", "💫 Ho sakta hai", "😂 Bhai, yeh kya sawaal hai?",
    "🌸 Haan, agar dil se chaho",
];

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    // ─── 😂 JOKE ───
    {
        name: 'joke',
        aliases: ['jokes', 'hasao'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('😂');
            const joke = pick(JOKES);
            await h.sendWithLogo(sock, from,
`${TOP}
   😂 *JOKE TIME*
${MID}
   ${joke}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

    // ─── 🔥 ROAST ───
    {
        name: 'roast',
        aliases: ['insult', 'gaali'],
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('🔥');
            const target = getTarget(msg, args, sender);
            const num = h.cleanJid(target);
            const roast = pick(ROASTS).replace(/{user}/g, `@${num}`);

            await sock.sendMessage(from, {
                text: `${TOP}
   🔥 *ROASTED*
${MID}
   ${roast}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`,
                mentions: [target]
            }, { quoted: msg });
        }
    },

    // ─── 💛 COMPLIMENT ───
    {
        name: 'compliment',
        aliases: ['tareef', 'taarif'],
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('💛');
            const target = getTarget(msg, args, sender);
            const num = h.cleanJid(target);
            const comp = pick(COMPLIMENTS).replace(/{user}/g, `@${num}`);

            await sock.sendMessage(from, {
                text: `${TOP}
   💛 *COMPLIMENT*
${MID}
   ${comp}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`,
                mentions: [target]
            }, { quoted: msg });
        }
    },

    // ─── 🎯 TRUTH ───
    {
        name: 'truth',
        aliases: ['sach'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🎯');
            const truth = pick(TRUTHS);
            await h.sendWithLogo(sock, from,
`${TOP}
   🎯 *TRUTH*
${MID}
   ${truth}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

    // ─── 😈 DARE ───
    {
        name: 'dare',
        aliases: ['himmat'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('😈');
            const dare = pick(DARES);
            await h.sendWithLogo(sock, from,
`${TOP}
   😈 *DARE*
${MID}
   ${dare}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

    // ─── 💌 PICKUP ───
    {
        name: 'pickup',
        aliases: ['flirt', 'line'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('💌');
            const line = pick(PICKUP);
            await h.sendWithLogo(sock, from,
`${TOP}
   💌 *PICKUP LINE*
${MID}
   ${line}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

    // ─── 💫 FACT ───
    {
        name: 'funfact',
        aliases: ['fact', 'facts'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('💫');
            const fact = pick(FACTS);
            await h.sendWithLogo(sock, from,
`${TOP}
   💫 *FUN FACT*
${MID}
   ${fact}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

    // ─── 📜 QUOTE ───
    {
        name: 'quote',
        aliases: ['quotes', 'sukoon'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('📜');
            const quote = pick(QUOTES);
            await h.sendWithLogo(sock, from,
`${TOP}
   📜 *QUOTE*
${MID}
   ${quote}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

    // ─── 🤔 WOULD YOU RATHER ───
    {
        name: 'would',
        aliases: ['wyr', 'rather'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🤔');
            const wyr = pick(WOULD_YOU);
            await h.sendWithLogo(sock, from,
`${TOP}
   🤔 *WOULD YOU RATHER?*
${MID}
   ${wyr}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

    // ─── 🎱 8BALL ───
    {
        name: '8ball',
        aliases: ['ball', 'magic8'],
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎱');

            if (!args.length) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO QUESTION*\n${MID}\n   Usage: .8ball Will I pass?\n${BOT}`, msg);
            }

            const question = args.join(' ');
            const answer = pick(EIGHT_BALL);

            await h.sendWithLogo(sock, from,
`${TOP}
   🎱 *MAGIC 8-BALL*
${MID}
   ❓ *Q:* ${question}
${THIN}
   🔮 *A:* ${answer}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

    // ─── 🪙 FLIP ───
    {
        name: 'flip',
        aliases: ['coin', 'toss'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🪙');
            const result = Math.random() < 0.5 ? '🪙 HEADS' : '🪙 TAILS';
            await h.sendWithLogo(sock, from,
`${TOP}
   🪙 *COIN FLIP*
${MID}
   ${result}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

    // ─── 🎲 DICE ───
    {
        name: 'dice',
        aliases: ['roll', 'paasa'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🎲');
            const faces = ['⚀','⚁','⚂','⚃','⚄','⚅'];
            const roll = randInt(1, 6);
            const second = randInt(1, 6);

            await h.sendWithLogo(sock, from,
`${TOP}
   🎲 *DICE ROLL*
${MID}
   🎲 ${faces[roll - 1]}  ${faces[second - 1]}
${THIN}
   📊 *Total* : ${roll + second}
   🎯 *Rolls* : ${roll} + ${second}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

    // ─── 💘 SHIP ───
    {
        name: 'ship',
        aliases: ['lovecalc', 'match'],
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('💘');

            const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;

            let a, b;
            if (mentions.length >= 2) {
                a = mentions[0]; b = mentions[1];
            } else if (mentions.length === 1) {
                a = mentions[0]; b = msg.key.participant || msg.key.remoteJid;
            } else if (quoted) {
                a = quoted; b = msg.key.participant || msg.key.remoteJid;
            } else {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NEED TWO PEOPLE*
${MID}
   • Mention 2 users, or
   • Mention 1 (you get paired), or
   • Reply to someone
${BOT}`, msg);
            }

            const percent = randInt(0, 100);
            const numA = h.cleanJid(a);
            const numB = h.cleanJid(b);

            let verdict;
            if (percent >= 90) verdict = '💍 Perfect Match! Shaadi pakki!';
            else if (percent >= 70) verdict = '💚 Bahut acha jodi hai!';
            else if (percent >= 50) verdict = '🌸 Theek hai, try karo';
            else if (percent >= 30) verdict = '😅 Mushkil hai bhai';
            else verdict = '💔 Bhai, chhod do';

            await sock.sendMessage(from, {
                text: `${TOP}
   💘 *LOVE CALCULATOR*
${MID}
   👤 @${numA}
   💕 × 💕
   👤 @${numB}
${THIN}
   📊 *Match* : ${percent}%
   ${bar(percent)}
${THIN}
   🎯 *Verdict* : ${verdict}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`,
                mentions: [a, b]
            }, { quoted: msg });

            await react('💚');
        }
    },

    // ─── 💕 SHIPNAME ───
    {
        name: 'shipname',
        aliases: ['couplename', 'lovename'],
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('💕');

            const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
            const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;

            let a, b;
            if (mentions.length >= 2) {
                a = h.cleanJid(mentions[0]);
                b = h.cleanJid(mentions[1]);
            } else if (mentions.length === 1) {
                a = h.cleanJid(mentions[0]);
                b = h.cleanJid(msg.key.participant || msg.key.remoteJid);
            } else if (quoted) {
                a = h.cleanJid(quoted);
                b = h.cleanJid(msg.key.participant || msg.key.remoteJid);
            } else {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NEED TWO*\n${MID}\n   Mention 2 users\n${BOT}`, msg);
            }

            const partA = a.slice(0, Math.ceil(a.length / 2));
            const partB = b.slice(-Math.ceil(b.length / 2));
            const shipName = partA + partB;

            await h.sendWithLogo(sock, from,
`${TOP}
   💕 *SHIP NAME*
${MID}
   👤 ${a}
   👤 ${b}
${THIN}
   💖 *Ship Name:* *${shipName}*
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

    // ─── 🎭 GAYRATE ───
    {
        name: 'gayrate',
        aliases: ['gay'],
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('🏳️‍🌈');
            const target = getTarget(msg, args, sender);
            const num = h.cleanJid(target);
            const percent = randInt(0, 100);

            await sock.sendMessage(from, {
                text: `${TOP}
   🏳️‍🌈 *GAY RATE*
${MID}
   👤 @${num}
${THIN}
   📊 *Rate* : ${percent}%
   ${bar(percent)}
${THIN}
   ${percent > 70 ? '😂 Bhai, tu toh full gay hai!' : percent > 40 ? '🤔 Thoda thoda lagta hai' : '💪 Full straight banda hai!'}
${MID}
   💖 *Saba MD*
${BOT}`,
                mentions: [target]
            }, { quoted: msg });
        }
    },

    // ─── 😎 SIMPRATE ───
    {
        name: 'simprate',
        aliases: ['simp'],
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('😎');
            const target = getTarget(msg, args, sender);
            const num = h.cleanJid(target);
            const percent = randInt(0, 100);

            await sock.sendMessage(from, {
                text: `${TOP}
   😎 *SIMP RATE*
${MID}
   👤 @${num}
${THIN}
   📊 *Rate* : ${percent}%
   ${bar(percent)}
${THIN}
   ${percent > 70 ? '💀 Bhai, simp king ho tum!' : percent > 40 ? '😅 Thoda sa simp hai' : '💪 Sigma male!'}
${MID}
   💖 *Saba MD*
${BOT}`,
                mentions: [target]
            }, { quoted: msg });
        }
    },

    // ─── 🧠 IQ RATE ───
    {
        name: 'iq',
        aliases: ['iqtest'],
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('🧠');
            const target = getTarget(msg, args, sender);
            const num = h.cleanJid(target);
            const iq = randInt(50, 200);

            await h.sendWithLogo(sock, from,
`${TOP}
   🧠 *IQ TEST*
${MID}
   👤 @${num}
${THIN}
   📊 *IQ* : ${iq}
   ${bar(Math.min(100, iq / 2))}
${THIN}
   ${iq > 150 ? '🌟 Genius level!' : iq > 120 ? '💚 Smart banda' : iq > 90 ? '😊 Average' : iq > 70 ? '😅 Thoda kam' : '💀 Bhai...'}
${MID}
   💖 *Saba MD*
${BOT}`, msg, [target]);
        }
    },

    // ─── 💪 STRENGTH ───
    {
        name: 'rate',
        aliases: ['rateit'],
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('⭐');

            const subject = args.join(' ');
            if (!subject) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO SUBJECT*\n${MID}\n   Usage: .rate anything\n${BOT}`, msg);
            }

            const percent = randInt(0, 100);

            await h.sendWithLogo(sock, from,
`${TOP}
   ⭐ *RATING*
${MID}
   📌 *Subject* : ${subject}
${THIN}
   📊 *Score*  : ${percent}/100
   ${bar(percent)}
${THIN}
   ${percent > 80 ? '🌟 Excellent!' : percent > 60 ? '💚 Good' : percent > 40 ? '😐 Okay' : '😅 Needs work'}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ─── 🔄 REVERSE ───
    {
        name: 'reverse',
        aliases: ['rev'],
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔄');

            const text = args.join(' ');
            if (!text) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: .reverse Hello World\n${BOT}`, msg);
            }

            const reversed = text.split('').reverse().join('');

            await h.sendWithLogo(sock, from,
`${TOP}
   🔄 *REVERSED*
${MID}
   📥 *Input*  : ${text}
${THIN}
   📤 *Output* : ${reversed}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ─── 🅰️ MOCK ───
    {
        name: 'mock',
        aliases: ['spongebob', 'mocking'],
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🅰️');

            const text = args.join(' ');
            if (!text) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: .mock Your text\n${BOT}`, msg);
            }

            const mocked = text.split('').map((c, i) =>
                i % 2 === 0 ? c.toLowerCase() : c.toUpperCase()
            ).join('');

            await h.sendWithLogo(sock, from,
`${TOP}
   🅰️ *MOCKED*
${MID}
   ${mocked}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ─── 🔀 SCRAMBLE ───
    {
        name: 'scramble',
        aliases: ['jumble', 'shuffle'],
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔀');

            const text = args.join(' ');
            if (!text) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: .scramble Hello\n${BOT}`, msg);
            }

            const scrambled = text.split('').sort(() => Math.random() - 0.5).join('');

            await h.sendWithLogo(sock, from,
`${TOP}
   🔀 *SCRAMBLED*
${MID}
   📥 *Original*  : ${text}
   📤 *Scrambled* : ${scrambled}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ─── 🎭 EMOJIFY ───
    {
        name: 'emojify',
        aliases: ['emoji'],
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎭');

            const text = args.join(' ');
            if (!text) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: .emojify Hello\n${BOT}`, msg);
            }

            const map = {
                a: '🅰️', b: '🅱️', c: '©️', d: '🇩', e: '📧', f: '🎏', g: '🇬', h: '♓',
                i: 'ℹ️', j: '🎷', k: '🎋', l: '👢', m: 'Ⓜ️', n: '🇳', o: '⭕', p: '🅿️',
                q: '🇶', r: '®️', s: '💲', t: '✝️', u: '⛎', v: '✅', w: '〰️', x: '❌',
                y: '🍸', z: '💤', ' ': '  ',
            };

            const output = text.toLowerCase().split('').map(c => map[c] || c).join(' ');

            await h.sendWithLogo(sock, from,
`${TOP}
   🎭 *EMOJIFIED*
${MID}
   ${output}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ─── 🎁 HACK (fake prank) ───
    {
        name: 'hack',
        aliases: ['prank', 'fakehack'],
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('💀');

            const target = getTarget(msg, args, sender);
            const num = h.cleanJid(target);

            await sock.sendMessage(from, {
                text: `${TOP}\n   💀 *HACKING...*\n${MID}\n   ⏳ Initializing...\n   ${bar(20)} 20%\n${BOT}`,
                mentions: [target]
            }, { quoted: msg });

            await new Promise(r => setTimeout(r, 1500));

            await sock.sendMessage(from, {
                text: `${TOP}\n   💀 *HACKING...*\n${MID}\n   📡 Bypassing firewall...\n   ${bar(50)} 50%\n${BOT}`,
                mentions: [target]
            });

            await new Promise(r => setTimeout(r, 1500));

            await sock.sendMessage(from, {
                text: `${TOP}\n   💀 *HACKING...*\n${MID}\n   🔓 Extracting data...\n   ${bar(80)} 80%\n${BOT}`,
                mentions: [target]
            });

            await new Promise(r => setTimeout(r, 1500));

            await sock.sendMessage(from, {
                text: `${TOP}
   ✅ *HACK COMPLETE*
${MID}
   👤 *Target* : @${num}
   🔓 *Status* : Successfully "hacked" 😂
${THIN}
   📊 *Data Found:*
   ├ 🍔 Favorite food : Biryani
   ├ 💕 Crush : Secret hai
   ├ 📱 Screen time : 8h/day
   └ 😴 Sleep time : 3 AM
${MID}
   ⚠️ *Note* : Yeh sirf mazaak hai! 😂
${MID}
   💖 *Saba MD*
${BOT}`,
                mentions: [target]
            });

            await react('😂');
        }
    },

    // ─── 💘 CRUSH ───
    {
        name: 'crush',
        aliases: ['pyar', 'crushcheck'],
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('💘');

            const target = getTarget(msg, args, sender);
            const num = h.cleanJid(target);
            const percent = randInt(0, 100);

            await h.sendWithLogo(sock, from,
`${TOP}
   💘 *CRUSH DETECTOR*
${MID}
   👤 @${num}
${THIN}
   📊 *Chance* : ${percent}%
   ${bar(percent)}
${THIN}
   ${percent > 80 ? '💚 Pakka crush hai!' : percent > 60 ? '🌸 Ho sakta hai' : percent > 40 ? '🤔 Confuse hai' : '💔 Friend-zone alert!'}
${MID}
   💖 *Saba MD*
${BOT}`, msg, [target]);
        }
    },

    // ─── 😴 LAZY RATE ───
    {
        name: 'lazy',
        aliases: ['lazyrate'],
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('😴');
            const target = getTarget(msg, args, sender);
            const num = h.cleanJid(target);
            const percent = randInt(0, 100);

            await h.sendWithLogo(sock, from,
`${TOP}
   😴 *LAZY METER*
${MID}
   👤 @${num}
${THIN}
   📊 *Laziness* : ${percent}%
   ${bar(percent)}
${THIN}
   ${percent > 80 ? '🛌 Bhai, tu legend hai sone mein!' : percent > 60 ? '😪 Thoda lazy hai' : percent > 30 ? '😊 Normal banda' : '💪 Active ho!'}
${MID}
   💖 *Saba MD*
${BOT}`, msg, [target]);
        }
    },

    // ─── 🍀 LUCK ───
    {
        name: 'luck',
        aliases: ['lucky', 'kismat'],
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('🍀');
            const target = getTarget(msg, args, sender);
            const num = h.cleanJid(target);
            const percent = randInt(0, 100);

            await h.sendWithLogo(sock, from,
`${TOP}
   🍀 *LUCK METER*
${MID}
   👤 @${num}
${THIN}
   📊 *Luck* : ${percent}%
   ${bar(percent)}
${THIN}
   ${percent > 80 ? '🌟 Nasib wala banda!' : percent > 60 ? '💚 Achi kismat' : percent > 30 ? '😊 Theek hai' : '😅 Kismat pe kaam karo'}
${MID}
   💖 *Saba MD*
${BOT}`, msg, [target]);
        }
    },

    // ─── 🧿 PERSONALITY ───
    {
        name: 'personality',
        aliases: ['aura', 'vibe'],
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('🧿');

            const target = getTarget(msg, args, sender);
            const num = h.cleanJid(target);

            const traits = [
                'Caring 💚', 'Mysterious 🔮', 'Funny 😂', 'Smart 🧠',
                'Romantic 💖', 'Adventurous 🌍', 'Calm 🌊', 'Fiery 🔥',
                'Loyal 🤝', 'Creative 🎨', 'Leader 👑', 'Kind 🌸',
            ];

            const selected = [];
            const pool = [...traits];
            for (let i = 0; i < 3; i++) {
                const idx = randInt(0, pool.length - 1);
                selected.push(pool.splice(idx, 1)[0]);
            }

            await h.sendWithLogo(sock, from,
`${TOP}
   🧿 *PERSONALITY*
${MID}
   👤 @${num}
${THIN}
   ✨ *Traits:*
   ├ ${selected[0]}
   ├ ${selected[1]}
   └ ${selected[2]}
${THIN}
   🌟 You are unique — just like Saba! 💚
${MID}
   💖 *Saba MD*
${BOT}`, msg, [target]);
        }
    },

    // ─── 💬 QUOTE BY SABA ───
    {
        name: 'sabaquote',
        aliases: ['sabaquote', 'sabaq'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('💚');

            const quotes = [
                'Saba — ek naam, hazaar khwab, ek hi muhabbat 💚',
                'Jab dil dukhta hai, tumhara naam le kar sukoon milta hai 🌸',
                'Tum meri subah ki pehli soch ho, aur raat ki aakhri dua 🌙',
                'Tumhari muskurahat = meri duniya ki sabse badi daulat 💖',
                'Saba ka matlab hai — Subah ka pehla savera 🌅',
                'Tumse mila to laga — dua qubool ho gayi 🤲',
                'Tum ho to har din Eid hai, warna har din soya savera 😌',
                'Meri jaan, mera sukoon, mera sab kuch — Saba 💚',
            ];

            await h.sendWithSaba(sock, from,
`${TOP}
   💚 *SABA QUOTE*
${MID}
   ${pick(quotes)}
${MID}
   💖 *Arslan Tech\'s for Saba*
${BOT}`, msg);
        }
    },

];