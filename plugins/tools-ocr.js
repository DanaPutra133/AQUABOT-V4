const axios = require('axios');
const FormData = require('form-data');
// Diperlukan untuk perbaikan koneksi
const { promisify } = require('util');

let handler = async (m, { conn }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || '';
    if (!mime) throw `Balas gambar dengan perintah .ocr`;
    if (!/image\/(jpe?g|png)/.test(mime)) throw `Format ${mime} tidak didukung! Hanya gambar (jpg, png).`;

    try {
        m.reply('Sedang membaca teks pada gambar...');

        const imgBuffer = await q.download();
        
        const form = new FormData();
        form.append('image', imgBuffer, {
            filename: 'ocr.jpg',
            contentType: mime,
        });

        const apiUrl = `https://api.danafxc.my.id/api/proxy/tools/ocr?apikey=${dana}`;

        // --- PERBAIKAN KONEKSI DI SINI ---
        // Menambahkan header Content-Length agar request lebih stabil
        const getLength = promisify(form.getLength).bind(form);
        const contentLength = await getLength();

        const response = await axios.post(apiUrl, form, {
            headers: {
                ...form.getHeaders(),
                'Content-Length': contentLength, // Header penting ditambahkan
            },
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
        });
        
        const result = response.data;

        // Logika ini sudah benar sesuai hasil debug Anda
        if (result && result.text) {
            await m.reply(`${result.text}`);
        } else {
            // Jika API merespons tapi formatnya tidak sesuai
            throw new Error(`Respons API tidak valid: ${JSON.stringify(result)}`);
        }

    } catch (error) {
        console.error('Error pada fitur OCR:', error.response ? JSON.stringify(error.response.data) : error.message);
        m.reply('Gagal membaca teks dari gambar. Pastikan gambar jelas dan coba lagi.');
    }
};

handler.help = ['ocr', 'totext'];
handler.tags = ['tools'];
handler.command = /^(ocr|totext)$/i;
handler.limit = true;

module.exports = handler;