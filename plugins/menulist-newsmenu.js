let handler = async (m, { conn }) => {
let ye = `@${m.sender.split`@`[0]}`
let esce = `┌  ◦ *news*
│  ◦ .cnbc
│  ◦ .cnn
│  ◦ .daily
│  ◦ .detik
│  ◦ .Indozone
│  ◦ .Inews
│  ◦ .Koranfajar
└
`
m.reply(esce)
}
handler.command = /^(newsmenu)$/i
handler.group = true

module.exports = handler