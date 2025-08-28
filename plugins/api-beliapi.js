let fetch = require('node-fetch');
const { qrisDinamis } = require('../lib/qrisOrkut.js');
const fs = require('fs');
const moment = require('moment-timezone');

const betaweb = 'https://api.betabotz.eu.org';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    // Payment session management
    conn.orderApi = conn.orderApi || {};
    let id = m.sender;
    const currentUser = await conn.getName(id);
    if (id in conn.orderApi) {
        return m.reply(`@${m.sender.split('@')[0]} Kamu masih ada pembayaran yang belum diselesaikan.`);
    }

    if (!text) {
        return m.reply(`*CARA MELAKUKAN PEMBELIAN API*\n\n*Paket yang tersedia:*
1. cheap1 - Rp 3.000 (30 hari)
2. cheap2 - Rp 4.000 (30 hari)
3. premium - Rp 5.000 (30 hari)
4. vip - Rp ~8.000~ 6.000 (60 hari) ( Promo Ultah admin sampai 20 Mei )
5. vvip - Rp ~12.000~ 10.000 (90 hari) ( Promo Ultah admin sampai 20 Mei )
6. supreme - Rp ~20.000~ 15.000 (120 hari) ( Promo Ultah admin sampai 20 Mei )\n
Kirim *${usedPrefix}${command} paket pembelian, username, request nama apikey baru*
Contoh: .beliapi supreme,lann,lannKey`);
    }

    let [paket, username, key] = text.split(',').map(v => v.trim());

    await m.reply('Bot sedang mengecek akun Anda, mohon tunggu...');

    // Fetch data dari API
    let response = await fetch(`https://api.betabotz.eu.org/api/checkexp?username=${username}`);
    let result = await response.json();

    if (!result.result) {
        return m.reply('Kamu bukan user API? Pastikan username yang ada di api tanpa spasi');
    }

    // Opsi role berdasarkan paket pembelian
    let roleOptions = {
        'cheap1': { duration: '30d', price: '3000', command: 'btcheap1', role: 'premium', limit: '3000' },
        'cheap2': { duration: '30d', price: '4000', command: 'btcheap2', role: 'premium', limit: '4000' },
        'premium': { duration: '30d', price: '5000', command: 'btprem', role: 'premium', limit: '5000' },
        'vip': { duration: '60d', price: '6000', command: 'btvip', role: 'vip', limit: '8000' },
        'vvip': { duration: '90d', price: '10000', command: 'btvvip', role: 'vvip', limit: '12000' },
        'supreme': { duration: '120d', price: '15000', command: 'btsupreme', role: 'supreme', limit: '20000' }
    };

    let paketDetail = roleOptions[paket.toLowerCase()];

    if (!paketDetail) {
        return m.reply('Paket tidak valid! Pilih salah satu dari: cheap1, cheap2, premium, vip, vvip, supreme.');
    }

    // Get current date and time in UTC
    const currentDate = await time()

    // Start payment session
    conn.orderApi[id] = {
        username,
        key,
        paket: paketDetail,
        timestamp: Date.now(),
        orderDate: currentDate,
        processedBy: currentUser
    };

    // Calculate fee and total amount
    let fee = await ppn(parseInt(paketDetail.price));
    let totalAmount = parseInt(paketDetail.price) + fee;

    let teks = `*ORDER CONFIRMATION*\n\n` +
        `• Pembelian: ${paket.toUpperCase()} API\n` +
        `• Username: ${username}\n` +
        `• Apikey: ${key}\n` +
        `• Durasi: ${paketDetail.duration}\n` +
        `• Pembayaran: QRIS\n` +
        `• Fee: Rp ${fee}\n` +
        `• Total Bayar: Rp ${totalAmount}\n` +
        `• Tanggal Order: ${currentDate} WIB\n` +
        `• Processed By: ${currentUser}\n\n` +
        `> Notes: Waktu pembayaran hanya 2 menit`;

    // Send QRIS and payment instructions
    let qris = await qrisDinamis(totalAmount.toString(), `/tmp/${m.sender}.jpg`); //membuat qris dinamis
    let bufferqris = await fs.readFileSync(qris); // mengambil qris
    let qrisMessage = await conn.sendMessage(m.chat, {
        image: bufferqris,
        caption: teks
    }, {
        quoted: m
    });

    // Set up payment checking
    const checkInterval = 5000;
    const maxCheckAttempts = 24; // 2 minutes (24 * 5 seconds)
    let attempts = 0;

    const checkPayment = async () => {
        try {
            // Read and check payment from mutasi.json
            let { data } = JSON.parse(fs.readFileSync('./plugins/mutasi.json', 'utf8'));
            let tigaTerbaru = data.slice(0, 3);

            if (tigaTerbaru.some(i => parseInt(i.amount) === totalAmount)) {
                // Hentikan interval sebelum melakukan operasi lainnya
                clearInterval(intervalId);

                const orderData = conn.orderApi[id];
                const rankey = `beta-${orderData.username}`;
                const customKey = orderData.key.toLowerCase() === 'rankey' ? rankey : orderData.key;

                // Construct API URL
                let apiUrl = `${betaweb}/addrole-json?username=${orderData.username}&expired=${orderData.paket.duration}&customKey=${customKey}&token=Erlanganz&type=${orderData.paket.role}&limit=${orderData.paket.limit}`;

                // Call API to activate role
                let activateResponse = await fetch(apiUrl);
                let activateResult = await activateResponse.json();

                if (!/username sudah/i.test(activateResult.result)) {
                    // Success message
                    let successCaption = `✨ Successfully added the ${orderData.paket.role} role! ✨\n\n` +
                        `Username: ${orderData.username}\n` +
                        `New Apikey: ${customKey}\n` +
                        `Limit: ${orderData.paket.limit}\n` +
                        `Expired: ${orderData.paket.duration}\n` +
                        `Number: ${m.sender.split('@')[0]}\n` +
                        `Order Date: ${orderData.orderDate}\n` +
                        `Processed By: ${orderData.processedBy}\n\n` +
                        `Don't forget to change your apikey in your profile 🤠\n\n` +
                        `Thank you for purchasing the ${orderData.paket.role} role on BetaBotz Api\n` +
                        `Enjoy the benefits of the ${orderData.paket.role} role at our Rest API 🤝\n` +
                        `Dont forget to whitelist your ip! Tutorial: https://youtube.com/shorts/EKYGhJHsEwc?si=DK8iopIedeFgcgyW`;
                    // Send success messages
                    await m.reply('Pembayaran Api Berhasil Diselesaikan Terimakasih ☺');

                    // Send detailed success message
                    await conn.sendMessage(m.chat, {
                        text: successCaption,
                        contextInfo: {
                            externalAdReply: {
                                showAdAttribution: true,
                                title: 'Buy Role in BetaBotz-API 🚀',
                                body: '',
                                thumbnailUrl: 'https://telegra.ph/file/ec75e8bd53238f11603d9.jpg',
                                sourceUrl: 'https://api.betabotz.eu.org',
                                mediaType: 1,
                                renderLargerThumbnail: true
                            }
                        }
                    });

                    // Notify admin group
                    await conn.sendMessage('120363348926519927@g.us', {
                        text: `Ada user yang baru saja berhasil membeli api otomatis dengan data sebagai berikut:\n` +
                            `- Username: ${orderData.username}\n` +
                            `- Nomor: ${m.sender.split('@')[0]}\n` +
                            `- Harga: ${totalAmount}\n` +
                            `- Paket: ${orderData.paket.role}\n` +
                            `- Tanggal: ${orderData.orderDate}\n` +
                            `- Processed By: ${orderData.processedBy}`,
                        contextInfo: {
                            mentionedJid: [
                                '6281289694906@s.whatsapp.net',
                                '62895628117900@s.whatsapp.net'
                            ]
                        }
                    });
                } else {
                    m.reply(activateResult.result);
                }

                delete conn.orderApi[id]; // Clear the order
                await conn.sendMessage(m.chat, { delete: qrisMessage.key }); // Hapus pesan QRIS
                return;
            } else if (attempts >= maxCheckAttempts) {
                await conn.sendMessage(m.chat, { delete: qrisMessage.key }); // Hapus pesan QRIS
                await m.reply('Pembayaran Expired!');
                delete conn.orderApi[id]; // Clear the order after time limit
                clearInterval(intervalId); // Stop checking
                return;
            }

            attempts++;
        } catch (error) {
            console.error("Error checking payment:", error);
        }
    };

    const intervalId = setInterval(checkPayment, checkInterval);
};

handler.help = ['beliapi'].map(v => v + ' <paket>,<username>,<apikey>');
handler.tags = ['main'];
handler.command = /^(beliapi)$/i;
handler.private = true;

module.exports = handler;

async function ppn(harga) {
    try {
        const data = JSON.parse(fs.readFileSync('./plugins/mutasi.json', 'utf8')).data; // ganti lokasi mutasinya
        if (!data || data.length === 0) {
            const minPersen = 5;
            const maxPersen = 50;
            const basisPersen = Math.floor(Math.random() * (maxPersen - minPersen + 1)) + minPersen;
            const minVariasiFee = 0;
            const maxVariasiFee = Math.floor(harga / 1000 * 10);
            const variasiFee = Math.floor(Math.random() * (maxVariasiFee - minVariasiFee + 1)) + minVariasiFee;
            const additionalRandomFactor = Math.floor(Math.random() * 100);
            return basisPersen + variasiFee + additionalRandomFactor;
        } else {
            const lastThreeEntries = data.slice(Math.max(0, data.length - 3));
            const lastThreeAmounts = lastThreeEntries.map(entry => entry.amount);
            const minPersen = 5;
            const maxPersen = 50;
            const basisPersen = Math.floor(Math.random() * (maxPersen - minPersen + 1)) + minPersen;
            const minVariasiFee = 0;
            const maxVariasiFee = Math.floor(harga / 1000 * 10);
            const variasiFee = Math.floor(Math.random() * (maxVariasiFee - minVariasiFee + 1)) + minVariasiFee;
            const additionalRandomFactor = Math.floor(Math.random() * 100);
            let pajak = basisPersen + variasiFee + additionalRandomFactor;
            if (lastThreeAmounts.includes(pajak + harga)) {
                pajak = await generateUniqueTax(harga);
            }

            return pajak;
        }
    } catch (error) {
        console.error("Error reading or parsing JSON file:", error);
        return null; 
    }
}

function time() {
    const options = {
        timeZone: 'Asia/Jakarta',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        weekday: 'long',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    };
    
    const waktuSekarang = new Intl.DateTimeFormat('id-ID', options).format(new Date());
    
    return waktuSekarang;
}