const axios = require('axios');

async function run(lang, code) {
  const playwright = {
    avLang: ['javascript', 'python', 'java', 'csharp'],

    request: async function (language = 'javascript', code) {
      if (!this.avLang.includes(language.toLowerCase())) {
        throw new Error(
          `Language "${language}" tidak support. Pilih Language yang tersedia: ${this.avLang.join(', ')}`
        );
      }

      const url = 'https://try.playwright.tech/service/control/run';
      const headers = {
        'accept': '*/*',
        'content-type': 'application/json',
        'origin': 'https://try.playwright.tech',
        'referer': 'https://try.playwright.tech/?l=playwright-test',
        'user-agent': 'Postify/1.0.0',
      };

      const data = { code, language };

      try {
        const response = await axios.post(url, data, { headers });
        const { success, error, version, duration, output, files } = response.data;
        return {
          playwrightVersion: version,
          result: {
            duration,
            output,
            files,
          },
        };
      } catch (error) {
        if (error.response) {
          const { success, error: errMsg, version, duration, output } = error.response.data;
          return {
            playwrightVersion: version,
            result: {
              duration,
              error: errMsg,
              output,
            },
          };
        } else {
          throw new Error(`Request error: ${error.message}`);
        }
      }
    },
  };

  try {
    const result = await playwright.request(lang, code);
    console.log(result);
    return result;
  } catch (error) {
    console.error('Error:', error.message);
    throw error;
  }
}

module.exports = { run };