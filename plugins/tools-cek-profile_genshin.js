const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan UID Genshin Impact yang ingin Anda cari.\n\n*Contoh:*\n${usedPrefix + command} 816373749`;

    if (!/^\d{9}$/.test(text)) {
        throw `Format UID tidak valid. UID harus terdiri dari 9 digit angka.`;
    }

    try {
        m.reply(`- 🔍 Sedang mencari data untuk UID *${text}*...`);

        const apiUrl = `https://api.danafxc.my.id/api/proxy/search/genshin?uid=${text}&apikey=${dana}`;
        const response = await axios.get(apiUrl);
        const result = response.data;

        if (!result || !result.status || !result.data || !result.data.playerInfo) {
            throw new Error(result.message || `Data untuk UID "${text}" tidak ditemukan.`);
        }

        const player = result.data.playerInfo;

        let replyText = `
🎮 *Profil Pemain Genshin Impact* 🎮

- 👤 *Nickname:* ${player.nickname}
- ✨ *Adventure Rank (AR):* ${player.level}
- 🌍 *World Level:* ${player.worldLevel || '-'}
- 📝 *Signature:* ${player.signature || '_Tidak ada signature_'}

- 🏆 *Achievement:* ${player.finishAchievementNum || '0'}
- 🌀 *Spiral Abyss:* Floor ${player.towerFloorIndex || '0'} - Chamber ${player.towerLevelIndex || '0'}

- 🌟 *Karakter di Profil:* ${player.showAvatarInfoList ? player.showAvatarInfoList.length : '0'} Karakter
`;

        // Menambahkan daftar semua karakter yang ditampilkan di profil
        if (player.showAvatarInfoList && player.showAvatarInfoList.length > 0) {
            replyText += `\n*Karakter Showcase:*\n`;
            
            // --- PERUBAHAN DI SINI ---
            // Menghapus .slice(0, 5) untuk menampilkan semua karakter
            player.showAvatarInfoList.forEach(avatar => {
                replyText += `- Level ${avatar.level} (Avatar ID: ${avatar.avatarId})\n`;
            });
            // --- AKHIR PERUBAHAN ---
        }

        m.reply(replyText.trim());

    } catch (error) {
        console.error('Error pada fitur Genshin:', error);
        let errorMessage = `Gagal mengambil data profil. Pastikan UID benar dan publik.`;
        if (error.response && error.response.data && error.response.data.message) {
            errorMessage += `\n*Pesan API:* ${error.response.data.message}`;
        }
        m.reply(errorMessage);
    }
};

handler.help = ['genshin <UID>', 'gi <UID>'];
handler.tags = ['tools', 'game'];
handler.command = /^(genshin|gi)$/i;
handler.limit = true;

module.exports = handler;