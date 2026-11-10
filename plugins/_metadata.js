const META = /metadata:\s*([A-Za-z0-9+\/]+={0,2})/i;
const PAIR = /(\d+)\s*\|\s*(.+?)(?=\s*,\s*\d+\s*\||\s*$)/g;

function decode(text) {
  const hit = text.match(META);
  if (!hit) return {};
  let raw = "";
  try {
    raw = Buffer.from(hit[1], "base64").toString("utf8").trim();
  } catch {
    return {};
  }
  const box = raw.match(/^\{(.+)\}$/s);
  if (!box) return {};
  const map = {};
  for (const [, no, cmd] of box[1].matchAll(PAIR)) map[no] = cmd.trim();
  return map;
}

function match(plugin, name) {
  const c = plugin && plugin.command;
  if (!c) return false;
  if (c instanceof RegExp) return c.test(name);
  if (Array.isArray(c)) return c.some((x) => (x instanceof RegExp ? x.test(name) : x === name));
  return c === name;
}

const handler = (m) => m;

handler.before = async function (m, { conn }) {
  if (!m.quoted || !m.text) return;

  const pick = m.text.trim();
  if (!/^\d+$/.test(pick)) return;

  const map = decode(m.quoted.text || m.quoted.body || "");
  if (!Object.keys(map).length) return;

  const cmd = map[pick];
  if (!cmd) {
    await m.reply("Pilihan " + pick + " tidak ada. Pilih: " + Object.keys(map).join(", "));
    return true;
  }

  const prefix = (cmd.match(/^[.!#\/]/) || [""])[0];
  const [name, ...args] = cmd.slice(prefix.length).split(/\s+/);

  for (const plugin of Object.values(global.plugins || {})) {
    if (!match(plugin, name)) continue;
    m.text = cmd;
    await plugin.call(conn, m, {
      conn,
      args,
      text: args.join(" "),
      command: name,
      usedPrefix: prefix,
    });
    return true;
  }

  await m.reply("Command " + cmd + " tidak ditemukan.");
  return true;
};

export default handler;