const axios = require('axios');
const FormData = require('form-data');
const { fromBuffer } = require('file-type');
const { promisify } = require('util');

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) {
    throw `Format salah!\n\nContoh penggunaan:\n*${usedPrefix + command} top | Nama Lagu | Nama Artis | 3:45 | 1:20*\n\n_(Jangan lupa sambil reply/balas gambar untuk covernya)_`;
  }

  let [top, judul, artis, durasi, WaktuSekarang] = text.split('|').map(v => v.trim());
  if (!top || !judul || !artis || !durasi || !WaktuSekarang) {
    throw `Argumen tidak lengkap!\nPastikan ada pemisah garis vertikal (|).\nContoh: ${usedPrefix + command} C.H.R.I.S.Y.E | Diskoria | 3:45 | 1:20`;
  }

  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || '';
  if (!mime || !mime.includes('image')) {
    throw 'Tidak ada gambar yang ditemukan. Balas gambar yang ingin dijadikan cover.';
  }
  
  m.reply('Sedang memproses cover Spotify...');

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

    const uploadResponse = await axios.post(
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

    const result = uploadResponse.data;
    if (!result || !result.url) {
      throw new Error(`Gagal mengunggah file. Respons API: ${JSON.stringify(result)}`);
    }
    const imageUrl = result.url; 
    const jsonBody = {
      img: imageUrl 
    };

    const makerResponse = await axios.post(
      'https://api.danafxc.my.id/api/proxy/maker/spotify-player',
      jsonBody,
      {
        params: {
          apikey: dana,
          top: top,
          judul: judul,
          artis: artis,
          durasi: durasi,
          WaktuSekarang: WaktuSekarang
        },
        responseType: 'arraybuffer' 
      }
    );

    await conn.sendMessage(
      m.chat, 
      { 
        image: Buffer.from(makerResponse.data), 
        caption: `Berhasil membuat Spotify Player:\n🎶 ${judul} - ${artis}` 
      }, 
      { quoted: m }
    );

  } catch (error) {
    let errorMessage = error.message;
    if (error.response) {
      if (error.response.data instanceof Buffer) {
        errorMessage = `Server status ${error.response.status}: ${error.response.data.toString()}`;
      } else {
        errorMessage = `Server status ${error.response.status}: ${JSON.stringify(error.response.data)}`;
      }
    }
    console.error('Error pada command spotify-player:', error);
    m.reply(`Terjadi kesalahan: ${errorMessage}`);
  }
};

handler.help = ['spotifyplayer <reply gambar>'];
handler.tags = ['maker'];
handler.command = /^(spotifyplayer|spotifymaker)$/i;

module.exports = handler;