import WebP from 'node-webpmux';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import uploadFile from '../lib/uploadFile.js';
import axios from 'axios';
import { stickerToMp4 } from '../lib/sticker-convert.js?v=6';

const { Image } = WebP;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let handler = m => m;

handler.all = async function(m) {
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];
    
    if (!chat || !chat.autowm) return; 
    if (chat.isBanned || user.banned || m.isZapo) return;

    let q = m;
    let mime = (q.msg || q).mimetype || '';
    let mtype = m.mtype || '';

    if (/webp|sticker/.test(mime) || mtype === 'stickerMessage') {
        try {
            let stickerBuffer = await q.download();
            if (!stickerBuffer) return;
            let img = new Image();
            await img.load(stickerBuffer);

            let packnameExif = '';
            let authorExif = '';

            if (img.exif) {
                try {
                    let exifData = JSON.parse(img.exif.slice(22).toString());
                    packnameExif = exifData['sticker-pack-name'] || '';
                    authorExif = exifData['sticker-pack-publisher'] || '';
                } catch (jsonErr) {
                    packnameExif = '';
                    authorExif = '';
                }
            }
            if (packnameExif === global.packname && authorExif === global.author) {
                return;
            }

            let isAnimated = q.isAnimated || (q.msg && q.msg.isAnimated) || false;

            if (isAnimated || /video|webp/g.test(mime)) {
                let videoBuffer = null;

                try {
                    let mediaUrl = await uploadFile(stickerBuffer);
                    let apiUrl = `https://api.danafxc.my.id/api/proxy/tools/convertwebp2mp4?apikey=${dana}&url=${encodeURIComponent(mediaUrl)}`;

                    let response = await axios.get(apiUrl, {
                        responseType: 'arraybuffer',
                        timeout: 15000,
                    });
                    
                    if (response && response.data) {
                        videoBuffer = Buffer.from(response.data);
                    }
                } catch (apiErr) {
                    console.warn('⚠️ API Danafxc gagal/timeout untuk autowm, beralih ke konversi lokal...', apiErr?.message || apiErr);
                }

                if (!videoBuffer || !videoBuffer.length) {
                    try {
                        videoBuffer = await stickerToMp4(stickerBuffer);
                    } catch (localErr) {
                        console.error('Konversi lokal stickerToMp4 gagal:', localErr);
                    }
                }

                if (!videoBuffer || !videoBuffer.length) {
                    return;
                }

                await this.sendVideoAsSticker(m.chat, videoBuffer, m, {
                    packname: global.packname,
                    author: global.author,
                });

            } else {
                let tmpPath = path.join(__dirname, `../tmp/autowm_${Date.now()}.webp`);
                
                if (!fs.existsSync(path.dirname(tmpPath))) {
                    fs.mkdirSync(path.dirname(tmpPath), { recursive: true });
                }

                fs.writeFileSync(tmpPath, stickerBuffer);
                await this.sendImageAsSticker(m.chat, tmpPath, m, { 
                    packname: global.packname, 
                    author: global.author 
                });

                if (fs.existsSync(tmpPath)) fs.unlinkSync(tmpPath);
            }

        } catch (e) {
            console.error('Error pada Auto-WM:', e);
        }
    }
    return !0;
};

export default handler;