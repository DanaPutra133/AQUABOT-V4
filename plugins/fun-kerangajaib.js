let handler = async (m, { text, command, usedPrefix }) => {
    if (!text) throw `Gunakan contoh: *${usedPrefix}${command} i'm alien?*`
    
    let answers = [
        'Mungkin suatu hari',
        'Tidak juga',
        'Tidak keduanya',
        'Kurasa tidak',
        'Ya',
        'Coba tanya lagi',
        'Tidak ada'
    ]

    // Gunakan method .getRandom() jika prototype bot memilikinya, atau fallback ke pickRandom
    let answer = typeof answers.getRandom === 'function' 
        ? answers.getRandom() 
        : pickRandom(answers)

    await m.reply(`"${answer}."`)
}

handler.help = ['kerang <teks>', 'kerangajaib <teks>']
handler.tags = ['fun']

handler.command = /^(kulit)?kerang(ajaib)?$/i

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}