import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Masukkan nomor resi dan kode kurir dengan format:\n*${usedPrefix + command} <nomor_resi>|<kode_kurir>*\n\n*Contoh:*\n${usedPrefix + command} JX5675021651|jnt`;
    }

    try {
        const [resi, courier] = text.split('|');
        
        if (!resi || !courier) {
            throw `Format salah. Gunakan pemisah '|'.\n\n*Contoh:*\n${usedPrefix + command} JX5675021651|jnt`;
        }
        
        await m.reply(`🕵️‍♂️ Sedang melacak resi *${resi.trim()}*...`);
        const apiUrl = `https://api.danafxc.my.id/api/proxy/search/cekresi?resi=${encodeURIComponent(resi.trim())}&courier=${encodeURIComponent(courier.trim())}&apikey=${danas}`;
        
        const response = await axios.get(apiUrl);
        const result = response.data;
        
        if (!result.status || !result.data) {
            throw result.message || 'Gagal melacak resi. Pastikan nomor resi dan kode kurir benar.';
        }

        const data = result.data;
        
        let replyText = `
🚚 *Hasil Lacak Resi* 📦

◦  *Kurir:* ${data.courier}
◦  *Resi:* ${data.resi}
◦  *Status:* ${data.status}
`;

        if (data.history && data.history.length > 0) {
            replyText += `\n📜 *Riwayat Perjalanan Paket:*\n`;
            data.history.forEach(item => {
                replyText += `\n- 📅 *${item.datetime}*:\n  └─ ${item.description}`;
            });
        }

        await m.reply(replyText.trim());

    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
};

handler.help = ['cekresi <no_resi>|<kurir>'];
handler.tags = ['tools'];
handler.command = /^(cekresi|resi)$/i;
handler.limit = true;

export default handler;