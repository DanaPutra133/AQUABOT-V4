const axios = require ('axios')

async function checkGempa() {
    let chat = global.db.data.chats
    let bot = global.db.data.bots
    let now = new Date().getTime()
    let apiResponse = await axios.get('https://data.bmkg.go.id/DataMKG/TEWS/autogempa.json')
    let gempa = apiResponse.data.Infogempa.gempa
    if (gempa.DateTime !== bot.gempaDateTime) {
        bot.gempaDateTime = gempa.DateTime
        let groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce && !chat.isCommunity && !chat.isCommunityAnnounce && !chat?.metadata?.isCommunity && !chat?.metadata?.isCommunityAnnounce).map(v => v[0])
        for (let number of groups) {
            if (chat[number].notifgempa && gempa.DateTime !== chat[number].gempaDateTime) {
                chat[number].gempaDateTime = gempa.DateTime
                let caption = `
*BMKG Notif Gempa!*

Koordinat: ${gempa.Coordinates}
Magnitude: ${gempa.Magnitude}
Kedalaman: ${gempa.Kedalaman}

_Wilayah: ${gempa.Wilayah}, Potensi: ${gempa.Potensi}_

_Dihimbau untuk warga yang berada di wilayah *${gempa.Dirasakan}* untuk selalu berhati-hati!_
`.trim()
                await conn.sendFile(number, 'https://data.bmkg.go.id/DataMKG/TEWS/' + gempa.Shakemap, 'map.jpg', caption, false)
            }
        }
    }
}

module.exports = {
    checkGempa,
};