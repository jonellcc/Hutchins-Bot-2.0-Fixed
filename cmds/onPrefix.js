const fs = require('fs');
const path = require('path');

module.exports = {
    name: "onprefix",
    usedby: 0,
    dmUser: false,
    dev: "Jonell Magallanes",
    info: "Toggle onPrefix state of any command",
    cooldowns: 5,
    onPrefix: true,

    onLaunch: async function ({ api, event, target }) {
        const threadID = event.threadID;
        const commandName = target[1];
        const newState = target[0] === "true" ? true : false;

        if (commandName) {
            const filePath = path.join(__dirname, `${commandName}.js`);

            if (fs.existsSync(filePath)) {
                const confirmationMessage = `⚠️ 𝗖𝗼𝗻𝗳𝗶𝗿𝗺 𝗖𝗵𝗮𝗻𝗴𝗶𝗻𝗴 𝗼𝗻𝗣𝗿𝗲𝗳𝗶𝘅\n${global.line}\nDo you want to change the "onPrefix" state of "${commandName}" to ${newState}? React (👍) to confirm or (👎) to cancel.`;
                const sentMessage = await api.sendMessage(confirmationMessage, threadID);

                global.client.callReact.push({
                    name: this.name,
                    messageID: sentMessage.messageID,
                    commandName: commandName,
                    newState: newState,
                    action: 'toggleOnPrefix'
                });
            } else {
                await api.sendMessage(`❌ Command "${commandName}" does not exist.`, threadID);
            }
        } else {
            await api.sendMessage("Usage: -onPrefix [true|false] [command name]", threadID);
        }
    },

    callReact: async function ({ reaction, event, api }) {
        const { threadID, messageID } = event;
        const reactData = global.client.callReact.find(item => item.messageID === messageID);

        if (!reactData) return;

        const { commandName, newState, action, messageID: sentMessageID } = reactData;
        await api.unsendMessage(sentMessageID);

        if (reaction === '👍') {
            if (action === 'toggleOnPrefix') {
                const filePath = path.join(__dirname, `${commandName}.js`);

                if (fs.existsSync(filePath)) {
                    let commandFileContent = fs.readFileSync(filePath, 'utf-8');
                    commandFileContent = commandFileContent.replace(/onPrefix:\s*(true|false)/, `onPrefix: ${newState}`);

                    fs.writeFileSync(filePath, commandFileContent);
                    global.cc.reload[commandName];
 const bold = global.fonts.bold("Successfull onPrefix Changed");
                    await api.sendMessage(`${bold}\n${global.line}\n Successfully changed the "onPrefix" state of "${commandName}" to ${newState}.`, threadID);
                } else {
                    await api.sendMessage(`❌ Command "${commandName}" does not exist.`, threadID);
                }
            }
        } else if (reaction === '👎') {
            await api.sendMessage(`❌ Action to change "onPrefix" state for "${commandName}" has been canceled.`, threadID);
        }
    }
};
