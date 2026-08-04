import axios from 'axios';
var handler = async (m, { conn }) => {
  try {
    var response = await axios.get(`https://api.danafxc.my.id/api/proxy/features/gempa?apikey=${dana}`);
    var dataGempa = response.data.data; 
    var caption = `*Informasi Gempa Terkini*\n\n` +
                  `*Tanggal:* ${dataGempa.Tanggal}\n` +
                  `*Jam:* ${dataGempa.Jam}\n` +
                  `*Lintang:* ${dataGempa.Lintang}\n` +
                  `*Bujur:* ${dataGempa.Bujur}\n` +
                  `*Magnitude:* ${dataGempa.Magnitude}\n` +
                  `*Kedalaman:* ${dataGempa.Kedalaman}\n` +
                  `*Wilayah:* ${dataGempa.Wilayah}\n` +
                  `*Potensi:* ${dataGempa.Potensi}\n` +
                  `*Dirasakan:* ${dataGempa.Dirasakan}`;
    conn.sendFile(m.chat, `https://data.bmkg.go.id/DataMKG/TEWS/${dataGempa.Shakemap}`, 'map.jpg', caption, m); // Construct the image URL
  } catch (e) {
    console.log(e);
    throw e;
  }
};
handler.command = handler.help = ['infogempa', 'gempa'];
handler.tags = ['info'];
handler.premium = false;
handler.limit = true;
export default handler;
