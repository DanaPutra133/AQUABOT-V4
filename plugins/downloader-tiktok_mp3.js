const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukan URL!\n\ncontoh:\n${usedPrefix + command} https://vm.tiktok.com/ZGJAmhSrp/`;    
    try {
        if (!text.match(/tiktok/gi)) throw `URL Tidak Ditemukan!`;        
        m.reply(wait);      
        const response = await axios.get(`https://api.betabotz.eu.org/api/download/tiktok?url=${text}&apikey=${lann}`);        
        const res = response.data.result;      
        var { audio } = res;      
        conn.sendMessage(m.chat, { audio: { url: audio[0] }, mimetype: 'audio/mpeg' }, { quoted: m });         
    } catch (e) {
        console.log(e);
        throw `🚩 ${eror}\nGunakan .ttslide jika itu tiktokslide`;
    }
};
handler.help = ['ttmp3'];
handler.command = /^(tiktokmp3|ttmp3)$/i
handler.tags = ['downloader'];
handler.limit = true;
handler.group = false;
handler.premium = false;
handler.owner = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;
handler.private = false;

module.exports = handler;