let handler = async (m, { conn, args, usedPrefix, command }) => {
    conn.adupanco = conn.adupanco ? conn.adupanco : {}
    let user = global.db.data.users[m.sender]

    let action = (args[0] || '').toLowerCase()

    // --- RESET SESI PANCO ---
    if (action === 'reset' || action === 'clear') {
        let count = 0
        for (let key in conn.adupanco) {
            let room = conn.adupanco[key]
            if (room.challenger === m.sender || room.target === m.sender || m.isOwner) {
                if (room.timeout) clearTimeout(room.timeout)
                delete conn.adupanco[key]
                count++
            }
        }
        return m.reply(count > 0 ? `✅ Berhasil me-reset ${count} sesi adu panco!` : 'Tidak ada sesi panco kamu yang aktif.')
    }

    // --- MENANTANG PEMAIN LAIN ---
    let targetJid = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted ? m.quoted.sender : null
    if (!targetJid) {
        return m.reply(`🤼‍♂️ *[ MENU ADU PANCO ]*\n\n• *${usedPrefix}${command} @user [bet]* (Menantang)\n• *${usedPrefix}${command} reset* (Reset jika game stuck)\n\n*Saat ditantang/bermain:* Ketik langsung *terima*, *tolak*, *dorong*, *tahan*, *power*, atau *nyerah* di chat.`)
    }

    if (targetJid === m.sender) return m.reply('Kamu tidak bisa menantang dirimu sendiri!')
    if (targetJid === conn.user.jid) return m.reply('Bot tidak bisa diajak adu panco!')

    let isChallengerBusy = Object.values(conn.adupanco).some(r => (r.challenger === m.sender || r.target === m.sender))
    let isTargetBusy = Object.values(conn.adupanco).some(r => (r.challenger === targetJid || r.target === targetJid))

    if (isChallengerBusy) return m.reply(`Kamu masih berada dalam sesi adu panco!\nKetik *${usedPrefix}${command} reset* jika ingin membatalkan.`)
    if (isTargetBusy) return m.reply(`@${targetJid.split('@')[0]} sedang berada dalam sesi adu panco lain!`, null, { mentions: [targetJid] })

    let bet = args[1] && !isNaN(args[1]) ? Math.max(100, parseInt(args[1])) : 500
    if ((user.money || 0) < bet) return m.reply(`Uang kamu tidak cukup untuk bertaruh sebesar *${bet} Money*!`)

    let targetUser = global.db.data.users[targetJid]
    if (!targetUser) return m.reply('Target tidak terdaftar di database!')
    if ((targetUser.money || 0) < bet) return m.reply(`Uang @${targetJid.split('@')[0]} tidak cukup untuk taruhan *${bet} Money*!`, null, { mentions: [targetJid] })

    let roomKey = `panco_${m.sender}_${targetJid}`
    let challengerName = await conn.getName(m.sender)
    let targetName = await conn.getName(targetJid)

    conn.adupanco[roomKey] = {
        challenger: m.sender,
        target: targetJid,
        challengerName,
        targetName,
        bet,
        status: 'WAITING',
        turn: m.sender,
        hp: { challenger: 100, target: 100 },
        timeout: setTimeout(() => {
            if (conn.adupanco[roomKey]) {
                conn.reply(m.chat, '⏳ *[ ADU PANCO TIMEOUT ]*\nTantangan/Permainan dibatalkan karena tidak ada respons selama 2 menit.', null)
                delete conn.adupanco[roomKey]
            }
        }, 120000)
    }

    let inviteText = `🤼‍♂️ *[ TANTANGAN ADU PANCO ]*\n\n@${m.sender.split('@')[0]} menantang @${targetJid.split('@')[0]} bertaruh *${bet} Money*!\n\nKetik di chat:\n👉 *terima* (Mulai bertarung)\n👉 *tolak* (Membatalkan)`
    await conn.reply(m.chat, inviteText, m, { mentions: [m.sender, targetJid] })
}

// --- BEFORE HANDLER KHUSUS (Mencegah Bentrok Kata Kunci Umum) ---
handler.before = async function (m) {
    this.adupanco = this.adupanco ? this.adupanco : {}
    let txt = (m.text || '').toLowerCase().trim()
    if (!txt) return

    // Cek apakah pengirim pesan terdaftar di room adu panco
    let roomKey = Object.keys(this.adupanco).find(k => this.adupanco[k].challenger === m.sender || this.adupanco[k].target === m.sender)
    if (!roomKey) return // Jika tidak di dalam room, abaikan (bebas dari bentrok!)

    let room = this.adupanco[roomKey]
    let user = global.db.data.users[m.sender]

    // 1. RESPONS TERIMA
    if (txt === 'terima' || txt === 'acc') {
        if (room.target !== m.sender || room.status !== 'WAITING') return
        let challenger = global.db.data.users[room.challenger]

        if ((user.money || 0) < room.bet || (challenger.money || 0) < room.bet) {
            delete this.adupanco[roomKey]
            return m.reply('Salah satu pemain kehabisan uang. Tantangan dibatalkan!')
        }

        user.money -= room.bet
        challenger.money -= room.bet
        room.status = 'PLAYING'

        let startText = `🤼‍♂️ *[ ADU PANCO DIMULAI ]*\n\n🔴 *${room.challengerName}* (100 HP) VS 🔵 *${room.targetName}* (100 HP)\n\nGiliran pertama: @${room.turn.split('@')[0]}\nKetik aksi: *dorong* | *tahan* | *power* | *nyerah*`
        return await this.reply(m.chat, startText, m, { mentions: [room.challenger, room.target] })
    }

    // 2. RESPONS TOLAK
    if (txt === 'tolak' || txt === 'reject') {
        if (room.target !== m.sender || room.status !== 'WAITING') return
        if (room.timeout) clearTimeout(room.timeout)
        delete this.adupanco[roomKey]
        return this.reply(m.chat, `❌ @${m.sender.split('@')[0]} menolak tantangan adu panco!`, m, { mentions: [m.sender] })
    }

    // 3. RESPONS NYERAH
    if (txt === 'nyerah' || txt === 'surrender') {
        if (room.status !== 'PLAYING') return
        let isChallenger = m.sender === room.challenger
        let opponentJid = isChallenger ? room.target : room.challenger
        let winMoney = room.bet * 2

        if (global.db.data.users[opponentJid]) global.db.data.users[opponentJid].money += winMoney
        if (room.timeout) clearTimeout(room.timeout)
        delete this.adupanco[roomKey]

        return this.reply(m.chat, `🏳️ @${m.sender.split('@')[0]} menyerah!\n👑 Pemenang: @${opponentJid.split('@')[0]} (+${winMoney} Money)`, m, { mentions: [m.sender, opponentJid] })
    }

    // 4. AKSI BERTARUNG (dorong | tahan | power)
    if (['dorong', 'tahan', 'power'].includes(txt)) {
        if (room.status !== 'PLAYING') return
        if (room.turn !== m.sender) return m.reply(`Bukan giliranmu! Tunggu @${room.turn.split('@')[0]}`, null, { mentions: [room.turn] })

        let isChallenger = m.sender === room.challenger
        let me = isChallenger ? 'challenger' : 'target'
        let opponent = isChallenger ? 'target' : 'challenger'

        let myName = isChallenger ? room.challengerName : room.targetName
        let opponentName = isChallenger ? room.targetName : room.challengerName

        let myLevel = user.level || 1
        let dmg = 0
        let logMsg = ''

        if (txt === 'dorong') {
            dmg = Math.floor(Math.random() * 15) + 10 + Math.floor(myLevel * 0.5)
            room.hp[opponent] -= dmg
            logMsg = `💪 *${myName}* menghentakkan tangan! (-${dmg} DMG)`
        } else if (txt === 'tahan') {
            room.hp[me] = Math.min(100, room.hp[me] + 10)
            logMsg = `🛡️ *${myName}* menahan tumpuan siku! (+10 HP)`
        } else if (txt === 'power') {
            if ((user.stamina || 0) < 15) return m.reply('Staminamu kurang (Minimal 15)!')
            user.stamina -= 15
            dmg = Math.floor(Math.random() * 25) + 20 + Math.floor(myLevel * 0.8)
            room.hp[opponent] -= dmg
            logMsg = `🔥 *${myName}* menggunakan POWER! (-${dmg} DMG)`
        }

        if (room.hp[opponent] <= 0) {
            let winMoney = room.bet * 2
            user.money = (user.money || 0) + winMoney
            if (room.timeout) clearTimeout(room.timeout)
            delete this.adupanco[roomKey]
            return this.reply(m.chat, `🏆 *[ GAME SELESAI ]*\n\n${logMsg}\n👑 Pemenang: @${m.sender.split('@')[0]} (+${winMoney} Money)`, m, { mentions: [m.sender] })
        }

        room.turn = room[opponent]
        let statusText = `🤼‍♂️ *[ ARENA PANCO ]*\n\n${logMsg}\n🔴 *${room.challengerName}:* ${room.hp.challenger} HP\n🔵 *${room.targetName}:* ${room.hp.target} HP\n\nGiliran: @${room.turn.split('@')[0]}`
        return this.reply(m.chat, statusText, m, { mentions: [room.turn] })
    }
}

// METADATA TERISOLASI KHUSUS ADU PANCO
handler.help = ['adupanco @user [bet]', 'panco reset']
handler.tags = ['rpg']
handler.command = /^(adupanco|panco)$/i
handler.group = true

export default handler