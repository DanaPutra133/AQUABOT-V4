let handler = async (m, { conn }) => {
let ye = `@${m.sender.split`@`[0]}`		
let text = `Hallo *${m.name}*👋

Berikut adalah beberapa rules *Killua Fourteen*

• owner berkuasa *(sudah pasti)*.
• jangan spam dalam bentuk apapun
• jangan call/vc bot *(otomatis block)*.
• jika bot tidak respon tapi online berarti delay, tunggu hingga pulin dan jangan spam command.
• jika bot tidak online berarti maintenance/kena ban oleh pihak whatsapp. 
• menemukan error/bug? silakan ketik *.report* atau hub .owner 
• privasi anonymous/menfess 100% aman karna owner jarang buka wa bot. 
• ingin masukan bot ke group kamu? silakan ketik *.sewa* atau bisa hub owner. 
• spam command (terutama rpg) akan diban dari bot. 
• spam call akan di block + ban dari bot. 

sekian. 

[ Note ] 
"udah dewasa kan? punya otak kan? punya pikiran kan? jadi bisa dong bedain mana perbuatan yang salah dan mana perbuatan yang benar. ya intinya saling menghargai aja lah ya, sekian."

-base menu by AdrianMD`

conn.relayMessage(m.chat, {
extendedTextMessage:{
                text: text, 
                contextInfo: {
                     externalAdReply: {
                        title: `R U L E S   B O T`,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true, 
                        thumbnailUrl: 'https://telegra.ph/file/382274438ef24a3dc0731.png',
                        sourceUrl: 'https://whatsapp.com/channel/0029VaApYsQ5Ui2c2rKbpP0S'
                    }
                }, mentions: [m.sender]
}}, {})
}
handler.help = ['rules']
handler.tags = ['info']
handler.command = /^(rules|peraturan)$/i

module.exports = handler