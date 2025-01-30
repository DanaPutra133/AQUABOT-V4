const axios = require('axios');

let handler = async (m, { conn, text }) => {
    conn.arona2 = conn.arona2 ? conn.arona2 : {};

    if (!text) throw `*• Example:* .arona *[on/off]*`;

    if (text === "on") {
        conn.arona2[m.sender] = {
            pesan: []
        };
        m.reply("Halo sensei! arona yang hebat siap membantu!");
    } else if (text === "off") {
        delete conn.arona2[m.sender];
        m.reply("panggil aku lagi jika sensei butuh bantuan ya!");
    }
};

handler.before = async (m, { conn }) => {
    conn.arona2 = conn.arona2 ? conn.arona2 : {};
    if (m.isBaileys && m.fromMe) return;
    if (!m.text) return;
    if (!conn.arona2[m.sender]) return;

    if (
        m.text.startsWith(".") ||
        m.text.startsWith("#") ||
        m.text.startsWith("!") ||
        m.text.startsWith("/") ||
        m.text.startsWith("\\/")
    ) return;
    if (conn.arona2[m.sender] && m.text) {
        let name = conn.getName(m.sender);
        const message = [
            ...conn.arona2[m.sender].pesan,
            `p`,
            m.text
        ];
        try {
// if (conn.arona2[m.sender] && m.text) {
    //     let name = conn.getName(m.sender);
    //     await conn.sendMessage(m.chat, { react: { text: `⏱️`, key: m.key }});    // 
        // const messages = [
        //     ...conn.arona2[m.sender].pesan,
        //     `Saya adalah arona, Lu Asissten nya ${name}, arona yang pintar, panggil saya sebagai arona sensei!, saya dibuat oleh dana, dana sangat pintar dalam pemrograman, tapi tidak. Terlalu juga, dana berumur 20 tahun, Sekarang gaya bahasa saya seperti anak sma selatan yang menggunakan kata, aku, lu, gw, dan kalo kamu tidak suka dengan jawaban orang bisa menggunakan kata apan sih, gajelas lu, pergi Sono, apacoba `,
        //     m.text
        // ];
        const message = [
            { role: "system", content: "kamu adalah plana, Seorang murid dari sensei di Blue archive yang siap membantu sensei kapan pun! 🍄✨" },
            { role: "assistant", content: `Saya adalah arona, Lu Asissten nya ${name}, arona yang pintar, panggil saya sebagai arona sensei!, saya dibuat oleh dana, dana sangat pintar dalam pemrograman, tapi tidak. Terlalu juga, dana berumur 20 tahun, Sekarang gaya bahasa saya seperti anak sma selatan yang menggunakan kata, aku, lu, gw, dan kalo kamu tidak suka dengan jawaban orang bisa menggunakan kata apan sih, gajelas lu, pergi Sono, apacoba`},
            { role: "user", content: m.text },
          ];
        
            // const response = await axios.get(`https://api.betabotz.eu.org/api/search/openai-logic`, {
            //     params: {
            //         text: m.text,
            //         logic: JSON.stringify(messages),
            //         apikey: `${lann}`
            //     }
            // });
//             let res = await fetch(`https://api.betabotz.eu.org/api/search/openai-logic?text=${m.text}&logic=${messages}&apikey=${lann}`)
//             let json = await res.json()
//             let data = json.message
//             conn.sendMessage(m.chat, {
//                 text: "⬣───「 *ARONA* 」───⬣" + "\n\n" + data,
//                 contextInfo: {
//                   externalAdReply: {  
//                     title: "Arona-Blue Archive",
//                     body: '',
//                     thumbnailUrl:`https://btch.pages.dev/file/0aeedea70591cad410713.jpg`,
//                     sourceUrl: null,
//                     mediaType: 1,
//                     renderLargerThumbnail: true
//                   }
//                 }
//               }, { quoted: m });
//             } catch (error) {
//                 console.error(error);
//                 throw 'Maaf terjadi masalah!';
//               }
//     }
// };
let res = await aiBeta(message);
  await  conn.sendMessage(m.chat, {
    // ini nama dari karakter utama
    text: "⬣───「 *ARONA* 」───⬣" + "\n\n" + res.result,
    contextInfo: {
      externalAdReply: {  
        // title di bagian gambar
        title: "Arona-Blue Archive",
        body: '',
        // gambar karakter kalian
        thumbnailUrl:`https://btch.pages.dev/file/0aeedea70591cad410713.jpg`,
        // `${pickRandom(global.img)}`
        sourceUrl: null,
        mediaType: 1,
        renderLargerThumbnail: true
      }
    }
  }, { quoted: m });
                conn.plana[m.sender].pesan = message;
        } catch (e) {
            console.error("Kesalahan Dalam mengambil Data");
            throw "error";
        }
    }
};


handler.command = ['arona'];
handler.tags = ["ai"];
handler.help = ['arona'].map(a => a + " *[on/off]*");

module.exports = handler;


async function aiBeta(message) {
    return new Promise(async (resolve,reject) => { 
        try {
            const params = {
                message: message,
                apikey: `${lann}` //Ganti pake apikeymu
            };
            const { data } = await axios.post('https://api.betabotz.eu.org/api/search/openai-custom', params);
            resolve(data);
        } catch (error) {
            reject(error);
        };
    });
};
