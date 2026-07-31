import axios from 'axios';
import { setInterval } from 'timers';

let lastGempaData = null; 

async function getGempaInfo() {
    try {
        const url = `https://api.danafxc.my.id/api/proxy/features/gempa?apikey=${dana}`; // Changed URL to match the new JSON source
        const response = await axios.get(url);
        const res = response.data.data; // Access the 'data' object directly

        if (!res) {
            return;
        }

        // Compare using DateTime for more robust checking
        if (lastGempaData && lastGempaData.DateTime === res.DateTime) {
            return;p
        }

        lastGempaData = res;

        const gempaInfo = {
            tanggal: res.Tanggal,
            jam: res.Jam,
            dateTime: res.DateTime,
            coordinates: res.Coordinates,
            lintang: res.Lintang,
            bujur: res.Bujur,
            magnitude: res.Magnitude,
            kedalaman: res.Kedalaman,
            wilayah: res.Wilayah,
            potensi: res.Potensi,
            dirasakan: res.Dirasakan,
            gambar: `https://data.bmkg.go.id/DataMKG/TEWS/${res.Shakemap}` // Construct the full image URL
        };

        console.log(`
        *Informasi Gempa Terbaru*
        Tanggal: ${gempaInfo.tanggal}
        Jam: ${gempaInfo.jam}
        Magnitudo: ${gempaInfo.magnitude}
        Wilayah: ${gempaInfo.wilayah}
        Kedalaman: ${gempaInfo.kedalaman}
        Potensi: ${gempaInfo.potensi}
        Dirasakan: ${gempaInfo.dirasakan}
        Gambar Peta: ${gempaInfo.gambar}
        `);

        sendGempaReminderToGroups(gempaInfo);
    } catch (error) {
        console.error('[❗] Terjadi kesalahan saat mengambil data gempa:', error);
    }
}

async function sendGempaReminderToGroups(gempaInfo) {
    for (const chatId of Object.keys(global.db.data.chats)) {
        const chat = global.db.data.chats[chatId];
         if (chat.notifgempa) {
            const reminderMessage = `🚨 *PENGINGAT GEMPA BUMI* 🚨\n\n` +
                                    `📅 Tanggal: ${gempaInfo.tanggal}\n` +
                                    `🕒 Jam: ${gempaInfo.jam}\n` +
                                    `🌍 Wilayah: ${gempaInfo.wilayah}\n` +
                                    `💥 Magnitudo: ${gempaInfo.magnitude}\n` +
                                    `🌐 Lintang: ${gempaInfo.lintang}\n` +
                                    `🌐 Bujur: ${gempaInfo.bujur}\n` +
                                    `🔍 Kedalaman: ${gempaInfo.kedalaman}\n` +
                                    `🌊 Potensi: ${gempaInfo.potensi}\n` +
                                    `🗣️ Dirasakan: ${gempaInfo.dirasakan}\n` +
                                    `\nJaga keselamatan kalian!`;
            await sendReminderToGroup(chatId, reminderMessage, gempaInfo.gambar); // Pass image URL
        }
    }
}

async function sendReminderToGroup(chatId, text, imageUrl) {
    await conn.sendMessage(chatId, { image: { url: imageUrl }, caption: text });
}


function startGempaReminder() {
    setInterval(() => {
        getGempaInfo();
    }, 60 * 60 * 1000); 
}

startGempaReminder();