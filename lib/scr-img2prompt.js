let FormData = require('form-data')
let axios = require('axios')

async function describe(imageUrl) {
    try {
        const form = new FormData();
        const response = await axios.get(imageUrl, {
            responseType: 'arraybuffer'
        });
        const binary = Buffer.from(response.data, 'binary');
        form.append('file', binary, {
            filename: 'blob.jpg'
        });
        form.append('mode', 'fast');
        form.append('best_max_flavors', 4);
        const {
            data
        } = await axios.post("https://ashrafb-cintdogfast.hf.space/inference/", form, {
            headers: {
                ...form.getHeaders(),
                "accept": "*/*",
                "cache-control": "no-cache",
                "pragma": "no-cache",
                "sec-ch-ua-mobile": "?1",
                "sec-ch-ua-platform": "\"Android\"",
                "sec-fetch-dest": "empty",
                "sec-fetch-mode": "cors",
                "sec-fetch-site": "cross-site",
                "Origin": "https://artixiban-cint.static.hf.space",
                "Referer": "https://artixiban-cint.static.hf.space/",
                "Referrer-Policy": "strict-origin-when-cross-origin",
                "User-Agent": "Mozilla/5.0 (Linux; Android 13; V2252) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Mobile Safari/537.36"
            },
        });
        return data.prompt_results[0];
    } catch (error) {
        return error;
        console.error(error);
    }
};

module.exports = { describe };
//return await describe('https://btch.pages.dev/file/f54822c1140d49696cea8.jpg');