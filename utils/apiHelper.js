const axios = require('axios');

const apiHelper = {
    get: async (url, opts = {}) => {
        const res = await axios.get(url, { timeout: 20000, ...opts });
        return res.data;
    },
    post: async (url, data, opts = {}) => {
        const res = await axios.post(url, data, { timeout: 20000, ...opts });
        return res.data;
    },
    getBuffer: async (url) => {
        const res = await axios.get(url, { responseType: 'arraybuffer', timeout: 30000 });
        return Buffer.from(res.data);
    },
};

module.exports = apiHelper;