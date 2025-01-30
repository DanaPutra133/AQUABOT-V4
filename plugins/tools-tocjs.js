const promptSync = require('prompt-sync');

const prompt = promptSync();

let handler = async (m, { conn, args }) => {
    // Cek jika ada pesan yang dikutip dan ambil teksnya, jika tidak, ambil dari args atau prompt input
    const esmCode = m.quoted ? m.quoted.text : args.join(' ') || prompt('Mana kode ESM yang ingin dikonversi? ');

    if (!esmCode) {
        return m.reply('Kode ESM Tidak Valid.');
    }

    try {
        const cjsCode = convertToCJS(esmCode);
        m.reply(`//Hasil Kode konversi ke CJS:👇\n\n${cjsCode}`);
    } catch (error) {
        console.error('Error in handler:', error);
        m.reply('Gagal mengkonversi kode. Silakan coba lagi.');
    }
};

const convertToCJS = (esmCode) => {
    // Logika konversi sederhana untuk demonstrasi
    let cjsCode = esmCode.replace(/import\s+(\w+)\s+from\s+['"](.+?)['"]/g, 'const $1 = require(\'$2\');');
    cjsCode = cjsCode.replace(/export\s+default\s+/g, 'module.exports = ');
    return cjsCode;
};

handler.help = ['convertcjs'];
handler.tags = ['tools'];
handler.command = /^(convertcjs|convcjs)$/i;

module.exports = handler;