module.exports = {
    isNumber: (str) => /^\d{10,15}$/.test(String(str).replace(/\D/g, '')),
    isUrl:    (str) => /^https?:\/\/.+/.test(str),
    isEmail:  (str) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(str),
    isYtUrl:  (str) => /(youtube\.com|youtu\.be)/.test(str),
    isIgUrl:  (str) => /instagram\.com/.test(str),
    isTikTok: (str) => /tiktok\.com/.test(str),
};