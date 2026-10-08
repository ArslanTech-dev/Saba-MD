// ===============================================
//  💚 SABA MD — GET PROFILE PICTURE
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
//  🛠️ INTERNAL HELPERS
// ═══════════════════════════════════════════════

// ─── Extract target JID ───
function extractTarget(msg, args, sender, isGroup) {
    // 1. From mentions
    const mentions = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mentions.length > 0) return mentions[0];

    // 2. From quoted message
    const quoted = msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (quoted) return quoted;

    // 3. From args (number)
    if (args && args[0]) {
        const num = String(args[0]).replace(/\D/g, '');
        if (num.length >= 10) return `${num}@s.whatsapp.net`;
    }

    // 4. In group → self
    if (isGroup) return msg.key.participant || msg.key.remoteJid;

    // 5. In DM → the other person OR self
    const remote = msg.key.remoteJid;
    if (remote && !remote.includes('@g.us')) {
        // DM: remote is the other person
        return remote;
    }

    return sender ? `${helper.cleanJid(sender)}@s.whatsapp.net` : null;
}

// ─── Fetch profile picture URL ───
async function getProfilePic(sock, jid, highRes = true) {
    try {
        const url = await sock.profilePictureUrl(jid, highRes ? 'image' : 'preview');
        return url || null;
    } catch {
        return null;
    }
}

// ─── Fetch user status/about ───
async function getStatus(sock, jid) {
    try {
        const res = await sock.fetchStatus(jid);
        return res?.[0]?.status || null;
    } catch {
        return null;
    }
}

// ─── Fetch business profile ───
async function getBusiness(sock, jid) {
    try {
        const res = await sock.getBusinessProfile(jid);
        return res || null;
    } catch {
        return null;
    }
}

// ═══════════════════════════════════════════════
//  📋 COMMANDS
// ═══════════════════════════════════════════════
module.exports = [

    // ═══════════════════════════════════════════
    //  📸 GETDP — Get profile picture
    // ═══════════════════════════════════════════
    {
        name: 'getdp',
        aliases: ['dp', 'profilepic', 'pp', 'pfp'],
        cooldown: 5000,
        run: async ({ sock, from, msg, sender, args, isGroup, react, helper: h }) => {
            await react('📸');

            const target = extractTarget(msg, args, sender, isGroup);

            if (!target) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}
   ⚠️ *NO TARGET*
${MID}
   📌 *Usage:*
   ├ *.getdp* — reply to someone
   ├ *.getdp @user* — mention
   ├ *.getdp 923001234567* — by number
   └ *.getdp* — your own DP
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);
            }

            const targetNum = h.cleanJid(target);

            // ─── Fetching ───
            await react('⏳');

            try {
                const dpUrl = await getProfilePic(sock, target, true);

                if (!dpUrl) {
                    await react('❌');
                    return sock.sendMessage(from, {
                        text:
`${TOP}
   ❌ *NO PROFILE PICTURE*
${MID}
   👤 *User* : @${targetNum}
${THIN}
   💡 *Possible reasons:*
   ├ Privacy settings (DP hidden)
   ├ No DP uploaded
   └ Account has no picture
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`,
                        mentions: [target],
                    }, { quoted: msg });
                }

                // ─── Fetch status (best-effort) ───
                let statusText = null;
                try {
                    statusText = await getStatus(sock, target);
                } catch {}

                // ─── Build caption ───
                const caption =
`${TOP}
   📸 *PROFILE PICTURE*
${MID}
   👤 *User*   : @${targetNum}
   🔗 *Format* : HD (Full Size)
${statusText ? `${THIN}\n   💬 *Bio*    : ${statusText.slice(0, 80)}\n` : ''}${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

                // ─── Send DP ───
                await sock.sendMessage(from, {
                    image: { url: dpUrl },
                    caption,
                    mentions: [target],
                }, { quoted: msg });

                await react('✅');

            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}
   ❌ *FAILED*
${MID}
   ${err.message.slice(0, 150)}
${MID}
   💖 *Saba MD*
${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📸 GETDP2 — Preview (low res, faster)
    // ═══════════════════════════════════════════
    {
        name: 'getdp2',
        aliases: ['dppreview', 'pfp2'],
        cooldown: 5000,
        run: async ({ sock, from, msg, sender, args, isGroup, react, helper: h }) => {
            await react('📸');

            const target = extractTarget(msg, args, sender, isGroup);

            if (!target) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TARGET*\n${MID}\n   Reply or mention someone\n${BOT}`, msg);
            }

            const targetNum = h.cleanJid(target);
            await react('⏳');

            try {
                const dpUrl = await getProfilePic(sock, target, false);

                if (!dpUrl) {
                    await react('❌');
                    return sock.sendMessage(from, {
                        text:
`${TOP}\n   ❌ *NO DP FOUND*\n${MID}\n   👤 @${targetNum}\n${BOT}`,
                        mentions: [target],
                    }, { quoted: msg });
                }

                await sock.sendMessage(from, {
                    image: { url: dpUrl },
                    caption:
`${TOP}
   📸 *PROFILE PICTURE*
${MID}
   👤 *User*   : @${targetNum}
   📐 *Format* : Preview (Low Res)
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`,
                    mentions: [target],
                }, { quoted: msg });

                await react('✅');

            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  💬 GETBIO — Get user's bio/status
    // ═══════════════════════════════════════════
    {
        name: 'getbio',
        aliases: ['bio', 'status', 'about'],
        cooldown: 5000,
        run: async ({ sock, from, msg, sender, args, isGroup, react, helper: h }) => {
            await react('💬');

            const target = extractTarget(msg, args, sender, isGroup);

            if (!target) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TARGET*\n${MID}\n   Reply or mention someone\n${BOT}`, msg);
            }

            const targetNum = h.cleanJid(target);
            await react('⏳');

            try {
                const bio = await getStatus(sock, target);

                if (!bio) {
                    await react('❌');
                    return sock.sendMessage(from, {
                        text:
`${TOP}
   ❌ *NO BIO FOUND*
${MID}
   👤 *User* : @${targetNum}
${THIN}
   💡 User has no bio / hidden
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`,
                        mentions: [target],
                    }, { quoted: msg });
                }

                await h.sendWithLogo(sock, from,
`${TOP}
   💬 *USER BIO*
${MID}
   👤 *User* : @${targetNum}
${THIN}
   💭 *Bio:*
   ${bio}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg, [target]);

                await react('✅');

            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  🏢 GETBIZ — Business profile
    // ═══════════════════════════════════════════
    {
        name: 'getbiz',
        aliases: ['business', 'biz'],
        cooldown: 5000,
        run: async ({ sock, from, msg, sender, args, isGroup, react, helper: h }) => {
            await react('🏢');

            const target = extractTarget(msg, args, sender, isGroup);

            if (!target) {
                await react('❌');
                return h.sendWithLogo(sock, from,
`${TOP}\n   ⚠️ *NO TARGET*\n${MID}\n   Reply or mention someone\n${BOT}`, msg);
            }

            const targetNum = h.cleanJid(target);
            await react('⏳');

            try {
                const biz = await getBusiness(sock, target);

                if (!biz || Object.keys(biz).length === 0) {
                    await react('❌');
                    return sock.sendMessage(from, {
                        text:
`${TOP}
   ❌ *NOT A BUSINESS*
${MID}
   👤 *User* : @${targetNum}
${THIN}
   💡 This user has no business account
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`,
                        mentions: [target],
                    }, { quoted: msg });
                }

                const caption =
`${TOP}
   🏢 *BUSINESS PROFILE*
${MID}
   👤 *User*      : @${targetNum}
   🏷️ *Name*      : ${biz.wid ? 'Business User' : 'N/A'}
   📧 *Email*     : ${biz.email || '—'}
   📍 *Address*   : ${biz.address || '—'}
   🌐 *Website*   : ${biz.website?.[0] || '—'}
   📝 *Description*: ${(biz.description || '—').slice(0, 100)}
   📁 *Category*  : ${biz.category || '—'}
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`;

                const dpUrl = await getProfilePic(sock, target, true).catch(() => null);

                if (dpUrl) {
                    await sock.sendMessage(from, {
                        image: { url: dpUrl },
                        caption,
                        mentions: [target],
                    }, { quoted: msg });
                } else {
                    await sock.sendMessage(from, {
                        text: caption,
                        mentions: [target],
                    }, { quoted: msg });
                }

                await react('✅');

            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

    // ═══════════════════════════════════════════
    //  📸 GETDPALL — Get DPs of all group members
    // ═══════════════════════════════════════════
    {
        name: 'getdpall',
        aliases: ['dpall', 'allpfp'],
        groupOnly: true,
        cooldown: 20000,
        run: async ({ sock, from, msg, react, helper: h }) => {
            await react('📸');

            try {
                const meta = await sock.groupMetadata(from);
                const participants = meta.participants.slice(0, 10); // Limit to 10

                await h.sendWithLogo(sock, from,
`${TOP}
   📸 *FETCHING ALL DPs*
${MID}
   👥 *Group*  : ${meta.subject}
   📊 *Total*  : ${meta.participants.length}
   📤 *Sending*: First ${participants.length}
${MID}
   ⏳ *Please wait...*
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);

                let sent = 0;
                for (const p of participants) {
                    try {
                        const dpUrl = await getProfilePic(sock, p.id, false);
                        if (dpUrl) {
                            await sock.sendMessage(from, {
                                image: { url: dpUrl },
                                caption: `👤 @${h.cleanJid(p.id)}`,
                                mentions: [p.id],
                            });
                            sent++;
                        }
                    } catch {}
                }

                await h.sendWithLogo(sock, from,
`${TOP}
   ✅ *COMPLETE*
${MID}
   📊 *Sent* : ${sent}/${participants.length} DPs
${MID}
   💖 *Saba MD — Arslan Tech's*
${BOT}`, msg);

                await react('✅');

            } catch (err) {
                await react('❌');
                await h.sendWithLogo(sock, from,
`${TOP}\n   ❌ *FAILED*\n${MID}\n   ${err.message.slice(0, 120)}\n${BOT}`, msg);
            }
        }
    },

];