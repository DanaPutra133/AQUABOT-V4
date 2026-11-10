import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, text, usedPrefix, command }) => {
    try {
        if (!text) {
            let helpMsg = `
📂 *[ FITUR BUAT FOLDER BARU ]* 📂

Gunakan perintah ini untuk membuat direktori/folder baru di dalam struktur bot.

💡 *Cara Penggunaan:*
• *${usedPrefix}${command} <nama_folder_atau_path>*

📌 *Contoh:*
1. Buat folder di root bot:
   *${usedPrefix}${command} database_backup*
2. Buat folder di dalam sub-direktori:
   *${usedPrefix}${command} plugins/games*
3. Buat folder bertingkat sekaligus:
   *${usedPrefix}${command} src/assets/images/icons*
`.trim()
            return conn.reply(m.chat, helpMsg, m)
        }

        // Tentukan path relatif dari direktori kerja bot (process.cwd())
        let targetPath = path.resolve(process.cwd(), text.trim())

        // Cek apakah folder/file dengan nama tersebut sudah ada
        if (fs.existsSync(targetPath)) {
            let stats = fs.statSync(targetPath)
            if (stats.isDirectory()) {
                return conn.reply(m.chat, `⚠️ *Folder sudah ada!*\n\n📁 Path: \`${text.trim()}\``, m)
            } else {
                return conn.reply(m.chat, `⚠️ *Gagal!* Sudah ada **file** dengan nama yang sama di direktori tersebut.`, m)
            }
        }

        // Buat folder baru (recursive: true memungkinkan pembuatan folder bertingkat sekaligus)
        fs.mkdirSync(targetPath, { recursive: true })

        let successMsg = `
✅ *[ FOLDER BERHASIL DIBUAT ]* ✅

📁 *Nama / Path:* \`${text.trim()}\`
📍 *Absolute Path:* \`${targetPath}\`
`.trim()

        return conn.reply(m.chat, successMsg, m)

    } catch (e) {
        console.error('Error pada plugin mkfolder:', e)
        m.reply(`❌ *Gagal membuat folder!*\nError: ${e.message}`)
    }
}

// METADATA FITUR KHUSUS OWNER
handler.help = ['mkfolder <path_folder>', 'mkdir <path_folder>']
handler.tags = ['owner']
handler.command = /^(mkfolder|mkdir|createfolder|buatfolder)$/i
handler.owner = true // Hanya Owner yang bisa mengeksekusi

export default handler