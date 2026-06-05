const axios = require('axios');
const cron = require('node-cron');

// ==========================================
// KONFIGURASI BROADCAST
// ==========================================
const BROADCAST_URL = `http://localhost:3000/api/bot/broadcast/whatsapp-pull?token=${taskToken}`;

// Atur interval pengecekan di sini (Format Cron)
// '*/3 * * * *' artinya eksekusi setiap 3 menit
// '*/5 * * * *' artinya eksekusi setiap 5 menit
const BROADCAST_INTERVAL = "*/3 * * * *";

let sentBroadcasts = new Map();

let sentBroadcasts = new Map();

// ==========================================

// Fungsi pengiriman khusus Broadcast (dengan Hidetag penuh)
async function sendBroadcastHidetag(jid, text) {
    const botConn = global.conn || (typeof conn !== 'undefined' ? conn : null);
    
    if (!botConn) {
        console.error('[BROADCAST] Tidak ada koneksi WhatsApp aktif!');
        return;
    }

    try {
        const groupMetadata = await botConn.groupMetadata(jid);
        const participants = groupMetadata.participants.map(p => p.id);

        await botConn.sendMessage(jid, { 
            text: text,
            mentions: participants 
        });
        console.log(`[BROADCAST] Berhasil mengirim pesan massal ke grup: ${jid}`);
    } catch (error) {
        console.error(`[BROADCAST] Gagal mengirim pesan ke ${jid}:`, error.message);
    }
}

async function checkAndSendBroadcast() {
    try {
        const response = await axios.get(BROADCAST_URL);
        const resData = response.data;

        if (!resData || !resData.status || !Array.isArray(resData.data) || resData.data.length === 0) {
            return; 
        }

        const targetGroups = resData.targetGroups || [];
        const messages = resData.data;
        for (const msgText of messages) {
            
            const now = Date.now();
            if (sentBroadcasts.has(msgText)) {
                const lastSentTime = sentBroadcasts.get(msgText);
                const diffMinutes = (now - lastSentTime) / (1000 * 60);
                
                if (diffMinutes < 10) {
                    continue; 
                }
            }

            console.log(`[BROADCAST] Menemukan pesan baru! Proses pengiriman ke ${targetGroups.length} grup...`);
            
            const finalMsg = `*=== 📢 BROADCAST INFORMASI ===*\n\n${msgText}`; // Tambahan header biar rapi
            
            for (const jid of targetGroups) {
                await sendBroadcastHidetag(jid, finalMsg);
            }

            sentBroadcasts.set(msgText, now);
        }

        // ==========================================
        // 6. Memory Cleanup (Pembersihan Histori)
        // Agar RAM server tidak penuh, histori yang 
        // lebih dari 30 menit akan dihapus otomatis.
        // ==========================================
        for (const [key, timestamp] of sentBroadcasts.entries()) {
            if ((Date.now() - timestamp) / (1000 * 60) > 30) {
                sentBroadcasts.delete(key);
            }
        }

    } catch (error) {
        console.error('[BROADCAST] Gagal pull data API:', error.message);
    }
}

cron.schedule(BROADCAST_INTERVAL, () => {
  checkAndSendBroadcast();
});

console.log('[BROADCAST] Sistem pull broadcast aktif (Cek per 1 menit)!');