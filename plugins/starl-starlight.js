let handler = async (m, { conn, usedPrefix: _p, args, command }) => {

    let user = global.db.data.users[m.sender]
    let oo = user.starlightTime
 
let judul = `
  *_⭐ Starlight Killua Fourteen ⭐_*
        
user name : *${user.name}*

member starlight : ${oo ? 'yes' : 'no'}
level starlight : ${user.lvlstarlight}
total poin : ${user.totalpoin}/30 
pendapatan : ${user.hasilnya} / 15000 saldo
`
let msg = {
		viewOnceMessage: {
			message: {
				messageContextInfo: {
					deviceListMetadata: {},
					deviceListMetadataVersion: 2,
				},
				interactiveMessage: {
					body: {
						text: judul,
					},
					footer: {
						text: wm,
					},
					header: {
						title: '',
						subtitle: '',
						hasMediaAttachment: false
					},
					nativeFlowMessage: {
						buttons: [
							{
              "name": "quick_reply",
              "buttonParamsJson":
JSON.stringify({
 "display_text": "aktifkan sl [IDR 10K saldo]",
"id": ".starlighton"
              })              
            }
						],
					},
					contextInfo: {
						quotedMessage: m.message,
						participant: m.sender,
						...m.key
					}
				},
			},
		},
	};
	
    if (oo === 1) return m.reply(judul)
    if (oo === 0) return conn.relayMessage(m.chat, msg, { });
}
handler.help = ['starlight']
handler.tags = ['starl']
handler.command = /^(starlight)$/i

module.exports = handler