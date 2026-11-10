let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        let user = global.db.data.users[m.sender]
        if (!user) throw 'Data pengguna tidak ditemukan di database!'

        // Inisialisasi namespace room rumah hantu terisolasi
        conn.rumahHantu = conn.rumahHantu ? conn.rumahHantu : {}
        let room = conn.rumahHantu[m.sender]

        let action = (args[0] || '').toLowerCase()

        // --- OPTION: RESET SESI ---
        if (action === 'reset' || action === 'stop') {
            if (!room) return conn.reply(m.chat, 'Kamu sedang tidak berada dalam sesi Rumah Hantu.', m)
            delete conn.rumahHantu[m.sender]
            return conn.reply(m.chat, '🛑 *Sesi Rumah Hantu berhasil dihentikan/direset.*', m)
        }

        // --- MEMULAI GAME BARU (.rumahhantu) ---
        if (room) {
            return conn.reply(m.chat, `⚠️ Kamu sedang berada di dalam Rumah Hantu! (Ronde ${room.round}/8)\n\nKetik langsung di chat:\n👉 *maju* | *mundur* | *kiri* | *kanan*\n\n*(Atau ketik "${usedPrefix}${command} reset" untuk membatalkan)*`, m)
        }

        // Cek Cooldown (5 Menit)
        let cooldownTime = 300000
        let lastExplore = user.lastrumahhantu || 0
        if (new Date() - lastExplore <= cooldownTime) {
            let _timers = (cooldownTime - (new Date() - lastExplore))
            return conn.reply(m.chat, `⏳ Kamu masih trauma setelah dari Rumah Hantu!\nTunggu *${clockString(_timers)}* lagi untuk masuk kembali.`, m)
        }

        // Inisialisasi Sesi Baru Pemain
        conn.rumahHantu[m.sender] = {
            round: 1,
            hp: 100,
            chat: m.chat
        }

        let startText = `
🏚️ *[ RUMAH HANTU - ANKER HOUSE ]* 🏚️

Kamu memberanikan diri masuk ke rumah tua tak berpenghuni...
Pintu utama terkunci rapat di belakangmu! 🚪💥

*Sistem Permainan:*
• Capai **Ronde 8** untuk menemukan jalan keluar & hadiah!
• Nyawa awal: **100 HP** ❤️
• Waspada hantu berdarah dingin dengan damage tinggi! 👻

Ketik langsung di chat untuk memilih arah:
👉 *maju*
👉 *mundur*
👉 *kiri*
👉 *kanan*
`.trim()

        return await conn.reply(m.chat, startText, m)

    } catch (e) {
        console.error(e)
        m.reply('Terjadi kesalahan pada fitur Rumah Hantu!')
    }
}

// --- BEFORE HANDLER TERISOLASI (HANYA AKTIF JIKA PEMAIN DALAM ROOM) ---
handler.before = async function (m) {
    this.rumahHantu = this.rumahHantu ? this.rumahHantu : {}
    let room = this.rumahHantu[m.sender]

    // Jika user tidak sedang bermain rumah hantu, abaikan total (bebas bentrok!)
    if (!room) return

    let txt = (m.text || '').toLowerCase().trim()
    let validDirections = ['maju', 'mundur', 'kiri', 'kanan']

    if (!validDirections.includes(txt)) return

    let user = global.db.data.users[m.sender]

    // Daftar Hantu & Jumpscare Ber-Damage Tinggi
    let jumpscares = [
        { ghost: '👻 Pocong Melayang', msg: 'Pocong muka gosong berdiri 1 cm tepat di depan mukamu!', damage: 25 },
        { ghost: '👩‍🦳 Kuntilanak Merah', msg: 'Suara melengking memecah telinga dan kuku panjang merobek bahumu!', damage: 30 },
        { ghost: '👹 Genderuwo Raksasa', msg: 'Tubuh berbulu hitam membantingmu ke dinding ruangan!', damage: 40 },
        { ghost: '🩸 Tuyul Berdarah Ganas', msg: 'Kawanan tuyul menggerogoti kakimu di kegelapan!', damage: 20 },
        { ghost: '👵 Nenek Gayung Pembantai', msg: 'Nenek tua mengayunkan gayung besi dan menghantam kepalamu!', damage: 35 },
        { ghost: '💀 Tengkorak Berjalan', msg: 'Tangan tengkorak mencengkeram lehermu dari balik lantai jebol!', damage: 28 },
        { ghost: '🎎 Jenglot Kuno', msg: 'Mata merah jenglot memancarkan energi magis maut!', damage: 45 },
        { ghost: '🧟‍♂️ Suster Gepeng', msg: 'Pintu lift terjepit menimpa tubuhmu secara tiba-tiba!', damage: 32 },
        { ghost: '👑 Ratu Kegelapan', msg: 'Bisikan mistis mencabut separuh jiwa dan energi hidupmu!', damage: 50 },
        { ghost: '🎃 Kuyang Terbang', msg: 'Kepala terbang dengan organ terurai mencekik lehermu dari udara!', damage: 38 }
    ]

    let currentGhost = pickRandom(jumpscares)
    let isTrap = Math.random() < 0.75 // 75% Peluang Jumpscare

    // JIKA RONDE KE-8 (PINTU KELUAR & WIN CONDITION)
    if (room.round >= 8) {
        let rewardMoney = Math.floor(Math.random() * 25000) + 10000
        let rewardExp = Math.floor(Math.random() * 5000) + 1000
        let rewardDiamond = Math.floor(Math.random() * 8) + 2

        user.money = (user.money || 0) + rewardMoney
        user.exp = (user.exp || 0) + rewardExp
        user.diamond = (user.diamond || 0) + rewardDiamond
        user.lastrumahhantu = new Date().getTime()

        delete this.rumahHantu[m.sender]

        let winText = `
🎉 *[ RONDE 8 - JALAN KELUAR DITEMUKAN! ]* 🎉

Kamu melangkah ke arah *${txt.toUpperCase()}* dan melihat cahaya terang... 🚪✨
Kamu berhasil kabur dari Rumah Hantu dengan sisa nyawa: **${room.hp} HP** ❤️!

🎁 *HADIAH KELULUSAN:*
• 💵 *Money:* +${rewardMoney.toLocaleString('id-ID')}
• 📈 *EXP:* +${rewardExp.toLocaleString('id-ID')}
• 💎 *Diamond:* +${rewardDiamond}
`.trim()

        return await this.reply(m.chat, winText, m)
    }

    // PROSES RONDE 1 - 7
    if (isTrap) {
        room.hp -= currentGhost.damage

        if (room.hp <= 0) {
            user.lastrumahhantu = new Date().getTime()
            delete this.rumahHantu[m.sender]
            return this.reply(m.chat, `☠️ *GAME OVER (DEATH)!*\n\nKamu tewas diserang oleh *${currentGhost.ghost}* di Ronde ${room.round}!\nDamage fatal: **-${currentGhost.damage} HP**. Nyawamu habis (0 HP).`, m)
        }

        let roundText = `
💥 *JUMPSCARE FATAL! (Ronde ${room.round}/8)*

Kamu melangkah ke arah *${txt.toUpperCase()}*...
😱 *${currentGhost.msg}*
Hantu: *${currentGhost.ghost}*
Damage: **-${currentGhost.damage} HP** 🩸
Sisa Nyawa: **${room.hp} HP** ❤️

Pilih arah selanjutnya:
👉 Ketik *maju* | *mundur* | *kiri* | *kanan*
`.trim()
        await this.reply(m.chat, roundText, m)
    } else {
        let safeText = `
🕯️ *SELAMAT & HENING! (Ronde ${room.round}/8)*

Kamu melangkah ke arah *${txt.toUpperCase()}*...
Lorong ini aman. Kamu berhasil menghindari terkaman hantu!
Sisa Nyawa: **${room.hp} HP** ❤️

Pilih arah selanjutnya:
👉 Ketik *maju* | *mundur* | *kiri* | *kanan*
`.trim()
        await this.reply(m.chat, safeText, m)
    }

    room.round += 1
}

// METADATA TERISOLASI KHUSUS RUMAH HANTU
handler.help = ['rumahhantu', 'explorerh']
handler.tags = ['rpg']
handler.command = /^(rumahhantu|explorerh)$/i
handler.group = true

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function clockString(ms) {
    if (isNaN(ms) || ms <= 0) return '00 Menit 00 Detik'
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [
        m.toString().padStart(2, '0') + ' Menit ',
        s.toString().padStart(2, '0') + ' Detik'
    ].join('')
}