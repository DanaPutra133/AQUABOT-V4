import axios from 'axios';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `*❌ Masukkan URL!*\n\n*Contoh:*\n${usedPrefix + command} https://vt.tiktok.com/ZSY8XguF2/`;
    }

    try {
        let capt, urlApi;

        if (/^(tiktok|tt|ttdl|ttnowm|tiktokdl|tiktoknowm|tiktok2|tt2|ttdl2|ttnowm2|tiktokdl2|tiktoknowm2)$/i.test(command)) {
            if (!text.match(/https?:\/\/(www\.|vt\.|vm\.|m\.)?tiktok\.com/gi)) throw "❌ URL TikTok Tidak Ditemukan!";
            capt = `乂 *T I K T O K*`;
            urlApi = `https://api.betabotz.eu.org/api/download/tiktok?url=${encodeURIComponent(text.trim())}&apikey=${lann}`;
        } else if (/^(douyin|douyindl|douyin2|douyindl2)$/i.test(command)) {
            if (!text.match(/https?:\/\/(www\.|v\.)?douyin\.com/gi)) throw "❌ URL Douyin Tidak Ditemukan!";
            capt = `乂 *D O U Y I N*`;
            urlApi = `https://api.betabotz.eu.org/api/download/douyin?url=${encodeURIComponent(text.trim())}&apikey=${lann}`;
        }

        if (!urlApi) throw `❌ URL API tidak valid atau command tidak dikenali!`;

        await m.reply('⏳ _Sedang memproses video, tunggu sebentar..._');  
        
        const response = await axios.get(urlApi);
        const res = response.data.result;
        var { video, title, title_audio, audio } = res;

        capt += `◦ *Title* : ${title}\n`;
        capt += `\n`;capt += `\n_${global.wm || ''}_`;

        if (video.length > 1) {
          for (let i = 0; i < video.length; i++) {
            let fileName = `video_${i + 1}.mp4`;
            let buffer = await conn.getFile(video[i]).catch(() => null);
            let mediaData = buffer && buffer.data ? buffer.data : video[i];

            await conn.sendMessage(m.chat, {
                document: mediaData,
                mimetype: 'video/mp4',
                fileName: fileName,
                caption: capt
            }, { quoted: m });
          }
        } else {
          let fileName = `${(title || 'video').substring(0, 30).replace(/[^a-zA-Z0-9]/g, '_')}.mp4`;
          let buffer = await conn.getFile(video[0]).catch(() => null);
          let mediaData = buffer && buffer.data ? buffer.data : video[0];

          await conn.sendMessage(m.chat, {
              document: mediaData,
              mimetype: 'video/mp4',
              fileName: fileName,
              caption: capt
          }, { quoted: m });
        }

        if (!audio[0]) {
          await conn.reply(m.chat, "_Audio tidak tersedia!_", m);
        } else {
          conn.sendMessage(
            m.chat,
            { audio: { url: audio[0] }, mimetype: "audio/mpeg" },
            { quoted: m },
          );
        }
        
    } catch (e) {
        console.error(e);
        throw e;
    }
};

handler.help = ['tiktok2', 'douyin2'].map(v => v + ' <url>');
handler.command = /^(tiktok2|tt2|ttdl2|ttnowm2|tiktokdl2|tiktoknowm2|douyin2|douyindl2)$/i;
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;

export default handler;