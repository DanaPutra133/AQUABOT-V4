let handler = async (m, { conn }) => {
    conn.tebakhsr = conn.tebakhsr ? conn.tebakhsr : {}
    let id = m.chat
    if (!(id in conn.tebakhsr)) throw false
    let json = conn.tebakhsr[id][1]
    m.reply('```' + json.jawaban.replace(/[bcdfghjklmnpqrstvwxyz]/gi, '_') + '```\n*BALAS SOALNYA, BUKAN PESAN INI!*')
}
handler.command = /^hsr$/i

handler.limit = true
    
module.exports = handler