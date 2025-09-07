const axios = require('axios');
const FormData = require('form-data');

// Menggunakan struktur array asli Anda untuk membuat list yang terstruktur
const filtersWithOptions = [
    { name: '--- Filter Dasar ---', value: '', disabled: true },
    { name: 'Grayscale', value: 'grayscale' },
    { name: 'Sepia', value: 'sepia' },
    { name: 'Invert', value: 'invert' },
    { name: '--- Penyesuaian ---', value: '', disabled: true },
    { name: 'Brightness', value: 'brightness', needs: 'value', range: '-1 to 1' },
    { name: 'Contrast', value: 'contrast', needs: 'value', range: '-1 to 1' },
    { name: 'Saturate', value: 'saturate', needs: 'value', range: '0 to 100' },
    { name: 'Blur', value: 'blur', needs: 'value', range: '1 to 100' },
    { name: '--- Artistik ---', value: '', disabled: true },
    { name: 'Posterize', value: 'posterize', needs: 'value', range: '2 to 256' },
    { name: 'Pixelate', value: 'pixelate', needs: 'value', range: '1 to 50' },
    { name: '--- Transformasi ---', value: '', disabled: true },
    { name: 'Rotate', value: 'rotate', needs: 'value', range: 'derajat, cth: 90' },
    { name: 'Flip', value: 'flip', needs: 'direction', options: 'horizontal/vertical' },
    { name: 'Circle Crop', value: 'circle' },
    { name: '--- Gaya Populer ---', value: '', disabled: true },
    { name: 'Clarendon', value: 'clarendon' },
    { name: 'Gingham', value: 'gingham' },
    { name: 'Moon', value: 'moon' },
    { name: 'Nashville', value: 'nashville' },
    { name: 'Lark', value: 'lark' },
    { name: 'Reyes', value: 'reyes' },
    { name: 'Juno', value: 'juno' },
];

// Array filter yang valid untuk pengecekan (tanpa separator)
const validFilters = filtersWithOptions.filter(f => !f.disabled);

let handler = async (m, { conn, text, usedPrefix, command }) => {
    const q = m.quoted ? m.quoted : m;
    const mime = (q.msg || q).mimetype || q.mediaType || '';

    if (!/image\/(jpe?g|png)/.test(mime)) {
        throw `Balas gambar dengan caption *${usedPrefix + command} <nama_filter>* atau *${usedPrefix + command} <nama_filter> <value/direction>*`;
    }

    if (!text) {
        // --- PESAN BANTUAN YANG DISEMPURNAKAN ---
        let listMessage = `*Pilih filter yang ingin Anda gunakan:*\n`;
        filtersWithOptions.forEach(f => {
            if (f.disabled) {
                listMessage += `\n*${f.name}*\n`; // Judul Kategori
            } else {
                listMessage += `• *${f.name}* (\`${f.value}\`)\n`;
                if (f.needs === 'value') listMessage += `  ↳ _Butuh nilai: ${f.range || ''}_\n`;
                if (f.needs === 'direction') listMessage += `  ↳ _Butuh arah: ${f.options || ''}_\n`;
            }
        });
        listMessage += `\n*Contoh Penggunaan:*\n`;
        listMessage += `\`${usedPrefix + command} sepia\`\n`;
        listMessage += `\`${usedPrefix + command} blur 15\`\n`;
        throw listMessage;
    }

    const args = text.split(/\s+/, 2);
    const filterName = args[0].toLowerCase();
    const filterValueOrDirection = args[1];

    const selectedFilter = validFilters.find(f => f.value === filterName);

    if (!selectedFilter) {
        throw `Filter "${filterName}" tidak ditemukan.\n\nKetik *${usedPrefix + command}* untuk melihat daftar filter.`;
    }

    try {
        m.reply(`⏳ Menerapkan filter *${selectedFilter.name}*...`);
        const imgBuffer = await q.download();
        const form = new FormData();
        form.append('image', imgBuffer, { filename: 'filter_input.png', contentType: mime });

        const params = { apikey: global.dana, filter: selectedFilter.value };
        if (selectedFilter.needs === 'value' && filterValueOrDirection) params.value = filterValueOrDirection;
        if (selectedFilter.needs === 'direction' && filterValueOrDirection) params.direction = filterValueOrDirection;
        if (selectedFilter.needs && !filterValueOrDirection) {
            throw `Filter *${selectedFilter.name}* (${selectedFilter.value}) membutuhkan ${selectedFilter.needs}.\n\nContoh: \`${usedPrefix + command} ${selectedFilter.value} ${selectedFilter.range ? selectedFilter.range.split(' to ')[0] : (selectedFilter.options || '').split('/')[0]}\``;
        }

        const queryString = new URLSearchParams(params).toString();
        const apiUrl = `https://api.danafxc.my.id/api/proxy/maker/randomfilter?${queryString}`;

        const response = await axios.post(apiUrl, form, {
            headers: form.getHeaders(),
            responseType: 'arraybuffer'
        });

        conn.sendFile(m.chat, response.data, 'filtered_image.png', `Gambar dengan filter *${selectedFilter.name}*`, m);

    } catch (error) {
        console.error('Error pada fitur filter:', error.response ? error.response.data.toString() : error.message);
        m.reply(`Gagal menerapkan filter. Penyebab: ${error.message}`);
    }
};

handler.help = ['filter <nama_filter> [value/direction]'];
handler.tags = ['tools', 'image'];
handler.command = /^(filter|efek|imgfilter)$/i;

module.exports = handler;