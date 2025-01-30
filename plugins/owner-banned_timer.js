let schedule = require ('node-schedule')

let handler = async (m, { conn, text, command, participants }) => {
	if (!text) m.reply(" harap masukan target,waktu,dan alasan");
	let [target, time, alasan] = text.split('|');
    if (!target) m.reply('Tag pengguna atau masukkan nomor target!');
    if (!time) m.reply('Masukkan waktu dengan format yang benar! (misal: 10s, 5m, 2h, 1d, atau 2024-12-31 23:59:59)');
    if (!alasan) m.reply('harap masukan alasan');
    let q = { key: { remoteJid: "status@broadcast", participant:"0@s.whatsapp.net", fromMe: false, id: "" },message: { conversation: "[❌] Announce Banned Alert" }}
    let r = { key: { remoteJid: "status@broadcast", participant:"0@s.whatsapp.net", fromMe: false, id: "" },message: { conversation: "[✔️] Announce Banned Alert" }}
    let executeTime;
    if (/^\d+[smhd]$/.test(time)) {
        let value = parseInt(time);
        let unit = time.slice(-1);
        let multiplier = { s: 1000, m: 60000, h: 3600000, d: 86400000 };
        executeTime = new Date(Date.now() + value * multiplier[unit]);
    } else if (/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/.test(time)) {
        executeTime = new Date(time);
        if (isNaN(executeTime)) throw 'Format waktu tidak valid!';
    } else {
        throw 'Format waktu tidak valid! Gunakan format seperti 10s, 5m, 2h, 1d, atau 2024-12-31 23:59:59';
    }

    let targetName = participants.find(p => p.id === target)?.id || target;
    let action;
    let timerName;
    
        if (command === 'banned') {
        global.db.data.users[target + '@s.whatsapp.net'].banned = true
        conn.sendMessage(target + '@s.whatsapp.net', { text: `Hai, Kamu mendapatkan surat peringatan banned dari owner\n\n*Alasan:*\n${alasan} \n*Banned selama:*\n> ${time} \n\n*_diharapkan untuk tidak mengulanginya lagi agar tidak diban_*`}, {quoted: q});
        action = 'true';
        timerName = 'bann';
/*        } else if (command === 'bannedgc') {
        global.db.data.users[target].isBanned = true
        conn.sendMessage(target ,{ text: `Hai Semua \nGrup ini mendapatkan surat peringatan banned dari owner\n\n*Alasan:*\n> ${alasan} \n*Banned selama:*\n> ${time} \n\n*_diharapkan untuk tidak mengulanginya lagi agar tidak diban_*`,mentions: participants.map(a => a.id)}, {quoted: q});
        action = 'true';
        timerName = 'banngc';
*/      } else {
        throw 'terjadi kesalahan';
        }
    m.reply(`${command} telah berhasil.\nTarget: ${target}\nWaltu: ${time}\nAlasan: ${alasan}`);

        schedule.scheduleJob(executeTime, async () => {
            if (timerName === 'bann') {
                global.db.data.users[target + '@s.whatsapp.net'].banned = false
                conn.sendMessage(target + '@s.whatsapp.net', { text: `Hai, Waktu Banned kamu sudah berakhir\n*_diharapkan untuk tidak mengulanginya lagi agar tidak diban_*`}, {quoted: r});
/*          } else if (timerName === 'banngc') {
                global.db.data.users[target].isBanned = false
                conn.sendMessage(target ,{ text: `Hai Semua, Waktu banned grup telah berakhir\n*_diharapkan untuk tidak mengulanginya lagi agar tidak diban_*`,mentions: participants.map(a => a.id)}, {quoted: r});
*/          } 
        });
};

handler.help = ['banned [user] <waktu>','bannedgc [idgc] <waktu>'];
handler.command = /^(banned|bannedgc)$/i;
handler.tags = ['owner'];
handler.owner = true;

module.exports = handler