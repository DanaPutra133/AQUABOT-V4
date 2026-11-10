import { createCanvas } from '@napi-rs/canvas'

// Konfigurasi Papan & Warna Ludo
const COLORS = ['Red', 'Green', 'Yellow', 'Blue']
const COLOR_HEX = ['#FF2B2B', '#00C853', '#FFD600', '#2979FF']

let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        let key = m.chat
        conn.ludo = conn.ludo ? conn.ludo : {}
        let room = conn.ludo[key]
        let feature = (args[0] || '').toLowerCase()

        // 1. DELETE / RESET ROOM
        if (feature === 'delete' || feature === 'reset' || feature === 'stop') {
            if (!room) return conn.reply(m.chat, '⚠️ Tidak ada permainan Ludo yang sedang aktif di chat ini.', m)
            delete conn.ludo[key]
            return conn.reply(m.chat, '🛑 Permainan Ludo berhasil dihentikan!', m)
        }

        // 2. CREATE ROOM
        if (feature === 'create') {
            if (room) return conn.reply(m.chat, `⚠️ Room Ludo sudah ada!\nKetik *${usedPrefix}${command} join* untuk bergabung.`, m)

            conn.ludo[key] = {
                status: 'waiting',
                players: [], 
                playerData: {},
                turnIndex: 0,
                creator: m.sender
            }

            return conn.reply(m.chat, `🎲 *[ ROOM LUDO DIBUAT ]* 🎲\n\nHost: @${m.sender.split('@')[0]}\nMinimal: 2 Pemain (Sisa slot diisi Bot AI otomatis)\n\nKetik *${usedPrefix}${command} join* untuk bergabung!`, m, { mentions: [m.sender] })
        }

        // 3. JOIN ROOM
        if (feature === 'join') {
            if (!room || room.status !== 'waiting') return conn.reply(m.chat, `⚠️ Tidak ada room Ludo yang menunggu!\nKetik *${usedPrefix}${command} create* untuk membuat baru.`, m)
            if (room.players.includes(m.sender)) return conn.reply(m.chat, '🙅‍♂️ Kamu sudah bergabung dalam room ini!', m)
            if (room.players.length >= 4) return conn.reply(m.chat, '👥 Room Ludo sudah penuh (Maksimal 4 Pemain)!', m)

            let pIndex = room.players.length
            room.players.push(m.sender)
            room.playerData[m.sender] = {
                color: COLORS[pIndex],
                hex: COLOR_HEX[pIndex],
                tokens: [0, 0, 0, 0], // 0 = Markas Base, 1-51 = Track, 52-56 = Home Stretch, 57 = FINISH
                isBot: false
            }

            let joinTxt = `🙋‍♂️ *@${m.sender.split('@')[0]} bergabung sebagai ${COLORS[pIndex]}!*\nTotal Pemain Manusia: *${room.players.length}/4*\n\n${room.players.length >= 2 ? `_Ketik *${usedPrefix}${command} start* untuk mulai! (Sisa slot diisi Bot)_` : '_Menunggu minimal 1 pemain lagi..._'}`
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
                    color: COLORS[pIndex],
                    hex: COLOR_HEX[pIndex],
                    tokens: [0, 0, 0, 0],
                    isBot: true
                }
            }

            room.status = 'playing'
            let firstPlayer = room.players[0]

            let boardBuffer = await renderLudoBoard(room)
            let caption = `🎉 *[ PERMAINAN LUDO DIMULAI! ]* 🎉\n\n🔴 Red: @${room.players[0].split('@')[0]}\n🟢 Green: ${room.players[1].includes('BOT') ? '🤖 Bot AI' : `@${room.players[1].split('@')[0]}`}\n🟡 Yellow: ${room.players[2].includes('BOT') ? '🤖 Bot AI' : `@${room.players[2].split('@')[0]}`}\n🔵 Blue: ${room.players[3].includes('BOT') ? '🤖 Bot AI' : `@${room.players[3].split('@')[0]}`}\n\n🎲 *Giliran Pertama:* @${firstPlayer.split('@')[0]}\n\n_Ketik *dadu* atau *dadu <nomor_pion>* (contoh: *dadu 2*) untuk bergerak!_`

            return await conn.sendMessage(m.chat, { image: boardBuffer, caption, mentions: room.players.filter(p => !p.includes('BOT')) }, { quoted: m })
        }

        let helpTxt = `🎪 *[ LUDO BOARD GAME ]*\n\n• *${usedPrefix}${command} create*\n• *${usedPrefix}${command} join*\n• *${usedPrefix}${command} start*\n• *${usedPrefix}${command} delete*\n\n_Saat game jalan, ketik langsung di chat:_ *dadu* atau *dadu 1 - 4*`
        return conn.reply(m.chat, helpTxt, m)

    } catch (e) {
        console.error('Error pada plugin ludo:', e)
        m.reply('Terjadi kesalahan saat memproses permainan Ludo!')
    }
}

// ==========================================================================
// BEFORE HANDLER (AKSI CHAT & DETEKSI PILIHAN PION 1-4)
// ==========================================================================
handler.before = async function (m) {
    try {
        this.ludo = this.ludo ? this.ludo : {}
        let room = this.ludo[m.chat]

        if (!room || room.status !== 'playing') return

        let txt = (m.text || '').toLowerCase().trim()
        let match = txt.match(/^(dadu|roll|kocok)(?:\s+([1-4]))?$/i)

        if (room.players.includes(m.sender) && match) {
            let currentPlayer = room.players[room.turnIndex]

            if (m.sender !== currentPlayer) {
                return this.reply(m.chat, `⏳ *Sekarang giliran @${currentPlayer.split('@')[0]}!*`, m, { mentions: [currentPlayer] })
            }

            let chosenPionNum = match[2] ? parseInt(match[2]) : null
            await processTurn(this, m.chat, room, m, false, null, chosenPionNum)
            await checkAndRunBot(this, m.chat, room, m)
        }
    } catch (err) {
        console.error('Error pada before handler ludo:', err)
    }
}

handler.help = ['ludo']
handler.tags = ['game']
handler.command = /^(ludo)$/i
handler.group = true

export default handler

// ==========================================================================
// LOGIKA PERGERAKAN DENGAN OPERATOR PILIHAN PION MANUAL / OTOMATIS
// ==========================================================================
async function processTurn(conn, chatId, room, m, isBotExec = false, botJid = null, manualPionNum = null) {
    let pJid = isBotExec ? botJid : room.players[room.turnIndex]
    let pIdx = room.players.indexOf(pJid)
    let pData = room.playerData[pJid]

    let dadu = Math.floor(Math.random() * 6) + 1
    let report = `🎲 *@${pJid.includes('BOT') ? '🤖 Bot AI' : pJid.split('@')[0]}* melempar dadu: *[ ${dadu} ]*\n`

    let moved = false
    let movedTokenIdx = -1

    // CARI KEMUNGKINAN LANKAH YANG VALID
    let validMoves = []
    for (let i = 0; i < 4; i++) {
        let pos = pData.tokens[i]
        if (pos === 0 && dadu === 6) {
            validMoves.push({ tokenIdx: i, pionNum: i + 1, type: 'spawn', targetPos: 1 })
        } else if (pos > 0 && (pos + dadu) <= 57) {
            validMoves.push({ tokenIdx: i, pionNum: i + 1, type: 'move', targetPos: pos + dadu })
        }
    }

    if (validMoves.length > 0) {
        let selectedMove = null

        // 1. JIKA PEMAIN MANUSIA MEMILIH NOMOR PION SECARA SPESIFIK (CONTOH: dadu 2)
        if (!isBotExec && manualPionNum !== null) {
            selectedMove = validMoves.find(m => m.pionNum === manualPionNum)
            if (!selectedMove) {
                return conn.reply(chatId, `⚠️ *Pion #${manualPionNum}* tidak bisa bergerak dengan dadu *[ ${dadu} ]*! (Masih di markas/sudah finish).\n\n💡 *Pion yang bisa jalan:* ${validMoves.map(v => `#${v.pionNum}`).join(', ')}`, m)
            }
        } 
        // 2. STRATEGI BOT AI ATAU JIKA PEMAIN HANYA KETIK 'dadu'
        else {
            // A. Prioritas Utama: Tabrak / Injak Pion Musuh
            for (let move of validMoves) {
                if (move.targetPos >= 1 && move.targetPos <= 51) {
                    let targetAbs = (START_INDEX[pIdx] + (move.targetPos - 1)) % 52
                    for (let [oIdx, otherJid] of room.players.entries()) {
                        if (otherJid !== pJid) {
                            let otherData = room.playerData[otherJid]
                            if (otherData.tokens.some((oStep) => oStep >= 1 && oStep <= 51 && ((START_INDEX[oIdx] + (oStep - 1)) % 52) === targetAbs)) {
                                selectedMove = move
                                break
                            }
                        }
                    }
                }
                if (selectedMove) break
            }

            // B. Jika Dadu 6 dan Ada Pion di Base, Keluarkan Pion Baru
            if (!selectedMove && dadu === 6) {
                selectedMove = validMoves.find(m => m.type === 'spawn')
            }

            // C. Pilih Pion yang Posisinya Paling Belakang
            if (!selectedMove) {
                validMoves.sort((a, b) => pData.tokens[a.tokenIdx] - pData.tokens[b.tokenIdx])
                selectedMove = validMoves[0]
            }
        }

        // EKSEKUSI MOVEMENT PION
        movedTokenIdx = selectedMove.tokenIdx
        if (selectedMove.type === 'spawn') {
            pData.tokens[movedTokenIdx] = 1
            report += `✨ Pion #${selectedMove.pionNum} *${pData.color}* keluar dari Markas!`
        } else {
            pData.tokens[movedTokenIdx] += dadu
            report += `🚶 Pion #${selectedMove.pionNum} *${pData.color}* maju ${dadu} langkah!`
            if (pData.tokens[movedTokenIdx] === 57) report += ` 🎉 *FINISH!*`
        }
        moved = true
    }

    // DETEKSI TABRAKAN PION (MENGINJAK PION MUSUH KE BASE)
    if (moved && movedTokenIdx !== -1) {
        let currentPosStep = pData.tokens[movedTokenIdx]
        
        if (currentPosStep >= 1 && currentPosStep <= 51) {
            let myAbsoluteIndex = (START_INDEX[pIdx] + (currentPosStep - 1)) % 52

            room.players.forEach((otherJid, oIdx) => {
                if (otherJid !== pJid) {
                    let otherData = room.playerData[otherJid]
                    otherData.tokens.forEach((otherStep, oTIdx) => {
                        if (otherStep >= 1 && otherStep <= 51) {
                            let otherAbsoluteIndex = (START_INDEX[oIdx] + (otherStep - 1)) % 52
                            
                            if (myAbsoluteIndex === otherAbsoluteIndex) {
                                otherData.tokens[oTIdx] = 0 // TENDANG KEMBALI KE BASE
                                report += `\n💥 *BOOM! Pion #${movedTokenIdx + 1} ${pData.color} menginjak Pion #${oTIdx + 1} ${otherData.color}!* Pion musuh dikembalikan ke Markas!`
                            }
                        }
                    })
                }
            })
        }
    }

    if (!moved) {
        report += `🔒 Tidak ada pion yang dapat bergerak.`
    }

    // DETEKSI KEMENANGAN (SEMUA 4 PION FINISH)
    let isWin = pData.tokens.every(pos => pos === 57)
    if (isWin) {
        delete conn.ludo[chatId]
        let winMsg = `🏆 *[ PERMAINAN LUDO SELESAI ]* 🏆\n\n🎉 Selamat kepada *@${pJid.split('@')[0]}* (${pData.color}) yang telah memenangkan pertandingan Ludo!`
        let boardBuffer = await renderLudoBoard(room)
        return await conn.sendMessage(chatId, { image: boardBuffer, caption: winMsg, mentions: [pJid] }, { quoted: m })
    }

    // GANTI GILIRAN JIKA DADU BUKAN 6
    if (dadu !== 6) {
        room.turnIndex = (room.turnIndex + 1) % 4
    } else {
        report += `\n🔥 *Dadu 6! Dapat bonus kocok dadu sekali lagi!*`
    }

    let nextP = room.players[room.turnIndex]
    report += `\n\n🎲 *Giliran Berikutnya:* ${nextP.includes('BOT') ? '🤖 Bot AI' : `@${nextP.split('@')[0]}`}`

    let boardBuffer = await renderLudoBoard(room, pData.color, movedTokenIdx)
    await conn.sendMessage(chatId, { image: boardBuffer, caption: report, mentions: [pJid, nextP].filter(p => !p.includes('BOT')) }, { quoted: m })
}

// ==========================================================================
// BOT AI AUTOMATION
// ==========================================================================
async function checkAndRunBot(conn, chatId, room, m) {
    let currentPlayer = room.players[room.turnIndex]

    if (currentPlayer && currentPlayer.includes('BOT')) {
        await new Promise(resolve => setTimeout(resolve, 2000))
        await processTurn(conn, chatId, room, m, true, currentPlayer)
        await checkAndRunBot(conn, chatId, room, m)
    }
}

// ==========================================================================
// ENGINE CANVAS PAPAN LUDO
// ==========================================================================
const GRID_SIZE = 40

const MAIN_TRACK = [
    {x:1,y:6}, {x:2,y:6}, {x:3,y:6}, {x:4,y:6}, {x:5,y:6},
    {x:6,y:5}, {x:6,y:4}, {x:6,y:3}, {x:6,y:2}, {x:6,y:1}, {x:6,y:0},
    {x:7,y:0}, {x:8,y:0},
    {x:8,y:1}, {x:8,y:2}, {x:8,y:3}, {x:8,y:4}, {x:8,y:5},
    {x:9,y:6}, {x:10,y:6}, {x:11,y:6}, {x:12,y:6}, {x:13,y:6}, {x:14,y:6},
    {x:14,y:7}, {x:14,y:8},
    {x:13,y:8}, {x:12,y:8}, {x:11,y:8}, {x:10,y:8}, {x:9,y:8},
    {x:8,y:9}, {x:8,y:10}, {x:8,y:11}, {x:8,y:12}, {x:8,y:13}, {x:8,y:14},
    {x:7,y:14}, {x:6,y:14},
    {x:6,y:13}, {x:6,y:12}, {x:6,y:11}, {x:6,y:10}, {x:6,y:9},
    {x:5,y:8}, {x:4,y:8}, {x:3,y:8}, {x:2,y:8}, {x:1,y:8}, {x:0,y:8},
    {x:0,y:7}, {x:0,y:6}
]

const START_INDEX = [0, 13, 26, 39]

const HOME_STRETCH = {
    0: [{x:1,y:7}, {x:2,y:7}, {x:3,y:7}, {x:4,y:7}, {x:5,y:7}],
    1: [{x:7,y:1}, {x:7,y:2}, {x:7,y:3}, {x:7,y:4}, {x:7,y:5}],
    2: [{x:13,y:7}, {x:12,y:7}, {x:11,y:7}, {x:10,y:7}, {x:9,y:7}],
    3: [{x:7,y:13}, {x:7,y:12}, {x:7,y:11}, {x:7,y:10}, {x:7,y:9}]
}

const BASE_POSITIONS = [
    [{x:2,y:2}, {x:3,y:2}, {x:2,y:3}, {x:3,y:3}],
    [{x:11,y:2}, {x:12,y:2}, {x:11,y:3}, {x:12,y:3}],
    [{x:11,y:11}, {x:12,y:11}, {x:11,y:12}, {x:12,y:12}],
    [{x:2,y:11}, {x:3,y:11}, {x:2,y:12}, {x:3,y:12}]
]

async function renderLudoBoard(room, activeColor = null, activeTokenIdx = -1) {
    const canvas = createCanvas(600, 600)
    const ctx = canvas.getContext('2d')

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(0, 0, 600, 600)

    ctx.lineWidth = 1
    ctx.strokeStyle = '#B0BEC5'
    for (let i = 0; i <= 15; i++) {
        ctx.beginPath(); ctx.moveTo(i * GRID_SIZE, 0); ctx.lineTo(i * GRID_SIZE, 600); ctx.stroke()
        ctx.beginPath(); ctx.moveTo(0, i * GRID_SIZE); ctx.lineTo(600, i * GRID_SIZE); ctx.stroke()
    }

    drawBase(ctx, 0, 0, '#FF2B2B')
    drawBase(ctx, 360, 0, '#00C853')
    drawBase(ctx, 360, 360, '#FFD600')
    drawBase(ctx, 0, 360, '#2979FF')

    HOME_STRETCH[0].forEach(p => fillGrid(ctx, p.x, p.y, '#FF8A80'))
    HOME_STRETCH[1].forEach(p => fillGrid(ctx, p.x, p.y, '#B9F6CA'))
    HOME_STRETCH[2].forEach(p => fillGrid(ctx, p.x, p.y, '#FFE57F'))
    HOME_STRETCH[3].forEach(p => fillGrid(ctx, p.x, p.y, '#82B1FF'))

    fillGrid(ctx, MAIN_TRACK[0].x, MAIN_TRACK[0].y, '#FF5252')
    fillGrid(ctx, MAIN_TRACK[13].x, MAIN_TRACK[13].y, '#69F0AE')
    fillGrid(ctx, MAIN_TRACK[26].x, MAIN_TRACK[26].y, '#FFD740')
    fillGrid(ctx, MAIN_TRACK[39].x, MAIN_TRACK[39].y, '#448AFF')

    ctx.beginPath(); ctx.moveTo(240, 240); ctx.lineTo(300, 300); ctx.lineTo(240, 360); ctx.fillStyle = '#FF2B2B'; ctx.fill()
    ctx.beginPath(); ctx.moveTo(240, 240); ctx.lineTo(300, 300); ctx.lineTo(360, 240); ctx.fillStyle = '#00C853'; ctx.fill()
    ctx.beginPath(); ctx.moveTo(360, 240); ctx.lineTo(300, 300); ctx.lineTo(360, 360); ctx.fillStyle = '#FFD600'; ctx.fill()
    ctx.beginPath(); ctx.moveTo(240, 360); ctx.lineTo(300, 300); ctx.lineTo(360, 360); ctx.fillStyle = '#2979FF'; ctx.fill()
    ctx.strokeRect(240, 240, 120, 120)

    room.players.forEach((pJid, pIdx) => {
        let pData = room.playerData[pJid]
        if (!pData) return

        pData.tokens.forEach((posStep, tIdx) => {
            let coords = getTokenCoordinates(pIdx, posStep, tIdx)
            let isHighlighted = (pData.color === activeColor && tIdx === activeTokenIdx)
            drawToken(ctx, coords.x, coords.y, pData.hex, tIdx + 1, isHighlighted)
        })
    })

    ctx.lineWidth = 4
    ctx.strokeStyle = '#263238'
    ctx.strokeRect(2, 2, 596, 596)

    return await canvas.encode('png')
}

function drawBase(ctx, x, y, color) {
    ctx.fillStyle = color
    ctx.fillRect(x, y, 240, 240)
    ctx.lineWidth = 2
    ctx.strokeStyle = '#000000'
    ctx.strokeRect(x, y, 240, 240)

    ctx.fillStyle = '#FFFFFF'
    ctx.fillRect(x + 40, y + 40, 160, 160)
    ctx.strokeRect(x + 40, y + 40, 160, 160)
}

function fillGrid(ctx, gx, gy, color) {
    ctx.fillStyle = color
    ctx.fillRect(gx * GRID_SIZE + 1, gy * GRID_SIZE + 1, GRID_SIZE - 2, GRID_SIZE - 2)
}

function getTokenCoordinates(pIdx, posStep, tIdx) {
    if (posStep === 0) {
        let bp = BASE_POSITIONS[pIdx][tIdx]
        return { x: bp.x * GRID_SIZE + 20, y: bp.y * GRID_SIZE + 20 }
    }
    if (posStep >= 57) {
        return { x: 300, y: 300 }
    }
    if (posStep > 51) {
        let stretchIdx = posStep - 52
        let p = HOME_STRETCH[pIdx][stretchIdx]
        return { x: p.x * GRID_SIZE + 20, y: p.y * GRID_SIZE + 20 }
    }
    let trackIndex = (START_INDEX[pIdx] + (posStep - 1)) % 52
    let p = MAIN_TRACK[trackIndex]
    return { x: p.x * GRID_SIZE + 20, y: p.y * GRID_SIZE + 20 }
}

function drawToken(ctx, cx, cy, hexColor, tokenNum, isHighlighted) {
    if (isHighlighted) {
        ctx.beginPath()
        ctx.arc(cx, cy, 22, 0, Math.PI * 2)
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'
        ctx.fill()
        ctx.lineWidth = 3
        ctx.strokeStyle = '#FFD700'
        ctx.stroke()
    }

    ctx.beginPath()
    ctx.arc(cx, cy, 15, 0, Math.PI * 2)
    ctx.fillStyle = hexColor
    ctx.fill()
    ctx.lineWidth = 2.5
    ctx.strokeStyle = '#FFFFFF'
    ctx.stroke()

    ctx.fillStyle = '#FFFFFF'
    ctx.font = 'bold 13px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText(tokenNum.toString(), cx, cy)
}