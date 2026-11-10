let handler = async (m, { conn }) => {
    try {
        let user = global.db.data.users[m.sender]
        if (!user) return m.reply('Kamu belum terdaftar!')

        if (user.dungeon2Floor == null) user.dungeon2Floor = 1
        if (user.dungeon2Wins == null) user.dungeon2Wins = 0
        if (user.money == null) user.money = 0
        if (user.exp == null) user.exp = 0

        let floor = user.dungeon2Floor
        let level = user.level || 1

        // TIER DUNGEON
        let tier = Math.floor((floor - 1) / 10) + 1

        let tiers = [
            { name: '🟢 EASY', monster: 'Goblin' },
            { name: '🔵 NORMAL', monster: 'Orc' },
            { name: '🟣 HARD', monster: 'Dark Knight' },
            { name: '🔴 NIGHTMARE', monster: 'Demon' },
            { name: '💀 HELL', monster: 'Ancient Dragon' },
            { name: '🌌 ABYSS', monster: 'Void Entity' }
        ]

        let currentTier = tiers[Math.min(tier - 1, tiers.length - 1)]

        // STAT MONSTER
        let monsterHP = Math.floor(100 * Math.pow(1.5, tier - 1) + floor * 15)
        let monsterATK = Math.floor(15 * Math.pow(1.4, tier - 1) + floor * 3)

        // PELUANG MENANG
        let chance = Math.max(15, Math.min(95, 85 - (tier - 1) * 10 + Math.min(level * 2, 15)))

        // NAMA MONSTER
        let monsterName = tier === 1 ? 'Goblin Warrior' : currentTier.monster

        // TAMPILAN DUNGEON
        let intro = `🏰 *[ DUNGEON 2 ]*\n\n`
        intro += `👤 Petualang: @${m.sender.split('@')[0]}\n`
        intro += `📍 Lantai: ${floor}\n`
        intro += `🏆 Tier: ${currentTier.name}\n`
        intro += `👹 Monster: ${monsterName}\n\n`
        intro += `❤️ HP Monster: ${monsterHP.toLocaleString('id-ID')}\n`
        intro += `⚔️ ATK Monster: ${monsterATK.toLocaleString('id-ID')}\n`
        intro += `🎯 Peluang menang: ${chance}%\n\n`
        intro += `⚔️ Kamu mulai memasuki dungeon...`

        await conn.reply(m.chat, intro, m, {
            mentions: [m.sender]
        })

        await new Promise(resolve => setTimeout(resolve, 2000))

        // PERTARUNGAN
        let menang = Math.random() * 100 < chance

        if (!menang) {
            let damage = Math.floor(Math.random() * monsterATK) + 1

            return conn.reply(m.chat,
                `💀 *DUNGEON FAILED!*\n\n` +
                `👹 Monster: ${monsterName}\n` +
                `⚔️ Damage monster: ${damage}\n` +
                `📍 Lantai: ${floor}\n\n` +
                `Kamu gagal melewati lantai ini!\n` +
                `Tingkatkan level dan coba lagi.`,
                m
            )
        }

        // REWARD
        let moneyReward = Math.floor(500 * Math.pow(1.5, tier - 1) + floor * 100)
        let expReward = Math.floor(100 * Math.pow(1.3, tier - 1) + floor * 10)

        user.money += moneyReward
        user.exp += expReward
        user.dungeon2Wins += 1

        let clearedFloor = floor
        user.dungeon2Floor += 1

        // CEK TIER BARU
        let nextTier = Math.floor((user.dungeon2Floor - 1) / 10) + 1

        let result = `🏆 *[ DUNGEON CLEARED! ]*\n\n`
        result += `👤 Petualang: @${m.sender.split('@')[0]}\n`
        result += `📍 Lantai selesai: ${clearedFloor}\n`
        result += `👹 Monster dikalahkan: ${monsterName}\n\n`
        result += `🎁 *REWARD*\n`
        result += `💵 Uang: +${moneyReward.toLocaleString('id-ID')}\n`
        result += `✨ EXP: +${expReward.toLocaleString('id-ID')}\n\n`

        if (nextTier > tier) {
            let nextName = tiers[Math.min(nextTier - 1, tiers.length - 1)].name
            result += `🎉 *TIER UP!*\n`
            result += `🏆 Tier baru: ${nextName}\n\n`
        }

        result += `📍 Lantai berikutnya: ${user.dungeon2Floor}\n`
        result += `🏰 Teruskan petualanganmu!`

        await conn.reply(m.chat, result, m, {
            mentions: [m.sender]
        })

    } catch (e) {
        console.error(e)
        m.reply('Terjadi kesalahan pada Dungeon 2!')
    }
}

handler.help = ['dungeon2']
handler.tags = ['rpg']
handler.command = /^(dungeon2)$/i
handler.rpg = true

export default handler