const axios = require('axios');

let handler = async (m, { conn, text }) => {
  if (!text) throw 'Masukkan teks atau URL yang ingin dijadikan QR code!';

  try {
    m.reply('⏳ Sedang membuat QR Code...');
   const apiUrl = `https://api.danafxc.my.id/api/proxy/tools/qrcode?apikey=${dana}&url=${encodeURIComponent(text)}`;

    const response = await axios.post(apiUrl, null, {
      responseType: 'arraybuffer' 
    });
    conn.sendFile(m.chat, response.data, 'qrcode.png', `QR Code untuk:\n${text}`, m);

  } catch (error) {
    console.error('Error saat membuat QR Code via API:', error);
    m.reply('Gagal membuat QR Code. Silakan coba lagi nanti.');
  }
};

handler.help = ['qrcode <teks>'];
handler.tags = ['tools'];
handler.command = /^qr(code)?$/i;

module.exports = handler;