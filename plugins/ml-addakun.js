const fs = require('fs');
const path = require('path');

const storeDatabaseFilePath = path.join(__dirname, 'store-akunml.json');

const loadStoreDatabase = () => {
    if (fs.existsSync(storeDatabaseFilePath)) {
        const data = fs.readFileSync(storeDatabaseFilePath);
        return JSON.parse(data);
    }
    return { accounts: [] };
};

const saveStoreDatabase = (data) => {
    fs.writeFileSync(storeDatabaseFilePath, JSON.stringify(data, null, 2));
};

const handler = async (m, { text, usedPrefix }) => {
    if (m.chat !== '120363418343379637@g.us') {
        return m.reply('❌ Fitur ini hanya bisa digunakan di grup mabar!\nJoin: https://chat.whatsapp.com/EQtUOQJ0Xe178g4nOJkKBf');
    }

    if (!text) throw `Format salah! Gunakan: ${usedPrefix}addakun nama,idml,role`;
    
    const [nama, idml, role] = text.split(',').map(item => item.trim());
    
    if (!nama || !idml || !role) 
        throw `Format salah! Contoh: ${usedPrefix}addakun erlan,123456,mage`;

    const db = loadStoreDatabase();
    db.accounts = db.accounts || [];
    
    db.accounts.push({
        nama,
        idml,
        role,
        sender: m.sender, // Menambah nomor pengirim
        tanggal: new Date().toLocaleString('id-ID', { 
            timeZone: 'Asia/Jakarta',
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        })
    });
    
    saveStoreDatabase(db);
    return m.reply(`✅ Berhasil menambahkan akun ML:\nNama: ${nama}\nID ML: ${idml}\nRole: ${role}`);
};

handler.help = ['addakun nama,idml,role'];
handler.tags = ['store'];
handler.command = /^addakun$/i;
handler.owner = false;
module.exports = handler;