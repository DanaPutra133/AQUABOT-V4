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

    if (!fs.existsSync(targetDir)) {
        return m.reply('⚠️ Folder *plugins/NoName* tidak ditemukan atau masih kosong!')
    }

    let targetFile = text.trim()
    let fileName = targetFile.endsWith('.js') ? targetFile : `${targetFile}.js`
    let targetPath = path.join(targetDir, fileName)

    // Cek keberadaan file di folder plugins/NoName
    if (!fs.existsSync(targetPath) || !fs.statSync(targetPath).isFile()) {
        let listFiles = fs.readdirSync(targetDir).filter(v => v.endsWith('.js'))

        let errorMsg = `⚠️ File *'${fileName}'* tidak ditemukan di folder *plugins/NoName*!\n\n`
        errorMsg += `📁 *List Plugins NoName (${listFiles.length}):*\n`
        errorMsg += listFiles.length > 0 
            ? listFiles.map(v => `• ${v.replace(/\.js$/, '')}`).join('\n')
            : '_Folder plugins/NoName kosong._'

        return m.reply(errorMsg.trim())
    }

    // Hapus file
    await fs.unlinkSync(targetPath)
    return m.reply(`🗑️ *Berhasil menghapus plugin:* \`plugins/NoName/${fileName}\``)
}

handler.help = ['dp2 <nama_file>']
handler.tags = ['owner']
handler.command = /^(dp2|deleteplugin2|df2)$/i
handler.rowner = false

export default handler