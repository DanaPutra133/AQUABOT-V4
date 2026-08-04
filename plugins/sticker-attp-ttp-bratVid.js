import { sticker5 } from '../lib/sticker.js';
import fs from 'fs';
import fetch from 'node-fetch';
import axios from 'axios';

let handler = async (m, { conn, args, text, usedPrefix, command }) => {
    text = text ? text : m.quoted && m.quoted.text ? m.quoted.text : m.quoted && m.quoted.caption ? m.quoted.caption : m.quoted && m.quoted.description ? m.quoted.description : '';
    
    if (!text) throw `Example : ${usedPrefix + command} Lagi Ruwet`;
    
    let res;
    
    try {
        if (command === 'attp') {
            res = `https://api.betabotz.eu.org/api/maker/attp?text=${encodeURIComponent(text.substring(0, 151))}&apikey=${lann}`;
            let fetchResult = await fetch(res);
            let imageBuffer = await fetchResult.buffer();
            
            let stiker = await sticker5(
                imageBuffer,
                null,
                packname,
                author,
                ['🎨']
            );
            
            if (stiker) {
                await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
            } else {
                throw 'Pembuatan stiker gagal';
            }
        } else if (command === 'ttp') {
            res = `https://api.betabotz.eu.org/api/maker/ttp?text=${encodeURIComponent(text.substring(0, 151))}&apikey=${lann}`;
            let fetchResult = await fetch(res);
            let imageBuffer = await fetchResult.buffer();
            
            let stiker = await sticker5(
                imageBuffer,
                null,
                packname,
                author,
                ['🎨']
            );
            
            if (stiker) {
                await conn.sendFile(m.chat, stiker, 'sticker.webp', '', m);
            } else {
                throw 'Pembuatan stiker gagal';
            }
        } else if (command === 'bratvideo') {
            res = `https://api.betabotz.eu.org/api/maker/brat-video?text=${encodeURIComponent(text.substring(0, 151))}&apikey=${lann}`;
            await conn.sendVideoAsSticker(m.chat, res, m, { packname: packname, author: author });
        }
        
    } catch (e) {
        if (e !== false) {
            console.log(e);
            throw e;
        }
    }
}

handler.command = handler.help = ['attp', 'ttp', 'bratvideo'];
handler.tags = ['sticker'];
handler.limit = true;
handler.group = false;

export default handler;