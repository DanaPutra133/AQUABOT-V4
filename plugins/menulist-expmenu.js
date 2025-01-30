let handler = async (m, { conn }) => {
let ye = `@${m.sender.split`@`[0]}`
let esce = `┌  ◦ *MENU EXP*
│  ◦ .topglobal
│  ◦ .toplocal
│  ◦ .addlimit @user <jumlah limit>
│  ◦ .ngechit
│  ◦ .levelup
│  ◦ .limit [@user]
│  ◦ .daftar <nama>.<umur>
│  ◦ .reg <nama>.<umur>
│  ◦ .register <nama>.<umur>
└  
`
m.reply(esce)
}
handler.command = /^(expmenu)$/i
handler.group = true

module.exports = handler