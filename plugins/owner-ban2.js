let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        // 1. DAFTAR NOMOR KHUSUS YANG DIIZINKAN AKSES (tanpa + / spasi)
        let allowedNumbers = [
            '6287873446580', 
            '6283171101068', 
            '6285645553031', 
            '6285126200774'
        ]

        let senderNumber = m.sender.split('@')[0]
        
        // Cek apakah pengirim adalah Owner (m.fromMe / list owner) ATAU terdaftar di allowedNumbers
        let isOwner = m.fromMe || (global.owner || []).some(v => {
            let num = Array.isArray(v) ? v[0] : v
            return String(num).replace(/[^0-9]/g, '') === senderNumber
        })
        let isAllowed = allowedNumbers.includes(senderNumber)

        if (!isOwner && !isAllowed) {
            return m.reply('⚠️ Perintah ini khusus untuk Owner dan Pengguna Terizin saja!')
        }

        if (!args || !args[0]) {
            return m.reply(`⚠️ Siapa yang ingin di-ban?\n\nContoh:\n*${usedPrefix}${command} @user [alasan]*\n*${usedPrefix}${command} 628123456789 [alasan]*`)
        }

        // Tentukan JID target dari mention, reply, atau teks nomor
        let who = m.mentionedJid && m.mentionedJid[0] 
            ? m.mentionedJid[0] 
            : m.quoted 
              ? m.quoted.sender 
              : (args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net')

        if (!who || who === '@s.whatsapp.net') {
            return m.reply('⚠️ Tag, reply, atau masukkan nomor user yang ingin di-ban!')
        }

        // Pengaman: Cegah ban bot sendiri atau ban pengirim
        if (who === conn.user.jid || who === m.sender) {
            return m.reply('⚠️ Kamu tidak bisa mem-banned diri sendiri atau bot!')
        }

        // Memastikan database users tersedia
        if (!global.db?.data?.users) global.db.data.users = {}
        let users = global.db.data.users

        // Inisialisasi jika data user target belum ada di DB
        if (!users[who]) {
            users[who] = {
                banned: false,
                bannedReason: ''
            }
        }

        let user = users[who]
        if (user.banned) {
            return m.reply(`⚠️ User @${who.split('@')[0]} sudah dalam status ter-banned!`, null, { mentions: [who] })
        }

        let reason = args.length > 1 ? args.slice(1).join(' ') : (m.quoted && args[0].startsWith('@') ? args.slice(1).join(' ') : args.slice(1).join(' ')) || 'Tidak ada alasan'

        // Proses Banned
        user.banned = true
        user.bannedReason = reason
        user.bannedTime = Date.now()

        // Notifikasi Balasan di Group / Private Chat
        await m.reply(`🚫 *[ USER BANNED ]*\n\n• *Target:* @${who.split('@')[0]}\n• *Alasan:* ${reason}`, null, { mentions: [who] })

        // Kirim Notifikasi Pribadi (PM) ke Target yang Dibanned
        try {
            let ownersText = (global.owner || [])
                .map((v, i) => {
                    let num = Array.isArray(v) ? v[0] : v
                    let cleanNum = String(num).replace(/[^0-9]/g, '')
                    return `• *Owner ${i + 1}:* https://wa.me/${cleanNum}`
                })
                .join('\n') || '• Kontak Owner tidak tersedia'

            let notifyText = `🚨 *PEMBERITAHUAN BAN*\n\n` +
                             `Kamu telah di-banned dari penggunaan bot.\n` +
                             `• *Alasan:* ${reason}\n\n` +
                             `Jika merasa ini adalah kesalahan, hubungi Owner:\n${ownersText}`

            await conn.reply(who, notifyText.trim(), null)
        } catch (e) {
            console.error('Gagal mengirim pesan PM ke user yang diban:', e)
        }

    } catch (e) {
        console.error('Error pada plugin ban2:', e)
        m.reply('⚠️ Terjadi kesalahan saat memproses perintah ban!')
    }
}

handler.help = ['ban2 @user [alasan]']
handler.tags = ['owner']
handler.command = /^ban2$/i

export default handler