process.env.TZ = 'Asia/Jakarta';
import fs from 'fs';
import path from 'path';
import os from 'os';
import moment from 'moment-timezone';
import levelling from '../lib/levelling.js';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let arrayMenu = [
    'ai', 'main', 'downloader', 'database', 'rpg', 'rpgG', 
    'sticker', 'advanced', 'xp', 'fun', 'game', 'github', 
    'group', 'image', 'nsfw', 'info', 'internet', 'islam', 
    'kerang', 'maker', 'news', 'owner', 'voice', 'quotes', 
    'store', 'stalk', 'shortlink', 'tools', 'anonymous', ''
];

const allTags = {
    'ai': '🤖 ARTIFICIAL INTELLIGENCE',
    'main': '📌 MAIN MENU',
    'downloader': '📥 DOWNLOADER',
    'database': '💾 DATABASE & STORAGE',
    'rpg': '⚔️ RPG FANTASY GAME',
    'rpgG': '🛡️ RPG GUILD SYSTEM',
    'sticker': '🎨 STICKER & CONVERT',
    'advanced': '⚡ ADVANCED SYSTEM',
    'xp': '🎯 EXP & LEVELING',
    'fun': '🎭 FUN & ENTERTAINMENT',
    'game': '🎮 INTERACTIVE GAMES',
    'github': '🐙 GITHUB TOOLS',
    'group': '👥 GROUP MANAGEMENT',
    'image': '🖼️ IMAGE PROCESSING',
    'nsfw': '🔞 ADULT CONTENT (18+)',
    'info': 'ℹ️ SYSTEM INFORMATION',
    'internet': '🌐 INTERNET & SEARCH',
    'islam': '🕌 ISLAMIC CENTER',
    'kerang': '🐚 KERANG AJAIB',
    'maker': '🛠️ GENERATOR & MAKER',
    'news': '📰 PORTAL NEWS',
    'owner': '👑 VIP OWNER MENU',
    'voice': '🎙️ VOICE CHANGER',
    'quotes': '💬 QUOTES & MOTIVATION',
    'store': '🛒 DIGITAL STORE',
    'stalk': '🔍 STALKER & TRACKER',
    'shortlink': '🔗 URL SHORTENER',
    'tools': '🧰 UTILITY TOOLS',
    'anonymous': '🕵️ ANONYMOUS CHAT',
    '': '📁 OTHERS'
};

const defaultMenu = {
    before: `
═══⟪ *KIRYUU BOT DASHBOARD* ⟫═══

  ╭─┈✨ *USER PROFILE* ✨
  │ 👤 *User:* %name
  │ 💎 *Status:* %premium
  │ 🎫 *Limit:* %limit
  │ 📊 *Level:* %level (%exp / %maxexp)
  │ 🛡️ *Role:* %role
  ╰───────────────

  ╭─┈⚙️ *SYSTEM MONITOR* ⚙️
  │ 🚀 *Runtime:* %uptime
  │ 💾 *RAM Usage:* %ram
  │ 📅 *Date:* %date
  │ ⏰ *Time:* %time WIB
  │ ⚡ *Prefix:* [ %p ]
  ╰───────────────
`.trimStart(),
    header: '╭───📝 *%category* ───',
    body: '│ ➔ %cmd %islimit %isPremium',
    footer: '╰───────────────────\n',
    after: `*💡 Quick Tips:* 
• Ketik *%pmenu <kategori>* untuk menu spesifik.
• Ketik *%pallmenu* untuk menampilkan seluruh perintah.

*KIRYUU BOT v2.0 • AUTOMATED SYSTEM*`
};

let handler = async (m, { conn, usedPrefix: _p, args = [] }) => {
    try {
        let user = global.db.data.users[m.sender] || {};
        let { exp = 0, limit = 0, level = 0, role = 'Novice', premium = false } = user;
        let { max } = levelling.xpRange(level, global.multiplier);
        
        let name = `@${m.sender.split`@`[0]}`;
        let teks = (args[0] || '').toLowerCase();
        
        let d = moment().tz('Asia/Jakarta');
        let date = d.format('DD MMMM YYYY');
        let time = d.format('HH:mm:ss');

        let _uptime = process.uptime() * 1000;
        let uptime = clockString(_uptime);

        // Memory Usage Calculation
        let ram = `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB / ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB`;
        
        let help = Object.values(global.plugins).filter(plugin => !plugin.disabled).map(plugin => {
            return {
                help: Array.isArray(plugin.help) ? plugin.help : [plugin.help],
                tags: Array.isArray(plugin.tags) ? plugin.tags : [plugin.tags],
                prefix: 'customPrefix' in plugin,
                limit: plugin.limit,
                premium: plugin.premium,
                enabled: !plugin.disabled,
            };
        });

        // Tampilan Utama (Menu Kategori VIP)
        if (!teks) {
            let menuList = `${defaultMenu.before}\n╭───📂 *CATEGORY NAVIGATION* ───\n`;
            menuList += `│ ➔ ${_p}allmenu *(All Commands)*\n`;
            for (let tag of arrayMenu) {
                if (tag && allTags[tag]) {
                    menuList += `│ ➔ ${_p}menu ${tag}\n`;
                }
            }
            menuList += `╰───────────────────\n\n${defaultMenu.after}`;

            let replace = {
                '%': '%',
                p: _p, 
                uptime,
                name, 
                date,
                time,
                ram,
                limit: limit < 0 ? 'Unlimited ♾️' : limit,
                level,
                exp,
                maxexp: max,
                role,
                premium: premium ? 'VIP Premium ★' : 'Free User'
            };

            let text = menuList.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), 
                (_, name) => '' + replace[name]);
                
            await conn.sendMessage(
                m.chat,
                {
                    image: { url: "https://uploader.danafxc.my.id/images/681f2b1d-e0fe-435e-9b9e-fa1cdbfa23a0.jpg" },
                    caption: text,
                    mentions: [m.sender],
                },
                { quoted: m }
            );

            let musicPath = path.join(__dirname, "music.mp3");
            if (fs.existsSync(musicPath)) {
                await conn.sendMessage(
                    m.chat,
                    {
                        audio: { url: musicPath },
                        mimetype: "audio/mpeg",
                        ptt: false
                    },
                    { quoted: m }
                );
            }
            return;
        }

        if (teks === 'all') {
            return conn.plugin.allmenu ? conn.plugin.allmenu.call(this, m, { conn, usedPrefix: _p, args, command: 'allmenu' }) : m.reply(`Gunakan perintah *${_p}allmenu* untuk melihat seluruh fitur.`);
        }

        if (!allTags[teks]) {
            return m.reply(`⚠️ *Kategori "${teks}" tidak ditemukan.*\nKetik *${_p}menu* untuk melihat daftar kategori.`);
        }

        // Tampilan Menu Per Kategori
        let menuCategory = defaultMenu.before + '\n';
        let categoryCommands = help.filter(menu => menu.tags && menu.tags.includes(teks) && menu.help);
        
        menuCategory += defaultMenu.header.replace(/%category/g, allTags[teks]) + '\n';
        for (let menu of categoryCommands) {
            for (let h of menu.help) {
                if (!h) continue;
                menuCategory += defaultMenu.body
                    .replace(/%cmd/g, menu.prefix ? h : _p + h)
                    .replace(/%islimit/g, menu.limit ? '[Ⓛ]' : '')
                    .replace(/%isPremium/g, menu.premium ? '[👑]' : '') + '\n';
            }
        }
        menuCategory += defaultMenu.footer;
        menuCategory += '\n' + defaultMenu.after;
        
        let replace = {
            '%': '%',
            p: _p, 
            uptime, 
            name,
            date,
            time,
            ram,
            limit: limit < 0 ? 'Unlimited ♾️' : limit,
            level,
            exp,
            maxexp: max,
            role,
            premium: premium ? 'VIP Premium ★' : 'Free User'
        };

        let text = menuCategory.replace(new RegExp(`%(${Object.keys(replace).sort((a, b) => b.length - a.length).join`|`})`, 'g'), 
            (_, name) => '' + replace[name]);

        await conn.sendMessage(
            m.chat,
            {
                image: { url: "https://uploader.danafxc.my.id/images/681f2b1d-e0fe-435e-9b9e-fa1cdbfa23a0.jpg" },
                caption: text,
                mentions: [m.sender],
            },
            { quoted: m }
        );
    } catch (e) {
        console.error(e);
        m.reply('❌ Terjadi kesalahan pada sistem menu.');
    }
};

handler.help = ['menu'];
handler.tags = ['main'];
handler.command = /^(menu|help|\?)$/i;
handler.exp = 3;

export default handler;

function clockString(ms) {
    if (isNaN(ms)) return '--:--:--';
    let h = Math.floor(ms / 3600000);
    let m = Math.floor(ms / 60000) % 60;
    let s = Math.floor(ms / 1000) % 60;
    return [h, m, s].map(v => v.toString().padStart(2, '0')).join(':');
}