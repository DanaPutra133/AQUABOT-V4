let axios = require('axios');
let moment = require('moment-timezone'); 


async function sendReminderToGroup(chatId, text) {
    if (conn) { // Pastikan conn ada sebelum digunakan
        await conn.sendMessage(chatId, { text });
    } else {
        console.error("[❗] Variabel 'conn' tidak terdefinisi. Tidak bisa mengirim pesan pengingat.");
    }
}

async function getPrayerTimesAndSetReminders() {
    try {
        let city = 'jakarta';
        
        
        let url = `https://api.danafxc.my.id/api/proxy/islamic/sholat?kota=${city}&tanggal=now&apikey=${dana}`;
        let response = await axios.get(url);
        let jsonData = response.data;

        if (!jsonData || !jsonData.status) {
            console.log(`[❗] Jadwal shalat untuk kota ${city.toUpperCase()} tidak ditemukan atau API mengembalikan error.`);
            return;
        }
        const jadwal = jsonData.data.timings;
        
        if (jadwal) {
            console.log(`
┌─「 JADWAL SHOLAT ${city.toUpperCase()} 」
├ Subuh: ${jadwal.Fajr}
├ Dzuhur: ${jadwal.Dhuhr}
├ Ashar: ${jadwal.Asr}
├ Maghrib: ${jadwal.Maghrib}
├ Isya: ${jadwal.Isha}
└──────────`);

            setPrayerTimers(jadwal);
        } else {
            console.log(`[❗] Tidak ada data jadwal sholat untuk tanggal hari ini.`);
        }

    } catch (error) {
        console.error(`[❗] Terjadi kesalahan saat mengambil data jadwal sholat.`, error.message);
    }
}

// ⛔ TIDAK ADA PERUBAHAN LOGIKA PADA FUNGSI DI BAWAH INI ⛔

function setPrayerTimers(jadwal) {
    let now = moment().tz('Asia/Jakarta');

    function calculateTimeDifference(prayerTime) {
        let cleanTime = prayerTime.replace(' (WIB)', '').trim();
        let [hours, minutes] = cleanTime.split(':').map(Number);
        
        let prayerDate = now.clone().hour(hours).minute(minutes).second(0).millisecond(0);
        
        // Jika waktu sholat sudah lewat untuk hari ini, atur untuk besok
        if (prayerDate.isBefore(now)) {
           // prayerDate.add(1, 'days'); // Uncomment jika ingin pengingat berjalan untuk hari berikutnya jika sudah terlewat
           return -1; // Mengembalikan nilai negatif jika sudah terlewat
        }
        
        return prayerDate.diff(now);
    }

    let prayerTimes = [
        { name: 'Subuh', time: jadwal.Fajr },
        { name: 'Dzuhur', time: jadwal.Dhuhr },
        { name: 'Ashar', time: jadwal.Asr },
        { name: 'Maghrib', time: jadwal.Maghrib },
        { name: 'Isya', time: jadwal.Isha },
    ];

    for (let prayer of prayerTimes) {
        let timeDifference = calculateTimeDifference(prayer.time);

        if (timeDifference > 0) {
            setTimeout(() => {
                sendPrayerReminderToGroups(prayer.name, prayer.time);
            }, timeDifference);
        }
    }
}

async function sendPrayerReminderToGroups(prayerName, prayerTime) {
    // Pastikan global.db.data.chats ada dan terstruktur dengan benar
    if (!global.db || !global.db.data || !global.db.data.chats) {
        console.error("[❗] Database (global.db.data.chats) tidak ditemukan. Pengingat tidak dapat dikirim.");
        return;
    }

    for (const chatId of Object.keys(global.db.data.chats)) {
        const chat = global.db.data.chats[chatId];
        if (chat.notifsholat) {
            const reminderMessage = `⏰ *PENGINGAT SHOLAT*\n\n🚨 Waktu Sholat *${prayerName}* telah tiba!\nJam: *${prayerTime}*\n\nJangan lupa untuk melaksanakan sholat.`;
            await sendReminderToGroup(chatId, reminderMessage); 
        }
    }
}

function startDailyPrayerReminder() {
    console.log("⏰ Pengingat Sholat Harian diaktifkan.");
    getPrayerTimesAndSetReminders();

    // Mengatur interval untuk mengambil jadwal baru setiap 6 jam
    setInterval(() => {
        let now = moment().tz('Asia/Jakarta');
        console.log(`[🔄] Memperbarui jadwal sholat untuk hari ini (${now.format('DD-MM-YYYY')})`);
        getPrayerTimesAndSetReminders();
    }, 6 * 60 * 60 * 1000); // setiap 6 jam sekali
}

startDailyPrayerReminder();