let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        let user = global.db.data.users[m.sender]
        if (!user) throw 'Data pengguna tidak ditemukan di database!'

        // Cek cooldown (10 menit / 600.000 ms)
        let cooldownTime = 600000
        let lastChallenge = user.lastchallenge || 0
        let __timers = (new Date() - lastChallenge)
        let _timers = (cooldownTime - __timers)
        let timers = clockString(_timers)

        if (new Date() - lastChallenge <= cooldownTime) {
            return conn.reply(m.chat, `⏳ Kamu masih lelah setelah menembak!\nSilakan istirahat dan coba lagi dalam *${timers}*`, m)
        }

        // Daftar hadiah acak
        let rewardsList = [
            { name: '🧸 Boneka Teddy Bear', type: 'item', count: 1 },
            { name: '🐰 Boneka Kelinci', type: 'item', count: 1 },
            { name: '🐼 Boneka Panda', type: 'item', count: 1 },
            { name: '🎮 Konsol Game', type: 'item', count: 1 },
            { name: '💵 Uang Tunai', type: 'money', count: Math.floor(Math.random() * 5000) + 1000 },
            { name: '💎 Diamond', type: 'diamond', count: Math.floor(Math.random() * 3) + 1 },
            { name: '📈 EXP Bonus', type: 'exp', count: Math.floor(Math.random() * 800) + 200 },
            { name: '🥤 Potion', type: 'potion', count: Math.floor(Math.random() * 3) + 1 },
            { name: '📦 Common Crate', type: 'common', count: 1 }
        ]

        // 1. Pesan Mulai Menembak
        await conn.reply(m.chat, `🎯 *[ CHALLENGE SHOOTING TARGET ]*\n\n@${m.sender.split('@')[0]} bersiap membidik sasaran... 🎯🔫`, m, { mentions: [m.sender] })
        
        // Simulasi bidik (delay 2.5 detik)
        await delay(2500)

        // Penentuan hasil tembakan (Random: 30% Headshot, 50% Hit, 20% Miss)
        let shootOutcome = Math.random()
        
        if (shootOutcome < 0.20) {
            // Meleset / Miss
            user.lastchallenge = new Date().getTime()
            return await conn.reply(m.chat, `❌ *Tembakan Meleset!*\n\nPeluru kamu melenceng jauh dari papan target. Sayang sekali tidak mendapatkan hadiah kali ini!`, m)
        }

        // Jika kena target (Hit / Headshot)
        let isHeadshot = shootOutcome >= 0.70
        let prize = pickRandom(rewardsList)

        // Update database sesuai jenis hadiah
        if (prize.type === 'money') user.money = (user.money || 0) + prize.count
        else if (prize.type === 'diamond') user.diamond = (user.diamond || 0) + prize.count
        else if (prize.type === 'exp') user.exp = (user.exp || 0) + prize.count
        else if (prize.type === 'potion') user.potion = (user.potion || 0) + prize.count
        else if (prize.type === 'common') user.common = (user.common || 0) + prize.count
        else if (prize.type === 'item') {
            // Menyimpan item koleksi ke objek inventory/items user
            if (!user.items) user.items = {}
            user.items[prize.name] = (user.items[prize.name] || 0) + prize.count
        }

        user.lastchallenge = new Date().getTime()

        let resultText = `
🎯 *[ HASIL TEMBAKAN ]* 🎯

👤 *Penembak:* @${m.sender.split('@')[0]}
💥 *Status:* ${isHeadshot ? '💥 *PERFECT HEADSHOT!* (100pt)' : '🎯 *TARGET HIT!* (50pt)'}
🎁 *Hadiah Utama:* *${prize.count}x ${prize.name}*

Selamat! Hadiah telah ditambahkan ke database/inventory kamu.
`.trim()

        await conn.reply(m.chat, resultText, m, { mentions: [m.sender] })

    } catch (e) {
        console.error(e)
        m.reply('Terjadi kesalahan saat menjalankan challenge menembak!')
    }
}

handler.help = ['dordor']
handler.tags = ['rpg']
handler.command = /^(dordor)$/i
handler.group = true

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}

function clockString(ms) {
    if (isNaN(ms) || ms <= 0) return '00 Minutes 00 Seconds'
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [
        m.toString().padStart(2, '0') + ' Menit ',
        s.toString().padStart(2, '0') + ' Detik'
    ].join('')
}