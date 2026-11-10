import { areJidsSameUser } from '@whiskeysockets/baileys'

const leaderboards = [
  'level',
  'exp',
  'limit',
  'money',
  'iron',
  'gold',
  'diamond',
  'emerald',
  'trash',
  'potion',
  'petFood',
  'wood',
  'rock',
  'string',
  'common',
  'uncommon',
  'mythic',
  'legendary',
  'pet'
]

let handler = async (m, { conn, args, participants, usedPrefix, command }) => {
  try {
    let users = Object.entries(global.db.data.users || {}).map(([key, value]) => {
      return { ...value, jid: key }
    })

    // Helper Emoticon Safe (Fallback jika global.rpg tidak ada)
    let getEmo = (type) => (global.rpg && global.rpg.emoticon ? global.rpg.emoticon(type) : '✨ ')

    let leaderboard = leaderboards.filter(v => v && users.filter(user => user && user[v]).length)
    let type = (args[0] || '').toLowerCase()

    const getPage = (item) => Math.max(1, Math.ceil((users.filter(user => user && user[item]).length) / 20))

    let wrong = `
Gunakan format *${usedPrefix}${command} [type] [halaman]*
Contoh: *${usedPrefix}${command} money 1*

📍 *List Type Available:*
${leaderboard.map(v => `• ${getEmo(v)}*${v}*`).join('\n')}
`.trim()

    if (!leaderboard.includes(type)) return m.reply(wrong)

    // Perhitungan Halaman (1-based index)
    let inputPage = parseInt(args[1]) || 1
    let maxPage = getPage(type)
    let page = Math.min(Math.max(inputPage, 1), maxPage)
    let pageOffset = page - 1

    let sortedItem = users.map(toNumber(type)).sort(sort(type))
    let userItem = sortedItem.map(enumGetKey)
    let rankUser = userItem.indexOf(m.sender) + 1

    let sliceData = sortedItem.slice(pageOffset * 20, pageOffset * 20 + 20)

    // Menggunakan Promise.all agar conn.getName() di-resolve dengan sempurna
    let listTextArray = await Promise.all(sliceData.map(async (user, i) => {
      let isGroupMember = participants.some(p => areJidsSameUser(user.jid, p.id))
      let num = pageOffset * 20 + i + 1
      let name = isGroupMember ? await conn.getName(user.jid) : `@${user.jid.split('@')[0]}`
      return `│ ${num}〉 ${isGroupMember ? `${name} (@${user.jid.split('@')[0]})` : `@${user.jid.split('@')[0]}`}\n│▸ ${user[type] || 0} ${type} ${getEmo(type)}`
    }))

    let listText = listTextArray.join('\n┗────────────·····\n\n')

    let text = `
▣› *${getEmo(type)}${type.toUpperCase()} LEADERBOARD* ‹▣
*📑 Halaman:* ${page} dari ${maxPage}
*🎖️ Posisi Kamu:* *${rankUser > 0 ? rankUser : 'Belum Terdaftar'}* dari *${userItem.length}*

${listText}
┗────────────·····
`.trim()

    let mentions = sliceData.map(u => u.jid)

    await conn.reply(m.chat, text, m, { mentions })

  } catch (e) {
    console.error(e)
    m.reply('Terjadi kesalahan saat memproses leaderboard!')
  }
}

handler.help = ['leaderboard2 <type> <page>', 'lb2 <type> <page>']
handler.tags = ['xp', 'rpg']
handler.command = /^(lb2|leaderboard2)$/i

export default handler

function sort(property, ascending = false) {
  if (property) return (...args) => args[ascending & 1][property] - args[!ascending & 1][property]
  else return (...args) => args[ascending & 1] - args[!ascending & 1]
}

function toNumber(property, _default = 0) {
  if (property) return (a, i, b) => {
    return { ...b[i], [property]: a[property] === undefined ? _default : a[property] }
  }
  else return a => a === undefined ? _default : a
}

function enumGetKey(a) {
  return a.jid
}