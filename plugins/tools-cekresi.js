const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Masukkan nomor resi dan kode kurir dengan format:\n*${usedPrefix + command} <nomor_resi>|<kode_kurir>*\n\n*Contoh:*\n${usedPrefix + command} JX5675021651|jnt`;
    }

    try {
        // 1. Parsing input pengguna
        const [resi, courier] = text.split('|');
        
        if (!resi || !courier) {
            throw `Format salah. Gunakan pemisah '|'.\n\n*Contoh:*\n${usedPrefix + command} JX5675021651|jnt`;
        }
        
        m.reply(`🕵️‍♂️ Sedang melacak resi *${resi.trim()}*...`);

        // 2. Memanggil API Anda
        const apiUrl = `https://api.danafxc.my.id/api/proxy/search/cekresi?resi=${encodeURIComponent(resi.trim())}&courier=${encodeURIComponent(courier.trim())}&apikey=${danas}`;
        
        const response = await axios.get(apiUrl);
        const result = response.data;

        // 3. Validasi dan format hasil
        if (!result.status || !result.data) {
            throw new Error(result.message || 'Gagal melacak resi. Pastikan nomor resi dan kode kurir benar.');
        }

        const data = result.data;
        
        // Membuat header ringkasan
        let replyText = `
🚚 *Hasil Lacak Resi* 📦

◦  *Kurir:* ${data.courier}
◦  *Resi:* ${data.resi}
◦  *Status:* ${data.status}
`;

        // Menambahkan riwayat perjalanan jika ada
        if (data.history && data.history.length > 0) {
            replyText += `\n📜 *Riwayat Perjalanan Paket:*\n`;
            data.history.forEach(item => {
                replyText += `\n- 📅 *${item.datetime}*:\n  └─ ${item.description}`;
            });
        }

        await m.reply(replyText.trim());

    } catch (error) {
        console.error('Error pada fitur cekresi:', error);
        m.reply(error.message || 'Terjadi kesalahan saat melacak resi.');
    }
};

handler.help = ['cekresi <no_resi>|<kurir>'];
handler.tags = ['tools'];
handler.command = /^(cekresi|resi)$/i;
handler.limit = true;

module.exports = handler;