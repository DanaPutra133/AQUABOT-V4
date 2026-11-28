import { createHash } from 'node:crypto';
import { downloadMediaMessage } from 'zapo-js';
import uploadFile from '../lib/uploadFile.js';
import axios from 'axios';
import { stickerToMp4 } from '../lib/sticker-convert.js?v=6';
import { proto } from '../lib/simple.js';
import { addExif } from '../lib/sticker.js';

const WEBP_MIME = 'image/webp';
const OPUS_MIME = 'audio/ogg; codecs=opus';
const CACHE_TTL = 60 * 60 * 1000;
const soundStickerCache = global._zapoSoundStickerCache || (global._zapoSoundStickerCache = new Map());

function saveSoundCache(sent, webpBytes, stickerObj, audioInfo) {
  const now = Date.now();
  for (const [k, v] of soundStickerCache) {
    if (now - v.ts > CACHE_TTL) soundStickerCache.delete(k);
  }

  const msgId = sent?.id || sent?.key?.id || sent?.messageId;
  if (msgId) soundStickerCache.set(`id:${msgId}`, { audioInfo, ts: now });

  if (webpBytes?.length) {
    const sha = createHash('sha256').update(webpBytes).digest('base64');
    soundStickerCache.set(`sha:${sha}`, { audioInfo, ts: now });
  }

  if (stickerObj?.fileSha256) {
    const rawSha = typeof stickerObj.fileSha256 === 'string'
      ? Buffer.from(stickerObj.fileSha256, 'base64')
      : Buffer.from(stickerObj.fileSha256);
    if (rawSha.length) {
      soundStickerCache.set(`sha:${rawSha.toString('base64')}`, { audioInfo, ts: now });
    }
  }
}

function getSoundFromCache(q, m, webpBytes) {
  const ids = [
    q?.id,
    q?.key?.id,
    m?.quoted?.id,
    m?.quoted?.key?.id,
    m?.msg?.contextInfo?.stanzaId
  ].filter(Boolean);

  for (const id of ids) {
    const hit = soundStickerCache.get(`id:${id}`);
    if (hit?.audioInfo) return hit.audioInfo;
  }

  if (webpBytes?.length) {
    const sha = createHash('sha256').update(webpBytes).digest('base64');
    const hit = soundStickerCache.get(`sha:${sha}`);
    if (hit?.audioInfo) return hit.audioInfo;
  }

  return null;
}

function varint(value) {
  const bytes = [];
  let rest = value;
  do {
    const chunk = rest & 0x7f;
    rest = Math.floor(rest / 128);
    bytes.push(rest ? chunk | 0x80 : chunk);
  } while (rest);
  return bytes;
}

function lengthDelimited(id, payload) {
  return Uint8Array.from([...varint((id << 3) | 2), ...varint(payload.length), ...payload]);
}

function readVarint(buf, offset = 0) {
  let value = 0;
  let shift = 0;
  let pos = offset;
  while (pos < buf.length) {
    const byte = buf[pos++];
    value += (byte & 0x7f) * Math.pow(2, shift);
    if ((byte & 0x80) === 0) return { value, nextOffset: pos };
    shift += 7;
    if (shift > 49) break;
  }
  return null;
}

function extractFieldFromUnknowns(unknowns, targetFieldId) {
  if (!Array.isArray(unknowns)) return null;

  for (const entry of unknowns) {
    if (!entry) continue;

    if (typeof entry === 'object' && !ArrayBuffer.isView(entry) && !Array.isArray(entry)) {
      const fId = Number(entry.fieldNo ?? entry.fieldNumber ?? entry.field ?? entry.id ?? entry.number ?? 0);
      const rawData = entry.data ?? entry.value ?? entry.bytes;
      if (fId === targetFieldId && rawData) {
        return Uint8Array.from(rawData);
      }
    }

    if (ArrayBuffer.isView(entry) || Array.isArray(entry)) {
      const bytes = Uint8Array.from(entry);
      const tagInfo = readVarint(bytes, 0);
      if (!tagInfo) continue;

      const fieldId = Math.floor(tagInfo.value / 8);
      const wireType = tagInfo.value & 0x07;
      if (fieldId === targetFieldId && wireType === 2) {
        const lenInfo = readVarint(bytes, tagInfo.nextOffset);
        if (lenInfo && lenInfo.nextOffset + lenInfo.value <= bytes.length) {
          return bytes.subarray(lenInfo.nextOffset, lenInfo.nextOffset + lenInfo.value);
        }
      }
    }
  }
  return null;
}

function unwrapContainer(raw) {
  let cur = raw;
  for (let i = 0; i < 8 && cur && typeof cur === 'object'; i++) {
    const fpBytes = extractFieldFromUnknowns(cur.$unknowns || cur.unknownFields, 134);
    if (fpBytes && proto?.Message?.FutureProofMessage) {
      try {
        const fp = proto.Message.FutureProofMessage.decode(fpBytes);
        if (fp?.message) {
          cur = fp.message;
          continue;
        }
      } catch {}
    }

    const next =
      cur.audioStickerMessage?.message ||
      cur.futureProofMessage?.message ||
      cur.ephemeralMessage?.message ||
      cur.viewOnceMessageV2Extension?.message ||
      cur.viewOnceMessageV2?.message ||
      cur.viewOnceMessage?.message ||
      cur.documentWithCaptionMessage?.message ||
      cur.editedMessage?.message;
    if (next) {
      cur = next;
      continue;
    }

    if (cur.message && typeof cur.message === 'object' && !cur.stickerMessage) {
      cur = cur.message;
      continue;
    }
    break;
  }
  return cur || {};
}

function isStickerMessageObj(obj) {
  if (!obj || typeof obj !== 'object') return false;
  return Boolean(
    obj.audioMessage ||
    obj.$unknowns ||
    obj.unknownFields ||
    obj.isAnimated !== undefined ||
    /webp/i.test(obj.mimetype || '') ||
    ((obj.mediaKey || obj.directPath || obj.url) && !obj.caption && !obj.ptt)
  );
}

function getAllStickerObjs(q, m = null) {
  const candidates = [
    q?.message,
    q?.fakeObj?.message,
    m?.msg?.contextInfo?.quotedMessage,
    q?.msg
  ].filter(Boolean);

  const found = [];
  for (const cand of candidates) {
    const raw = unwrapContainer(cand);
    if (raw.stickerMessage) found.push(raw.stickerMessage);
    else if (isStickerMessageObj(raw)) found.push(raw);
  }
  return found;
}

function extractEmbeddedAudio(node, m = null) {
  const stickerObjs = getAllStickerObjs(node, m);

  for (const stickerObj of stickerObjs) {
    if (stickerObj.audioMessage && typeof stickerObj.audioMessage === 'object') {
      return { decoded: stickerObj.audioMessage, rawBytes: null };
    }

    const audioBytes = extractFieldFromUnknowns(stickerObj.$unknowns || stickerObj.unknownFields, 26);
    if (audioBytes?.length) {
      try {
        const decoded = proto.Message.AudioMessage.decode(audioBytes);
        return { decoded, rawBytes: audioBytes };
      } catch {
        return { decoded: null, rawBytes: audioBytes };
      }
    }
  }

  return null;
}

function looksWebp(buffer) {
  return Buffer.isBuffer(buffer) &&
    buffer.length > 29 &&
    buffer.toString('latin1', 0, 4) === 'RIFF' &&
    buffer.toString('latin1', 8, 12) === 'WEBP';
}

function inspectWebp(buffer) {
  if (!looksWebp(buffer)) throw new Error('File bukan WebP yang valid.');
  switch (buffer.toString('latin1', 12, 16)) {
    case 'VP8 ':
      return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff, animated: false };
    case 'VP8L':
      return {
        width: 1 + (buffer[21] | ((buffer[22] & 0x3f) << 8)),
        height: 1 + ((buffer[22] >> 6) | (buffer[23] << 2) | ((buffer[24] & 0x0f) << 10)),
        animated: false
      };
    case 'VP8X':
      return {
        width: 1 + buffer.readUIntLE(24, 3),
        height: 1 + buffer.readUIntLE(27, 3),
        animated: (buffer[20] & 2) !== 0
      };
    default:
      return { width: 512, height: 512, animated: buffer.includes(Buffer.from('ANIM')) };
  }
}

async function deliverAudioStickerWithWm(conn, chat, origin, webpBuffer, packname, author, audioInfo) {
  const stamped = await addExif(webpBuffer, packname, author).catch(() => webpBuffer);
  const finalWebp = looksWebp(stamped) ? stamped : webpBuffer;
  const meta = inspectWebp(finalWebp);

  const bridge = conn._client;
  const visual = await bridge.message.upload(finalWebp, { type: 'image' });

  let soundMessageBytes = null;
  let updatedAudioInfo = audioInfo;

  if (audioInfo?.opusBytes?.length) {
    const uploadedSound = await bridge.message.upload(audioInfo.opusBytes, { type: 'audio' });
    const soundObj = {
      ...uploadedSound,
      mimetype: OPUS_MIME,
      ptt: true
    };
    soundMessageBytes = proto.Message.AudioMessage.encode(soundObj).finish();
    updatedAudioInfo = { decoded: soundObj, rawBytes: soundMessageBytes, opusBytes: audioInfo.opusBytes };
  } else if (audioInfo?.decoded) {
    const d = audioInfo.decoded;
    let opusBuf = null;

    try {
      const bytes = await bridge.message.downloadBytes({ audioMessage: d });
      if (bytes?.length) opusBuf = Buffer.from(bytes);
    } catch {}

    if (!opusBuf && typeof downloadMediaMessage === 'function') {
      try {
        const stream = await downloadMediaMessage({ audioMessage: d });
        const chunks = [];
        for await (const chunk of stream) chunks.push(chunk);
        if (chunks.length) opusBuf = Buffer.concat(chunks);
      } catch {}
    }

    if (opusBuf?.length) {
      const uploadedSound = await bridge.message.upload(opusBuf, { type: 'audio' });
      const soundObj = {
        ...uploadedSound,
        mimetype: d.mimetype || OPUS_MIME,
        seconds: d.seconds || undefined,
        ptt: true
      };
      soundMessageBytes = proto.Message.AudioMessage.encode(soundObj).finish();
      updatedAudioInfo = { decoded: soundObj, rawBytes: soundMessageBytes, opusBytes: opusBuf };
    } else if (audioInfo?.rawBytes?.length) {
      soundMessageBytes = audioInfo.rawBytes;
    }
  } else if (audioInfo?.rawBytes?.length) {
    soundMessageBytes = audioInfo.rawBytes;
  }

  if (!soundMessageBytes?.length) {
    throw new Error('Trek audio pada stiker gagal diekstrak.');
  }

  const sent = await conn.sendMessage(chat, {
    stickerMessage: {
      ...visual,
      mimetype: WEBP_MIME,
      width: meta.width,
      height: meta.height,
      isAnimated: meta.animated,
      $unknowns: [lengthDelimited(26, soundMessageBytes)]
    }
  }, { quoted: origin });

  saveSoundCache(sent, finalWebp, visual, updatedAudioInfo);
}

let handler = async (m, { conn, text, usedPrefix, command }) => {
  const q = m.quoted ? m.quoted : m;
  const mtype = q.mtype || '';
  const stickerObjs = getAllStickerObjs(q, m);
  const primarySticker = stickerObjs[0] || null;
  const mime = (q.msg || q).mimetype || (primarySticker || /sticker/i.test(mtype) ? WEBP_MIME : '');

  if (!text) throw `Format salah!\n\nContoh penggunaan:\n*${usedPrefix + command} Packname | Author*\n(Atau balas gambar/video/stiker)`;
  if (!mime) throw `Balas gambar/video/stiker dengan perintah ${usedPrefix + command}`;
  if (/video/g.test(mime) && (q.msg || q).seconds > 11) return m.reply('Maksimal 10 detik!');

  const parts = text.split(/[|•]/).map(v => v.trim());
  const packname = parts[0] || text;
  const author = parts[1] || '';
  const waitMsg = typeof wait !== 'undefined' ? wait : global.wait;
  if (waitMsg) await m.reply(waitMsg);

  try {
    let img = await q.download?.().catch(() => null);
    if ((!img || !img.length) && primarySticker && conn._client?.message?.downloadBytes) {
      const bytes = await conn._client.message.downloadBytes({ stickerMessage: primarySticker }).catch(() => null);
      if (bytes?.length) img = Buffer.from(bytes);
    }
    if (!img || !img.length) throw `Gagal mengunduh media, pastikan kamu membalas gambar/video/stiker.`;

    const embeddedAudio = extractEmbeddedAudio(q, m) || getSoundFromCache(q, m, img);

    if (embeddedAudio && looksWebp(img)) {
      await deliverAudioStickerWithWm(conn, m.chat, m, img, packname, author, embeddedAudio);
      return;
    }

    const isAnimated = (q.msg || q).isAnimated === true;

    if (isAnimated || /video|webp/g.test(mime)) {
      let videoBuffer = null;
      const apiKey = typeof dana !== 'undefined' ? dana : (global.dana || '');

      try {
        const mediaUrl = await uploadFile(img);
        const apiUrl = `https://api.danafxc.my.id/api/proxy/tools/convertwebp2mp4?apikey=${apiKey}&url=${encodeURIComponent(mediaUrl)}`;

        const response = await axios.get(apiUrl, {
          responseType: 'arraybuffer',
          timeout: 15000,
        });

        if (response && response.data) {
          videoBuffer = Buffer.from(response.data);
        }
      } catch (apiErr) {
        console.warn('⚠️ API Danafxc gagal/timeout untuk WM, beralih ke konversi lokal...', apiErr?.message || apiErr);
      }

      if (!videoBuffer || !videoBuffer.length) {
        try {
          videoBuffer = await stickerToMp4(img);
        } catch (localErr) {
          console.error('Konversi lokal stickerToMp4 gagal:', localErr);
        }
      }

      if (!videoBuffer || !videoBuffer.length) {
        throw 'Gagal mengubah media animasi menjadi video stiker.';
      }

      await conn.sendVideoAsSticker(m.chat, videoBuffer, m, {
        packname,
        author,
      });
    } else {
      await conn.sendImageAsSticker(m.chat, img, m, {
        packname,
        author,
      });
    }
  } catch (e) {
    console.error(e);
    throw e;
  }
};

handler.before = async function (m) {
  if (!m) return;
  const audioInfo = extractEmbeddedAudio(m, m);
  if (audioInfo) {
    const [stickerObj] = getAllStickerObjs(m, m);
    saveSoundCache(m, null, stickerObj, audioInfo);
  }
};

handler.help = ['wm', 'watermark'];
handler.tags = ['sticker'];
handler.command = /^wm|watermark?$/i;
handler.limit = true;

export default handler;