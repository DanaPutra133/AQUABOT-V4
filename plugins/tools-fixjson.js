import axios from 'axios';
import FormData from 'form-data';
import { promisify } from 'util';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let jsonInput = text || (m.quoted ? m.quoted.text : '');

    if (!jsonInput) {
        throw `Provide the broken JSON text or reply to a message containing it.\n\n*Example Usage:*\n${usedPrefix + command} { "name": "John", "age: 30 }`;
    }

    const useFileOutput = /(-f|--file)/.test(jsonInput);
    const actualJson = jsonInput.replace(/(-f|--file)/g, '').trim();

    if (!actualJson) {
        throw `JSON code cannot be empty after removing the file flag.`;
    }

    try {
        await m.reply('Processing your request...');

        const params = { apikey: dana };
        if (useFileOutput) params.output = 'file';
        
        const queryString = new URLSearchParams(params).toString();
        const apiUrl = `https://api.danafxc.my.id/api/proxy/tools/fix-json?${queryString}`;

        const form = new FormData();
        form.append('code', actualJson);

        const getLength = promisify(form.getLength).bind(form);
        const contentLength = await getLength();

        const response = await axios.post(apiUrl, form, {
            headers: { ...form.getHeaders(), 'Content-Length': contentLength },
            responseType: useFileOutput ? 'arraybuffer' : 'json'
        });

        if (useFileOutput) {
            return conn.sendFile(m.chat, response.data, 'fixed.json', 'Here is your fixed JSON file.', m);
        }

        const result = response.data;

        if (result && result.status && result.data) {
            const formattedResult = JSON.stringify(result.data, null, 2);
            await m.reply(`*✅ API Response Data:*\n\`\`\`json\n${formattedResult}\n\`\`\``);
        } else {
            throw new Error(`API did not return a valid data structure: ${JSON.stringify(result)}`);
        }

    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
};

handler.help = ['fixjson [-f|--file] <broken-json>'];
handler.tags = ['tools'];
handler.command = /^(fixjson|jsonfix)$/i;

export default handler;