let search = require("yt-search");
let axios = require("axios");

let handler = async (m, { conn, text, usedPrefix }) => {
    if (!text) throw 'Enter Title / Link From YouTube!';
    try {
        const look = await search(text);
        const convert = look.videos[0];
        if (!convert) throw 'Video/Audio Tidak Ditemukan';
        if (convert.seconds >= 3600) {
            return conn.reply(m.chat, 'Video is longer than 1 hour!', m);
        } else {
            let videoUrl;
            try {
                videoUrl = await youtube(convert.url);
            } catch (e) {
                conn.reply(m.chat, 'Please wait...', m);
                videoUrl = await youtube(convert.url);
            }

            let caption = '';
            caption += `∘ Title : ${convert.title}\n`;
            caption += `∘ Ext : Search\n`;
            caption += `∘ ID : ${convert.videoId}\n`;
            caption += `∘ Duration : ${convert.timestamp}\n`;
            caption += `∘ Viewers : ${convert.views}\n`;
            caption += `∘ Upload At : ${convert.ago}\n`;
            caption += `∘ Author : ${convert.author.name}\n`;
            caption += `∘ Channel : ${convert.author.url}\n`;
            caption += `∘ Url : ${convert.url}\n`;
            caption += `∘ Description : ${convert.description}\n`;
            caption += `∘ Thumbnail : ${convert.image}`;

            await conn.relayMessage(m.chat, {
                extendedTextMessage: {
                    text: caption,
                    contextInfo: {
                        externalAdReply: {
                            title: convert.title,
                            mediaType: 1,
                            previewType: 0,
                            renderLargerThumbnail: true,
                            thumbnailUrl: convert.image,
                            sourceUrl: videoUrl.mp4
                        }
                    },
                    mentions: [m.sender]
                }
            }, {});

            await conn.sendFile(m.chat, {
                video: {
                    url: videoUrl.result.mp4
                },
            }, {
                quoted: m
            });
        }
    } catch (e) {
        conn.reply(m.chat, `*Error:* ` + e.message, m);
    }
};

handler.command = handler.help = ['tesyt', 'ds', 'song'];
handler.tags = ['downloader'];
handler.exp = 0;
handler.limit = true;
handler.premium = false;

module.exports = handler;

async function youtube(url) {
   try {
   const { data } = await axios.get("https://api.betabotz.eu.org/api/download/yt?url="+url+"&apikey="+lann)
   return data;
   } catch (e) {
   return e;
   }
}



// const axios = require('axios');

// let handler = async (m, { conn, text, usedPrefix, command }) => {
//     // if (!text) throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://vm.tiktok.com/ZGJAmhSrp/`;    
//     try {
//         m.reply(wait);      
//         const response = await axios.get(`https://api.betabotz.eu.org/api/download/yt?url=${text}&apikey=${lann}`);        
//         const res = response.result.mp4;      
//         var video = res;     
//         await conn.sendFile(m.chat, video, null, m);
//     } catch (e) {
//         console.log(e);
//         throw `🚩 ${eror}\nGunakan .ttslide jika itu tiktokslide`;
//     }
// };9999999
// handler.help = ['tiktok'];
// handler.command = /^(tesyt)$/i
// handler.tags = ['downloader'];
// handler.limit = true;
// handler.group = false;
// handler.premium = false;
// handler.owner = false;
// handler.admin = false;
// handler.botAdmin = false;
// handler.fail = null;
// handler.private = false;

// module.exports = handler;