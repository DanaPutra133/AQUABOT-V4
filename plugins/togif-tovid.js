const fs = require('fs');
const { exec } = require('child_process');

const handler = async (m, { conn }) => {
    if (m.quoted && /sticker/.test(m.quoted.mtype) && !m.quoted.isAnimated) {
        let img = await m.quoted.download();
        await conn.sendMessage(m.chat, { image: img, jpegThumbnail: img }, { quoted: m });
    } else if (m.quoted && /sticker/.test(m.quoted.mtype) && m.quoted.isAnimated) {
        let img = await m.quoted.download();
        let out = await webpToVideo(img);
        await conn.sendMessage(m.chat, { video: out, gifPlayback: /gif/i.test(m.text), gifAttribution: Math.random() < 0.5 ? 1 : 0 }, { quoted: m });
    } else {
        throw 'Reply a sticker!';
    }
};

handler.help = ['togif', 'tovideo'];
handler.tags = ['tools'];
handler.command = /^(to(gif|video|vid))$/i;
handler.limit = true;
handler.register = false;

module.exports = handler;

function webpToVideo(bufferImage) {
    return new Promise((resolve, reject) => {
        try {
            const pathFile = "./tmp/" + Math.floor(Math.random() * 1000000 + 1) + ".webp";
            fs.writeFileSync(pathFile, bufferImage);

            exec(`convert ${pathFile} ${pathFile}.gif`, (error, stdout, stderr) => {
                if (error) {
                    reject('Failed to convert webp to gif: ' + stderr);
                    fs.unlinkSync(pathFile);
                    return;
                }

                exec(`ffmpeg -i ${pathFile}.gif -movflags faststart -pix_fmt yuv420p -vf "scale=trunc(iw/2)*2:trunc(ih/2)*2" ${pathFile}.mp4`, (error, stdout, stderr) => {
                    if (error || !fs.existsSync(pathFile + ".gif") || !fs.existsSync(pathFile + ".mp4")) {
                        reject('Failed to convert gif to video: ' + stderr);
                        fs.unlinkSync(pathFile);
                        return;
                    }

                    const videoBuffer = fs.readFileSync(pathFile + ".mp4");
                    fs.unlinkSync(pathFile);
                    fs.unlinkSync(pathFile + ".gif");
                    fs.unlinkSync(pathFile + ".mp4");

                    resolve(videoBuffer);
                });
            });
        } catch (e) {
            reject(e);
        }
    });
}