const axios = require('axios');


const kategoriList = ['wallpaper', 'profilepict', 'waifu']; 

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        let kategori = text ? text.toLowerCase().trim() : '';
        if (!kategori) {
            let listMessage = `Silakan pilih kategori gambar yang tersedia.\n\n*Kategori Tersedia:*\n- ${kategoriList.join('\n- ')}\n\n*Contoh Penggunaan:*\n${usedPrefix + command} wallpaper`;
            return m.reply(listMessage);
        }
        if (!kategoriList.includes(kategori)) {
            return m.reply(`Kategori "${kategori}" tidak ditemukan.\n\n*Kategori yang Tersedia:*\n- ${kategoriList.join('\n- ')}`);
        }

        m.reply(`⏳ Sedang mencari gambar random dari kategori *${kategori}*...`);
        const apiUrl = `https://api.danafxc.my.id/api/proxy/pict/gambar?apikey=${dana}&kategori=${kategori}`;

        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer'
        });
        conn.sendFile(m.chat, response.data, 'random.jpg', `Ini gambar random *${kategori}* untukmu!`, m);

    } catch (error) {
        console.error('Error pada fitur random:', error);
        m.reply('Gagal mengambil gambar. Mungkin sedang ada masalah di server, coba lagi nanti.');
    }
};

handler.help = ['random <kategori>'];
handler.tags = ['internet', 'tools'];
handler.command = /^(random)$/i;

module.exports = handler;