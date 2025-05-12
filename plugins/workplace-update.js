const { loadWorkplaceDatabase, saveWorkplaceDatabase } = require('./workplace-utils');

const handler = async (message, { text, isOwner }) => {
    if (!isOwner) throw `Hanya owner yang dapat menggunakan fitur ini.`;

    const workplaceDatabase = loadWorkplaceDatabase();
    workplaceDatabase.workplaces = workplaceDatabase.workplaces || {};

    const [workplaceName, employeeName, salary] = text.split('|').map(part => part.trim());
    if (!workplaceName || !employeeName || !salary) {
        throw `Format tidak valid. Contoh: *.update kantor A|nama pegawai|gaji*\n\nContoh penggunaan:\n.update kantor A|azril|150\n\ncek di .list untuk kantor nya!`;
    }
    if (!workplaceDatabase.workplaces[workplaceName]) {
        throw `Tempat kerja *${workplaceName}* tidak ditemukan.`;
    }
    const employees = workplaceDatabase.workplaces[workplaceName];
    const existingEmployee = employees.find(e => e.name === employeeName);
    if (existingEmployee) {
        existingEmployee.salary = parseFloat(salary);
        saveWorkplaceDatabase(workplaceDatabase);
        return message.reply(`Berhasil memperbarui gaji *${employeeName}* di *${workplaceName}*!`);
    } else {
        throw `Pegawai *${employeeName}* tidak ditemukan di *${workplaceName}*.`;
    }
};

handler.command = /^update$/i;
handler.owner = true;

module.exports = handler;
