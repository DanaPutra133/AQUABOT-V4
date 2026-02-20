let { sticker5 } = require("../lib/sticker");
let fs = require("fs");
let fetch = require("node-fetch");
const axios = require("axios");

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
  const packname = global.packname;
  const author = global.author;

  text = text
    ? text
    : m.quoted && m.quoted.text
    ? m.quoted.text
    : m.quoted && m.quoted.caption
    ? m.quoted.caption
    : m.quoted && m.quoted.description
    ? m.quoted.description
    : "";
  if (!text) throw `Example : ${usedPrefix + command} Lagi Ruwet`;

  let res;
  var error = fs.readFileSync(`./media/sticker/emror.webp`);
  try {
    if (!text) throw "Teksnya mana? Contoh: .brat ini teksnya";

    const apiUrl = `https://api.danafxc.my.id/api/proxy/maker/brat?apikey=${dana}&text=${encodeURIComponent(
      text.substring(0, 151)
    )}`;

    const response = await axios.post(apiUrl, null, {
      responseType: "arraybuffer",
    });
    const imageBuffer = response.data;

    let stiker = await sticker5(
      imageBuffer,
      null,
      global.packname,
      global.author,
      ["🎨"]
    );

    if (stiker) {
      await conn.sendFile(m.chat, stiker, "sticker.webp", "", m);
    } else {
      throw "Gagal membuat stiker dari gambar yang diterima.";
    }
  } catch (error) {
    console.error("Error pada command brat:", error);
    m.reply("Terjadi kesalahan, silakan coba lagi nanti.");
  };

  };    
handler.command = handler.help = ["brat"];
handler.tags = ["sticker"];
handler.limit = true;
handler.group = false;

module.exports = handler;
