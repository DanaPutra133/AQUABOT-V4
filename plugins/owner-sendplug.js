let fs = require('fs')

let handler = async (m, {conn,args,text,usedPrefix,command}) => {
let input = `• *Example :* ${usedPrefix + command} kemii-menu.js`
	if (!text) return m.reply(input)
	let [jid, file, pesan] = text.split('|');
	try {
				if (!jid) return m.reply(`tag/nomor nya banh`)
				jid = jid.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
                let data = (await conn.onWhatsApp(jid))[0] || {};
				if (!data.exists) throw 'Nomer tidak terdaftar di whatsapp.';
				if (!file) return m.reply(`nama filenya apa banh?`)
                if (!pesan) return m.reply(`kasih pesannya banh`)
                const isValid = await conn.onWhatsApp(text + "@s.whatsapp.net");
             	if (isValid.length == 0) {
	        	return m.reply("Number not in whatsapp!");
	            }
				var user_bot = await fs.readFileSync(`./plugins/${file}.js`)
				conn.sendMessage(jid, {
					document: user_bot,
					caption: `*Kiriman Plugins* \n> Dari: ${m.name}\n> Namafile: ${file}\n\n${pesan}`,
					mimetype: 'document/js',
					fileName: `${file}.js`,
				},{quoted: m})
   } catch (e) { 
   	m.reply('terjadi kesalahan. Mungkin file nya tidak sesuai')
   }
m.reply('```Success sending file to : ```' + args[0])
}
handler.help = ['sendfitur']
handler.tags = ['owner']
handler.command = /^(sendfitur)$/i
handler.rowner = true

module.exports = handler