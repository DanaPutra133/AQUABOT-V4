// let fs = require('fs')
// let handler = async (m, { conn }) => {
// let teks = 'donasi'
// let dana = global.dana
// let pulsa = global.pulsa
// let gopay = global.gopay
// let numberowner = global.numberowner
// let anu = `Hai 👋
// Kalian bisa mendukung saya agar bot ini tetap up to date dengan:
// ┌〔 Donasi • Emoney 〕
// ├ Dana : 081289694906
// ├ gopay : 081289694906
// └────
// Berapapun donasi kalian akan sangat berarti 👍

// Terimakasih =D

// Contact person Owner:
// wa.me/${numberowner} (Owner)

// *Kirim bukti ke .owner nanti dapat hadiahxp + limit :)*`
//   m.reply(anu)
// }
// handler.help = handler.command = ['donasi','donate','sewa','sewabot','belibot']
// handler.tags = ['main']

// handler.group = false

// module.exports = handler


// let fs = require('fs')
// let handler = async (m, { conn }) => {

// let qris = global.qris
// let anu = 
// {qris}

// `Hai 👋
// Kalian bisa mendukung saya agar bot ini tetap up to date dengan:
// ┌〔 Donasi • Emoney 〕
// ├ Dana : 081289694906
// ├ gopay : 081289694906
// └────
// Berapapun donasi kalian akan sangat berarti 👍

// Terimakasih =D

// Contact person Owner:
// wa.me/${numberowner} (Owner)

// *Kirim bukti ke .owner nanti dapat hadiahxp + limit :)*`
//    conn.sendFile(m.chat, qris, anu, m)
// }
// handler.help = ['donasi', 'donate']
// handler.tags = ['xp', 'info']
// handler.command = /^(donasi|donate)$/i
// handler.group = true

// module.exports = handler

let fetch = require('node-fetch')
let numberowner = global.numberowner

let handler = async (m, { conn, command }) => {
    let buffer = await fetch(`https://uploader.danafxc.my.id/images/da172e75-95ef-470b-92e1-e9c8b106734b.jpeg`).then(res => res.buffer())
    conn.sendFile(m.chat, buffer, 'hasil.jpg', `*kamu bisa chat owner untuk konfirmasi/ bertanya seputar bot di nomor berikut: ${numberowner}.*
        
🌟 PRICE LIST BOT WHATSAPP 🌟
📲 Layanan profesional dengan update gratis, service 24/7, dan maintenance gratis

NOMOR DARI KAMU:
BENEFIT
✅ Custom nama bot
✅ Full custom 

💡 1. Paket 1 Bulan
💰 Harga:
	⁠Source Code dari saya: Rp5.000
✨ Fitur:
✅ Update Gratis
✅ Service 24/7
✅ Maintenance Gratis
✅ Custom fitur
✅ Store fitur  

💡 2. Paket 3 Bulan (+ Garansi 1 Bulan)
💰 Harga:
	⁠Source Code dari saya: Rp14.000
✨ Fitur:
✅ Update Gratis
✅ Service 24/7
✅ Maintenance Gratis
✅ Custom fitur 
✅ Store fitur 

💡 3. Paket 6 Bulan (+ Garansi 3 Bulan)
💰 Harga:
	⁠Source Code dari Saya: Rp50.000
✨ Fitur:
✅ Update Gratis
✅ Service 24/7
✅ Maintenance Gratis
✅ Custom fitur 
✅ Store fitur 
✅ Custom apikey API 

🛠 Siap melayani kebutuhan bot WhatsApp Anda!`, m)
}

handler.help = handler.command = ['sewa','sewabot','belibot']
handler.tags = ['main']
module.exports = handler