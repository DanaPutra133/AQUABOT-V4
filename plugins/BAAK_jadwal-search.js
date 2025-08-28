const axios = require("axios");

let handler = async (m, { conn, text }) => {
    if (!text) throw '.jadwal <kelas>';

    const rawResponse = await fetchRawResponse(text);

    if (!rawResponse) {
        return conn.reply(m.chat, 'Tidak ada data yang ditemukan atau terjadi kesalahan di token, ulangi lagi!.', m);
    }

    const tableData = extractTable(rawResponse);

    if (!tableData) {
        return conn.reply(m.chat, 'Tidak ada tabel data yang ditemukan.', m);
    }

    const formattedData = formatTableData(tableData);

    // Kirimkan data yang sudah diformat ke pengguna
    conn.reply(m.chat, formattedData, m);
};

handler.help = ['jadwal <kelas>'];
handler.tags = ['tools'];
handler.command = /^(jadwal)$/i;
handler.group = false;

module.exports = handler;

async function fetchRawResponse(kelas) {
    try {
        const url = `https://api.danafxc.my.id/api/jadwal/kuliah?apikey=mark%20pembohong&search=${encodeURIComponent(kelas)}`;
        const { data } = await axios.get(url, {
        });

        if (!data.status || !data.data) {
            console.error('❌ Data tidak valid:', data.message);
            return null;
        }

        // Log isi respons JSON
        console.log('=== RAW RESPONSE ===');
        console.dir(data, { depth: null });

        // Kembalikan data JSON
        return data.data;

    } catch (error) {
        console.error('❌ Gagal mengambil data:', error.message);
        return null;
    }
}

function extractTable(rawResponse) {
    try {
        // Tidak perlu ekstraksi tabel karena data sudah dalam bentuk JSON
        return rawResponse;
    } catch (error) {
        console.error('❌ Gagal mengekstrak tabel:', error.message);
        return null;
    }
}

function formatTableData(tableData) {
    try {
        // Format data JSON menjadi string yang rapi
        const formattedData = tableData.map(entry => {
            return `Kelas: ${entry.kelas}\nHari: ${entry.hari}\nMata Kuliah: ${entry.mata_kuliah}\nWaktu: ${entry.waktu}\nRuang: ${entry.ruang}\nDosen: ${entry.dosen}\n\n-----------------------------\n`;
        });

        return formattedData.join('');
    } catch (error) {
        console.error('❌ Gagal memformat tabel:', error.message);
        return 'Gagal memformat data.';
    }
}