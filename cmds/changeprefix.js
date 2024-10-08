const fs = require('fs');

module.exports = {
    name: "changeprefix",
    usedby: 4,
    info: "Changes the bot command prefix",
    dev: "Jonell Magallanes",
    usages: "changeprefix <new prefix>",
    onPrefix: true,
    cooldowns: 20,

    onLaunch: async function ({ api, event, target }) {
        const threadID = event.threadID;
        const newPrefix = target.join(" ").trim();

        if (!newPrefix) {
            return api.sendMessage("Please provide a new prefix. Usage: -changeprefix [newPrefix]", threadID);
        }

        const confirmationMessage = `❓ 𝗖𝗵𝗮𝗻𝗴𝗲 𝗣𝗿𝗲𝗳𝗶𝘅 𝗖𝗼𝗻𝗳𝗶𝗿𝗺𝗮𝘁𝗶𝗼𝗻\n${global.line}\nReact to this message (👍) to confirm the prefix change to '${newPrefix}' or react (👎) to cancel.`;

        const threadIDPath = './database/prefix/threadID.json';
        const data = { threadID: threadID };

        fs.writeFile(threadIDPath, JSON.stringify(data, null, 2), (err) => {
            if (err) {
                console.error("Failed to save threadID:", err);
            }
        });

        const sentMessage = await api.sendMessage(confirmationMessage, threadID);

        global.client.callReact.push({
            name: this.name,
            messageID: sentMessage.messageID,
            newPrefix: newPrefix
        });
    },

    callReact: async function ({ reaction, event, api }) {
        const { threadID, messageID } = event;
        const reactData = global.client.callReact.find(item => item.messageID === messageID);

        if (!reactData) return;

        const adminConfigPath = "./admin.json";

        if (reaction === '👍') {
            try {
                const adminConfig = JSON.parse(fs.readFileSync(adminConfigPath, 'utf8'));
                adminConfig.prefix = reactData.newPrefix;

                fs.writeFile(adminConfigPath, JSON.stringify(adminConfig, null, 2), (err) => {
                    if (err) {
                        return api.sendMessage("Failed to save new prefix, please try again.", threadID);
                    }

                    api.sendMessage(`🔄 𝗖𝗵𝗮𝗻𝗴𝗶𝗻𝗴 𝗣𝗿𝗲𝗳𝗶𝘅 𝘁𝗼 '${reactData.newPrefix}'\n${global.line}\nPlease wait...`, threadID, () => {
                        api.unsendMessage(messageID);
                        setTimeout(() => process.exit(1), 2000);
                    });
                });
            } catch (err) {
                api.sendMessage("Failed to change prefix, please try again.", threadID);
            }
        } else if (reaction === '👎') {
            api.sendMessage("❌ 𝗣𝗿𝗲𝗳𝗶𝘅 𝗖𝗵𝗮𝗻𝗴𝗲 𝗖𝗮𝗻𝗰𝗲𝗹𝗹𝗲𝗱", threadID, () => {
                api.unsendMessage(messageID); 
            });
        }

        global.client.callReact = global.client.callReact.filter(item => item.messageID !== messageID);
    }
};
