// ===============================================
//  💚 SABA MD — AI COMMANDS (Ultra Advanced)
//  👨‍💻 Made by Arslan Tech's for Saba
//  🎨 Royal Style · React Enabled
//  🌍 Works in Groups & DMs
//  📦 Self-contained — only needs .env key
// ===============================================

const config = require('../config');
const helper = require('../utils/helper');
const axios = require('axios');

// ═══════════════════════════════════════════════
//  🔐 API KEYS (from .env)
// ═══════════════════════════════════════════════
const OPENAI_KEY = process.env.OPENAI_API_KEY || '';
const OPENAI_URL = 'https://api.openai.com/v1/chat/completions';
const OPENAI_IMG = 'https://api.openai.com/v1/images/generations';

// ═══════════════════════════════════════════════
//  🎨 STYLE
// ═══════════════════════════════════════════════
const TOP  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';
const MID  = '━━━━━━━━━━━━━━━━━━';
const THIN = '┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄┄';
const BOT  = '─❍══ ⃟ ⃟ ⃟ ⃟ ⃟══⊷❍';

// ═══════════════════════════════════════════════
//  💾 CONVERSATION MEMORY (per user)
// ═══════════════════════════════════════════════
const MEMORY = new Map();  // userId → [{role, content}]
const MEMORY_LIMIT = 10;   // max 10 exchanges
const MEMORY_TTL = 30 * 60 * 1000; // 30 min

function getMemory(userId) {
    const entry = MEMORY.get(userId);
    if (!entry) return null;
    if (Date.now() - entry.updated > MEMORY_TTL) {
        MEMORY.delete(userId);
        return null;
    }
    return entry.messages;
}

function saveMemory(userId, messages) {
    MEMORY.set(userId, {
        messages: messages.slice(-MEMORY_LIMIT * 2),
        updated: Date.now(),
    });
}

function clearMemory(userId) {
    MEMORY.delete(userId);
}

// ═══════════════════════════════════════════════
//  🛠️ INTERNAL HELPERS
// ═══════════════════════════════════════════════

// ─── System prompt (Saba personality) ───
function systemPrompt() {
    return `You are Saba MD, a friendly, witty, and caring WhatsApp AI assistant made by Arslan Tech's.
You were created specially for Saba — a very special person.
Speak in a warm, respectful tone. Use emojis occasionally (💚, 🌸, ✨).
If the user speaks Urdu/Hindi, respond in Urdu/Hindi. If English, respond in English.
Keep responses concise (max 2-3 short paragraphs) unless asked for detail.
Never mention you're an AI language model. Just be Saba MD — helpful, loving, and fun.`;
}

// ─── Call OpenAI Chat API ───
async function chatAI(userMessage, userId, options = {}) {
    if (!OPENAI_KEY || OPENAI_KEY.length < 20) {
        throw new Error('OpenAI API key missing. Set OPENAI_API_KEY in .env');
    }

    const history = getMemory(userId) || [];

    const messages = [
        { role: 'system', content: options.system || systemPrompt() },
        ...history,
        { role: 'user', content: userMessage },
    ];

    const res = await axios.post(OPENAI_URL, {
        model: options.model || 'gpt-4o-mini',
        messages,
        temperature: options.temperature ?? 0.8,
        max_tokens: options.max_tokens || 800,
    }, {
        headers: {
            'Authorization': `Bearer ${OPENAI_KEY}`,
            'Content-Type': 'application/json',
        },
        timeout: 60000,
    });

    const reply = res.data?.choices?.[0]?.message?.content?.trim();
    if (!reply) throw new Error('Empty response from AI');

    // Save memory
    if (options.remember !== false) {
        saveMemory(userId, [
            ...history,
            { role: 'user', content: userMessage },
            { role: 'assistant', content: reply },
        ]);
    }

    return {
        reply,
        tokens: res.data?.usage?.total_tokens || 0,
        model: res.data?.model || 'gpt-4o-mini',
    };
}

// ─── Call OpenAI Image API ───
async function imagineAI(prompt) {
    if (!OPENAI_KEY || OPENAI_KEY.length < 20) {
        throw new Error('OpenAI API key missing. Set OPENAI_API_KEY in .env');
    }

    const res = await axios.post(OPENAI_IMG, {
        model: 'dall-e-3',
        prompt,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
    }, {
        headers: {
            'Authorization': `Bearer ${OPENAI_KEY}`,
            'Content-Type': 'application/json',
        },
        timeout: 90000,
    });

    const url = res.data?.data?.[0]?.url;
    if (!url) throw new Error('No image URL from DALL-E');

    return {
        url,
        revised: res.data?.data?.[0]?.revised_prompt || prompt,
    };
}

// ─── Shorten text ───
function shortText(t, max = 60) {
    if (!t) return '';
    return t.length > max ? t.slice(0, max - 3) + '...' : t;
}

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    // ═══════════════════════════════════════════
    //  🤖 AI — General chat
    // ═══════════════════════════════════════════
    {
        name: 'ai',
        aliases: ['gpt', 'chat', 'ask', 'gpt4'],
        cooldown: 5000,
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('🤖');

            const query = args.join(' ').trim();
            if (!query) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO QUESTION*
${MID}
   📌 Usage: *.ai Your question*
${THIN}
   💡 Examples:
   ├ .ai What is AI?
   ├ .ai Meri madad karo
   └ .ai Write a poem for Saba
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
            }

            await react('⏳');

            try {
                const { reply, tokens, model } = await chatAI(query, sender);

                await h.sendWithLogo(sock, from,
`${TOP}
   🤖 *AI RESPONSE*
${MID}
   ❓ *Query*:
   ${shortText(query, 100)}
${THIN}
   💬 *Answer:*
   ${reply}
${THIN}
   📊 *Tokens* : ${tokens}
   🧠 *Model*  : ${model}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}
   ❌ *AI ERROR*
${MID}
   ${err.message.slice(0, 200)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🎨 IMAGINE — DALL-E image generation
    // ═══════════════════════════════════════════
    {
        name: 'imagine',
        aliases: ['dalle', 'img', 'generate', 'draw'],
        cooldown: 30000,
        run: async ({ sock, from, msg, args, react, helper: h }) => {
            await react('🎨');

            const prompt = args.join(' ').trim();
            if (!prompt) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO PROMPT*
${MID}
   📌 Usage: *.imagine Your description*
${THIN}
   💡 Examples:
   ├ .imagine a cute cat
   ├ .imagine sunset over mountains
   └ .imagine futuristic city
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            if (prompt.length > 1000) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *PROMPT TOO LONG*\n${MID}\n   Max 1000 chars\n${BOT}`, msg);
            }

            await h.sendWithLogo(sock, from,
`${TOP}
   🎨 *GENERATING IMAGE*
${MID}
   📝 *Prompt*: ${shortText(prompt, 80)}
${THIN}
   ⏳ Please wait...
   (This can take 20-40 seconds)
${MID}
   💖 *Saba MD*
${BOT}`, msg);

            await react('⏳');

            try {
                const { url, revised } = await imagineAI(prompt);

                await sock.sendMessage(from, {
                    image: { url },
                    caption:
`${TOP}
   🎨 *IMAGE GENERATED*
${MID}
   📝 *Prompt*: ${shortText(prompt, 80)}
${THIN}
   ✨ *Model*  : DALL-E 3
   📐 *Size*   : 1024×1024
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`,
                }, { quoted: msg });

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}
   ❌ *GENERATION FAILED*
${MID}
   ${err.message.slice(0, 200)}
${THIN}
   💡 *Possible causes:*
   ├ Content policy violation
   ├ API rate limit
   └ Insufficient credits
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  💚 SABA — Special AI talk (about Saba)
    // ═══════════════════════════════════════════
    {
        name: 'sabaai',
        aliases: ['saba-gpt'],
        cooldown: 5000,
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('💚');

            const query = args.join(' ').trim() || 'Write a beautiful message for Saba';
            await react('⏳');

            try {
                const customSystem = `You are a poetic, romantic AI writing specifically for Saba — the beloved of Arslan (the creator).
Write warm, respectful, Urdu/Hindi romantic messages. Use light emojis (💚, 🌸, ✨, 💖).
Keep messages short, poetic, and heart-touching. Never cross boundaries — always respectful and pure.`;

                const { reply } = await chatAI(query, `saba-${sender}`, {
                    system: customSystem,
                    temperature: 0.9,
                });

                await h.sendWithSaba(sock, from,
`${TOP}
   💚 *SABA AI*
${MID}
   💬 ${reply}
${MID}
   💖 *Arslan Tech's — dil se*
${BOT}`, msg);

                await react('💚');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  ✍️ WRITE — Content writing
    // ═══════════════════════════════════════════
    {
        name: 'write',
        aliases: ['essay', 'paragraph'],
        cooldown: 5000,
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('✍️');

            const topic = args.join(' ').trim();
            if (!topic) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TOPIC*\n${MID}\n   Usage: *.write <topic>*\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const { reply, tokens } = await chatAI(
                    `Write a short well-structured essay (150-200 words) on: ${topic}`,
                    `write-${sender}`,
                    { remember: false, temperature: 0.7 }
                );

                await h.sendWithLogo(sock, from,
`${TOP}
   ✍️ *WRITTEN CONTENT*
${MID}
   📝 *Topic*: ${shortText(topic, 60)}
${THIN}
   ${reply}
${THIN}
   📊 *Tokens* : ${tokens}
${MID}
   💖 *Saba MD*
${BOT}`, msg);

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  💻 CODE — Code generator
    // ═══════════════════════════════════════════
    {
        name: 'code',
        aliases: ['codeai', 'program'],
        cooldown: 5000,
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('💻');

            const query = args.join(' ').trim();
            if (!query) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO QUERY*\n${MID}\n   Usage: *.code <request>*\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const customSystem = `You are an expert programmer. Generate clean, working code. Include brief comments. If language isn't specified, ask which one. Format code in triple backticks with language name.`;

                const { reply, tokens } = await chatAI(query, `code-${sender}`, {
                    system: customSystem,
                    temperature: 0.5,
                    remember: false,
                });

                await h.sendWithLogo(sock, from,
`${TOP}
   💻 *CODE RESPONSE*
${MID}
   📝 *Query*: ${shortText(query, 60)}
${THIN}
   ${reply}
${THIN}
   📊 *Tokens* : ${tokens}
${MID}
   💖 *Saba MD*
${BOT}`, msg);

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🌍 TRANSLATE — Language translator
    // ═══════════════════════════════════════════
    {
        name: 'translate',
        aliases: ['tr', 'trans'],
        cooldown: 5000,
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('🌍');

            const input = args.join(' ').trim();
            if (!input) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO TEXT*
${MID}
   📌 Usage: *.translate <lang> <text>*
${THIN}
   💡 Examples:
   ├ .translate urdu Hello world
   ├ .translate english Aap kaise hain
   └ .translate spanish Good morning
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            await react('⏳');

            try {
                const customSystem = `You are a professional translator. Detect target language from first word, then translate the rest. Reply ONLY with the translated text, no explanation.`;

                const { reply } = await chatAI(
                    `Translate to the language specified: ${input}`,
                    `tr-${sender}`,
                    { system: customSystem, remember: false, temperature: 0.3 }
                );

                await h.sendWithLogo(sock, from,
`${TOP}
   🌍 *TRANSLATION*
${MID}
   📥 *Input*: ${shortText(input, 100)}
${THIN}
   📤 *Output:*
   ${reply}
${MID}
   💖 *Saba MD*
${BOT}`, msg);

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📝 SUMMARIZE — Text summary
    // ═══════════════════════════════════════════
    {
        name: 'summarize',
        aliases: ['summary', 'tldr'],
        cooldown: 5000,
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('📝');

            let text = args.join(' ').trim();

            // If no args, check quoted message
            if (!text) {
                const quoted = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
                if (quoted) {
                    text = quoted.conversation
                        || quoted.extendedTextMessage?.text
                        || quoted.imageMessage?.caption
                        || quoted.videoMessage?.caption
                        || '';
                }
            }

            if (!text) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TEXT*\n${MID}\n   Send text or reply to a message\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const customSystem = `Summarize the given text in 3-5 bullet points. Be concise and clear.`;

                const { reply } = await chatAI(text.slice(0, 4000), `sum-${sender}`, {
                    system: customSystem,
                    remember: false,
                    temperature: 0.5,
                });

                await h.sendWithLogo(sock, from,
`${TOP}
   📝 *SUMMARY*
${MID}
   ${reply}
${MID}
   💖 *Saba MD*
${BOT}`, msg);

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🧹 CLEAR — Clear AI memory
    // ═══════════════════════════════════════════
    {
        name: 'clearchat',
        aliases: ['forget', 'reset', 'clearai'],
        cooldown: 5000,
        run: async ({ sock, from, msg, sender, react, helper: h }) => {
            await react('🧹');
            clearMemory(sender);

            await h.sendWithLogo(sock, from,
`${TOP}
   🧹 *MEMORY CLEARED*
${MID}
   ✅ AI has forgotten your chat history
   💚 Fresh start!
${MID}
   💖 *Saba MD*
${BOT}`, msg);
        }
    },

    // ═══════════════════════════════════════════
    //  🎭 ROLEPLAY — Custom AI persona
    // ═══════════════════════════════════════════
    {
        name: 'roleplay',
        aliases: ['rp', 'actas'],
        cooldown: 5000,
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('🎭');

            const input = args.join(' ').trim();
            if (!input || !input.includes('|')) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *FORMAT*
${MID}
   📌 Usage: *.roleplay <persona> | <message>*
${THIN}
   💡 Examples:
   ├ .roleplay pirate | Hello there
   ├ .roleplay teacher | What is 2+2?
   └ .roleplay doctor | I have a headache
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }

            const [persona, message] = input.split('|').map(s => s.trim());

            if (!persona || !message) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *INVALID FORMAT*\n${MID}\n   Both persona & message required\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const customSystem = `You are roleplaying as: ${persona}. Stay in character completely. Respond naturally as this persona would. Keep responses short (max 2-3 sentences).`;

                const { reply } = await chatAI(message, `rp-${sender}`, {
                    system: customSystem,
                    remember: false,
                    temperature: 0.9,
                });

                await h.sendWithLogo(sock, from,
`${TOP}
   🎭 *ROLEPLAY*
${MID}
   🎬 *Persona* : ${persona}
   💬 *Message* : ${shortText(message, 60)}
${THIN}
   ${reply}
${MID}
   💖 *Saba MD*
${BOT}`, msg);

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  💡 IDEAS — Creative ideas
    // ═══════════════════════════════════════════
    {
        name: 'ideas',
        aliases: ['idea', 'brainstorm'],
        cooldown: 5000,
        run: async ({ sock, from, msg, sender, args, react, helper: h }) => {
            await react('💡');

            const topic = args.join(' ').trim();
            if (!topic) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TOPIC*\n${MID}\n   Usage: *.ideas <topic>*\n${BOT}`, msg);
            }

            await react('⏳');

            try {
                const customSystem = `Generate 5 creative, practical ideas. Format as numbered list. Be specific and actionable.`;

                const { reply } = await chatAI(`Generate ideas for: ${topic}`, `idea-${sender}`, {
                    system: customSystem,
                    remember: false,
                    temperature: 1.0,
                });

                await h.sendWithLogo(sock, from,
`${TOP}
   💡 *BRAINSTORM*
${MID}
   📌 *Topic*: ${shortText(topic, 60)}
${THIN}
   ${reply}
${MID}
   💖 *Saba MD*
${BOT}`, msg);

                await react('✅');
            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 150)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📊 AI INFO
    // ═══════════════════════════════════════════
    {
        name: 'aiinfo',
        aliases: ['ai-status'],
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('📊');

            const hasKey = OPENAI_KEY && OPENAI_KEY.length > 20;
            const memCount = MEMORY.size;

            await h.sendWithLogo(sock, from,
`${TOP}
   📊 *AI STATUS*
${MID}
   🤖 *Engine*  : OpenAI GPT-4o-mini
   🎨 *Images*  : DALL-E 3
   🔑 *API Key* : ${hasKey ? '✅ Configured' : '❌ Missing'}
   🧠 *Memory*  : ${memCount} active chats
${THIN}
   📖 *Commands:*
   ├ .ai        — Chat
   ├ .imagine   — Generate image
   ├ .sabaai    — Saba special 💚
   ├ .write     — Essays
   ├ .code      — Code generation
   ├ .translate — Translate text
   ├ .summarize — Summarize text
   ├ .roleplay  — Roleplay
   ├ .ideas     — Brainstorm
   └ .clearchat — Reset memory
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
        }
    },

];