const fetch = require('node-fetch');
const cheerio = require('cheerio');

let handler = async (m, { conn }) => {
  let statistic = await fetch(`https://api.betabotz.eu.org/profile`)
    .then(response => response.text());
  let message = `⚡ statistic: ${statistic}`
m.reply(message)
};

handler.help = ['apikey']
handler.tags = ['info']
handler.customPrefix = /^(apikey)$/i 
handler.command = new RegExp

module.exports = handler;