import fs from 'fs';
import path from 'path';

let handler = async (m, { text, usedPrefix, command }) => {
  if (!text) throw `Penggunaan:\n${usedPrefix + command} <nama_file>\n\nContoh:\n${usedPrefix + command} menu`;

  // Pastikan nama file berakhiran .js
  let fileName = text.endsWith('.js') ? text : `${text}.js`;
  
  // Tentukan path otomatis ke folder plugins
  let targetPath = path.join('plugins', fileName);

  // Memeriksa pesan yang dibalas
  let q = m.quoted ? m.quoted : m;
  let code = q.text || q.body || '';
  
  if (!code) throw `Balas pesan teks/kode yang ingin disimpan ke folder plugins!`;

  // Buat folder plugins jika belum ada
  let dir = path.dirname(targetPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }

  await fs.writeFileSync(targetPath, code);
  m.reply(`Berhasil menyimpan plugin di *${targetPath}*`);
};

handler.help = ['sp <nama_file>'];
handler.tags = ['owner'];
handler.command = /^sp$/i;
handler.rowner = true;

export default handler;