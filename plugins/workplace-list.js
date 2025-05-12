const { loadWorkplaceDatabase } = require('./workplace-utils');

const handler = async (message, { isOwner }) => {
    if (!isOwner) throw `Hanya owner yang dapat menggunakan fitur ini.`;

    const workplaceDatabase = loadWorkplaceDatabase();
    workplaceDatabase.workplaces = workplaceDatabase.workplaces || {};

    const workplaceList = Object.entries(workplaceDatabase.workplaces).map(([name, employees]) => {
        const employeeList = employees.map(e => `${e.name} ${e.salary}`).join('\n');
        return `*${name}*\n${employeeList || 'Belum ada pegawai.'}`;
    }).join('\n\n');

    return message.reply(workplaceList || 'Belum ada tempat kerja yang terdaftar.');
};

handler.command = /^list$/i;
handler.owner = true;

module.exports = handler;
