let fs = require('fs')
let handler = async (m, { conn }) => {
let numberowner = global.numberowner
let qris ='https://cdn.btch.bz/file/fd7714ee03f6970d8fb30.jpg'
let anu = 

`
≡ *DONASI*
Anda dapat menyumbang jika Anda ingin membantu menjaga bot tetap aktif

▢ *TERIMA KASIH*
• besar kecilnya donasi anda, saya sangat berterima kasih\n*Dapatkan DM dengan donasi!*
`
let img = qris
conn.sendFile(m.chat, img, 'img.jpg', anu, m)

}
handler.help = ['donasi', 'donate']
handler.tags = ['xp', 'info']
handler.command = /^(donasi|donate)$/i
handler.group = false

module.exports = handler


// let handler = async(m, { conn, usedPrefix, command }) => {

//   let don = `
// ≡ *DONASI*
// Anda dapat menyumbang jika Anda ingin membantu menjaga bot tetap aktif

// ▢ *TERIMA KASIH*
// • besar kecilnya donasi anda, saya sangat berterima kasih\n*Dapatkan DM dengan donasi!*
// `
// let img = qris
// conn.sendFile(m.chat, img, 'img.jpg', don, m)

// }
// handler.help = ['donate']
// handler.tags = ['main']
// handler.command = /^(donasi|donate)$/i

// export default handler