let handler = async (m, { conn }) => {
let ye = `@${m.sender.split`@`[0]}`
let esce = `
Hai ${ye} Bot Ini Menggunakan Script :\n• https://github.com/ERLANRAHMAT/BETABOTZ-MD2 \ndan customasi dari\n https://github.com/DanaPutra133/Aquabot-V3 
\n jangan lupa di follow dan Bintang nya! :)`
m.reply(esce)
}
handler.help = ['sc', 'sourcecode']
handler.tags = ['info']
handler.command = /^(sc|sourcecode)$/i
handler.group = true

module.exports = handler