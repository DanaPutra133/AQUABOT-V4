import fetch from 'node-fetch';
import uploadImage from '../lib/uploadImage.js';

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let q = m.quoted ? m.quoted : m;
    let mime = (q.msg || q).mimetype || q.mediaType || '';

    let templateText = `*📋 CARA MEMBUAT LAPORAN TIKET ERROR*\n\n` +
        `Kirim/Reply gambar screenshot error dengan caption format berikut:\n` +
        `\`${usedPrefix}${command} Nama Fitur | Deskripsi Error | Email (Opsional)\`\n\n` +
        `📌 *Contoh Penggunaan:*\n` +
        `\`${usedPrefix}${command} Downloader TikTok | Video gagal terdownload dan muncul error status 500 | user@email.com\`\n\n` +
        `💡 *Catatan:* Email bersifat opsional jika Anda ingin menerima notifikasi pembaruan tiket.`;

    if (!text || text.length < 5) {
        return m.reply(templateText);
    }

    if (!/^image/.test(mime) || /webp/.test(mime)) {
        return m.reply(`⚠️ *Harap sertakan atau reply gambar screenshot error!*\n\n${templateText}`);
    }

    try {
        await m.reply('⏳ _Mengunggah bukti dan membuat tiket laporan..._');

        let imgBuf = await q.download();
        if (imgBuf.length > 5 * 1024 * 1024) throw 'Ukuran gambar maksimal 5MB!';
        
        let imageUrl = await uploadImage(imgBuf);
        if (!imageUrl) throw 'Gagal mengunggah gambar bukti error.';

        let [featureName, description, reporterEmail] = text.split('|').map(v => v.trim());

        if (!featureName || !description) {
            return m.reply(
                `⚠️ *Format laporan tidak lengkap!*\n` +
                `Pastikan menyertakan Nama Fitur dan Deskripsi Error dipisahkan garis tegak (\`|\`).\n\n` +
                `📌 *Contoh:* \`${usedPrefix}${command} Downloader TikTok | Video gagal didownload\``
            );
        }

        if (description.length > 200) {
            throw 'Deskripsi terlalu panjang, maksimal 200 karakter!';
        }

        let botJid = conn.user?.id || conn.user?.jid || '';
        let rawBotNum = botJid.split('@')[0].split(':')[0].replace(/[^0-9]/g, '');

        if (rawBotNum.startsWith('62')) {
            rawBotNum = '0' + rawBotNum.slice(2);
        }

        let formattedBotNum = rawBotNum || (global.nomorBot ? global.nomorBot.replace(/[^0-9]/g, '') : '');

        if (!formattedBotNum) {
            throw 'Gagal mendeteksi nomor bot secara otomatis.';
        }

        let ownerCaption = `*🚨 LAPORAN BUKTI ERROR TIKET*\n\n` +
            `• *Pelapor:* @${m.sender.split('@')[0]}\n` +
            `• *Fitur:* ${featureName}\n` +
            `• *Deskripsi:* ${description}\n` +
            `• *Email:* ${reporterEmail || '-'}\n` +
            `• *Image:* ${imageUrl}\n`;

        await conn.sendMessage(global.groupLapor, {
            image: imgBuf,
            caption: ownerCaption,
            contextInfo: {
                mentionedJid: [
                    m.sender,
                    ...global.owner.map(v => v + "@s.whatsapp.net")
                ]
            }
        }).catch(err => console.error('Gagal kirim ke WA Group Lapor:', err?.message));

        let apiUrl = `https://bot.aniqu.biz.id/api/public-tickets?botNumber=${formattedBotNum}`;
        
        let payload = {
            featureName: featureName,
            description: description,
            images: imageUrl, 
            reporterEmail: reporterEmail || ''
        };

        let response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        let resData = await response.json();

        if (resData && resData.success && resData.data?.ticketLink) {
            let ticketLink = resData.data.ticketLink;
            let ticketData = resData.data.ticket;

            let replyMsg = `✅ *Laporan Error Berhasil Dikirim!*\n\n` +
                `• *No Tiket Bot:* ${ticketData?.botNumber || formattedBotNum}\n` +
                `• *Fitur:* ${ticketData?.featureName || featureName}\n` +
                `• *Status:* ${ticketData?.status || 'processing'}\n\n` +
                `🔗 *Link Tiket Laporan:* \n${ticketLink}\n\n` +
                `> Klik link di atas untuk memantau status perbaikan tiket kamu secara real-time.`;
            
            return m.reply(replyMsg);
        } else {
            console.log('[Lapor API Fail Response]:', resData);
            throw `API Error: ${resData?.message || 'Gagal mendapatkan ticket link dari server.'}`;
        }

    } catch (e) {
        console.error('[Lapor Exec Error]:', e);
        m.reply(typeof e === 'string' ? e : `❌ Terjadi kesalahan: ${e?.message || e}`);
    }
};

handler.help = ['lapor', 'laporowner'].map(v => v + ' <fitur | deskripsi | email>');
handler.tags = ['main'];
handler.command = /^(lapor|laporowner)$/i;
handler.group = true;

export default handler;