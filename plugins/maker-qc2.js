let { sticker5 } = require('../lib/sticker.js');
let axios = require('axios');

let handler = async (m, { conn, text }) => {
    let textForQuote;
    let username;
    let targetUser;

    if (m.quoted) {
        // Logika saat me-reply pesan (sudah benar dan tangguh)
        targetUser = m.quoted.sender;
        textForQuote = m.quoted.text;

        if (text) {
            username = text; // Gunakan nama kustom jika ada
        } else {
            // Logika fallback canggih untuk nama otomatis
            let potentialName = m.quoted.pushName || conn.getName(targetUser);
            if (/^[\s\d+-]+$/.test(potentialName)) {
                 username = targetUser.split('@')[0];
            } else {
                username = potentialName;
            }
        }
    } else {
        // --- SKENARIO TANPA ME-REPLY ---
        targetUser = m.sender;
        textForQuote = text;
        
        // --- PERBAIKAN DI SINI ---
        // Kembali menggunakan m.name yang lebih andal untuk pengirim sendiri
        username = m.name; 
    }
   
    if (!textForQuote) {
        throw "Teks untuk quote tidak ditemukan! Reply pesan berisi teks atau ketik teks setelah command.";
    }

    if (textForQuote.length > 100) return m.reply('Maksimal 100 Teks!');

    try {
        m.reply('Sedang membuat stiker quote...');
        
        const avatar = await conn.profilePictureUrl(targetUser, 'image').catch(_ => 'https://telegra.ph/file/320b066dc81928b782c7b.png');
        
        const apiUrl = `https://api.danafxc.my.id/api/proxy/maker/qc?apikey=${dana}&text=${encodeURIComponent(textForQuote)}&username=${encodeURIComponent(username)}&avatar=${encodeURIComponent(avatar)}`;

        const response = await axios.post(apiUrl, null, {
            responseType: 'arraybuffer'
        });

        const imageBuffer = response.data;
        let stiker = await sticker5(imageBuffer, false, global.packname, global.author);
        
        if (stiker) {
            return conn.sendFile(m.chat, stiker, 'Quotely.webp', '', m);
        } else {
            throw new Error('Gagal membuat stiker dari gambar yang diterima.');
        }

    } catch (error) {
        console.error('Error pada command qc:', error);
        m.reply('Terjadi kesalahan saat membuat stiker quote.');
    }
};

handler.help = ['qc <teks> atau <reply> [nama kustom]'];
handler.tags = ['sticker'];
handler.command = /^(qc|qc2|quotely|quotely2)$/i;

module.exports = handler;