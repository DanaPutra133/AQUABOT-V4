var fetch = require('node-fetch');
var handler = async (m, {
 text, 
 usedPrefix, 
 command
 }) => {
if (!text) throw `Masukkan pertanyaan!\n\n*Contoh:* Siapa presiden Indonesia? `
try {
  await m.reply(wait)
  var apii = await fetch(`https://api.betabotz.eu.org/api/search/bard-ai?apikey=${lann}&text=${text}`)
  var res = await apii.json()
  await m.reply(res.message)
} catch (err) {
  console.error('API pertama gagal:', err)
  try {
    var apii = await fetch(`https://api.botcahx.eu.org/api/search/bard-ai?apikey=${btc}&text=${text}`)
    var res = await apii.json()
    await m.reply(res.message)
  } catch (err) {
    console.error('API kedua gagal:', err)
    m.reply('Maaf, fitur error. Silakan gunakan fitur .lapor untuk melaporkan masalah ini.')
  }
}
}
handler.command = handler.help = ['bard','bardai'];
handler.tags = ['tools'];
handler.premium = false
module.exports = handler;
