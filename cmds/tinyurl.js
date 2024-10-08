const axios = require('axios');

module.exports = {
    name: "tinyurl",
    usedby: 0,
    info: "Get a shortened URL using the TinyURL API",
    onPrefix: true,
    dev: "Jonell Magallanes",
    cooldowns: 3,
    dmUser: false,

    onLaunch: async function ({ api, event, target }) {
        const url = target.join(" ");

        try {
            const response = await axios.get(`https://jonellprojectccapisexplorer.onrender.com/api/tinyurl?url=${url}`);
            bold = global.fonts.bold("TinyUrl Shorter Url");
            const { originalUrl, shortenedUrl } = response.data;

            return api.sendMessage(`${bold}\n${global.line}\nOriginal URL: ${originalUrl}\nShortened URL: ${shortenedUrl}`, event.threadID);
        } catch (error) {
            console.error("Error fetching shortened URL:", error);
            return api.sendMessage(error.messageID, event.threadID);
        }
    }
};
