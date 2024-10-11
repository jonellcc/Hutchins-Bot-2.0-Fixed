const axios = require('axios');

module.exports = {
    name: "wiki",
    usedby: 0,
    dmUser: false,
    dev: "Jonell Magallanes",
    info: "EDUCATIONAL",
    onPrefix: false,
    dmUser: false,
    nickName: ["wp"],
    cooldowns: 6,

    onLaunch: async function ({ event, actions, target, api }) {
        const { messageID, threadID } = event;

        if (!target[0]) return api.sendMessage("Please provide a topic to search for.\n\nExample: wiki Biology", threadID, messageID);

        const query = encodeURIComponent(target.join(" "));
        const apiUrl = `https://ccexplorerapisjonell.vercel.app/api/wiki?q=${query}`;

        const lad = await actions.reply("🔎 Searching for an answer. Please wait...", threadID, messageID);

        try {
            const response = await axios.get(apiUrl);
            const { type, title, extract } = response.data;
const bold = global.fonts.bold("🔎 Wikipedia Search")
            const responseMessage = `${bold}\n━━━━━━━━━━━━━━━━━━\n📫 Type: ${type}\n📝 Title: ${title}\n📖 Context:\n${extract}\n━━━━━━━━━━━━━━━━━━`;
            api.editMessage(responseMessage, lad.messageID, threadID, messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage(error.message, lad.messageID, threadID);
        }
    }
};
