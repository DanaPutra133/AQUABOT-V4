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

  var error = fs.readFileSync(`./media/sticker/emror.webp`);

  try {
    let imageBuffer;
    try {
      const apiUrl = `https://api.danafxc.my.id/api/proxy/maker/brat?apikey=${dana}&text=${encodeURIComponent(
        text.substring(0, 151)
      )}`;

      const response = await axios.post(apiUrl, null, {
        responseType: "arraybuffer",
      });

      imageBuffer = response.data;
    } catch (e) {
      console.log("API utama gagal, memakai fallback...");
      const res = `https://api.betabotz.eu.org/api/maker/brat?text=${encodeURIComponent(
        text.substring(0, 151)
      )}&apikey=${lann}`;

      const fetchResult = await fetch(res);

      if (!fetchResult.ok) {
        throw new Error("Fallback API gagal");
      }

      imageBuffer = await fetchResult.buffer();
    }
    let stiker = await sticker5(
      imageBuffer,
      null,
      packname,
      author,
      ["🎨"]
    );
    if (stiker) {
      await conn.sendFile(m.chat, stiker, "sticker.webp", "", m);
    } else {
      throw new Error("Pembuatan stiker gagal");
    }
  } catch (err) {
    console.error("Error pada command brat:", err);
    m.reply("Terjadi kesalahan, silakan coba lagi nanti.");
  }
};

handler.command = handler.help = ["brat"];
handler.tags = ["sticker"];
handler.limit = true;
handler.group = false;

module.exports = handler;