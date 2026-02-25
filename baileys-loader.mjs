export const loadBaileys = async () => {
    const baileys = await import('@adiwajshing/baileys');
    return {
        useMultiFileAuthState: baileys.useMultiFileAuthState,
        DisconnectReason: baileys.DisconnectReason,
        generateForwardMessageContent: baileys.generateForwardMessageContent,
        prepareWAMessageMedia: baileys.prepareWAMessageMedia,
        generateWAMessageFromContent: baileys.generateWAMessageFromContent,
        generateMessageID: baileys.generateMessageID,
        downloadContentFromMessage: baileys.downloadContentFromMessage,
        makeCacheableSignalKeyStore: baileys.makeCacheableSignalKeyStore,
        makeInMemoryStore: baileys.makeInMemoryStore,
        jidDecode: baileys.jidDecode,
        fetchLatestBaileysVersion: baileys.fetchLatestBaileysVersion,
        proto: baileys.proto,
        Browsers: baileys.Browsers,
        makeWASocket: baileys.default || baileys.makeWASocket
    };
};