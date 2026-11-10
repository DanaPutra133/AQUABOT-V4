let handler = async (m, { conn, command, text, usedPrefix }) => {
    try {
        let pfx = usedPrefix || '.'
        if (!text) return m.reply(`Masukkan nama yang ingin dicek!\nContoh: *${pfx}${command} Arya*`)

        // Helper acak angka 0-100% aman
        let randomPercent = () => Math.floor(Math.random() * 101)

        let a = randomPercent()
        let b = randomPercent()
        let e = randomPercent()
        let f = randomPercent()
        let g = randomPercent()
        let h = randomPercent()

        let sifatList = ['Baik Hati', 'Sombong', 'Pelit', 'Dermawan', 'Rendah Hati', 'Rendah Diri', 'Pemalu', 'Penakut', 'Pengusil', 'Cengeng']
        let kebiasaanList = ['Rajin', 'Malas', 'Membantu', 'Ngegosip', 'Jail', 'Gak jelas', 'Shoping', 'Chattan sama Doi', 'Chattan di WA karna Jomblo', 'Sedih', 'Kesepian', 'Bahagia']

        let c = pickRandom(sifatList)
        let d = pickRandom(kebiasaanList)

        let cksft = `
*SIFAT ${text.toUpperCase()}* 🔖
│
├─❏ Nama : *${text}*
├─❏ Akhlak Baik : *${a}%*
├─❏ Akhlak Buruk : *${b}%*
├─❏ Orang yang : *${c}*
├─❏ Selalu : *${d}*
├─❏ Kecerdasan : *${e}%*
├─❏ Kenakalan : *${f}%*
├─❏ Keberanian : *${g}%*
└─❏ Ketakutan : *${h}%*
`.trim()

        let msdpnList = [
            `Anda akan menjadi pengusaha sukses, keluarga yang harmonis, memiliki 3 anak, memiliki 2 mobil mewah, dan rumah di kawasan elite.`,
            `Anda akan menjadi orang yang sederhana, keluarga yang sangat harmonis, memiliki sifat ${c}, memiliki 2 anak imut, serta memiliki kendaraan dan rumah sendiri.`,
            `Anda akan menjadi Programmer/Developer handal, memiliki 2 anak, 1 laptop gaming impian, 1 mobil listrik, dan rumah minimalis modern.`,
            `Anda akan menjadi Chef terkenal, memiliki restoran bintang lima, keluarga yang hangat, 2 anak, dan villa cantik di tepi pantai.`,
            `Anda akan menjadi CEO Perusahaan Teknologi, keluarga yang sangat bahagia, memiliki 4 anak, 3 kendaraan mewah, dan penthouse di pusat kota.`,
            `Anda akan menjadi Sultan dermawan, sering berbagi ke masyarakat, keluarga sakinah, 3 anak, dan memiliki peternakan luas.`,
            `Anda akan menjadi Pilot internasional, keliling dunia bersama pasangan, memiliki 2 anak kembar, 1 rumah mewah, dan mobil sport.`,
            `Anda akan menjadi Influencer terkenal, keluarga yang harmonis, memiliki 1 anak, rumah konsep industrial, dan garage mobil antik.`,
            `Anda akan menjadi Dokter hebat yang dicintai pasien, keluarga bahagia, memiliki 3 anak, rumah asri, dan kendaraan keluarga nyaman.`,
            `Anda akan menjadi Pro Player Esports ternama, keluarga yang selalu mendukung, 2 anak lucu, studio gaming mewah, dan rumah impian.`,
            `Anda akan menjadi Arsitek terkenal, merancang rumah sendiri yang megah, keluarga harmonis, 2 anak, dan koleksi mobil klasik.`,
            `Anda akan menjadi pengusaha wirausaha yang berkembang pesat, memiliki 3 anak kembar, rumah luas dengan kolam renang, dan 2 mobil keluarga.`,
            `Anda akan menjadi orang yang hidup tenang dan damai di pedesaan mewah, keluarga yang harmonis, memiliki 2 anak, dan kebun buah yang luas.`,
            `Anda akan menjadi ilmuwan/peneliti hebat, menemukan inovasi baru, keluarga bahagia, 1 anak genius, dan rumah perpustakaan megah.`,
            `Anda akan menjadi musisi/pencipta lagu papan atas, memiliki studio musik pribadi di rumah, keluarga romantis, dan 2 anak berbakat.`,
            `Anda akan menjadi pengusaha properti kaya raya, memiliki puluhan kontrakan, keluarga bahagia, 4 anak, dan rumah istimewa.`,
            `Anda akan menjadi YouTuber/Content Creator jutaan subscriber, keluarga yang seru, memiliki 2 anak, dan rumah studio serba canggih.`,
            `Anda akan menjadi Seniman/Desainer kondang, sering pameran internasional, memiliki 1 anak, rumah galeri seni, dan mobil listrik mewah.`,
            `Anda akan menjadi Atlet nasional berprestasi, mengoleksi banyak medali emas, keluarga yang kompak, 2 anak energik, dan rumah luas.`,
            `Anda akan menjadi pengusaha kedai kopi (Coffee Shop) hits di banyak kota, keluarga harmonis, 3 anak, dan rumah bergaya Scandinavian.`,
            `Anda akan menjadi Pengacara/Avokat sukses, keluarga yang harmonis dan disegani, memiliki 2 anak, rumah mewah, dan 2 mobil dinas.`,
            `Anda akan menjadi pengurus yayasan amal besar, hidup penuh keberkahan, keluarga yang sangat harmonis, 3 anak saleh/salehah, dan rumah sederhana yang asri.`,
            `Anda akan menjadi Traveller/Vlogger keliling dunia, memiliki pasangan hidup yang setia, 2 anak, dan rumah singgah di berbagai negara.`,
            `Anda akan menjadi pengusaha startup unicorn, sukses besar di usia muda, keluarga harmonis, 2 anak, dan penthouse impian.`,
            `Anda akan menjadi Dosen/Akademisi terpandang, ditulis dalam banyak buku sejarah, memiliki 3 anak cerdas, dan rumah penuh dengan buku.`,
            `Anda akan menjadi pemilik jaringan minimarket waralaba, bisnis berjalan otomatis, keluarga sangat bahagia, 2 anak, dan mobil Alphard.`,
            `Anda akan menjadi pengusaha peternakan modern skala ekspor, keluarga bahagia, 4 anak, dan rumah peristirahatan yang megah.`,
            `Anda akan menjadi pengusaha fashion ternama, karya dipakai artis internasional, keluarga bahagia, 2 anak, dan rumah elegan.`,
            `Anda akan menjadi Investor sukses, menikmati passive income setiap hari, keluarga yang sangat harmonis, 3 anak, dan rumah di atas perbukitan.`,
            `Anda akan menjadi sosok yang sangat menginspirasi banyak orang, keluarga hangat dan penuh cinta, memiliki 2 anak kembar, serta rumah impian yang serba lengkap.`
        ]

        let msdpn = pickRandom(msdpnList)

        let cmd = (command || '').toLowerCase()

        if (cmd === 'ceksifat') {
            await m.reply(cksft)
        } else if (cmd === 'masadepannya') {
            await m.reply(`🔮 *RAMALAN MASA DEPAN ${text.toUpperCase()}*\n\n${msdpn}`)
        }

    } catch (e) {
        console.error(e)
        m.reply('Terjadi kesalahan saat memproses ramalan!')
    }
}

handler.help = ['ceksifat <nama>', 'masadepannya <nama>']
handler.tags = ['fun']
handler.command = /^(ceksifat|masadepannya)$/i

export default handler

function pickRandom(list) {
    return list[Math.floor(Math.random() * list.length)]
}