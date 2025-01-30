const uploadFile = require('../lib/uploadFile')
const uploadImage = require('../lib/uploadImage')

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!m.quoted)
    throw `*• Example :* ${usedPrefix + command} *[reply sticker]*`;
  if (!text) throw `*• Example :* ${usedPrefix + command} *[name command]*`;
  let q = m.quoted ? m.quoted : m
  let media = await q.download()
    try {
    let isTele = /image\/(png|webp|jpe?g|gif)|video\/mp4/.test(mime)
    let link = await (isTele ? uploadImage : uploadFile)(media)
    let hash = m.quoted.fileSha256.toString("base64");
    db.data.sticker[hash] = {
      message: text,
      creator: m.name,
      jid: m.sender,
      url:.link,
    };
    await conn.sendMessage(
      m.chat,
      { text: "*[ SUCESS ADD COMMAND TO STICKER ]*", edit: key },
      { quoted: m },
    );
  } catch (e) {
    m.reply(e);
  }
};
handler.help = ["setcmd"].map((a) => a + " *[premium only]*");
handler.tags = ["premium"];
handler.command = ["setcmd"];
handler.premium = true;

module.exports = handler;