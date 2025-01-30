let handler = async (m, { conn, text, groupMetadata, command }) => {
  const participants = await conn.groupMetadata(m.chat).then(metadata => metadata.participants);
  let membersIndonesia = [];
  let membersMalaysia = [];
  let membersUSA = [];
  let membersOther = [];

  participants.forEach(participant => {
      const phoneNumber = participant.id.split('@')[0];
      if (phoneNumber.startsWith("62")) {
          membersIndonesia.push(participant.id);
      } else if (phoneNumber.startsWith("60")) {
          membersMalaysia.push(participant.id);
      } else if (phoneNumber.startsWith("1")) {
          membersUSA.push(participant.id);
      } else {
          membersOther.push(participant.id);
      }
  });

  let replyMessage = '';
  if (command === 'semuaasalmember') {
      replyMessage = 
      `
┌─⊷ *ASAL NEGARA*
Jumlah Anggota Grup Berdasarkan Negara:
🇮🇩 • Indonesia: ${membersIndonesia.length}
🇲🇾 • Malaysia: ${membersMalaysia.length}
🇺🇲 • USA: ${membersUSA.length}
🏳️ • Negara Lain: ${membersOther.length}
👥 • Jumlah Semua Member: ${participants.length}
└──────────────
`;
  } else if (!text) {
      replyMessage = "⚠️ Mohon isi dengan kode negara: 62/ 60/ 1/ other";
  } else if (text === '62') {
      replyMessage = `🇮🇩 • Jumlah anggota dari Indonesia: ${membersIndonesia.length}`;
  } else if (text === '60') {
      replyMessage = `🇲🇾 • Jumlah anggota dari Malaysia: ${membersMalaysia.length}`;
  } else if (text === '1') {
      replyMessage = `🇺🇲 • Jumlah anggota dari USA: ${membersUSA.length}`;
  } else if (text === 'other') {
      replyMessage = `🏳️ • Jumlah anggota dari Negara Lain: ${membersOther.length}`;
  } 

  m.reply(replyMessage);
}

handler.tags = ['group'];
handler.help = ['semuaasalmember', 'asalmember 62', 'asalmember 60', 'asalmember 1', 'asalmember other'];
handler.command = ['semuaasalmember', 'asalmember'];
handler.group = true;

module.exports = handler;
