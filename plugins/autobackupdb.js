// exports.before = async function autobackup(m) {
//     let fs = require('fs')
//        setInterval(async () => {
//        let d = new Date(new Date + 360000)
//        let locale = 'id'
//        let time = d.toLocaleTimeString(locale, {
//          hour: 'numeric',
//          minute: 'numeric',
//          second: 'numeric'
//          })
//        let q = { key: { remoteJid: "status@broadcast", participant: "0@s.whatsapp.net", fromMe: false, id: "" },
//        "message": { conversation: "[✓] Membackup *database.js*" }}
//        let sesi = await fs.readFileSync('./database.json')
//        await conn.sendMessage(owner + '@s.whatsapp.net', {
//         document: { 
//          url: sesi, 
//          },
//        mimetype: 'application/json',
//        fileName: 'database.json',
//           }, { quoted: q })
//         }, 60 * 60 * 1000)
//     };