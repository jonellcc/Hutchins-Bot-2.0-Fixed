const fs = require('fs');

module.exports = {
    name: "module",
    usedby: 2,
    info: "Install, uninstall, share, or reload command modules",
    dmUser: false,
    onPrefix: true,
    dev: "Jonell Magallanes",
    cooldowns: 5,

    onLaunch: async function ({ api, event, target }) {
        const threadID = event.threadID;
        const commandName = target[1];
        const commandCode = target.slice(2).join(' ');

        if (target[0] === "install" && commandName) {
            const confirmationMessage = `⚠️ 𝗖𝗼𝗻𝗳𝗶𝗿𝗺 𝗠𝗼𝗱𝘂𝗹𝗲 𝗜𝗻𝘀𝘁𝗮𝗹𝗹\n${global.line}\nDo you want to install the command "${commandName}" with the provided code? React (👍) to confirm or (👎) to abort.`;
            const sentMessage = await api.sendMessage(confirmationMessage, threadID, event.messageID);

            global.client.callReact.push({
                name: this.name,
                messageID: sentMessage.messageID,
                commandName: commandName,
                action: 'install',
                commandCode: commandCode
            });
        } else if (target[0] === "uninstall" && commandName) {
            const filePath = `./cmds/${commandName}.js`;

            if (fs.existsSync(filePath)) {
                const confirmationMessage = `⚠️ 𝗖𝗼𝗻𝗳𝗶𝗿𝗺 𝗨𝗻𝗶𝗻𝘀𝘁𝗮𝗹𝗹\n${global.line}\nDo you want to uninstall the command "${commandName}"? React (👍) to confirm or (👎) to abort.`;
                const sentMessage = await api.sendMessage(confirmationMessage, threadID, event.messageID);

                global.client.callReact.push({
                    name: this.name,
                    messageID: sentMessage.messageID,
                    commandName: commandName,
                    action: 'uninstall'
                });
            } else {
                await api.sendMessage(`❌ Command ${commandName} does not exist.`, threadID);
            }
        } else if (target[0] === "share" && commandName) {
            const filePath = `./cmds/${commandName}.js`;

            if (fs.existsSync(filePath)) {
                const commandCode = fs.readFileSync(filePath, 'utf-8');
                const shareMessage = await api.sendMessage("Extracting command code...", threadID);
                await api.editMessage(`${commandName}.js\n\n${commandCode}`, shareMessage.messageID, threadID);
            } else {
                await api.sendMessage(`❌ Command ${commandName} does not exist.`, threadID);
            }
        } else if (target[0] === "reload" && commandName) {
            const reloadStatus = global.cc.reload[commandName];

            if (reloadStatus) {
                await api.sendMessage(`✅ 𝗠𝗼𝗱𝘂𝗹𝗲 𝗜𝗻𝘀𝘁𝗮𝗹𝗹𝗲𝗱\n${global.line}\nCommand "${commandName}" has been reloaded successfully.`, threadID, event.messageID);
            } else {
                await api.sendMessage(`❌ Failed to reload command "${commandName}".`, threadID);
            }
        } else {
            await api.sendMessage("Usage: -module [install|uninstall|share|reload] [command name] [optional: command code]", threadID);
        }
    },

    callReact: async function ({ reaction, event, api }) {
        const { threadID, messageID } = event;
        const reactData = global.client.callReact.find(item => item.messageID === messageID);

        if (!reactData) return;

        const { commandName, action, commandCode, messageID: sentMessageID } = reactData;
        await api.unsendMessage(sentMessageID);

        if (reaction === '👍') {
            if (action === 'install') {
                const checkMessage = await api.sendMessage(`🔍 Verifying command....`, threadID);
                await new Promise(resolve => setTimeout(resolve, 5000));

                try {
                    new Function(commandCode); 
                    const filePath = `./cmds/${commandName}.js`;
                    fs.writeFileSync(filePath, commandCode);
                    await api.editMessage(`✅ 𝗠𝗼𝗱𝘂𝗹𝗲 𝗜𝗻𝘀𝘁𝗮𝗹𝗹𝗲𝗱\n${global.line}\nCommand "${commandName}" has been installed successfully.`, checkMessage.messageID, threadID, event.messageID);
                    global.cc.reload[commandName];
                } catch (error) {
                    await api.editMessage(`❌ Failed to install command. Error: ${error.message}`, checkMessage.messageID, threadID);
                }
            } else if (action === 'uninstall') {
                const filePath = `./cmds/${commandName}.js`;

                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath);
                    await api.sendMessage(`✅ 𝗠𝗼𝗱𝘂𝗹𝗲 𝗨𝗻𝗶𝗻𝘀𝘁𝗮𝗹𝗹𝗲𝗱\n${global.line}\nCommand "${commandName}" has been uninstalled successfully.`, threadID, event.messageID);
                } else {
                    await api.sendMessage(`❌ Command "${commandName}" does not exist.`, threadID);
                }
            }
        } else if (reaction === '👎') {
            await api.sendMessage(`❌ 𝗠𝗼𝗱𝘂𝗹𝗲𝘀 𝗖𝗮𝗻𝗰𝗲𝗹𝗹𝗲𝗱\n${global.line}\nAction for command "${commandName}" has been canceled.`, threadID, event.messageID);
        }
    }
};
