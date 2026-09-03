import uploadFile from '../lib/uploadFile.js';
import axios from 'axios';
import { stickerToMp4, detectStickerKind, STICKER_KIND } from '../lib/sticker-convert.js?v=6';

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

    let isAnimated = (q.msg || q).isAnimated === true;

    if (isAnimated || /video|webp/g.test(mime)) {
      let videoBuffer = null;

      try {
        let mediaUrl = await uploadFile(img);
        let apiUrl = `https://api.danafxc.my.id/api/proxy/tools/convertwebp2mp4?apikey=${dana}&url=${encodeURIComponent(mediaUrl)}`;

        let response = await axios.get(apiUrl, {
          responseType: 'arraybuffer',
          timeout: 15000,
        });
        
        if (response && response.data) {
          videoBuffer = Buffer.from(response.data);
        }
      } catch (apiErr) {
        console.warn('⚠️ API Danafxc gagal/timeout untuk WM, beralih ke konversi lokal...', apiErr?.message || apiErr);
      }

      if (!videoBuffer || !videoBuffer.length) {
        try {
          videoBuffer = await stickerToMp4(img);
        } catch (localErr) {
          console.error('Konversi lokal stickerToMp4 gagal:', localErr);
        }
      }

      if (!videoBuffer || !videoBuffer.length) {
        throw "Gagal mengubah media animasi menjadi video stiker.";
      }

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