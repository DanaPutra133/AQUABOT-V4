// const axios = require('axios');
// const { setInterval } = require('timers');

// let lastReminded = {};
// let cachedTugasList = []; 
// let cachedTargetGroups = []; 

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

// // FUNGSI BARU: Mengambil jenis tugas unik dari API secara dinamis
// function getUniqueJenis(tugasList) {
//     const jenisSet = new Set();
//     tugasList.forEach(t => {
//         if (t.jenis && Array.isArray(t.jenis)) {
//             t.jenis.forEach(j => jenisSet.add(j.toUpperCase()));
//         }
//     });
//     return Array.from(jenisSet);
// }

// function groupByType(tugasList, type) {
//     return tugasList.filter(t => t.jenis && t.jenis.some(j => j.toLowerCase() === type.toLowerCase()));
// }

// // Merakit pesan berdasarkan list tugas dan label jenisnya
// function buildMsg(list, typeLabel) {
//     if (!list.length) return '';
//     const grouped = list.reduce((acc, t) => {
//         const mk = (t.subject || 'Tanpa Nama').trim();
//         if (!acc[mk]) acc[mk] = [];
//         acc[mk].push(t);
//         return acc;
//     }, {});

//     let result = `${typeLabel}\n\n`;
//     for (const [mk, tugasMk] of Object.entries(grouped)) {
//         result += `*${mk}*\n`;
//         tugasMk.forEach(t => {
//             const namaTugas = t.taskName ? `${t.taskName} - ${t.title}` : 'gak ada tugas nya woy';
//             const deadline = formatDate(t.deadline);
//             result += `• ${namaTugas}\n Deadline: ${deadline}\n`;
//         });
//         result += '\n';
//     }

//     return result + '\n';
// }

// // FUNGSI BARU: Membangun blok pesan H-1 atau H-3 secara dinamis
// function buildDynamicReminderMsg(tugasList, hLabel) {
//     if (!tugasList.length) return '';
    
//     let msg = `=== TUGAS DEADLINE ${hLabel} ===\n\n`;
//     const uniqueTypes = getUniqueJenis(tugasList);
    
//     uniqueTypes.forEach(type => {
//         const filteredTugas = groupByType(tugasList, type);
//         if (filteredTugas.length) {
//             const typeLabel = `=== INFO ${type} ===`; 
//             msg += buildMsg(filteredTugas, typeLabel);
//         }
//     });
    
//     return msg;
// }

// async function getTugasMahasiswa() {
//     try {
//         const url = `https://task.aniqu.biz.id/api/bot/tasks?token=${taskToken}`;
//         console.log('[REMINDER] Mengambil data tugas dari API...');
//         const response = await axios.get(url);
        
//         return response.data;
//     } catch (e) {
//         console.error('[REMINDER] Gagal mengambil data tugas:', e.message || e);
//         return null;
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
//     const res = await getTugasMahasiswa();
    
//     if (!res || !Array.isArray(res.data) || !res.data.length) {
//         console.log('[REMINDER] Gagal mempebarui cache: Data kosong atau format salah.');
//         return;
//     }
    
//     cachedTugasList = res.data;
//     cachedTargetGroups = res.classInfo?.targetGroups || [];
    
//     console.log(`[REMINDER] Cache diperbarui. Jumlah tugas: ${cachedTugasList.length}, Jumlah grup tujuan: ${cachedTargetGroups.length}`);
// }

// async function tugasReminder() {
//     const tugasList = cachedTugasList;
//     if (!tugasList.length) {
//         console.log('[REMINDER] Tidak ada data tugas pada cache untuk dikirim.');
//         return;
//     }

//     const today = new Date();
//     const todayStr = today.toISOString().slice(0,10);

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

//     if (h3Tugas.length) {
//         msg += buildDynamicReminderMsg(h3Tugas, 'H-3');
//     }

//     if (h1Tugas.length) {
//         msg += buildDynamicReminderMsg(h1Tugas, 'H-1');
//     }

//     if (msg.trim()) {
//         if (cachedTargetGroups.length > 0) {
//             for (const jid of cachedTargetGroups) {
//                 await sendReminderToGroup(jid, msg.trim());
//                 console.log(`[REMINDER] Tugas reminder sukses dikirim ke grup: ${jid}`);
//             }
//             lastReminded[todayStr] = true;
//             console.log('[REMINDER] Semua tugas reminder selesai dikirim untuk hari ini:', todayStr);
//         } else {
//             console.log('[REMINDER] Gagal mengirim: Target grup tidak ditemukan di dalam respons API.');
//         }
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