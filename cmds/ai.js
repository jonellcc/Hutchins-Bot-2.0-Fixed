const axios = require('axios');

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

        const followUpApiUrl = `https://jonellprojectccapisexplorer.onrender.com/api/gptconvo?ask=${encodeURIComponent(reply)}&id=${senderID}`;
api.setMessageReaction("⏱️", event.messageID, () => {}, true);        try {
            const response = await axios.get(followUpApiUrl);
            const { response: followUpResult } = response.data;
 
           api.setMessageReaction("✅", event.messageID, () => {}, true);
    api.sendMessage(`𝗖𝗛𝗔𝗧𝗚𝗣𝗧\n━━━━━━━━━━━━━━━━━━\n ${followUpResult}\n━━━━━━━━━━━━━━━━━━`, threadID, event.messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage(error.message, threadID);
        }
    },

    onLaunch: async function ({ event, actions, target, api }) {
        const { messageID, threadID } = event;
        const id = event.senderID;

        if (!target[0]) return api.sendMessage("Please provide your question.\n\nExample: ai what is the solar system?", threadID, messageID);

        const apiUrl = `https://jonellprojectccapisexplorer.onrender.com/api/gptconvo?ask=${encodeURIComponent(target.join(" "))}&id=${id}`;

        const lad = await actions.reply("🔎 Searching for an answer. Please wait...", threadID, messageID);

        try {
            if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments[0]) {
                const attachment = event.messageReply.attachments[0];

                if (attachment.type === "photo") {
                    const imageURL = attachment.url;

                    const geminiUrl = `https://joncll.serv00.net/chat.php?ask=${encodeURIComponent(target.join(" "))}&imgurl=${encodeURIComponent(imageURL)}`;
                    const response = await axios.get(geminiUrl);
                    const { vision } = response.data;

                    if (vision) {
                        return api.editMessage(`𝗚𝗲𝗺𝗶𝗻𝗶 𝗩𝗶𝘀𝗶𝗼𝗻 𝗜𝗺𝗮𝗴𝗲 𝗥𝗲𝗰𝗼𝗴𝗻𝗶𝘁𝗶𝗼𝗻 \n━━━━━━━━━━━━━━━━━━\n${vision}\n━━━━━━━━━━━━━━━━━━\n`, lad.messageID, event.threadID, messageID);
                    } else {
                        return api.sendMessage("🤖 Failed to recognize the image.", threadID, messageID);
                    }
                }
            }

            const response = await axios.get(apiUrl);
            const { response: result } = response.data;

            const responseMessage = `𝗖𝗛𝗔𝗧𝗚𝗣𝗧\n━━━━━━━━━━━━━━━━━━\n${result}\n━━━━━━━━━━━━━━━━━━`;
            api.editMessage(responseMessage, lad.messageID, event.threadID, messageID);

            global.client.onReply.push({
                name: this.name,
                messageID: lad.messageID,
                author: event.senderID,
            });

        } catch (error) {
            console.error(error);
            api.sendMessage(error.message, threadID, messageID);
        }
    }
};