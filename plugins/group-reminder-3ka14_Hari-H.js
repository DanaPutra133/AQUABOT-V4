const axios = require('axios');
const { setInterval } = require('timers');

let lastReminded = {};
let cachedTugasList = [];
let cachedTargetGroups = []; 

function formatDate(dateStr) {
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
}

function getHMinus(deadline) {
    const today = new Date();
    const dline = new Date(deadline);
    today.setHours(0,0,0,0);
    dline.setHours(0,0,0,0);
    const diff = Math.floor((dline - today) / (1000 * 60 * 60 * 24));
    return diff;
}

function getUniqueJenis(tugasList) {
    const jenisSet = new Set();
    tugasList.forEach(t => {
        if (t.jenis && Array.isArray(t.jenis)) {
            t.jenis.forEach(j => jenisSet.add(j.toUpperCase()));
        }
    });
    return Array.from(jenisSet);
}

function groupByType(tugasList, type) {
    return tugasList.filter(t => t.jenis && t.jenis.some(j => j.toLowerCase() === type.toLowerCase()));
}

function buildMsg(list, typeLabel) {
    if (!list.length) return '';
    const grouped = list.reduce((acc, t) => {
        const mk = (t.subject || 'Tanpa Nama').trim();
        if (!acc[mk]) acc[mk] = [];
        acc[mk].push(t);
        return acc;
    }, {});

    let result = `${typeLabel}\n\n`;
    for (const [mk, tugasMk] of Object.entries(grouped)) {
        result += `*${mk}*\n`;
        tugasMk.forEach(t => {
            const namaTugas = t.taskName ? `${t.taskName} - ${t.title}` : 'gak ada tugas nya woy';
            const deadline = formatDate(t.deadline);
            result += `• ${namaTugas}\n  Deadline: ${deadline}\n`;
        });
        result += '\n';
    }

    return result + '\n';
}

function buildDynamicReminderMsg(tugasList) {
    if (!tugasList.length) return '';
    
    let msg = `=== ⚠️ TUGAS DEADLINE HARI INI ⚠️ ===\n\n`;
    const uniqueTypes = getUniqueJenis(tugasList);
    
    uniqueTypes.forEach(type => {
        const filteredTugas = groupByType(tugasList, type);
        if (filteredTugas.length) {
            const typeLabel = `=== INFO ${type} ===`; 
            msg += buildMsg(filteredTugas, typeLabel);
        }
    });
    
    return msg;
}

async function getTugasMahasiswa() {
    try {
        const url = `https://task.aniqu.biz.id/api/bot/tasks?token=${taskToken}`;
        console.log('[REMINDER H-0] Mengambil data tugas dari API...');
        const response = await axios.get(url);
        
        return response.data;
    } catch (e) {
        console.error('[REMINDER H-0] Gagal mengambil data tugas:', e.message || e);
        return null;
    }
}

// Fungsi pengiriman dengan HIDETAG
async function sendReminderToGroup(jid, text) {
    const botConn = global.conn || (typeof conn !== 'undefined' ? conn : null);
    
    if (!botConn) {
        console.error('[REMINDER H-0] No WhatsApp connection object found!');
        return;
    }

    try {
        // Ambil data metadata grup untuk mendapatkan list peserta
        const groupMetadata = await botConn.groupMetadata(jid);
        const participants = groupMetadata.participants.map(p => p.id);

        // Kirim pesan dengan mentions seluruh anggota (hidetag)
        await botConn.sendMessage(jid, { 
            text: text,
            mentions: participants 
        });
        console.log(`[REMINDER H-0] Berhasil mengirim hidetag ke ${jid}`);
    } catch (error) {
        console.error(`[REMINDER H-0] Gagal mengirim pesan ke ${jid}:`, error);
    }
}

async function updateTugasCache() {
    const res = await getTugasMahasiswa();
    
    if (!res || !Array.isArray(res.data) || !res.data.length) {
        console.log('[REMINDER H-0] Gagal memperbarui cache: Data kosong atau format salah.');
        return;
    }
    
    cachedTugasList = res.data;
    cachedTargetGroups = res.classInfo?.targetGroups || [];
    
    console.log(`[REMINDER H-0] Cache diperbarui. Jumlah tugas: ${cachedTugasList.length}, Jumlah target grup: ${cachedTargetGroups.length}`);
}

async function tugasReminder() {
    const tugasList = cachedTugasList;
    if (!tugasList.length) {
        console.log('[REMINDER H-0] Tidak ada data tugas pada cache untuk dikirim.');
        return;
    }

    const today = new Date();
    const todayStr = today.toISOString().slice(0,10);

    const hTugas = tugasList.filter(t => getHMinus(t.deadline) === 0);

    if (!hTugas.length) {
        console.log('[REMINDER H-0] Tidak ada tugas dengan deadline hari ini.');
        return;
    }

    if (lastReminded[todayStr]) {
        console.log('[REMINDER H-0] Reminder sudah dikirim hari ini.');
        return;
    }

    // Bangun pesan secara dinamis berdasarkan jenis yang ada di API
    let msg = buildDynamicReminderMsg(hTugas);

    if (msg.trim()) {
        if (cachedTargetGroups.length > 0) {
            for (const jid of cachedTargetGroups) {
                await sendReminderToGroup(jid, msg.trim());
            }
            lastReminded[todayStr] = true;
            console.log('[REMINDER H-0] Semua tugas reminder H-0 selesai dikirim untuk hari ini:', todayStr);
        } else {
            console.log('[REMINDER H-0] Gagal mengirim: Target grup tidak ditemukan di dalam respons API.');
        }
    }
}

setInterval(async () => {
    const now = new Date();
    await updateTugasCache(); 
    
    // Mengecek pada pukul 06:00
    if (now.getHours() === 6 && now.getMinutes() === 0) {
        console.log('[REMINDER H-0] Mengecek tugas pada jam 06:00...');
        await tugasReminder();
    } else {
        console.log(`[REMINDER H-0] Interval aktif, sekarang jam ${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`);
    }
}, 60 * 1000);