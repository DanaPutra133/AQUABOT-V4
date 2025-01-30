
//gh DanaPutra133 jangan lupa bintang nya :D
let handler = async (m, { conn, text, command, usedPrefix }) => {
    //bikin variabel buat nampung jadwal
    let q = `'
Jadwal kuliah Gw

Senin
Ruang : L-206
1. _*8:00 - 10:00*_
> Agama
2. _*09:40 - 12:10*_
> Pengantar Teknologi Informasi
3. _*12:10 - 14:40*_
> Algoritma Dan Pemrograman 
4. _*14:40 - 17:10 [ L-203 ]*_
> Statistika Dan Probabilitas

Selasa [ M-104 ]
1. _*8:00 - 09:40*_
> Pancasila
2. _*09:40 - 11:20*_ 
> Aljabar
3. _*11:20 - 13:50*_
> Organisasi Komputer 
4. _*13:50 - 15:30*_
> Komputer Dan Masyarakat
    `
    //di print di pesan
    conn.reply(m.chat, q, m);
}



handler.help = ['jadwalkuliah'];
handler.tags = ['group'];
handler.command = ['jadwalkuliah'];

module.exports = handler;