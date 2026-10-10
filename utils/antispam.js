// ===============================================
//  💚 SABA MDx — ANTI-SPAM / COOLDOWN
// ===============================================

const cooldowns = new Map();

function isOnCooldown(userId, command, cooldownMs = 3000) {
    const key = `${userId}:${command}`;
    const now = Date.now();
    const expiresAt = cooldowns.get(key);

    if (expiresAt && now < expiresAt) {
        return Math.ceil((expiresAt - now) / 1000); // seconds left
    }
    cooldowns.set(key, now + cooldownMs);
    return 0;
}

function clearCooldown(userId, command) {
    cooldowns.delete(`${userId}:${command}`);
}

module.exports = { isOnCooldown, clearCooldown };