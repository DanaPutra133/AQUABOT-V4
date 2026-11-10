import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// NOMOR KHUSUS YANG DIIZINKAN (6285126200774)
const ALLOWED_NUMBER = '6285126200774@s.whatsapp.net'

let handler = async (m, { usedPrefix, command, text }) => {
    // Pengecekan Keamanan: Khusus nomor 6285126200774
    let senderJid = m.sender.split('@')[0] + '@s.whatsapp.net'
    if (senderJid !== ALLOWED_NUMBER) {
        return m.reply('🚫 *Akses Ditolak!* Fitur ini khusus untuk nomor yang diizinkan (6285126200774).')
    }

    if (!text) throw `Penggunaan:\n*${usedPrefix + command} <nama_file>*\n\nContoh:\n*${usedPrefix + command} fiturgame*`

    // Target folder: plugins/NoName
    let rootDir = path.resolve(__dirname, '..')
    let targetDir = path.join(rootDir, 'plugins', 'NoName')

    // Buat folder jika belum ada
    if (!fs.existsSync(targetDir)) {
        fs.mkdirSync(targetDir, { recursive: true })
    }

    let targetFile = text.trim()
    let fileName = targetFile.endsWith('.js') ? targetFile : `${targetFile}.js`
    let filePath = path.join(targetDir, fileName)

    if (!fs.existsSync(filePath) || !fs.statSync(filePath).isFile()) {
        let listFiles = fs.readdirSync(targetDir).filter(v => v.endsWith('.js'))

        let errorMsg = `⚠️ File *'${fileName}'* tidak ditemukan di folder *plugins/NoName*!\n\n`
        errorMsg += `📁 *List Plugins NoName (${listFiles.length}):*\n`
        errorMsg += listFiles.length > 0 
            ? listFiles.map(v => `• ${v.replace(/\.js$/, '')}`).join('\n')
            : '_Folder plugins/NoName masih kosong._'

        return m.reply(errorMsg.trim())
    }

    let fileContent = fs.readFileSync(filePath, 'utf8')
    return m.reply(fileContent)
}

handler.help = ['gp2 <nama_file>']
handler.tags = ['owner']
handler.command = /^(gp2|getplugin2|gf2)$/i
handler.rowner = false

export default handler