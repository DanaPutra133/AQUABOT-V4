const axios = require('axios');

let handler = async (m, { conn, text, usedPrefix, command }) => {
    if (!text) throw `Masukkan nama dosen!\n\ncontoh: ${usedPrefix + command} ANI REHAN SOPAHELUWAKAN`;

    const name = text.trim();

    try {
        const response = await axios.get(`https://api.danafxc.my.id/api/pddkiti/search-dosen?apikey=mark%20pembohong&username=${encodeURIComponent(name)}`);

        const data = response.data;
        if (data.status) {
            const dosen = data.data.searchResult;
            const profile = data.data.details.profile;
            const studiHistory = data.data.details.studiHistory || [];
            const teachingHistory = data.data.details.teachingHistory || [];
            const karyaPortofolio = data.data.details.karyaPortofolio || [];

            let result = `
=== PDDIKTI DOSEN ===
- *Nama*: ${profile.nama_dosen}
- *NIDN*: ${dosen.nidn}
- *NUPTK*: ${dosen.nuptk || '-'}
- *Perguruan Tinggi*: ${profile.nama_pt}
- *Program Studi*: ${profile.nama_prodi}
- *Jenis Kelamin*: ${profile.jenis_kelamin}
- *Jabatan Akademik*: ${profile.jabatan_akademik}
- *Pendidikan Tertinggi*: ${profile.pendidikan_tertinggi}
- *Status Ikatan Kerja*: ${profile.status_ikatan_kerja}
- *Status Aktivitas*: ${profile.status_aktivitas}
======================
`;

            if (studiHistory.length > 0) {
                result += '\n=== RIWAYAT STUDI ===\n';
                studiHistory.forEach((studi, i) => {
                    result += `
${i + 1}. *Jenjang*: ${studi.jenjang}
   - *Program Studi*: ${studi.nama_prodi}
   - *Perguruan Tinggi*: ${studi.nama_pt}
   - *Tahun Masuk*: ${studi.tahun_masuk}
   - *Tahun Lulus*: ${studi.tahun_lulus}
   - *Gelar*: ${studi.gelar_akademik} (${studi.singkatan_gelar})
`;
                });
            }

            if (teachingHistory.length > 0) {
                result += '\n=== RIWAYAT MENGAJAR ===\n';
                teachingHistory.forEach((teaching, i) => {
                    result += `
${i + 1}. *Semester*: ${teaching.nama_semester}
   - *Kode Mata Kuliah*: ${teaching.kode_matkul}
   - *Nama Mata Kuliah*: ${teaching.nama_matkul}
   - *Kelas*: ${teaching.nama_kelas}
   - *Perguruan Tinggi*: ${teaching.nama_pt}
`;
                });
            }

            if (karyaPortofolio.length > 0) {
                result += '\n=== KARYA PORTOFOLIO ===\n';
                karyaPortofolio.forEach((karya, i) => {
                    result += `
${i + 1}. *Jenis Kegiatan*: ${karya.jenis_kegiatan}
   - *Judul*: ${karya.judul_kegiatan}
   - *Tahun*: ${karya.tahun_kegiatan}
`;
                });
            }

            await conn.reply(m.chat, result.trim(), m);
        } else {
            await conn.reply(m.chat, `Gagal mengambil data: ${data.message}`, m);
        }
    } catch (error) {
        await conn.reply(m.chat, 'Terjadi kesalahan saat mengambil data. Pastikan nama yang dimasukkan benar.', m);
    }
};

handler.help = ['pdddosen'];
handler.tags = ['tools'];
handler.command = /^(pdddosen)$/i;
handler.group = false;

module.exports = handler;