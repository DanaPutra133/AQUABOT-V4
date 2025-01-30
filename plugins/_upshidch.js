let handler = async (m, { conn, text }) => {
    if (!m.quoted) return m.reply("Reply audio nya kocak")
    let [title, jidny] = text.split('|').map(v => v.trim())

    if (!title) return m.reply("title musik nya mana")
    if (!jidny) return m.reply("ID channel lu mana jing")

    try {
        await conn.sendMessage(jidny, {
            audio: await m.quoted.download(),
            mimetype: "audio/mp4",
            ptt: true,
            contextInfo: {
                forwardingScore: 2001,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                    newsletterJid: jidny,
                    serverMessageId: 2001,
                    newsletterName: "”Xshiina - Kapan Ada Api”"
                },
                externalAdReply: {
                    title: title,
                    body: null,
                    thumbnailUrl: "https://f.balxzzy.xyz/component/logoku.png",
                    sourceUrl: "https://comunity.balxzzy.xyz",
                    mediaType: 1,
                    showAdAttribution: true,
                    renderLargerThumbnail: false
                }
            }
        })
        const data = `
{ 
    status: 200,
    success: true,
    dev: "balxzzy",
    jid: "${jidny}"
}`
m.reply(data)
    } catch (e) {
        m.reply("Lu ga admin njir di ch nya, atau cek Id nya coba")
    }
}

handler.help = ['up_mp3']
handler.tags = ['main']
handler.command = /^(up_mp3|upch)$/i

export default handler