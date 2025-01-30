const axios = require('axios')
const fetch = require('node-fetch');


let handler = async (m, { conn, text, usedPrefix, command }) => {
  let pnt = await fetch(`https://api.betabotz.eu.org/api/search/pinterest?text1=${text}&apikey=${lann}`);
                  let data = pnt.data;
              for (let res of data.result[0]) {
                  if (res.image) {
                  response.push({
              id: res.id,
              title: res.grid_title || '',
              username: res.pinner?.username || '',
              fullname: res.pinner?.full_name || '',
              follower: res.pinner?.follower_count || 0,
              createAt: res.created_at || `${new Date()}`,
              image: res.image?.orig?.url
          })
      }
  }
    if (!text) throw `Contoh: ${usedPrefix + command} cewe cantik`
    let txt = `Pinterest Searcher\nQuery: ${text}\n\n`
    let id = 1
    for (let i of data){
      txt += `[ ${id} ]\n`
      txt += `• Title: ${i.title}\n`
      txt += `• Username: ${i.username}\n`
      txt += `• Link: ${i.image}\n\n`
      id++
    }
    conn.sendMessage(m.chat, {image:{url: await data[Math.floor(Math.random() * data.length+1)].image}, caption: txt}, {quoted:m})
  }
  
handler.help = ['pinterest <text>']
handler.tags = ['internet']
handler.command = /^(pin1)$/i
handler.limit = true

module.exports = handler



