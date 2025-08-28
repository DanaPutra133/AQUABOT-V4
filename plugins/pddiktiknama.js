const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan nama mahasiswa!\n\ncontoh: ${usedPrefix + command} ARSYA ZAHRA FIRDAUS`;

    const name = text.trim();

    try {
        const response = await axios.get(`https://api.danafxc.my.id/api/pddkiti/search-mahasiswa-by-name?apikey=mark%20pembohong&username=${encodeURIComponent(name)}`);

        const data = response.data;
        if (data.status) {
            const mahasiswa = data.data;
            const result = `
=== PDDIKTI ===
- *Nama*: ${mahasiswa.nama}
- *NIM*: ${mahasiswa.nim}
- *Perguruan Tinggi*: ${mahasiswa.nama_pt} (${mahasiswa.kode_pt.trim()})
- *Program Studi*: ${mahasiswa.prodi} (${mahasiswa.kode_prodi})
- *Jenis Kelamin*: ${mahasiswa.jenis_kelamin}
- *Jenjang*: ${mahasiswa.jenjang}
- *Status*: ${mahasiswa.status_saat_ini}
- *Tanggal Masuk*: ${new Date(mahasiswa.tanggal_masuk).toLocaleDateString()}
================
            `.trim();
            await conn.reply(m.chat, result, m);
        } else {
            await conn.reply(m.chat, `Gagal mengambil data: ${data.message}`, m);
        }
    } catch (error) {
        await conn.reply(m.chat, 'Terjadi kesalahan saat mengambil data. Pastikan nama yang dimasukkan benar.', m);
    }
};

handler.help = ['pddnama'];
handler.tags = ['tools'];
handler.command = /^(pddnama)$/i; 
handler.group = false; 

module.exports = handler;