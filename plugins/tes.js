let handler = async (m, { conn, args, command }) => {
    conn.reply(m.chat, `masuk bang, lelet ya? yhahahahha :b`,m)
        }
handler.help = ['tes']
handler.tags = ['main']
handler.customPrefix = /^(tes)$/i 
handler.command = new RegExp
handler.limit = false
handler.group = true


module.exports = handler