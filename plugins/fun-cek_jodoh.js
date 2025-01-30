 let handler = async (m, { text, usedPrefix, command }) => {
   try {
     let result = await jodoh();
     let teks = `- Jodoh \`@${m.quoted ? m.quoted.sender.split("@")[0] : m.sender.split("@")[0]}\` : ${result.ras}\n\n *Warnakulit* : ${result.warnakulit}\n *Warnarambut* : ${result.warnarambut}\n *Penjelasan* : ${result.penjelasan}`;

     if (m.key.fromMe) {
       await m.reply(teks, { edit: m.key, mentions: [m.quoted ? m.quoted.sender : m.sender] });
     } else {
       await m.reply(teks);
     }
   } catch (e) {
     console.error(e);
   }
 };

 handler.command = handler.help = ['cekjodoh','jodohsaya','jodoh'];
 handler.tags = ['fun'];
 handler.limit = true;

 module.exports = handler;

 async function jodoh() {
                 const jodohdia = [
                 { ras: "china", warnakulit: "sawo cerah", warnarambut:"hitam", penjelasan:"kamu akan mendapatkan jodoh dari negeri china, dia memang pintar jadi kamu harus bisa melampaui diri nya agar kamu bisa mendapatkan nya" },
                 { ras: "jawa", warnakulit: "putih", warnarambut:"hitam", penjelasan:"kamu akan mendapatkan jodoh orang jawa yang ulet nan tekun jangan sia siakan dia sulit mendapatkan yang seperti itu" },
                 { ras: "china", warnakulit: "sawo matang", warnarambut:"coklat", penjelasan:"biasa nya yang seperti ini campuran ras, pertahankan dan jangan sia saiakan waktu mu bersama dia" },
                 { ras: "sunda", warnakulit: "sawo matanng", warnarambut:"hitam", penjelasan:"berhati baik, sopan dan juga pemaaf itu lah yang akan kamu dapat kan nanti" },
                 { ras: "Aceh", warnakulit: "sawo matang", warnarambut:"coklat", penjelasan:"jodoh yang kamu dapat ini sangat sholeh dan juga penurut di tambah lagi ahli ibadah" },
                 { ras: "Bali", warnakulit: "sawo cerah", warnarambut:"hitam", penjelasan:"kamu akan mendapatkan jodoh yang ulet dan tuken dari daerah wisata indonesia" },
                 { ras: "Jawa", warnakulit: "sawo matang", warnarambut:"coklat", penjelasan:"pasangan yang kamu dapatkan ini berasal keluarga yang pekerja keras dan pantang menyerah " },
                 { ras: "Jawa", warnakulit: "sawo matang", warnarambut:"hitam", penjelasan:"giat dan rajin jika kamu seperti itu kamu pantas mendapaatkan pasangan ini" },                   
                 ];                
   const jodohindex = Math.floor(Math.random() * jodohdia.length);
   const jodohnya = jodohdia[jodohindex];

   return {
     ras: jodohnya.ras,
     warnakulit: jodohnya.warnakulit,
     warnarambut: jodohnya.warnarambut,
     penjelasan: jodohnya.penjelasan,
   };
 }

