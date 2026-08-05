import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let quoteText = text || (m.quoted ? m.quoted.text : '');

    if (!quoteText) {
        throw `Masukkan teks atau reply sebuah pesan.\n\n*Contoh:*\n${usedPrefix + command} Kata-kata mutiara`;
    }

    if (quoteText.length > 500) return m.reply('Teks terlalu panjang, maksimal 500 karakter!');

    try {
        const apiUrl = `https://api.danafxc.my.id/api/proxy/maker/iqc?text=${encodeURIComponent(quoteText)}&apikey=${dana}`;

        const response = await axios.get(apiUrl, {
            responseType: 'arraybuffer'
        });

        await conn.sendFile(m.chat, response.data, 'quote.png', '', m);

    } catch (e) {
            console.log(e);
            throw e;
    }
};

handler.help = ["iqc <teks> (sambil reply)"];
handler.tags = ["sticker"];
handler.limit = false;
handler.command = /^(iqc)$/i;
 
export default handler;