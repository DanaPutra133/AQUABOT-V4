import axios from 'axios';
import FormData from 'form-data';
import { fromBuffer } from 'file-type';
import { promisify } from 'util';

let handler = async (m, { conn, usedPrefix, command }) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) throw '❌ Tidak ada media yang ditemukan. Balas media yang ingin diunggah.';
  
  try {
    let media = await q.download();
    let fileSizeLimit = 5 * 1024 * 1024; 
    
    if (media.length > fileSizeLimit) {
      throw '⚠️ Ukuran media melebihi batas 5MB.';
    }

    const { ext } = await fromBuffer(media) || { ext: 'bin' };

    const form = new FormData();
    form.append('image', media, {
      filename: `upload.${ext}`,
      contentType: mime,
    });

    const getLength = promisify(form.getLength).bind(form);
    const contentLength = await getLength();

    const response = await axios.post(
      `https://api.danafxc.my.id/api/proxy/features/upload?apikey=${lann}`,
      form,
      {
        headers: {
          ...form.getHeaders(),
          'Content-Length': contentLength,
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity,
      }
    );

    const result = response.data;
    if (!result || !result.url) {
      throw 'Gagal mengunggah file. Respons API tidak valid.';
    }
    
    const link = result.url;
    m.reply(link);

  } catch (e) {
    console.error(e);
    throw e;
  }
};

handler.help = ['tourl <reply media>'];
handler.tags = ['tools'];
handler.command = /^(upload|tourl)$/i;

export default handler;