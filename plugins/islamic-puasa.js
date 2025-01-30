//Rizky

let handler = async (m, { conn, usedPrefix: _p }) => {
    let targetDate = new Date('April 8, 2025 00:00:00');
    let currentDate = new Date();
    let remainingTime = targetDate.getTime() - currentDate.getTime();
    let days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
    let hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
    let countdownMessage = `Tinggal ${days} hari, ${hours} jam, ${minutes} menit, ${seconds} detik menuju hari puasa tahun 2025!`;

    let img = 'https://telegra.ph/file/c1e45131e3702d2150d2f.jpg';

    let name = m.sender;
    let fkonn = {
        key: {
            fromMe: false,
            participant: `0@s.whatsapp.net`,
            ...(m.chat ? {
                remoteJid: '0@s.whatsapp.net'
            } : {})
        },
        message: {
            contactMessage: {
                displayName: `${await conn.getName(name)}`,
                vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;a,;;;\nFN:${name}\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
            }
        }
    };

    conn.sendMessage(m.chat, {
        text: countdownMessage,
        contextInfo: {
            forwardingScore: 99999,
            isForwarded: true,
            externalAdReply: {
                title: `Puasa 2025`,
                thumbnailUrl: img,
                mediaType: 1,
                renderLargerThumbnail: true
            }
        }
    }, {
        quoted: fkonn
    });
};

handler.help = ['puasa'];
handler.tags = ['info'];
handler.command = /^(puasa)$/i;
handler.owner = false;
handler.mods = false;
handler.premium = false;
handler.group = true;
handler.private = false;
handler.admin = false;
handler.botAdmin = false;
handler.fail = null;

module.exports = handler;