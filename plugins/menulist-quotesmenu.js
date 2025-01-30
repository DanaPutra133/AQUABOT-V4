let handler = async (m, { conn }) => {
let ye = `@${m.sender.split`@`[0]}`
let esce = `┌  ◦ *MENU QUOTES*
│  ◦ .galau
│  ◦ .anime
│  ◦ .bacot
│  ◦ .katabijak
│  ◦ .motivasi
│  ◦ .bucin
│  ◦ .katailham
│  ◦ .katadilan
│  ◦ .fiersa
│  ◦ .fakta
│  ◦ .nyindir
│  ◦ .ngawur
│  ◦ .jawa
│  ◦ .quotes
└
`
m.reply(esce)
}
handler.command = /^(quotesmenu)$/i
handler.group = true

module.exports = handler