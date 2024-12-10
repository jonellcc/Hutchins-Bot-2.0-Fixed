module.exports = {
    name: "teach",
    usedBy: 0,
    dev: "Jonell",
    dmUser: false,
    info: "Teach the bot custom responses",
    onPrefix: false,
    cooldowns: 0,
    onLaunch: async function ({ api, event, target }) {
        const axios = require('axios');
        const input = target.join(" ");

        if (!input.includes("=>")) {
            return api.sendMessage(
                "Invalid format! Use the command like this:\n\nteach <question> => <response>",
                event.threadID,
                event.messageID
            );
        }

        const [ask, ans] = input.split("=>").map(item => item.trim());

        if (!ask || !ans) {
            return api.sendMessage("Both a question and an answer are required.", event.threadID, event.messageID);
        }

        try {
            const response = await axios.get(
                `https://joncll.serv00.net/sim/teach.php?ask=${encodeURIComponent(ask)}&ans=${encodeURIComponent(ans)}`
            );
            const data = response.data;

            if (data && data.ask && data.ans) {
                return api.sendMessage(
                    `Successfully taught the bot!\n\nQuestion: ${data.ask}\nAnswer: ${data.ans}`,
                    event.threadID,
                    event.messageID
                );
            } else {
                return api.sendMessage("Teaching failed. Please try again.", event.threadID, event.messageID);
            }
        } catch (error) {
            return api.sendMessage("An error occurred while trying to teach the bot.", event.threadID, event.messageID);
        }
    }
};
