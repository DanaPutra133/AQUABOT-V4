 let handler = m => m

handler.before = async function (m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys || m.fromMe || !m.isGroup) return true``
  let chat = global.db.data.chats[m.chat] 
  const isChLink = /https?:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]+/gi.test(m.text)

  if (chat.antilinkch && isChLink) {
    if (isAdmin) return m.reply('*Eh sorry admin, kamu mah bebas kirim link.*')
    if (!isBotAdmin) return m.reply('*Bot harus jadi admin supaya bisa hapus link ini!*')
    await conn.sendMessage(m.chat, { delete: m.key })
    
  }
  
  return true
}

module.exports = handler 
