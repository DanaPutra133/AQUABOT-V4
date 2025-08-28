/*
let fetch = require('node-fetch');
const { qris } = require('../lib/qris.js');

let handler = async (m, { conn, text, usedPrefix, command }) => {
if (!text) {
        return m.reply(`*CARA MELAKUKAN PEMBELIAN API*\n\n*Paket yang tersedia:*
1. cheap1 - Rp 3.000 (30 hari)
2. cheap2 - Rp 4.000 (30 hari)
3. premium - Rp 5.000 (30 hari)
4. vip - Rp 8.000 (60 hari)
5. vvip - Rp 12.000 (90 hari)
6. supreme - Rp 20.000 (120 hari)\n
Kirim *${usedPrefix}${command} paket pembelian, username, request nama apikey baru*
Contoh: .buyapi supreme,lann,lannKey`);
    }

    let [paket, username, key] = text.split(',').map(v => v.trim());

    await m.reply(`Bot sedang mengecek akun Anda, mohon tunggu...`);

    // Fetch data dari API
    let response = await fetch(`https://api.betabotz.eu.org/api/checkexp?username=${username}`);
    let result = await response.json();
    console.log(result);

    // Jika result.result.username adalah null atau tidak ada
    if (!result.result) {
        return m.reply(`Kamu bukan user API? Pastikan username yang ada di api tanpa spasi`); // Jangan lakukan apa-apa jika username tidak terdaftar
    }

    // Opsi role berdasarkan paket pembelian
    let roleOptions = {
        'cheap1': { duration: '30d', price: '3000', command: 'btcheap1', role: 'premium', limit: '3000' },
        'cheap2': { duration: '30d', price: '4000', command: 'btcheap2', role: 'premium', limit: '4000' },
        'premium': { duration: '30d', price: '5000', command: 'btprem', role: 'premium', limit: '5000' },
        'vip': { duration: '60d', price: '8000', command: 'btvip', role: 'vip', limit: '8000' },
        'vvip': { duration: '90d', price: '12000', command: 'btvvip', role: 'vvip', limit: '12000' },
        'supreme': { duration: '120d', price: '20000', command: 'btsupreme', role: 'supreme', limit: '20000' }
    };

    let paketDetail = roleOptions[paket.toLowerCase()];

    if (!paketDetail) {
        return m.reply(`Paket tidak valid! Pilih salah satu dari: cheap1, cheap2, premium, vip, vvip, supreme.`);
    }

    // Instruksi pembayaran
    let instruksi = `Silahkan Scan Qris di atas dengan harga ${paketDetail.price}\n\nJika sudah melakukan pembayaran dengan cara scan Qris, silahkan kirim gambar bukti pembayaran dengan caption yang diberikan bot.\n\nHarap ikuti instruksi ini agar admin dapat memproses pembelian.`;

    let teks = `*PEMBELIAN API!*\n\nHalo Ka: *@${m.sender.split`@`[0]}*\n\n${instruksi}\n\n`;

    //  const qr = await qris(`${paketDetail.price}`);
    await conn.sendMessage('120363348926519927@g.us', {
        text: `Ada user yang baru saja request pembelian api dengan data sebagai berikut :\n- username ${username}\n- nomor: ${m.sender.split`@`[0]}\n- harga: ${paketDetail.price}\n- paket: ${paketDetail.role}\n\n`,
        contextInfo: {
            mentionedJid: [
                '6281289694906@s.whatsapp.net',
                '62895628117900@s.whatsapp.net'
            ]
        }
    });
    
    await conn.sendMessage(m.chat, {
        // image: { url: 'https://api.betabotz.eu.org/api/tools/get-upload?id=f/eygr17xc.jpg' },
       // image: { url: 'https://files.catbox.moe/j5uq2m.png' },
        // caption: teks,
    // });
// image: { url: 'https://files.catbox.moe/yi87jx.png' },
        // caption: teks,
    // });
    image: { url: 'https://files.catbox.moe/5886vh.jpg' },
        caption: teks,
    });
    // await conn.sendFile(m.chat, qr, null, teks, m);
    await m.reply(`.prosesapi ${paket}, ${username}, ${key}`);
};

handler.help = ['buyapi'].map(v => v + ' <paket>,<username>,<apikey>');
handler.tags = ['main'];
handler.command = /^(buyapi)$/i;
handler.private = true;

module.exports = handler;

*/