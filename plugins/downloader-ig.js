let fetch = require('node-fetch')

let handler = async (m, { conn, args, usedPrefix, command }) => {
  if (!args[0]) throw `*Contoh:* ${usedPrefix}${command} https://www.instagram.com/reel/DKPtUL_S9Nh/?igsh=MTE1dTVkb2E4NTFmcw==`
  if (!args[0].match(/instagram\.com\//i)) throw `URL Instagram Tidak Valid!`

  await m.reply(wait)
  const link = args[0]
  const encodedLink = encodeURIComponent(link)

  const fetchJson = async (url) => {
    const response = await fetch(url)
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      throw new Error('Response bukan JSON')
    }
  }

  const sendUrls = async (urls) => {
    const uniqueUrls = [...new Set((urls || []).filter((url) => typeof url === 'string' && url))]
    if (uniqueUrls.length === 0) throw new Error('Media tidak ditemukan!')
    for (const url of uniqueUrls) {
      await conn.sendFile(m.chat, url, null, '*Instagram Downloader*', m)
      await sleep(3000)
    }
  }

  const sendMedia = async (items, caption) => {
    if (!Array.isArray(items) || items.length === 0) throw new Error('Media tidak ditemukan!')
    for (let i = 0; i < items.length; i++) {
      const item = items[i]
      if (!item || !item.url) continue
      const sendCaption = i === 0 ? caption || '*Instagram Downloader*' : ''
      if (item.isVideo) {
        await conn.sendMessage(m.chat, { video: { url: item.url }, caption: sendCaption }, { quoted: m })
      } else {
        await conn.sendMessage(m.chat, { image: { url: item.url }, caption: sendCaption }, { quoted: m })
      }
      await sleep(3000)
    }
  }

  try {
    try {
      const data = await fetchJson(
        `https://api.betabotz.eu.org/api/download/igdowloader?url=${encodedLink}&apikey=${global.lann}`
      )

      if (!data || !Array.isArray(data.message) || data.message.length === 0) {
        throw new Error('API V1 tidak mengembalikan media valid')
      }

      const urls = data.message
        .filter((item) => item && item._url)
        .map((item) => item._url)

      return await sendUrls(urls)
    } catch (err) {
      try {
        const data = await fetchJson(
          `https://api.betabotz.eu.org/api/download/igdowloader-v2?url=${encodedLink}&apikey=${global.lann}`
        )

        if (!data || !data.result || !data.result.data || !data.result.data.xdt_shortcode_media) {
          throw new Error('API V2 tidak mengembalikan media valid')
        }

        const media = data.result.data.xdt_shortcode_media
        let caption = ''
        if (
          media.edge_media_to_caption &&
          Array.isArray(media.edge_media_to_caption.edges) &&
          media.edge_media_to_caption.edges.length > 0
        ) {
          caption = media.edge_media_to_caption.edges[0].node.text || ''
        }

        const items = []
        const seen = new Set()

        if (
          media.edge_sidecar_to_children &&
          Array.isArray(media.edge_sidecar_to_children.edges) &&
          media.edge_sidecar_to_children.edges.length > 0
        ) {
          for (const edge of media.edge_sidecar_to_children.edges) {
            const node = edge?.node
            if (!node) continue
            const url = node.is_video && node.video_url
              ? node.video_url
              : node.display_url || node.thumbnail_src || node.display_resources?.[0]?.src
            if (!url || seen.has(url)) continue
            seen.add(url)
            items.push({ url, isVideo: !!node.is_video })
          }
        }

        if (items.length === 0) {
          if (media.has_audio === true && media.video_url) {
            items.push({ url: media.video_url, isVideo: true })
          } else {
            const url = media.display_url || media.thumbnail_src || media.display_resources?.[0]?.src
            if (!url) throw new Error('Media tidak ditemukan!')
            items.push({ url, isVideo: false })
          }
        }

        return await sendMedia(items, caption ? `*Instagram Downloader*

${caption}` : '*Instagram Downloader*')
      } catch (errV2) {
        if (global.btc) {
          const fallback = await fetchJson(
            `https://api.botcahx.eu.org/api/dowloader/igdowloader?url=${encodedLink}&apikey=${global.btc}`
          )
          if (!fallback || !Array.isArray(fallback.result) || fallback.result.length === 0) {
            throw new Error('Fallback botcahx gagal mengambil media')
          }
          const urls = fallback.result
            .slice(0, 3)
            .filter((item) => item && item.url)
            .map((item) => item.url)
          return await sendUrls(urls)
        }
        throw errV2
      }
    }
  } catch (finalError) {
    throw typeof finalError === 'string' ? finalError : finalError.message || 'Terjadi kesalahan saat mendownload Instagram.'
  }
}

handler.help = ['instagram'].map((v) => v + ' <url>')
handler.tags = ['downloader']
handler.command = /^(ig|instagram|igdl|instagramdl|igstory)$/i
handler.limit = true

module.exports = handler

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}
