let handler = m => m

handler.before = async (m, { conn, isBotAdmin, isAdmin }) => {
    if(!m.isGroup) return
    let chat = global.db.data.chats[m.chat]
    if (chat.antitagsw) {
    const isTaggingInStatus = (
        m.mtype === 'groupStatusMentionMessage' || 
        (m.quoted && m.quoted.mtype === 'groupStatusMentionMessage') ||
        (m.message && m.message.groupStatusMentionMessage) ||
        (m.message && m.message.protocolMessage && m.message.protocolMessage.type === 25)
    )
    
    if (!isTaggingInStatus) return
    
    await conn.sendMessage(m.chat, { delete: m.key })
    }
}

module.exports = handler