import fs from 'fs'
import path from 'path'

let handler = async (m, { conn, usedPrefix, command, text }) => {
    try {
        if (!text) {
            let helpMsg = `
🗑️ *[ FITUR HAPUS FILE & DIREKTORI ]* 🗑️

Gunakan perintah ini untuk menghapus file (bebas format) atau menghapus seluruh folder/direktori beserta isi di dalamnya.

💡 *Cara Penggunaan:*
• *${usedPrefix}${command} <path_file_atau_direktori>*

📌 *Contoh Hapus Direktori/Folder:*
1. Hapus sub-folder NoName:
   *${usedPrefix}${command} plugins/NoName*
2. Hapus folder cache/temp:
   *${usedPrefix}${command} tmp*

📌 *Contoh Hapus File Bebas Format:*
1. *${usedPrefix}${command} database.json*
2. *${usedPrefix}${command} src/assets/photo.jpg*
`.trim()
            return m.reply(helpMsg)
        }

        // Tentukan path relatif dari root bot (process.cwd())
        let targetPath = path.resolve(process.cwd(), text.trim())

        // Cek apakah file/direktori tersebut ada
        if (!fs.existsSync(targetPath)) {
            return m.reply(`⚠️ *Gagal!* File atau direktori tidak ditemukan.\n\n📁 Path: \`${text.trim()}\``)
        }

        let stats = fs.statSync(targetPath)

        if (stats.isDirectory()) {
            // Hapus DIREKTORI/FOLDER beserta seluruh sub-file di dalamnya secara rekursif
            fs.rmSync(targetPath, { recursive: true, force: true })
            return m.reply(`🗑️ *[ DIREKTORI BERHASIL DIHAPUS ]*\n\n📁 Folder: \`${text.trim()}\` beserta seluruh isinya telah dibersihkan.`)
        } else {
            // Hapus FILE tunggal (berformat bebas)
            fs.unlinkSync(targetPath)
            return m.reply(`🗑️ *[ FILE BERHASIL DIHAPUS ]*\n\n📄 File: \`${text.trim()}\``)
        }

    } catch (e) {
        console.error('Error pada plugin delfile:', e)
        m.reply(`❌ *Gagal menghapus!*\nError: ${e.message}`)
    }
}

handler.help = ['df3 <path_file_atau_folder>']
handler.tags = ['owner']
handler.command = /^(df3)$/i
handler.rowner = true

export default handler