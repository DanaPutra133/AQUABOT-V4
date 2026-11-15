import { sticker5 } from '../lib/sticker.js';
import fs from 'fs';
import fetch from 'node-fetch';
import axios from 'axios';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
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

  try {
    let imageBuffer;
    
    try {
      const apiUrl = `https://api.danafxc.my.id/api/proxy/maker/brat?apikey=${dana}&text=${encodeURIComponent(text.substring(0, 151))}`;

      const response = await axios.post(apiUrl, null, {
        responseType: "arraybuffer",
      });

      imageBuffer = response.data;
    } catch (e) {
      console.log("API utama gagal, memakai fallback...");
      const res = `https://api.betabotz.eu.org/api/maker/brat?text=${encodeURIComponent(text.substring(0, 151))}&apikey=${lann}`;

      const fetchResult = await fetch(res);

      if (!fetchResult.ok) {
        throw "Fallback API gagal";
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
      throw "Pembuatan stiker gagal";
    }
  } catch (e) {
      console.log(e);
      throw e;
  }
};

handler.command = handler.help = ["brat"];
handler.tags = ["sticker"];
handler.limit = true;
handler.group = false;

export default handler;