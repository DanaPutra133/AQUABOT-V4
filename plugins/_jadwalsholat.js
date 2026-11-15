import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `*❌ Masukkan nama kota yang ingin dicari.*\n\n*Contoh:*\n${usedPrefix + command} Jakarta`;
    }

    try {
        await m.reply('⏳ _Mencari jadwal sholat..._');

        let apiUrl = `https://api.danafxc.my.id/api/proxy/islamic/sholat?kota=${encodeURIComponent(text.trim())}&tanggal=now&apikey=${dana}`;
        
        let res = await fetch(apiUrl);
        let json = await res.json();
        
        if (!json.status) throw '⚠️ Tidak dapat menemukan jadwal untuk kota tersebut atau API sedang bermasalah.';

        let data = json.data;
        let timings = data.timings;
        let readableDate = data.date.readable;
        let hijriDate = `${data.date.hijri.day}-${data.date.hijri.month.en}-${data.date.hijri.year}`;

        let txt = `🕌 *JADWAL SHOLAT ${text.toUpperCase()}* 🕌\n\n`;
        txt += `📅 *Tanggal:* ${readableDate}\n`;
        txt += `☪️ *Hijriah:* ${hijriDate}\n\n`;
        txt += `┌  • *Imsak:* ${timings.Imsak}\n`;
        txt += `│  • *Subuh:* ${timings.Fajr}\n`;
        txt += `│  • *Terbit:* ${timings.Sunrise}\n`;
        txt += `│  • *Dzuhur:* ${timings.Dhuhr}\n`;
        txt += `│  • *Ashar:* ${timings.Asr}\n`;
        txt += `│  • *Maghrib:* ${timings.Maghrib}\n`;
        txt += `└  • *Isya:* ${timings.Isha}\n\n`;
        txt += `_${global.wm}_`;

        await conn.sendMessage(m.chat, { text: txt.trim() }, { quoted: m });

    } catch (e) {
        console.error(e);
        throw e;
    }
};

handler.help = ['jadwalsholat <kota>'];
handler.tags = ['islamic'];
handler.command = /^(jadwalsholat|sholat)$/i;

export default handler;