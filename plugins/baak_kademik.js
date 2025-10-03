const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        m.reply('Mengambil data Kalender Akademik...');

        const apiUrl = `https://api.danafxc.my.id/api/proxy/search/BaakK-a?apikey=${dana}`;
        const response = await axios.get(apiUrl);
        const result = response.data;

        // Pengecekan disesuaikan dengan status "success"
        if (result && result.status === 'success' && Array.isArray(result.data)) {
            const events = result.data;
            if (events.length === 0) throw new Error('Data kalender akademik kosong.');

            let replyText = `🗓️ *KALENDER AKADEMIK* 🗓️\n\n`;
            
            // --- PERBAIKAN FINAL DI SINI ---
            // Menyesuaikan nama properti (Tanggal & Kegiatan) dengan huruf kapital
            events.forEach(event => {
                replyText += `*Tanggal:* ${event.Tanggal || '-'}\n`;
                replyText += `*Kegiatan:* ${event.Kegiatan || '-'}\n`;
                replyText += `-----------------------------------\n`;
            });

            m.reply(replyText.trim());

        } else {
            throw new Error('Format data dari API tidak sesuai atau tidak ditemukan.');
        }

    } catch (error) {
        console.error('Error pada fitur kalender akademik:', error);
        m.reply(error.message || 'Gagal mengambil data kalender akademik.');
    }
};

handler.help = ['kalenderakademik'];
handler.tags = ['tools', 'education'];
handler.command = /^(kalender(akademik)?)$/i;

module.exports = handler;