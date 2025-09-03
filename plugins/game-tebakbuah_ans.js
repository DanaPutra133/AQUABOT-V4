let poin = 10000

const threshold = 0.72
let handler = m => m
handler.before = async function (m) {
  let id = m.chat
  let users = global.db.data.users[m.sender]
  if (!m.quoted || !m.quoted.fromMe || !m.quoted.isBaileys || !/Ketik .tbau/i.test(m.quoted.text)) return !0
  this.tebakbuah = this.tebakbuah ? this.tebakbuah : {}
  if (!(id in this.tebakbuah)) return m.reply('Soal itu telah berakhir')
  if (m.quoted.id == this.tebakbuah[id][0].id) {
    let json = JSON.parse(JSON.stringify(this.tebakbuah[id][1]))
    if (m.text.toLowerCase() == json.jawaban.toLowerCase().trim()) {
      global.db.data.users[m.sender].exp += this.tebakbuah[id][2]
      global.db.data.users[m.sender].tiketcoin += 1
      users.money += poin
      m.reply(`*Benar!*\n+${this.tebakbuah[id][2]} money`)
      clearTimeout(this.tebakbuah[id][3])
      delete this.tebakbuah[id]
    } else if ((m.text.toLowerCase(), json.jawaban.toLowerCase().trim()) >= threshold) m.reply(`*Dikit Lagi!*`)
    else m.reply(`*Salah!*`)
  }
  return !0
}
handler.exp = 0

module.exports = handler