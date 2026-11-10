function getUser(id) {
  if (!global.db || !global.db.data) return null;
  const users = global.db.data.users || (global.db.data.users = {});
  return users[id] || (users[id] = {});
}

function tanggal(ms) {
  return new Date(ms).toLocaleString("id-ID", {
    timeZone: "Asia/Jakarta",
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const handler = async (m, { args }) => {
  const q = (args || []).join(" ").trim();
  if (!q) return m.reply("Masukkan nama karakter atau MAL ID.\n\nContoh: .lamar Rimuru Tempest");

  try {
    const user = getUser(m.sender);
    if (!user) return m.reply("Database belum siap.");

    let name = q;
    let id = null;

    if (/^\d+$/.test(q)) {
      const { detail } = await import("./char.js");
      const c = await detail(q);
      if (!c) return m.reply("Karakter dengan ID " + q + " tidak ditemukan.");
      name = c.name;
      id = q;
    }

    const now = user.lamar;
    if (now && now.status === "Pacaran") {
      if (now.name.toLowerCase() === name.toLowerCase()) {
        return m.reply("Kamu sudah pacaran dengan *" + now.name + "*.");
      }
      return m.reply("Kamu masih pacaran dengan *" + now.name + "*, tidak bisa melamar karakter lain.");
    }

    user.lamar = { name, id, status: "Pacaran", since: Date.now() };

    await m.reply(
      "*Lamaran Diterima*\n\n" +
        "Karakter: " + name + "\n" +
        "Status: Pacaran\n" +
        "Sejak: " + tanggal(user.lamar.since)
    );
  } catch (e) {
    console.error(e);
    m.reply("Gagal memproses lamaran, coba lagi nanti.");
  }
};

handler.help = ["lamar <nama/id>"];
handler.tags = ["anime"];
handler.command = /^lamar$/i;

export default handler;