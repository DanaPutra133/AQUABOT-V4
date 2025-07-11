let timeout = 100000
let poin = 10000
let src
const fs = require('fs');
let handler = async (m, { conn, usedPrefix }) => {
  conn.tebaktokoh = conn.tebaktokoh ? conn.tebaktokoh : {}
  let id = m.chat
  if (id in conn.tebaktokoh) {
    conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebaktokoh[id][0])
    throw false
  }
  let src = JSON.parse(fs.readFileSync('./lib/json/tebaknamatokoh.json', 'utf-8'));
  let json = src[Math.floor(Math.random() * src.length)]
  if (!json) throw "Terjadi kesalahan, ulangi lagi perintah!"
  let caption = `
≡ _GAME TEBAK TOKOH_ ≡ 
${json.soal}

┌─⊷ *SOAL*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}tbok untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────

    `.trim()
  conn.tebaktokoh[id] = [
    await conn.sendMessage(m.chat, { image: { url: json.img }, caption: caption}, { quoted: m }),
    json, poin,
    setTimeout(() => {
      if (conn.tebaktokoh[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebaktokoh[id][0])
      delete conn.tebaktokoh[id]
    }, timeout)
  ]
}

handler.help = ['tebaktokoh']
handler.tags = ['game']
handler.command = /^tebaktokoh/i
handler.limit = false
handler.group = true

module.exports = handler