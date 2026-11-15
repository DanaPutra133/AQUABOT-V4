import WebP from 'node-webpmux';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadFile from '../lib/uploadFile.js';
import axios from "axios";

const { Image } = WebP;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = m => m;

handler.all = async function(m) {
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];
    
    if (!chat || !chat.autowm) return; 
    if (chat.isBanned || user.banned || m.isBaileys) return;

    let q = m;
    let mime = (q.msg || q).mimetype || '';
    let mtype = m.mtype || '';

    if (/webp|sticker/.test(mime) || mtype === 'stickerMessage') {
       try {
        let stickerBuffer = await q.download();
        if (!stickerBuffer) return;
        let img = new Image();
        await img.load(stickerBuffer);

        let packnameExif = "";
        let authorExif = "";

        if (img.exif) {
          try {
            let exifData = JSON.parse(img.exif.slice(22).toString());
            packnameExif = exifData["sticker-pack-name"] || "";
            authorExif = exifData["sticker-pack-publisher"] || "";
          } catch (jsonErr) {
            packnameExif = "";
            authorExif = "";
          }
        }
        if (packnameExif === global.packname && authorExif === global.author) {
          return;
        }

    let media = await uploadFile(stickerBuffer);
    let isAnimated = (q.msg || q).isAnimated === true;

    if (isAnimated || /video|webp/g.test(mime)) {
      let apiUrl = `https://api.danafxc.my.id/api/proxy/tools/convertwebp2mp4?apikey=${dana}&url=${encodeURIComponent(media)}`;

      let response = await axios.get(apiUrl, {
        responseType: 'arraybuffer',
      });

      let videoBuffer = Buffer.from(response.data);

      await this.sendVideoAsSticker(m.chat, videoBuffer, m, {
        packname: global.packname,
        author: global.author,
      });
    } else {
      await this.sendImageAsSticker(m.chat, stickerBuffer, m, {
        packname: global.packname,
        author: global.author,
      });
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
    }
    return !0;
};

export default handler;