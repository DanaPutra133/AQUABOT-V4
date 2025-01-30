var fetch = require('node-fetch');

let handler = async (m, { conn, text }) => {
    conn.simi2 = conn.simi2 ? conn.simi2 : {};

    if (!text) throw `*• Example:* .simi2 *[on/off]*`;

    if (text === "on") {
        conn.simi2[m.sender] = {
            pesan: []
        };
        m.reply("[ ✓ ] Success create session chat");
    } else if (text === "off") {
        delete conn.simi2[m.sender];
        m.reply("[ ✓ ] Success delete session chat");
    }
};

handler.before = async (m, { conn }) => {
  conn.simi2 = conn.simi2 ? conn.simi2 : {};
  if (m.isBaileys && m.fromMe) return;
  if (!m.text) return;
  if (!conn.simi2[m.sender]) return;

  if (
    m.text.startsWith(".") ||
    m.text.startsWith("#") ||
    m.text.startsWith("!") ||
    m.text.startsWith("/") ||
    m.text.startsWith("\\/")
  ) return;

  if (conn.simi2[m.sender] && m.text) {
    let name = conn.getName(m.sender);
    try {
    let res = await fetch(`https://api.betabotz.eu.org/api/search/simisimi?query=${m.text}&apikey=${lann}`)
    let json = await res.json()
    let data = json.result
      // Send the chatCompletion response
      conn.sendMessage(m.chat, {
        text: "⬣───「 *PLANA* 」───⬣" + "\n\n" + data,
        contextInfo: {
          externalAdReply: {  
            // title di bagian gambar
            title: "Plana-Blue Archive",
            body: '',
            // gambar karakter kalian
            thumbnailUrl:`https://btch.pages.dev/file/abbff76a98455a64d3a07.jpg`,
            sourceUrl: null,
            mediaType: 1,
            renderLargerThumbnail: true
          },
        },
      }, { quoted: m });
    } catch (e) {
      console.log(e);
      throw "error";
    }
  }
};

handler.command = ['simi2'];
handler.tags = ["ai"];
handler.help = ['simi2'].map(a => a + " *[on/off]*");

module.exports = handler