import Database from "../lib/database2.js";

let handler = async (m, { command }) => {
  const db = new Database();
  const u = db.getUser(m.sender) || {};

  const level = Number(u.level || u.rpg?.level || 0);
  const exp = Number(u.exp || 0);
  const money = Number(u.koin || u.money || 0);
  const inv = u.inventory || {};
  const items = Object.values(inv).reduce((s, v) => s + (Number(v) || 0), 0);

  const TITLES = [
    [1, "Pemula", "Mulai perjalananmu."],
    [5, "Petualang", "Mencapai level 5."],
    [10, "Veteran", "Mencapai level 10."],
    [20, "Elite", "Mencapai level 20."],
    [30, "Legenda", "Mencapai level 30."],
    [50, "Master", "Mencapai level 50."],
  ];

  const cmd = (command || m.command || "").toLowerCase();

  if (cmd === "titles" || cmd === "gelar") {
    const unlocked = TITLES.filter(([lv]) => level >= lv);
    const listTitles = TITLES.map(
      ([lv, name, desc]) =>
        `${level >= lv ? "✅" : "🔒"} ${name} — Lv.${lv} — ${desc}`
    ).join("\n");

    return m.reply(
      `🏷️ *GELAR*\n\n${listTitles}\n\nGelar tertinggi: *${
        unlocked.at(-1)?.[1] || "Pemula"
      }*`
    );
  }

  const ach = [
    [level >= 5, "🌱", "Naik level", "Mencapai level 5"],
    [level >= 10, "⚔️", "Veteran", "Mencapai level 10"],
    [level >= 20, "👑", "Elite", "Mencapai level 20"],
    [exp >= 100000, "✨", "Seratus Ribu EXP", "Mengumpulkan 100.000 EXP"],
    [money >= 100000, "💰", "Kaya", "Memiliki 100.000 koin"],
    [items >= 20, "🎒", "Kolektor", "Memiliki total 20 item"],
  ];

  const listAch = ach
    .map(([ok, e, n, d]) => `${ok ? "✅" : "🔒"} ${e} *${n}*\n> ${d}`)
    .join("\n\n");

  return m.reply(`🏆 *ACHIEVEMENT*\n\n${listAch}`);
};

handler.help = ["gelar"];
handler.tags = ["rpg"];
handler.command = /^(gelar)$/i;

export default handler;