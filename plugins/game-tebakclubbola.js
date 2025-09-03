let timeout = 100000
let poin = 10000

let handler = async (m, { conn, usedPrefix }) => {
  conn.tebakclub = conn.tebakclub ? conn.tebakclub : {}
  let id = m.chat
  if (id in conn.tebakclub) {
    conn.reply(m.chat, 'Masih ada soal belum terjawab di chat ini', conn.tebakclub[id][0])
    throw false
  }

  let json
  try {
    json = await (await fetch(`https://api.danafxc.my.id/api/proxy/games/tebakclubbola?apikey=${dana}`)).json()
  } catch (e) {
    console.error(e)
    throw "Gagal mengambil data dari API, coba lagi nanti."
  }

  // Pastikan API memberikan hasil yang valid
  if (!json || !json.logo || !json.jawaban) throw "Terjadi kesalahan, API tidak memberikan data yang valid!"

  let caption = `
≡ _GAME TEBAK CLUB BOLA

┌─⊷ *SOAL*
▢ Deskripsi Club: *${json.deskripsi}*
▢ Timeout *${(timeout / 1000).toFixed(2)} detik*
▢ Bonus: ${poin} money
▢ Ketik ${usedPrefix}tbcl untuk clue jawaban
▢ *REPLAY* pesan ini untuk\nmenjawab
└──────────────

    `.trim()
  conn.tebakclub[id] = [
    await conn.sendMessage(m.chat, { image: { url: json.logo }, caption: caption}, { quoted: m }),
    json, poin,
    setTimeout(() => {
      if (conn.tebakclub[id]) conn.reply(m.chat, `Waktu habis!\nJawabannya adalah *${json.jawaban}*`, conn.tebakclub[id][0])
      delete conn.tebakclub[id]
    }, timeout)
  ]
}

handler.help = ['tebakclub']
handler.tags = ['game']
handler.command = /^tebakclub/i
handler.limit = false
handler.group = true

module.exports = handler