const ffmpeg = require('fluent-ffmpeg')
const fs = require('fs')

let handler = async (m, { conn }) => {
  let who = m.mentionedJid && m.mentionedJid[0] ? m.mentionedJid[0] : m.fromMe ? conn.user.jid : m.sender
  let name = await conn.getName(who)
  let q = m.quoted ? m.quoted : m
  let mime = (q.msg || q).mimetype || ''
  if (!mime) throw `Video tidak ditemukan`
  let videoData = await conn.downloadAndSaveMediaMessage(q, 'video')
  let output = './tmp/video.mp4'
  ffmpeg(videoData)
    .format('mp4')
    .size('?x1080') 
    .videoBitrate('2048k') 
    .videoCodec('libx264')
    .fps(60) 
    .audioBitrate('192k') 
    .audioCodec('aac')
    .output(output)
    .on('end', () => {
      conn.sendFile(m.chat, output, '', wm, m, (err) => {
        fs.unlinkSync(output)
        if (err) m.reply('Terjadi kesalahan saat mengirim video. ' + err)
      })
    })
    .on('error', (err) => {
      fs.unlinkSync(output)
      console.error(err)
      m.reply('Terjadi kesalahan saat menaikkan resolusi video. ' + err)
    })
    .run()
}

handler.command = handler.help = ["hdvid2"]
handler.tags = ["tools"]
handler.limit = true

module.exports = handler