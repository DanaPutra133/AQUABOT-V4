let fetch = require('node-fetch')
let uploadImage = require('../lib/uploadImage.js')

let handler = async (m, { conn, text }) => {
    if (!text) {
        return m.reply(`Format penggunaan:\n\n*ktp <data dipisah |>* (bisa disertai foto lewat reply/caption)\n\nContoh:\nktp LAMPUNG SELATAN|KALIANDA|TAUFIK HIDAYAT|SIDOHARJO 28-08-2007|LAKI-LAKI|A|Jl. Nusa Indah NO. 8|05/08|BANGUNAN|PALAS|ISLAM|BELUM MENIKAH|PEGAWAI SWASTA|WNI|SEUMUR HIDUP|25-09-2023\n\n*Urutan field:* provinsi|kota|nama|ttl|jenisKelamin|golonganDarah|alamat|rtRw|kelDesa|kecamatan|agama|status|pekerjaan|kewarganegaraan|masaBerlaku|terbuat|pasPhoto`)
    }

    try {
        // pas Poto nya
        let q = m.quoted ? m.quoted : m
        let mime = (q.msg || q).mimetype || ''
        let photoUrl = ''

        if (/image\/(jpe?g|png)/.test(mime)) {
            let media = await q.download()
            photoUrl = await uploadImage(media)
            console.log('Foto berhasil diupload:', photoUrl)
        }

        let input = text.split('|').map(v => v.trim())
        while (input.length < 16) input.push('')
        if (photoUrl) input.push(photoUrl)

        let [
            provinsi, kota, nama, ttl, jenisKelamin, golonganDarah,
            alamat, rtRw, kelDesa, kecamatan, agama, status,
            pekerjaan, kewarganegaraan, masaBerlaku, terbuat,
            pasPhoto = ''
        ] = input

        let params = new URLSearchParams({
            provinsi, kota, nama, ttl, jenisKelamin, golonganDarah,
            alamat, rtRw, kelDesa, kecamatan, agama, status,
            pekerjaan, kewarganegaraan, masaBerlaku, terbuat,
            pasPhoto
        })

        let res = await fetch(`https://fastrestapis.fasturl.cloud/maker/ktp?${params.toString()}`)
        if (!res.ok) throw 'Gagal menghubungi server.'
        let buffer = await res.buffer()

        await conn.sendMessage(m.chat, {
            image: buffer,
            caption: 'Berikut hasil e-KTP kamu.'
        }, { quoted: m })

    } catch (e) {
        console.error('KTP Error:', e)
        m.reply(typeof e === 'string' ? e : 'Terjadi kesalahan saat membuat KTP.')
    }
}

handler.help = ['ktp'].map(v => v + ' <data dipisah |>')
handler.tags = ['maker']
handler.command = /^ktp$/i

module.exports = handler