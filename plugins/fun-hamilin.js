let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        let user = global.db.data.users[m.sender]
        if (!user) throw 'Data pengguna tidak ditemukan!'

        // Target (Tag user atau reply pesan)
        let targetJid = m.mentionedJid && m.mentionedJid[0] 
            ? m.mentionedJid[0] 
            : m.quoted 
              ? m.quoted.sender 
              : null

        if (!targetJid) {
            return m.reply(`🤰 *[ DRAMA ISENG - HAMILIN USER ]*\n\nTag atau reply orang yang ingin kamu ajak drama!\nContoh: *${usedPrefix}${command} @user*`)
        }

        if (targetJid === m.sender) {
            return m.reply('Mana bisa hamilin diri sendiri, woi! 🗿')
        }

        if (targetJid === conn.user.jid) {
            return m.reply('Aku cuma bot biasa, jangan ngawur ya! 🤖❌')
        }

        let targetUser = global.db.data.users[targetJid]
        if (!targetUser) return m.reply('Target tidak terdaftar di database!')

        let senderTag = `@${m.sender.split('@')[0]}`
        let targetTag = `@${targetJid.split('@')[0]}`

        // Data Random Drama
        let usiaKandungan = Math.floor(Math.random() * 9) + 1
        let genderBayi = pickRandom([
            '👨‍🦲 Anak Laki-Laki (Super Ganteng)', 
            '👧 Anak Perempuan (Imut & Lucu)', 
            '👶 Kembar 2 (Laki & Perempuan)', 
            '👶 Kembar 3 (Bikin Pusing Kepala)',
            '🤴 Calon Pewaris Tahta RPG'
        ])
        let ngidam = pickRandom([
            'Seblak pedas level 100 jam 2 malam',
            'Es kelapa muda langsung dari pohonnya',
            'Martabak manis tapi toppingnya garam',
            'Beli mobil sport tapi warna pink pastel',
            'Mangga muda hasil petik di halaman tetangga'
        ])
        let biayaSusu = Math.floor(Math.random() * 50000) + 15000

        // PILIHAN SKENARIO ALUR DRAMA PERCAKAPAN
        let scenarios = [
            // SKENARIO 1: DRAMA DI RUMAH SAKIT
            [
                `😱 *[ DRAMA PERINTISAN - EPISODE 1 ]*\n\n${senderTag} tiba-tiba berlari menghampiri ${targetTag} dengan wajah pucat dan tangan gemetaran...`,
                `💬 *${senderTag}:* "Sayang... cobain liat ini deh, ini garis dua merah artinya apa ya? 😳"`,
                `💥 *${targetTag}:* "HAH?! KOK BISA BANYAK GARIS DUA?! KAMU HAMILIN AKU?! TERUS GIMANA INI?! 😭🔥"`,
                `🏥 *[ EPISODE 2: KONSULTASI DOKTER ]*\n\n👨‍⚕️ *Dokter:* "Selamat ya! Kandungannya sangat sehat dan sudah berusia *${usiaKandungan} Bulan*!"`,
                `🧬 *[ HASIL USG CALON BAYI ]*\n\n• Predict Gender: *${genderBayi}* 👶✨\n• Gejala Ngidam: *${ngidam}* 🤤`,
                `💬 *${targetTag}:* "Tanggung jawab nggak kamu?! Beliin aku ${ngidam} sekarang juga, terus mana uang popok?!"`,
                `💬 *${senderTag}:* "Ampun sayang... ini aku transfer uang susu dan modal persalinannya... 💸"`
            ],
            // SKENARIO 2: DRAMA DI CAFE / WARUNG
            [
                `☕ *[ DRAMA KAFE - EPISODE 1 ]*\n\nSedang asik nongkrong, tiba-tiba ${targetTag} merasa mual-mual dan dilemparkan bungkus testpack oleh ${senderTag}...`,
                `💬 *${senderTag}:* "Kamu dari tadi mual terus... coba tebak apa yang ada di balik sedotan ini? 😳"`,
                `💥 *${targetTag}:* "KOK ADA TESTPACK GARIS DUA?! JANGAN BILANG KITA... YA AMPUN PERBUATAN KAMU YA! 😭💥"`,
                `🏥 *[ EPISODE 2: CEK KE PUSKESMAS ]*\n\n👩‍⚕️ *Bidan:* "Alhamdulillah selamat! Janinnya aktif banget, usianya udah *${usiaKandungan} Bulan* lho!"`,
                `🧬 *[ HASIL USG KELUARGA ]*\n\n• Calon Bayi: *${genderBayi}* 👶\n• Tuntutan Ngidam: *${ngidam}* 🥭`,
                `💬 *${targetTag}:* "Kalo nggak tanggung jawab, aku aduin ke orang tua nih! Pokoknya beliin ${ngidam}!"`,
                `💬 *${senderTag}:* "Jangan diaduin dong! Ini modal biaya susu aku kirim sekarang... 💸"`
            ],
            // SKENARIO 3: DRAMA LABRAK MERTUA
            [
                `🏠 *[ DRAMA MERTUA - EPISODE 1 ]*\n\n${senderTag} dan ${targetTag} dipanggil duduk berdua di ruang tamu dengan suasana tegang...`,
                `💬 *${senderTag}:* "Jujur aja deh... kamu kan yang bikin aku kepikiran gara-gara surat dari dokter ini? 😳"`,
                `💥 *${targetTag}:* "SURAT APAAN?! ASTAGA... POSITIF HAMIL ${usiaKandungan} BULAN?! KAMU TANGGUNG JAWAB GAK?! 😱⚡"`,
                `🏥 *[ EPISODE 2: SURAT KETERANGAN KEBIDANAN ]*\n\n👨‍⚕️ *Dokter Spesialis:* "Kondisi bayi sangat prima!"`,
                `🧬 *[ CATATAN MEDIS BAYI ]*\n\n• Prediksi Lahir: *${genderBayi}* 👶🏻\n• Keinginan Ngidam: *${ngidam}* 🍼`,
                `💬 *${targetTag}:* "Beliin popok, beliin susu, beliin ${ngidam}! Awas aja kalo kabur!"`,
                `💬 *${senderTag}:* "Sabar-sabar, nih tak kasih uang belanja bulanan... 💸"`
            ]
        ]

        // Pilih 1 Skenario Secara Acak
        let selectedScenario = pickRandom(scenarios)

        // EKSEKUSI PERCAKAPAN BERTARAH (DELAY 2.5 - 3 DETIK PER PESAN)
        for (let i = 0; i < selectedScenario.length; i++) {
            let msg = selectedScenario[i]
            let mentions = []
            if (msg.includes(senderTag)) mentions.push(m.sender)
            if (msg.includes(targetTag)) mentions.push(targetJid)

            await conn.reply(m.chat, msg, m, { mentions })
            await delay(2800) // Delay 2.8 detik per baris balasan
        }

        // --- PENYELESAIAN FINANSIAL DATABASE RPG ---
        user.money = Math.max(0, (user.money || 0) - biayaSusu)
        targetUser.money = (targetUser.money || 0) + biayaSusu

        let finaleMsg = `
💸 *[ PENYELESAIAN FINANSIAL DRAMA ]*

• ${senderTag} terpotong: *-RP ${biayaSusu.toLocaleString('id-ID')}*
• ${targetTag} menerima: *+RP ${biayaSusu.toLocaleString('id-ID')}* (Uang Susu & Popok)

_Catatan: Ini cuma fitur bercandaan/iseng semata ya! 🤪_
`.trim()

        await conn.reply(m.chat, finaleMsg, m, { mentions: [m.sender, targetJid] })

    } catch (e) {
        console.error(e)
        m.reply('Terjadi kesalahan saat menjalankan fitur hamilin!')
    }
}

// METADATA TERISOLASI KHUSUS FITUR HAMILIN
handler.help = ['hamilin @user']
handler.tags = ['fun']
handler.command = /^(hamilin|buntingin)$/i
handler.group = true

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
}