const { writeFile } = require('fs/promises');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

let handler = async (m, { conn, text }) => {
    if (!m.quoted) return conn.reply(m.chat, 'Balas pesan video dengan perintah ini dan sertakan resolusi yang diinginkan, contoh: .convertreso 720', m);

    // Pemetaan resolusi ke ukuran piksel
    const resolutions = {
        '144': { '4:3': '192x144', '16:9': '256x144', '9:16': '80x144' },
        '240': { '4:3': '320x240', '16:9': '426x240', '9:16': '135x240' },
        '360': { '4:3': '480x360', '16:9': '640x360', '9:16': '202x360' },
        '480': { '4:3': '640x480', '16:9': '854x480', '9:16': '270x480' },
        '576': { '9:16': '576x1024' },
        '720': { '4:3': '960x720', '16:9': '1280x720', '9:16': '405x720' },
        '1080': { '4:3': '1440x1080', '16:9': '1920x1080', '9:16': '607x1080' },
        '1440': { '4:3': '1920x1440', '16:9': '2560x1440', '9:16': '810x1440' },
        '2160': { '4:3': '2880x2160', '16:9': '3840x2160', '9:16': '1215x2160' }
    };

    let resolution = text.trim();
    if (!resolutions[resolution]) {
        return conn.reply(m.chat, 'Resolusi tidak valid! Gunakan salah satu dari: 144, 240, 360, 480, 576, 720, 1080, 1440, 2160', m);
    }

    let mime = m.quoted.mimetype || '';
    if (!/video/.test(mime)) return conn.reply(m.chat, 'Jenis file tidak didukung, harap balas pesan video.', m);

    try {
        let media = await m.quoted.download();
        if (!media) return conn.reply(m.chat, 'Tidak dapat mendownload media', m);

        let fileName = path.join('/tmp', `temp.mp4`);
        await writeFile(fileName, media);

        // Mendapatkan dimensi video asli menggunakan fluent-ffmpeg
        ffmpeg.ffprobe(fileName, (err, metadata) => {
            if (err) return conn.reply(m.chat, `Terjadi kesalahan saat mendapatkan informasi video: ${err.message}`, m);

            const width = metadata.streams[0].width;
            const height = metadata.streams[0].height;
            const aspectRatio = width / height;
            let format = aspectRatio > 1.4 ? (aspectRatio > 1 ? '16:9' : '9:16') : '4:3';

            const outputFileName = path.join('/tmp', `temp_converted_${resolution}p_${format}.mp4`);
            ffmpeg(fileName)
                .videoCodec('libx264')
                .size(resolutions[resolution][format]) // Mengatur resolusi video
                .outputOptions([
                    '-preset', 'slow',
                    '-crf', '18',
                    '-b:v', '0'
                ])
                .on('end', async () => {
                    await conn.sendMessage(m.chat, {
                        video: { url: outputFileName },
                        mimetype: 'video/mp4',
                        fileName: `video_${resolution}p_${format}.mp4`
                    }, { quoted: m });

                    await conn.sendMessage(m.chat, {
                        document: { url: outputFileName },
                        mimetype: 'video/mp4',
                        fileName: `video_${resolution}p_${format}.mp4`
                    }, { quoted: m });
                })
                .on('error', (err) => {
                    console.error('Error processing file:', err);
                    conn.reply(m.chat, `Terjadi kesalahan saat memproses file: ${err.message}`, m);
                })
                .save(outputFileName);
        });
    } catch (e) {
        console.error('Error processing file:', e);
        conn.reply(m.chat, `Terjadi kesalahan saat memproses file: ${e.message}`, m);
    }
};

handler.help = ['convertreso'];
handler.tags = ['tools'];
handler.command = /^(convertreso)$/i;
handler.premium = false;

module.exports = handler;