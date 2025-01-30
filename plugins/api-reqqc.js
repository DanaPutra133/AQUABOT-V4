let fetch = require('node-fetch');
let fs = require('fs');

let handler = async (m, { conn, text }) => {
    if (!text || !text.includes('username:')) {
        return m.reply('Kamu bukan user API!, include username: ');
    }
    let [usernameLine] = text.split(',');
    let username = usernameLine.replace('username:', '').trim();
    try {
        m.reply('Tunggu sebentar bot sedang memvalidasi data anda, jika tidak ada respon dari bot hubungi admin di https://api.betabotz.eu.org/contact');
        let response = await fetch(`https://api.betabotz.eu.org/api/checkexp?username=${username}`);
        let result = await response.json();
        if (result.result.username) {
            let dbPath = './db-reqgcapi.json';
            let dbData = [];
            if (fs.existsSync(dbPath)) {
                let fileContent = fs.readFileSync(dbPath, 'utf-8');
                dbData = JSON.parse(fileContent);
            }
            if (!dbData.includes(username)) {
                dbData.push(username);
                fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2));
            }
            conn.sendMessage('120363361439264023@g.us', {
                text: `Ada user yang baru saja meminta info link group dengan data sebagai berikut :\n- username ${username}\n- nomor: ${m.sender}\n`,
                contextInfo: {
                    mentionedJid: [
                        '6281289694906@s.whatsapp.net',
                        '62895628117900@s.whatsapp.net'
                    ]
                }
            });
            m.reply(`Validasi berhasil! Berikut link grupnya:\n\n> https://chat.whatsapp.com/IWrYfFxczNOCnhEVROEjNR`);          
        } else {
            m.reply('Kamu bukan user API!');
        }
    } catch (err) {
        console.error(err);
        m.reply('Kamu bukan user api?, atau server error');
    }
};

handler.help = ['halo ka saya mau join group nya'];
handler.tags = ['restapi'];
handler.private = true;
handler.customPrefix = /^(halo ka saya mau join group nya)/i;
handler.command = new RegExp();

module.exports = handler;