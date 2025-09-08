const axios = require('axios');

let handler = async (m, { conn, args, usedPrefix, command }) => {
    let text;
    if (args.length >= 1) {
        text = args.slice(0).join(" ");
    } else if (m.quoted && m.quoted.text) {
        text = m.quoted.text;
    } else {
        throw `Masukkan teks atau reply sebuah pesan.\n\n*Contoh:*\n${usedPrefix + command} Kata-kata`;
    }
    if (text.length > 500) return m.reply('Teks terlalu panjang, maksimal 500 karakter!');

    try {
        const apiUrl = `https://api.danafxc.my.id/api/proxy/maker/iqc?text=${encodeURIComponent(text)}&apikey=${dana}`;
        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer'
        });
        conn.sendFile(m.chat, response.data, m);

    } catch (error) {
        console.error('Error pada fitur iqc:', error);
        m.reply('Gagal membuat gambar quote. Silakan coba lagi nanti.');
    }
};

handler.help = ['iqc <teks>'];
handler.tags = ['maker', 'tools'];
handler.command = /^(iqc|imagequote)$/i;

module.exports = handler;