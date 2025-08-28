const uploadImage = require('../lib/uploadImage');
const fetch = require('node-fetch');
const axios = require('axios');

let handler = async (m, { conn, usedPrefix, command, text }) => {
    if (['imageedit', 'imgedit', 'img2img', 'editimg'].includes(command) && !text) {
        return m.reply('Tolong masukkan text prompt untuk mengedit gambar.');
    }

    var q = m.quoted ? m.quoted : m;
    var mime = (q.msg || q).mimetype || q.mediaType || '';
    
    let endpoint = '';

    switch(command) {
        case 'jadidisney':
            endpoint = 'disney';
            break;
        case 'jadipixar':
            endpoint = 'pixar';
            break;
        case 'jadicartoon':
            endpoint = 'cartoon';
            break;
        case 'jadicyberpunk':
            endpoint = 'cyberpunk';
            break;
        case 'jadivangogh':
            endpoint = 'vangogh';
            break;
        case 'jadipixelart':
            endpoint = 'pixelart';
            break;
        case 'jadicomicbook':
            endpoint = 'comicbook';
            break;
        case 'jadihijab':
            endpoint = 'hijab';
            break;
        case 'jadihitam':
        case 'hitamkan':
        case 'tohitam':
            endpoint = 'hitam';
            break;
        case 'jadiputih':
            endpoint = 'putih';
            break;
        case 'jadighibili':
            endpoint = 'ghibili';
            break;
        case 'imageedit':
        case 'imgedit':
        case 'img2img':
        case 'editimg':
            if (!text) return m.reply('Tolong masukkan text prompt untuk mengedit gambar.');
            endpoint = 'editimg';
            break;
        default:
            return m.reply("[ ! ] Command tidak dikenali.");
    }

    if (/image/g.test(mime) && !/webp/g.test(mime)) {
        await conn.reply(m.chat, wait, m);
        try {
            const img = await q.download?.();
            let out = await uploadImage(img);
            let startTime = new Date();
            
            if (['imageedit', 'imgedit', 'img2img', 'editimg'].includes(command)) {
                let result = await imageedit(text, out);
                await conn.sendMessage(m.chat, { 
                    image: { url: result }, 
                    caption: `🎨 *Style:* Edit Gambar\n📋 *Prompt*: ${text}\n⏳ *Waktu:* ${((new Date() - startTime) * 1)} ms`
                }, { quoted: m });
            } else {
                let res = await fetch(`https://api.betabotz.eu.org/api/maker/jadi${endpoint}?url=${out}&apikey=${lann}`);
                let convert = await res.buffer();
                
                await conn.sendMessage(m.chat, { 
                    image: convert, 
                    caption: `🎨 *Style:* Jadi ${endpoint}\n⏳ *Waktu:* ${((new Date() - startTime) * 1)} ms`
                }, { quoted: m });
            }

        } catch (e) {
            console.error(e);
            m.reply("[ ! ] Terjadi kesalahan saat memproses gambar.");
        }
    } else {
        m.reply(`Kirim gambar dengan caption *${usedPrefix + command}* atau tag gambar yang sudah dikirim.`);
    }
};

handler.help = handler.command = ['jadidisney', 'jadipixar', 'jadicartoon', 'jadicyberpunk', 'jadivangogh', 'jadipixelart', 'jadicomicbook', 'jadihijab', 'jadihitam', 'hitamkan', 'tohitam', 'jadiputih', 'jadighibili', 'imageedit', 'imgedit', 'img2img', 'editimg'];
handler.tags = ['maker'];
handler.premium = false;
handler.limit = true;

module.exports = handler;

/*
 * @ CJS Image Edit Ai Use BetaBotz Api
 * @ Param {string} text - The text prompt for the image generation.
 * @ Param {string} url - The URL of the image to be edited.
 * @ Param {string} [apikey] - API key for authentication.
 * @ Returns {Buffer} - The edited image as a Buffer.
 * @ Throws {Error} - If the image generation fails.
 * @ Example Usage:
 */

async function imageedit(text, url) {
  try {
    const { data } = await axios.post("https://api.betabotz.eu.org/api/maker/imgedit", {
      text: text,
      url: url,
      apikey: lann
    });
    
    return data.result;
  } catch (error) {
    throw new Error("Failed to fetch image: " + error.message);
  };
};