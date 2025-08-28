const fs = require('fs');
const path = require('path');

const storeDatabaseFilePath = path.join(__dirname, 'store-akunml.json');

const handler = async (m, { usedPrefix }) => {
    if (m.chat !== '120363418343379637@g.us') {
        return m.reply('❌ Fitur ini hanya bisa digunakan di grup mabar!\nJoin: https://chat.whatsapp.com/EQtUOQJ0Xe178g4nOJkKBf');
    }

    if (!fs.existsSync(storeDatabaseFilePath)) 
        return m.reply('Belum ada akun yang tersimpan!');
    
    const data = JSON.parse(fs.readFileSync(storeDatabaseFilePath));
    
    if (!data.accounts || data.accounts.length === 0)
        return m.reply('Belum ada akun yang tersimpan!');
    
    // Filter akun berdasarkan nomor pengirim
    const userAccounts = data.accounts.filter(acc => acc.sender === m.sender);
    
    if (userAccounts.length === 0)
        return m.reply('Anda belum memiliki akun yang terdaftar!');
    
    let listAkun = '📱 *AKUN ML ANDA*\n\n';
    userAccounts.forEach((akun, i) => {
        listAkun += `${i + 1}. Nama: ${akun.nama}\n`;
        listAkun += `   ID ML: ${akun.idml}\n`;
        listAkun += `   Role: ${akun.role}\n`;
        listAkun += `   Nomor: ${akun.sender.split('@')[0]}\n`;
        listAkun += `   Tanggal: ${akun.tanggal}\n\n`;
    });
    
    return m.reply(listAkun);
};

handler.help = ['cekakun'];
handler.tags = ['store'];
handler.command = /^cekakun$/i;
module.exports = handler;