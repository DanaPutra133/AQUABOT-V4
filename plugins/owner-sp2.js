import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// NOMOR KHUSUS YANG DIIZINKAN (6285126200774)
const ALLOWED_NUMBER = '6285126200774@s.whatsapp.net'

let handler = async (m, { text, usedPrefix, command }) => {
    // Pengecekan Keamanan: Khusus nomor 6285126200774
    let senderJid = m.sender.split('@')[0] + '@s.whatsapp.net'
    if (senderJid !== ALLOWED_NUMBER) {
        return m.reply('🚫 *Akses Ditolak!* Fitur ini khusus untuk nomor yang diizinkan (6285126200774).')
    }

    if (!text) throw `Penggunaan:\n*${usedPrefix + command} <nama_file>*\n\nContoh:\n*${usedPrefix + command} fiturgame*`

    // Target folder: plugins/NoName
    let rootDir = path.resolve(__dirname, '..')
    let targetDir = path.join(rootDir, 'plugins', 'NoName')

    // Pastikan folder plugins/NoName ada
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
    }

    let fileName = text.trim().endsWith('.js') ? text.trim() : `${text.trim()}.js`
    let targetPath = path.join(targetDir, fileName)

    // Memeriksa pesan yang dibalas (quoted message)
    let q = m.quoted ? m.quoted : m
    let code = q.text || q.body || ''

    if (!code) throw `⚠️ Balas (reply) pesan teks/kode plugin yang ingin disimpan ke folder *plugins/NoName*!`

    // Simpan file ke folder plugins/NoName
    await fs.writeFileSync(targetPath, code, 'utf8')
    return m.reply(`✅ Berhasil menyimpan plugin di *plugins/NoName/${fileName}*`)
}

handler.help = ['sp2 <nama_file>']
handler.tags = ['owner']
handler.command = /^(sp2|saveplugin2|sf2)$/i
handler.rowner = false

export default handler