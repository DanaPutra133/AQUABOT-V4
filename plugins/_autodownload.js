const { trimUndefined } = require('@adiwajshing/baileys');
let fetch = require('node-fetch')
const axios = require('axios');

let handler = m => m

const sleep = (ms) => {
	return new Promise(resolve => setTimeout(resolve, ms));
}

let old = new Date();
const _sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// DOWNLOADER TIKTOK
async function downloadTikTok(link, m) {
	try {
		if (global.db.data.users[m.sender].limit > 0) {
			const response = await fetch(`https://api.betabotz.eu.org/api/download/tiktok?url=${link}&apikey=${lann}`);
			global.db.data.users[m.sender].limit -= 1
			const data = await response.json();
			if (!data.result.video) {
				return;
			}
			if (data.result.video.length > 1) {
				for (let v of data.result.video) {
					await conn.sendFile(m.chat, v, null, `*Tiktok Downloader*`, m);
					await sleep(3000)
				}
			} else {
				await conn.sendMessage(m.chat, { video: { url: data.result.video[0] }, caption: `*Tiktok Downloader*` }, { mention: m })
			}
		}
		else {
			conn.reply(m.chat, 'limit kamu habis!', m);
		}
		return;
	} catch (error) {
		console.error('API pertama gagal:', error);
		try {
			const response = await fetch(`https://api.botcahx.eu.org/api/download/tiktok?url=${link}&apikey=${btc}`);
			const data = await response.json();
			if (!data.result.video) {
				return;
			}
			if (data.result.video.length > 1) {
				global.db.data.users[m.sender].limit -= 1;
				for (let v of data.result.video) {
					await conn.sendFile(m.chat, v, null, `🍟 *Fetching* : ${(new Date() - old) * 1} ms`, m);
					await _sleep(3000);
				}
			} else {
				await conn.sendMessage(
					m.chat,
					{
						video: {
							url: data.result.video[0],
						},
						caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms`,
					},
					{
						mention: m,
					}
				);
			}
		} catch (error) {
			console.error('API kedua gagal:', error);
		}
	}
}

// DOWNLOADER DOUYIN
async function downloadDouyin(link, m) {
	try {
		if (global.db.data.users[m.sender].limit > 0) {
			const response = await fetch(`https://api.betabotz.eu.org/api/download/douyin?url=${link}&apikey=${lann}`);
			const data = await response.json();
			if (!data.result.video) {
				return;
			}
			if (data.result.video.length > 1) {
				global.db.data.users[m.sender].limit -= 1
				for (let v of data.result.video) {
					await conn.sendFile(m.chat, v, null, `*Douyin Downloader*`, m);
					await sleep(3000)
				}
			} else {
				await conn.sendMessage(m.chat, { video: { url: data.result.video[0] }, caption: `*Douyin Downloader*` }, { mention: m })
			}
		}
		else {
			conn.reply(m.chat, 'limit kamu habis!', m);
		}
		return;
	} catch (error) {
		console.error('API pertama gagal:', error);
		try {
			let response = await fetch(`https://api.botcahx.eu.org/api/download/douyin?url=${link}&apikey=${btc}`);
			let data = await response.json();
			if (!data.result.video || data.result.video.length === 0) {
				response = await fetch(`https://api.botcahx.eu.org/api/download/douyinslide?url=${link}&apikey=${btc}`);
				data = await response.json();
				if (data.result.images && data.result.images.length > 0) {
					global.db.data.users[m.sender].limit -= 1;
					for (let img of data.result.images) {
						await conn.sendFile(m.chat, img, null, `🍟 *Fetching* : ${(new Date() - old) * 1} ms`, m);
						await _sleep(3000);
					}
					return;
				}
			}
			if (data.result.video && data.result.video.length > 0) {
				global.db.data.users[m.sender].limit -= 1;
				if (data.result.video.length > 1) {
					for (let v of data.result.video) {
						await conn.sendFile(m.chat, v, null, `🍟 *Fetching* : ${(new Date() - old) * 1} ms`, m);
						await _sleep(3000);
					}
				} else {
					await conn.sendMessage(
						m.chat,
						{
							video: {
								url: data.result.video[0],
							},
							caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms`,
						},
						{
							mention: m,
						}
					);
				}
			} else {
				conn.reply(m.chat, "Maaf, tidak dapat mengunduh konten!", m);
			}
		} catch (error) {
			console.error('API kedua gagal:', error);
		}
	}
}

// DOWNLOADER INSTAGRAM 
async function downloadInstagram(link, m) {
	try {
		if (global.db.data.users[m.sender].limit > 0) {
			const response = await fetch(`https://api.betabotz.eu.org/api/download/igdowloader?url=${link}&apikey=${lann}`);
			let message = await response.json()
			global.db.data.users[m.sender].limit -= 1
			for (let i of message.message) {
				conn.sendFile(m.chat, i._url, null, `*Instagram Downloader*`, m)
			}
		}
		else {
			conn.reply(m.chat, 'limit kamu habis!', m);
		}
	} catch (err) {
		console.error('API pertama gagal:', err);
		try {
			const response = await fetch(`https://api.botcahx.eu.org/api/dowloader/igdowloader?url=${link}&apikey=${btc}`);
			const res = await response.json();
			const limitnya = 3;
			for (let i = 0; i < Math.min(limitnya, res.result.length); i++) {
				await _sleep(3000);
				conn.sendFile(m.chat, res.result[i].url, null, `🍟 *Fetching* : ${(new Date() - old) * 1} ms`, m);
			}
			global.db.data.users[m.sender].limit -= 1;
		} catch (err) {
			console.error('API kedua gagal:', err);
		}
	}
}

// DOWNLOADER FACEBOOK 
async function downloadFacebook(link, m) {
	try {
		if (global.db.data.users[m.sender].limit > 0) {
			const response = await fetch(`https://api.betabotz.eu.org/api/download/fbdown?url=${link}&apikey=${lann}`);
			var js = await response.json()
			global.db.data.users[m.sender].limit -= 1
			conn.sendFile(m.chat, js.result[1]._url, 'fb.mp4', '', m);
		}
		else {
			conn.reply(m.chat, 'limit kamu habis!', m);
		}
	} catch (error) {
		console.error('API pertama gagal:', error);
		try {
			const response = await fetch(`https://api.botcahx.eu.org/api/dowloader/fbdown3?url=${link}&apikey=${btc}`);
			let json = await response.json();
			let urls = json.result.url.urls;
			if (Array.isArray(urls) && urls.some((url) => url.sd)) {
				global.db.data.users[m.sender].limit -= 1;
				let videoUrl = urls.find((url) => url.sd).sd;
				conn.sendFile(m.chat, videoUrl, "fb.mp4", `🍟 *Fetching* : ${(new Date() - old) * 1} ms`, m);
			} else {
				conn.reply(m.chat, "Gagal mendapatkan video", m);
			}
		} catch (error) {
			console.error('API kedua gagal:', error);
		}
	}
}

//youtube downloader
async function downloadyt(link, m) {
	try {
		if (global.db.data.users[m.sender].limit > 0) {
			const response = await axios.get(`https://api.betabotz.eu.org/api/download/ytmp4?url=${link}&apikey=${lann}`);
			const res = response.data.result;
			var { mp4, id, title, source, duration, mp3 } = res;
			let capt = `YT MP4*\n\n`;
			capt += `◦ *id* : ${id}\n`;
			capt += `◦ *tittle* : ${title}\n`;
			capt += `◦ *source* : ${source}\n`;
			capt += `◦ *duration* : ${duration}\n`;
			capt += `\n`;
			global.db.data.users[m.sender].limit -= 1
			await conn.sendMessage(m.chat, {
				document: { url: mp3 },
				mimetype: 'audio/mpeg',
				fileName: `${title}.mp3`,
			}, { quoted: m });
			await conn.sendFile(m.chat, mp4, null, capt, m);

		}
		else {
			conn.reply(m.chat, 'limit kamu habis!', m);
		}
		return;
	} catch (error) {
		console.error('API pertama gagal:', error);
		try {
			const response = await fetch(`https://api.botcahx.eu.org/api/dowloader/yt?url=${link}&apikey=${btc}`);
			const result = await response.json();
			if (result.status && result.result && result.result.mp4) {
				global.db.data.users[m.sender].limit -= 1;
				await conn.sendMessage(
					m.chat,
					{
						audio: {
							url: result.result.mp3,
						},
						mimetype: "audio/mpeg",
					},
					{
						quoted: m,
					}
				);
				await _sleep(1000);
				await conn.sendMessage(
					m.chat,
					{
						video: {
							url: result.result.mp4,
						},
						caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms`,
					},
					{
						quoted: m,
					}
				);
			} else {
				conn.reply(m.chat, "Gagal mendapatkan video", m);
			}
		} catch (error) {
			console.error('API kedua gagal:', error);
		}
	}
}

//pinterest downloader
async function downloadpin(link, m) {
	try {
		if (global.db.data.users[m.sender].limit > 0) {
			const response = await fetch(`https://api.betabotz.eu.org/api/download/pinterest?url=${link}&apikey=${lann}`);
			const res = await response.json();

			let { media_type, image, title, pin_url, video } = res.result.data;
			global.db.data.users[m.sender].limit -= 1
			if (media_type === 'video/mp4') {
				await conn.sendMessage(m.chat, {
					video: { url: video },
					caption: `*Title:* ${title || 'Tidak tersedia'}\n*Mediatype:* ${media_type}\n*Source Url:* ${pin_url}`
				});
			} else {
				await conn.sendMessage(m.chat, {
					image: { url: image },
					caption: `*Title:* ${title || 'Tidak tersedia'}\n*Mediatype:* ${media_type}\n*Source Url:* ${pin_url}`
				});
			}
		}
		else {
			conn.reply(m.chat, 'limit kamu habis!', m);
		}
		return;
	} catch (error) {
		console.error('API pertama gagal:', error);
		try {
			const api = await fetch(`https://api.botcahx.eu.org/api/download/pinterest?url=${link}&apikey=${btc}`);
			const res = await api.json();
			if (res.result && res.result.data) {
				let { media_type, image, title, video } = res.result.data;
				global.db.data.users[m.sender].limit -= 1;
				if (media_type === "video/mp4") {
					await conn.sendMessage(m.chat, {
						video: {
							url: video,
						},
						caption: `🍟 *Fetching* : ${(new Date() - old) * 1} ms`,
					});
				} else {
					await conn.sendFile(m.chat, image, "pindl.jpeg", `🍟 *Fetching* : ${(new Date() - old) * 1} ms`, m);
				}
			} else {
				conn.reply(m.chat, "Gagal mendapatkan media!", m);
			}
		} catch (error) {
			console.error('API kedua gagal:', error);
		}
	}
}

// DOWNLOADER SPOTIFY
async function _spotify(link, m) {
	try {
		if (global.db.data.users[m
			.sender].limit >
			0) {
			const res = await fetch(`https://api.betabotz.eu.org/api/download/spotify?url=${link}&apikey=${lann}`)
			global.db.data.users[m.sender].limit -= 1
			let jsons = await res.json()
			const {
				thumbnail,
				title,
				name,
				duration,
				url
			} = jsons.result.data
			const {
				id,
				type
			} = jsons.result.data.artist
			await conn.sendMessage(m.chat, {
				audio: { url: url }, mimetype: 'audio/mpeg', contextInfo: {
					externalAdReply: {
						title: title,
						body: "",
						thumbnailUrl: thumbnail,
						sourceUrl: url,
						mediaType: 1,
						showAdAttribution: true,
						renderLargerThumbnail: true
					}
				}
			}, { quoted: m })
		}
		else {
			conn.reply(m.chat,
				"Limit kamu habis!",
				m);
		}
	}
	catch (error) {
		console.error('API pertama gagal:', error);
		try {
			const res = await fetch(`https://api.botcahx.eu.org/api/download/spotify?url=${link}&apikey=${btc}`);
			const jsons = await res.json();
			if (jsons.result && jsons.result.data) {
				global.db.data.users[m.sender].limit -= 1;
				const { url: downloadUrl } = jsons.result.data;
				await conn.sendMessage(
					m.chat,
					{
						audio: {
							url: downloadUrl,
						},
						mimetype: "audio/mpeg",
					},
					{
						quoted: m,
					}
				);
			} else {
				conn.reply(m.chat, "Gagal mendapatkan media dari Spotify!", m);
			}
		} catch (error) {
			console.error('API kedua gagal:', error);
		}
	}
}

// DOWNLOADER TWITTER
async function _twitter(url, m) {
	try {
		if (global.db.data.users[m
			.sender].limit >
			0) {
			const api = await fetch(`https://api.betabotz.eu.org/api/download/twitter2?url=${link}&apikey=${lann}`);
			global.db.data.users[m.sender].limit -= 1
			const res = await api.json();
			const mediaURLs = res.result.mediaURLs;

			const capt = `*Username: ${res.result.user_name} ${res.result.user_screen_name}*\n*Title: ${res.result.text}*\n*Replies: ${res.result.replies}*\n*Retweet: ${res.result.retweets}*`;

			for (const url of mediaURLs) {
				const response = await fetch(url);
				const buffer = await response.buffer();
				await delay(3000)//3 detik jeda agar tidak spam
				conn.sendFile(m.chat, buffer, null, capt, m);
			}
			function delay(ms) {
				return new Promise(resolve => setTimeout(resolve, ms));
			}

		}
		else {
			conn.reply(m.chat,
				"Limit kamu habis!",
				m);
		}
	}
	catch (error) {
		console.error('API pertama gagal:', error);
		try {
			const api = await fetch(`https://api.botcahx.eu.org/api/download/twitter2?url=${url}&apikey=${btc}`);
			const res = await api.json();
			if (res.result && res.result.mediaURLs) {
				global.db.data.users[m.sender].limit -= 1;
				const mediaURLs = res.result.mediaURLs;
				for (const url of mediaURLs) {
					const response = await fetch(url);
					const buffer = await response.buffer();
					await _sleep(3000);
					conn.sendFile(m.chat, buffer, null, `🍟 *Fetching* : ${(new Date() - old) * 1} ms`, m);
				}
			} else {
				conn.reply(m.chat, "Gagal mendapatkan media dari Twitter!", m);
			}
		} catch (error) {
			console.error('API kedua gagal:', error);
		}
	}
}

// DOWNLOADER THREADS
async function _threads(url, m) {
	try {
		if (global.db.data.users[m.sender].limit > 0) {
			const api = await fetch(`https://api.betabotz.eu.org/api/download/threads?url=${link}&apikey=${lann}`).then(results => results.json());
			global.db.data.users[m
				.sender]
				.limit -= 1;
			const foto = api.result.image_urls[0] || null;
			const video = api.result.video_urls[0] || null;
			if (video) {
				try {
					conn.sendFile(m.chat, video.download_url, 'threads.mp4', '*THREADS DOWNLOADER*', m);
				} catch (e) {
					throw `Media video tidak ditemukan!`;
				}
			} else if (foto) {
				try {
					conn.sendFile(m.chat, foto, 'threads.jpeg', '*THREADS DOWNLOADER*', m);
				} catch (e) {
					throw `Media foto tidak ditemukan!`;
				}
			} else {
				throw `Konten tidak ditemukan!`;
			}

		}
		else {
			conn.reply(m.chat,
				"Limit kamu habis!",
				m);
		}
	}
	catch (error) {
		console.error(error);
	}
}
// DOWNLOADER CAPCUT
async function _capcut(link, m) {
	try {
		if (global.db.data.users[m
			.sender].limit >
			0) {
			const response = await fetch(`https://api.betabotz.eu.org/api/download/capcut?url=${link}&apikey=${lann}`);
			global.db.data.users[m.sender].limit -= 1
			if (!response.ok) {
				throw new Error(`HTTP error! Status: ${response.status}`);
			}

			const res = await response.json();
			const {
				video,
				title,
				owner
			} = res.result;

			await conn.sendFile(m.chat, video, 'capcut.mp4', `Title: ${title}\n\nProfile: ${owner}`, m);
		}
		else {
			conn.reply(m.chat,
				"Limit kamu habis!",
				m);
		}
	}
	catch (e) {
		console.error(e);
	}
}
// DOWNLOADER SNACKVIDEO
async function _snackvideo(url, m) {
	try {
		if (global.db.data.users[m
			.sender].limit >
			0) {
		}
		else {
			conn.reply(m.chat,
				"Limit kamu habis!",
				m);
		}
	}
	catch (e) {
		console.log(e);
	}
}

/**=========================================**/

handler.before = async function (m, { conn, isPrems }) {
	let chat = global.db.data.chats[m.chat];
	if (!chat.autodl) return; 

	if (!m.text) {
		return;
	}

	if (m.text.startsWith('=>') || m.text.startsWith('>') || m.text.startsWith('.') || m.text.startsWith('#') || m.text.startsWith('!') || m.text.startsWith('/') || m.text.startsWith('\/')) {
		return;
	}

	if (chat.isBanned) {
		return;
	}

	if (!m.text.includes('http')) {
		return;
	}

	let text = m.text.replace(/\n+/g, ' ');

	const tiktokRegex = /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.)?(?:tiktok\.com\/)(?:\S+)?$/i;
	const douyinRegex = /^(?:https?:\/\/)?(?:www\.|vt\.|vm\.|t\.|v\.)?(?:douyin\.com\/)(?:\S+)?$/i;
	const instagramRegex = /^(?:https?:\/\/)?(?:www\.)?(?:instagram\.com\/)(?:tv\/|p\/|reel\/)(?:\S+)?$/i;
	const facebookRegex = /^(?:https?:\/\/(web\.|www\.|m\.)?(facebook|fb)\.(com|watch)\S+)?$/i;
	const youtubeRegex = /^(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:watch\?v=|embed\/|v\/|shorts\/)|youtu\.be\/)([\w\-]{11})(?:\?[\S]*)?$/i;
	// const pinterestRegex = /^(?:https?:\/\/)?(?:[a-z]{2}\.)?pinterest\.com\/pin\/(\d+)\/?$/i;
	const pinterestRegex = /^(?:https?:\/\/)?(?:pin\.it)\/([a-zA-Z0-9]+)$/i;
	const spotifyRegex = /^(?:https?:\/\/)?(?:open\.spotify\.com\/track\/)([a-zA-Z0-9]+)(?:\S+)?$/i;
	const twitterRegex = /^(?:https?:\/\/)?(?:www\.)?(?:twitter\.com|x\.com)\/([A-Za-z0-9_]+)\/status\/(\d+)(?:\?[^#]*)?(?:#.*)?$/i;
	const threadsRegex = /^(https?:\/\/)?(www\.)?threads\.net(\/[^\s]*)?(\?[^\s]*)?$/;
	const capcutRegex = /^https:\/\/www\.capcut\.com\/(t\/[A-Za-z0-9_-]+\/?|template-detail\/\d+\?(?:[^=]+=[^&]+&?)+)$/;
	const snackvideoRegex = /^(https?:\/\/)?s\.snackvideo\.com\/p\/[a-zA-Z0-9]+$/i;
	// const teraboxRegex = /^(?:https?:\/\/)?(?:www\.)?terabox\.com\/s\/([\w\-]+)(?:\?[\S]*)?$/i;

	if (text.match(tiktokRegex)) {
		conn.sendMessage(m.chat, {
			react: {
				text: '✅',
				key: m.key,
			}
		})
		await downloadTikTok(text.match(tiktokRegex)[0], m);
	} else if (text.match(douyinRegex)) {
		conn.sendMessage(m.chat, {
			react: {
				text: '✅',
				key: m.key,
			}
		})
		await downloadDouyin(text.match(douyinRegex)[0], m);
	} else if (text.match(instagramRegex)) {
		conn.sendMessage(m.chat, {
			react: {
				text: '✅',
				key: m.key,
			}
		})
		await downloadInstagram(text.match(instagramRegex)[0], m);
	} else if (text.match(facebookRegex)) {
		conn.sendMessage(m.chat, {
			react: {
				text: '✅',
				key: m.key,
			}
		})
		await downloadFacebook(text.match(facebookRegex)[0], m);
	}
	else if (text.match(youtubeRegex)) {
		conn.sendMessage(m.chat, {
			react: {
				text: '✅',
				key: m.key,
			}
		})
		await downloadyt(text.match(youtubeRegex)[0], m);
	}
	else if (text.match(pinterestRegex)) {
		conn.sendMessage(m.chat, {
			react: {
				text: '✅',
				key: m.key,
			}
		})
		await downloadpin(text.match(pinterestRegex)[0], m);
	}
	// else if (text.match(teraboxRegex)) {
	// 	conn.sendMessage(m.chat, {
	// 		react: {
	// 			text: '✅',
	// 			key: m.key,
	// 		}
	// 	})
	// 	await downloadtera(text.match(teraboxRegex)[0], m);
	// }
	else if (text.match(
		spotifyRegex)) {
		conn.sendMessage(m
			.chat, {
			react: {
				text: "✅",
				key: m
					.key,
			},
		});
		await _spotify(text
			.match(
				spotifyRegex
			)[0], m);
	}
	else if (text.match(
		twitterRegex)) {
		conn.sendMessage(m
			.chat, {
			react: {
				text: "✅",
				key: m
					.key,
			},
		});
		await _twitter(text
			.match(
				twitterRegex
			)[0], m);
	}
	else if (text.match(
		threadsRegex)) {
		conn.sendMessage(m
			.chat, {
			react: {
				text: "✅",
				key: m
					.key,
			},
		});
		await _threads(text
			.match(
				threadsRegex
			)[0], m);
	}
	else if (text.match(
		capcutRegex)) {
		conn.sendMessage(m
			.chat, {
			react: {
				text: "✅",
				key: m
					.key,
			},
		});
		await _capcut(text
			.match(
				capcutRegex
			)[0], m);
	}
	else if (text.match(
		snackvideoRegex)) {
		conn.sendMessage(m
			.chat, {
			react: {
				text: "✅",
				key: m
					.key,
			},
		});
		await _snackvideo(text
			.match(
				snackvideoRegex
			)[0], m);
	}
	return !0;
}


module.exports = handler