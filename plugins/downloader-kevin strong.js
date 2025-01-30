let handler = async(m, { conn }) => {
  const jkt = [
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
    ``,
  ]
  let capt = `ini kak foto nya 😍`
  try {
    const url = pickRandom(jkt)
    await conn.reply(m.chat, `cieeeee simp 😁`, m)
    await conn.sendMessage(m.chat, {
      react: {
          text: '🥰',
          key: m.key,
      }
  })
    await conn.sendFile(m.chat, url, null, capt, '', m);
  } catch (e) {
    console.log(e);
    m.reply('Maaf, foto fattah syach tidak ditemukan');
    await conn.sendMessage(m.chat, {
      react: {
          text: '😞',
          key: m.key,
      }
  })
  }
}

handler.help = ['fattah syach']
handler.tags = ['downloader']
handler.command = /^fattah$/i
handler.owner = false
handler.premium = false
handler.group = true
handler.private = false

function pickRandom(list) {
  return list[Math.floor(list.length * Math.random())]
}

module.exports = handler
