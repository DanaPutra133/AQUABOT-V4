// --- PERBAIKAN: Menggunakan form-data, bukan JSON ---
const axios = require('axios');
const FormData = require('form-data');
const { promisify } = require('util');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let sqlQuery = text || (m.quoted ? m.quoted.text : '');

    if (!sqlQuery) {
        throw `Masukkan query SQL atau reply pesan yang berisi query.\n\n*Contoh Penggunaan:*\n*1. Teks Langsung:*\n${usedPrefix + command} CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100));\n\n*2. Reply Pesan:*\nKirim pesan berisi query SQL, lalu reply dengan *${usedPrefix + command}*`;
    }

    if (sqlQuery.length > 4096) return m.reply('Query SQL terlalu panjang, maksimal 4096 karakter!');

    try {
        m.reply('Sedang membuat diagram SQL...');

        const apiUrl = `https://api.danafxc.my.id/api/proxy/tools/sql?apikey=${dana}`;

        const form = new FormData();
        form.append('sql', sqlQuery);
                const getLength = promisify(form.getLength).bind(form);
        const contentLength = await getLength();

        const response = await axios.post(apiUrl, form, {
            headers: {
                ...form.getHeaders(),
                'Content-Length': contentLength,
            },
            responseType: 'arraybuffer'
        });

        conn.sendFile(m.chat, response.data, 'sql_diagram.png', 'Ini diagram SQL Anda!', m);

    } catch (error) {
        console.error('Error pada fitur dsql:', error);
        let errorMessage = 'Gagal membuat diagram. Silakan coba lagi nanti.';
        if (error.response && error.response.data) {
            const errorData = Buffer.isBuffer(error.response.data) 
                ? error.response.data.toString('utf-8') 
                : JSON.stringify(error.response.data);
            errorMessage = `Gagal membuat diagram.\n*Pesan dari API:* ${errorData}`;
        }
        m.reply(errorMessage);
    }
};

handler.help = ['dsql <query>'];
handler.tags = ['tools', 'maker'];
handler.command = /^(dsql|diagramsql)$/i;

module.exports = handler;