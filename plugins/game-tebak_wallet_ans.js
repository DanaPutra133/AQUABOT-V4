let poin = 10000

const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
  let id = m.chat
  let users = global.db.data.users[m.sender]
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/Ketik.*twa/i.test(m.quoted.text)) return !0
  this.tebakwallet = this.tebakwallet ? this.tebakwallet : {}
  if (!(id in this.tebakwallet)) return m.reply('Soal itu telah berakhir')
  if (m.quoted.id == this.tebakwallet[id][0].id) {
    let json = JSON.parse(JSON.stringify(this.tebakwallet[id][1]))
    if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
      global.db.data.users[m.sender].exp += this.tebakwallet[id][2]
      global.db.data.users[m.sender].tiketcoin += 1
      users.money += poin
      m.reply(`*Benar!*\n+${this.tebakwallet[id][2]} money`)
      clearTimeout(this.tebakwallet[id][3])
      delete this.tebakwallet[id]
    } else if ((m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
    else m.reply(`*Salah!*`)
  }
  return !0
}
handler.exp = 0

module.exports = handler
