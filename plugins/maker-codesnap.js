const axios = require('axios');
const FormData = require('form-data');
const { promisify } = require('util');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!m.quoted) {
        throw `Perintah ini digunakan dengan cara me-reply pesan.\n\n*Lihat cara penggunaan di bawah:*\n\n*1. Untuk Kode Saja:*\nKirim pesan berisi kode, lalu reply pesan tersebut dengan command *${usedPrefix + command}*\n\n*2. Untuk Kode + Gambar Latar:*\nKirim gambar dengan caption berisi kode, lalu reply pesan tersebut dengan command *${usedPrefix + command}*\n\n*3. Dengan Blur:*\nReply pesan kode/gambar dengan caption: *${usedPrefix + command} 20* (angka 1-100)`;
    }

    try {
        const q = m.quoted;
        const mime = (q.msg || q).mimetype || '';
        let codeToSnap;
        let backgroundImageBuffer = null;

        if (/image/.test(mime)) {
            codeToSnap = q.text;
            if (!codeToSnap) throw 'Gambar yang Anda reply tidak memiliki caption berisi kode.';
            backgroundImageBuffer = await q.download();
        } else if (q.text) {
            codeToSnap = q.text;
        } else {
            throw 'Silakan reply pesan berisi teks atau gambar dengan caption kode.';
        }

        if (!codeToSnap) {
            throw 'Tidak ada kode yang terdeteksi pada pesan yang Anda reply.';
        }

        const form = new FormData();
        form.append('code', codeToSnap);

        if (backgroundImageBuffer) {
            form.append('background', backgroundImageBuffer, {
                filename: 'background.jpg',
            });
        }
        const params = { apikey: dana };
        const blurValue = text ? parseInt(text.trim()) : null;

        // 2. Validasi dan tambahkan parameter blur jika ada
        if (blurValue !== null) {
            if (isNaN(blurValue)) {
                throw `Nilai blur harus berupa angka. Contoh: *${usedPrefix + command} 20*`;
            }
            params.blur = blurValue;
        }

        const queryString = new URLSearchParams(params).toString();
        const apiUrl = `https://api.danafxc.my.id/api/proxy/tools/codesnap?${queryString}`;
        

        const getLength = promisify(form.getLength).bind(form);
        const contentLength = await getLength();

        const response = await axios.post(apiUrl, form, {
            headers: {
                ...form.getHeaders(),
                'Content-Length': contentLength,
            },
            responseType: 'arraybuffer'
        });

        conn.sendFile(m.chat, response.data, 'codesnap.png', 'Ini codesnap Anda!', m);

    } catch (error) {
        console.error('Error pada fitur codesnap:', error.response ? JSON.stringify(error.response.data) : error.message);
        m.reply(`Gagal membuat codesnap. Penyebab: ${error.message}`);
    }
};

handler.help = ['codesnap <reply> [nilai_blur]'];
handler.tags = ['tools', 'maker'];
handler.command = /^(codesnap|cs)$/i;

module.exports = handler;