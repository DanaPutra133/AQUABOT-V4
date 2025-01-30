/*
 GIPAWAY PITUR TAMBAHIN DI BOT KALIAN BAGI YANG BELUM PUNYA OITUR NYA
© HERZA
*/
let fs = require('fs');

let giveawayData = JSON.parse(fs.readFileSync('./giveaway.json', 'utf-8') || '{}');

let saveGiveawayData = () => {
    fs.writeFileSync('./giveaway.json', JSON.stringify(giveawayData, null, 2));
};

let parseCustomTime = (timeString) => {
    let timeUnits = {
        s: 1000,
        m: 60 * 1000,
        j: 60 * 60 * 1000
    };
    //yes
    //no

    let totalMs = 0;
    let regex = /(\d+)([smj])/g;
    let match;

    while ((match = regex.exec(timeString)) !== null) {
        let value = parseInt(match[1]);
        let unit = match[2];
        if (timeUnits[unit]) {
            totalMs += value * timeUnits[unit];
        }
    }

    return totalMs;
};

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (command === 'setgiveaway') {
        if (!text) throw `Format salah!\n\nGunakan format:\n${usedPrefix + command} price|maxparticipant|time\n\nContoh:\n${usedPrefix + command} iPhone 14|50|1j30m2s`;

        let [price, maxParticipants, time] = text.split('|');
        if (!price || !maxParticipants || !time) throw `Harap masukkan semua parameter dengan benar!`;

        maxParticipants = parseInt(maxParticipants);
        if (isNaN(maxParticipants) || maxParticipants <= 0) throw `Max participants harus berupa angka yang valid dan lebih besar dari 0!`;

        let duration = parseCustomTime(time);
        if (duration <= 0) throw `Durasi tidak valid, masukkan dalam format yang benar!`;
        let endTime = Date.now() + duration;

        let giveawayId = m.quoted?.id || m.key.id;
        let groupId = m.chat;

        giveawayData[groupId] = {
            giveawayId,
            host: m.sender,
            price,
            maxParticipants,
            duration,
            endTime,
            participants: [],
            isEnded: false
        };

        saveGiveawayData();

        conn.reply(m.chat,
            `🎉 GIVEAWAY STARTED 🎉\n\n` +
            `! Price: ${price}\n` +
            `! Max Participants: ${maxParticipants}\n` +
            `! Duration: ${time}\n` +
            `! Ended at: ${new Date(endTime).toLocaleString()}\n` +
            `! Host: @${m.sender.split('@')[0]}\n` +
            `! ID Giveaway: ${giveawayId}\n\n` +
            `! Note: Balas pesan ini dengan .enter untuk mengikuti giveaway`,
            m, { mentions: [m.sender] }
        );

        setTimeout(() => endGiveaway(groupId, conn, 'timeout'), duration);
    }

    if (command === 'enter') {
        if (!m.quoted || !m.quoted.text) throw `Kamu harus membalas pesan giveaway untuk mengikuti!`;

        let quotedText = m.quoted.text;
        let giveawayIdMatch = quotedText.match(/ID Giveaway: (\S+)/);
        if (!giveawayIdMatch) throw `ID Giveaway tidak ditemukan di pesan yang di-reply!`;

        let giveawayId = giveawayIdMatch[1];
        let groupId = m.chat;
        let giveaway = giveawayData[groupId];

        if (!giveaway || giveaway.giveawayId !== giveawayId) throw `Tidak ada giveaway yang sesuai dengan ID di grup ini atau giveaway sudah berakhir!`;
        if (giveaway.isEnded) throw `Giveaway sudah berakhir!`;
        if (giveaway.participants.includes(m.sender)) throw `Kamu sudah terdaftar di giveaway ini!`;

        giveaway.participants.push(m.sender);
        saveGiveawayData();

        conn.reply(m.chat, `Kamu berhasil masuk ke giveaway!`, m);

        if (giveaway.participants.length >= giveaway.maxParticipants) {
            endGiveaway(groupId, conn, 'participants');
        }
    }
};

let endGiveaway = (groupId, conn, reason) => {
    let giveaway = giveawayData[groupId];
    if (!giveaway || giveaway.isEnded) return;

    giveaway.isEnded = true;

    if (giveaway.participants.length > 0) {
        let winner = giveaway.participants[Math.floor(Math.random() * giveaway.participants.length)];
        saveGiveawayData();

        conn.reply(groupId,
            `🎉 GIVEAWAY ENDED 🎉\n\n` +
            `! Winner: @${winner.split('@')[0]}\n` +
            `! Price: ${giveaway.price}\n` +
            `! Host: @${giveaway.host.split('@')[0]}\n\n` +
            `! Note: Selamat untuk pemenang! Silakan hubungi host untuk klaim hadiah.`,
            null, { mentions: [winner, giveaway.host] }
        );
    } else if (reason === 'timeout') {
        conn.reply(groupId,
            `⏰ Timed Out, GIVEAWAY ENDED ⏰\n\n` +
            `! Price: ${giveaway.price}\n` +
            `! Host: @${giveaway.host.split('@')[0]}\n\n` +
            `! Note: Giveaway telah berakhir karena waktu habis. Tidak ada pemenang.`,
            null, { mentions: [giveaway.host] }
        );
    }

    saveGiveawayData();
};

handler.group = true
handler.admin = true
handler.help = ['setgiveaway']
handler.tags = ['group']
handler.command = /^(setgiveaway|enter)$/i;

module.exports = handler;