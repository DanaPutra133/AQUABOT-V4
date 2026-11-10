let handler = async (m, { conn, usedPrefix }) => {
    try {
        let user = global.db.data.users[m.sender]
        if (!user) return m.reply(`Kamu belum terdaftar!\nKetik *${usedPrefix}daftar* dulu ya.`)

        // Cooldown 5 menit
        let cooldown = 60 * 1000
        let last = user.lastbasket || 0
        let sisa = cooldown - (Date.now() - last)

        if (Date.now() - last < cooldown) {
            return conn.reply(m.chat, `⏳ Kamu masih capek habis lempar bola!\nIstirahat dulu, coba lagi dalam *${clockString(sisa)}*`, m)
        }

        // DAFTAR HADIAH + BOBOT (chance) - Urut dari besar ke kecil
        // Total chance HARUS 100
        let rewardsList = [
            { name: 'Uang Tunai', emoji: '💵', type: 'money', count: () => Math.floor(Math.random() * 1001) + 500, chance: 35 },
            { name: 'EXP Bonus', emoji: '📈', type: 'exp', count: () => Math.floor(Math.random() * 201) + 100, chance: 20 },
            { name: 'Potion', emoji: '🥤', type: 'potion', count: () => Math.floor(Math.random() * 2) + 1, chance: 15 },
            { name: 'Common Crate', emoji: '📦', type: 'common', count: () => 1, chance: 12 },
            { name: 'Sepatu Basket', emoji: '👟', type: 'item', count: () => 1, chance: 8 },
            { name: 'Jersey Limited', emoji: '👕', type: 'item', count: () => 1, chance: 5 },
            { name: 'Diamond', emoji: '💎', type: 'diamond', count: () => Math.floor(Math.random() * 3) + 1, chance: 3 },
            { name: 'Bola Emas', emoji: '🏀', type: 'item', count: () => 1, chance: 1.5 },
            { name: 'Sepatu Legendaris MJ', emoji: '👑', type: 'item', count: () => 1, chance: 0.5 },
        ]

        await conn.reply(m.chat, `🏀 *[ BASKETBALL CHALLENGE ]*\n\n@${m.sender.split('@')[0]} mengambil ancang-ancang...\nMenggiring bola... melompat...`, m, { mentions: [m.sender] })

        await delay(2500)

        // 1. TENTUKAN MASUK / TIDAK - 50/50
        let isMasuk = Math.random() < 0.65
        user.lastbasket = Date.now()

        // KALAU GAGAL (50%)
        if (!isMasuk) {
            let gagalText = pickRandom([
                'Bola mentok di ring dan mental jauh! 😭',
                'Lemparan kamu terlalu kuat, bola melewati ring!',
                'Airball! Bola bahkan tidak menyentuh ring...',
                'Hampir masuk! Bola berputar di bibir ring lalu keluar.'
            ])
            return conn.reply(m.chat, `❌ *LEMPARAN GAGAL!*\n\n${gagalText}\nCoba lagi nanti ya!`, m)
        }

        // KALAU MASUK (50%) -> Baru undi hadiah
        let prize = pickWeighted(rewardsList)
        let jumlah = prize.count() // Panggil fungsinya karena count-nya acak

        // Simpan ke database
        if (prize.type === 'item') {
            if (!user.items) user.items = {}
            user.items[prize.name] = (user.items[prize.name] || 0) + jumlah
        } else {
            user[prize.type] = (user[prize.type] || 0) + jumlah
        }

        // Tentukan rarity dari chance-nya buat teks
        let rarity = prize.chance >= 20 ? '🟢 COMMON' : prize.chance >= 8 ? '🔵 RARE' : prize.chance >= 3 ? '🟣 EPIC' : prize.chance >= 1 ? '🟡 LEGENDARY' : '🔴 MYTHIC'

        let resultText = `🏀 *[ GOALLL! BOLA MASUK! ]* 🏀\n\n👤 *Pemain:* @${m.sender.split('@')[0]}\n🎯 *Status:* *SWISHHH!* Masuk Bersih! (50/50)\n⭐ *Rarity:* ${rarity} (${prize.chance}%)\n🎁 *Hadiah:* *${jumlah}x ${prize.emoji} ${prize.name}*\n\nHadiah sudah masuk ke inventory kamu!`.trim()

        await conn.reply(m.chat, resultText, m, { mentions: [m.sender] })

    } catch (e) {
        console.error(e)
        m.reply('Terjadi kesalahan saat main basket!')
    }
}

handler.help = ['basket']
handler.tags = ['rpg']
handler.command = /^(basket|basketball|lemparbola)$/i
handler.group = true

export default handler

// ===== FUNGSI PEMBANTU =====

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function clockString(ms) {
    if (isNaN(ms) || ms <= 0) return '00 Menit 00 Detik'
    let m = Math.floor(ms / 60000)
    let s = Math.floor(ms / 1000) % 60
    return `${m.toString().padStart(2, '0')} Menit ${s.toString().padStart(2, '0')} Detik`
}

// FUNGSI BARU: Weighted Random
// Cara kerja: Buat angka acak 0-100, lalu jalan dari hadiah pertama
// sampai angka acaknya habis. Hadiah dengan chance besar lebih gampang kena.
function pickWeighted(list) {
    let total = list.reduce((sum, item) => sum + item.chance, 0)
    let random = Math.random() * total
    for (let item of list) {
        if (random < item.chance) return item
        random -= item.chance
    }
    return list[list.length - 1]
}