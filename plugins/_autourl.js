const uploadFile = require('../lib/uploadFile')
const uploadImage = require('../lib/uploadImage')

exports.before = async function(m, { isAdmin, isBotAdmin }) {
    if (m.isBaileys && m.fromMe) return;
    let chat = global.db.data.chats[m.chat]
    
    let isFoto = m.mtype
    let isVideo = m.mtype;
    if (chat.autourl && isFoto ) {
        if (!isBotAdmin) {
        // Jika pengirim adalah admin atau bot bukan admin, tidak melakukan apa-apa
      } else {
      const q = m.quoted ? m.quoted : m
      const mime = (q.msg || q).mimetype || q.mediaType || '';
      if(isFoto === "imageMessage")	 
      if (!mime) throw 'Tidak ada media yang ditemukan'
      let media = await q.download()
      let isTele = /image\/(png|jpe?g|gif)|video\/mp4/.test(mime)
      let fileSizeLimit = 5 * 1024 * 1024 
      if (media.length > fileSizeLimit) {
        throw 'Ukuran media tidak boleh melebihi 5MB'
      }
      let link = await (isTele ? uploadImage : uploadFile)(media)
      m.reply(`${link}
    ${media.length} Byte(s)
    ${isTele ? '(Tidak Ada Tanggal Kedaluwarsa)' : '(Expired 24 hours)'}`)
        return true
      }
    }
    return true
  }