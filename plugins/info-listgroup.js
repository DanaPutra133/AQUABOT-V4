const fs = require('fs');
const path = require('path');

let handler = async (m, { conn, participants }) => {
	let now = new Date() * 1;
	let groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce).map(v => v[0]);
    let txt = '';

    let groupDataFile = path.join(__dirname, 'info-listgroup.json');
    let groupData;
    if (fs.existsSync(groupDataFile)) {
        groupData = JSON.parse(fs.readFileSync(groupDataFile, 'utf-8'));
    } else {
        groupData = {};
    }

    // Remove outdated group data (groups no longer in conn.chats)
    for (let jid in groupData) {
        if (!groups.includes(jid)) {
            delete groupData[jid];
        }
    }

    // Update group data with current groups
    for (let jid of groups) {
        let chat = conn.chats[jid] || {};
        let groupInfo = groupData[jid] || {
            isBanned: false,
            welcome: false,
            antiLink: false,
            delete: true,
        };

        // Dynamically update group settings
        groupInfo.isBanned = chat.metadata?.isBanned || false; // Replace with actual condition
        groupInfo.welcome = chat.metadata?.welcome || false;   // Replace with actual condition
        groupInfo.antiLink = chat.metadata?.antiLink || false; // Replace with actual condition

        groupData[jid] = groupInfo; // Ensure group data is updated
        txt += `${await conn.getName(jid)}\n${jid} [${chat?.metadata?.read_only ? 'Left' : 'Joined'}]\n${groupInfo.expired ? msToDate(groupInfo.expired - now) : '*Tidak Diatur Expired Group*'}
${groupInfo.isBanned ? '✅' : '❌'} _Group Banned_
${groupInfo.welcome ? '✅' : '❌'} _Auto Welcome_
${groupInfo.antiLink ? '✅' : '❌'} _Anti Link_\n\n`;
    }

    m.reply(`List Groups:
Total Group: ${groups.length}

${txt}

`.trim());

    // Save updated group data
    fs.writeFileSync(groupDataFile, JSON.stringify(groupData, null, 2));
}

// Periodically update group data every 1 minute
setInterval(async () => {
    let groups = Object.entries(conn.chats).filter(([jid, chat]) => jid.endsWith('@g.us') && chat.isChats && !chat.metadata?.read_only && !chat.metadata?.announce).map(v => v[0]);
    let groupDataFile = path.join(__dirname, 'info-listgroup.json');
    let groupData = fs.existsSync(groupDataFile) ? JSON.parse(fs.readFileSync(groupDataFile, 'utf-8')) : {};

    // Remove outdated group data (groups no longer in conn.chats)
    for (let jid in groupData) {
        if (!groups.includes(jid)) {
            delete groupData[jid];
        }
    }

    // Update group data with current groups
    for (let jid of groups) {
        let chat = conn.chats[jid] || {};
        let groupInfo = groupData[jid] || {
            isBanned: false,
            welcome: false,
            antiLink: false,
            delete: false,
        };

        // Dynamically update group settings
        groupInfo.isBanned = chat.metadata?.isBanned || false; // Replace with actual condition
        groupInfo.welcome = chat.metadata?.welcome || false;   // Replace with actual condition
        groupInfo.antiLink = chat.metadata?.antiLink || false; // Replace with actual condition

        groupData[jid] = groupInfo;
    }

    // Save updated group data
    fs.writeFileSync(groupDataFile, JSON.stringify(groupData, null, 2));
}, 60000); // 1 minute interval

handler.help = ['grouplist'];
handler.tags = ['group'];
handler.command = /^(group(s|list)|(s|list)group)$/i;

module.exports = handler;

function msToDate(ms) {
  temp = ms
  days = Math.floor(ms / (24 * 60 * 60 * 1000));
  daysms = ms % (24 * 60 * 60 * 1000);
  hours = Math.floor((daysms) / (60 * 60 * 1000));
  hoursms = ms % (60 * 60 * 1000);
  minutes = Math.floor((hoursms) / (60 * 1000));
  minutesms = ms % (60 * 1000);
  sec = Math.floor((minutesms) / (1000));
  return days + " hari " + hours + " jam " + minutes + " menit";
  // +minutes+":"+sec;
}