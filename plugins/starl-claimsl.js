const timeout = 86400000

let handler = async (m, { conn, usedPrefix: _p, args, command }) => {

    let user = global.db.data.users[m.sender]
    let time = global.db.data.users[m.sender].starlightcd + 86400000
    if(user.totalpoin > 29) {
      user.starlightTime = 0
      let msg = `kamu menyelesaikan starlight!\n\nharap beli starlight kembali`
    conn.reply(m.chat, msg, m)
      return
    }
    if (user.starlightTime == 0) throw 'Kamu belum mengaktifkan starlight' 
    if (new Date - global.db.data.users[m.sender].starlightcd< 86400000) throw `kamu sudah claim hari ini\n\ntunggu selama *${msToTime(time - new Date())}* untuk claim lagi`
    
let tex = `> berhasil claim

- +500 saldo
- +1 poin`
m.reply(tex)

user.saldo += 500
user.hasilnya += 500
user.totalpoin += 1
user.starlightcd = new Date * 1

setTimeout(() => {
conn.reply(m.chat, `Waktunya claim starlight`, m)
}, 86400000)
}
handler.command = /^(claimsl)$/i

module.exports = handler

function msToTime(duration) {
  var milliseconds = parseInt((duration % 1000) / 100),
    seconds = Math.floor((duration / 1000) % 60),
    minutes = Math.floor((duration / (1000 * 60)) % 60),
    hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
    
  
  hours = (hours < 10) ? "0" + hours : hours
  minutes = (minutes < 10) ? "0" + minutes : minutes
  seconds = (seconds < 10) ? "0" + seconds : seconds

  return hours + " jam " + minutes + " menit " + seconds + " detik"
}