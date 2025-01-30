let handler = async (m, { conn }) => {
let ye = `@${m.sender.split`@`[0]}`
let esce = `┌  ◦ *MENU PRIMBON*
│  ◦ .arahrejeki
│  ◦ .artitarot
│  ◦ .artimimpi
│  ◦ .artinama
│  ◦ .cekpenyakit
│  ◦ .harinaas
│  ◦ .harisangar
│  ◦ .kecocokannama
│  ◦ .kecocokanpasangan
│  ◦ .nomerhoki nomor?
│  ◦ .pekerjaanwetonlahir
│  ◦ .potensikeberuntungan
│  ◦ .nagahari
│  ◦ .ramalancinta
│  ◦ .ramalanjodoh
│  ◦ .ramalankeberuntungan
│  ◦ .suamiistri
│  ◦ .rejekiweton
│  ◦ .sifatkarakter
│  ◦ .tanggaljadianpernikahan
│  ◦ .wetonjawa
└  
`
m.reply(esce)
}
handler.command = /^(primbonmenu)$/i
handler.group = true

module.exports = handler