import { Buffer } from "buffer";

export let handler = async (m, { conn }) => {
  const gameHtml = `<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Suit vs Bot</title>
<style>
:root{ --bg:#0f172a; --card:#1e293b; --accent:#3b82f6; --text:#f8fafc; --muted:#94a3b8; }
*{margin:0;padding:0;box-sizing:border-box;font-family:sans-serif;}
body{background:transparent;color:var(--text);display:flex;justify-content:center;align-items:flex-start;padding:8px;}
.card{width:100%;max-width:360px;background:var(--card);border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:14px;text-align:center;box-shadow:0 8px 24px rgba(0,0,0,0.4);}
.title{font-size:16px;font-weight:bold;margin-bottom:2px;color:#60a5fa;}
.sub{font-size:11px;color:var(--muted);margin-bottom:12px;}
.arena{display:flex;justify-content:space-around;align-items:center;background:rgba(0,0,0,0.2);border-radius:12px;padding:12px;margin-bottom:12px;}
.player-box{font-size:11px;color:var(--muted);flex:1;}
.choice-display{font-size:36px;margin-top:4px;height:45px;display:flex;align-items:center;justify-content:center;}
.score-board{font-size:13px;font-weight:bold;margin-bottom:12px;background:rgba(255,255,255,0.05);padding:6px;border-radius:8px;}
.result-text{font-size:14px;font-weight:bold;margin-bottom:12px;min-height:20px;}
.buttons{display:flex;gap:6px;justify-content:center;}
.btn{background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);border-radius:10px;padding:8px 12px;font-size:20px;cursor:pointer;transition:all 0.1s;flex:1;}
.btn:active{transform:scale(0.92);background:var(--accent);}
</style>
</head>
<body>
<div class="card">
  <div class="title">🤖 User vs Bot 🎮</div>
  <div class="sub">Pilih salah satu tombol di bawah!</div>
  
  <div class="score-board">
    Skor Kamu: <span id="userScore" style="color:#4ade80">0</span> | Skor Bot: <span id="furyScore" style="color:#f87171">0</span>
  </div>

  <div class="arena">
    <div class="player-box">Kamu<div class="choice-display" id="userChoice">👈</div></div>
    <div style="font-size:16px;font-weight:bold;color:var(--muted);">VS</div>
    <div class="player-box">Bot<div class="choice-display" id="botChoice">🤖</div></div>
  </div>

  <div class="result-text" id="resultText">Silakan buat pilihanmu!</div>

  <div class="buttons">
    <button class="btn" onclick="play('batu')">🪨</button>
    <button class="btn" onclick="play('kertas')">📄</button>
    <button class="btn" onclick="play('gunting')">✂️</button>
  </div>
</div>

<script>
let uScore = 0, bScore = 0;
const emojis = { batu: '🪨', kertas: '📄', gunting: '✂️' };
const choices = ['batu', 'kertas', 'gunting'];

function play(userPick) {
    let botPick = choices[Math.floor(Math.random() * choices.length)];
    
    document.getElementById('userChoice').textContent = emojis[userPick];
    document.getElementById('botChoice').textContent = emojis[botPick];
    
    let resText = document.getElementById('resultText');
    
    if (userPick === botPick) {
        resText.textContent = "🤝 Seri / Draw!";
        resText.style.color = "#fbbf24";
    } else if (
        (userPick === 'batu' && botPick === 'gunting') ||
        (userPick === 'kertas' && botPick === 'batu') ||
        (userPick === 'gunting' && botPick === 'kertas')
    ) {
        resText.textContent = "🎉 Kamu Menang Babak Ini!";
        resText.style.color = "#4ade80";
        uScore++;
        document.getElementById('userScore').textContent = uScore;
    } else {
        resText.textContent = "🤖 Bot Menang Babak Ini!";
        resText.style.color = "#f87171";
        bScore++;
        document.getElementById('furyScore').textContent = bScore;
    }
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
          botResponseId: "game-vs-bot-" + Date.now(),
        },
      },
      botForwardedMessage: {
        message: {
          richResponseMessage: {
            messageType: 1,
            submessages: [
              {
                messageType: 2,
                messageText: "🤖 Mini-Game: Suit vs Bot",
              },
            ],
            unifiedResponse: {
              data: Buffer.from(
                JSON.stringify({
                  response_id: "vs-bot-" + Date.now(),
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

handler.help = ["tesvsbot"];
handler.tags = ["game"];
handler.command = /^tesvsbot$/i;

export default handler;