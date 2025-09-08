let { sticker5 } = require('../lib/sticker.js');
let axios = require('axios');

let handler = async (m, { conn, args }) => {
    let text;
    if (args.length >= 1) {
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        throw "Input teks atau reply teks yang ingin dijadikan quote!";
    }
   
    if (text.length > 100) return m.reply('Maksimal 100 Teks!');

    try {
        
        let targetUser;
        let username;
        if (m.quoted) {
            targetUser = m.quoted.sender;
            username = m.quoted.name;
        } else {
            targetUser = m.sender;
            username = m.name;
        }
        
        const avatar = await conn.profilePictureUrl(targetUser, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png');
        
        const apiUrl = `https://api.danafxc.my.id/api/proxy/maker/qc?apikey=${dana}&text=${encodeURIComponent(text)}&username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}`;

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

handler.help = ['qc2 '];
handler.tags = ['sticker'];
handler.limit = true;
handler.command = /^(qc2|quotely2)$/i;

module.exports = handler;