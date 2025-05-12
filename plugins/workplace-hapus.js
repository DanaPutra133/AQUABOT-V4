const { loadWorkplaceDatabase, saveWorkplaceDatabase } = require('./workplace-utils');

const handler = async (message, { text, isOwner }) => {
    if (!isOwner) throw `Hanya owner yang dapat menggunakan fitur ini.`;

    const workplaceDatabase = loadWorkplaceDatabase();
    workplaceDatabase.workplaces = workplaceDatabase.workplaces || {};

    if (text === 'all') {
        workplaceDatabase.workplaces = {}; // Clear all workplaces and employees
        saveWorkplaceDatabase(workplaceDatabase);
        return message.reply(`Berhasil menghapus semua tempat kerja dan pegawai!`);
    }

    if (!text) {
        const workplaceList = Object.entries(workplaceDatabase.workplaces).map(([name, employees]) => {
            const employeeList = employees.map(e => `${e.name}`).join(', ');
            return `*${name}*\nPegawai: ${employeeList || 'Belum ada pegawai.'}`;
        }).join('\n\n');
        return message.reply(`Daftar tempat kerja:\n\n${workplaceList || 'Belum ada tempat kerja yang terdaftar.'}\n\nContoh penggunaan:\n.hapus kantor A <- Menghapus kantor beserta pegawainya\n\n.hapus kantor A|nama pegawai <- Menghapus pegawai dari kantor\n\n.hapus all <- Menghapus semua kantor dan pegawai`);
    }

    const [workplaceName, employeeName] = text.split('|').map(part => part.trim());

    if (!employeeName) {
        if (workplaceDatabase.workplaces[workplaceName]) {
            delete workplaceDatabase.workplaces[workplaceName];
            saveWorkplaceDatabase(workplaceDatabase);
            return message.reply(`Berhasil menghapus tempat kerja *${workplaceName}* beserta semua pegawainya!`);
        } else {
            throw `Tempat kerja *${workplaceName}* tidak ditemukan.`;
        }
    } else {
        if (!workplaceDatabase.workplaces[workplaceName]) {
            throw `Tempat kerja *${workplaceName}* tidak ditemukan.`;
        }
        const employees = workplaceDatabase.workplaces[workplaceName];
        const employeeIndex = employees.findIndex(e => e.name === employeeName);
        if (employeeIndex !== -1) {
            employees.splice(employeeIndex, 1);
            saveWorkplaceDatabase(workplaceDatabase);
            return message.reply(`Berhasil menghapus pegawai *${employeeName}* dari tempat kerja *${workplaceName}*!`);
        } else {
            throw `Pegawai *${employeeName}* tidak ditemukan di tempat kerja *${workplaceName}*.`;
        }
    }
};

handler.command = /^hapus$/i;
handler.owner = true;

module.exports = handler;
