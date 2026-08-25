import fetch from "node-fetch";
import FormData from "form-data";
import { fileTypeFromBuffer as fromBuffer } from "file-type";

/**
 * Upload file to api.betabotz.eu.org
 * @param {Buffer} buffer File Buffer
 * @param {String} originalName Original filename (opsional)
 * @returns {Promise<string>} URL hasil upload
 */
const betabotzApi = async (buffer, originalName = "file") => {
  let { ext } = (await fromBuffer(buffer)) || {};
  if (!ext && originalName.includes(".")) {
    ext = originalName.split(".").pop();
  }
  ext = ext || "bin";

  let bodyForm = new FormData();
  bodyForm.append("file", buffer, `${originalName}.${ext}`);

  let apikey = global.lann || "";
  let uploadUrl = `https://api.betabotz.eu.org/api/tools/upload?apikey=${apikey}`;

  let res = await fetch(uploadUrl, {
    method: "post",
    body: bodyForm,
    headers: bodyForm.getHeaders()
  });

  let data = await res.json();
  
  let resultUrl = data.result ? (typeof data.result === 'string' ? data.result : data.result.url) : '';
  
  if (!resultUrl) {
    throw new Error(data?.message || "Gagal mendapatkan URL dari server Betabotz");
  }
  
  return resultUrl;
};

/**
 * Cadangan: Upload file ke https://catbox.moe jika Betabotz sedang gangguan
 */
const catbox = async (buffer) => {
  const { ext } = await fromBuffer(buffer) || {};
  if (!ext) throw new Error('File type not recognized');
  const form = new FormData();
  form.append('reqtype', 'fileupload');
  form.append('fileToUpload', buffer, `file.${ext}`);
  
  let res = await fetch('https://catbox.moe/user/api.php', {
    method: 'POST',
    body: form,
    headers: form.getHeaders()
  });
  return await res.text();
};

export default async function (inp) {
  if (!Buffer.isBuffer(inp)) {
    throw new Error("Input uploader harus berupa Buffer!");
  }

  let err = false;
  for (const upload of [betabotzApi, catbox]) {
    try {
      let url = await upload(inp);
      if (url && typeof url === 'string' && url.startsWith('http')) {
        return url;
      }
    } catch (e) {
      err = e;
    }
  }
  if (err) throw err;
};