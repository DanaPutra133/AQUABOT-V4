const fetch = require('node-fetch');
const uploader = require('../lib/uploadImage');

let handler = async (m, { conn, text, command, usedPrefix }) => {
  if (!text) throw `Reply image with text\nExample: ${usedPrefix + command} what is this?`;
  
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || q.mediaType || '';
  let media, urlAPI;
  
  await m.reply(wait);
  
  try {
    let buffer = await q.download();
    media = await uploader(buffer);
    urlAPI = `https://api.betabotz.eu.org/api/search/bard-img?url=${media}&text=${text}&apikey=${lann}`;

    let json = await (await fetch(urlAPI)).json();
    if (json.status && json.result) {
      conn.sendMessage(m.chat, { text: json.result }, { quoted: m });
    } else {
      throw 'Failed to get response from Bard';
    }
    
  } catch (err) {
    console.error('API pertama gagal:', err);
    try {
      let buffer = await q.download();
      media = await uploader(buffer);
      urlAPI = `https://api.botcahx.eu.org/api/search/bard-img?url=${media}&text=${text}&apikey=${btc}`;

      let json = await (await fetch(urlAPI)).json();
      if (json.status && json.result) {
        conn.sendMessage(m.chat, { text: json.result }, { quoted: m });
      } else {
        throw 'Failed to get response from Bard';
      }
    } catch (err) {
      console.error('API kedua gagal:', err);
      m.reply('Maaf, fitur error. Silakan gunakan fitur .lapor untuk melaporkan masalah ini.');
    }
  }
}

handler.help = ['bardimg', 'bardimage'];
handler.tags = ['tools'];
handler.command = /^(bardimg|bardimage)$/i;
handler.limit = true;

module.exports = handler;
