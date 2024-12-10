module.exports = {
    name: "sim",
    nickName: ["bot"],
    usedBy: 0,
    dev: "Jonell Magallanes",
    info: "Simulates a conversation using the provided API",
    onPrefix: false,
    dmUser: false,
    cooldowns: 3,
    onLaunch: async function ({ api, event, target }) {
        const axios = require('axios');
        const query = target.join(" ");
        if (!query) {
            return api.sendMessage("Please provide a query to simulate.", event.threadID);
        }

        try {
            const response = await axios.get(`https://joncll.serv00.net/sim/sim.php?query=${encodeURIComponent(query)}`);
            const data = response.data;

            if (data && data.respond) {
                return api.sendMessage(data.respond, event.threadID, event.messageID);
            } else {
                return api.sendMessage("I can't understand what you're saying. Please turuan moko hahaha.", event.threadID, event.messageID);
            }
        } catch (error) {
            return api.sendMessage("An error occurred while trying to fetch a response.", event.threadID, event.messageID);
        }
    }
};
