let handler = m => m

let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
handler.before = async function (m, { user, isBotAdmin, isAdmin }) {
  if ((m.isBaileys && m.fromMe) || m.fromMe || !m.isGroup) return true
  let chat = global.db.data.chats[m.chat]
  let isGroupLink = linkRegex.exec(m.text)

  if (chat.antiLink && isGroupLink) {
    await m.reply(`*「 ANTI LINK 」*\n\nDetected *${await conn.getName(m.sender)}* you have sent the group link!\n\nSorry you will be kicked from this group byee!`)
    if (isAdmin) return m.reply('*Eh sorry you admins, you will not be kicked. hehe..*')
    if (!isBotAdmin) return m.reply('*Bots are not admins, how can they kick people _-*')
    let linkGC = ('https://chat.whatsapp.com/' + await conn.groupInviteCode(m.chat))
    let isLinkconnGc = new RegExp(linkGC, 'i')
    let isgclink = isLinkconnGc.test(m.text)
    if (isgclink) return m.reply('*「 ANTI LINK 」*\n\nOrder denied, bot will not kick you.\nBecause the group link itself')
    await conn.sendMessage(m.chat, { delete: m.key })
    await conn.groupParticipantsUpdate(m.chat, [m.sender], "remove")
  }
  return true
}

module.exports = handler


// di bawah kode jika user send link grub lain maka pesan nya akan di hapus
/*

let handler = m => m

let linkRegex = /chat.whatsapp.com\/([0-9A-Za-z]{20,24})/i
handler.before = async function (m, { user, isBotAdmin, isAdmin }) {
  if ((m.isBaileys && m.fromMe) || m.fromMe || !m.isGroup) return true
  let chat = global.db.data.chats[m.chat]
  let isGroupLink = linkRegex.exec(m.text)

  if (chat.antiLink && isGroupLink) {
    await m.reply(`*「 ANTI LINK 」*\n\nDetected *${await conn.getName(m.sender)}* kamu terdeteksi mengirim link grub lain! Pesan akan dihapus.`)
    try {
      let res = m.message.extendedTextMessage?.contextInfo;
      let deleteMsg = { delete: { remoteJid: m.chat, fromMe: false } };
      if (res && res.participant) {
        deleteMsg.delete.id = res.stanzaId;
        deleteMsg.delete.participant = res.participant;
      } else if (res && res.stanzaId) {
        deleteMsg.delete.id = res.stanzaId;
      } else {
        deleteMsg.delete.id = m.key.id;
        deleteMsg.delete.participant = m.key.participant || m.sender;
      }
      await conn.sendMessage(m.chat, deleteMsg);
    } catch {
      await conn.sendMessage(m.chat, { delete: m.key });
    }
  }
  return true
}

module.exports = handler

*/