const axios = require('axios');
const cheerio = require('cheerio');

let handler = async (m, { conn, text }) => {
    if (!text) throw 'Gunakan format: .jadwal kelas';

    const allData = await jadwalUts(text); // Mengambil data jadwal

    if (!allData || allData.length === 0) {
        return conn.reply(m.chat, `Tidak ada data yang ditemukan untuk kelas ${text}.`, m);
    }

    let batchSize = 20;
    let totalData = allData.length;
    let batches = Math.ceil(totalData / batchSize);

    for (let i = 0; i < batches; i++) {
        let start = i * batchSize;
        let end = start + batchSize;
        let batchData = allData.slice(start, end);

        let message = batchData.map((data, index) => (
            `📚 *Jadwal UTS Kelas ${text}*\n` +
            `📅 *Hari*: ${data.hari || '-'}\n` +
            `📆 *Tanggal*: ${data.tanggal || '-'}\n` +
            `📖 *Mata Kuliah*: ${data.mata_kuliah || '-'}\n` +
            `⏰ *Waktu*: ${data.waktu || '-'}\n` +
            `🏫 *Ruang*: ${data.ruang || '-'}\n` +
            `-----------------------------`
        )).join('\n\n');

        await m.reply(message);
        await new Promise(resolve => setTimeout(resolve, 1000)); // Delay antar batch 1 detik
    }

    conn.reply(m.chat, `✅ Semua data sudah terkirim (${totalData} total data).`, m);
};

handler.help = ['jadwaluts'];
handler.tags = ['tools'];
handler.command = /^(jadwaluts)$/i;
handler.group = false;

module.exports = handler;

async function jadwalUts(kelas) {
    try {
        const url = `https://api.danafxc.my.id/api/jadwal/uts?apikey=mark%20pembohong&kelas=${encodeURIComponent(kelas)}`;
        const response = await axios.get(url);

        if (!response.data || !response.data.status || !response.data.data) {
            throw new Error('Data tidak valid atau tidak ditemukan.');
        }

        return response.data.data;
    } catch (error) {
        console.error('Error:', error.message);
        return [];
    }
};