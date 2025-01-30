let handler = async (m, { conn, args, command, usedPrefix }) => {
  
    let who = m.mentionedJid[0]
    let a = m.pushName || "No name"
    let b = await conn.getName(who)
    let Jx = `• @${m.sender.split`@`[0]} ❤️ ${who}
      `
    if (!args[0] && !who) {
      throw `Tag someone\nEx: ${usedPrefix+command} @tag`
    }

    let cupid = ['1','2','3','4','5','6','7','8','9','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24','25','26','27','28','29','30','31','32','33','34','35','36','37','38','39','40','41','42','43','44','45','46','47','48','49','50','51','52','53','54','55','56','57','58','59','60','61','62','63','64','65','66','67','68','69','70','71','72','73','74','75','76','77','78','79','80','81','82','83','84','85','86','87','88','89','90','91','92','93','94','95','96','97','98','99','100']
      let meter = cupid[Math.floor(Math.random() * cupid.length)]
 
try {

if(meter < 10 && meter > 0) {
var quote = `Nihil, bro! Ada beberapa kesamaan kecil, tapi lebih banyak bedanya. Hubungan ini bakal penuh drama dan butuh effort gede`
 }
 if(meter < 20 && meter > 10) {
var quote = `Rendah banget nih. Ada beberapa kesamaan, tapi gak cukup buat nyambung. Bakal sering banget miskom dan butuh sabar ekstra`
 }
 if(meter < 30 && meter > 20) {
var quote = `Cuma sedikit aja cocoknya. Ada beberapa hal yang sama, tapi lebih banyak yang beda. Bakal butuh kerja keras buat bikin hubungan ini lancar`
 }
 if(meter < 40 && meter > 30) {
var quote = `Lumayan sih. Ada balance antara kesamaan dan perbedaan. Hubungan ini bisa berjalan, tapi mesti sering-sering kompromi`
 }
 if(meter < 50 && meter > 40) {
var quote = `Cukup oke. Banyak kesamaan buat bikin fondasi hubungan yang solid, tapi masih ada beberapa beda yang perlu diatasi. Bisa jadi hubungan yang baik dengan komunikasi yang bagus`
 }
 if(meter < 60 && meter > 50) {
var quote = `Mantap nih! Banyak kesamaan dan potensi buat hubungan yang solid. Perbedaan yang ada bisa diatasi dengan ngobrol bareng. Hubungan ini bisa berkembang dengan baik`
 }
 if(meter < 70 && meter > 60) {
var quote = `Super cocok! Banyak kesamaan kuat, dan perbedaan yang ada gampang diatasi. Hubungan ini punya dasar yang bagus buat berkembang jadi lebih dalam dan asik`
 }
 if(meter < 80 && meter > 70) {
var quote = `Gokil! Kalian punya banyak banget kesamaan. Perbedaan cuma sedikit dan gak berarti. Hubungan ini punya potensi kuat buat jadi happy dan memuaskan`
 }
 if(meter < 90 && meter > 80) {
var quote = `Perfect match! Kalian cocok banget di banyak hal. Hubungan ini sangat harmonis dengan sedikit banget perbedaan. Potensi buat kebahagiaan dan kedekatan emosional sangat tinggi`
 }
 if(meter < 100 && meter > 90) {
var quote = `Soulmate vibes! Hampir semuanya nyambung banget. Baik dari nilai, minat, dan tujuan hidup, kalian sejalan. Hubungan ini kuat banget dan punya potensi buat jadi langgeng dan mendalam`
}

} catch (e) {
    console.log(e)
    throw e
} finally {
    await conn.relayMessage(m.chat, {
extendedTextMessage:{
                text: Jx, 
                contextInfo: {
                  mentions: [m.sender, who],
                  mentionedJid: [m.sender, who],
                  forwardedNewsletterMessageInfo: {
                    newsletterName: a + '❤️' + b,
                    },
                     externalAdReply: {
                        title: "CUPID METER",
                        body: a + '❤️' + b,
                        mediaType: 1,
                        previewType: 0,
                        renderLargerThumbnail: true,
                        thumbnailUrl: '',
                        // sourceUrl: fakelink
                    }
                },
}}, {})
}
` ◦ Persentase: *${meter + '%'}* 
       ◦ Pesan: *${quote}*`

}
handler.help = ['cupidmeter <tag>']
handler.tags = ['fun']
// handler.command = /^(cupidmeter)$/i
handler.command = /^(cupidmeter)$/i
handler.group = true

module.exports = handler

function randomInt(min, max) {
return Math.floor(Math.random() * (max - min + 1)) + min;
}