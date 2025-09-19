const axios = require('axios');
const FormData = require('form-data');
const { promisify } = require('util');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let jsonInput = text || (m.quoted ? m.quoted.text : '');

    if (!jsonInput) {
        throw `Provide the broken JSON text or reply to a message containing it.\n\n*Example Usage:*\n${usedPrefix + command} { "name": "John", "age: 30 }`;
    }

    // Flag untuk output file tetap dipertahankan jika Anda membutuhkannya nanti
    const useFileOutput = /(-f|--file)/.test(jsonInput);
    const actualJson = jsonInput.replace(/(-f|--file)/g, '').trim();

    if (!actualJson) {
        throw `JSON code cannot be empty after removing the file flag.`;
    }

    try {
        m.reply('Processing your request...');

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

        // --- PERBAIKAN LOGIKA FINAL DI SINI ---
        // Memeriksa 'result.data' bukan 'result.result'
        if (result && result.status && result.data) {
            // Karena hasilnya adalah objek, kita format dengan JSON.stringify
            const formattedResult = JSON.stringify(result.data, null, 2);
            m.reply(`*✅ API Response Data:*\n\`\`\`json\n${formattedResult}\n\`\`\``);
        } else {
            throw new Error(`API did not return a valid data structure: ${JSON.stringify(result)}`);
        }

    } catch (error) {
        console.error('Error in fix-json feature:', error.response ? JSON.stringify(error.response.data) : error.message);
        m.reply(`An error occurred. The API may have returned an error: ${error.message}`);
    }
};

handler.help = ['fixjson [-f|--file] <broken-json>'];
handler.tags = ['tools'];
handler.command = /^(fixjson|jsonfix)$/i;

module.exports = handler;