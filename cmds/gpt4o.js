const axios = require('axios');

module.exports = {
    name: "gpt4o",
    usedby: 0,
    dev: "Jonell Magallanes",
    info: "EDUCATIONAL",
    onPrefix: false,
    dmUser: false, 
    nickName: ["4o"],
    cooldowns: 6,

    onReply: async function ({ reply, api, event }) {
        const { threadID } = event;
        const followUpApiUrl = `https://gpt4o-hshs.onrender.com/gpt4o?ask=${encodeURIComponent(reply)}&id=${event.senderID}`;
        api.setMessageReaction("⏱️", event.messageID, () => {}, true);

        try {
            const response = await axios.get(followUpApiUrl);
            if (response.data.status) {
                const followUpResult = response.data.response;
                api.setMessageReaction("✅", event.messageID, () => {}, true);
                api.sendMessage(`${bold}\n━━━━━━━━━━━━━━━━━━\n${followUpResult}\n━━━━━━━━━━━━━━━━━━`, threadID);
            } else {
                api.setMessageReaction("❌", event.messageID, () => {}, true);
                api.sendMessage("Failed to get a valid response from the AI.", threadID);
            }
        } catch (error) {
            console.error(error);
            api.sendMessage(error.message, threadID);
        }
    },

    onLaunch: async function ({ event, target, api }) {
        const { messageID, threadID } = event;
        const id = event.senderID;

        if (!target[0]) return api.sendMessage("Please provide your question.\n\nExample: gpt4o what is the solar system?", threadID, messageID);

        const ask = target.join(" ");
        const apiUrl = `https://gpt4o-hshs.onrender.com/gpt4o?ask=${encodeURIComponent(ask)}&id=${id}`;
        const haha = await api.sendMessage("🔎 Searching for an answer. Please wait...", threadID, messageID);

        try {
            const response = await axios.get(apiUrl);
            if (response.data.status) {
                const bold = global.fonts.bold("GPT4o AI")
                const result = response.data.response;
                api.editMessage(`${bold}\n━━━━━━━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━━━━━━━`, haha.messageID, threadID, event.messageID);

                global.client.onReply.push({
                    name: this.name,
                    messageID: messageID,
                    author: event.senderID,
                });
            } else {
                api.editMessage(error.message, haha.messageID, threadID, messageID);
            }
        } catch (error) {
            console.error(error);
            api.editMessage(error.message, haha.messageID, threadID, messageID);
        }
    }
};
          
