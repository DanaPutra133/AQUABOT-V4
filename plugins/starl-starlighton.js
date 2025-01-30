let handler = async (m, { conn, usedPrefix: _p, args, command }) => {

    let user = global.db.data.users[m.sender]
    
    if(user.saldo < 9999) return m.reply(`untuk mengaktifkan starlight kamu membutuhkan 10k saldo`)
    
    user.saldo -= 10000
    user.pengeluaran += 10000
    user.starlightTime = 1
    user.lvlstarlight += 1
    user.totalpoin = 0
    user.hasilnya = 0

let tex = `
*starlight berhasil di aktifkan*

nama : ${user.name}
member starlight : ✅

ketik *.claimsl* 1× sehari selama 30 hari.
`
 
await conn.sendMessage(m.chat, {
  text: tex, 
  contextInfo: {
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: "120363248530706545@newsletter",
      serverMessageId: -1,
      newsletterName: "killua fourteen"
    }
  }
}, {
  quoted: m
})
}
handler.command = /^(starlighton)$/i

module.exports = handler