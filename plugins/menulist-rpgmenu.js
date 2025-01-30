let handler = async (m, { conn }) => {
let ye = `@${m.sender.split`@`[0]}`
let esce = `
┃──⊏[ *RPG Games* ]⊐──
│
┃⌕ .adventure *(Ⓛ)*
┃⌕ .airdrop
┃⌕ .attacktitan *(Ⓛ)*
┃⌕ .atm *<amount>* *(Ⓛ)*
┃⌕ .atmall *(Ⓛ)*
┃⌕ .pull *<amount>* *(Ⓛ)*
┃⌕ .pullall *(Ⓛ)*
┃⌕ .Bank
┃⌕ .korupsi
┃⌕ .battlepet
┃⌕ .bebaskan
┃⌕ .berburu
┃⌕ .berdagang *@tag*
┃⌕ .berkebon *(Ⓛ)*
┃⌕ .berlatih <atribut> *(Ⓛ)*
┃⌕ .berpetualang *(Ⓛ)*
┃⌕ .bertarung *@user*
┃⌕ .fight *@user*
┃⌕ .judipvp <type> <count> <tag>
┃⌕ .bonus  *(Ⓟ)*
┃⌕ .buah
┃⌕ .buyattack <jumlah>
┃⌕ .buydefense <jumlah>
┃⌕ .buyspeed <jumlah>
┃⌕ .buystrenght <jumlah>
┃⌕ .casino <jumlah> *(Ⓛ)*
┃⌕ .cekpoin
┃⌕ .checkjail
┃⌕ .cj
┃⌕ .statuspenjara
┃⌕ .jailstatus
┃⌕ .coinflip
┃⌕ .copet
┃⌕ .craft
┃⌕ .blacksmith
┃⌕ .dailymisi *(Ⓛ)*
┃⌕ .dokter
┃⌕ .dokter cari
┃⌕ .dokter status
┃⌕ .dokter item <item>
┃⌕ .dokter leaderboard
┃⌕ .dokter stop
┃⌕ .dungeon *[nama room]*
┃⌕ .feed
┃⌕ .gajian
┃⌕ .gunshop
┃⌕ .heal *jumlah* *(Ⓛ)*
┃⌕ .hitman
┃⌕ .hunter *(Ⓛ)*
┃⌕ .inventory *@user*
┃⌕ .job
┃⌕ .jobkerja *(Ⓛ)*
┃⌕ .judi
┃⌕ .kandang
┃⌕ .karung
┃⌕ .kencan
┃⌕ .kerja
┃⌕ .kill
┃⌕ .koboy
┃⌕ .kolam
┃⌕ .lamarkerja
┃⌕ .eat
┃⌕ .makan
┃⌕ .maling
┃⌕ .mancing
┃⌕ .masak <masakan> <args>
┃⌕ .cook <masakan> <args>
┃⌕ .membunuh *@user* *(Ⓛ)*
┃⌕ .merampok *@user* *(Ⓛ)*
┃⌕ .moneytopoin *<amount>* *(Ⓛ)*
┃⌕ .mulung *(Ⓛ)*
┃⌕ .nambang *(Ⓛ)*
┃⌕ .mengaji
┃⌕ .ngaji
┃⌕ .ngentot
┃⌕ .ngepet  *(Ⓟ)*
┃⌕ .ngewe
┃⌕ .ojek
┃⌕ .sawer
┃⌕ .openbo
┃⌕ .open <crate>
┃⌕ .ewe-paksa @tag  *(Ⓟ)*
┃⌕ .pasar *<sell>|<args>*
┃⌕ .penjara
┃⌕ .petshop
┃⌕ .pointomoney *(Ⓛ)*
┃⌕ .polisi
┃⌕ .polisi cari
┃⌕ .polisi status
┃⌕ .polisi item <item>
┃⌕ .polisi leaderboard
┃⌕ .polisi stop
┃⌕ .repair
┃⌕ .perbaiki
┃⌕ .resto *<beli> <args>*
┃⌕ .selectskill <type>
┃⌕ .shop <sell|buy> <args> *(Ⓛ)*
┃⌕ .tambang
┃⌕ .trading
┃⌕ .uptool



┃──⊏[ *RPG Absen* ]⊐──
│
┃⌕ .hourly *(Ⓛ)*
┃⌕ .monthly *(Ⓛ)*
┃⌕ .weekly *(Ⓛ)*
┃⌕ .yearly *(Ⓛ)*



┃──⊏[ *RPG Guild* ]⊐──
│
┃⌕ .guildaccept @user
┃⌕ .guildinviteacc <@user>
┃⌕ .attackguild
┃⌕ .createguild <nama_guild>
┃⌕ .dailyg
┃⌕ .guilddecline
┃⌕ .delguild <nomor_guild>
┃⌕ .guilddemote <@user>
┃⌕ .guildinfo [@user]
┃⌕ .guildinfoacc <@user>
┃⌕ .guildinvite <@user>
┃⌕ .joinguild <nomor_guild>
┃⌕ .guildleave
┃⌕ .guildlist
┃⌕ .guildlistacc
┃⌕ .myguild
┃⌕ .guildpromote <@user>
┃⌕ .guildstaff <tambah/hapus> <@user>
┃⌕ .tutorguild
┃⌕ .guildwar <nama_guild>
┃⌕ .guildwaracc <nama_guild>
┃⌕ .guildwarpause
┃⌕ .guild

`
m.reply(esce)
}
handler.command = /^(rpgmenu)$/i
handler.group = true
handler.rpg = true

module.exports = handler