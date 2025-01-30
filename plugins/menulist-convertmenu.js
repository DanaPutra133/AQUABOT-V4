let handler = async (m, { conn }) => {
let ye = `@${m.sender.split`@`[0]}`
let esce = `┌  ◦ *MENU CONVERT*
│  ◦ .qc
│  ◦ .attp (Ⓛ)
│  ◦ .stikapple (Ⓛ)
│  ◦ .stikkddi (Ⓛ)
│  ◦ .stikgoogle (Ⓛ)
│  ◦ .stikdocomo (Ⓛ)
│  ◦ .stiksoftbank (Ⓛ)
│  ◦ .stikhtc (Ⓛ)
│  ◦ .stikmozilla (Ⓛ)
│  ◦ .stiklg (Ⓛ)
│  ◦ .stikopenmoji (Ⓛ)
│  ◦ .stikemojipedia (Ⓛ)
│  ◦ .stikjoypixels (Ⓛ)
│  ◦ .stikopenmoji (Ⓛ)
│  ◦ .stikfacebook (Ⓛ)
│  ◦ .stikskype (Ⓛ)
│  ◦ .stikwhatsapp (Ⓛ)
│  ◦ .stiktwitter (Ⓛ)
│  ◦ .stiksamsung (Ⓛ)
│  ◦ .stikmicrosoft (Ⓛ)
│  ◦ .emojimix (Ⓛ)
│  ◦ .getexif
│  ◦ .tovideo
│  ◦ .togif
│  ◦ .tovid
│  ◦ .toimg (reply)
│  ◦ .dinokuning (Ⓛ)
│  ◦ .patrick (Ⓛ)
│  ◦ .spongebob (Ⓛ)
│  ◦ .doge (Ⓛ)
│  ◦ .manusialidi (Ⓛ)
│  ◦ .sdino (Ⓛ)
│  ◦ .spatrick (Ⓛ)
│  ◦ .sspongebob (Ⓛ)
│  ◦ .sdoge (Ⓛ)
│  ◦ .smanusialidi (Ⓛ)
│  ◦ .stickermeme <teks>|<teks>
│  ◦ .smim <teks atas>|<teks bawah> (Ⓛ)
│  ◦ .sticker
│  ◦ .wm
│  ◦ .watermark
│  ◦ .aistiker <prompt> (Ⓛ)
│  ◦ .tourl <reply image> (Ⓛ)
└  
`
m.reply(esce)
}
handler.command = /^(convertmenu)$/i
handler.group = true

module.exports = handler