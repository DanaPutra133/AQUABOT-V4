const fetch = require('node-fetch');

// --- Handler Utama ---
let handler = async (m, { text, usedPrefix, command }) => {
    // 1. Ganti 'APIKEY_ANDA' dengan API key kamu yang sebenarnya
    const apikey = 'APIKEY_ANDA'; 
    
    if (!text) {
        throw `Masukkan nama kota yang ingin dicari.\n\n*Contoh Penggunaan:*\n${usedPrefix + command} Jakarta`;
    }

    try {
        m.reply('⏳ Sedang mencari informasi cuaca...');
        const res = await fetch(`https://api.danafxc.my.id/api/proxy/features/cuaca?kota=${encodeURIComponent(text)}&apikey=${dana}`);
                if (!res.ok) throw new Error(`Lokasi "${text}" tidak ditemukan atau terjadi kesalahan server.`);

        const json = await res.json();
        if (!json.status) throw new Error(json.message || 'Gagal mendapatkan data cuaca.');
        const data = json.data;
        const suhu = data.suhu.replace(/Â/g, '');
        const terasaSeperti = data.terasa_seperti.replace(/Â/g, '');
        const replyText = `
🌦️ *Cuaca untuk Wilayah ${data.kota}* 🌦️

📍 *Lokasi:* ${data.kota}, ${data.negara}
🌡️ *Suhu:* ${suhu}
🥵 *Terasa seperti:* ${terasaSeperti}
💧 *Kelembapan:* ${data.kelembapan}
🌬️ *Angin:* ${data.angin}
📜 *Kondisi:* ${data.kondisi}
        `.trim(); 

        m.reply(replyText);

    } catch (error) {
        console.error(error); 
    }
};

handler.help = ['cuaca <kota>'];
handler.tags = ['internet'];
handler.command = /^(cuaca|weather)$/i;

module.exports = handler;