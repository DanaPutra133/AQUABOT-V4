const axios = require('axios');
const FormData = require('form-data');

let handler = async (m, { conn, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || '';

    if (!/image\/(jpe?g|png)/.test(mime)) {
        throw `Balas gambar untuk dijadikan filter!\n\n*Contoh Penggunaan:*\n${usedPrefix + command}`;
    }

    try {

        let img = await q.download();

        const apiUrl = `https://api.danafxc.my.id/api/proxy/maker/Idviral1?apikey=${dana}`;

        const form = new FormData();
        form.append('image', img, {
            filename: 'idviral.png',
            contentType: mime
        });

        const response = await axios.post(apiUrl, form, {
            headers: form.getHeaders(),
            responseType: 'arraybuffer'
        });

        await conn.sendFile(m.chat, response.data, 'idviral.png', '', m);

    } catch (error) {
        console.error('Error saat membuat filter Idviral:', error.response ? error.response.data.toString() : error.message);
        m.reply('Gagal membuat filter Idviral, silakan coba lagi.');
    }
};

handler.help = ['filterid'];
handler.tags = ['maker'];
handler.command = /^filterid$/i;

module.exports = handler;
