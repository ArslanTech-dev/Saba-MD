// ===============================================
//  💚 SABA MD — LOGGER
//  👨‍💻 Made by Arslan Tech's
// ===============================================

const chalk = require('chalk');

// ─── Timestamp format: [14:32:07] ───
function timestamp() {
    const d = new Date();
    const pad = (n) => String(n).padStart(2, '0');
    return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// ─── Level configuration ───
const LEVELS = {
    INFO:     { color: chalk.cyan,    icon: 'ℹ️ ' },
    SUCCESS:  { color: chalk.green,   icon: '✅' },
    ERROR:    { color: chalk.red,     icon: '❌' },
    WARN:     { color: chalk.yellow,  icon: '⚠️ ' },
    DEBUG:    { color: chalk.gray,    icon: '🐛' },
    ANTICALL: { color: chalk.magenta, icon: '📵' },
    BLOCK:    { color: chalk.red,     icon: '🚫' },
    PAIRING:  { color: chalk.hex('#25D366'), icon: '🔗' },
    MESSAGE:  { color: chalk.blue,    icon: '💬' },
    COMMAND:  { color: chalk.hex('#00d2ff'), icon: '⚡' },
};

// ===============================================
//  🎨 fancyLog — Main logging function
// ===============================================
function fancyLog(level = 'INFO', message = '') {
    const lvl = LEVELS[String(level).toUpperCase()] || LEVELS.INFO;
    const time = chalk.gray(`[${timestamp()}]`);
    const tag  = lvl.color.bold(`[${String(level).toUpperCase()}]`);
    const text = chalk.white(message);

    console.log(`${time} ${lvl.icon} ${tag} ${text}`);
}

// ─── Shortcut methods ───
fancyLog.info     = (msg) => fancyLog('INFO', msg);
fancyLog.success  = (msg) => fancyLog('SUCCESS', msg);
fancyLog.error    = (msg) => fancyLog('ERROR', msg);
fancyLog.warn     = (msg) => fancyLog('WARN', msg);
fancyLog.debug    = (msg) => fancyLog('DEBUG', msg);
fancyLog.anticall = (msg) => fancyLog('ANTICALL', msg);
fancyLog.block    = (msg) => fancyLog('BLOCK', msg);
fancyLog.pairing  = (msg) => fancyLog('PAIRING', msg);
fancyLog.message  = (msg) => fancyLog('MESSAGE', msg);
fancyLog.command  = (msg) => fancyLog('COMMAND', msg);

// ─── Banner (optional, index.js mein already hai) ───
fancyLog.banner = () => {
    console.log(chalk.hex('#25D366').bold(`
╔══════════════════════════════════════════════╗
║          💚  S A B A   M D  💚               ║
║     WhatsApp Multi-Device Bot                ║
║     Made by Arslan Tech's for Saba 💖        ║
╚══════════════════════════════════════════════╝
    `));
};

module.exports = { fancyLog };