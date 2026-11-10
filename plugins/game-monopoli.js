import { createCanvas } from '@napi-rs/canvas'

// 40 Petak Papan Monopoli Realistis
const BOARD_TILES = [
    { name: 'START', type: 'special', color: '#4CAF50' },
    { name: 'Medan', price: 60, rent: 10, color: '#8B4513' },
    { name: 'Dana Umum', type: 'special', color: '#9E9E9E' },
    { name: 'Jakarta', price: 60, rent: 12, color: '#8B4513' },
    { name: 'Pajak Jalan', type: 'special', color: '#F44336' },
    { name: 'Stasiun Gambir', price: 200, rent: 25, color: '#607D8B' },
    { name: 'Bandung', price: 100, rent: 20, color: '#87CEEB' },
    { name: 'Kesempatan', type: 'special', color: '#FF9800' },
    { name: 'Semarang', price: 100, rent: 20, color: '#87CEEB' },
    { name: 'Surabaya', price: 120, rent: 24, color: '#87CEEB' },
    { name: 'PENJARA', type: 'special', color: '#424242' },
    { name: 'Denpasar', price: 140, rent: 28, color: '#E91E63' },
    { name: 'PLN', price: 150, rent: 30, color: '#FFEB3B' },
    { name: 'Mataram', price: 140, rent: 28, color: '#E91E63' },
    { name: 'Kupang', price: 160, rent: 32, color: '#E91E63' },
    { name: 'Stasiun Pasar Senen', price: 200, rent: 25, color: '#607D8B' },
    { name: 'Pontianak', price: 180, rent: 36, color: '#FF9800' },
    { name: 'Dana Umum', type: 'special', color: '#9E9E9E' },
    { name: 'Banjarmasin', price: 180, rent: 36, color: '#FF9800' },
    { name: 'Samarinda', price: 200, rent: 40, color: '#FF9800' },
    { name: 'PARKIR GRATIS', type: 'special', color: '#00BCD4' },
    { name: 'Manado', price: 220, rent: 44, color: '#F44336' },
    { name: 'Kesempatan', type: 'special', color: '#FF9800' },
    { name: 'Palu', price: 220, rent: 44, color: '#F44336' },
    { name: 'Makassar', price: 240, rent: 48, color: '#F44336' },
    { name: 'Stasiun Hall', price: 200, rent: 25, color: '#607D8B' },
    { name: 'Ambon', price: 260, rent: 52, color: '#FFEB3B' },
    { name: 'Jayapura', price: 260, rent: 52, color: '#FFEB3B' },
    { name: 'PDAM', price: 150, rent: 30, color: '#00BCD4' },
    { name: 'Merauke', price: 280, rent: 56, color: '#FFEB3B' },
    { name: 'MASUK PENJARA', type: 'special', color: '#D32F2F' },
    { name: 'Banda Aceh', price: 300, rent: 60, color: '#4CAF50' },
    { name: 'Padang', price: 300, rent: 60, color: '#4CAF50' },
    { name: 'Dana Umum', type: 'special', color: '#9E9E9E' },
    { name: 'Palembang', price: 320, rent: 64, color: '#4CAF50' },
    { name: 'Stasiun Surabaya Pasarturi', price: 200, rent: 25, color: '#607D8B' },
    { name: 'Kesempatan', type: 'special', color: '#FF9800' },
    { name: 'Yogyakarta', price: 350, rent: 70, color: '#3F51B5' },
    { name: 'Pajak Mewah', type: 'special', color: '#9C27B0' },
    { name: 'Solo', price: 400, rent: 80, color: '#3F51B5' }
]

const PLAYER_COLORS = ['#FF2B2B', '#00C853', '#FFD600', '#2979FF']

let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        let key = m.chat
        conn.monopoly = conn.monopoly ? conn.monopoly : {}
        let room = conn.monopoly[key]
        let feature = (args[0] || '').toLowerCase()

        // 1. DELETE / RESET ROOM
        if (['delete', 'reset', 'stop'].includes(feature)) {
            if (!room) return conn.reply(m.chat, '⚠️ Tidak ada permainan Monopoli yang aktif di chat ini.', m)
            delete conn.monopoly[key]
            return conn.reply(m.chat, '🛑 Permainan Monopoli berhasil dihentikan!', m)
        }

        // 2. CREATE ROOM
        if (feature === 'create') {
            if (room) return conn.reply(m.chat, `⚠️ Room Monopoli sudah ada!\nKetik *${usedPrefix}${command} join* untuk bergabung.`, m)

            conn.monopoly[key] = {
                status: 'waiting',
                players: [],
                playerData: {},
                properties: {}, // kepemilikan aset
                turnIndex: 0,
                creator: m.sender
            }

            return conn.reply(m.chat, `🎩 *[ ROOM MONOPOLI DIBUAT ]* 🎩\n\nHost: @${m.sender.split('@')[0]}\nMinimal: 2 Pemain (Sisa slot diisi Bot AI otomatis)\n\nKetik *${usedPrefix}${command} join* untuk bergabung!`, m, { mentions: [m.sender] })
        }

        // 3. JOIN ROOM
        if (feature === 'join') {
            if (!room || room.status !== 'waiting') return conn.reply(m.chat, `⚠️ Tidak ada room Monopoli yang menunggu!\nKetik *${usedPrefix}${command} create* untuk membuat baru.`, m)
            if (room.players.includes(m.sender)) return conn.reply(m.chat, '🙅‍♂️ Kamu sudah bergabung dalam room ini!', m)
            if (room.players.length >= 4) return conn.reply(m.chat, '👥 Room Monopoli sudah penuh (Maksimal 4 Pemain)!', m)

            let pIndex = room.players.length
            room.players.push(m.sender)
            room.playerData[m.sender] = {
                color: PLAYER_COLORS[pIndex],
                pos: 0,
                money: 1500, // Uang Awal $1500
                inJail: false,
                isBot: false
            }

            let joinTxt = `🙋‍♂️ *@${m.sender.split('@')[0]} bergabung sebagai Pemain ${pIndex + 1}!*\nTotal Pemain Manusia: *${room.players.length}/4*\n\n${room.players.length >= 2 ? `_Ketik *${usedPrefix}${command} start* untuk mulai! (Sisa slot diisi Bot AI)_` : '_Menunggu minimal 1 pemain lagi..._'}`
            return conn.reply(m.chat, joinTxt, m, { mentions: [m.sender] })
        }

        // 4. START GAME & BOT AUTO-FILL
        if (feature === 'start') {
            if (!room || room.status !== 'waiting') return conn.reply(m.chat, '⚠️ Tidak ada room yang siap dimulai.', m)
            if (room.players.length < 2) return conn.reply(m.chat, '⚠️ Minimal 2 pemain manusia untuk memulai!', m)

            // Auto-Fill Bot AI jika pemain kurang dari 4
            while (room.players.length < 4) {
                let botId = `BOT_AI_${room.players.length + 1}@s.whatsapp.net`
                let pIndex = room.players.length
                room.players.push(botId)
                room.playerData[botId] = {
                    color: PLAYER_COLORS[pIndex],
                    pos: 0,
                    money: 1500,
                    inJail: false,
                    isBot: true
                }
            }

            room.status = 'playing'
            let firstPlayer = room.players[0]

            let boardBuffer = await renderMonopolyBoard(room)
            let caption = `🎉 *[ PERMAINAN MONOPOLI DIMULAI! ]* 🎉\n\n🔴 P1: @${room.players[0].split('@')[0]}\n🟢 P2: ${room.players[1].includes('BOT') ? '🤖 Bot AI' : `@${room.players[1].split('@')[0]}`}\n🟡 P3: ${room.players[2].includes('BOT') ? '🤖 Bot AI' : `@${room.players[2].split('@')[0]}`}\n🔵 P4: ${room.players[3].includes('BOT') ? '🤖 Bot AI' : `@${room.players[3].split('@')[0]}`}\n\n🎲 *Giliran Pertama:* @${firstPlayer.split('@')[0]}\n\n_Ketik *dadu* / *roll* di chat untuk melempar dadu!_`

            return await conn.sendMessage(m.chat, { image: boardBuffer, caption, mentions: room.players.filter(p => !p.includes('BOT')) }, { quoted: m })
        }

        let helpTxt = `🎩 *[ MONOPOLI GAME ]*\n\n• *${usedPrefix}${command} create*\n• *${usedPrefix}${command} join*\n• *${usedPrefix}${command} start*\n• *${usedPrefix}${command} delete*\n\n_Saat game jalan, ketik di chat:_ *dadu* / *roll*`
        return conn.reply(m.chat, helpTxt, m)

    } catch (e) {
        console.error('Error pada plugin monopoly:', e)
        m.reply('Terjadi kesalahan saat memproses permainan Monopoli!')
    }
}

// ==========================================================================
// BEFORE HANDLER (AKSI TANPA COMMAND & GILIRAN BOT)
// ==========================================================================
handler.before = async function (m) {
    try {
        this.monopoly = this.monopoly ? this.monopoly : {}
        let room = this.monopoly[m.chat]

        if (!room || room.status !== 'playing') return

        let txt = (m.text || '').toLowerCase().trim()
        let currentPlayer = room.players[room.turnIndex]

        if (room.players.includes(m.sender) && ['dadu', 'roll', 'kocok'].includes(txt)) {
            if (m.sender !== currentPlayer) {
                return this.reply(m.chat, `⏳ *Sekarang giliran @${currentPlayer.split('@')[0]}!*`, m, { mentions: [currentPlayer] })
            }

            await processTurn(this, m.chat, room, m)
            await checkAndRunBot(this, m.chat, room, m)
        }
    } catch (err) {
        console.error('Error pada before handler monopoly:', err)
    }
}

handler.help = ['monopoly', 'monopoli']
handler.tags = ['game']
handler.command = /^(monopoly|monopoli)$/i
handler.group = true

export default handler

// ==========================================================================
// LOGIKA GILIRAN DADU & ATURAN PROPERTI MONOPOLI
// ==========================================================================
async function processTurn(conn, chatId, room, m, isBotExec = false, botJid = null) {
    let pJid = isBotExec ? botJid : room.players[room.turnIndex]
    let pData = room.playerData[pJid]

    let dadu1 = Math.floor(Math.random() * 6) + 1
    let dadu2 = Math.floor(Math.random() * 6) + 1
    let totalDadu = dadu1 + dadu2

    let report = `🎲 *@${pJid.includes('BOT') ? '🤖 Bot AI' : pJid.split('@')[0]}* melempar dadu: *[ ${dadu1} + ${dadu2} = ${totalDadu} ]*\n`

    // Pindah Posisi
    let oldPos = pData.pos
    let newPos = (oldPos + totalDadu) % 40
    pData.pos = newPos

    // Lewat Start Dapat $200
    if (newPos < oldPos) {
        pData.money += 200
        report += `💰 *Melewati START! Mendapat ganjaran $200!*\n`
    }

    let tile = BOARD_TILES[newPos]
    report += `📍 Berhenti di petak *${tile.name}*\n`

    // Logika Petak Properti
    if (tile.price) {
        let owner = room.properties[newPos]
        if (!owner) {
            // Belum ada pemilik -> Beli otomatis jika modal cukup
            if (pData.money >= tile.price) {
                pData.money -= tile.price
                room.properties[newPos] = pJid
                report += `🏠 *Membeli properti ${tile.name} seharga $${tile.price}!*\n`
            } else {
                report += `💸 Uang tidak cukup untuk membeli ${tile.name} ($${tile.price})\n`
            }
        } else if (owner !== pJid) {
            // Milik pemain lain -> Bayar sewa
            let rent = tile.rent
            pData.money -= rent
            room.playerData[owner].money += rent
            report += `💸 *Membayar sewa $${rent} kepada @${owner.includes('BOT') ? '🤖 Bot AI' : owner.split('@')[0]}!*\n`
        }
    } else if (tile.name === 'MASUK PENJARA') {
        pData.pos = 10 // Pindah ke Penjara
        pData.inJail = true
        report += `👮 *Masuk Penjara!*\n`
    }

    report += `💵 Saldo Saat Ini: *$${pData.money}*\n`

    // Cek Kebangkrutan
    if (pData.money <= 0) {
        report += `☠️ *@${pJid.split('@')[0]} telah Bangkrut dan keluar dari permainan!*\n`
        room.players = room.players.filter(p => p !== pJid)
        if (room.players.length === 1) {
            delete conn.monopoly[chatId]
            let winner = room.players[0]
            let winMsg = `🏆 *[ GAME OVER ]* 🏆\n\n🎉 Selamat kepada *@${winner.split('@')[0]}* yang memenangkan Monopoli!`
            let boardBuffer = await renderMonopolyBoard(room)
            return await conn.sendMessage(chatId, { image: boardBuffer, caption: winMsg, mentions: [winner] }, { quoted: m })
        }
    }

    // Ganti Giliran
    room.turnIndex = (room.turnIndex + 1) % room.players.length
    let nextP = room.players[room.turnIndex]
    report += `\n🎲 *Giliran Berikutnya:* ${nextP.includes('BOT') ? '🤖 Bot AI' : `@${nextP.split('@')[0]}`}`

    let boardBuffer = await renderMonopolyBoard(room)
    await conn.sendMessage(chatId, { image: boardBuffer, caption: report, mentions: [pJid, nextP].filter(p => !p.includes('BOT')) }, { quoted: m })
}

async function checkAndRunBot(conn, chatId, room, m) {
    let currentPlayer = room.players[room.turnIndex]
    if (currentPlayer && currentPlayer.includes('BOT')) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        await processTurn(conn, chatId, room, m, true, currentPlayer)
        await checkAndRunBot(conn, chatId, room, m)
    }
}

// ==========================================================================
// ENGINE CANVAS PAPAN MONOPOLI REALISTIS 800x800 (@NAPI-RS/CANVAS)
// ==========================================================================
async function renderMonopolyBoard(room) {
    const canvas = createCanvas(800, 800)
    const ctx = canvas.getContext('2d')

    // Background Dark Premium Theme
    ctx.fillStyle = '#0D1117'
    ctx.fillRect(0, 0, 800, 800)

    // Kartu Papan Tengah
    ctx.fillStyle = '#161C24'
    ctx.fillRect(110, 110, 580, 580)
    ctx.strokeStyle = '#30363D'
    ctx.lineWidth = 2
    ctx.strokeRect(110, 110, 580, 580)

    // Title Logo Monopoli di Tengah Papan
    ctx.fillStyle = '#E53935'
    ctx.fillRect(250, 360, 300, 80)
    ctx.lineWidth = 3
    ctx.strokeStyle = '#FFFFFF'
    ctx.strokeRect(250, 360, 300, 80)

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 36px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('MONOPOLY', 400, 400)

    // Pemetaan Koordinat 40 Petak Mengelilingi Papan
    const TILE_COORDS = []
    
    // Bawah (0 - 10 dari Kanan ke Kiri)
    for (let i = 0; i <= 10; i++) TILE_COORDS.push({ x: 690 - (i * 58), y: 690, w: 58, h: 110, isHoriz: false })
    // Kiri (11 - 20 dari Bawah ke Atas)
    for (let i = 1; i <= 9; i++) TILE_COORDS.push({ x: 0, y: 690 - (i * 58), w: 110, h: 58, isHoriz: true })
    // Atas (20 - 30 dari Kiri ke Kanan)
    for (let i = 0; i <= 10; i++) TILE_COORDS.push({ x: 0 + (i * 58), y: 0, w: 58, h: 110, isHoriz: false })
    // Kanan (31 - 39 dari Atas ke Bawah)
    for (let i = 1; i <= 9; i++) TILE_COORDS.push({ x: 690, y: 0 + (i * 58), w: 110, h: 58, isHoriz: true })

    // Render 40 Petak Papan
    BOARD_TILES.forEach((tile, idx) => {
        let coords = TILE_COORDS[idx]
        if (!coords) return

        // Base Petak
        ctx.fillStyle = '#21262D'
        ctx.fillRect(coords.x, coords.y, coords.w, coords.h)
        ctx.strokeStyle = '#30363D'
        ctx.lineWidth = 1
        ctx.strokeRect(coords.x, coords.y, coords.w, coords.h)

        // Header Warna Properti
        if (tile.color) {
            ctx.fillStyle = tile.color
            if (!coords.isHoriz) {
                ctx.fillRect(coords.x, idx < 10 ? coords.y : coords.y + 85, coords.w, 25)
            } else {
                ctx.fillRect(idx > 30 ? coords.x : coords.x + 85, coords.y, 25, coords.h)
            }
        }

        // Tanda Pemilik jika Properti Sudah Dibeli
        let owner = room.properties[idx]
        if (owner) {
            let pIdx = room.players.indexOf(owner)
            if (pIdx !== -1) {
                ctx.fillStyle = PLAYER_COLORS[pIdx]
                ctx.beginPath()
                ctx.arc(coords.x + coords.w / 2, coords.y + coords.h / 2, 8, 0, Math.PI * 2)
                ctx.fill()
            }
        }
    })

    // RENDER PION PEMAIN REAL-TIME DI PAPAN MONOPOLI
    room.players.forEach((pJid, pIdx) => {
        let pData = room.playerData[pJid]
        if (!pData) return

        let pos = pData.pos
        let coords = TILE_COORDS[pos]
        if (!coords) return

        let offX = (pIdx % 2) * 20 + (coords.w / 2) - 10
        let offY = Math.floor(pIdx / 2) * 20 + (coords.h / 2) - 10

        let px = coords.x + offX
        let py = coords.y + offY

        // Gambar Pion Lingkaran Berwarna + Label (P1, P2, P3, P4)
        ctx.beginPath()
        ctx.arc(px, py, 12, 0, Math.PI * 2)
        ctx.fillStyle = pData.color
        ctx.fill()
        ctx.lineWidth = 2
        ctx.strokeStyle = '#FFFFFF'
        ctx.stroke()

        ctx.fillStyle = '#FFFFFF'
        ctx.font = 'bold 10px sans-serif'
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.fillText(`P${pIdx + 1}`, px, py)
    })

    return await canvas.encode('png')
}