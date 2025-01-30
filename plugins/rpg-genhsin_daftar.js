let handler = async (m, { conn, command, args }) => {
    let user = global.db.data.users[m.sender];

    try {
        if (command === 'createakungenshin') {
            if (user.genshin_account) {
                return m.reply("Anda sudah memiliki akun Genshin. Gunakan perintah *hapusakungenshin* jika ingin menghapus akun lama.");
            }

            if (args.length === 0) {
                return m.reply("Silakan masukkan nama akun Genshin Anda.\nContoh: .createakungenshin Lumine");
            }

            // Menggabungkan semua argumen menjadi satu string (nama akun Genshin)
            let genshinAccountName = args.join(' ');

            // Data akun Genshin
            user.genshin_account = {
                name: genshinAccountName,
                level: 1,
                element: null, // Elemen awal bisa diatur nanti
                primogems: 100, // Primogems awal
            };

            m.reply(`Akun Genshin Anda telah berhasil dibuat.\nNama: ${genshinAccountName}\nLevel: 1\nPrimogems: 100\nElemen: Tidak ditentukan`);
        } else if (command === 'hapusakungenshin') {
            if (!user.genshin_account) {
                return m.reply("Anda belum memiliki akun Genshin. Gunakan perintah *createakungenshin* untuk membuat akun.");
            }

            // Hapus akun Genshin
            delete user.genshin_account;
            m.reply("Akun Genshin Anda telah dihapus dari sistem.");
        } else if (command === 'setelemen') {
            if (!user.genshin_account) {
                return m.reply("Anda belum memiliki akun Genshin. Gunakan perintah *createakungenshin* untuk membuat akun.");
            }

            if (args.length === 0) {
                return m.reply("Silakan masukkan elemen yang diinginkan.\nContoh: .setelemen Pyro");
            }

            let validElements = ['Pyro', 'Hydro', 'Anemo', 'Electro', 'Cryo', 'Geo', 'Dendro'];
            let chosenElement = args[0].charAt(0).toUpperCase() + args[0].slice(1).toLowerCase(); // Capitalize first letter

            if (!validElements.includes(chosenElement)) {
                return m.reply("Elemen tidak valid. Pilih salah satu: " + validElements.join(', '));
            }

            user.genshin_account.element = chosenElement;
            m.reply(`Elemen Anda telah diatur menjadi ${chosenElement}.`);
        } else {
            m.reply("Perintah tidak dikenali.\n\n*Perintah yang tersedia:*\n*.createakungenshin [nama]* - Membuat akun Genshin baru\n*.hapusakungenshin* - Menghapus akun Genshin\n*.setelemen [elemen]* - Mengatur elemen akun Genshin");
        }
    } catch (err) {
        m.reply("Error\n\n" + err.stack);
    }
};

// Metadata
handler.help = ['createakungenshin', 'hapusakungenshin', 'setelemen'];
handler.tags = ['rpg'];
handler.command = /^(createakungenshin|hapusakungenshin|setelemen)$/i; 
handler.register = true;
handler.group = true;
handler.rpg = true;

module.exports = handler;
