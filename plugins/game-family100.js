let fs = require('fs');
let fetch = require('node-fetch');
let winScore = 500;
let rewardAmount = 100;

async function handler(m) {
    conn.family = conn.family ? conn.family : {};
    let id = m.chat;

    if (id in conn.family) {
        conn.reply(m.chat, 'Masih ada permainan Family 100 yang belum selesai di chat ini.', conn.family[id].msg);
        throw false;
    }

    try {        
        let res = await fetch(`https://api.danafxc.my.id/api/proxy/games?q=family&apikey=${dana}`);
        if (!res.ok) throw await res.text();
        
        let src = await res.json();
        let json = src.data || src; 
    

        let caption = `
┌─⊷ *FAMILY 100*
▢ *Soal:* ${json.soal}
▢ Terdapat *${json.jawaban.length}* jawaban.
▢ Ketik jawaban yang menurutmu benar!
▢ Ketik *nyerah* untuk mengakhiri permainan.
└──────────────

+${rewardAmount} XP untuk setiap jawaban benar!
        `.trim();

        conn.family[id] = {
            id,
            msg: await m.reply(caption),
            ...json,
            terjawab: Array(json.jawaban.length).fill(false), 
            winScore,
            rewardAmount,
            timeout: setTimeout(() => {
                if (conn.family[id]) {
                    let allAnswers = conn.family[id].jawaban.map((jawaban, index) => `${index + 1}. ${jawaban}`).join('\n');
                    conn.reply(m.chat, `Waktu habis! Game berakhir.\n\n*Semua Jawaban:*\n${allAnswers}`, conn.family[id].msg);
                    delete conn.family[id];
                }
            }, 180000) // 3 menit
        };
    } catch (e) {
        console.error(e);
        m.reply('Gagal memulai game. Mungkin sedang ada masalah dengan API.');
    }
}

handler.help = ['family100'];
handler.tags = ['game'];
handler.group = true;
handler.command = /^family100$/i;

handler.nyerah = async function (m) {
    let id = m.chat;
    if (!(id in conn.family)) {
        return m.reply('Tidak ada permainan Family 100 yang sedang berlangsung.');
    }
    let game = conn.family[id];
    let allAnswers = game.jawaban.map((jawaban, index) => `${index + 1}. ${jawaban}`).join('\n');
    m.reply(`Permainan berakhir karena menyerah.\n\n*Semua Jawaban:*\n${allAnswers}`, game.msg);
    clearTimeout(game.timeout);
    delete conn.family[id];
};

module.exports = handler;