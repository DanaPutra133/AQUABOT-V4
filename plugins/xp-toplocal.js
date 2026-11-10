// Helper format angka berpemisah koma (contoh: 1,000,000)
function formatNumber(num) {
    if (!num || isNaN(num)) return '0'
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

let handler = async (m, { conn, participants }) => {
    try {
        // Reaksi emoji jam saat membaca database
        await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

        let member = participants.map(u => u.id || u.jid)
        let users = global.db.data.users || {}
        let localData = {}

        // Filter anggota grup yang terdaftar di database (abaikan bot)
        for (let jid of member) {
            if (users[jid] && jid !== conn.user.jid) {
                localData[jid] = {
                    money: users[jid].money || 0,
                    level: users[jid].level || 1,
                    limit: users[jid].limit || 0
                }
            }
        }

        // Urutkan anggota berdasarkan jumlah Money terbanyak
        let sortedMoney = Object.entries(localData).sort((a, b) => b[1].money - a[1].money)
        let rankMoney = sortedMoney.map(v => v[0])
        let userRank = rankMoney.indexOf(m.sender) + 1

        let show = Math.min(10, sortedMoney.length)
        let topTen = sortedMoney.slice(0, show)

        let groupName = await conn.getName(m.chat).catch(() => 'Grup')

        // Resolusi Nama & Mentions secara Asynchronous
        let mentions = []
        let listText = await Promise.all(topTen.map(async ([userJid, data], i) => {
            mentions.push(userJid)
            let name = await conn.getName(userJid).catch(() => userJid.split('@')[0])
            let formattedMoney = formatNumber(data.money)

            return `${i + 1}. @${userJid.split('@')[0]} (${name})\n   ◦ *Money* : *${formattedMoney}*\n   ◦ *Level* : *${data.level}*`
        }))

        let teks = `*[ 🚩 ] T O P - L O C A L*\n`
        teks += `*[ 🏆 ] Peringkat Kamu :* *${userRank > 0 ? userRank : 'Belum Terdata'}* dari *${member.length}*\n`
        teks += `*[ 🔥 ] Grup :* ${groupName}\n\n`
        teks += listText.join('\n\n')
        teks += `\n\nSimple Bot Menu Kiryuu`

        await conn.reply(m.chat, teks.trim(), m, { mentions })

    } catch (e) {
        console.error('Error pada plugin toplocal:', e)
        m.reply('Terjadi kesalahan saat memuat papan peringkat top local grup!')
    }
}

handler.help = ['toplocal', 'toplokal']
handler.tags = ['xp', 'main']
handler.command = /^(toplokal|toplocal)$/i

handler.register = true
handler.group = true

export default handler