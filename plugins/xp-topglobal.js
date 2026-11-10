// Helper formatting angka besar (k, m, b, t, dst.)
function formatmoney(money) {
    if (!money || isNaN(money) || money <= 0) return '0'
    const suffixes = ['', 'k', 'm', 'b', 't', 'q', 'Q', 's', 'S', 'o', 'n', 'd', 'U', 'D', 'Td', 'qd', 'Qd', 'sd', 'Sd', 'od', 'nd', 'V', 'Uv', 'Dv', 'Tv', 'qv', 'Qv', 'sv', 'Sv', 'ov', 'nv', 'T', 'UT', 'DT', 'TT', 'qt', 'QT', 'st', 'ST', 'ot', 'nt']
    const suffixIndex = Math.floor(Math.log10(money) / 3)
    if (suffixIndex <= 0) return money.toLocaleString('id-ID')
    const validIndex = Math.min(suffixIndex, suffixes.length - 1)
    const scaledmoney = money / Math.pow(10, validIndex * 3)
    return scaledmoney.toFixed(2) + suffixes[validIndex]
}

let handler = async (m, { conn }) => {
    try {
        // Reaksi jam saat memproses data database
        await conn.sendMessage(m.chat, { react: { text: '🕒', key: m.key } })

        let users = global.db.data.users
        if (!users) return m.reply('Data pengguna belum tersedia di database!')

        // Sorting pengguna berdasarkan jumlah Money terbanyak
        let sortedMoney = Object.entries(users).sort((a, b) => (b[1].money || 0) - (a[1].money || 0))
        let getUser = sortedMoney.map(v => v[0])
        let rankUser = getUser.indexOf(m.sender) + 1
        
        let show = Math.min(10, sortedMoney.length)
        let topTen = sortedMoney.slice(0, show)

        // Resolusi Nama & Mentions Asynchronous (Mencegah [object Promise])
        let mentions = []
        let listText = await Promise.all(topTen.map(async ([userJid, data], i) => {
            mentions.push(userJid)
            let name = await conn.getName(userJid).catch(() => userJid.split('@')[0])
            let userMoney = formatmoney(data.money || 0)
            let userLevel = data.level || 1

            return `${i + 1}. @${userJid.split('@')[0]} (${name})\n   ◦ *Money* : *${userMoney}*\n   ◦ *Level* : *${userLevel}*`
        }))

        let teks = `[ 🌐 ] *T O P - G L O B A L*\n`
        teks += `[ 🏆 ] *Peringkat Kamu:* *${rankUser}* dari *${getUser.length}*\n\n`
        teks += listText.join('\n\n')
        teks += `\n\nSimple Bot Menu Kiryuu`

        await conn.reply(m.chat, teks.trim(), m, { mentions })

    } catch (e) {
        console.error('Error pada plugin topglobal:', e)
        m.reply('Terjadi kesalahan saat memuat papan peringkat top global!')
    }
}

handler.help = ['topglobal']
handler.tags = ['xp', 'main']
handler.command = /^(topglobal)$/i

handler.register = true

export default handler