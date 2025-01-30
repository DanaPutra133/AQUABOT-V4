const { downloadContentFromMessage } = require('@adiwajshing/baileys')

let handler = async (m, { conn }) => {
  if (!m.quoted) throw 'Reply gambar viewonce untuk dijadikan sticker'
  if (m.quoted.mtype !== 'viewOnceMessageV2') throw 'Ini bukan pesan viewonce.'
  let msg = m.quoted.message
  let type = Object.keys(msg)[0]
  let media = await downloadContentFromMessage(msg[type], type == 'imageMessage' ? 'image' : 'video')
  let buffer = Buffer.from([])
  for await (const chunk of media) {
    buffer = Buffer.concat([buffer, chunk])
  }
  if (/image/.test(type)) {
    return await conn.sendImageAsSticker(m.chat, buffer, m, { packname: global.packname, author: global.author })
  }
}

handler.tags = ['sticker']
handler.help = handler.command = ['s2', 'svo', 'sviewonce']
handler.limit = true

module.exports = handler