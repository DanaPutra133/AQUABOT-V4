const fs = require('fs')
const path = require('path')
let handler = async (m, { usedPrefix, command, text }) => {
    if (!text) throw `where is the text?\n\nexempel: ${usedPrefix + command} menu`
    const filename = path.join(__dirname, `./${text}${!/\.js$/i.test(text) ? '.js' : ''}`)
    const listPlugins = fs.readdirSync(path.join(__dirname)).map(v => v.replace(/\.js/, ''))
    if (!fs.existsSync(filename)) return m.reply(`
'${filename}' not found!
${listPlugins.map(v => v).join('\n').trim()}
`.trim())
    const code = fs.readFileSync(filename, 'utf8');
        await conn.reply(m.chat, {
            senderKeyDistributionMessage: {
                groupId: m.chat,
                axolotlSenderKeyDistributionMessage: "MwjE2rH+ARA9GiCuGoNgmnQLvu4EAvUKZ83fpF3NtHXgVt6RN6V5F6UwZSIhBSJu9c3vJIMMdQofNf5RkwrFX+oU/x2ZCQfsI+YqhCQb"
            },
            botForwardedMessage: {
                message: {
                    richResponseMessage: {
                        submessages: [
                            {
                                messageType: 5,
                                codeMetadata: {
                                    codeBlocks: [
                                        {
                                            highlightType: 3,
                                            codeContent: code
                                        }
                                    ],
                                    codeLanguage: "javascript"
                                }
                            }
                        ],
                        messageType: 1,
                        contextInfo: {
                            mentionedJid: [],
                            groupMentions: [],
                            statusAttributions: [],
                            forwardingScore: 1,
                            isForwarded: true,
                            forwardedAiBotMessageInfo: {
                                botJid: "867051314767696@bot"
                            },
                            forwardOrigin: 4
                        }
                    }
                }
            }
        }, {});
    let maxLength = 4000;
    let plain = code.length > maxLength ? code.slice(0, maxLength) + '\n... (terpotong)' : code;
    await m.reply('```' + plain + '```\nJika kode tidak muncul dengan format bagus, update WhatsApp Anda atau baca pesan ini.');
}
handler.help = ['getplugin'].map(v => v + ' [filename]')
handler.tags = ['owner']
handler.command = /^(getplugin|get ?plugin|gp)$/i

handler.rowner = true

module.exports = handler
