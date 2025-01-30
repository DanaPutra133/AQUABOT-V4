let handler = async(m, { conn }) => {
  const jkt = [
    `https://cdn.btch.bz/file/d5b1fc54e3e1a99204979.jpg`,
    `https://cdn.btch.bz/file/d9c00377d3535171df926.jpg`,
    `https://cdn.btch.bz/file/ad456f6e55d4b3efc2c92.jpg`,
    `https://cdn.btch.bz/file/0989d691586ba9e9a0723.jpg`,
    `https://cdn.btch.bz/file/7ef3bf8337e55ae9e0b0b.jpg`,
    `https://cdn.btch.bz/file/2f19deb0e9173da93cb19.jpg`,
    `https://cdn.btch.bz/file/30fcad937af255e29f583.jpg`,
    `https://cdn.btch.bz/file/d3e0dbaa69bcadf98240f.jpg`,
    `https://cdn.btch.bz/file/1ebfab5a499a4ae35fa2c.jpg`,
    `https://cdn.btch.bz/file/0bdb3ede51434e4e7013a.jpg`,
    `https://cdn.btch.bz/file/d0df7b03bf29642475449.jpg`,
    `https://cdn.btch.bz/file/73762c739b38553627203.jpg`,
    `https://cdn.btch.bz/file/8b599477a702833c92cb0.jpg`,
    `https://cdn.btch.bz/file/c9424ab083047a84fd07d.jpg`,
    `https://cdn.btch.bz/file/573d2d8fab9ddb602595a.jpg`,
    `https://cdn.btch.bz/file/62892072ad484274f6aec.jpg`,
    `https://cdn.btch.bz/file/52ce78a61737bb275548a.jpg`,
    `https://cdn.btch.bz/file/788f3fc4a6b3aaa84ce96.jpg`,
    `https://cdn.btch.bz/file/656b761c98b236ef6458a.jpg`,
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
