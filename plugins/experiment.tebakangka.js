import { Buffer } from "buffer";

export let handler = async (m, { conn }) => {
  const gameHtml = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Tebak Angka</title>
<style>
:root{ --bg:#0f172a; --card:#1e293b; --accent:#10b981; --text:#f8fafc; --muted:#94a3b8; }
*{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif;}
body{background:transparent;color:var(--text);display:flex;justify-content:center;align-items:flex-start;padding:8px;}
.card{width:100%;max-width:360px;background:var(--card);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:14px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,0.4);}
.title{font-size:16px;font-weight:bold;margin-bottom:2px;color:#34d399;}
.sub{font-size:11px;color:var(--muted);margin-bottom:12px;}
.box-game{background:rgba(0,0,0,0.2);border-radius:12px;padding:14px;margin-bottom:12px;}
.input-group{display:flex;gap:6px;margin-bottom:10px;}
input{flex:1;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.2);border-radius:8px;padding:8px 10px;color:#fff;font-size:16px;text-align:center;outline:none;}
.btn{background:var(--accent);border:none;color:#0b141a;font-weight:bold;border-radius:8px;padding:8px 14px;cursor:pointer;font-size:14px;}
.btn:active{opacity:0.8;}
.info-text{font-size:13px;font-weight:bold;margin-top:8px;min-height:20px;color:#fbbf24;}
.attempts{font-size:11px;color:var(--muted);margin-top:4px;}
</style>
</head>
<body>
<div class="card">
  <div class="title">🎯 Tebak Angka (1 - 100)</div>
  <div class="sub">Tebak angka rahasia yang dipilih bot!</div>
  
  <div class="box-game">
    <div class="input-group">
      <input type="number" id="userGuess" placeholder="Masukkan angka" min="1" max="100">
      <button class="btn" onclick="checkGuess()">Tebak</button>
    </div>
    <div class="info-text" id="infoText">Ayo mulai tebak!</div>
    <div class="attempts" id="attemptsText">Percobaan: 0</div>
  </div>

  <button class="btn" style="width:100%;background:rgba(255,255,255,0.1);color:#fff;" onclick="resetGame()">🔄 Reset Game</button>
</div>

<script>
let secretNumber = Math.floor(Math.random() * 100) + 1;
let attempts = 0;

function checkGuess() {
    let inputVal = document.getElementById('userGuess').value;
    let guess = parseInt(inputVal);
    let info = document.getElementById('infoText');
    let attText = document.getElementById('attemptsText');

    if (isNaN(guess) || guess < 1 || guess > 100) {
        info.textContent = "⚠️ Masukkan angka 1 sampai 100!";
        info.style.color = "#f87171";
        return;
    }

    attempts++;
    attText.textContent = "Percobaan: " + attempts;

    if (guess === secretNumber) {
        info.textContent = \`🎉 Benar! Angkanya adalah \${secretNumber}\`;
        info.style.color = "#4ade80";
    } else if (guess < secretNumber) {
        info.textContent = "📈 Terlalu KECIL! Naikkan lagi.";
        info.style.color = "#60a5fa";
    } else {
        info.textContent = "📉 Terlalu BESAR! Turunkan lagi.";
        info.style.color = "#fbbf24";
    }
}

function resetGame() {
    secretNumber = Math.floor(Math.random() * 100) + 1;
    attempts = 0;
    document.getElementById('userGuess').value = '';
    document.getElementById('infoText').textContent = "Game direset! Ayo tebak lagi.";
    document.getElementById('infoText').style.color = "#fbbf24";
    document.getElementById('attemptsText').textContent = "Percobaan: 0";
}
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
          botResponseId: "game-tebak-angka-" + Date.now(),
        },
      },
      botForwardedMessage: {
        message: {
          richResponseMessage: {
            messageType: 1,
            submessages: [
              {
                messageType: 2,
                messageText: "🎯 Mini-Game: Tebak Angka",
              },
            ],
            unifiedResponse: {
              data: Buffer.from(
                JSON.stringify({
                  response_id: "tebak-angka-" + Date.now(),
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

handler.help = ["tebakangka"];
handler.tags = ["game"];
handler.command = /^tebakangka$/i;

export default handler;