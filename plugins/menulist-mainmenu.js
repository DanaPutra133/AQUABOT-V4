let handler = async (m, { conn }) => {
let ye = `@${m.sender.split`@`[0]}`
let esce = `┌  ◦ *MENU UTAMA*
│  ◦ .afk [alasan]
│  ◦ .allmenu
│  ◦ Ripki <text>
│  ◦ .checkapi
│  ◦ .api
│  ◦ .cekexpbtc
│  ◦ .cekexplann
│  ◦ .ceksn (Ⓛ)
│  ◦ .filebokep  (Ⓟ)
│  ◦ .gcbot
│  ◦ .report
│  ◦ .request
│  ◦ .rules
│  ◦ .donasi
│  ◦ .donate
│  ◦ .sewa
│  ◦ .sewabot
│  ◦ .belibot
│  ◦ .topglobal
│  ◦ .toplocal
│  ◦ .unreg <SERIAL NUMBER>
│  ◦ .menu
│  ◦ mode
└  
`
m.reply(esce)
}
handler.command = /^(mainmenu)$/i
handler.group = true

module.exports = handler