const fs = require('fs');
const path = require('path');

const storeDatabaseFilePath = path.join(__dirname, 'store-akunml.json');

const handler = async (message, { usedPrefix }) => {
    if (message.chat !== '120363418343379637@g.us') {
        return message.reply('❌ Fitur ini hanya bisa digunakan di grup mabar!\nJoin: https://chat.whatsapp.com/EQtUOQJ0Xe178g4nOJkKBf');
    }

    if (!fs.existsSync(storeDatabaseFilePath)) 
        return message.reply('Belum ada akun yang tersimpan!');
    
    const data = JSON.parse(fs.readFileSync(storeDatabaseFilePath));
    
    if (!data.accounts || data.accounts.length === 0)
        return message.reply('Belum ada akun yang tersimpan!');
    
    let listAkun = '📝 *DAFTAR SEMUA AKUN ML*\n\n';
    data.accounts.forEach((akun, i) => {
        listAkun += `${i + 1}. Nama: ${akun.nama}\n`;
        listAkun += `   ID ML: ${akun.idml}\n`;
        listAkun += `   Role: ${akun.role}\n`;
        listAkun += `   Nomor: ${akun.sender.split('@')[0]}\n`;
        listAkun += `   Tanggal: ${akun.tanggal}\n\n`;
    });
    
    return message.reply(listAkun);
};

handler.help = ['listakun'];
handler.tags = ['store'];
handler.command = /^listakun$/i;
handler.owner = false;
module.exports = handler;