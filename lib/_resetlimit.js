let cron = require('node-cron');
let handler = m => m;
let messageSent = false; 

handler.before = async function (m) {
  cron.schedule('00 05 * * *', () => {
    let users = global.db.data.users;

    let resetUsers = Object.entries(users).filter(([user, data]) => data.limit < 10000000);

    if (resetUsers.length > 0 && !messageSent) {
      let limit = 50;

      resetUsers.forEach(([user, data]) => {
        data.limit = limit;
      });
      console.log('Reset Limit');

      const q = {
        key: { remoteJid: 'status@broadcast', participant: '0@s.whatsapp.net', fromMe: false, id: '' },
        message: { conversation: 'Successfully reset user limit' }
      };
      conn.sendMessage(`6281232615640@s.whatsapp.net`, { text: 'ðŸš© Reset semua limit pada jam 05.00' }, { quoted: q });

      messageSent = true; 
    }
  }, {
    scheduled: true,
    timezone: 'Asia/Jakarta'
  });
};

module.exports = handler;