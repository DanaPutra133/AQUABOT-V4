// let pajak = 0.02
let handler = async (m, { conn, text, usedPrefix, command }) => {
let dapat = (Math.floor(Math.random() * 100000))
let healtu = (Math.floor(Math.random() * 100))
let nomors = m.sender
  let who
  if (m.isGroup) who = m.mentionedJid[0]
  else who = m.chat
  if (!who) return conn.reply(m.chat, 'Tag salah satu lah', m)
  if (typeof db.data.users[who] == 'undefined') throw 'Pengguna tidak ada didalam data base'
  let __timers = (new Date - global.db.data.users[m.sender].lastbunuhi)
  let _timers = (3600000 - __timers) 
  let timers = clockString(_timers)
  let users = global.db.data.users
  if (new Date - global.db.data.users[m.sender].lastbunuhi > 3600000){
   if (10 > users[who].healt) throw 'Target sudah tidak memiliki healt'
   if (100 > users[who].money) throw 'Target tidak memiliki apapun :('
  users[who].healt -= healtu * 1
  users[who].money -= dapat * 1
  users[m.sender].money += dapat * 1
  global.db.data.users[m.sender].lastbunuhi = new Date * 1
  conn.reply(m.chat, `Target berhasil di bunuh dan kamu mengambil money target sebesar\n${dapat} Money\nDarah target berkurang -${healtu} Healt`, m)
}else conn.reply(m.chat, `Anda sudah membunuh orang dan berhasil sembunyi , tunggu ${timers} untuk membunuhnya lagi`, m)
}

handler.help = ['membunuh *@user*']
handler.tags = ['rpg']
handler.command = /^membunuh$/
handler.limit = true
handler.group = true
handler.rpg = true
module.exports = handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}
function clockString(ms) {
  let h = Math.floor(ms / 3600000)
  let m = Math.floor(ms / 60000) % 60
  let s = Math.floor(ms / 1000) % 60
  console.log({ms,h,m,s})
  return [h, m, s].map(v => v.toString().padStart(2, 0) ).join(':')
}