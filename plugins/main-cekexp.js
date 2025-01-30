let fetch = require('node-fetch')
let handler = async (m, { conn, command, text }) => {
if (command == 'cekexpbtc' )  {
    let api1 = await fetch(`https://api.botcahx.eu.org/api/checkexp?username=${text}`)
    let body = await api1.text()
    m.reply(body)  
  } else if (command == 'cekexplann') 
    {
      let api2 = await fetch(`https://api.betabotz.eu.org/api/checkexp?username=${text}`)
      let body = await api2.text()
      m.reply(body)  
  }
}          
handler.command = handler.help = ['cekexpbtc','cekexplann'];
handler.tags = ['main'];
handler.private = false
module.exports = handler;



// let api2 = await fetch(`https://api.botchax.eu.org/api/checkexp?username=${text}`)


// catch (e) {
//   console.log(e) 
//   m.reply('Username tidak terdaftar!')