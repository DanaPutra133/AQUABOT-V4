let poin = 10000;
const similarity = require("similarity");
const threshold = 0.72;

let handler = (m) => m;

handler.before = async function (m) {
  let id = m.chat;
  if (!m.quoted) return !0;
  this.tebakhsr = this.tebakhsr ? this.tebakhsr : {};
  if (!(id in this.tebakhsr)) return !0;
  if (m.quoted.id !== this.tebakhsr[id][0].key.id) return !0;
  let json = this.tebakhsr[id][1];
  let jawaban = json.jawaban.toLowerCase().trim();
  let teksUser = (m.text || "").toLowerCase().trim();
  if (!teksUser) return !0;
  if (teksUser === jawaban) {
    global.db.data.users[m.sender].money += this.tebakhsr[id][2];
    let caption3 = `*Benar!*\n+${this.tebakhsr[id][2]} money`;
    conn.sendMessage(m.chat,  { image: { url: json.img }, caption: caption3},{ quoted: m })
    clearTimeout(this.tebakhsr[id][3]);
    delete this.tebakhsr[id];
  } else if (similarity(teksUser, jawaban) >= threshold) {
    m.reply(`*Dikit Lagi!*`);
  } else {
    m.reply(`*Salah!*`);
  }
  return !0;
};

handler.exp = 0;
module.exports = handler;