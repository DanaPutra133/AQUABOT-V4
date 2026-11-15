import { Buffer } from "buffer";

export let handler = async (m, { conn }) => {
  const gameHtml = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tic Tac Toe vs Bot</title>
<style>
:root{ --bg:#0f172a; --card:#1e293b; --accent:#3b82f6; --text:#f8fafc; --muted:#94a3b8; }
*{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif;}
body{background:transparent;color:var(--text);display:flex;justify-content:center;align-items:flex-start;padding:8px;}
.card{width:100%;max-width:320px;background:var(--card);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:14px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,0.4);}
.title{font-size:16px;font-weight:bold;margin-bottom:2px;color:#60a5fa;}
.sub{font-size:11px;color:var(--muted);margin-bottom:12px;}
.status{font-size:13px;font-weight:bold;margin-bottom:10px;color:#fbbf24;}
.board{display:grid;grid-template-columns:repeat(3,1fr);gap:6px;margin-bottom:12px;}
.cell{background:rgba(255,255,255,0.05);border:1px solid rgba(255,255,255,0.15);aspect-ratio:1;font-size:28px;font-weight:bold;display:flex;align-items:center;justify-content:center;border-radius:10px;cursor:pointer;transition:all 0.1s;}
.cell:active{transform:scale(0.92);background:rgba(255,255,255,0.15);}
.cell.x{color:#f87171;}
.cell.o{color:#34d399;}
.btn-reset{background:var(--accent);border:none;color:#fff;font-weight:bold;padding:8px 16px;border-radius:8px;cursor:pointer;font-size:12px;width:100%;}
.btn-reset:active{opacity:0.8;}
</style>
</head>
<body>
<div class="card">
  <div class="title">❌ Tic Tac Toe vs Bot ⭕</div>
  <div class="sub">Kamu (X) vs Bot (O)</div>
  <div class="status" id="status">Giliran Kamu (X)</div>
  <div class="board" id="board"></div>
  <button class="btn-reset" onclick="resetGame()">🔄 Reset Game</button>
</div>

<script>
let board = ['', '', '', '', '', '', '', '', ''];
let isGameActive = true;
let isAiTurn = false;

const statusText = document.getElementById('status');
const boardElement = document.getElementById('board');

function renderBoard() {
    boardElement.innerHTML = '';
    board.forEach((cell, index) => {
        const cellEl = document.createElement('div');
        cellEl.classList.add('cell');
        if (cell === 'X') cellEl.classList.add('x');
        if (cell === 'O') cellEl.classList.add('o');
        cellEl.textContent = cell;
        cellEl.addEventListener('click', () => handleCellClick(index));
        boardElement.appendChild(cellEl);
    });
}

function handleCellClick(index) {
    if (board[index] !== '' || !isGameActive || isAiTurn) return;
    
    // Langkah User (X)
    board[index] = 'X';
    renderBoard();
    
    if (checkWin('X')) {
        statusText.innerHTML = "🎉 Selamat, Kamu Menang!";
        statusText.style.color = "#4ade80";
        isGameActive = false;
        return;
    }
    
    if (board.every(cell => cell !== '')) {
        statusText.innerHTML = "🤝 Permainan Seri!";
        statusText.style.color = "#94a3b8";
        isGameActive = false;
        return;
    }
    
    // Giliran Bot (O)
    isAiTurn = true;
    statusText.innerHTML = "🤖 Bot sedang berpikir...";
    statusText.style.color = "#60a5fa";
    
    setTimeout(() => {
        botMove();
    }, 400);
}

function botMove() {
    if (!isGameActive) return;
    
    // Cari kotak kosong secara acak
    let emptyCells = [];
    board.forEach((val, idx) => {
        if (val === '') emptyCells.push(idx);
    });
    
    if (emptyCells.length > 0) {
        let randomIndex = emptyCells[Math.floor(Math.random() * emptyCells.length)];
        board[randomIndex] = 'O';
    }
    
    renderBoard();
    
    if (checkWin('O')) {
        statusText.innerHTML = "🤖 Bot Menang! Coba lagi.";
        statusText.style.color = "#f87171";
        isGameActive = false;
        isAiTurn = false;
        return;
    }
    
    if (board.every(cell => cell !== '')) {
        statusText.innerHTML = "🤝 Permainan Seri!";
        statusText.style.color = "#94a3b8";
        isGameActive = false;
        isAiTurn = false;
        return;
    }
    
    isAiTurn = false;
    statusText.innerHTML = "Giliran Kamu (X)";
    statusText.style.color = "#fbbf24";
}

function checkWin(player) {
    const wins = [
        [0,1,2], [3,4,5], [6,7,8],
        [0,3,6], [1,4,7], [2,5,8],
        [0,4,8], [2,4,6]
    ];
    return wins.some(cond => {
        const [a, b, c] = cond;
        return board[a] === player && board[b] === player && board[c] === player;
    });
}

function resetGame() {
    board = ['', '', '', '', '', '', '', '', ''];
    isGameActive = true;
    isAiTurn = false;
    statusText.innerHTML = "Giliran Kamu (X)";
    statusText.style.color = "#fbbf24";
    renderBoard();
}

renderBoard();
</script>
</body>
</html>`;

  await conn.relayMessage(
    m.chat,
    {
      messageContextInfo: {
        deviceListMetadata: {},
        deviceListMetadataVersion: 2,
        botMetadata: {
          botResponseId: "game-tictactoe-bot-" + Date.now(),
        },
      },
      botForwardedMessage: {
        message: {
          richResponseMessage: {
            messageType: 1,
            submessages: [
              {
                messageType: 2,
                messageText: "❌ Mini-Game: Tic Tac Toe vs Bot",
              },
            ],
            unifiedResponse: {
              data: Buffer.from(
                JSON.stringify({
                  response_id: "ttt-bot-" + Date.now(),
                  sections: [
                    {
                      view_model: {
                        primitive: {
                          __typename: "GenAIaeacdsnwHtmlPrimitive",
                          payload: gameHtml,
                          trusted_sources: ["nixel.dev"],
                        },
                        __typename: "GenAISingleLayoutViewModel",
                      },
                    },
                  ],
                }),
              ).toString("base64"),
            },
            contextInfo: {
              forwardingScore: 1,
              isForwarded: true,
              forwardedAiBotMessageInfo: {
                botJid: "867051314767696@bot",
              },
              forwardOrigin: 4,
            },
          },
        },
      },
    },
    {},
  );
};

handler.help = ["tictactoebot", "tttbot"];
handler.tags = ["game"];
handler.command = /^(tictactoe|tttbot)$/i;

export default handler;