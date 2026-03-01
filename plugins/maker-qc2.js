let { sticker5 } = require('../lib/sticker.js');
let axios = require('axios');

let handler = async (m, { conn, text }) => {
    let textForQuote;
    let username;
    let targetUser;

    // Logic: if reply and text contains '|', split to username|teks, else username = replied user
    if (m.quoted) {
        targetUser = m.quoted.sender;
        if (text && text.includes('|')) {
            let [nameInput, ...msgArr] = text.split('|');
            username = nameInput.trim();
            textForQuote = msgArr.join('|').trim();
            if (!textForQuote) textForQuote = m.quoted.text;
        } else {
            username = m.quoted.pushName || await conn.getName(targetUser);
            textForQuote = text ? text : m.quoted.text;
        }
    } else {
        targetUser = m.sender;
        if (text && text.includes('|')) {
            let [nameInput, ...msgArr] = text.split('|');
            username = nameInput.trim();
            textForQuote = msgArr.join('|').trim();
        } else {
            username = m.name;
            textForQuote = text;
        }
    }

    if (!textForQuote) {
        throw "Teks untuk quote tidak ditemukan! Reply pesan berisi teks atau ketik teks setelah command.";
    }

    if (textForQuote.length > 100) return m.reply('Maksimal 100 Teks!');

    try {
        m.reply('Sedang membuat stiker quote...');
        const avatar = await conn.profilePictureUrl(targetUser, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png');
        const apiUrl = `https://api.danafxc.my.id/api/proxy/maker/qc?apikey=${dana}&text=${encodeURIComponent(textForQuote)}&username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}`;
        const response = await axios.post(apiUrl, null, {
            responseType: 'arraybuffer'
        });

        const imageBuffer = response.data;
        let stiker = await sticker5(imageBuffer, false, global.packname, global.author);

        if (stiker) {
            return conn.sendFile(m.chat, stiker, 'Quotely.webp', '', m);
        } else {
            throw new Error('Gagal membuat stiker dari gambar yang diterima.');
        }

    } catch (error) {
        console.error('Error pada command qc:', error);
        m.reply('Terjadi kesalahan saat membuat stiker quote.');
    }
};

handler.help = ['qc2 <teks> (sambil reply)'];
handler.tags = ['sticker'];
handler.limit = true;
handler.command = /^(qc2|quotely2)$/i; 

module.exports = handler;