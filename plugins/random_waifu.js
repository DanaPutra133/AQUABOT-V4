import axios from 'axios';

let handler = async (m, { conn }) => {
    try {
        await m.reply('⏳ Sedang mencari gambar random waifu...');
        const apiUrl = `https://api.danafxc.my.id/api/proxy/pict/gambar?q=waifu&apikey=${dana}`;
        const response = await axios.get(apiUrl);
        const jsonData = response.data;
        
        if (jsonData && jsonData.status && jsonData.urls && jsonData.urls.length > 0) {
            const imageUrl = jsonData.urls[0];
            await conn.sendFile(m.chat, imageUrl, 'random.jpg', 'Ini gambar random waifu untukmu!', m);
        } else {
            throw 'API tidak mengembalikan URL gambar yang valid.';
        }
    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
};

handler.help = ['waifu'];
handler.tags = ['internet', 'tools'];
handler.command = /^(waifu)$/i;

export default handler;