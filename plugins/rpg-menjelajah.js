let handler = async (m, { conn, usedPrefix }) => { 
    try { 
        let user = global.db.data.users[m.sender]
        if (!user) throw 'Data user tidak ditemukan di database!'

        let __timers = (new Date() - user.lastadventure)
        let _timers = (300000 - __timers) 
        let timers = clockString(_timers)

        // Cek apakah health cukup (minimal 80)
        if (user.healt < 80) {
            return conn.reply(m.chat, `Minimal 80 health untuk bisa berpetualang!\nBeli obat dulu biar kuat dengan ketik *${usedPrefix}shop buy potion <jumlah>*\ndan ketik *${usedPrefix}use potion <jumlah>*\n\n_Untuk mendapat money dan potion gratis ketik_ *${usedPrefix}claim*\nHealing: ${usedPrefix}heal\nBeli Potion: ${usedPrefix}shop buy potion`, m)
        }

        // Cek cooldown (5 menit / 300000 ms)
        if (new Date() - user.lastadventure <= 300000) {
            return conn.reply(m.chat, `Anda sudah bekerja keras, silahkan beristirahat selama:${timers}`, m)
        }

        let armor = user.armor || 0
        let rubah = user.rubah || 0
        let kuda = user.kuda || 0
        let kucing = user.kucing || 0
        let anjing = user.anjing || 0

        let ____health = Math.floor(Math.random() * 101)
        let ___health = ____health * 1

        let kucingnya = (kucing === 0 ? 0 : kucing === 1 ? 5 : kucing === 2 ? 10 : kucing === 3 ? 15 : kucing === 4 ? 21 : kucing === 5 ? 30 : 0)
        let armornya = (armor === 0 ? 0 : armor === 1 ? 5 : armor === 2 ? 10 : armor === 3 ? 15 : armor === 4 ? 21 : armor === 5 ? 30 : 0)

        let __health = (___health > 60 ? ___health - kucingnya - armornya : ___health)
        let healt = (kucing === 0 && armor === 0 ? pickRandom(['100', '99', '98', '97', '96', '95', '94', '93', '92', '91', '90']) : kucing > 0 && armor > 0 ? __health : ___health)

        let exp = (Math.floor(Math.random() * 400) + (kuda * 70))
        let uang = (Math.floor(Math.random() * 400) + (anjing * 70))
        let potion = Math.floor(Math.random() * 2)

        let _diamond = (rubah === 0 ? pickRandom(['0', '1', '0', '1', '0', '1', '0']) : rubah === 1 ? pickRandom(['0', '1', '0', '1']) : rubah === 2 ? pickRandom(['0', '1', '0', '1', '2']) : rubah === 3 ? pickRandom(['0', '1', '0', '2', '2', '0']) : rubah === 4 ? pickRandom(['0', '1', '1', '2', '1', '1', '0']) : rubah === 5 ? pickRandom(['0', '0', '1', '2', '2', '1', '1', '0']) : '0')
        let diamond = parseInt(_diamond) || 0

        let common = Math.floor(Math.random() * 3)
        let uncommon = Math.floor(Math.random() * 2)
        let mythic = parseInt(pickRandom(['1', '0', '0', '1'])) || 0
        let legendary = parseInt(pickRandom(['1', '0', '0', '0'])) || 0
        let sampah = Math.floor(Math.random() * 300)
        let kayu = Math.floor(Math.random() * 3)
        let batu = Math.floor(Math.random() * 2)
        let string = Math.floor(Math.random() * 2)
        let iron = Math.floor(Math.random() * 2)

        // Helper fungsi emoticon aman (fallback ke emoji standar jika global.rpg tidak ada)
        let getEmo = (type) => (global.rpg && global.rpg.emoticon ? global.rpg.emoticon(type) : '')

        let str = `
${getEmo('healt')} ❤️ Nyawa mu berkurang -${healt * 1} karena Kamu telah berpetualang sampai ${pickRandom(['🇯🇵 Jepang', '🇰🇷 Korea', '🇮🇳 India', '🇺🇲 Amerika', '🇵🇸 Palestin', '🇮🇶 Iraq', '🇸🇦 Arab', '🇵🇰 Pakistan', '🇩🇪 German', '🇫🇮 Finlandia', 'Ke bawah dunia mimpi 😱', 'Ujung dunia 🌏', 'Mars 👽', 'Bulan 🌚', 'Pluto 😱', 'Matahari 🌞', 'Hatinya dia ♥️', '...'])} dan mendapatkan:
${getEmo('exp')} 📈 *exp:* ${exp} 
${getEmo('money')} 💵 *uang:* ${uang}
${getEmo('sampah')} 🗑️ *sampah:* ${sampah}${potion === 0 ? '' : `\n${getEmo('potion')} 🥤 *Potion:* ` + potion}${iron === 0 ? '' : `\n${getEmo('iron')} 🛠️ *Iron:* ` + iron}${kayu === 0 ? '' : `\n${getEmo('kayu')} 🪵 *Kayu:* ` + kayu}${batu === 0 ? '' : `\n${getEmo('batu')} 🪨 *Batu:* ` + batu}${string === 0 ? '' : `\n${getEmo('string')} 🕸️ *String:* ` + string}${diamond === 0 ? '' : `\n${getEmo('diamond')} 💎 *diamond:* ` + diamond}${common === 0 ? '' : `\n${getEmo('common')} 📦 *common crate:* ` + common}${uncommon === 0 ? '' : `\n${getEmo('uncommon')} 📦 *uncommon crate:* ` + uncommon}
`.trim()

        conn.reply(m.chat, str, m)

        if (mythic > 0) {
            user.mythic = (user.mythic || 0) + mythic
            conn.reply(m.chat, '*Selamat anda mendapatkan item Rare yaitu*\n' + mythic + ` ${getEmo('mythic')} Mythic Crate`, m)
        }

        if (legendary > 0) {
            user.legendary = (user.legendary || 0) + legendary
            conn.reply(m.chat, '*Selamat anda mendapatkan item Epic yaitu*\n' + legendary + ` ${getEmo('legendary')} Legendary Crate`, m)
        }

        // Update database user
        user.healt -= healt * 1
        user.exp = (user.exp || 0) + exp
        user.money = (user.money || 0) + uang
        user.potion = (user.potion || 0) + potion
        user.diamond = (user.diamond || 0) + diamond
        user.common = (user.common || 0) + common
        user.uncommon = (user.uncommon || 0) + uncommon
        user.sampah = (user.sampah || 0) + sampah
        user.iron = (user.iron || 0) + iron
        user.batu = (user.batu || 0) + batu
        user.kayu = (user.kayu || 0) + kayu
        user.string = (user.string || 0) + string
        user.lastadventure = new Date() * 1

    } catch (e) {
        console.error(e)
        m.reply('Terjadi kesalahan pada fitur menjelajah!')
    }
}

handler.help = ['menjelajah']
handler.tags = ['rpg']
handler.command = /^menjelajah$/i

handler.register = false
handler.group = true

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}

function clockString(ms) {
    let d = isNaN(ms) ? '--' : Math.floor(ms / 86400000)
    let h = isNaN(ms) ? '--' : Math.floor(ms / 3600000) % 24
    let m = isNaN(ms) ? '--' : Math.floor(ms / 60000) % 60
    let s = isNaN(ms) ? '--' : Math.floor(ms / 1000) % 60
    return ['\n' + d, ' *Days ☀️*\n ', h, ' *Hours 🕐*\n ', m, ' *Minute ⏰*\n ', s, ' *Second ⏱️* '].map(v => v.toString().padStart(2, '0')).join('')
}