
const axios = require('axios');

let handler = async (m, { conn }) => {
    try {
        m.reply("⏳ Sedang mencari gambar random profilepict...");
        const apiUrl = `https://api.danafxc.my.id/api/proxy/pict/gambar?q=profilepict&apikey=${dana}`;
        const response = await axios.get(apiUrl);
        const jsonData = response.data;
        if (jsonData && jsonData.status && jsonData.urls && jsonData.urls.length > 0) {
            const imageUrl = jsonData.urls[0];
            await conn.sendFile(m.chat, imageUrl, 'random.jpg', 'Ini gambar random profilepict untukmu!', m);
        } else {
            throw new Error('API tidak mengembalikan URL gambar yang valid.');
        }
    } catch (error) {
        console.error('Error pada fitur random profilepict:', error);
        m.reply('Gagal mengambil gambar. Mungkin sedang ada masalah di server atau kategori ini sedang kosong.');
    }
};


handler.help = ["profilepict"];
handler.tags = ['internet', 'tools'];
handler.command = /^(profilepict)$/i;

module.exports = handler;