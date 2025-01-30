const axios = require('axios');

async function cekUser(url) {
    return await axios(url).catch(_ => null);
}

async function sendNgl(url, text) {
    return await axios({
        url,
        method: 'post',
        data: new URLSearchParams({ question: text })
    }).catch(console.log);
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
    let [user, msg] = text.split`|`;
    if (!(user && msg)) throw `Contoh: ${usedPrefix + command} username/ngl_link | pesan`;
    let link = /^(http|https):\/\/ngl.link/gi.test(user) ? user : /ngl.link/gi.test(user) ? `https://${user}` : `https://ngl.link/${user}`;
    let data = await cekUser(link);
    if (!data) throw 'Pengguna tidak ditemukan/URL tidak valid';
    await sendNgl(link, msg).then(() => m.reply(`Berhasil mengirim ngl ke *"${user}"*\nPesan: *"${msg}"*`));
};

handler.help = ['ngl'];
handler.tags = ['tools'];
handler.command = /^ngl$/i;

module.exports = handler;