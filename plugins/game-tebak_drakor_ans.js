let poin = 10000

const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
  let id = m.chat
  let users = global.db.data.users[m.sender]
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/Ketik .tdkt/i.test(m.quoted.text)) return !0
  this.tebakdrakor = this.tebakdrakor ? this.tebakdrakor : {}
  if (!(id in this.tebakdrakor)) return m.reply('Soal itu telah berakhir')
  if (m.quoted.id == this.tebakdrakor[id][0].id) {
    let json = JSON.parse(JSON.stringify(this.tebakdrakor[id][1]))
    if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
      global.db.data.users[m.sender].exp += this.tebakdrakor[id][2]
      global.db.data.users[m.sender].tiketcoin += 1
      users.money += poin
      m.reply(`*Benar!*\n+${this.tebakdrakor[id][2]} money`)
      clearTimeout(this.tebakdrakor[id][3])
      delete this.tebakdrakor[id]
    } else if ((m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
    else m.reply(`*Salah!*`)
  }
  return !0
}
handler.exp = 0

module.exports = handler