const { loadWorkplaceDatabase, saveWorkplaceDatabase } = require('./workplace-utils');

const handler = async (message, { text, isOwner }) => {
    if (!isOwner) throw `Hanya owner yang dapat menggunakan fitur ini.`;

    const workplaceDatabase = loadWorkplaceDatabase();
    workplaceDatabase.workplaces = workplaceDatabase.workplaces || {};

    const [workplaceName, employeeName, salary] = text.split('|').map(part => part.trim());
    if (!workplaceName || !employeeName || !salary) {
        throw `Format tidak valid. Contoh: *.input kantor A|nama pegawai|gaji*\n\nContoh penggunaan:\n.input kantor A|azril|140\n\ncek di .list untuk kantor nya!`;
    }
    if (!workplaceDatabase.workplaces[workplaceName]) {
        throw `Tempat kerja *${workplaceName}* tidak ditemukan.`;
    }
    const employees = workplaceDatabase.workplaces[workplaceName];
    employees.push({ name: employeeName, salary: parseFloat(salary) });
    saveWorkplaceDatabase(workplaceDatabase);
    return message.reply(`Berhasil menambahkan *${employeeName}* ke *${workplaceName}*!`);
};

handler.command = /^input$/i;
handler.owner = true;

module.exports = handler;
