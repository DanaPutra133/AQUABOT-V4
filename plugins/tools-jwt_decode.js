const axios = require('axios');
const FormData = require('form-data');
const { promisify } = require('util');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let token = text || (m.quoted ? m.quoted.text : '');

    if (!token) {
        throw `Masukkan token JWT yang ingin di-decode.\n\n*Contoh:*\n${usedPrefix + command} eyJhbGciOi...`;
    }

    try {
        const apiUrl = `https://api.danafxc.my.id/api/proxy/tools/jwt-decode?apikey=${dana}`;
        const form = new FormData();
        form.append('jwt', token);
        
        const getLength = promisify(form.getLength).bind(form);
        const contentLength = await getLength();

        const response = await axios.post(apiUrl, form, {
            headers: {
                ...form.getHeaders(),
                'Content-Length': contentLength,
            }
        });

        const result = response.data;
        if (result && result.status && result.header && result.payload) {
                        const { header, payload } = result;
            let replyText = `*🔓 Decoded JWT Token*\n\n`;
            
            replyText += `*Header:*\n`;
            replyText += `\`\`\`json\n${JSON.stringify(header, null, 2)}\n\`\`\`\n\n`;
            
            replyText += `*Payload:*\n`;
            replyText += `\`\`\`json\n${JSON.stringify(payload, null, 2)}\n\`\`\``;
            
            await m.reply(replyText.trim());
        } else {
            throw new Error(`Gagal men-decode token. Respons API tidak valid: ${JSON.stringify(result)}`);
        }

    } catch (error) {
        console.error('Error pada fitur jwt-decode:', error.response ? JSON.stringify(error.response.data) : error.message);
        m.reply(`Gagal men-decode token. Pastikan token yang Anda masukkan valid.`);
    }
};

handler.help = ['jwtdecode <token>'];
handler.tags = ['tools'];
handler.command = /^(jwt|jwtdecode)$/i;

module.exports = handler;