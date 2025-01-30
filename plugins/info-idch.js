let handler = async (m, {conn}) => {
if (!m.quoted) throw '[❗] Reply pesan dari channel yang ingin dicari!'
let id = (await m.getQuotedObj()).msg.contextInfo.forwardedNewsletterMessageInfo
let teks = `${id.newsletterJid}`
await conn.reply(m.chat, teks.trim(), m)
}
handler.help = handler.command = ['channelinfo','idch']
handler.tags = ['main']
module.exports = handler