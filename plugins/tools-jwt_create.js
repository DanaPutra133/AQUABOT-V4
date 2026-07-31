import axios from 'axios';
import FormData from 'form-data';
import { promisify } from 'util';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) {
        throw `Gunakan format key:value untuk membuat token JWT.\nPisahkan setiap data dengan koma.\n\n*Parameter Wajib:*\n- \`expiresIn\`\n\n*Contoh Penggunaan:*\n${usedPrefix + command} expiresIn:1d, userId:123, role:admin`;
    }

    try {
        await m.reply('Sedang membuat token JWT...');
        const payload = {};
        const pairs = text.split(',');

        for (const pair of pairs) {
            const parts = pair.split(':');
            const key = parts[0]?.trim();
            const value = parts.slice(1).join(':')?.trim();

            if (key && value) {
                payload[key] = value;
            }
        }
        
        if (!payload.expiresIn) {
            throw `Parameter "expiresIn" wajib ada!\n\n*Contoh:*\n${usedPrefix + command} expiresIn:7d, name:John Doe`;
        }

        const apiUrl = `https://api.danafxc.my.id/api/proxy/tools/jwt-create?apikey=${dana}`;

        const form = new FormData();
        for (const key in payload) {
            form.append(key, payload[key]);
        }
        
        const getLength = promisify(form.getLength).bind(form);
        const contentLength = await getLength();
        
        const response = await axios.post(apiUrl, form, {
            headers: {
                ...form.getHeaders(),
                'Content-Length': contentLength,
            }
        });

        const result = response.data;
        if (result && result.status && result.token) {
            let replyText = `*✅ JWT Token Berhasil Dibuat*\n\nToken Anda:\n\`\`\`${result.token}\`\`\``;
            await m.reply(replyText);
        } else {
            throw new Error(`Gagal membuat token. Respons API tidak valid: ${JSON.stringify(result)}`);
        }

    } catch (e) {
      console.log(e);
      throw e;
    }
};

handler.help = ['jwtcreate <key:value, ...>'];
handler.tags = ['tools'];
handler.command = /^(jwtcreate|jwtgen)$/i;

export default handler;