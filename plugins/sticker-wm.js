import uploadFile from '../lib/uploadFile.js';
import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  
  if (!text) throw `Format salah!\n\nContoh penggunaan:\n*${usedPrefix + command} Packname | Author*\n(Atau balas gambar/video/stiker)`;
  if (!mime) throw `Balas gambar/video/stiker dengan perintah ${usedPrefix + command}`;
  if (/video/g.test(mime) && (q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!');

  let parts = text.split(/[|•]/).map(v => v.trim());
  let packname = parts[0] || text;
  let author = parts[1] || ''; 
  await m.reply(global.wait);
  
  try {
    let img = await q.download?.();
    if (!img) throw `Gagal mengunduh media, pastikan kamu membalas gambar/video/stiker.`;

    let media = await uploadFile(img);
    let isAnimated = (q.msg || q).isAnimated === true;

    if (isAnimated || /video|webp/g.test(mime)) {
      let apiUrl = `https://api.danafxc.my.id/api/proxy/tools/convertwebp2mp4?apikey=${dana}&url=${encodeURIComponent(media)}`;

      let response = await axios.get(apiUrl, {
        responseType: 'arraybuffer',
       
      });

      let videoBuffer = Buffer.from(response.data);

      await conn.sendVideoAsSticker(m.chat, videoBuffer, m, {
        packname: packname,
        author: author,
      });
    } else {
      await conn.sendImageAsSticker(m.chat, img, m, {
        packname: packname,
        author: author,
      });
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
}

handler.help = ['wm', 'watermark'];
handler.tags = ['sticker'];
handler.command = /^wm|watermark?$/i;
handler.limit = true;

export default handler;