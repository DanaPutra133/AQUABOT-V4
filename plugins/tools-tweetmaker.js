let fetch = require('node-fetch')
let uploadImage = require('../lib/uploadImage.js')

let handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply(`Format penggunaan:\n\n*tweetm <ISI KONTEN>|<NAMA AKUN>|<NAMA>|<USERNAME TW>|<@USERNAME>|<WAKTU>|<TANGGAL>|<PLAFORM>|<RETWEETS>|<QUOTES>|<LIKES>|* (bisa disertai foto lewat reply/caption)\n\nContoh:\n.tweetm mawar itu biru,z|dana putra|dana p|dana1234|9:36 PM|May 2, 2025|android|1115|245|5885\n\n*Catatan:* tanda <> tidak usah, Replay gambar untuk input sebuah gambar`)
    }

    try {
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        let imageUrl = ''

        if (/image\/(jpe?g|png)/.test(mime)) {
            let media = await q.download()
            imageUrl = await uploadImage(media)
            console.log('Foto berhasil diupload:', imageUrl)
        }

        let input = text.split('|').map(v => v.trim())

        let [
            content,
            ppUrl = '',
            name = '',
            username = '',
            verified = '',
            time = '',
            date = '',
            client = '',
            retweets = '',
            quotes = '',
            likes = '',
            apiKey = '' 
        ] = input

        if (!content) {
            return m.reply('Konten tweet tidak boleh kosong.')
        }

        let params = new URLSearchParams({
            content,
            imageUrl 
        })

        if (ppUrl) params.append('ppUrl', ppUrl)
        if (name) params.append('name', name)
        if (username) params.append('username', username)
        if (verified) params.append('verified', verified)
        if (time) params.append('time', time)
        if (date) params.append('date', date)
        if (client) params.append('client', client)
        if (retweets) params.append('retweets', retweets)
        if (quotes) params.append('quotes', quotes)
        if (likes) params.append('likes', likes)

        let headers = {
            'Content-Type': 'application/json' 
        };
        if (apiKey) {
            headers['x-api-key'] = apiKey;
        }

        let res = await fetch(`https://fastrestapis.fasturl.cloud/maker/tweet?${params.toString()}`, {
            method: 'GET', 
            headers: headers
        })

        if (!res.ok) {
            let errorText = await res.text();
            console.error('API Error Response:', res.status, errorText);
            throw `Gagal menghubungi server. Status: ${res.status}. Pesan: ${errorText.substring(0, 100)}...`; // Limit error message length
        }

        let buffer = await res.buffer()

        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: 'Berikut hasil tweet kamu.'
        }, { quoted: m })

    } catch (e) {
        console.error('Tweet Error:', e)
        m.reply(typeof e === 'string' ? e : 'Terjadi kesalahan saat membuat tweet.')
    }
}

handler.help = ['tweetm'].map(v => v + ' <content>|<ppUrl>|...')
handler.tags = ['maker']
handler.command = /^tweetm$/i

module.exports = handler