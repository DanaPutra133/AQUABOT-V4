const axios = require('axios');
const cheerio = require('cheerio');
const forms = require('form-data');

async function getBuffer(url, options) {
    try {
        options ? options : {}
        const res = await axios({
            method: "get",
            url,
            headers: {
                'DNT': 1,
                'Upgrade-Insecure-Request': 1
            },
            ...options,
            responseType: 'arraybuffer'
        })
        return res.data
    } catch (e) {
        console.log(`Error : ${e}`)
        return 'err'
    }
}

async function ageDetect(url) {
    return new Promise(async (resolve, reject) => {
        try {
            const { data: tok } = await axios.get('https://age.toolpie.com/', {
                headers: {
                    'authority': 'age.toolpie.com',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'cookie': '__gads=ID=bd097b4a63e6c0ac:T=1721989815:RT=1721989815:S=ALNI_Mb1C2vLqLhmCTU0vTUeKTqktJ5YCA; __gpi=UID=00000ea852acae78:T=1721989815:RT=1721989815:S=ALNI_MavguIOGFrbjTynBrQgV1oYaj70Gg; __eoi=ID=11ee37debb0f7196:T=1721989815:RT=1721989815:S=AA-AfjanO7-69chxmcF_zZXETwyZ; _ga=GA1.1.1581134880.1721989800; fpestid=GgQXN14DhCZ0Z1eqb-zw5U_MQORdoTam4MOJFtcGigPjw9fqxB4RWKKFN-2baNC4LaJR-g; XSRF-TOKEN=eyJpdiI6IjBWYWN4cmZIcEJpNTluRFBFSDBWT2c9PSIsInZhbHVlIjoiYmEyR3JHejVuZ1hMc1VVWkxPNjJvbHNwelA0Y2orSjdBZjZidis3Y1IyTTNXV2dTTW9MNTdWNWJrdWNJaTJvaiIsIm1hYyI6IjBmMjBmZWJlZjU5Y2ZlNzExMTg3MDVjODNkODIyY2QyM2E3MjJlNWE4OGM4OTUyNzFkOTlkNzkxMTBjYmUwMWYifQ%3D%3D; toolpie_session=eyJpdiI6IllodkI4RExpWGdWcXd3QzFMQnBaVlE9PSIsInZhbHVlIjoieG1kY1dlZ3llQVBkU2VSbFUxNkphVGczRGpPb1oraGRXSnllclJjZEhLWlZTR2VkaDFQNlpkRUkzd3lwcFwvelJrVjlVUWVJY204TkQzc0VHK2l3dU95ZTcrd0lITXN3MmRWOSs5ak9nOHdvMm9UQ1BNSk81TlhaMVl0ZFZ3U1FQIiwibWFjIjoiOWE1ODQ0NzUwOTA1NzU1YmY4YjBiM2Y3OWM0MzEzNmM0ZTg4ZmQxZThlNmUzNzgyODFkNTI1ZjgzYjAxZTQzNCJ9; FCNEC=%5B%5B%22AKsRol_rDlRFmpitqZxR7svX3Ss1tKZtx7KGqM6wexgLIymcUSwfN7tKtKjSae8zvGrPZaK-9-2hgVmtsYLzXJrRRaSsmOEL2gz8bXwoM3ZT2b4Fg6kfwfQRZkQ5XcFoKWqjbWjcMFS1vCbG4I5yrch6PKAbPgE3qA%3D%3D%22%5D%5D; _ga_V6M7FJQD1E=GS1.1.1721989801.1.1.1721989905.0.0.0',
                    'Priority': 'u=1, i',
                    'Origin': 'https://age.toolpie.com',
                    'Referer': 'https://age.toolpie.com',
                    'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                    'Sec-Ch-Ua-Mobile': '?0',
                    'Sec-Ch-Ua-Platform': '"Windows"',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
                }
            });
            const $ = await cheerio.load(tok);
            const token = $("input[name='_token']").val();
            console.log(token);
            const buffer = await getBuffer(url);
            const form = new forms();
            form.append('picture', buffer, 'filename.jpg');
            form.append('_token', token);
            const { data: res } = await axios.post('https://age.toolpie.com', form,{
                headers: {
                    'authority': 'age.toolpie.com',
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                    'Accept-Encoding': 'gzip, deflate, br, zstd',
                    'Accept-Language': 'en-US,en;q=0.9',
                    'cookie': '__gads=ID=bd097b4a63e6c0ac:T=1721989815:RT=1721989815:S=ALNI_Mb1C2vLqLhmCTU0vTUeKTqktJ5YCA; __gpi=UID=00000ea852acae78:T=1721989815:RT=1721989815:S=ALNI_MavguIOGFrbjTynBrQgV1oYaj70Gg; __eoi=ID=11ee37debb0f7196:T=1721989815:RT=1721989815:S=AA-AfjanO7-69chxmcF_zZXETwyZ; _ga=GA1.1.1581134880.1721989800; fpestid=GgQXN14DhCZ0Z1eqb-zw5U_MQORdoTam4MOJFtcGigPjw9fqxB4RWKKFN-2baNC4LaJR-g; XSRF-TOKEN=eyJpdiI6IjBWYWN4cmZIcEJpNTluRFBFSDBWT2c9PSIsInZhbHVlIjoiYmEyR3JHejVuZ1hMc1VVWkxPNjJvbHNwelA0Y2orSjdBZjZidis3Y1IyTTNXV2dTTW9MNTdWNWJrdWNJaTJvaiIsIm1hYyI6IjBmMjBmZWJlZjU5Y2ZlNzExMTg3MDVjODNkODIyY2QyM2E3MjJlNWE4OGM4OTUyNzFkOTlkNzkxMTBjYmUwMWYifQ%3D%3D; toolpie_session=eyJpdiI6IllodkI4RExpWGdWcXd3QzFMQnBaVlE9PSIsInZhbHVlIjoieG1kY1dlZ3llQVBkU2VSbFUxNkphVGczRGpPb1oraGRXSnllclJjZEhLWlZTR2VkaDFQNlpkRUkzd3lwcFwvelJrVjlVUWVJY204TkQzc0VHK2l3dU95ZTcrd0lITXN3MmRWOSs5ak9nOHdvMm9UQ1BNSk81TlhaMVl0ZFZ3U1FQIiwibWFjIjoiOWE1ODQ0NzUwOTA1NzU1YmY4YjBiM2Y3OWM0MzEzNmM0ZTg4ZmQxZThlNmUzNzgyODFkNTI1ZjgzYjAxZTQzNCJ9; FCNEC=%5B%5B%22AKsRol_rDlRFmpitqZxR7svX3Ss1tKZtx7KGqM6wexgLIymcUSwfN7tKtKjSae8zvGrPZaK-9-2hgVmtsYLzXJrRRaSsmOEL2gz8bXwoM3ZT2b4Fg6kfwfQRZkQ5XcFoKWqjbWjcMFS1vCbG4I5yrch6PKAbPgE3qA%3D%3D%22%5D%5D; _ga_V6M7FJQD1E=GS1.1.1721989801.1.1.1721989905.0.0.0',
                    'Priority': 'u=1, i',
                    'Origin': 'https://age.toolpie.com',
                    'Referer': 'https://age.toolpie.com',
                    'Sec-Ch-Ua': '"Not/A)Brand";v="8", "Chromium";v="126", "Google Chrome";v="126"',
                    'Sec-Ch-Ua-Mobile': '?0',
                    'Sec-Ch-Ua-Platform': '"Windows"',
                    'Sec-Fetch-Dest': 'empty',
                    'Sec-Fetch-Mode': 'cors',
                    'Sec-Fetch-Site': 'same-origin',
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0.0.0 Safari/537.36'
                }
            });
            const $_ = await cheerio.load(res);
            const txt = $_('.p-3.mt-2.bg-success.text-white h5').text();
            resolve(txt);
        } catch (error) {
            reject(error);
        };
    });
};

module.exports = { ageDetect };