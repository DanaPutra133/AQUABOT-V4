const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan kode kelas yang ingin Anda cari.\n\n*Contoh:*\n${usedPrefix + command} 4ka14`;

    try {
        m.reply(`⏳ Sedang mencari jadwal kuliah untuk kelas *${text.toUpperCase()}*...`);

        // 1. Memanggil API Anda
        const apiUrl = `https://api.danafxc.my.id/api/proxy/search/jadwal-kuliah?kelas=${encodeURIComponent(text)}&apikey=${dana}`;
        const response = await axios.get(apiUrl);
        const result = response.data;

        // 2. Validasi respons dari API
        if (!result || result.status !== 'success' || !result.data || result.data.length === 0) {
            throw new Error(`Jadwal untuk kelas "${text.toUpperCase()}" tidak ditemukan.`);
        }

        const scheduleData = result.data;
        const className = scheduleData[0].kelas; // Ambil nama kelas dari data pertama

        // 3. Mengelompokkan jadwal berdasarkan hari
        const groupedSchedule = {};
        for (const item of scheduleData) {
            if (!groupedSchedule[item.hari]) {
                groupedSchedule[item.hari] = [];
            }
            groupedSchedule[item.hari].push(item);
        }

        // 4. Membuat format balasan yang rapi
        let replyText = `*Jadwal Kuliah Kelas ${className}*\n\n`;

        const sortedDays = ['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jum\'at', 'Sabtu', 'Minggu'].filter(day => groupedSchedule[day]);

        for (const day of sortedDays) {
            replyText += `= *${day}* =\n`;
            groupedSchedule[day].forEach(item => {
                replyText += `• *${item.mata_kuliah}*\n`;
                replyText += `  - Waktu: ${item.waktu || '-'}\n`;
                replyText += `  - Ruang: ${item.ruang || '-'}\n`;
                replyText += `  - Dosen: ${item.dosen || '-'}\n\n`;
            });
        }

        m.reply(replyText.trim());

    } catch (error) {
        console.error('Error pada fitur jadwal kuliah:', error);
        m.reply(error.message || 'Terjadi kesalahan saat mengambil data jadwal kuliah.');
    }
};

handler.help = ['baak <kode_kelas>'];
handler.tags = ['tools', 'education'];
handler.command = /^(baak|jadwal)$/i;

module.exports = handler;