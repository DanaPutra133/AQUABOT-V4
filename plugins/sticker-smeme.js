const axios = require('axios');
const FormData = require('form-data');
const { promisify } = require('util');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!/image\/(jpe?g|png)/.test(mime)) {
        throw `Balas gambar untuk dijadikan sticker meme!\n\n*Contoh Penggunaan:*\n${usedPrefix + command} teks atas|teks tengah|teks bawah`;
    }

    if (!text) {
        throw `Tambahkan teks untuk meme!\n\n*Panduan Penggunaan Command:*\n*${usedPrefix + command} <atas>|<tengah>|<bawah>*\n\n*Contoh untuk mengisi bagian tertentu:*\n*- Bawah saja:* \`||teks bawah\`\n*- Atas & Bawah:* \`teks atas||teks bawah\`\n*- Tengah saja:* \`|teks tengah|\`\n\nBalas gambar yang ingin dijadikan stiker sambil mengetik perintah di atas.`;
    }

    try {
        m.reply('Sedang membuat stiker meme...');

        let img = await q.download();
        let [top, middle, bottom] = text.split('|');
        const params = { apikey: global.dana }; 
        if (top) params.top = top;
        if (middle) params.middle = middle;
        if (bottom) params.bottom = bottom;

        const queryString = new URLSearchParams(params).toString();
        const apiUrl = `https://api.danafxc.my.id/api/proxy/maker/smeme?${queryString}`;

        const form = new FormData();
        form.append('image', img, {
            filename: 'stickermeme.png',
            contentType: mime
        });

        const getLength = promisify(form.getLength).bind(form);
        const contentLength = await getLength();
        const response = await axios.post(apiUrl, form, {
            headers: {
                ...form.getHeaders(),
                'Content-Length': contentLength,
            },
            responseType: 'arraybuffer',
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });
        conn.sendImageAsSticker(m.chat, response.data, m, { packname: global.packname, author: global.author });

    } catch (error) {
        console.error('Error saat membuat sticker meme:', error.response ? error.response.data.toString() : error.message);
        m.reply(`Gagal membuat stiker. Penyebab: ${error.message}`);
    }
};

handler.help = ['stickermeme <atas>|<tengah>|<bawah>'];
handler.tags = ['sticker'];
handler.command = /^(s(tic?ker)?me(me)?)$/i;

module.exports = handler;