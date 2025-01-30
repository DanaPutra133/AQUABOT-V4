// import moment from 'moment-timezone';
// import schedule from 'node-schedule';
// import chalk from 'chalk';

// // Waktu diatur ke Zona Waktu Indonesia Barat
// const zonaWaktu = 'Asia/Jakarta';

// // Fungsi untuk mengecek status buka tutup grup
// const cekBukaTutup = async (conn) => {
//   const waktuSekarang = moment().tz(zonaWaktu).format('HH:mm');

//   // Mendapatkan daftar ID grup
//   const daftarGrup = Object.keys(db.data.chats).filter(key => key.includes('@g.us'));

//   // Looping melalui setiap grup
//   for (let i = 0; i < daftarGrup.length; i++) {

//     // Data grup
//     const grup = db.data.chats[daftarGrup[i]];

//     // Mengatur waktu pengingat tutup dan buka
//     const waktuIngatTutup = moment(grup.closeTime, 'HH:mm').subtract(10, 'minutes').format('HH:mm');
//     const waktuIngatBuka = moment(grup.openTime, 'HH:mm').subtract(10, 'minutes').format('HH:mm');

//     // Mengecek apakah grup menggunakan fitur ini
//     if (grup.ocStatus) {

//       // Pengingat waktu tutup
//       if (waktuSekarang === waktuIngatTutup) {
//         conn.sendMessage(daftarGrup[i], {
//           text: '*10 Menit lagi grup akan di tutup*'
//         });
//       }

//       // Pengingat waktu buka
//       if (waktuSekarang === waktuIngatBuka) {
//         conn.sendMessage(daftarGrup[i], {
//           text: '*10 Menit lagi grup akan di buka*'
//         });
//       }

//       // Menutup grup sesuai jadwal
//       if (waktuSekarang === grup.closeTime) {
//         await conn.groupSettingUpdate(daftarGrup[i], 'announcement');
//         conn.sendMessage(daftarGrup[i], {
//           text: '*Grup telah ditutup sesuai jadwal.*'
//         });
//       }

//       // Membuka grup sesuai jadwal jika belum terbuka
//       if (waktuSekarang === grup.openTime) {
//         await conn.groupSettingUpdate(daftarGrup[i], 'not_announcement');
//         conn.sendMessage(daftarGrup[i], {
//           text: '*Grup telah dibuka kembali sesuai jadwal.*'
//         });
//       }
//     }
//   }
// }

// // Menjadwalkan pengecekan status grup setiap menit
// schedule.scheduleJob('*/1 * * * *', () => {
//   cekBukaTutup(conn);
//   console.log(chalk.bold.green('Auto Tutup Group Berjalan'));
// });
