const moment = require('moment-timezone');
const config = require('../config');

module.exports = {
    now:      () => moment().tz(config.TIMEZONE).format('DD/MM/YYYY HH:mm:ss'),
    today:    () => moment().tz(config.TIMEZONE).format('dddd, DD MMMM YYYY'),
    greeting: () => {
        const h = moment().tz(config.TIMEZONE).hour();
        if (h < 5)  return '🌙 Good Night';
        if (h < 12) return '🌅 Good Morning';
        if (h < 17) return '☀️ Good Afternoon';
        if (h < 21) return '🌆 Good Evening';
        return '🌙 Good Night';
    },
};