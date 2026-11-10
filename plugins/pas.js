import fetch from "node-fetch";
import * as cheerio from "cheerio";

const BASE = "https://myanimelist.net";
const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36";
const DELAY = 3000;

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

async function load(path) {
  const opt = { headers: { "User-Agent": UA, "Accept-Language": "en-US,en;q=0.9" } };
  let res = await fetch(BASE + path, opt);
  if (res.status === 429) {
    await wait(6000);
    res = await fetch(BASE + path, opt);
  }
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("MAL " + res.status);
  return cheerio.load(await res.text());
}

function flip(name) {
  const p = name.split(",").map((s) => s.trim());
  return p.length === 2 ? p[1] + " " + p[0] : name;
}

async function search(q) {
  const $ = await load("/character.php?q=" + encodeURIComponent(q) + "&cat=character");
  if (!$) return [];
  const ids = new Set();
  const out = [];
  $('table tr a[href*="/character/"]').each((_, a) => {
    const m = ($(a).attr("href") || "").match(/\/character\/(\d+)/);
    const name = $(a).text().trim();
    if (!m || !name || ids.has(m[1])) return;
    ids.add(m[1]);
    out.push({ id: m[1], name: flip(name) });
  });
  return out;
}

async function detail(id) {
  const $ = await load("/character/" + id);
  if (!$) return null;

  const name = $("h1.title-name").first().text().trim() || ($('meta[property="og:title"]').attr("content") || "").trim();
  if (!name) return null;

  let kanji = "";
  $(".normal_header small").each((_, el) => {
    const t = $(el).text().trim();
    if (!kanji && /^\(.+\)$/.test(t)) kanji = t.slice(1, -1);
  });

  const fav = $("body").text().match(/Member Favorites:\s*([\d,]+)/i);

  let about = "";
  const head = $("h2.normal_header").first();
  if (head.length) {
    let n = head[0].nextSibling;
    while (n) {
      const el = $(n);
      if (n.type === "tag") {
        if (n.name === "table" || n.name === "h2" || el.is("div.normal_header")) break;
        if (n.name === "br") about += "\n";
        else if (n.name !== "script" && n.name !== "style") about += el.text();
      } else if (n.type === "text") {
        about += n.data;
      }
      n = n.nextSibling;
    }
  }

  const anime = [];
  const manga = [];
  const voices = [];
  const done = new Set();

  $("tr").each((_, tr) => {
    const row = $(tr);
    const role = row.find("small").first().text().trim();
    const pick = (sel) => row.find(sel).filter((_, x) => $(x).text().trim()).first();

    const an = pick('a[href*="/anime/"]');
    if (an.length) {
      const k = an.attr("href");
      if (!done.has(k)) {
        done.add(k);
        anime.push({ title: an.text().trim(), role });
      }
      return;
    }

    const mg = pick('a[href*="/manga/"]');
    if (mg.length) {
      const k = mg.attr("href");
      if (!done.has(k)) {
        done.add(k);
        manga.push({ title: mg.text().trim(), role });
      }
      return;
    }

    const va = pick('a[href*="/people/"]');
    if (va.length && role) {
      const k = va.attr("href");
      if (!done.has(k)) {
        done.add(k);
        voices.push({ name: flip(va.text().trim()), lang: role });
      }
    }
  });

  return {
    id,
    name,
    kanji,
    about,
    anime,
    manga,
    voices,
    image: $('meta[property="og:image"]').attr("content") || "",
    favorites: fav ? fav[1] : "0",
    url: BASE + "/character/" + id,
  };
}

function splitAbout(about) {
  const facts = [];
  const bio = [];
  const text = (about || "").replace(/\(Source:.*?\)|\[Written by.*?\]/gi, "");
  for (const line of text.split("\n")) {
    const l = line.trim();
    const m = l.match(/^([A-Za-z ]{2,20}):\s*(.+)$/);
    if (m) facts.push(m[1] + ": " + m[2]);
    else if (l) bio.push(l);
  }
  return { facts: facts.slice(0, 12), bio: bio.join("\n") };
}

const cut = (s, max) => (s.length > max ? s.slice(0, max).trim() + "..." : s);

function limit(list, max) {
  const out = list.slice(0, max);
  if (list.length > max) out.push("and " + (list.length - max) + " more");
  return out.join("\n");
}

function caption(c) {
  const { facts, bio } = splitAbout(c.about);
  let t = "*" + c.name + "*\n";
  if (c.kanji) t += "Kanji: " + c.kanji + "\n";
  t += "MAL ID: " + c.id + "\n";
  t += "Favorites: " + c.favorites + "\n";

  if (facts.length) t += "\n*Profile*\n" + facts.join("\n") + "\n";
  if (bio) t += "\n*Biography*\n" + cut(bio, 800) + "\n";

  if (c.anime.length) {
    t += "\n*Anime*\n" + limit(c.anime.map((a) => "- " + a.title + (a.role ? " (" + a.role + ")" : "")), 6) + "\n";
  }
  if (c.manga.length) {
    t += "\n*Manga*\n" + limit(c.manga.map((a) => "- " + a.title + (a.role ? " (" + a.role + ")" : "")), 4) + "\n";
  }

  const jp = c.voices.filter((v) => v.lang === "Japanese").map((v) => v.name);
  const en = c.voices.filter((v) => v.lang === "English").map((v) => v.name);
  if (jp.length || en.length) {
    t += "\n*Voice Actors*\n";
    if (jp.length) t += "Japanese: " + jp.slice(0, 3).join(", ") + "\n";
    if (en.length) t += "English: " + en.slice(0, 3).join(", ") + "\n";
  }

  return t + "\n" + c.url;
}

const handler = async (m, { conn, args }) => {
  const q = args.join(" ").trim();
  if (!q) return m.reply("Masukkan nama karakter atau MAL ID.\n\nContoh: .char Rimuru Tempest");

  try {
    let id = q;
    let others = [];

    if (!/^\d+$/.test(q)) {
      if (q.length < 3) return m.reply("Nama karakter minimal 3 huruf.");
      const res = await search(q);
      if (!res.length) return m.reply('Karakter tidak ditemukan untuk "' + q + '".');
      id = res[0].id;
      others = res.slice(1, 6);
      await wait(DELAY);
    }

    const c = await detail(id);
    if (!c) return m.reply("Karakter dengan ID " + id + " tidak ditemukan.");

    let text = caption(c);
    if (others.length) {
      text += "\n\n*Hasil Lainnya*\n" + others.map((o) => "- " + o.name + " (ID: " + o.id + ")").join("\n");
    }

    if (c.image) await conn.sendMessage(m.chat, { image: { url: c.image }, caption: text }, { quoted: m });
    else await m.reply(text);

    await wait(1000);
    const meta = Buffer.from("{1|.lamar " + c.name + "}").toString("base64");
    await conn.sendMessage(m.chat, {
      text: "lamar " + c.name + "\n\n1. Lamar\n\nmetadata: " + meta,
    });
  } catch (e) {
    console.error(e);
    m.reply("Gagal mengambil data karakter, coba lagi nanti.");
  }
};

handler.help = ["character <nama/id>", "char <nama/id>"];
handler.tags = ["anime"];
handler.command = /^(character|char)$/i;

export default handler;
export { detail };