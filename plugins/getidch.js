let handler = async (m, {conn}) => {
if (!m.quoted) throw '[❗] Reply pesan dari channel yang ingin dicari!'
try {
let id = (await m.getQuotedObj()).msg.contextInfo.forwardedNewsletterMessageInfo
let teks = '```Channel Name:```' + ' `' + `${id.newsletterName}` + '`\n'
teks += '```Channel Id:```' + ' `' + `${id.newsletterJid}` + '`'
await conn.reply(m.chat, teks.trim(), m)
} catch (e) {
throw '[❗] Terjadi kesalahan!'
}
}
handler.help = handler.command = ['channelinfo']
handler.tags = ['main']
module.exports = handler