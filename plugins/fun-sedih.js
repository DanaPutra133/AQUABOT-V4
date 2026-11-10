import fetch from 'node-fetch'

let handler = async (m, { conn, text, usedPrefix, command }) => {
  try {
    // 1. Ambil URL GIF Menangis (Cry) dari API Nekos.best
    let res = await fetch('https://nekos.best/api/v2/cry')
    if (!res.ok) throw 'Gagal mengambil gambar dari API!'

    let json = await res.json()
    let imageUrl = json.results?.[0]?.url
    if (!imageUrl) throw 'URL gambar tidak ditemukan!'

    // Metadata watermark stiker standar
    let packname = global.packname || 'Sticker Cry'
    let author = global.author || 'Bot'

    // 2. Kirim Stiker (Gunakan sendVideoAsSticker jika tersedia)
    if (typeof conn.sendVideoAsSticker === 'function') {
      await conn.sendVideoAsSticker(m.chat, imageUrl, m, {
        packname: packname,
        author: author
      })
    } else {
      // Fallback conn.sendFile langsung via URL
      await conn.sendFile(m.chat, imageUrl, 'sticker.webp', '', m, false, {
        asSticker: true,
        key: m.key
      })
    }

  } catch (e) {
    console.error(e)
    m.reply(typeof e === 'string' ? e : 'Terjadi kesalahan saat membuat stiker!')
  }
}

handler.help = ['sedih']
handler.tags = ['fun']
handler.command = /^(sedih)$/i
handler.limit = true

export default handler