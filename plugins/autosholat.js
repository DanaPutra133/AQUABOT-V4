let axios = require('axios');

let city = 'jakarta';

async function getPrayerTimesAndSetReminders() {
    try {
        let url = `https://api.aladhan.com/v1/timingsByCity?city=${city}&country=Indonesia&method=2`;
        let response = await axios.get(url);

        let data = response.data;
        if (!data || data.code !== 200) {
            console.log(`[❗] Jadwal shalat untuk kota ${city.toUpperCase()} tidak ditemukan atau tidak tersedia.`);
            return;
        }

        let jadwal = data.data.timings;
        if (!jadwal) {
            console.log(`[❗] Jadwal shalat untuk kota ${city.toUpperCase()} tidak ditemukan atau tidak tersedia.`);
            return;
        }

        console.log(`
┌「 ${city.toUpperCase()} 」
├ Subuh: ${jadwal.Fajr}
├ Dzuhur: ${jadwal.Dhuhr}
├ Ashar: ${jadwal.Asr}
├ Maghrib: ${jadwal.Maghrib}
├ Isya: ${jadwal.Isha}
└──────────`);

        setPrayerTimers(jadwal);

    } catch (error) {
        console.error(`[❗] Terjadi kesalahan saat mengambil data.`);
    }
}

function setPrayerTimers(jadwal) {
    let now = new Date();

    function calculateTimeDifference(prayerTime) {
        let [hours, minutes] = prayerTime.split(':').map(Number);
        let prayerDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hours, minutes);

        return prayerDate.getTime() - now.getTime();
    }

    let prayerTimes = [
        { name: 'Subuh', time: jadwal.Fajr },
        { name: 'Dzuhur', time: jadwal.Dhuhr },
        { name: 'Ashar', time: jadwal.Asr },
        { name: 'Maghrib', time: jadwal.Maghrib },
        { name: 'Isya', time: jadwal.Isha }
    ];

    for (let prayer of prayerTimes) {
        let timeDifference = calculateTimeDifference(prayer.time);

        if (timeDifference > 0) {
            setTimeout(() => {
                console.log(`[❗] Waktu sholat ${prayer.name} telah tiba. Jangan lupa untuk melaksanakan sholat.`);
            }, timeDifference);
        }
    }
}

function startDailyPrayerReminder() {
    getPrayerTimesAndSetReminders();

    setInterval(() => {
        let now = new Date();
        console.log(`Mengambil jadwal sholat untuk hari ini (${now.toLocaleDateString()})`);
        getPrayerTimesAndSetReminders();
    }, 24 * 60 * 60 * 1000); // Interval 24 jam
}

startDailyPrayerReminder();