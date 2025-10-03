const axios = require('axios'); // Menggunakan axios agar konsisten

let handler = async (m, { text, usedPrefix, command }) => {
    if (!text) throw `Masukkan Nomor Pelanggan PLN Anda.\n\n*Contoh:* ${usedPrefix + command} 172720204487`;
    
    m.reply('Sedang memeriksa tagihan PLN, mohon tunggu...');
    
    try {
        // 1. URL API diubah ke endpoint baru Anda
        // 2. Parameter diubah dari 'id' ke 'nopel'
        // 3. API key diambil dari global config
        const apiUrl = `https://api.danafxc.my.id/api/proxy/search/tagihanpln?nopel=${text}&apikey=${dana}`;
        
        const response = await axios.get(apiUrl);
        const res = response.data;

        let content = `💡 *TAGIHAN LISTRIK PLN*\n\n`;

        // 4. Pengecekan disesuaikan dengan respons baru (res.status && res.data)
        if (res.status && res.data) {
            const bill = res.data;
            
            // 5. Field disesuaikan dengan nama properti dari API baru
            content += `  ◦  *ID Pelanggan:* ${bill.no_pelanggan}\n`;
            content += `  ◦  *Nama:* ${bill.nama_pelanggan}\n`;
            content += `  ◦  *Tarif/Daya:* ${bill.tarif_daya}\n`;
            content += `  ◦  *Periode:* ${bill.bulan_tahun}\n`;
            content += `  ◦  *Stand Meter:* ${bill.stand_meter}\n`;
            content += `  ◦  *Total Tagihan:* ${bill.total_tagihan}\n`;
        } else {
            content += `Data tagihan untuk nomor *${text}* tidak ditemukan.`;
        }
        
        await m.reply(content);
        
    } catch (error) {
        console.error('Error pada fitur cekbillpln:', error);
        m.reply('Terjadi kesalahan saat memeriksa tagihan. Pastikan nomor pelanggan benar dan coba lagi nanti.');
    }
};

handler.command = handler.help = ['cekbillpln', 'tagihanpln', 'pln'];
handler.tags = ['tools'];
handler.limit = true;

module.exports = handler;