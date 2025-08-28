const fs = require('fs');
const path = require('path');

const storeDatabaseFilePath = path.join(__dirname, 'store-akunml.json');

const handler = async (m, { text, conn }) => {
    if (m.chat !== '120363418343379637@g.us') {
        return m.reply('❌ Fitur ini hanya bisa digunakan di grup mabar!\nJoin: https://chat.whatsapp.com/EQtUOQJ0Xe178g4nOJkKBf');
    }

    if (!text) return m.reply('Masukkan role yang ingin dicari!\nContoh: .cariakun exp');
    
    if (!fs.existsSync(storeDatabaseFilePath)) 
        return m.reply('Database akun kosong!');
    
    const data = JSON.parse(fs.readFileSync(storeDatabaseFilePath));
    
    if (!data.accounts || data.accounts.length === 0)
        return m.reply('Belum ada akun yang tersimpan!');
    
    const searchTerm = text.toLowerCase();
    const foundAccounts = data.accounts.filter(acc => 
        acc.role.toLowerCase().includes(searchTerm)
    );
    
    if (foundAccounts.length === 0)
        return m.reply(`Tidak ditemukan akun dengan role yang mengandung kata "${text}"`);
    
    let resultText = `🔍 *HASIL PENCARIAN ROLE: ${text}*\n\n`;
    for (let i = 0; i < foundAccounts.length; i++) {
        const acc = foundAccounts[i];
        resultText += `${i + 1}. Role: ${acc.role}\n`;
        resultText += `   Nama: ${acc.nama}\n`;
        resultText += `   ID ML: ${acc.idml}\n`;
        resultText += `   👤 @${acc.sender.split('@')[0]}\n\n`;
    }
    
    // Mengumpulkan semua nomor untuk di-mention
    const mentions = foundAccounts.map(acc => acc.sender);
    
    return conn.reply(m.chat, resultText, m, { mentions });
};

handler.help = ['cariuser role'];
handler.tags = ['store'];
handler.command = /^cariuser$/i;
module.exports = handler;