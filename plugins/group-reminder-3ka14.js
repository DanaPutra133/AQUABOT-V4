// const axios = require('axios');
// const { setInterval } = require('timers');

// const GROUP_JID = '120363332519403616@g.us';
// // const GROUP_JID = '120363043100546404@g.us'; //buat uji coba

// let lastReminded = {};
// let cachedTugasList = []; 

// function formatDate(dateStr) {
//     // dateStr: "2025-10-02T00:00:00.000Z" atau "2025-10-02"
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
//             const namaTugas = t.namaTugas || t.Namatugas || 'gak ada tugas nya woy';
//             const deadline = formatDate(t.deadline);
//             result += `• ${namaTugas}\n Deadline: ${deadline}\n`;
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
//         const url = "https://ka14.danafxc.my.id/tugas/mahasiswa";
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

//     // Filter tugas H-1 dan H-3
//     const h1Tugas = tugasList.filter(t => getHMinus(t.deadline) === 1);
//     const h3Tugas = tugasList.filter(t => getHMinus(t.deadline) === 3);

//     if (!h1Tugas.length && !h3Tugas.length) {
//         console.log('[REMINDER] Tidak ada tugas dengan deadline H-1 atau H-3 hari ini.');
//         return;
//     }

//     if (lastReminded[todayStr]) {
//         console.log('[REMINDER] Reminder sudah dikirim hari ini.');
//         return;
//     }

//     let msg = '';

//     // H-3
//     if (h3Tugas.length) {
//         msg += '=== TUGAS DEADLINE H-3 ===\n\n';
//         msg += buildVclassMsg(groupByType(h3Tugas, 'vclass'), 'H-3');
//         msg += buildIlabMsg(groupByType(h3Tugas, 'ilab'), 'H-3');
//         msg += buildKelompokMsg(groupByType(h3Tugas, 'kelompok'), 'H-3');
//         msg += buildPraktikumMsg(groupByType(h3Tugas, 'praktikum'), 'H-3');
//         msg += buildMandiriMsg(groupByType(h3Tugas, 'Mandiri'), 'H-3');
//     }

//     // H-1
//     if (h1Tugas.length) {
//         msg += '=== TUGAS DEADLINE H-1 ===\n\n';
//         msg += buildVclassMsg(groupByType(h1Tugas, 'vclass'), 'H-1');
//         msg += buildIlabMsg(groupByType(h1Tugas, 'ilab'), 'H-1');
//         msg += buildKelompokMsg(groupByType(h1Tugas, 'kelompok'), 'H-1');
//         msg += buildPraktikumMsg(groupByType(h1Tugas, 'praktikum'), 'H-1');
//         msg += buildMandiriMsg(groupByType(h1Tugas, 'Mandiri'), 'H-1');
//     }

//     if (msg.trim()) {
//         await sendReminderToGroup(GROUP_JID, msg.trim());
//         lastReminded[todayStr] = true;
//         console.log('[REMINDER] Tugas reminder sent:', todayStr);
//     }
// }

// setInterval(async () => {
//     const now = new Date();
//     await updateTugasCache(); 
//     if (now.getHours() === 19 && now.getMinutes() === 0) {
//         console.log('[REMINDER] Mengecek tugas pada jam 19:00...');
//         await tugasReminder();
//     } else {
//         console.log(`[REMINDER] Interval aktif, sekarang jam ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
//     }
// }, 60 * 1000);
