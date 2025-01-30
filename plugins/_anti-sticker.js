exports.before = async function(m, { isAdmin, isBotAdmin }) {
  if (m.isBaileys || !(m.mtype === "stickerMessage") || !global.db.data.chats[m.chat]?.antiSticker) return;

//   const user = global.db.data.users[m.sender];

  if (isAdmin || isBotAdmin) {
    const deleteMessage = { delete: { remoteJid: m.key.remoteJid, fromMe: true, id: m.key.id, participant: [m.sender] } };

    await this.sendMessage(m.chat, deleteMessage);
  } else {
    const kick = { kick: { jid: m.sender, reason: "Mengirim stiker yang tidak diizinkan" } };
    await this.groupSettingChange(m.chat, kick);
  }
};
