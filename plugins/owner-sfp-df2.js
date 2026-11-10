import fs from 'fs';
import path from 'path';

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `Penggunaan:\n${usedPrefix + command} <path/nama_file>\n\nContoh:\n${usedPrefix + command} lib/myfunc.js\n${usedPrefix + command} plugins/menu.js`;

  // Otomatis tambahkan ekstensi .js jika pengguna tidak mengetiknya
  let targetPath = text.endsWith('.js') ? text : `${text}.js`;

  if (command === 'sf2') {
    // Memeriksa pesan yang dibalas
    let q = m.quoted ? m.quoted : m;
    let code = q.text || q.body || '';
    
    if (!code) throw `Balas pesan teks/kode yang ingin disimpan!`;

    // Buat folder secara otomatis jika folder tujuan belum ada
    let dir = path.dirname(targetPath);
    if (dir && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    await fs.writeFileSync(targetPath, code);
    m.reply(`Berhasil tersimpan di *${targetPath}*`);

  } else if (command === 'df2') {
    if (!fs.existsSync(targetPath)) throw `File *${targetPath}* tidak ditemukan!`;

    fs.unlinkSync(targetPath);
    m.reply(`File *${targetPath}* berhasil dihapus`);
  }
};

handler.help = ['sf2', 'df2'].map(v => v + ' <path/file>');
handler.tags = ['owner'];
handler.command = /^(sf2|df2)$/i;
handler.rowner = true;

export default handler;