import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan nama karakter Genshin Impact!\n\nContoh: *${usedPrefix + command} nahida*`;

    let charName = text.trim();
    await m.reply(wait);

    try {
        let apiUrl = `https://api.danafxc.my.id/api/proxy/search/genshin/build?apikey=${dana}&char=${encodeURIComponent(charName)}`;
        
        let res = await fetch(apiUrl);
        let json = await res.json();

        let charData = json?.data?.data || json?.result || json;
        if (!charData || !charData.name) {
            throw `❌ Karakter "${charName}" tidak ditemukan atau terjadi kesalahan pada API.`;
        }

        let weapons = (charData.recommended_weapons || [])
            .slice(0, 3)
            .map(w => `   ◦ *Rank ${w.rank}:* ${w.name}`)
            .join('\n') || '   - Tidak ada data';

        let artifacts = (charData.recommended_artifacts || [])
            .slice(0, 3)
            .map(art => {
                let setDetails = art.sets.map(s => `${s.count}x ${s.name}`).join(' + ');
                return `   ◦ *Rank ${art.rank}:* ${setDetails}`;
            })
            .join('\n') || '   - Tidak ada data';

        let stats = charData.recommended_stats || {};
        let statText = `   • *Sands:* ${stats.Sands || '-'}\n` +
                       `   • *Goblet:* ${stats.Goblet || '-'}\n` +
                       `   • *Circlet:* ${stats.Circlet || '-'}\n` +
                       `   • *Substats:* ${stats.Substats || '-'}`;

        let messageCaption = `*GENSHIN IMPACT BUILD INFO*\n\n` +
            `👤 *Nama:* ${charData.name} (${charData.rarity}⭐)\n` +
            `⚡ *Elemen:* ${charData.element}\n` +
            `⚔️ *Weapon:* ${charData.weapon_type}\n` +
            `🎯 *Role:* ${charData.role || '-'}\n\n` +
            `📌 *REKOMENDASI SENJATA:*\n${weapons}\n\n` +
            ` 🛡️ *REKOMENDASI ARTEFAK:*\n${artifacts}\n\n` +
            `📊 *REKOMENDASI STATS:*\n${statText}\n\n`;

        if (charData.image_url) {
            await conn.sendMessage(m.chat, {
                image: { url: charData.image_url },
                caption: messageCaption
            }, { quoted: m });
        } else {
            await m.reply(messageCaption);
        }

    } catch (e) {
        console.error(e);
        throw e;
    }
}

handler.help = ['genshin <karakter>', 'gi <karakter>', 'build <karakter>'];
handler.tags = ['anime', 'game', 'tools'];
handler.command = /^(genshin|gi|buildgenshin|build)$/i;
handler.limit = true;
handler.group = true;

export default handler;