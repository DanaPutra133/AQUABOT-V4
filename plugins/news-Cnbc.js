let fetch = require('node-fetch')
let handler = async (m, { conn }) => {
try {
  let res = await fetch(`https://api.betabotz.eu.org/api/news/cnbc?&apikey=${lann}`);
  let json = await res.json()
  let anu = `―CNBC―\n\nBerita: ${json.result[0].berita}\n\nBeritaUrl: ${json.result[0].berita_url}\n\nBerita di upload: ${json.result[0].berita_diupload} `  


conn.reply(m.chat, anu);;
} catch (e) {
throw `Internal server eror!`
  }
}
  
    handler.help = ['cnbc']
    handler.tags = ['news']
    handler.command = /^(cnbc)$/i
    handler.group = true
    
    module.exports = handler
    