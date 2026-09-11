import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `*Format Salah!*\n\nContoh penggunaan:\n*${usedPrefix + command} chixia*\n*${usedPrefix + command} jiyan*`;
    
    let charName = text.trim();
    await m.reply(wait);

    try {
        let res = await fetch(`https://api.danafxc.my.id/api/proxy/search/wuwa/build?apikey=${dana}&char=${encodeURIComponent(charName)}`);
        let json = await res.json();

        // if (!json || json.source !== 'api' || !json.data || json.data.status !== 'success') {
        //     throw `Karakter *"${charName}"* tidak ditemukan atau terjadi kesalahan pada API.`;
        // }

        let d = json.data.data;
        let meta = d.character_metadata;
        let stats = d.best_echo_stats;
        
        let weapons = (d.best_weapons || []).slice(0, 3).map((w, i) => 
            `  ${i + 1}. *${w.weapon_name}* (${w.dupe_rank}) - ${w.percentage_performance}`
        ).join('\n') || '-';

        let skillOrder = (d.skill_upgrade_priority?.order || []).join(' ➔ ') || '-';

        let msg = `*WUTHERING WAVES BUILD GUIDE*\n` +
            `Character: *${meta.name}* (${meta.rarity_stars}⭐ ${meta.element} | ${meta.weapon_type})\n\n` +

            `📌 *Overview*\n` +
            `_“${d.review?.summary || 'Tidak ada ringkasan.'}”_\n\n` +

            `📈 *Skill Upgrade Priority*\n` +
            `👉 ${skillOrder}\n\n` +

            `⚔️ *Best Weapons*\n` +
            `${weapons}\n\n` +

            `🛡️ *Best Echo & Stats*\n` +
            `• *Echo Set*: ${d.best_echo_sets?.[0]?.set_name || '-'}\n` +
            `• *Main Echo*: ${d.best_echo_sets?.[0]?.main_echo_options?.[0]?.echo_name || '-'}\n` +
            `• *Main Stats*:\n` +
            `  - Cost 4: ${stats.main_stats?.cost_4?.join(' / ') || '-'}\n` +
            `  - Cost 3: ${stats.main_stats?.cost_3?.join(' / ') || '-'}\n` +
            `  - Cost 1: ${stats.main_stats?.cost_1?.join(' / ') || '-'}\n` +
            `• *Substats*: ${(stats.substats_priority || []).join(', ')}\n\n` +

            `👥 *Synergies / Best Partners*\n` +
            `• ${(d.synergies || []).slice(0, 3).map(s => s.characters?.join(', ')).filter(Boolean).join(', ') || '-'}`;

        await m.reply(msg);

    } catch (e) {
        console.error(e);
        throw e;
    }
}

handler.help = ['wuwa <karakter>', 'wuwabuild <karakter>'];
handler.tags = ['game', 'rpg'];
handler.command = /^(wuwa|wuwabuild|wwbuild)$/i;
handler.limit = true;

export default handler;