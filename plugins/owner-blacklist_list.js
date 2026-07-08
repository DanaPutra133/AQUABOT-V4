let handler = async (m, { conn }) => {
  if (!global.db.data.globalBlacklist) global.db.data.globalBlacklist = [];
  let globalBlacklist = global.db.data.globalBlacklist;

  if (globalBlacklist.length === 0)
    return m.reply("Daftar *Blacklist Global* saat ini masih kosong.");

  let txt = `*「 Daftar Nomor Blacklist Global 」*\n\n*Total:* ${globalBlacklist.length}\n\n┌─[ *Blacklist* ]\n`;
  for (let id of globalBlacklist) {
    txt += `├ @${id.split("@")[0]}\n`;
  }
  txt += "└─•";

  return conn.reply(m.chat, txt, m, {
    contextInfo: { mentionedJid: globalBlacklist },
  });
};

handler.help = ["listblacklist", "listbl"];
handler.tags = ["owner"];
handler.command = /^(listblacklist|listbl)$/i;
handler.owner = true;

module.exports = handler;
