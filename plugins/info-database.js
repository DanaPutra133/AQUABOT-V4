import moment from 'moment-timezone'

let handler = async (m, { conn }) => {
    try {
        let users = global.db?.data?.users || {}
        let totalreg = Object.keys(users).length
        let rtotalreg = Object.values(users).filter(user => user.registered === true).length

        let name = await conn.getName(m.sender)
        let salam = ucapan()

        let kiku = `
┌─〔 *DATABASE STATS* 〕
│
├ ☀️ *${salam}, ${name}*
├ 📊 *Total Pengguna:* ${totalreg} User
└ 📝 *Terdaftar (Register):* ${rtotalreg} User
`.trim()

        await conn.sendPresenceUpdate('composing', m.chat)
        await conn.sendMessage(m.chat, { text: kiku }, { quoted: m })

    } catch (e) {
        console.error(e)
        m.reply('⚠️ Terjadi kesalahan saat mengambil statistik database.')
    }
}

handler.help = ['database']
handler.tags = ['info']
handler.command = /^(pengguna|(jumlah)?database|user)$/i

export default handler

function ucapan() {
    const time = moment.tz('Asia/Jakarta').format('HH')
    let res = "Selamat Malam"
    if (time >= 4) {
        res = "Selamat Pagi"
    }
    if (time >= 10) {
        res = "Selamat Siang"
    }
    if (time >= 15) {
        res = "Selamat Sore"
    }
    if (time >= 18) {
        res = "Selamat Malam"
    }
    return res
}