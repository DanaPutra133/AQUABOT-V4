const fetch = require('node-fetch');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Ganti dengan API key kamu

    if (!text) throw `Masukkan nama kota yang ingin dicari.\n\n*Contoh:*\n${usedPrefix + command} Jakarta`;

    try {
        await m.reply('⏳ Mencari jadwal sholat...');

        const res = await fetch(`https://api.danafxc.my.id/api/proxy/islamic/sholat?kota=${encodeURIComponent(text)}&tanggal=now&apikey=${dana}`);
        
        if (!res.ok) throw new Error(`Tidak dapat menemukan jadwal untuk kota "${text}".`);
        
        const json = await res.json();
        
        if (!json.status) throw new Error(json.message || 'Respons API tidak valid.');

        const data = json.data;
        const timings = data.timings;
        const readableDate = data.date.readable;
        const hijriDate = `${data.date.hijri.day}-${data.date.hijri.month.en}-${data.date.hijri.year}`;

        // Format pesan balasan yang rapi
        const replyText = `
🕌 *Jadwal Sholat untuk ${text.charAt(0).toUpperCase() + text.slice(1)}*

📅 *Tanggal:* ${readableDate}
☪️ *Hijriah:* ${hijriDate}

- *Imsak:* ${timings.Imsak}
- *Subuh (Fajr):* ${timings.Fajr}
- *Terbit (Sunrise):* ${timings.Sunrise}
- *Dzuhur:* ${timings.Dhuhr}
- *Ashar:* ${timings.Asr}
- *Maghrib:* ${timings.Maghrib}
- *Isya:* ${timings.Isha}
        `.trim();

        await m.reply(replyText);

    } catch (error) {
        console.error(error);
        await m.reply(`Terjadi kesalahan: ${error.message}\nPastikan nama kota yang Anda masukkan benar.`);
    }
};

handler.help = ['jadwalsholat <kota>'];
handler.tags = ['islamic'];
handler.command = /^(jadwalsholat|sholat)$/i;

module.exports = handler;