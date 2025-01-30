let badwordRegex = /anj(k|g)|ajn?(g|k)|a?njin(g|k)|bajingan|b(a?n)?gsa?t|ko?nto?l|me?me?(k|q)|pe?pe?(k|q)|meki|titi(t|d)|pe?ler|tetek|toket|ngewe|go?blo?k|to?lo?l|idiot|(k|ng)e?nto?(t|d)|jembut|bego|dajj?al|janc(u|o)k|pantek|puki ?(mak)?|kimak|kampang|lonte|col(i|mek?)|pelacur|henceu?t|nigga|fuck|dick|bitch|tits|bastard|asshole/i // tambahin sendiri

async function before(m, { isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return;
    let chat = global.db.data.chats[m.chat];
    let user = global.db.data.users[m.sender];
    let isBadword = badwordRegex.exec(m.text);
    
    if (chat.antiToxic && isBadword && m.isGroup) {
        m.reply(`*⚠️ Kata Kata Toxic Terdeteksi ⚠️*

PERINGATAN JANGAN GUNAKAN KATA TOXIC UNTUK KENYAMANAN CHAT!\n\n
gunakan .disable antitoxic untuk mematikan
`);    
        
    }
    return true;
}

module.exports = { before };

//kalau mau fitur kick jalan eang agak ribet ahrus restart bot gakt ahu kenapa
/*
> const axios = require('axios');
const cheerio = require('cheerio');
const readline = require('readline');
async function scrapeData(kelas) {
    const url = http://baak.gunadarma.ac.id/cariKelasBaru?_token=pWmOnet4K2EPBjTyH3H0v13DwfWOIXFvQlvfRrpg&tipeKelasBaru=Kelas&teks=${kelas};

    try {

        const response = await axios.get(url);
        const html = response.data;

        const $ = cheerio.load(html);
        const rows = $('tbody tr'); 
        const results = []; 
        rows.each((index, row) => {
            const tds = $(row).find('td');
            
            if (tds.length > 0) {
                const data = {
                    no: $(tds[0]).text(),
                    npm: $(tds[1]).text(),
                    nama: $(tds[2]).text().trim(),
                    kelas_lama: $(tds[3]).text().trim(),
                    kelas_baru: $(tds[4]).text().trim(),
                };
                
                results.push(data); 
            }
        });

        console.log(results); 
        return results;
    } catch (error) {
        console.error('Error fetching data:', error);
        return error;
    }
}

return await scrapeData("2ka05");
*/