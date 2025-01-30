
let handler = async (m, { conn, args, usedPrefix, command }) => {
    if (!args[0] || isNaN(args[0])) throw `✳️ Masukkan angka yang menunjukkan jumlah hari!\n\n📌 Contoh :\n*${usedPrefix + command}* 30`

    let who
    if (m.isGroup) who = args[1] ? args[1] : m.chat
    else who = args[1]

    var nDays = 86400000 * args[0]
    var now = new Date() * 1
    if (now < global.db.data.chats[who].expired) global.db.data.chats[who].expired += nDays
    else global.db.data.chats[who].expired = now + nDays
    let teks = `✅ Menetapkan batas waktu untuk \n*${await conn.getName(who)}* \n\n*Selama:* ${args[0]} Hari\n\n*Hitung mundur :* ${msToDate(global.db.data.chats[who].expired - now)}`
    conn.reply(m.chat, teks, m)
}
handler.help = ['expired <días>']
handler.tags = ['owner']
handler.command = /^(expired|addexpired|addexp)$/i
handler.rowner = true
module.exports = handler

function msToDate(ms) {
  let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
  let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
  let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
  let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
  return [d, ' *Días*\n ', h, ' *Horas*\n ', m, ' *Minutos*\n ', s, ' *Segundos* '].map(v => v.toString().padStart(2, 0)).join('')
}