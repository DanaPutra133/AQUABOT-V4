import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    // 1. Tentukan target yang di-reply / di-tag
    let who = m.quoted 
      ? m.quoted.sender 
      : m.mentionedJid && m.mentionedJid[0] 
        ? m.mentionedJid[0] 
        : m.fromMe 
          ? conn.user.jid 
          : m.sender

    let targetName = `@${who.split('@')[0]}`
    let senderName = `@${m.sender.split('@')[0]}`

    // 2. Ambil URL GIF Pelukan (Hug) dari API Nekos.best
    let res = await fetch('https://nekos.best/api/v2/hug')
    if (!res.ok) throw 'Gagal mengambil gambar dari API!'

    let json = await res.json()
    let imageUrl = json.results?.[0]?.url
    if (!imageUrl) throw 'URL gambar tidak ditemukan!'

    // Buat metadata watermark stiker
    let packname = global.packname || 'Sticker Hug'
    let author = `${senderName} hugged ${targetName}`

    // 3. Kirim Stiker (Gunakan sendVideoAsSticker jika ada)
    if (typeof conn.sendVideoAsSticker === 'function') {
      await conn.sendVideoAsSticker(m.chat, imageUrl, m, {
        packname: packname,
        author: author
      })
    } else {
      // Fallback conn.sendFile
      await conn.sendFile(m.chat, imageUrl, 'sticker.webp', '', m, false, {
        asSticker: true,
        key: m.key
      })
    }

    // 4. Kirim pesan teks konfirmasi dengan mention terpasang
    let caption = `*${senderName}* memeluk erat *${targetName}*! 🫂`
    await conn.reply(m.chat, caption, m, { mentions: [m.sender, who] })

  } catch (e) {
    console.error(e)
    m.reply(typeof e === 'string' ? e : 'Terjadi kesalahan saat membuat stiker!')
  }
}

handler.help = ['hug [@user]']
handler.tags = ['fun']
handler.command = /^(hug)$/i
handler.premium = true

export default handler