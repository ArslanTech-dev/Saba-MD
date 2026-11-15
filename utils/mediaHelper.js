const { downloadContentFromMessage } = require('@whiskeysockets/baileys');

async function downloadMedia(msg, type = 'image') {
    const stream = await downloadContentFromMessage(
        msg.message[`${type}Message`],
        type
    );
    let buffer = Buffer.from([]);
    for await (const chunk of stream) {
        buffer = Buffer.concat([buffer, chunk]);
    }
    return buffer;
}

module.exports = { downloadMedia };