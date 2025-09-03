
const axios = require('axios');
const FormData = require('form-data');

async function handler(m, { conn, usedPrefix, command }) {
  try {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';
    
    if (/^image/.test(mime) && !/webp/.test(mime)) {
      const imgBuffer = await q.download();

      const form = new FormData();
      form.append('image', imgBuffer, {
        filename: 'qrcode.png',
        contentType: mime,
      });
      const apiUrl = `https://api.danafxc.my.id/api/proxy/tools/decode-qrcode?apikey=${dana}`;
      const response = await axios.post(apiUrl, form, {
        headers: {
          ...form.getHeaders(),
        },
      });

      const result = response.data;
      if (result && result.result) {
        await m.reply(`*Hasil Decode QR Code:*\n\n${result.result}`);
      } else {
        throw new Error('Tidak dapat menemukan QR Code pada gambar atau respons API tidak valid.');
      }

    } else {
      m.reply(`Kirim gambar QR Code dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
  } catch (e) {
    console.error(e);
    const errorMessage = e.response ? JSON.stringify(e.response.data) : e.message;
    m.reply(`Gagal membaca QR Code. Penyebab: ${errorMessage}`);
  }
}

handler.help = handler.command = ['decodeqr', 'readqr'];
handler.tags = ['tools'];
handler.premium = false;
handler.limit = false;

module.exports = handler;