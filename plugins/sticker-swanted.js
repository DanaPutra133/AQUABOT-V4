let fetch = require("node-fetch");
let uploadImage = require("../lib/uploadImage.js");

let handler = async (m, { conn, usedPrefix, command, text }) => {
  let who =
    m.mentionedJid && m.mentionedJid[0]
      ? m.mentionedJid[0]
      : m.fromMe
        ? conn.user.jid
        : m.sender;
  let name = await conn.getName(who);
  let q = m.quoted ? m.quoted : m;
  let mime = (q.msg || q).mimetype || "";
  if (!mime) throw `*• Example :* ${usedPrefix + command} *send/reply foto*`;
  m.reply(wait);
  let media = await q.download();
  let url = await uploadImage(media);
  let hasil = await (
    await fetch(`https://widipe.com/wanted?url=${url}`)
  ).buffer();
  //await conn.sendFile(m.chat, hasil, "", 'done', m);
  await conn.sendImageAsSticker(m.chat, hasil, m, { packname: global.packname, author: global.author })
};
handler.help = ["swanted"];
handler.tags = ["sticker"];
handler.command = ["swanted"];
handler.limit = true;

module.exports = handler;