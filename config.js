const __filename = import.meta.filename;
import dotenv from "dotenv";
dotenv.config();
// Timezone
process.env.TZ = 'Asia/Jakarta';

// Pengaturan Bot disini Semua
global.owner = ["6281289694906"]; // wajib di isi tidak boleh kosong
global.mods = ["6281289694906"]; // wajib di isi tidak boleh kosong
global.prems = ["6281289694906"]; // wajib di isi tidak boleh kosong
global.nameowner = "DANA"; // wajib di isi tidak boleh kosong
global.numberowner = "6281289694906"; // wajib di isi tidak boleh kosong
global.mail = "danaputra10012@gmail.com"; // wajib di isi tidak boleh kosong
global.gc = "https://chat.whatsapp.com/FtqsG7AFyNlCGQbLrNLh55?mode=gi_t"; // wajib di isi tidak boleh kosong
global.instagram = "https://www.instagram.com/dana_putra13/"; // wajib di isi tidak boleh kosong
global.wm = "© Aquabot"; // isi nama bot atau nama kalian
global.wait = "_*Tunggu sedang di proses...*_"; // ini pesan simulasi loading
global.eror = "_*Server Error*_\n\nMohon jangan di spam ya. Silakan laporkan masalah ini ke admin menggunakan perintah *.lapor*"; // ini pesan saat terjadi kesalahan
global.stiker_wait = "*⫹⫺ Stiker sedang dibuat...*"; // ini pesan simulasi saat loading pembuatan sticker
global.qris = "https://cdn.filn.pp.ua/uploads/betabotzapi/41616.jpg";
global.thumb = "https://telegra.ph/file/3a34bfa58714bdef500d9.jpg"; // thumb untuk menu
global.packname = "Made With"; // watermark stikcker packname
global.author = "Bot WhatsApp"; // watermark stikcker author
global.maxwarn = "3"; // Peringatan maksimum Warn
global.lapor = true;  // set true agar bot mengirim return json error ke grub lapor, jika false tidak ada
global.groupLapor = "120363216901617825@g.us"; // grub dimana bot mengirim laporan error dari user
global.sewaGroupLink = "https://chat.whatsapp.com/ISI_LINK_GRUP_SEWA"; // link invite group sewabot, muncul pas user akses fitur sewabot di luar group resmi
global.sewaExpireWarnMinutes = 1; // menit sebelum expired, bot kirim peringatan ke grup (0 = mati)
global.sewaMaxGroupsPerUser = 20; // maksimal jumlah grup aktif per user (0 = unlimited)
global.sewaGroupJid = "120363356752280868@g.us"; // grup dimana user bisa mengakses fitur pembelian bot/sewabot, untuk mendapatkanya ketik di group yg diinginkan dan ketik => m.chat
global.idchannel = ["123123412341234@newsletter"]; // channel untuk pengumuman bot max 3
global.autobio = false; // Set true/false untuk mengaktifkan atau mematikan autobio (default: false)
global.antiporn = false; // Set true/false untuk Auto delete pesan porno (bot harus admin) (default: false)
global.spam = false; // Set true/false untuk anti spam (default: false)
global.gcspam = false; // Set true/false untuk menutup grup ketika spam (default: false)
// APIKEY INI WAJIB UNTUK DI ISI! //
// Prefix dari bot
global.prefix = './#'

// APIKEY INI WAJIB DI ISI! //
// global.lann = "";
global.lann = process.env.API_KEY_BETABOTZ;
// aktifkan akses .env di atas jika kamu ingin menaruh key api di .env
// Daftar terlebih dahulu https://api.betabotz.eu.org

// AKSESKEY INI DI ISI JIKA DIPERLUKAN (e.g suno ai (ai music ) & fitur prem lainnya//
// global.aksesKey = "";
global.aksesKey = process.env.API_KEY_BETABOTZ_AKSESKEY;
// aktifkan akses .env di atas jika kamu ingin menaruh key api di .env
// Daftar terlebih dahulu https://api.betabotz.eu.org

///INI OPTIONAL BOLEH DI ISI BOLEH JUGA ENGGA//
// global.btc = "YOUR_APIKEY_HERE";
global.btc = process.env.API_KEY_BTC;
//Daftar https://api.botcahx.eu.org

//INI OPTIONAL BOLEH DI ISI BOLEH JUGA ENGGA//
// global.dana = "YOUR_APIKEY_HERE";
global.dana = process.env.API_KEY_DANA;
//Daftar https://api.danafxc.my.id

global.taskToken = process.env.API_KEY_TOKEN;
//Daftar https://api.danafxc.my.id

global.APIs = {
  lann: "https://api.betabotz.eu.org",
  btc: "https://api.botcahx.eu.org",
  dana: "https://api.danafxc.my.id",
taskToken: "https://task.aniqu.biz.id/", //OPSIONAL
};

//Tidak boleh diganti atau di ubah
global.APIKeys = {
  "https://api.betabotz.eu.org": global.lann,
  "https://task.aniqu.biz.id/": global.taskToken, //OPSIONAL
};

import fs from 'fs';
import chalk from 'chalk';
import { pathToFileURL } from 'url';
let file = import.meta.filename;
fs.unwatchFile(file);
fs.watchFile(file, async () => {
  fs.unwatchFile(file);
  console.log(chalk.redBright("Update 'config.js, harap bot di restart!'"));
  await import(pathToFileURL(file).href + '?update=' + Date.now());
});
