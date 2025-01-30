let handler = async (m, { }) => {
  try {
   const apikey = "5b4230898d37219a41f3e5a98d390c96";
    const { PayDisini } = await import("@bolaxdd/paydisini");
    const pd = new PayDisini(apikey);    
    const res1 = await pd.profile()

    let capt = `乂 *P R O F I L E*\n\n`;
        capt += `◦ *Saldo Tersedia* : ${res1.data.saldo}\n`;
        capt += `◦ *Saldo Pending* : ${res1.data.saldo_tertahan}\n`;
        capt += `\n`;     
        
    return m.reply(capt);
  } catch (error) {
    m.reply(error);
    console.error(error);
  }
}

handler.help = ['ceksaldo'];
handler.tags = ['owner'];
handler.owner = true;
handler.command = /^ceksaldo$/i;

module.exports = handler;