const fs = require('fs');
const path = require('path');

const sendDatabaseToGroup = async (conn, groupJid) => {
    try {
        const filePath = path.resolve('./database.json');
        if (!fs.existsSync(filePath)) {
            console.error('File database.json tidak ditemukan!');
            return;
        }

        const fileBuffer = fs.readFileSync(filePath);
        await conn.sendMessage(
            groupJid,
            {
                document: fileBuffer,
                mimetype: 'application/json',
                fileName: 'database.json',
            }
        );
        console.log(`Database berhasil dikirim ke grup: ${groupJid}`);
    } catch (err) {
        console.error('Error saat mengirim file database:', err);
    }
};

const scheduleSendDatabase = (conn, groupJid, hour, minute) => {
    const calculateTimeUntilNextSchedule = () => {
        const now = new Date();
        const nextSchedule = new Date();

        nextSchedule.setHours(hour, minute, 0, 0); // Set jam dan menit ke waktu input
        if (nextSchedule <= now) {
            nextSchedule.setDate(nextSchedule.getDate() + 1); // Tambahkan 1 hari jika waktu input sudah lewat
        }

        return nextSchedule - now; // Selisih waktu dalam milidetik
    };

    const sendDatabaseAndScheduleNext = () => {
        console.log(`Mengirim database pada jam ${hour}:${minute}`);
        sendDatabaseToGroup(conn, groupJid)
            .then(() => {
                console.log('Database berhasil dikirim!');
            })
            .catch((err) => {
                console.error('Terjadi kesalahan saat mengirim database:', err);
            });

        // Jadwalkan pengiriman berikutnya
        setTimeout(sendDatabaseAndScheduleNext, 24 * 60 * 60 * 1000); // 24 jam
    };

    const initialDelay = calculateTimeUntilNextSchedule();
    console.log(`Database akan dikirim dalam ${Math.ceil(initialDelay / 1000)} detik.`);
    setTimeout(sendDatabaseAndScheduleNext, initialDelay);
};

const groupJid = '120363216901617825@g.us'; // isi dengan id grup
const hour = 7; // Jam yang diinput user
const minute = 34; // Menit yang diinput user

if (global.conn) {
    scheduleSendDatabase(global.conn, groupJid, hour, minute);
} else {
    console.error('Koneksi ke grup belum ada!');
}

module.exports = {};