var fetch = require('node-fetch');

var handler = async (m, { text, usedPrefix, command}) => {

if (!text) throw `kenapa syngg panggil" ripki?`

  var js = await fetch(`https://aemt.me/simi?text=${text}`)

var json = await js.json()

try {

  await m.reply(json.result)

} catch (e) {

  console.log(e)

  m.reply(`${e}`)

}}

handler.help = ['Ripki <text>']
handler.tags = ['main']
handler.customPrefix = /^(iki)$/i 
handler.command = new RegExp

module.exports = handler