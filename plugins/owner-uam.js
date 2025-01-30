let handler = async (m, { text }) => {
  if (!text) throw `Input Level!`;
  let mode = text.toLowerCase() === 'on' ? 'under_attack' : 'essentially_off';
  try {
    let body = await cf(mode);
    return await m.reply(`Under Attack Mode ${mode}`);
  } catch (e) {
    console.error(e);
    return await m.reply('Failed to update security level');
  }
};

handler.command = handler.help = ['uam'];
handler.tags = ['owner'];
handler.owner = true;
handler.private = false;
module.exports = handler;

const axios = require('axios');

async function cf(level) {
  try {
    const url = 'https://api.cloudflare.com/client/v4/zones/dd8172f520870b7ec5167e5ba77f3761/settings/security_level';
    const headers = {
      'X-Auth-Email': 'fxacbapi.my.id@gmail.com',
      'X-Auth-Key': 'f593f9a9dd50f645325bc487f7fadd2928e1f',
      'Content-Type': 'application/json'
    };
    const data = {
      value: level
    };

    const response = await axios.patch(url, data, { headers });

    return response.data;
  } catch (error) {
    throw new Error(`Failed to update security level: ${error.message}`);
  }
}