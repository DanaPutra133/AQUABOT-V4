let handler = async (m, { conn, command }) => {
    let user = global.db.data.users[m.sender];

    try {
        if (command === 'genshindaily') {
            // Periksa apakah pengguna sudah melakukan claim daily
            let currentTime = new Date().getTime();  // Waktu saat ini dalam milidetik
            let lastClaimTime = user.lastgensin || 0;  // Waktu klaim terakhir dalam milidetik
            let timeDifference = currentTime - lastClaimTime;

            // Jika perbedaan waktu kurang dari 24 jam, berarti sudah melakukan claim
            if (timeDifference < 86400000) {  // 86400000ms = 24 jam
                let timeLeft = 86400000 - timeDifference;
                let hours = Math.floor(timeLeft / 3600000);
                let minutes = Math.floor((timeLeft % 3600000) / 60000);
                let seconds = Math.floor((timeLeft % 60000) / 1000);
                return m.reply(`Anda sudah melakukan claim daily. Cobalah lagi dalam ${hours} jam, ${minutes} menit, ${seconds} detik.`);
            }

            // Berikan reward untuk daily
            let resinReward = 60;  // Set hadiah resin
            let primoReward = 20;  // Set hadiah primogems
            let moraReward = 1000;  // Set hadiah mora

            // Update database dengan rewards
            user.resin += resinReward;
            user.primo += primoReward;
            user.mora += moraReward;

            // Update waktu terakhir claim daily
            user.lastgensin = currentTime;

            // Kirim pesan konfirmasi
            m.reply(`Claim daily berhasil!\n+${resinReward} Resin\n+${primoReward} Primogems\n+${moraReward} Mora`);
        } else if (command === 'resetdaily') {
            // Reset daily untuk pengujian
            user.lastgensin = 0;
            m.reply("Data daily Anda telah direset untuk pengujian.");
        } else {
            m.reply("Perintah tidak dikenali.\nGunakan perintah *genshindaily* untuk claim daily rewards.");
        }
    } catch (err) {
        m.reply("Error\n\n" + err.stack);
    }
};

// Metadata
handler.help = ['genshindaily', 'resetdaily'];
handler.tags = ['rpg'];
handler.command = /^(genshindaily|resetdaily)$/i;
handler.register = true;
handler.group = true;
handler.rpg = true;

module.exports = handler;
