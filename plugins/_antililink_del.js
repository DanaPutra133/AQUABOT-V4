/* let handler = m => m

handler.before = async function (m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys || m.fromMe || !m.isGroup) return true``
  let chat = global.db.data.chats[m.chat] 
  const isGroupLink = /(chat.whatsapp.com\/([0-9A-Za-z]{20,24}))/i.test(m.text)

  if (chat.antiLink && isGroupLink) {
    if (isAdmin) return m.reply('*Eh sorry admin, kamu mah bebas kirim link.*')
    if (!isBotAdmin) return m.reply('*Bot harus jadi admin supaya bisa hapus link ini!*')
    await conn.sendMessage(m.chat, { delete: m.key })
    
  }
  
  return true
}

module.exports = handler */
