import { Chess } from 'chess.js'

let handler = async (m, { conn, args, usedPrefix, command }) => {
    try {
        let key = m.chat
        conn.chess = conn.chess ? conn.chess : {}

        let chessData = conn.chess[key] || {
            gameData: null,
            fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
            currentTurn: null,
            players: [],
            hasJoined: []
        }
        conn.chess[key] = chessData

        let { gameData, fen, currentTurn, players, hasJoined } = chessData
        let feature = (args[0] || '').toLowerCase()

        // Helper fungsi kirim papan catur visual
        const sendBoard = async (chatId, fenStr, caption, mentions = [], isBlackView = false) => {
            let encodedFen = encodeURIComponent(fenStr)
            let flipParam = isBlackView ? '&flip=true' : ''
            let flipParam2 = isBlackView ? '-flip' : ''
            let boardUrl = `https://www.chess.com/dynboard?fen=${encodedFen}&board=graffiti&piece=graffiti&size=3&coordinates=inside${flipParam}`
            
            try {
                await conn.sendFile(chatId, boardUrl, 'chess.png', caption, m, false, { mentions })
            } catch (error) {
                let boardUrl2 = `https://chessboardimage.com/${encodedFen + flipParam2}.png`
                await conn.sendFile(chatId, boardUrl2, 'chess.png', caption, m, false, { mentions })
            }
        }

        // ------------------------------------------------------------------
        // 1. DELETE / STOP GAME
        // ------------------------------------------------------------------
        if (feature === 'delete' || feature === 'stop') {
            if (!gameData) return conn.reply(m.chat, '⚠️ *Tidak ada permainan catur yang sedang berlangsung di chat ini.*', m)
            delete conn.chess[key]
            return conn.reply(m.chat, '🏳️ *Permainan catur berhasil dihentikan.*', m)
        }

        // ------------------------------------------------------------------
        // 2. CREATE GAME (Langsung Tampilkan Gambar Papan Catur Awal)
        // ------------------------------------------------------------------
        if (feature === 'create') {
            if (gameData) {
                return conn.reply(m.chat, '⚠️ *Permainan sudah dibuat atau sedang berjalan di grup ini.*', m)
            }

            let startFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1'
            conn.chess[key] = {
                gameData: { status: 'waiting', black: null, white: null },
                fen: startFen,
                currentTurn: null,
                players: [],
                hasJoined: []
            }

            let captionText = `🎮 *[ PERMAINAN CATUR DIBUAT ]* 🎮\n\nPapan catur siap!\nKetik *${usedPrefix}${command} join* untuk bergabung ke room.`
            return await sendBoard(m.chat, startFen, captionText)
        }

        // ------------------------------------------------------------------
        // 3. JOIN GAME (Langsung Tentukan Pion Hitam / Putih & Tampilkan Papan)
        // ------------------------------------------------------------------
        if (feature === 'join') {
            let senderId = m.sender
            if (!gameData || gameData.status !== 'waiting') {
                return conn.reply(m.chat, `⚠️ *Tidak ada room catur yang sedang menunggu.*\nKetik *${usedPrefix}${command} create* untuk membuat baru.`, m)
            }
            if (players.includes(senderId)) {
                return conn.reply(m.chat, '🙅‍♂️ *Anda sudah bergabung dalam permainan ini.*', m)
            }

            players.push(senderId)
            hasJoined.push(senderId)

            if (players.length === 2) {
                gameData.status = 'ready'
                let [black, white] = Math.random() < 0.5 ? [players[1], players[0]] : [players[0], players[1]]
                gameData.black = black
                gameData.white = white
                chessData.currentTurn = white

                let joinMsg = `
🙌 *[ PEMAIN KEDUA BERGABUNG! ]*

👥 *Pemain:*
⚪ *Putih:* @${white.split('@')[0]}
🖤 *Hitam:* @${black.split('@')[0]}

Ketik *'${usedPrefix}${command} start'* untuk memulai laga!
`.trim()
                return await sendBoard(m.chat, chessData.fen, joinMsg, [white, black])
            } else {
                let waitMsg = `🙋‍♂️ @${senderId.split('@')[0]} *telah bergabung.*\nMenunggu 1 pemain lagi untuk memulai...`
                return await sendBoard(m.chat, chessData.fen, waitMsg, [senderId])
            }
        }

        // ------------------------------------------------------------------
        // 4. START GAME (Permainan Dimulai - Giliran Putih Melangkah)
        // ------------------------------------------------------------------
        if (feature === 'start') {
            if (!gameData || (gameData.status !== 'ready' && gameData.status !== 'playing')) {
                return conn.reply(m.chat, `⚠️ *Belum dapat memulai.* Pastikan 2 pemain telah bergabung via *${usedPrefix}${command} join*.`, m)
            }

            if (gameData.status === 'ready') {
                gameData.status = 'playing'
            }

            let giliranText = `⚔️ *[ CATUR DIMULAI ]* ⚔️\n\n🎲 *Giliran Pertama:* ⚪ Putih (@${gameData.white.split('@')[0]})\n\nKetik langkah: *${usedPrefix}${command} e2 e4*`
            return await sendBoard(m.chat, chessData.fen, giliranText, [gameData.white])
        }

        // ------------------------------------------------------------------
        // 5. PERGERAKAN BIDAK REAL-TIME (chess [dari] [ke] -> contoh: chess e2 e4)
        // ------------------------------------------------------------------
        if (args[0] && args[1]) {
            let senderId = m.sender
            if (!gameData || gameData.status !== 'playing') {
                return conn.reply(m.chat, '⚠️ *Permainan belum dimulai!*', m)
            }

            if (currentTurn !== senderId) {
                let turnColor = chessData.currentTurn === gameData.white ? '⚪ Putih' : '🖤 Hitam'
                return conn.reply(m.chat, `⏳ *Sekarang giliran ${turnColor} (@${chessData.currentTurn.split('@')[0]}) untuk bergerak.*`, m, {
                    mentions: [chessData.currentTurn]
                })
            }

            let chess = new Chess(fen)
            let [from, to] = args

            try {
                let move = chess.move({ from: from.toLowerCase(), to: to.toLowerCase(), promotion: 'q' })
                if (!move) throw new Error('Invalid move')
            } catch (e) {
                return conn.reply(m.chat, '❌ *Langkah tidak valid!* Contoh format: *chess e2 e4*', m)
            }

            // Perbarui FEN Papan Catur di Database/Memori
            chessData.fen = chess.fen()

            // Cek Kondisi Skakmat / Seri Setelah Pergerakan Bidak
            if (chess.isCheckmate()) {
                let winMsg = `🎉 *SKAKMAT (CHECKMATE)!*\n\n🏆 *Pemenang:* @${m.sender.split('@')[0]}`
                await sendBoard(m.chat, chessData.fen, winMsg, [m.sender])
                delete conn.chess[key]
                return
            }

            if (chess.isDraw()) {
                let drawMsg = `🤝 *PERMAINAN SERI (DRAW)!*\n\nPapan catur terkunci.`
                await sendBoard(m.chat, chessData.fen, drawMsg)
                delete conn.chess[key]
                return
            }

            // Ganti Giliran Pemain
            let currentTurnIndex = players.indexOf(currentTurn)
            let nextTurnIndex = (currentTurnIndex + 1) % 2
            chessData.currentTurn = players[nextTurnIndex]

            let nextColor = chessData.currentTurn === gameData.white ? '⚪ Putih' : '🖤 Hitam'
            let isNextBlack = chessData.currentTurn === gameData.black
            let inCheckText = chess.inCheck() ? '\n⚠️ *PERHATIAN: POSISI SKAK (CHECK)!*' : ''

            let statusText = `
♟️ *[ GERAKAN DITERIMA: ${from.toUpperCase()} ➡️ ${to.toUpperCase()} ]*

🎲 *Giliran Selanjutnya:* ${nextColor} (@${chessData.currentTurn.split('@')[0]})${inCheckText}

Ketik langkah: *${usedPrefix}${command} [posisi_awal] [tujuan]*
`.trim()

            // Tampilkan Gambar Papan Catur Terbaru (Real-Time Update)
            return await sendBoard(m.chat, chessData.fen, statusText, [chessData.currentTurn], isNextBlack)
        }

        // ------------------------------------------------------------------
        // 6. HELP MENU
        // ------------------------------------------------------------------
        if (feature === 'help') {
            let helpText = `
🌟 *[ BANTUAN PERMAINAN CATUR ]* 🌟

• *${usedPrefix}${command} create* : Membuat room & menampilkan papan catur awal
• *${usedPrefix}${command} join* : Bergabung ke permainan
• *${usedPrefix}${command} start* : Memulai laga catur
• *${usedPrefix}${command} [dari] [ke]* : Mendorong/menggerakkan bidak (Contoh: *${usedPrefix}${command} e2 e4*)
• *${usedPrefix}${command} delete* : Menghapus/menghentikan permainan catur
`.trim()
            return conn.reply(m.chat, helpText, m)
        }

        return conn.reply(m.chat, `❓ Perintah tidak valid. Ketik *"${usedPrefix}${command} help"* untuk melihat panduan.`, m)

    } catch (e) {
        console.error('Error chess plugin:', e)
        m.reply('Terjadi kesalahan saat memproses gambar/permainan catur!')
    }
}

handler.help = ['chess <dari ke>', 'chess delete', 'chess join', 'chess start']
handler.tags = ['game']
handler.command = /^(chess|catur)$/i

export default handler