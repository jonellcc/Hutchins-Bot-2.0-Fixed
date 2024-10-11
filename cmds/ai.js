const axios = require('axios');

let apiState = {
    useBackupApi: false
};

module.exports = {
    name: "ai",
    usedby: 0,
    dmUser: false,
    dev: "Jonell Magallanes",
    nickName: ["chatgpt", "gpt"],
    info: "EDUCATIONAL",
    onPrefix: false,
    cooldowns: 6,

    onReply: async function ({ reply, api, event }) {
        const { threadID, senderID } = event;
        const mainApiUrl = `https://jonellprojectccapisexplorer.onrender.com/api/gptconvo?ask=${encodeURIComponent(reply)}&id=${senderID}`;
        const backupApiUrl = `https://gpt4o-hshs.onrender.com/gpt4o?ask=${encodeURIComponent(reply)}&id=${senderID}`;
        const apiUrl = apiState.useBackupApi ? backupApiUrl : mainApiUrl;

        api.setMessageReaction("⏱️", event.messageID, () => {}, true);

        try {
            const response = await axios.get(apiUrl);
            const { response: followUpResult } = response.data;

            api.setMessageReaction("✅", event.messageID, () => {}, true);
            api.sendMessage(`𝗖𝗛𝗔𝗧𝗚𝗣𝗧\n━━━━━━━━━━━━━━━━━━\n${followUpResult}\n━━━━━━━━━━━━━━━━━━`, threadID, event.messageID);

            if (apiState.useBackupApi && apiUrl === backupApiUrl) {
                apiState.useBackupApi = false;
            }
        } catch (error) {
            console.error(error);

            if (!apiState.useBackupApi) {
                apiState.useBackupApi = true;
                api.sendMessage("Main API failed, switching to backup API.", threadID, event.messageID);
                return this.onReply({ reply, api, event });
            } else {
                api.sendMessage("Both main and backup APIs failed. Please try again later.", threadID, event.messageID);
            }
        }
    },

    onLaunch: async function ({ event, actions, target, api }) {
        const { messageID, threadID } = event;
        const id = event.senderID;

        if (!target[0]) return api.sendMessage("Please provide your question.\n\nExample: ai what is the solar system?", threadID, messageID);

        const ask = encodeURIComponent(target.join(" "));
        const mainApiUrl = `https://jonellprojectccapisexplorer.onrender.com/api/gptconvo?ask=${ask}&id=${id}`;
        const backupApiUrl = `https://gpt4o-hshs.onrender.com/gpt4o?ask=${ask}&id=${id}`;
        const apiUrl = apiState.useBackupApi ? backupApiUrl : mainApiUrl;

        const lad = await actions.reply("🔎 Searching for an answer. Please wait...", threadID, messageID);

        try {
            const response = await axios.get(apiUrl);
            const { response: result } = response.data;
            const responseMessage = `𝗖𝗛𝗔𝗧𝗚𝗣𝗧\n━━━━━━━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━━━━━━━`;

            api.editMessage(responseMessage, lad.messageID, threadID, messageID);

            global.client.onReply.push({
                name: this.name,
                messageID: lad.messageID,
                author: event.senderID,
            });

            if (apiState.useBackupApi && apiUrl === backupApiUrl) {
                apiState.useBackupApi = false;
            }
        } catch (error) {
            console.error(error);

            if (!apiState.useBackupApi) {
                apiState.useBackupApi = true;
                api.editMessage("Main API failed, switching to backup API error of "+ error.message, lad.messageID, threadID, messageID);
                return this.onLaunch({ event, actions, target, api });
            } else {
                api.editMessage(`Both main and backup APIs failed error of ${error}. Please try again later.`, lad.messageID, threadID, messageID);
            }
        }
    }
};
                               
