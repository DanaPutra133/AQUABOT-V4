// const { webcrack } = await import('webcrack');

// let handler = async (m ,{ conn, text }) => {

// let teks
// if (m.quoted) {
//  teks = m.quoted ? m.quoted.text : text
// } else if (text) {
// teks = text ? text : text
// } else return m.reply(`Input Code!`)
// 	try {
// 		let result = await webcrack(teks);
// 		m.reply(result.code)
// 	} catch (e) {
// 		console.log(e)
// 		throw "Error kak!"
// 	}
// }
// handler.command = handler.help = ["dec"]:
// handler.tags = ["tools"];
// module.exports = handler;