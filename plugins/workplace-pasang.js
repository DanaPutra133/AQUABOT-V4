const { loadWorkplaceDatabase, saveWorkplaceDatabase } = require('./workplace-utils');

const handler = async (message, { isOwner, quoted, text }) => {
    if (!isOwner) throw `Hanya owner yang dapat menggunakan fitur ini.`;

    const input = text || (quoted && quoted.text);
    if (!input) {
        throw `Harap masukkan template data.`;
    }

    const workplaceDatabase = loadWorkplaceDatabase();
    workplaceDatabase.workplaces = workplaceDatabase.workplaces || {};

    const template = input.trim();
    const lines = template.split('\n').filter(line => line.trim() !== '');
    let currentWorkplace = null;

    lines.forEach(line => {
        const trimmedLine = line.trim();
        if (/^[A-Z0-9 ]+$/.test(trimmedLine)) {
            // Baris ini adalah nama tempat kerja
            currentWorkplace = trimmedLine;
            workplaceDatabase.workplaces[currentWorkplace] = workplaceDatabase.workplaces[currentWorkplace] || [];
        } else if (currentWorkplace) {
            // Baris ini adalah data pegawai
            const match = trimmedLine.match(/^(.+?)\s+(\d+)$/);
            if (!match) {
                throw `Format tidak valid pada baris: "${line}"`;
            }
            const [, name, salary] = match;
            workplaceDatabase.workplaces[currentWorkplace].push({ name: name.trim(), salary: parseFloat(salary) });
        } else {
            throw `Format tidak valid. Pastikan nama tempat kerja ditulis sebelum daftar pegawai.`;
        }
    });

    saveWorkplaceDatabase(workplaceDatabase);
    return message.reply(`Berhasil menambahkan data dari template!`);
};

handler.command = /^pasang$/i;
handler.owner = true;

module.exports = handler;
