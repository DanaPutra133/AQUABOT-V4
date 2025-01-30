// // const fetch = require('node-fetch');
// // const uploader = require('../lib/uploadImage');

// // let handler = async (m, { conn, text, command, usedPrefix }) => {
// //   let q = m.quoted ? m.quoted : m
// //   let mime = (q.msg || q).mimetype || q.mediaType || '' 
// //   if (/image/g.test(mime) && !/webp/g.test(mime)) {
// //     let buffer = await q.download() 
// //     try {
// //       let media = await uploader(buffer)
// //       let json = await (await fetch(`https://api.betabotz.eu.org/api/search/bard-img?url=${media}&text=${text}&apikey=${lann}`)).json()  
// //       conn.sendMessage(m.chat, { text: json.result }, { quoted: m })
// //     } catch (err) {
// //       throw `${eror}`
// //     }
// //   } else {
// //     throw `Reply image with command ${usedPrefix + command} pertanyaan`
// //   }
// // }

// // handler.help = ['bardimg']
// // handler.tags = ['tools']
// // handler.command = /^(bardimg|bardimage)$/i
// // handler.limit = true;
// // handler.group = true
// // handler.limit = 2


// // module.exports = handler

// const fetch = require('node-fetch');
// const uploader = require('../lib/uploadImage');

// let handler = async (m, { conn, text, command, usedPrefix }) => {
//   let q = m.quoted ? m.quoted : m
//   let mime = (q.msg || q).mimetype || q.mediaType || '' 
//   if (/image/g.test(mime) && !/webp/g.test(mime)) {
//     let buffer = await q.download()
//     await m.reply(wait)    
//     try {
//       let media = await uploader(buffer)
//       let json = await (await fetch(`https://api.botcahx.eu.org/api/search/bard-img?url=${media}&text=${text}&apikey=${btc}`)).json() 
//       let buffer = await fetch(json);
    
//       let filePath = './tmp/tmp-sticker.png';
//       fs.writeFileSync(filePath, buffer);
  
//       m.reply(stiker_wait); 
//       let encmedia = await conn.sendImageAsSticker(m.chat, buffer, m, { packname: global.packname, author: global.author });
//        await fs.unlinkSync(encmedia);
//     await fs.unlinkSync(filePath);
//     } catch (err) {
//       throw `${eror}`
//     }
//   } else {
//     throw `Reply image with command ${usedPrefix + command} pertanyaan`
//   }
// }

// handler.help = ['bardimg']
// handler.tags = ['tools']
// handler.command = /^(bardimg|bardimage)$/i
// handler.limit = 2
// handler.group = false

// module.exports = handler
