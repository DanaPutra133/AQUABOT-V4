const axios = require('axios');
const { getBuffer } = require('../lib/myfunc');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        m.reply(`⏳ Sedang mencari gambar random`);
        
        const apiUrl = `https://api.danafxc.my.id/api/proxy/pict/gambar?q=waifu&apikey=${dana}`;
        const response = await axios.get(apiUrl);
        const jsonData = response.data;

        if (jsonData && jsonData.status && jsonData.urls && jsonData.urls.length > 0) {
            const imageUrl = jsonData.urls[0];
            const buffer = await getBuffer(imageUrl);
            await conn.sendFile(m.chat, buffer, 'random.jpg', 'Ini gambar random waifu untukmu!', m);
        } else {
            throw new Error('API tidak mengembalikan URL gambar yang valid.');
        }

    } catch (error) {
        console.error('Error pada fitur random:', error);
        m.reply('Gagal mengambil gambar. Mungkin sedang ada masalah di server atau kategori ini sedang kosong.');
    }
};

handler.help = ['waifu'];
handler.tags = ['internet', 'tools'];
handler.command = /^(waifu)$/i;

module.exports = handler;