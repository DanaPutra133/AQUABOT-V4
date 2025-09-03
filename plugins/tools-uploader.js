const axios = require('axios');
const FormData = require('form-data');
const { fromBuffer } = require('file-type');
const { promisify } = require('util');

let handler = async (m) => {
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime) throw 'Tidak ada gambar yang ditemukan. Balas gambar yang ingin diunggah.';
  
  try {
    let media = await q.download();
    let fileSizeLimit = 5 * 1024 * 1024; 
    
    if (media.length > fileSizeLimit) {
      throw 'Ukuran media melebihi batas 5MB';
    }

    const { ext } = await fromBuffer(media) || {};

    const form = new FormData();
    form.append('image', media, {
      filename: `upload.${ext}`,
      contentType: mime,
    });

    const getLength = promisify(form.getLength).bind(form);
    const contentLength = await getLength();

    const response = await axios.post(
      `https://api.danafxc.my.id/api/proxy/features/upload?apikey=${dana}`,
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
      throw new Error(`Gagal mengunggah file. Respons API tidak valid: ${JSON.stringify(result)}`);
    }
    const link = result.url;
    m.reply(link);

  } catch (error) {
    let errorMessage = error.message;
    if (error.response) {
      errorMessage = `Server merespons dengan status ${error.response.status}. Data: ${JSON.stringify(error.response.data)}`;
    }
    console.error('Error pada command tourl:', error);
    m.reply(`Terjadi kesalahan: ${errorMessage}`);
  }
};

handler.help = ['tourl <reply media>'];
handler.tags = ['tools'];
handler.command = /^(upload|tourl)$/i;

module.exports = handler;