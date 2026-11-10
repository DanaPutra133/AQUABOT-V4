let handler = async (m, { conn, command, args, usedPrefix }) => {
    let pengguna = global.db.data.users[m.sender]
    if (!pengguna) throw 'Data pengguna tidak ditemukan!'

    // Pastikan nilai database tidak NaN / undefined
    let pancingan = pengguna.pancingan || 0
    let pemancing = await conn.getName(m.sender)
    let umpan = pengguna.umpan || 0
    let type = (args[0] || '').toLowerCase()

    let htjava = '🎣' // Fallback simbol jika htjava tidak ada di global

    const listMessage = `
🎣 *PILIHAN LEVEL MANCING* 🎣

• ${usedPrefix}${command} emosi
• ${usedPrefix}${command} easy 
• ${usedPrefix}${command} normal
• ${usedPrefix}${command} hard 
• ${usedPrefix}${command} extreme

*Contoh:* ${usedPrefix}${command} emosi`.trim()

    try {
        switch (type) {
            case 'emosi': {
                let __timers = (new Date() - (pengguna.lastfishing || 0))
                let _timers = (240000 - __timers) 
                let timers = clockString(_timers)

                if ((pengguna.stamina || 0) < 20) {
                    return m.reply(`Stamina anda tidak cukup!\nHarap isi stamina anda dengan *${usedPrefix}eat*`)
                }

                if (new Date() - (pengguna.lastfishing || 0) <= 240000) {
                    return m.reply(`Kamu masih kelelahan!\nHarap tunggu *${timers}* lagi`)
                }

                if ((pengguna.fishingrod || 0) <= 0) {
                    return conn.reply(m.chat, `*[❗] Kamu tidak punya kail pancingan!*\n\nKetik *${usedPrefix}buy pancingan 1* untuk membeli`, m)
                }

                let ikan = Math.floor(Math.random() * 30)
                let lele = Math.floor(Math.random() * 15)
                let nila = Math.floor(Math.random() * 10)
                let bawal = Math.floor(Math.random() * 10)
                let udang = Math.floor(Math.random() * 39)
                let paus = Math.floor(Math.random() * 2)
                let kepiting = Math.floor(Math.random() * 27)

                let psepick = parseInt(pickRandom(['1', '0', '0', '1'])) || 0
                let psenjata = parseInt(pickRandom(['1', '0', '0', '0'])) || 0

                let mcng = `
*Hasil 🎣 Fishing ${pemancing}!*

🐟 Nila : ${nila}
🐡 Bawal : ${bawal}
🐟 Lele : ${lele}
🐟 Ikan : ${ikan}
🦐 Udang : ${udang}
🐋 Paus: ${paus}
🦀 Kepiting: ${kepiting}

Kamu bisa memasak ini dan memakannya 💉
_Example:_ ${usedPrefix}cook`.trim()

                setTimeout(() => {
                    conn.reply(m.chat, mcng, m)
                    if (psepick > 0) {
                        pengguna.psepick = (pengguna.psepick || 0) + psepick
                        conn.reply(m.chat, `You Get 🎁 chest weapons epic ${psepick} item`, m)
                    } 
                    if (psenjata > 0) {
                        pengguna.psenjata = (pengguna.psenjata || 0) + psenjata
                        conn.reply(m.chat, `You Get 🎁 chest weapons epic ${psenjata} item`, m)
                    }
                }, 38000)

                setTimeout(() => {
                    conn.reply(m.chat, `${pemancing} Sepertinya dapat sesuatu...`, m)
                }, 28000)
                setTimeout(() => {
                    conn.reply(m.chat, `${pemancing} Menunggu...`, m)
                }, 8000)
                setTimeout(() => {
                    conn.reply(m.chat, `${pemancing} Sedang Memancing...`, m)
                }, 0)

                pengguna.nila = (pengguna.nila || 0) + nila
                pengguna.ikan = (pengguna.ikan || 0) + ikan
                pengguna.lele = (pengguna.lele || 0) + lele
                pengguna.bawal = (pengguna.bawal || 0) + bawal
                pengguna.udang = (pengguna.udang || 0) + udang
                pengguna.paus = (pengguna.paus || 0) + paus
                pengguna.kepiting = (pengguna.kepiting || 0) + kepiting
                pengguna.lastfishing = new Date().getTime()
                break
            }

            case 'easy': {
                let _coinesa = (new Date() - (pengguna.lastmancingeasy || 0))
                let coinesa = (28800000 - _coinesa)
                let timersa = clockString(coinesa)

                if (pancingan === 0 || umpan === 0) {
                    return conn.reply(m.chat, `*[❗] Kamu tidak punya kail pancingan dan umpan!*\n\nKetik *${usedPrefix}buy pancingan 1*\nKetik *${usedPrefix}buy umpan 100*`, m)
                }

                if (new Date() - (pengguna.lastmancingeasy || 0) <= 28800000) {
                    return conn.reply(m.chat, `*Sepertinya Anda Sudah Lelah*\n*Silahkan Istirahat Sejenak Sekitar* ${timersa}\n*Untuk Bisa Melanjutkan Memancing Lagi*`, m)
                }

                if (pengguna.pancingan < 2) return conn.reply(m.chat, 'Minimal pancingan kamu *Level 2* untuk memancing level mudah', m)
                if (pengguna.umpan < 100) return conn.reply(m.chat, 'Minimal umpan kamu *100* untuk memancing level mudah', m)

                let zero1 = Math.floor(Math.random() * 10)
                let zero2 = Math.floor(Math.random() * 10)
                let zero3 = Math.floor(Math.random() * 10)
                let zero4 = Math.floor(Math.random() * 10)
                let zero5 = Math.floor(Math.random() * 10)
                let zero6 = Math.floor(Math.random() * 10)
                let zero7 = Math.floor(Math.random() * 10)
                let zero8 = Math.floor(Math.random() * 10)
                let zero9 = Math.floor(Math.random() * 10)
                let zero10 = Math.floor(Math.random() * 10)
                let zero11 = Math.floor(Math.random() * 10)
                let zero12 = Math.floor(Math.random() * 10)
                let umpanUsed = Math.floor(Math.random() * 50)

                let hsl = `
*${htjava} Hasil Memancing ${pemancing} ${htjava}*
 *🦀 = [ ${zero2} ]*			*🐠 = [ ${zero6} ]*
 *🦞 = [ ${zero8} ]*			 *🐟 = [ ${zero11} ]*
 *🦐 = [ ${zero10} ]*			 *🐬 = [ ${zero7} ]*
 *🦑 = [ ${zero4} ]*			 *🐳 = [ ${zero12} ]*
 *🐙 = [ ${zero3} ]*			 *🦈 = [ ${zero9} ]*
  *🐡 = [ ${zero5} ]*			*🐋 = [ ${zero1} ]*

+1 Tiketcoin
`.trim()

                pengguna.paus = (pengguna.paus || 0) + zero1
                pengguna.kepiting = (pengguna.kepiting || 0) + zero2
                pengguna.gurita = (pengguna.gurita || 0) + zero3
                pengguna.cumi = (pengguna.cumi || 0) + zero4
                pengguna.buntal = (pengguna.buntal || 0) + zero5
                pengguna.dory = (pengguna.dory || 0) + zero6
                pengguna.lumba = (pengguna.lumba || 0) + zero7
                pengguna.lobster = (pengguna.lobster || 0) + zero8
                pengguna.hiu = (pengguna.hiu || 0) + zero9
                pengguna.udang = (pengguna.udang || 0) + zero10
                pengguna.ikan = (pengguna.ikan || 0) + zero11
                pengguna.orca = (pengguna.orca || 0) + zero12
                pengguna.tiketcoin = (pengguna.tiketcoin || 0) + 1
                pengguna.umpan = Math.max(0, (pengguna.umpan || 0) - umpanUsed)

                setTimeout(() => {
                    conn.reply(m.chat, `${pemancing} Yuk mancing mania level easy lagi`, m)
                }, 28800000)
                setTimeout(() => {
                    conn.reply(m.chat, hsl, m)
                }, 12000)
                setTimeout(() => {
                    conn.reply(m.chat, `${pemancing} Menunggu...`, m)
                }, 6000)
                setTimeout(() => {
                    conn.reply(m.chat, `${pemancing} Sedang Memancing...`, m)
                }, 0)

                pengguna.lastmancingeasy = new Date().getTime()
                break
            }

            case 'normal': {
                let __timerl = (new Date() - (pengguna.lastmancingeasy || 0))
                let _timerl = (28800000 - __timerl)
                let timerl = clockString(_timerl)

                if (pancingan === 0 || umpan === 0) {
                    return conn.reply(m.chat, `*[❗] Kamu tidak punya kail pancingan dan umpan!*\n\nKetik *${usedPrefix}buy pancingan 1*\nKetik *${usedPrefix}buy umpan 100*`, m)
                }

                if (new Date() - (pengguna.lastmancingeasy || 0) <= 28800000) {
                    return conn.reply(m.chat, `*Sepertinya Anda Sudah Lelah*\n*Silahkan Istirahat Sejenak Sekitar* ${timerl}\n*Untuk Bisa Melanjutkan Memancing Lagi*`, m)
                }

                if (pengguna.pancingan < 3) return conn.reply(m.chat, 'Minimal pancingan kamu *Level 3* untuk memancing level normal', m)
                if (pengguna.umpan < 150) return conn.reply(m.chat, 'Minimal umpan kamu *150* untuk memancing level normal', m)

                let aine1 = Math.floor(Math.random() * 50)
                let aine2 = Math.floor(Math.random() * 50)
                let aine3 = Math.floor(Math.random() * 50)
                let aine4 = Math.floor(Math.random() * 50)
                let aine5 = Math.floor(Math.random() * 50)
                let aine6 = Math.floor(Math.random() * 50)
                let aine7 = Math.floor(Math.random() * 50)
                let aine8 = Math.floor(Math.random() * 50)
                let aine9 = Math.floor(Math.random() * 50)
                let aine10 = Math.floor(Math.random() * 50)
                let aine11 = Math.floor(Math.random() * 50)
                let aine12 = Math.floor(Math.random() * 50)
                let umpanUsed = Math.floor(Math.random() * 100)

                let hsls = `
*${htjava} Hasil Memancing ${pemancing} ${htjava}*
 *🦀 = [ ${aine2} ]*			*🐠 = [ ${aine6} ]*
 *🦞 = [ ${aine8} ]*			 *🐟 = [ ${aine11} ]*
 *🦐 = [ ${aine10} ]*			 *🐬 = [ ${aine7} ]*
 *🦑 = [ ${aine4} ]*			 *🐳 = [ ${aine12} ]*
 *🐙 = [ ${aine3} ]*			 *🦈 = [ ${aine9} ]*
  *🐡 = [ ${aine5} ]*			*🐋 = [ ${aine1} ]*

+1 Tiketcoin
`.trim()

                pengguna.paus = (pengguna.paus || 0) + aine1
                pengguna.kepiting = (pengguna.kepiting || 0) + aine2
                pengguna.gurita = (pengguna.gurita || 0) + aine3
                pengguna.cumi = (pengguna.cumi || 0) + aine4
                pengguna.buntal = (pengguna.buntal || 0) + aine5
                pengguna.dory = (pengguna.dory || 0) + aine6
                pengguna.lumba = (pengguna.lumba || 0) + aine7
                pengguna.lobster = (pengguna.lobster || 0) + aine8
                pengguna.hiu = (pengguna.hiu || 0) + aine9
                pengguna.udang = (pengguna.udang || 0) + aine10
                pengguna.ikan = (pengguna.ikan || 0) + aine11
                pengguna.orca = (pengguna.orca || 0) + aine12
                pengguna.tiketcoin = (pengguna.tiketcoin || 0) + 1
                pengguna.umpan = Math.max(0, (pengguna.umpan || 0) - umpanUsed)

                setTimeout(() => {
                    conn.reply(m.chat, `${pemancing} Yuk mancing mania level normal lagi`, m)
                }, 28800000)
                setTimeout(() => {
                    conn.reply(m.chat, hsls, m)
                }, 12000)
                setTimeout(() => {
                    conn.reply(m.chat, `${pemancing} Menunggu...`, m)
                }, 6000)
                setTimeout(() => {
                    conn.reply(m.chat, `${pemancing} Sedang Memancing...`, m)
                }, 0)

                pengguna.lastmancingeasy = new Date().getTime()
                break
            }

            case 'hard': {
                let __timerh = (new Date() - (pengguna.lastmancingeasy || 0))
                let _timerh = (28800000 - __timerh)
                let timerh = clockString(_timerh)

                if (pancingan === 0 || umpan === 0) {
                    return conn.reply(m.chat, `*[❗] Kamu tidak punya kail pancingan dan umpan!*\n\nKetik *${usedPrefix}buy pancingan 1*\nKetik *${usedPrefix}buy umpan 100*`, m)
                }

                if (new Date() - (pengguna.lastmancingeasy || 0) <= 28800000) {
                    return conn.reply(m.chat, `*Sepertinya Anda Sudah Lelah*\n*Silahkan Istirahat Sejenak Sekitar* ${timerh}\n*Untuk Bisa Melanjutkan Memancing Lagi*`, m)
                }

                if (pengguna.pancingan < 4) return conn.reply(m.chat, 'Minimal pancingan kamu *Level 4* untuk memancing level hard', m)
                if (pengguna.umpan < 200) return conn.reply(m.chat, 'Minimal umpan kamu *200* untuk memancing level hard', m)

                let aines1 = Math.floor(Math.random() * 100)
                let aines2 = Math.floor(Math.random() * 100)
                let aines3 = Math.floor(Math.random() * 100)
                let aines4 = Math.floor(Math.random() * 100)
                let aines5 = Math.floor(Math.random() * 100)
                let aines6 = Math.floor(Math.random() * 100)
                let aines7 = Math.floor(Math.random() * 100)
                let aines8 = Math.floor(Math.random() * 100)
                let aines9 = Math.floor(Math.random() * 100)
                let aines10 = Math.floor(Math.random() * 100)
                let aines11 = Math.floor(Math.random() * 100)
                let aines12 = Math.floor(Math.random() * 100)
                let umpanUsed = Math.floor(Math.random() * 150)

                let hslsh = `
*${htjava} Hasil Memancing ${pemancing} ${htjava}*
 *🦀 = [ ${aines2} ]*			*🐠 = [ ${aines6} ]*
 *🦞 = [ ${aines8} ]*			 *🐟 = [ ${aines11} ]*
 *🦐 = [ ${aines10} ]*			 *🐬 = [ ${aines7} ]*
 *🦑 = [ ${aines4} ]*			 *🐳 = [ ${aines12} ]*
 *🐙 = [ ${aines3} ]*			 *🦈 = [ ${aines9} ]*
  *🐡 = [ ${aines5} ]*			*🐋 = [ ${aines1} ]*

+1 Tiketcoin
`.trim()

                pengguna.paus = (pengguna.paus || 0) + aines1
                pengguna.kepiting = (pengguna.kepiting || 0) + aines2
                pengguna.gurita = (pengguna.gurita || 0) + aines3
                pengguna.cumi = (pengguna.cumi || 0) + aines4
                pengguna.buntal = (pengguna.buntal || 0) + aines5
                pengguna.dory = (pengguna.dory || 0) + aines6
                pengguna.lumba = (pengguna.lumba || 0) + aines7
                pengguna.lobster = (pengguna.lobster || 0) + aines8
                pengguna.hiu = (pengguna.hiu || 0) + aines9
                pengguna.udang = (pengguna.udang || 0) + aines10
                pengguna.ikan = (pengguna.ikan || 0) + aines11
                pengguna.orca = (pengguna.orca || 0) + aines12
                pengguna.tiketcoin = (pengguna.tiketcoin || 0) + 1
                pengguna.umpan = Math.max(0, (pengguna.umpan || 0) - umpanUsed)

                setTimeout(() => {
                    conn.reply(m.chat, `${pemancing} Yuk mancing mania level hard lagi`, m)
                }, 28800000)
                setTimeout(() => {
                    conn.reply(m.chat, hslsh, m)
                }, 12000)
                setTimeout(() => {
                    conn.reply(m.chat, `${pemancing} Menunggu...`, m)
                }, 6000)
                setTimeout(() => {
                    conn.reply(m.chat, `${pemancing} Sedang Memancing...`, m)
                }, 0)

                pengguna.lastmancingeasy = new Date().getTime()
                break
            }

            case 'extreme': {
                let __timere = (new Date() - (pengguna.lastmancingeasy || 0))
                let _timere = (28800000 - __timere)
                let timere = clockString(_timere)

                if (pancingan === 0 || umpan === 0) {
                    return conn.reply(m.chat, `*[❗] Kamu tidak punya kail pancingan dan umpan!*\n\nKetik *${usedPrefix}buy pancingan 1*\nKetik *${usedPrefix}buy umpan 100*`, m)
                }

                if (new Date() - (pengguna.lastmancingeasy || 0) <= 28800000) {
                    return conn.reply(m.chat, `*Sepertinya Anda Sudah Lelah*\n*Silahkan Istirahat Sejenak Sekitar* ${timere}\n*Untuk Bisa Melanjutkan Memancing Lagi*`, m)
                }

                if (pengguna.pancingan < 5) return conn.reply(m.chat, 'Minimal pancingan kamu *Level 5* untuk memancing level extreme', m)
                if (pengguna.umpan < 250) return conn.reply(m.chat, 'Minimal umpan kamu *250* untuk memancing level extreme', m)

                let ainese1 = Math.floor(Math.random() * 500)
                let ainese2 = Math.floor(Math.random() * 500)
                let ainese3 = Math.floor(Math.random() * 500)
                let ainese4 = Math.floor(Math.random() * 500)
                let ainese5 = Math.floor(Math.random() * 500)
                let ainese6 = Math.floor(Math.random() * 500)
                let ainese7 = Math.floor(Math.random() * 500)
                let ainese8 = Math.floor(Math.random() * 500)
                let ainese9 = Math.floor(Math.random() * 500)
                let ainese10 = Math.floor(Math.random() * 500)
                let ainese11 = Math.floor(Math.random() * 500)
                let ainese12 = Math.floor(Math.random() * 500)
                let umpanUsed = Math.floor(Math.random() * 200)

                let hslse = `
*${htjava} Hasil Memancing ${pemancing} ${htjava}*
 *🦀 = [ ${ainese2} ]*			*🐠 = [ ${ainese6} ]*
 *🦞 = [ ${ainese8} ]*			 *🐟 = [ ${ainese11} ]*
 *🦐 = [ ${ainese10} ]*			 *🐬 = [ ${ainese7} ]*
 *🦑 = [ ${ainese4} ]*			 *🐳 = [ ${ainese12} ]*
 *🐙 = [ ${ainese3} ]*			 *🦈 = [ ${ainese9} ]*
  *🐡 = [ ${ainese5} ]*			*🐋 = [ ${ainese1} ]*

+1 Tiketcoin
`.trim()

                pengguna.paus = (pengguna.paus || 0) + ainese1
                pengguna.kepiting = (pengguna.kepiting || 0) + ainese2
                pengguna.gurita = (pengguna.gurita || 0) + ainese3
                pengguna.cumi = (pengguna.cumi || 0) + ainese4
                pengguna.buntal = (pengguna.buntal || 0) + ainese5
                pengguna.dory = (pengguna.dory || 0) + ainese6
                pengguna.lumba = (pengguna.lumba || 0) + ainese7
                pengguna.lobster = (pengguna.lobster || 0) + ainese8
                pengguna.hiu = (pengguna.hiu || 0) + ainese9
                pengguna.udang = (pengguna.udang || 0) + ainese10
                pengguna.ikan = (pengguna.ikan || 0) + ainese11
                pengguna.orca = (pengguna.orca || 0) + ainese12
                pengguna.tiketcoin = (pengguna.tiketcoin || 0) + 1
                pengguna.umpan = Math.max(0, (pengguna.umpan || 0) - umpanUsed)

                setTimeout(() => {
                    conn.reply(m.chat, `${pemancing} Yuk mancing mania level extreme lagi`, m)
                }, 28800000)
                setTimeout(() => {
                    conn.reply(m.chat, hslse, m)
                }, 12000)
                setTimeout(() => {
                    conn.reply(m.chat, `${pemancing} Menunggu...`, m)
                }, 6000)
                setTimeout(() => {
                    conn.reply(m.chat, `${pemancing} Sedang Memancing...`, m)
                }, 0)

                pengguna.lastmancingeasy = new Date().getTime()
                break
            }

            default:
                return conn.reply(m.chat, listMessage, m)
        }
    } catch (e) {
        console.error(e)
        conn.reply(m.chat, 'Terjadi kesalahan pada fitur mancing!', m)
    }
}

handler.help = ['mancing2 <emosi|easy|normal|hard|extreme>']
handler.tags = ['rpg']
handler.command = /^(mancing2|fishing2)$/i

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function clockString(ms) {
    if (isNaN(ms) || ms <= 0) return '00 Hours 00 Minute 00 Second'
    let d = Math.floor(ms / 86400000)
    let h = Math.floor(ms / 3600000) % 24
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return [
        d > 0 ? d + ' Days ' : '',
        h.toString().padStart(2, '0') + ' Hours ',
        m.toString().padStart(2, '0') + ' Minute ',
        s.toString().padStart(2, '0') + ' Second'
    ].join('')
}