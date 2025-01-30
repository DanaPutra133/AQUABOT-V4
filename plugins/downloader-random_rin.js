let fetch = require('node-fetch');
let handler = async (m, { usedPrefix, command, conn, args }) => {
  if (!args[0]) throw `*🚩 Contoh:* ${usedPrefix}${command}(nama karakter)\ncontoh .anime kaori`;
  m.reply(wait)
  try {
    await conn.sendMessage(m.chat, {
      react: {
          text: '🥰',
          key: m.key,
      }
  })
    let response = await fetch(`https://api.betabotz.eu.org/api/search/pinterest?text1=${args[0]}&apikey=${lann}`);
    let data = await response.json();   
    let old = new Date()
    let limit = Math.min(5, data.result.length);
    for(let i = 1; i < limit; i++) { 
      await sleep(3000);
      conn.sendFile(m.chat, data.result[i], 'pin.jpg', `ini kak foto nya 😍` , m);
    }
  } catch (e) {
    console.log(e);
    m.reply('Maaf, foto anime tidak ditemukan');
    await conn.sendMessage(m.chat, {
      react: {
          text: '😞',
          key: m.key,
      }
  })
  }
}

handler.help = ['random anime2'];
handler.tags = ['internet', 'downloader'];
handler.command = /^(anime)$/i;
handler.group = false
handler.limit = 1


module.exports = handler;

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
