let handler = async (m, { conn, text }) => {
  if (!text) return conn.reply(m.chat, "Harap masukan jumlah|teks", m);

  let [count, msg] = text.split("|");

  count = parseInt(count);
  if (isNaN(count)) return conn.reply(m.chat, "Jumlah harus angka!", m);
  if (!msg) return conn.reply(m.chat, "Teks tidak boleh kosong!", m);

  const total = count;

  for (let i = 0; i < total; i++) {
    await conn.reply(m.chat, msg.trim(), m);
  }
};

handler.help = ["spam <jumlah>|<teks>"];
handler.tags = ["tools"];
handler.command = /^(spam)$/i;

handler.limit = true;
handler.admin = true;
module.exports = handler;
