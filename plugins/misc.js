// ===============================================
//  💚 SABA MD — MISCELLANEOUS
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Royal Style · React Enabled
//  🌍 Works in Groups & DMs
//  📦 Self-contained — no API keys needed
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');
const crypto = require('crypto');

// ═══════════════════════════════════════════════
//  🎨 STYLE
// ═══════════════════════════════════════════════
const TOP  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';
const MID  = '━━━━━━━━━━━━━━━━━━';
const THIN = '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄';
const BOT  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';

// ═══════════════════════════════════════════════
//  📚 CONTENT POOLS
// ═══════════════════════════════════════════════
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const DAD_JOKES = [
    "Why don't scientists trust atoms?\nBecause they make up everything! ⚛️",
    "Why did the scarecrow win an award?\nBecause he was outstanding in his field! 🌾",
    "I'm reading a book about anti-gravity.\nIt's impossible to put down! 📚",
    "Why don't eggs tell jokes?\nThey'd crack each other up! 🥚",
    "What do you call a fake noodle?\nAn impasta! 🍝",
    "Why did the bicycle fall over?\nBecause it was two-tired! 🚲",
    "What do you call a bear with no teeth?\nA gummy bear! 🐻",
    "Why did the math book look so sad?\nBecause it had too many problems! 📐",
    "I only know 25 letters of the alphabet.\nI don't know y! 🔤",
    "Why can't your nose be 12 inches long?\nBecause then it would be a foot! 👃",
];

const PUNS = [
    "Time flies like an arrow. Fruit flies like a banana. 🍌",
    "I used to be a banker, but I lost interest. 💰",
    "The past, present, and future walked into a bar. It was tense. ⏳",
    "I'm on a seafood diet. I see food and I eat it. 🍔",
    "I was wondering why the ball was getting bigger. Then it hit me. ⚾",
    "The rotation of the earth really makes my day. 🌍",
    "I don't trust stairs. They're always up to something. 🪜",
    "I'm friends with 25 letters of the alphabet. I don't know y. 🔤",
    "Why do we tell actors to 'break a leg'? Because every play has a cast. 🎭",
    "A plateau is a high form of flattery. 🏔️",
];

const ADVICE = [
    "Always trust your instincts — they know more than you think. 💚",
    "If you can't change the situation, change your attitude. 🌸",
    "The best time to plant a tree was 20 years ago. The second best time is now. 🌳",
    "Never regret anything that made you smile. 😊",
    "Sometimes the smallest step in the right direction ends up being the biggest step of your life. 🚶",
    "Don't compare your chapter 1 to someone else's chapter 20. 📖",
    "If you want to fly, give up everything that weighs you down. 🕊️",
    "The only way to do great work is to love what you do. ✨",
    "Be so good they can't ignore you. 🎯",
    "Simplicity is the ultimate sophistication. ✨",
];

const SHAYARI = [
    "Tumhari yaad mein hum jaagte hain raat bhar,\nna jaane kaun sa rishta hai is dil ka tumse 💚",
    "Zindagi mein jo bhi mila, tumse mila,\nSaba — ek naam jiska matlab hai sukoon 🌸",
    "Dil ke armaan aankhon mein aa jaate hain,\njab tumse baat na ho, hum kho jaate hain 💖",
    "Tere naam se shuru hoti hai meri subah,\nteri yaad se khatam hoti hai meri raat 🌙",
    "Ishq mein humne woh khoya hai,\njo shayad kabhi paaya hi nahi tha 💔",
    "Chand se poocha tera pata,\nchand ne kaha — woh toh meri bhi khwahish hai 🌙",
    "Tumhare bina yeh dil veerana lagta hai,\nSaba ke bina Arslan adhoora lagta hai 💚",
    "Meri duain tumhare naam se shuru hoti hain,\naur tumhare naam pe khatam 🤲",
];

const ZODIAC = [
    { sign: '♈ Aries', dates: 'Mar 21 – Apr 19', trait: 'Bold, ambitious, energetic' },
    { sign: '♉ Taurus', dates: 'Apr 20 – May 20', trait: 'Patient, reliable, devoted' },
    { sign: '♊ Gemini', dates: 'May 21 – Jun 20', trait: 'Curious, adaptable, witty' },
    { sign: '♋ Cancer', dates: 'Jun 21 – Jul 22', trait: 'Nurturing, emotional, intuitive' },
    { sign: '♌ Leo', dates: 'Jul 23 – Aug 22', trait: 'Confident, generous, charismatic' },
    { sign: '♍ Virgo', dates: 'Aug 23 – Sep 22', trait: 'Analytical, kind, hardworking' },
    { sign: '♎ Libra', dates: 'Sep 23 – Oct 22', trait: 'Diplomatic, artistic, social' },
    { sign: '♏ Scorpio', dates: 'Oct 23 – Nov 21', trait: 'Passionate, brave, resourceful' },
    { sign: '♐ Sagittarius', dates: 'Nov 22 – Dec 21', trait: 'Adventurous, honest, optimistic' },
    { sign: '♑ Capricorn', dates: 'Dec 22 – Jan 19', trait: 'Disciplined, responsible, patient' },
    { sign: '♒ Aquarius', dates: 'Jan 20 – Feb 18', trait: 'Progressive, original, independent' },
    { sign: '♓ Pisces', dates: 'Feb 19 – Mar 20', trait: 'Compassionate, artistic, intuitive' },
];

// ═══════════════════════════════════════════════
//  🛠️ INTERNAL HELPERS
// ═══════════════════════════════════════════════

// ─── Fancy font map ───
const FANCY_UPPER = '𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭';
const FANCY_LOWER = '𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘂𝘃𝘄𝘅𝘆𝘇';
const FANCY_NUM   = '𝟬𝟭𝟮𝟯𝟰𝟱𝟲𝟳𝟴𝟵';

function fancyText(text) {
    return text.split('').map(c => {
        if (c >= 'A' && c <= 'Z') return FANCY_UPPER[c.charCodeAt(0) - 65];
        if (c >= 'a' && c <= 'z') return FANCY_LOWER[c.charCodeAt(0) - 97];
        if (c >= '0' && c <= '9') return FANCY_NUM[parseInt(c)];
        return c;
    }).join('');
}

// ─── Upside-down text ───
const FLIP_MAP = {
    a: 'ɐ', b: 'q', c: 'ɔ', d: 'p', e: 'ǝ', f: 'ɟ', g: 'ƃ', h: 'ɥ',
    i: 'ᴉ', j: 'ɾ', k: 'ʞ', l: 'l', m: 'ɯ', n: 'u', o: 'o', p: 'd',
    q: 'b', r: 'ɹ', s: 's', t: 'ʇ', u: 'n', v: 'ʌ', w: 'ʍ', x: 'x',
    y: 'ʎ', z: 'z',
    '0': '0', '1': 'Ɩ', '2': 'ᄅ', '3': 'Ɛ', '4': 'ㄣ', '5': 'ϛ',
    '6': '9', '7': 'ㄥ', '8': '8', '9': '6',
    '.': '˙', ',': "'", '?': '¿', '!': '¡', "'": ',', '"': '„',
    '(': ')', ')': '(', '[': ']', ']': '[', '{': '}', '}': '{',
};

function flipText(text) {
    return text.split('').reverse().map(c => FLIP_MAP[c.toLowerCase()] || c).join('');
}

// ─── Morse code ───
const MORSE = {
    a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.',
    g: '--.', h: '....', i: '..', j: '.---', k: '-.-', l: '.-..',
    m: '--', n: '-.', o: '---', p: '.--.', q: '--.-', r: '.-.',
    s: '...', t: '-', u: '..-', v: '...-', w: '.--', x: '-..-',
    y: '-.--', z: '--..',
    '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
    '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
};

function toMorse(text) {
    return text.toLowerCase().split('').map(c => {
        if (c === ' ') return '/';
        return MORSE[c] || c;
    }).join(' ');
}

// ─── Binary ───
function toBinary(text) {
    return text.split('').map(c => c.charCodeAt(0).toString(2).padStart(8, '0')).join(' ');
}

function fromBinary(binary) {
    return binary.split(' ').map(b => String.fromCharCode(parseInt(b, 2))).join('');
}

// ─── Hex ───
function toHex(text) {
    return text.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join(' ');
}

function fromHex(hex) {
    return hex.split(' ').map(h => String.fromCharCode(parseInt(h, 16))).join('');
}

// ─── Roman numerals ───
function toRoman(num) {
    const map = [
        [1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'],
        [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'],
        [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I'],
    ];
    let result = '';
    for (const [val, sym] of map) {
        while (num >= val) { result += sym; num -= val; }
    }
    return result;
}

// ─── Prime check ───
function isPrime(n) {
    if (n < 2) return false;
    if (n === 2) return true;
    if (n % 2 === 0) return false;
    for (let i = 3; i * i <= n; i += 2) {
        if (n % i === 0) return false;
    }
    return true;
}

// ─── Fibonacci ───
function fibonacci(n) {
    const seq = [0, 1];
    for (let i = 2; i < n; i++) seq.push(seq[i - 1] + seq[i - 2]);
    return seq.slice(0, n);
}

// ─── Factorial ───
function factorial(n) {
    if (n < 0 || n > 170) return null;
    let result = 1n;
    for (let i = 2n; i <= BigInt(n); i++) result *= i;
    return result.toString();
}

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    // ═══════════════════════════════════════════
    //  🔤 FANCY TEXT
    // ═══════════════════════════════════════════
    {
        name: 'fancy',
        aliases: ['stylish', 'fancytext'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔤');

            const text = args.join(' ');
            if (!text) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: *.fancy Your Text*\n${BOT}`, msg);
            }

            await h.sendWithLogo(sock, from,
`${TOP}
   🔤 *FANCY TEXT*
${MID}
   📥 *Original* : ${text}
${THIN}
   ✨ *Fancy* :
   ${fancyText(text)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🙃 FLIP TEXT
    // ═══════════════════════════════════════════
    {
        name: 'fliptext',
        aliases: ['upside', 'reverse-upside'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🙃');

            const text = args.join(' ');
            if (!text) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: *.fliptext Hello*\n${BOT}`, msg);
            }

            await h.sendWithLogo(sock, from,
`${TOP}
   🙃 *UPSIDE DOWN*
${MID}
   📥 *Original* : ${text}
${THIN}
   📤 *Flipped*  : ${flipText(text)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  📡 MORSE CODE
    // ═══════════════════════════════════════════
    {
        name: 'morse',
        aliases: ['morsecode'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📡');

            const text = args.join(' ');
            if (!text) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: *.morse SOS*\n${BOT}`, msg);
            }

            await h.sendWithLogo(sock, from,
`${TOP}
   📡 *MORSE CODE*
${MID}
   📥 *Input* : ${text}
${THIN}
   📤 *Morse* :
   ${toMorse(text)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  💻 BINARY
    // ═══════════════════════════════════════════
    {
        name: 'binary',
        aliases: ['tobin', 'tobinary'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('💻');

            const input = args.join(' ');
            if (!input) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO INPUT*
${MID}
   📌 Usage:
   ├ *.binary encode Hello* — text → binary
   └ *.binary decode 01001000...* — binary → text
${BOT}`, msg);
            }

            const mode = args[0].toLowerCase();
            let result, action;

            try {
                if (mode === 'encode') {
                    result = toBinary(args.slice(1).join(' '));
                    action = 'Encoded';
                } else if (mode === 'decode') {
                    result = fromBinary(args.slice(1).join(' '));
                    action = 'Decoded';
                } else {
                    result = toBinary(input);
                    action = 'Encoded';
                }

                await h.sendWithLogo(sock, from,
`${TOP}
   💻 *BINARY*
${MID}
   📊 *Action* : ${action}
   📥 *Input*  : ${input.slice(0, 50)}
${THIN}
   📤 *Output* :
   ${result.slice(0, 500)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *INVALID*\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🔢 HEX
    // ═══════════════════════════════════════════
    {
        name: 'hexcode',
        aliases: ['tohex', 'hextext'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔢');

            const input = args.join(' ');
            if (!input) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO INPUT*\n${MID}\n   Usage: *.hex encode Hello*\n${BOT}`, msg);
            }

            const mode = args[0].toLowerCase();
            let result, action;

            try {
                if (mode === 'encode') {
                    result = toHex(args.slice(1).join(' '));
                    action = 'Encoded';
                } else if (mode === 'decode') {
                    result = fromHex(args.slice(1).join(' '));
                    action = 'Decoded';
                } else {
                    result = toHex(input);
                    action = 'Encoded';
                }

                await h.sendWithLogo(sock, from,
`${TOP}
   🔢 *HEX*
${MID}
   📊 *Action* : ${action}
   📥 *Input*  : ${input.slice(0, 50)}
${THIN}
   📤 *Output* :
   ${result.slice(0, 500)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *INVALID*\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🔐 PASSWORD GENERATOR
    // ═══════════════════════════════════════════
    {
        name: 'password',
        aliases: ['passgen', 'genpass'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔐');

            const length = Math.min(Math.max(parseInt(args[0]) || 16, 8), 64);
            const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+-=';
            let password = '';
            const bytes = crypto.randomBytes(length);
            for (let i = 0; i < length; i++) {
                password += charset[bytes[i] % charset.length];
            }

            // Strength
            const strength = length >= 20 ? '🟢 Very Strong' :
                            length >= 16 ? '🟡 Strong' :
                            length >= 12 ? '🟠 Medium' : '🔴 Weak';

            await h.sendWithLogo(sock, from,
`${TOP}
   🔐 *PASSWORD GENERATOR*
${MID}
   🔢 *Length*   : ${length}
   📊 *Strength* : ${strength}
${THIN}
   🔑 *Password:*
   \`${password}\`
${THIN}
   ⚠️ *Save it safely!*
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🆔 UUID
    // ═══════════════════════════════════════════
    {
        name: 'uuid',
        aliases: ['genuuid'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🆔');

            const count = Math.min(parseInt(args[0]) || 1, 5);
            const uuids = Array.from({ length: count }, () => crypto.randomUUID());

            await h.sendWithLogo(sock, from,
`${TOP}
   🆔 *UUID GENERATOR*
${MID}
   📊 *Count* : ${count}
${THIN}
${uuids.map((u, i) => `   ${i + 1}. \`${u}\``).join('\n')}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  📝 LOREM IPSUM
    // ═══════════════════════════════════════════
    {
        name: 'lorem',
        aliases: ['loremipsum'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📝');

            const paragraphs = Math.min(parseInt(args[0]) || 1, 3);
            const loremBase = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.';

            let text = '';
            for (let i = 0; i < paragraphs; i++) {
                text += loremBase + '\n\n';
            }

            await h.sendWithLogo(sock, from,
`${TOP}
   📝 *LOREM IPSUM*
${MID}
   ${text.trim()}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🏛️ ROMAN NUMERALS
    // ═══════════════════════════════════════════
    {
        name: 'roman',
        aliases: ['romannum', 'toroman'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🏛️');

            const num = parseInt(args[0]);
            if (!num || num < 1 || num > 3999) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *INVALID*\n${MID}\n   Usage: *.roman 2024*\n   Range: 1-3999\n${BOT}`, msg);
            }

            await h.sendWithLogo(sock, from,
`${TOP}
   🏛️ *ROMAN NUMERAL*
${MID}
   🔢 *Number* : ${num}
   🏛️ *Roman*  : ${toRoman(num)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🔢 PRIME CHECK
    // ═══════════════════════════════════════════
    {
        name: 'prime',
        aliases: ['isprime', 'primecheck'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔢');

            const num = parseInt(args[0]);
            if (isNaN(num)) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO NUMBER*\n${MID}\n   Usage: *.prime 17*\n${BOT}`, msg);
            }

            const result = isPrime(num);
            const factors = [];
            if (!result && num > 1) {
                for (let i = 2; i <= num / 2 && factors.length < 5; i++) {
                    if (num % i === 0) factors.push(i);
                }
            }

            await h.sendWithLogo(sock, from,
`${TOP}
   🔢 *PRIME CHECK*
${MID}
   📊 *Number* : ${num}
   ${result ? '✅ *PRIME*' : '❌ *NOT PRIME*'}
${factors.length > 0 ? `${THIN}\n   🔍 *Factors* : ${factors.join(', ')}\n` : ''}${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  📐 FIBONACCI
    // ═══════════════════════════════════════════
    {
        name: 'fib',
        aliases: ['fibonacci'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📐');

            const n = Math.min(Math.max(parseInt(args[0]) || 10, 1), 50);
            const seq = fibonacci(n);

            await h.sendWithLogo(sock, from,
`${TOP}
   📐 *FIBONACCI*
${MID}
   🔢 *Count* : ${n}
${THIN}
   📊 *Sequence:*
   ${seq.join(', ')}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  ✖️ FACTORIAL
    // ═══════════════════════════════════════════
    {
        name: 'factorial',
        aliases: ['fact'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('✖️');

            const n = parseInt(args[0]);
            if (isNaN(n) || n < 0 || n > 170) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *INVALID*\n${MID}\n   Usage: *.factorial 5*\n   Range: 0-170\n${BOT}`, msg);
            }

            const result = factorial(n);

            await h.sendWithLogo(sock, from,
`${TOP}
   ✖️ *FACTORIAL*
${MID}
   🔢 *Number* : ${n}!
   📊 *Result* :
   ${result.slice(0, 300)}${result.length > 300 ? '...' : ''}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  √ SQUARE ROOT
    // ═══════════════════════════════════════════
    {
        name: 'sqrt',
        aliases: ['squareroot'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('√');

            const num = parseFloat(args[0]);
            if (isNaN(num) || num < 0) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *INVALID*\n${MID}\n   Usage: *.sqrt 144*\n${BOT}`, msg);
            }

            await h.sendWithLogo(sock, from,
`${TOP}
   √ *SQUARE ROOT*
${MID}
   🔢 *Number* : ${num}
   📊 *Result* : ${Math.sqrt(num)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🔋 POWER
    // ═══════════════════════════════════════════
    {
        name: 'power',
        aliases: ['pow'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔋');

            const base = parseFloat(args[0]);
            const exp = parseFloat(args[1]);

            if (isNaN(base) || isNaN(exp)) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *INVALID*\n${MID}\n   Usage: *.power 2 10*\n${BOT}`, msg);
            }

            await h.sendWithLogo(sock, from,
`${TOP}
   🔋 *POWER*
${MID}
   🔢 *Base*   : ${base}
   ⚡ *Power*  : ${exp}
${THIN}
   📊 *Result* : ${Math.pow(base, exp)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🧮 MULTIPLICATION TABLE
    // ═══════════════════════════════════════════
    {
        name: 'table',
        aliases: ['multitable', 'timesTable'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🧮');

            const num = parseInt(args[0]);
            if (isNaN(num) || num < 1 || num > 100) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *INVALID*\n${MID}\n   Usage: *.table 7*\n${BOT}`, msg);
            }

            let table = '';
            for (let i = 1; i <= 10; i++) {
                table += `   ${num} × ${String(i).padStart(2, ' ')} = ${num * i}\n`;
            }

            await h.sendWithLogo(sock, from,
`${TOP}
   🧮 *MULTIPLICATION TABLE*
${MID}
   📊 *Number* : ${num}
${THIN}
${table}${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🎂 ZODIAC
    // ═══════════════════════════════════════════
    {
        name: 'zodiac',
        aliases: ['zodiacsign', 'rashi'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎂');

            const dateStr = args[0];
            if (!dateStr) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO DATE*\n${MID}\n   Usage: *.zodiac 15-06* (DD-MM)\n${BOT}`, msg);
            }

            const parts = dateStr.split('-');
            if (parts.length !== 2) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *INVALID*\n${MID}\n   Format: DD-MM (e.g., 15-06)\n${BOT}`, msg);
            }

            const day = parseInt(parts[0]);
            const month = parseInt(parts[1]);

            // Determine zodiac
            let z = 0;
            if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) z = 0;
            else if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) z = 1;
            else if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) z = 2;
            else if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) z = 3;
            else if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) z = 4;
            else if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) z = 5;
            else if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) z = 6;
            else if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) z = 7;
            else if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) z = 8;
            else if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) z = 9;
            else if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) z = 10;
            else z = 11;

            const sign = ZODIAC[z];

            await h.sendWithLogo(sock, from,
`${TOP}
   🎂 *ZODIAC SIGN*
${MID}
   📅 *Birth*  : ${dateStr}
   ${sign.sign}
${THIN}
   📆 *Dates*  : ${sign.dates}
   ✨ *Traits* : ${sign.trait}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  ⚖️ BMI CALCULATOR
    // ═══════════════════════════════════════════
    {
        name: 'bmi',
        aliases: ['bmicalc'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('⚖️');

            const weight = parseFloat(args[0]);
            const height = parseFloat(args[1]);

            if (isNaN(weight) || isNaN(height) || weight <= 0 || height <= 0) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *INVALID*
${MID}
   📌 Usage: *.bmi <weight kg> <height cm>*
   💡 Example: *.bmi 70 175*
${BOT}`, msg);
            }

            const heightM = height / 100;
            const bmi = weight / (heightM * heightM);
            const category =
                bmi < 18.5 ? '🟦 Underweight' :
                bmi < 25 ? '🟢 Normal weight' :
                bmi < 30 ? '🟡 Overweight' : '🔴 Obese';

            await h.sendWithLogo(sock, from,
`${TOP}
   ⚖️ *BMI CALCULATOR*
${MID}
   💪 *Weight* : ${weight} kg
   📏 *Height* : ${height} cm
${THIN}
   📊 *BMI*      : ${bmi.toFixed(1)}
   🎯 *Category* : ${category}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  ⏳ COUNTDOWN
    // ═══════════════════════════════════════════
    {
        name: 'countdown',
        aliases: ['daysleft'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('⏳');

            const dateStr = args[0];
            if (!dateStr) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO DATE*\n${MID}\n   Usage: *.countdown 2026-01-01*\n${BOT}`, msg);
            }

            try {
                const target = new Date(dateStr);
                if (isNaN(target.getTime())) throw new Error('Invalid date');

                const now = new Date();
                const diff = target - now;
                const days = Math.floor(diff / (24 * 60 * 60 * 1000));
                const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));

                const past = diff < 0;

                await h.sendWithLogo(sock, from,
`${TOP}
   ⏳ *COUNTDOWN*
${MID}
   📅 *Target*  : ${target.toDateString()}
   ${past ? '⏪ *Past event*' : '⏩ *Coming soon*'}
${THIN}
   📊 *Remaining:*
   ├ 📆 *Days*    : ${Math.abs(days)}
   ├ 🕐 *Hours*   : ${Math.abs(hours)}
   └ 🕔 *Minutes* : ${Math.abs(minutes)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from, `${TOP}\n   ❌ *INVALID DATE*\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  😄 DAD JOKE
    // ═══════════════════════════════════════════
    {
        name: 'dadjoke',
        aliases: ['dadjokes'],
        cooldown: 3000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('😄');
            await h.sendWithLogo(sock, from,
`${TOP}
   😄 *DAD JOKE*
${MID}
   ${pick(DAD_JOKES)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  😆 PUN
    // ═══════════════════════════════════════════
    {
        name: 'pun',
        aliases: ['puns'],
        cooldown: 3000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('😆');
            await h.sendWithLogo(sock, from,
`${TOP}
   😆 *PUN*
${MID}
   ${pick(PUNS)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  💡 ADVICE
    // ═══════════════════════════════════════════
    {
        name: 'advice',
        aliases: ['advise', 'nasiha'],
        cooldown: 3000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('💡');
            await h.sendWithLogo(sock, from,
`${TOP}
   💡 *ADVICE*
${MID}
   ${pick(ADVICE)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  💚 SHAYARI (Urdu Poetry)
    // ═══════════════════════════════════════════
    {
        name: 'shayari',
        aliases: ['poetry', 'sher'],
        cooldown: 3000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('💚');
            await h.sendWithSaba(sock, from,
`${TOP}
   💚 *SHAYARI*
${MID}
   ${pick(SHAYARI)}
${MID}
   💖 *Arslan Tech's — dil se*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  ✅ YES / NO
    // ═══════════════════════════════════════════
    {
        name: 'yesno',
        aliases: ['yes-no', 'y-n'],
        cooldown: 2000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🎯');

            const answers = ['✅ YES', '❌ NO', '🤔 MAYBE', '💚 Definitely', '🚫 Absolutely not', '⏳ Wait and see'];
            const answer = pick(answers);

            await h.sendWithLogo(sock, from,
`${TOP}
   🎯 *YES OR NO*
${MID}
   📊 *Answer* : ${answer}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🎲 CHOOSE
    // ═══════════════════════════════════════════
    {
        name: 'choose',
        aliases: ['pick'],
        cooldown: 2000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎲');

            const input = args.join(' ');
            if (!input || !input.includes(',')) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *USAGE*
${MID}
   📌 *.choose option1, option2, option3*
${THIN}
   💡 Example:
   .choose Pizza, Burger, Biryani
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            const options = input.split(',').map(s => s.trim()).filter(Boolean);
            const chosen = pick(options);

            await h.sendWithLogo(sock, from,
`${TOP}
   🎲 *CHOOSE*
${MID}
   📋 *Options* :
${options.map((o, i) => `   ├ ${i + 1}. ${o}`).join('\n')}
${THIN}
   ✨ *Chosen* : *${chosen}*
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  📏 LINE / DIVIDER
    // ═══════════════════════════════════════════
    {
        name: 'line',
        aliases: ['divider', 'sep'],
        cooldown: 2000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('📏');

            const styles = {
                royal:   '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍',
                wave:    '━━━━━❰ 💚 ❱━━━━━',
                stars:   '✦ ✧ ✦ ✧ ✦ ✧ ✦ ✧ ✦',
                hearts:  '❤️ ─── 💚 ─── ❤️',
                arrows:  '➤ ➤ ➤ ➤ ➤ ➤ ➤ ➤',
                flowers: '🌸 ─── ⊱ ♡ ⊰ ─── 🌸',
                dots:    '• • • • • • • • • •',
                dash:    '─ ─ ─ ─ ─ ─ ─ ─ ─',
                equals:  '═══════════════════',
                fancy:   '❈ ❋ ✿ ❀ ❁ ❃ ❋ ❈',
            };

            let text = '';
            text += `${TOP}\n`;
            text += `   📏 *DIVIDER STYLES*\n`;
            text += `${MID}\n`;

            for (const [name, style] of Object.entries(styles)) {
                text += `   *${name}*:\n`;
                text += `   ${style}\n\n`;
            }

            text += `${MID}\n`;
            text += `   💖 *Saba MD — Arslan Tech's*\n`;
            text += `${BOT}`;

            await h.sendWithLogo(sock, from, text, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🐄 COWSAY
    // ═══════════════════════════════════════════
    {
        name: 'cowsay',
        aliases: ['cow'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🐄');

            const text = args.join(' ');
            if (!text) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Usage: *.cowsay Hello*\n${BOT}`, msg);
            }

            const border = '─'.repeat(Math.min(text.length + 2, 40));

            await h.sendWithLogo(sock, from,
`${TOP}
   🐄 *COWSAY*
${MID}
   ╭${border}╮
   │ ${text} │
   ╰${border}╯
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🕐 TIMEZONE
    // ═══════════════════════════════════════════
    {
        name: 'timezone',
        aliases: ['worldtime', 'timezones'],
        cooldown: 3000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🕐');

            const zones = [
                { city: '🇵🇰 Karachi', tz: 'Asia/Karachi' },
                { city: '🇮🇳 Delhi', tz: 'Asia/Kolkata' },
                { city: '🇦🇪 Dubai', tz: 'Asia/Dubai' },
                { city: '🇸🇦 Riyadh', tz: 'Asia/Riyadh' },
                { city: '🇬🇧 London', tz: 'Europe/London' },
                { city: '🇺🇸 New York', tz: 'America/New_York' },
                { city: '🇯🇵 Tokyo', tz: 'Asia/Tokyo' },
                { city: '🇦🇺 Sydney', tz: 'Australia/Sydney' },
            ];

            let text = '';
            text += `${TOP}\n`;
            text += `   🕐 *WORLD TIME*\n`;
            text += `${MID}\n`;

            for (const zone of zones) {
                const time = new Date().toLocaleTimeString('en-US', {
                    timeZone: zone.tz,
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true,
                });
                text += `   ${zone.city} : ${time}\n`;
            }

            text += `${MID}\n`;
            text += `   💖 *Saba MD — Arslan Tech's*\n`;
            text += `${BOT}`;

            await h.sendWithLogo(sock, from, text, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  📖 SLANG
    // ═══════════════════════════════════════════
    {
        name: 'slang',
        aliases: ['slangs'],
        cooldown: 3000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('📖');

            const slangs = [
                { word: 'Lit', meaning: 'Amazing, exciting', example: 'That party was lit! 🔥' },
                { word: 'GOAT', meaning: 'Greatest Of All Time', example: 'Messi is the GOAT 🐐' },
                { word: 'Slay', meaning: 'Doing something perfectly', example: 'She slayed that look 💅' },
                { word: 'Vibe', meaning: 'Feeling or atmosphere', example: 'Good vibes only ✨' },
                { word: 'Flex', meaning: 'Showing off', example: 'He\'s flexing his new phone 📱' },
                { word: 'FOMO', meaning: 'Fear Of Missing Out', example: 'I have FOMO from that trip 😭' },
                { word: 'YOLO', meaning: 'You Only Live Once', example: 'YOLO, let\'s do it! 🎉' },
                { word: 'Sus', meaning: 'Suspicious', example: 'That\'s sus bro 🤨' },
                { word: 'Bet', meaning: 'Okay, agreed', example: 'Meet at 5? Bet 👊' },
                { word: 'Salty', meaning: 'Upset, bitter', example: 'Why so salty? 😂' },
            ];

            const slang = pick(slangs);

            await h.sendWithLogo(sock, from,
`${TOP}
   📖 *SLANG WORD*
${MID}
   🔤 *Word*    : ${slang.word}
   💬 *Meaning* : ${slang.meaning}
${THIN}
   📝 *Example* :
   ${slang.example}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🎨 RANDOM COLOR
    // ═══════════════════════════════════════════
    {
        name: 'randomcolor',
        aliases: ['randcolor', 'randhex'],
        cooldown: 3000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🎨');

            const hex = Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase();
            const r = parseInt(hex.slice(0, 2), 16);
            const g = parseInt(hex.slice(2, 4), 16);
            const b = parseInt(hex.slice(4, 6), 16);

            const previewUrl = `https://singlecolorimage.com/get/${hex}/300x300`;

            await sock.sendMessage(from, {
                image: { url: previewUrl },
                caption:
`${TOP}
   🎨 *RANDOM COLOR*
${MID}
   🎯 *HEX* : #${hex}
   🔴 *RGB* : rgb(${r}, ${g}, ${b})
${MID}
   💖 *Saba MD*
${BOT}`,
            }, { quoted: msg });

            await react('✅');
        }
    },

    // ═══════════════════════════════════════════
    //  🔢 NUMBER TO WORDS
    // ═══════════════════════════════════════════
    {
        name: 'numwords',
        aliases: ['num2words', 'numberwords'],
        cooldown: 3000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🔢');

            const num = parseInt(args[0]);
            if (isNaN(num)) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *INVALID*\n${MID}\n   Usage: *.numwords 1234*\n${BOT}`, msg);
            }

            const ones = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
                'ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];
            const tens = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];

            function toWords(n) {
                if (n < 20) return ones[n];
                if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? '-' + ones[n % 10] : '');
                if (n < 1000) return ones[Math.floor(n / 100)] + ' hundred' + (n % 100 ? ' ' + toWords(n % 100) : '');
                if (n < 1000000) return toWords(Math.floor(n / 1000)) + ' thousand' + (n % 1000 ? ' ' + toWords(n % 1000) : '');
                if (n < 1000000000) return toWords(Math.floor(n / 1000000)) + ' million' + (n % 1000000 ? ' ' + toWords(n % 1000000) : '');
                return n.toString();
            }

            const words = toWords(num);

            await h.sendWithLogo(sock, from,
`${TOP}
   🔢 *NUMBER TO WORDS*
${MID}
   🔢 *Number* : ${num.toLocaleString()}
   📝 *Words*  : ${words}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🎯 RANDOM NAME
    // ═══════════════════════════════════════════
    {
        name: 'randname',
        aliases: ['randomname', 'namegen'],
        cooldown: 3000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('🎯');

            const first = ['Ali', 'Ahmed', 'Sara', 'Ayesha', 'Hassan', 'Fatima', 'Usman', 'Zainab', 'Bilal', 'Maryam',
                'Saba', 'Arslan', 'Hamza', 'Areeba', 'Danish', 'Hira', 'Saad', 'Kiran'];
            const last = ['Khan', 'Ahmed', 'Malik', 'Sheikh', 'Butt', 'Raza', 'Hashmi', 'Chaudhry', 'Qureshi', 'Siddiqui'];

            const name = `${pick(first)} ${pick(last)}`;

            await h.sendWithLogo(sock, from,
`${TOP}
   🎯 *RANDOM NAME*
${MID}
   👤 *Name* : *${name}*
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  📋 MISC MENU
    // ═══════════════════════════════════════════
    {
        name: 'misc',
        aliases: ['miscmenu', 'extras'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('📋');

            await h.sendWithLogo(sock, from,
`${TOP}
   📋 *MISCELLANEOUS MENU*
${MID}
   🔤 *Text*
${THIN}
   ├ .fancy      — Fancy text
   ├ .fliptext   — Upside down
   ├ .morse      — Morse code
   ├ .binary     — Binary encode
   ├ .hexcode    — Hex encode
   ├ .cowsay     — Cow text
   └ .numwords   — Number to words
${THIN}
   🧮 *Math*
${THIN}
   ├ .prime      — Prime check
   ├ .fib        — Fibonacci
   ├ .factorial  — Factorial
   ├ .sqrt       — Square root
   ├ .power      — Power
   ├ .table      — Multiplication
   ├ .roman      — Roman numerals
   └ .bmi        — BMI calculator
${THIN}
   🎲 *Random*
${THIN}
   ├ .password   — Password gen
   ├ .uuid       — UUID gen
   ├ .yesno      — Yes or No
   ├ .choose     — Pick option
   ├ .randname   — Random name
   └ .randomcolor — Random color
${THIN}
   💡 *Fun*
${THIN}
   ├ .dadjoke    — Dad jokes
   ├ .pun        — Puns
   ├ .advice     — Random advice
   ├ .shayari    — Urdu poetry
   ├ .slang      — Slang words
   └ .line       — Divider styles
${THIN}
   📅 *Utility*
${THIN}
   ├ .zodiac     — Zodiac sign
   ├ .countdown  — Days left
   ├ .timezone   — World time
   └ .lorem      — Lorem ipsum
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

];