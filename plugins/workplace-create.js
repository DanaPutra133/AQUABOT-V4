const { loadWorkplaceDatabase, saveWorkplaceDatabase } = require('./workplace-utils');

const handler = async (message, { text, isOwner }) => {
    if (!isOwner) throw `Hanya owner yang dapat menggunakan fitur ini.`;

    const workplaceDatabase = loadWorkplaceDatabase();
    workplaceDatabase.workplaces = workplaceDatabase.workplaces || {};

    const workplaceName = text.trim();
    if (!workplaceName) {
        throw `Format tidak valid.\n\nContoh penggunaan:\n.create kantor A`;
    }
    if (workplaceDatabase.workplaces[workplaceName]) {
        throw `Tempat kerja *${workplaceName}* sudah ada.`;
    }
    workplaceDatabase.workplaces[workplaceName] = [];
    saveWorkplaceDatabase(workplaceDatabase);
    return message.reply(`Berhasil membuat tempat kerja *${workplaceName}*!\n\nsilahkan ketik .list untuk melihat daftar kantor kamu!`);
};

handler.command = /^create$/i;
handler.owner = true;

module.exports = handler;
