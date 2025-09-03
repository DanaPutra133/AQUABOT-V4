const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command })  => {
    // Ganti dengan API key Anda

    if (!text) throw `Masukkan Nama atau NIM Mahasiswa yang ingin dicari.\n\n*Contoh:*\n${usedPrefix + command} jondoy`;

    try {
        await m.reply('⏳ Sedang mencari data mahasiswa...');

        // Menggunakan encodeURIComponent untuk memastikan input aman untuk URL
        const query = encodeURIComponent(text.trim());
        
        const response = await axios.get(`https://api.danafxc.my.id/api/proxy/features/pddikti-browser/${query}?apikey=${dana}`);

        const result = response.data;
        if (!result.status || !result.data || result.data.length === 0) {
            throw new Error(result.message || `Data untuk "${text}" tidak ditemukan.`);
        }

        const mahasiswaList = result.data;
                let replyText = `*🔍 Ditemukan ${mahasiswaList.length} hasil untuk "${text}":*\n\n`;
        
        mahasiswaList.forEach((mahasiswa, index) => {
            replyText += `*─── [ Hasil ${index + 1} ] ───*\n`;
            replyText += `🎓 *Nama:* ${mahasiswa.nama}\n`;
            replyText += `🔢 *NIM:* ${mahasiswa.nim}\n`;
            replyText += `🏛️ *Perguruan Tinggi:* ${mahasiswa.perguruan_tinggi}\n`;
            replyText += `📚 *Program Studi:* ${mahasiswa.program_studi}\n`;
            replyText += `📚 *Link Detail:* ${mahasiswa.link_detail}\n`;
            replyText += `\n`;
        });

        await conn.reply(m.chat, replyText.trim(), m);

    } catch (error) {
        console.error(error);
        await conn.reply(m.chat, `Terjadi kesalahan: ${error.message}`, m);
    }
};

handler.help = ['caripddikti <nama/nim>'];
handler.tags = ['tools', 'education'];
handler.command = /^(pddikti|caripddikti)$/i;

module.exports = handler;