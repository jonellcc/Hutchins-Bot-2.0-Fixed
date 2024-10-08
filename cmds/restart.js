const fs = require('fs');

module.exports = {
    name: "restart",
    usedby: 2,
    info: "Restarts the bot",
    onPrefix: true,
    cooldowns: 20,

    onLaunch: async function ({ api, event }) {
        const threadID = event.threadID;
        const confirmationMessage = `❓ 𝗖𝗼𝗻𝗳𝗶𝗿𝗺𝗮𝘁𝗶𝗼𝗻 𝗥𝗲𝘀𝘁𝗮𝗿𝘁\n${global.line}\nReact this Message (👍) to confirm restart the bot or react (👎) this message to abort the restart.`;

        console.log(`Restarting command from thread ${threadID}`);

        const data = {
            threadID: threadID
        };

        fs.writeFile('./database/threadID.json', JSON.stringify(data), (err) => {
            if (err) {
                console.error("Failed to save threadID:", err);
                return;
            }
            console.log("ThreadID saved to threadID.json");
        });

        const sentMessage = await api.sendMessage(confirmationMessage, threadID);
        global.client.callReact.push({ messageID: sentMessage.messageID, name: this.name });
    },

    callReact: async function ({ reaction, event, api }) {
        const { threadID } = event;

        if (reaction === '👍') {
            api.sendMessage("🔃 𝗥𝗲𝘀𝘁𝗮𝗿𝘁𝗶𝗻𝗴 𝗣𝗿𝗼𝗰𝗲𝘀𝘀\n━━━━━━━━━━━━━━━━━━\nBot is restarting...", threadID, (err) => {
                if (err) {
                    console.error("Failed to send restart message:", err);
                } else {
                    process.exit(1);
                }
            });
        } else if (reaction === '👎') {
            api.sendMessage("❌ 𝗥𝗲𝘀𝘁𝗮𝗿𝘁 𝗖𝗮𝗻𝗰𝗲𝗹𝗹𝗲𝗱", threadID);
        }
    }
};
