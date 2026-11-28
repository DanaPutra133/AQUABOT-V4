import axios from 'axios';
import FormData from 'form-data';
import { promisify } from 'util';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let sqlQuery = text || (m.quoted ? m.quoted.text : '');

    if (!sqlQuery) {
        throw `Masukkan query SQL atau reply pesan yang berisi query.\n\n*Contoh Penggunaan:*\n*1. Teks Langsung:*\n${usedPrefix + command} CREATE TABLE users (id INT PRIMARY KEY, name VARCHAR(100));\n\n*2. Reply Pesan:*\nKirim pesan berisi query SQL, lalu reply dengan *${usedPrefix + command}*`;
    }

    if (sqlQuery.length > 4096) return m.reply('Query SQL terlalu panjang, maksimal 4096 karakter!');

    try {
        await m.reply('Sedang membuat diagram SQL...');

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

        await conn.sendFile(m.chat, response.data, 'sql_diagram.png', 'Ini diagram SQL Anda!', m);

    } catch (e) {
            console.log(e);
            throw e;
    }
};

handler.help = ['dsql <query>'];
handler.tags = ['tools', 'maker'];
handler.command = /^(dsql|diagramsql)$/i;

export default handler;