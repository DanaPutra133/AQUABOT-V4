global.owner = ['', '', '']  
global.mods = ['', ''] 
global.prems = ['', '']
global.nameowner = 'dana'
global.numberowner = ''
global.mail = 'danaputra1001@gmail.com' 
global.gc = 'https://chat.whatsapp.com/EUKH9asOX4y8DkikAtueEj'
global.instagram = 'https://instagram.com/dana_putra13'
global.wm = 'Aqua Bot'
global.wait = '_*Tunggu sedang di proses...*_'
global.eror = '_*Server Error*_'
global.stiker_wait = '*⫹⫺ Stiker sedang dibuat...*'
global.packname = 'aqua bot'
global.author = '@dana_putra13'
global.maxwarn = '2' // Peringatan maksimum
global.antiporn = true // Auto delete pesan porno (bot harus admin)
global.qris = 'https://cdn.btch.bz/file/fd7714ee03f6970d8fb30.jpg'

//INI WAJIB DI ISI!//
global.lann = '' 
//Daftar terlebih dahulu https://api.betabotz.eu.org

//INI OPTIONAL BOLEH DI ISI BOLEH JUGA ENGGA//
global.btc = ''
//Daftar https://api.botcahx.eu.org
 
global.APIs = {   
  lann: 'https://api.betabotz.eu.org',
  btc: 'https://api.botcahx.eu.org'
}
global.APIKeys = { 
  'https://api.betabotz.eu.org': '', 
  'https://api.botcahx.eu.org': ''
}

let fs = require('fs')
let chalk = require('chalk')
let file = require.resolve(__filename)
fs.watchFile(file, () => {
  fs.unwatchFile(file)
  console.log(chalk.redBright("Update 'config.js'"))
  delete require.cache[file]
  require(file)
})


