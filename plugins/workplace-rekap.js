const { loadWorkplaceDatabase, saveWorkplaceDatabase } = require('./workplace-utils');

const handler = async (message, { text, isOwner }) => {
    if (!isOwner) throw `Hanya owner yang dapat menggunakan fitur ini.`;

    const workplaceDatabase = loadWorkplaceDatabase();
    workplaceDatabase.workplaces = workplaceDatabase.workplaces || {};

    if (!text) {
        const workplaceList = Object.keys(workplaceDatabase.workplaces).join('\n');
        return message.reply(`Harap masukan nama tempat kerja!\n\nDaftar tempat kerja:\n\n${workplaceList || 'Belum ada tempat kerja yang terdaftar.'}`);
    }

    const workplaceName = text.trim();
    if (!workplaceDatabase.workplaces[workplaceName]) {
        throw `Tempat kerja *${workplaceName}* tidak ditemukan.`;
    }

    const employees = workplaceDatabase.workplaces[workplaceName];
    if (!employees.length) {
        throw `Belum ada pegawai di sini!`;
    }

    employees.forEach(employee => {
        employee.salary = parseFloat((employee.salary * 0.95).toFixed(2));
    });
    saveWorkplaceDatabase(workplaceDatabase);

    const updatedSalaries = employees.map(e => `${e.name} ${e.salary}`).join('\n');
    return message.reply(`Berhasil melakukan rekapitulasi untuk *${workplaceName}*. Gaji semua pegawai telah dikurangi 5%.\n\n*${workplaceName}*\n${updatedSalaries}`);
};

handler.command = /^rekap$/i;
handler.owner = true;

module.exports = handler;
