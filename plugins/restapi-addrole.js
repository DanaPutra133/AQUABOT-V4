let fetch = require('node-fetch');

const betaweb = 'https://api.betabotz.eu.org';

let handler = async(m, {
    text, command
}) => {
    if (!text) throw `Usage Example \nUsername, Custom Key, No, Expired, Limit`;

    let[p1, p2, p3, p4, p5] = text.split(',');
    let f, type, limit;
    const splitreplace = (phoneNumber) => {
        return phoneNumber.replace(/[-+()\s]/g, '');
    };

    if (command === 'btcheap1') {
        type = 'premium';
        limit = p5 || '3000';
    }
    if (command === 'btcheap2') {
        type = 'premium';
        limit = p5 || '4000';
    }
    if (command === 'btprem') {
        type = 'premium';
        limit = p5 || '5000';
    } else if (command === 'btvip') {
        type = 'vip';
        limit = p5 || '10000';
    } else if (command === 'btvvip') {
        type = 'vvip';
        limit = p5 || '15000';
    } else if (command === 'btsupreme') {
        type = 'supreme';
        limit = p5 || '30000';
    } else if (command === 'btlord') {
        type = 'lord';
        limit = p5 || '99999999999999999999999999999999999999999999';
    } else {
        throw 'Invalid command';
    }

    const rankey = `beta-${p1}`;
    var exp = p4 || '31d';
    const customKey = p2.toLowerCase() === 'rankey' ? rankey : p2;
    let url;

    if (type === 'lord') {
        url = `${betaweb}/addlord-json?username=${p1}&customKey=${customKey}&token=Erlanganz&type=${type}&limit=${limit}`;
    } else {
        url = `${betaweb}/addrole-json?username=${p1}&expired=${exp}&customKey=${customKey}&token=Erlanganz&type=${type}&limit=${limit}`;
    }

    f = await fetch(url);
    let p = await f.json();

    if (p.result === "Username Tidak Terdaftar") {
        m.reply(p.result);
    } else {
        p3 = splitreplace(p3);

        let caption;
        if (type === 'lord') {
            caption = `✨ Successfully added the ${type} role! ✨\n\nUsername: ${p1}\nNew Apikey: ${customKey}\nLimit: ${limit}\nExpired: Special Admin No Expired\nNumber: ${p3}\n\nDon't forget to change your apikey in your profile 🤠\n\nThank you for purchasing the ${type} role on BetaBotz Api\nEnjoy the benefits of the ${type} role at our Rest API 🤝`;
        } else {
            caption = `✨ Successfully added the ${type} role! ✨\n\nUsername: ${p1}\nNew Apikey: ${customKey}\nLimit: ${limit}\nExpired: ${exp}\nNumber: ${p3}\n\nDon't forget to change your apikey in your profile 🤠\n\nThank you for purchasing the ${type} role on BetaBotz Api\nEnjoy the benefits of the ${type} role at our Rest API 🤝`;
        }
        m.reply(p.result);
        await conn.sendMessage(p3 + '@s.whatsapp.net', {
            text: caption,
            contextInfo: {
                externalAdReply: {
                    showAdAttribution: true,
                    title: 'Buy Role in BetaBotz-API 🚀',
                    body: '',
                    thumbnailUrl: 'https://telegra.ph/file/ec75e8bd53238f11603d9.jpg',
                    sourceUrl: 'https://api.betabotz.org',
                    mediaType: 1,
                    renderLargerThumbnail: true
                }
            },
            quoted: null
        });
    }
};

handler.command = handler.help = ['btcheap1', 'btcheap2', 'btprem', 'btvip', 'btvvip', 'btsupreme', 'btlord'];
handler.tags = ['restapi'];
handler.premium = false;
handler.group = false;
handler.owner = true;

module.exports = handler;