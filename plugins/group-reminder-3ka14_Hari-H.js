// const axios = require('axios');
// const { setInterval } = require('timers');

// const GROUP_JID = '120363332519403616@g.us';
// // const GROUP_JID = '120363043100546404@g.us'; //buat uji coba

// let lastReminded = {};
// let cachedTugasList = []; 

// function formatDate(dateStr) {
//     const d = new Date(dateStr);
//     const day = String(d.getDate()).padStart(2, '0');
//     const month = String(d.getMonth() + 1).padStart(2, '0');
//     const year = d.getFullYear();
//     return `${day}/${month}/${year}`;
// }

// function getHMinus(deadline) {
//     const today = new Date();
//     const dline = new Date(deadline);
//     today.setHours(0,0,0,0);
//     dline.setHours(0,0,0,0);
//     const diff = Math.floor((dline - today) / (1000 * 60 * 60 * 24));
//     return diff;
// }

// function groupByType(tugasList, type) {
//     return tugasList.filter(t => t[type]);
// }

// function buildMsg(list, typeLabel, hLabel) {
//     if (!list.length) return '';
//     const grouped = list.reduce((acc, t) => {
//         const mk = (t.mataKuliah || t.matakuliah || 'Tanpa Nama').trim();
//         if (!acc[mk]) acc[mk] = [];
//         acc[mk].push(t);
//         return acc;
//     }, {});

//     let result = `${typeLabel}\n\n`;
//     for (const [mk, tugasMk] of Object.entries(grouped)) {
//         result += `*${mk}*\n`;
//         tugasMk.forEach(t => {
//             const namaTugas = t.namaTugas || t.Namatugas || 'gak ada judul nya woy';
//             const deadline = formatDate(t.deadline);
//             result += `• ${namaTugas}\n  Deadline: ${deadline}\n`;
//         });
//         result += '\n';
//     }

//     return result + '\n';
// }

// function buildVclassMsg(list, hLabel) {
//     return buildMsg(list, '=== INFO VCLASS DEADLINE ===', hLabel);
// }
// function buildIlabMsg(list, hLabel) {
//     return buildMsg(list, '--- INFO ILAB ---', hLabel);
// }
// function buildKelompokMsg(list, hLabel) {
//     return buildMsg(list, '=== INFO TUGAS KELOMPOK ===', hLabel);
// }
// function buildPraktikumMsg(list, hLabel) {
//     return buildMsg(list, '=== INFO PRAKTIKUM ===', hLabel);
// }
// function buildMandiriMsg(list, hLabel) {
//     return buildMsg(list, '=== INFO TUGAS Mandiri ===', hLabel);
// }

// async function getTugasMahasiswa() {
//     try {
//         const url = 'https://ka14.danafxc.my.id/tugas/mahasiswa';
//         console.log('[REMINDER] Mengambil data tugas dari API...');
//         const { data } = await axios.get(url);
//         if (!Array.isArray(data) || !data.length) {
//             console.log('[REMINDER] Gagal: Data tugas kosong atau tidak ditemukan.');
//             return [];
//         }
//         console.log('[REMINDER] Berhasil mengambil data tugas.');
//         return data;
//     } catch (e) {
//         console.error('[REMINDER] Gagal mengambil data tugas:', e.message || e);
//         return [];
//     }
// }

// async function sendReminderToGroup(jid, text) {
//     if (typeof global.conn !== 'undefined') {
//         await global.conn.sendMessage(jid, { text });
//     } else if (typeof conn !== 'undefined') {
//         await conn.sendMessage(jid, { text });
//     } else {
//         console.error('No WhatsApp connection object found!');
//     }
// }

// async function updateTugasCache() {
//     const tugasList = await getTugasMahasiswa();
//     cachedTugasList = tugasList;
//     if (!tugasList.length) {
//         console.log('[REMINDER] Tidak ada data tugas yang diambil dari API (cache update).');
//     } else {
//         console.log(`[REMINDER] Cache tugas diperbarui. Jumlah tugas: ${tugasList.length}`);
//     }
// }

// async function tugasReminder() {
//     const tugasList = cachedTugasList;
//     if (!tugasList.length) {
//         console.log('[REMINDER] Tidak ada data tugas pada cache untuk dikirim.');
//         return;
//     }

//     const today = new Date();
//     const todayStr = today.toISOString().slice(0,10);

//     // Filter tugas H (hari ini)
//     const hTugas = tugasList.filter(t => getHMinus(t.deadline) === 0);

//     if (!hTugas.length) {
//         console.log('[REMINDER] Tidak ada tugas dengan deadline hari ini.');
//         return;
//     }

//     if (lastReminded[todayStr]) {
//         console.log('[REMINDER] Reminder sudah dikirim hari ini.');
//         return;
//     }

//     let msg = '=== ⚠️ TUGAS DEADLINE HARI INI ⚠️ ===\n\n';
//     msg += buildVclassMsg(groupByType(hTugas, 'vclass'), 'H');
//     msg += buildIlabMsg(groupByType(hTugas, 'ilab'), 'H');
//     msg += buildKelompokMsg(groupByType(hTugas, 'kelompok'), 'H');
//     msg += buildPraktikumMsg(groupByType(hTugas, 'praktikum'), 'H');
//     msg += buildMandiriMsg(groupByType(hTugas, 'Mandiri'), 'H');

//     if (msg.trim()) {
//         await sendReminderToGroup(GROUP_JID, msg.trim());
//         lastReminded[todayStr] = true;
//         console.log('[REMINDER] Tugas reminder sent for today:', todayStr);
//     }
// }

// setInterval(async () => {
//     const now = new Date();
//     await updateTugasCache(); 
//     if (now.getHours() === 6 && now.getMinutes() === 0) {
//         console.log('[REMINDER] Mengecek tugas pada jam 06:00...');
//         await tugasReminder();
//     } else {
//         console.log(`[REMINDER] Interval aktif, sekarang jam ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
//     }
// }, 60 * 1000);