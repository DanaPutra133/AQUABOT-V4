const uploadFile = require('../lib/uploadFile')
const axios = require('axios');
const FormData = require('form-data');
const { fromBuffer } = require('file-type');
const { promisify } = require('util');
let fetch = require("node-fetch")

let handler = async (m, { conn, text, usedPrefix, command}) => {
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!text) throw `Example ${usedPrefix} ${command} lann`;
  if (/video/g.test(mime) && (q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!')
  await m.reply(wait)
      
  try {
    let img = await q.download()
    if (!img) throw `Balas gambar/video/stiker dengan perintah ${usedPrefix} ${command}`

    let fileSizeLimit = 5 * 1024 * 1024; 
    if (img.length > fileSizeLimit) {
      throw 'Ukuran media melebihi batas 5MB';
    }

    const { ext } = await fromBuffer(img) || {};
    const form = new FormData();
    form.append('image', img, {
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
    let media = result.url;
    if (q.isAnimated === true) {
      let res = await fetch(`https://api.betabotz.eu.org/api/tools/webp2mp4?url=${media}&apikey=${lann}`)
      let json = await res.json()
      if (!json.result) throw 'Gagal mengubah stiker animasi ke video.'

      await conn.sendVideoAsSticker(m.chat, json.result, m, {
        packname: text || '',
        author: ''
      })
    } else {
      await conn.sendImageAsSticker(m.chat, img, m, {
        packname: text || '',
        author: ''
      })
    }
  } catch (e) {
    console.log(e)
    throw `Gagal! Balas gambar/video dengan caption *${usedPrefix} ${command}*`
  }
}

handler.help = ["wm"];
handler.tags = ["tools"];
handler.command = /^wm$/i;
module.exports = handler;