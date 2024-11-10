const axios = require('axios');

const fontMapping = {
    'A': '𝗔', 'B': '𝗕', 'C': '𝗖', 'D': '𝗗', 'E': '𝗘', 'F': '𝗙', 'G': '𝗚',
    'H': '𝗛', 'I': '𝗜', 'J': '𝗝', 'K': '𝗞', 'L': '𝗟', 'M': '𝗠', 'N': '𝗡',
    'O': '𝗢', 'P': '𝗣', 'Q': '𝗤', 'R': '𝗥', 'S': '𝗦', 'T': '𝗧', 'U': '𝗨',
    'V': '𝗩', 'W': '𝗪', 'X': '𝗫', 'Y': '𝗬', 'Z': '𝗭',
    'a': '𝗮', 'b': '𝗯', 'c': '𝗰', 'd': '𝗱', 'e': '𝗲', 'f': '𝗳', 'g': '𝗴',
    'h': '𝗵', 'i': '𝗶', 'j': '𝗷', 'k': '𝗸', 'l': '𝗹', 'm': '𝗺', 'n': '𝗻',
    'o': '𝗼', 'p': '𝗽', 'q': '𝗾', 'r': '𝗿', 's': '𝘀', 't': '𝘁', 'u': '𝘂',
    'v': '𝘃', 'w': '𝘄', 'x': '𝘅', 'y': '𝘆', 'z': '𝘇'
};

function convertToBold(text) {
    return text.replace(/\*(.*?)\*/g, (match, p1) => {
        return [...p1].map(char => fontMapping[char] || char).join('');
    });
}

module.exports = {
    name: "ai",
    usedby: 0,
    dmUser: false,
    dev: "Jonell Magallanes",
    nickName: ["chatgpt", "gpt"],
    info: "EDUCATIONAL",
    onPrefix: true,
    cooldowns: 6,

    onReply: async function ({ reply, api, event }) {
        const { threadID, senderID } = event;

        const followUpApiUrl = `https://ccprojectapis.ddns.net/api/gpt4o?ask=${encodeURIComponent(reply)}&id=${senderID}`;
        api.setMessageReaction("⏱️", event.messageID, () => {}, true);

        try {
            const response = await axios.get(followUpApiUrl);
            const followUpResult = convertToBold(response.data.response);

            api.setMessageReaction("✅", event.messageID, () => {}, true);
            api.sendMessage(`${followUpResult}`, threadID, event.messageID);
        } catch (error) {
            console.error(error);
            api.sendMessage(error.message, threadID);
        }
    },

    onLaunch: async function ({ event, actions, target, api }) {
        const { messageID, threadID } = event;
        const id = event.senderID;

        if (!target[0]) return api.sendMessage("Please provide your question.\n\nExample: ai what is the solar system?", threadID, messageID);

        const apiUrl = `https://ccprojectapis.ddns.net/api/gpt4o?ask=${encodeURIComponent(target.join(" "))}&id=${id}`;
        const lad = await actions.reply("🔎 Searching for an answer. Please wait...", threadID, messageID);

        try {
            if (event.type === "message_reply" && event.messageReply.attachments && event.messageReply.attachments[0]) {
                const attachment = event.messageReply.attachments[0];

                if (attachment.type === "photo") {
                    const imageURL = attachment.url;
                    const geminiUrl = `https://ccprojectapis.ddns.net/api/gemini?ask=${encodeURIComponent(target.join(" "))}&imgurl=${encodeURIComponent(imageURL)}`;

                    const response = await axios.get(geminiUrl);
                    const vision = convertToBold(response.data.vision);

                    if (vision) {
                        return api.editMessage(`𝗚𝗲𝗺𝗶𝗻𝗶 𝗩𝗶𝘀𝗶𝗼𝗻 𝗜𝗺𝗮𝗴𝗲 𝗥𝗲𝗰𝗼𝗴𝗻𝗶𝘁𝗶𝗼𝗻\n━━━━━━━━━━━━━━━━━━\n${vision}\n━━━━━━━━━━━━━━━━━━\n`, lad.messageID, event.threadID, messageID);
                    } else {
                        return api.sendMessage("🤖 Failed to recognize the image.", threadID, messageID);
                    }
                }
            }

            const response = await axios.get(apiUrl);
            const result = convertToBold(response.data.response);

            const responseMessage = `${result}`;
            api.editMessage(responseMessage, lad.messageID, event.threadID, messageID);

            global.client.onReply.push({
                name: this.name,
                messageID: lad.messageID,
                author: event.senderID,
            });

        } catch (error) {
            console.error(error);
            api.sendMessage(`${error.message} just use ai2 command`, threadID, messageID);
        }
    }
};
