let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        let target = m.mentionedJid?.[0] ? m.mentionedJid[0] : (m.quoted ? m.quoted.sender : m.sender)

        if (!global.db.data.users) global.db.data.users = {}
        let user = global.db.data.users[target]

        if (!user) {
            user = global.db.data.users[target] = {
                name: '',
                money: 0,
                bank: 0,
                level: 1,
            }
        }

        if (user.money == null) user.money = 0
        if (user.bank == null) user.bank = 0
        if (user.level == null) user.level = 1

        let waName = await conn.getName(target).catch(() => null)
        let name = user.name?.trim() || waName || m.pushName || m.name || 'User'

        if (!user.name) user.name = name

        let balance = user.money ?? 0
        let tier = ''

        // SISTEM TIER EKONOMI
        if (balance >= 100000000000) {
            tier = '👑 Sultan I'
        } else if (balance >= 50000000000) {
            tier = '👑 Sultan II'
        } else if (balance >= 10000000000) {
            tier = '👑 Sultan III'
        } else if (balance >= 5000000000) {
            tier = '👑 Sultan IV'
        } else if (balance >= 1000000000) {
            tier = '👑 Sultan V'
        } else if (balance >= 500000000) {
            tier = '🥇 Gold I'
        } else if (balance >= 250000000) {
            tier = '🥇 Gold II'
        } else if (balance >= 100000000) {
            tier = '🥇 Gold III'
        } else if (balance >= 50000000) {
            tier = '🥇 Gold IV'
        } else if (balance >= 10000000) {
            tier = '🥇 Gold V'
        } else if (balance >= 5000000) {
            tier = '🥈 Silver I'
        } else if (balance >= 2500000) {
            tier = '🥈 Silver II'
        } else if (balance >= 1000000) {
            tier = '🥈 Silver III'
        } else if (balance >= 500000) {
            tier = '🥈 Silver IV'
        } else if (balance >= 250000) {
            tier = '🥈 Silver V'
        } else if (balance >= 100000) {
            tier = '🥉 Bronze I'
        } else if (balance >= 50000) {
            tier = '🥉 Bronze II'
        } else if (balance >= 25000) {
            tier = '🥉 Bronze III'
        } else if (balance >= 10000) {
            tier = '🥉 Bronze IV'
        } else if (balance >= 5000) {
            tier = '🥉 Bronze V'
        } else {
            tier = '🪨 Broke V'
        }

        let capt = `乂  *💵 D O M P E T 💵*  乂\n\n`
        capt += ` ◦ 👤 *Nama* = ${name}\n`
        capt += ` ◦ 💵 *Uang* = ${balance.toLocaleString('id-ID')}\n`
        capt += ` ◦ 💰 *Tier* = ${tier}\n`

        await conn.sendMessage(
            m.chat,
            {
                image: {
                    url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSIiXrZfzbrdryj4p1M69g0gLTVE7RR00k6kXSu4vPz12R5MhFQ-vhHjKE&s",
                },
                caption: capt,
                mentions: [target],
            },
            { quoted: m }
        )

    } catch (e) {
        console.error('Error pada plugin dompet:', e)
        m.reply('⚠️ Terjadi kesalahan saat membuka dompet!')
    }
}

handler.help = ['dompet']
handler.tags = ['rpg']
handler.command = /^dompet$/i
handler.rpg = true

export default handler