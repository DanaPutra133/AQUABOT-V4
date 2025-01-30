async function aiBeta(message) {
    return new Promise(async (resolve,reject) => { 
        try {
            const params = {
                message: message,
                apikey: 'aqukin' //Ganti pake apikeymu
            };
            const { data } = await axios.post('https://api.betabotz.eu.org/api/search/openai-custom', params);
            resolve(data);
        } catch (error) {
            reject(error);
        };
    });
};

module.exports = { aiBeta };