// let handler = async (m, { conn, command, args }) => {
//     try {
//         const API_URL = "https://ka14.danafxc.my.id/tugas/mahasiswa";
        
//         let response = await fetch(API_URL);
//         if (!response.ok) throw new Error(`Gagal mengambil data dari API (Status: ${response.status})`);
        
//         let tasksList = await response.json();
//         if (!Array.isArray(tasksList)) throw new Error('Format data dari API tidak valid (harus nya sih array).');
//         if (tasksList.length === 0) return conn.reply(m.chat, 'Gak ada tugas/ Db nya error. Konfirmasi ke dana coba', m);

//         const calculateRemainingDays = (deadline) => {
//             const now = new Date();
//             const dueDate = new Date(deadline);
//             now.setHours(0, 0, 0, 0);
//             dueDate.setHours(0, 0, 0, 0);
//             const diffTime = dueDate.getTime() - now.getTime();
//             return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
//         };

//         const formatTasks = (title, tasks) => {
//             if (!tasks || tasks.length === 0) return '';
//             let formatted = `*== ${title.toUpperCase()} ==*\n\n`;
//             tasks.forEach((t, i) => {
//                 const remainingDays = calculateRemainingDays(t.deadline);
//                 let deadlineText;
//                 if (remainingDays < 0) deadlineText = `🔴 Terlambat ${Math.abs(remainingDays)} hari`;
//                 else if (remainingDays === 0) deadlineText = `🔵 Deadline HARI INI!`;
//                 else deadlineText = `Sisa ${remainingDays} hari lagi`;

//                 formatted += `${i + 1}. *${t.matakuliah}*\n   - ${
//                   t.Namatugas
//                 }\n   - Deadline: ${deadlineText}\n\n`;
//             });
//             return formatted;
//         };

//         if (command === 'rekap3ka14') {
//             const kategori = (args[0] || '').toLowerCase(); // ambil argumen setelah command
//             const praktikum = tasksList.filter(t => t.praktikum);
//             const vclass = tasksList.filter(t => t.vclass);
//             const ilab = tasksList.filter(t => t.ilab);
//             const kelompok = tasksList.filter(t => t.kelompok);
//             const mandiri = tasksList.filter(t => t.Mandiri);

//             if (!kategori) {
//                 // kalau user hanya ketik .testrekap3ka14
//                 let msg = `*Pilih kategori rekap yang ingin di lihat:*\n\n`;
//                 msg += `• .rekap3ka14 semua\n`;
//                 msg += `• .rekap3ka14 praktikum\n`;
//                 msg += `• .rekap3ka14 vclass\n`;
//                 msg += `• .rekap3ka14 ilab\n`;
//                 msg += `• .rekap3ka14 kelompok\n`;
//                 msg += `• .rekap3ka14 mandiri\n`;
//                 return conn.reply(m.chat, msg, m);
//             }

//             let result = '';
//             switch (kategori) {
//                 case 'semua':
//                     result = '*-> REKAP SEMUA TUGAS 3KA14 <-*\n\n';
//                     result += "Coba fitur KA14 baru di:\nhttps://ka14.danafxc.my.id/login-mahasiswa\n\n";
//                     result += formatTasks('Praktikum', praktikum);
//                     result += formatTasks('V-Class', vclass);
//                     result += formatTasks('iLab', ilab);
//                     result += formatTasks('Tugas Kelompok', kelompok);
//                     result += formatTasks('Tugas Mandiri', mandiri);
//                     break;

//                 case 'praktikum':
//                     result = formatTasks('Praktikum', praktikum);
//                     break;

//                 case 'vclass':
//                     result = formatTasks('V-Class', vclass);
//                     break;

//                 case 'ilab':
//                     result = formatTasks('iLab', ilab);
//                     break;

//                 case 'kelompok':
//                     result = formatTasks('Tugas Kelompok', kelompok);
//                     break;

//                 case 'mandiri':
//                     result = formatTasks('Tugas Mandiri', mandiri);
//                     break;

//                 default:
//                     return conn.reply(m.chat, 'gak ada kategori ini, cek lagi di .testrekap3ka14', m);
//             }

//             if (!result.trim()) {
//                 return conn.reply(m.chat, `mau cari apa hayooo kan ngga ada tugas buat *${kategori}*`, m);
//             }

//             conn.reply(m.chat, result.trim(), m);
//         }

//     } catch (err) {
//         console.error(err);
//         conn.reply(m.chat, `Terjadi kesalahan: ${err.message}`, m);
//     }
// };

// handler.help = ['rekap3ka14'];
// handler.tags = ['tools'];
// handler.command = ["rekap3ka14"];

// module.exports = handler;


// // let handler = async (m, { conn, usedPrefix, command }) => {
// //     conn.reply(m.chat, "Fitur ini di matikan selama Liburan \n\nSelamat Berlibur Kawan\n\nLogin/ Register web kelas di\nhttps://ka14.danafxc.my.id/login-mahasiswa", null)
// // }
// // handler.help = ['rekap3ka14']
// // handler.tags = ['tools']
// // handler.command = /^rekap3ka14|rekap3ka14 vclass|rekap3ka14 mandiri|rekap3ka14 semua|rekap3ka14 praktikum$/i

// // module.exports = handler