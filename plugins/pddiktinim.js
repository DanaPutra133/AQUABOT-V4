import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan Nama atau NIM Mahasiswa yang ingin dicari.\n\n*Contoh:*\n${usedPrefix + command} jondoy`;

    try {
        await m.reply('⏳ Sedang mencari data mahasiswa...');

        const query = encodeURIComponent(text.trim());
        const response = await axios.get(`https://api.danafxc.my.id/api/proxy/features/pddikti-browser/${query}?apikey=${dana}`);

        const result = response.data;
        
        if (!result.status || !result.data || result.data.length === 0) {
            throw result.message || `Data untuk "${text}" tidak ditemukan.`;
        }

        const mahasiswaList = result.data;
        let replyText = `*🔍 Ditemukan ${mahasiswaList.length} hasil untuk "${text}":*\n\n`;
        
        mahasiswaList.forEach((mahasiswa, index) => {
            replyText += `*─── [ Hasil ${index + 1} ] ───*\n`;
            replyText += `🎓 *Nama:* ${mahasiswa.nama}\n`;
            replyText += `🔢 *NIM:* ${mahasiswa.nim}\n`;
            replyText += `🏛️ *Perguruan Tinggi:* ${mahasiswa.perguruan_tinggi}\n`;
            replyText += `📚 *Program Studi:* ${mahasiswa.program_studi}\n`;
            replyText += `📚 *Link Detail:* ${mahasiswa.link_detail}\n\n`;
        });

        await m.reply(replyText.trim());

    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
};

handler.help = ['caripddikti <nama/nim>'];
handler.tags = ['tools', 'education'];
handler.command = /^(pddikti|caripddikti)$/i;

export default handler;