const axios = require('axios');

module.exports = {
    name: "ai2",
    usedby: 0,
    dev: "Jonell Magallanes",
    info: "EDUCATIONAL",
    onPrefix: false,
    cooldowns: 6,

    onReply: async function ({ reply, api, event }) {
        const { threadID } = event;
        const followUpApiUrl = `https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(reply)}`;
        api.setMessageReaction("⏱️", event.messageID, () => {}, true);        
        try {
            const response = await axios.get(followUpApiUrl);
            const followUpResult = response.data.reply;
            api.setMessageReaction("✅", event.messageID, () => {}, true);
            api.sendMessage(`𝗔𝗜 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲\n━━━━━━━━━━━━━━━━━━\n${followUpResult}\n━━━━━━━━━━━━━━━━━━`, threadID);
        } catch (error) {
            console.error(error);
            api.sendMessage(error.message, threadID);
        }
    },

    onLaunch: async function ({ event, target, api }) {
        const { messageID, threadID } = event;
        const id = event.senderID;

        if (!target[0]) return api.sendMessage("Please provide your question.\n\nExample: ai what is the solar system?", threadID, messageID);

        const apiUrl = `https://hercai.onrender.com/v3/hercai?question=${encodeURIComponent(target.join(" "))}`;
       const haha = await api.sendMessage("🔎 Searching for an answer. Please wait...", threadID, messageID);

        try {
            const response = await axios.get(apiUrl);
            const result = response.data.reply;
            api.editMessage(`𝗔𝗜 𝗥𝗲𝘀𝗽𝗼𝗻𝘀𝗲\n━━━━━━━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━━━━━━━`, haha.messageID, threadID, event.messageID);

            global.client.onReply.push({
                name: this.name,
                messageID: messageID,
                author: event.senderID,
            });

        } catch (error) {
            console.error(error);
            api.editMessage(error.message, haha.messageID, threadID, messageID);
        }
    }
};
