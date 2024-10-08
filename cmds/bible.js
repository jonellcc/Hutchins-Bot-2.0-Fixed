const axios = require('axios');

module.exports = {
    name: "bible",
    usedby: 0,
    info: "Get a random Bible verse",
    onPrefix: true,
    dev: "Jonell Magallanes",
    cooldowns: 3,
    dmUser: false,

    onLaunch: async function ({ api, event, actions }) {
        const lod = actions.reply("Loading......")
        try {
            const response = await axios.get('https://jonellprojectccapisexplorer.onrender.com/api/randomverse');
            const { reference, text } = response.data;
 const bold = global.fonts.bold("📖 Random Bible Verse")
            return api.editMessage(`${bold}\n${global.line}\nVerse Reference: ${reference}\nVerse Text: ${text}`, lod.messageID, event.threadID, event.messageID);
        } catch (error) {
            console.error("Error fetching Bible verse:", error);
            return api.editMessage(error.message, lod.messageID, event.threadID);
        }
    }
};
