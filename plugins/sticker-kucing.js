import fetch from 'node-fetch';
import { sticker5 } from '../lib/sticker.js';

let handler = async (m, { conn, command, text, usedPrefix }) => {
    try {
        let stiker;

        try {
            const res = `https://api.betabotz.eu.org/api/sticker/meme-kucing?apikey=${lann}`;
            stiker = await sticker5(null, res, global.packname, global.author);
            if (!stiker || !Buffer.isBuffer(stiker)) throw new Error('Primary API gagal');
        } catch (primaryErr) {
            const query = encodeURIComponent(text?.trim() || 'kucing');
            const fallbackRes = await fetch(`https://api.danafxc.my.id/api/proxy/search/stikerkucing?query=${query}&apikey=${dana}`);
            const json = await fallbackRes.json();

            if (!json.status || !json.data?.urls?.length) {
                throw new Error('Gagal mengambil data stiker dari API fallback.');
            }

            const randomUrl = json.data.urls[Math.floor(Math.random() * json.data.urls.length)];
            stiker = await sticker5(null, randomUrl, global.packname, global.author);
        }

        await conn.sendFile(m.chat, stiker, "emror.webp", "", m);
    } catch (e) {
        console.log(e);
        throw e;
    }
};

handler.command = handler.info = ['stickerkucing', 'stikercat'];
handler.help = ['sticker'];
handler.limit = true;
export default handler;