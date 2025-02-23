var fetch = require('node-fetch');
var handler = async (m, {
 text, 
 usedPrefix, 
 command
 }) => {
if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* buatkan saya code express.js`
try {
  await m.reply(wait)
  var apii = await fetch(`https://api.betabotz.eu.org/api/search/blackbox-chat?text=${text}&apikey=${lann}`)
  var res = await apii.json()
  if (!res.status) throw new Error('Invalid API Key');
  await m.reply(res.message)
} catch (err) {
  console.error('API pertama gagal:', err)
  try {
    var apii = await fetch(`https://api.botcahx.eu.org/api/search/blackbox-chat?text=${text}&apikey=${btc}`)
    var res = await apii.json()
    if (!res.status) throw new Error('Invalid API Key');
    await m.reply(res.message)
  } catch (err) {
    console.error('API kedua gagal:', err)
    m.reply('Maaf, fitur error. Silakan gunakan fitur .lapor untuk melaporkan masalah ini.')
  }
}
}
handler.command = handler.help = ['blackbox','blackboxai','aicoding'];
handler.tags = ['tools'];
handler.premium = false
module.exports = handler;
